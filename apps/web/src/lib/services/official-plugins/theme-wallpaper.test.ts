import { afterEach, describe, expect, it, vi } from 'vite-plus/test';
import type { ChronosEngine, HttpResponse, PluginManifest } from '@chronos/core';
import type { ImageRepository } from '$lib/storage/image-repository';
import { OfficialPluginAssetPipeline } from './asset-pipeline';
import { OfficialPluginRuntimeActivator } from './runtime-activator';
const hash = 'a'.repeat(64);
const colors = JSON.stringify({
	id: 'image-theme',
	name: 'Image',
	variants: { light: { colors: {} }, dark: { colors: {} } },
	wallpaper: { url: './image.png', sha256: hash }
});
afterEach(() => vi.unstubAllGlobals());
function setup() {
	const request = vi
		.fn()
		.mockResolvedValue({ ok: true, bytes: async () => new Uint8Array([1, 2, 3]) });
	const sha256 = vi.fn().mockResolvedValue(hash);
	const decode = vi.fn().mockResolvedValue(undefined);
	vi.stubGlobal(
		'Image',
		class {
			naturalWidth = 1;
			naturalHeight = 1;
			decode = decode;
		}
	);
	const revoke = vi.fn();
	vi.stubGlobal(
		'URL',
		class extends URL {
			static createObjectURL() {
				return 'blob:validate';
			}
			static revokeObjectURL = revoke;
		}
	);
	const pipeline = new OfficialPluginAssetPipeline({
		http: { request },
		runtime: { sha256 }
	} as unknown as ChronosEngine);
	return { pipeline, request, sha256, decode, revoke };
}
describe('theme wallpaper assets', () => {
	it('reports wallpaper body reads as downloading and keeps overall progress monotonic', async () => {
		const { pipeline, request, sha256, decode } = setup();
		const progress: { stage: string; percent: number; label?: string }[] = [];
		request.mockResolvedValueOnce({ ok: true, text: async () => colors });
		request.mockResolvedValueOnce({ ok: true, text: async () => '{}' });
		request.mockResolvedValueOnce({
			ok: true,
			bytes: async (onProgress: Parameters<HttpResponse['bytes']>[0]) => {
				expect(progress.at(-1)).toMatchObject({ stage: 'downloading', label: 'wallpaper' });
				onProgress?.({ receivedBytes: 1, totalBytes: 3 });
				expect(progress.at(-1)).toMatchObject({ stage: 'downloading', label: 'wallpaper' });
				onProgress?.({ receivedBytes: 2 });
				onProgress?.({ receivedBytes: 3, totalBytes: 3 });
				return new Uint8Array([1, 2, 3]);
			}
		});
		sha256.mockImplementation(async (data: string | Uint8Array) => {
			if (data instanceof Uint8Array)
				expect(progress.at(-1)).toMatchObject({ stage: 'verifying', label: 'wallpaper' });
			return hash;
		});
		decode.mockImplementation(async () => {
			expect(progress.at(-1)).toMatchObject({ stage: 'verifying', label: 'wallpaper' });
		});
		const manifest = {
			colorsUrl: 'https://themes.test/colors.json',
			colorsSha256: hash,
			iconThemeUrl: 'https://themes.test/icons.json',
			iconThemeSha256: hash
		} as PluginManifest;
		const assets = await pipeline.download(manifest, undefined, {
			onProgress: (p) => progress.push(p)
		});
		expect(assets.wallpaper?.size).toBe(3);
		expect(progress.at(-1)).toMatchObject({ stage: 'verifying', percent: 85 });
		expect(progress.every((p, i) => i === 0 || p.percent >= progress[i - 1]!.percent)).toBe(true);
		expect(
			progress.filter((p) => p.stage === 'downloading' && p.label === 'wallpaper').length
		).toBeGreaterThan(1);
	});
	it('resolves against colors JSON and verifies bytes before decoding', async () => {
		const { pipeline, request, decode, revoke } = setup();
		const blob = await pipeline.downloadThemeWallpaper(
			colors,
			'https://themes.test/rev/colors.json'
		);
		expect(request).toHaveBeenCalledWith(
			`https://themes.test/rev/image.png?v=${hash.slice(0, 16)}`,
			expect.anything()
		);
		expect(blob?.size).toBe(3);
		expect(decode).toHaveBeenCalledOnce();
		expect(revoke).toHaveBeenCalledWith('blob:validate');
	});
	it('rejects tampered and undecodable images', async () => {
		const { pipeline, sha256, decode } = setup();
		sha256.mockResolvedValueOnce('b'.repeat(64));
		await expect(
			pipeline.downloadThemeWallpaper(colors, 'https://themes.test/colors.json')
		).rejects.toThrow('integrity');
		expect(decode).not.toHaveBeenCalled();
		decode.mockRejectedValueOnce(new Error('decode failed'));
		await expect(
			pipeline.downloadThemeWallpaper(colors, 'https://themes.test/colors.json')
		).rejects.toThrow('decode failed');
	});
	it('activates cached wallpaper without network and removes its contribution on disable', async () => {
		const wallpaper = new Blob(['cached']);
		const dispose = vi.fn();
		const registerTheme = vi.fn(() => ({ dispose }));
		const engine = {
			runtime: { sha256: vi.fn().mockResolvedValue(hash) },
			isPluginLoaded: () => false,
			themes: { registerTheme }
		} as unknown as ChronosEngine;
		const images = { get: vi.fn().mockResolvedValue(wallpaper) } as unknown as ImageRepository;
		const activator = new OfficialPluginRuntimeActivator(engine, () => true, images);
		await activator.activate({
			manifest: { id: 'theme-owner', colorsUrl: '/colors.json', colorsSha256: hash } as never,
			colorsJson: colors,
			wallpaperAssetId: 'cached-image',
			origin: { kind: 'user' as const },
			installedAt: 1
		});
		expect(registerTheme).toHaveBeenCalledWith(
			expect.objectContaining({ wallpaper }),
			'theme-owner'
		);
		await activator.deactivate('theme-owner');
		expect(dispose).toHaveBeenCalledOnce();
	});
});
