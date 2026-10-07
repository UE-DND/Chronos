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
	let state: unknown = null;
	const persist = vi.fn(async (_pluginId: string, _key: string, value: unknown) => {
		state = structuredClone(value);
	});
	const engine = {
		storage: {
			getPluginData: async () => structuredClone(state),
			setPluginData: persist,
			clearPluginData: vi.fn()
		},
		notify: vi.fn(),
		assertPluginRemovable: vi.fn()
	} as unknown as ChronosEngine;
	const store = new OfficialPluginInstalledStore(engine);
	const initial = {
		manifest,
		origin: { kind: 'user' as const },
		installedAt: 1,
		wallpaperAssetId: 'old-image'
	};
	await store.upsert(initial);
	const previous = store.find(manifest.id)!;
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
	let active = true;
	const runtime = {
		isActive: () => active,
		activate: vi.fn(async () => {
			active = true;
		}),
		deactivate: vi.fn(async () => {
			active = false;
		})
	};
	const service = new OfficialPluginService(engine, {
		installedStore: store,
		images: images as unknown as ImageRepository,
		runtimeActivator: runtime as unknown as OfficialPluginRuntimeActivator,
		assetPipeline: { download } as unknown as OfficialPluginAssetPipeline,
		catalogClient: {} as OfficialPluginCatalogClient
	});
	return { engine, service, store, previous, blobs, images, nextBlob, runtime, persist, download };
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
		expect(blobs.has(next.wallpaperAssetId!)).toBe(true);
		await service.uninstall(manifest.id);
		expect([...blobs.keys()]).toEqual(['custom-wallpaper']);
	});
	it.each([
		{ stage: 'wallpaper', reinstall: false },
		{ stage: 'wallpaper', reinstall: true },
		{ stage: 'activation', reinstall: false },
		{ stage: 'activation', reinstall: true }
	])(
		'rejects a stale install after another window removes it during $stage (reinstall=$reinstall)',
		async ({ stage, reinstall }) => {
			const { engine, service, store, previous, blobs, images, runtime } = await setup();
			const other = new OfficialPluginInstalledStore(engine);
			const started = Promise.withResolvers<void>();
			const release = Promise.withResolvers<void>();
			if (stage === 'wallpaper') {
				const put = images.put.getMockImplementation()!;
				images.put.mockImplementationOnce(async (id, blob) => {
					started.resolve();
					await release.promise;
					await put(id, blob);
				});
			} else {
				const activate = runtime.activate.getMockImplementation()!;
				runtime.activate.mockImplementationOnce(async () => {
					await activate();
					started.resolve();
					await release.promise;
				});
			}
			const installing = service.install(manifest);
			const rejected = expect(installing).rejects.toThrow('Plugin changed');
			await started.promise;
			try {
				await other.remove(manifest.id);
				blobs.delete('old-image');
				if (reinstall) {
					blobs.set('replacement-image', new Blob(['replacement']));
					await other.upsert({
						...previous,
						manifest: { ...manifest, version: '2.0.0' },
						wallpaperAssetId: 'replacement-image'
					});
				}
				await store.load();
				store.notify();
			} finally {
				release.resolve();
			}
			await rejected;
			await store.load();
			expect(store.find(manifest.id)).toEqual(other.find(manifest.id));
			expect([...blobs.keys()]).toEqual(
				reinstall ? ['custom-wallpaper', 'replacement-image'] : ['custom-wallpaper']
			);
			if (stage === 'activation') expect(runtime.isActive()).toBe(false);
		}
	);

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
