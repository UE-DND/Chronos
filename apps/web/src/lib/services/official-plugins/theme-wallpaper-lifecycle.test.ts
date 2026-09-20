import { describe, expect, it, vi } from 'vite-plus/test';
import type { ChronosEngine, PluginManifest } from '@chronos/core';
import type { ImageRepository } from '$lib/storage/image-repository';
import { OfficialPluginService } from './official-plugin-service';
import { OfficialPluginInstalledStore } from './installed-store';
import type { OfficialPluginAssetPipeline } from './asset-pipeline';
import type { OfficialPluginRuntimeActivator } from './runtime-activator';
import type { OfficialPluginCatalogClient } from './catalog-client';

const manifest = {
	id: 'theme-image',
	version: '1.0.0',
	type: 'theme',
	bundleFormat: 'esm',
	colorsUrl: 'https://theme.test/colors.json',
	colorsSha256: 'a'.repeat(64)
} as PluginManifest;

async function setup() {
	const persist = vi.fn().mockResolvedValue(undefined);
	const engine = {
		storage: { setPluginData: persist, clearPluginData: vi.fn() },
		notify: vi.fn()
	} as unknown as ChronosEngine;
	const store = new OfficialPluginInstalledStore(engine);
	const previous = { manifest, enabled: true, installedAt: 1, wallpaperAssetId: 'old-image' };
	await store.upsert(previous);
	const blobs = new Map<string, Blob>([
		['old-image', new Blob(['old'])],
		['custom-wallpaper', new Blob(['user'])]
	]);
	const images = {
		put: vi.fn(async (id: string, blob: Blob) => {
			blobs.set(id, blob);
		}),
		delete: vi.fn(async (id: string) => {
			blobs.delete(id);
		})
	};
	const nextBlob = new Blob(['new']);
	const download = vi.fn().mockResolvedValue({ colorsJson: '{}', wallpaper: nextBlob });
	const runtime = {
		isActive: () => true,
		activate: vi.fn().mockResolvedValue(undefined),
		deactivate: vi.fn().mockResolvedValue(undefined)
	};
	const service = new OfficialPluginService(engine, {
		installedStore: store,
		images: images as unknown as ImageRepository,
		runtimeActivator: runtime as unknown as OfficialPluginRuntimeActivator,
		assetPipeline: { download } as unknown as OfficialPluginAssetPipeline,
		catalogClient: {} as OfficialPluginCatalogClient
	});
	return { service, store, previous, blobs, images, nextBlob, runtime, persist, download };
}
describe('theme image replacement lifecycle', () => {
	it('keeps old resources until persistence succeeds, then retires only the old theme image', async () => {
		const { service, store, blobs, nextBlob, runtime } = await setup();
		await service.install(manifest);
		const next = store.find(manifest.id)!;
		expect(blobs.get(next.wallpaperAssetId!)).toBe(nextBlob);
		expect(blobs.has('old-image')).toBe(false);
		expect(blobs.has('custom-wallpaper')).toBe(true);
		expect(runtime.deactivate).toHaveBeenCalledWith(manifest.id, { revertThemes: false });
		expect(JSON.stringify(next)).not.toContain('blob');
		await service.disable(manifest.id);
		expect(blobs.has(next.wallpaperAssetId!)).toBe(true);
		await service.uninstall(manifest.id);
		expect([...blobs.keys()]).toEqual(['custom-wallpaper']);
	});
	it.each(['activation', 'persistence', 'download'])(
		'preserves the old theme and image on %s failure',
		async (failure) => {
			const { service, store, previous, blobs, runtime, persist, download } = await setup();
			if (failure === 'activation') runtime.activate.mockRejectedValueOnce(new Error('activation'));
			if (failure === 'persistence') persist.mockRejectedValueOnce(new Error('persistence'));
			if (failure === 'download') download.mockRejectedValueOnce(new Error('download'));
			await expect(service.install(manifest)).rejects.toThrow(failure);
			expect(store.find(manifest.id)).toEqual(previous);
			expect([...blobs.keys()]).toEqual(['old-image', 'custom-wallpaper']);
			if (failure !== 'download') expect(runtime.activate).toHaveBeenLastCalledWith(previous);
		}
	);
});
