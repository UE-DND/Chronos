import { afterEach, describe, expect, it, vi } from 'vite-plus/test';
import { createHash } from 'node:crypto';
import { mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { resolve } from 'node:path';
import { buildOfficialPluginAssets } from './build-plugin';
import { createOfficialPluginBuildPaths } from './paths';
import { createDevOfficialPluginBundleMiddleware } from './dev-bundle-middleware';

let root = '';
afterEach(() => {
	if (root) rmSync(root, { recursive: true, force: true });
});
describe('theme wallpaper build', () => {
	it.each(['dev', 'production'] as const)(
		'publishes hashed binary images in %s builds',
		async (mode) => {
			root = mkdtempSync(resolve(tmpdir(), 'chronos-theme-wallpaper-'));
			const sourceDir = resolve(root, 'theme');
			mkdirSync(sourceDir);
			const bytes = new Uint8Array([0, 255, 127, 128]);
			writeFileSync(resolve(sourceDir, 'image.png'), bytes);
			const colorsJson = resolve(sourceDir, 'theme.json');
			writeFileSync(
				colorsJson,
				JSON.stringify({ id: 'image-theme', wallpaper: { url: './image.png' } })
			);
			const paths = createOfficialPluginBuildPaths(root);
			const result = await buildOfficialPluginAssets(
				{
					id: 'theme-image',
					type: 'theme',
					sourceDir,
					colorsJson,
					name: { en: 'Test', 'zh-CN': '测试' },
					description: { en: 'Test', 'zh-CN': '测试' }
				},
				{ root, paths, releaseVersion: '1.0.0', createAliasRecord: () => ({}), mode, rev: 'rev1' }
			);
			const colors = JSON.parse(result.colorsJson!);
			expect(colors.wallpaper).toEqual({
				url: './wallpaper.image',
				sha256: createHash('sha256').update(bytes).digest('hex')
			});
			const dir =
				mode === 'dev'
					? paths.devRevDir('theme-image', 'rev1')
					: paths.pluginBundleDir('theme-image');
			expect(readFileSync(resolve(dir, 'wallpaper.image'))).toEqual(Buffer.from(bytes));
			if (mode === 'dev') {
				const next = vi.fn();
				const end = vi.fn();
				createDevOfficialPluginBundleMiddleware(root)(
					{ url: '/official-plugins/bundles/theme-image/rev1/wallpaper.image' } as never,
					{ setHeader: vi.fn(), end } as never,
					next
				);
				expect(end).toHaveBeenCalledWith(Buffer.from(bytes));
				expect(next).not.toHaveBeenCalled();
			}
		}
	);
});
