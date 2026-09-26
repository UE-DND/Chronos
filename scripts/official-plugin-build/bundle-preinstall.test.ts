import { afterEach, expect, it } from 'vite-plus/test';
import { mkdtempSync, readFileSync, readdirSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { resolve } from 'node:path';
import { publishOfficialPluginMarket } from './publish-market.ts';
import { buildManifestForPlugin } from './build-manifest.ts';
import { bundlePreinstall } from './bundle-preinstall.ts';
let root = '';
afterEach(() => {
	if (root) rmSync(root, { recursive: true, force: true });
});
it('copies only selected plugins and removes resources from the previous profile', () => {
	root = mkdtempSync(resolve(tmpdir(), 'chronos-preinstall-'));
	const plugins = ['required', 'optional'].map((id) => {
		const assets = {
			id,
			type: 'theme' as const,
			code: `export default '${id}'`,
			cssCode: null,
			colorsJson: null,
			iconThemeJson: null
		};
		return {
			...assets,
			manifest: buildManifestForPlugin(
				{ id, type: 'theme', name: {}, description: {}, sourceDir: id },
				assets,
				'1.0.0'
			)
		};
	});
	publishOfficialPluginMarket(root, plugins);
	const market = resolve(root, 'dist/plugin-market');
	const bundled = resolve(root, 'apps/web/static/official-plugins');
	bundlePreinstall(market, bundled, ['optional']);
	bundlePreinstall(market, bundled, ['required']);
	expect(readdirSync(resolve(bundled, 'bundles'))).toEqual(['required']);
	const catalog = JSON.parse(readFileSync(resolve(bundled, 'catalog.json'), 'utf8'));
	expect(catalog.manifests).toHaveLength(1);
	const manifestPath = resolve(bundled, catalog.manifests[0]);
	const manifest = JSON.parse(readFileSync(manifestPath, 'utf8'));
	expect(manifest.id).toBe('required');
	expect(readFileSync(resolve(manifestPath, '..', manifest.bundleUrl), 'utf8')).toBe(
		plugins[0].code
	);
	expect(JSON.parse(readFileSync(resolve(market, 'catalog.json'), 'utf8')).manifests).toHaveLength(
		2
	);
	expect(() => bundlePreinstall(market, bundled, ['missing'])).toThrow('missing');
});
