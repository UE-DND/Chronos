import { afterEach, expect, it } from 'vite-plus/test';
import { mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { tmpdir } from 'node:os';
import { publishOfficialPluginMarket } from './publish-market.ts';
import { buildManifestForPlugin } from './build-manifest.ts';
import { stagePluginRelease } from './plugin-release.ts';
let root = '';
afterEach(() => {
	if (root) rmSync(root, { recursive: true, force: true });
});
it('preserves history, permits identical retries and rejects commit or byte conflicts', () => {
	root = mkdtempSync(resolve(tmpdir(), 'chronos-release-'));
	const market = resolve(root, 'dist/plugin-market');
	const history = resolve(root, 'history');
	const site = resolve(root, 'site');
	const publish = (version: string) => {
		const assets = {
			id: 'fixture',
			type: 'theme' as const,
			code: 'export default {}',
			cssCode: null,
			colorsJson: null,
			iconThemeJson: null
		};
		publishOfficialPluginMarket(root, [
			{
				...assets,
				manifest: buildManifestForPlugin(
					{ id: 'fixture', type: 'theme', name: {}, description: {}, sourceDir: 'fixture' },
					assets,
					version
				)
			}
		]);
	};
	publish('1.0.0');
	stagePluginRelease(market, history, site, '1.0.0', 'a'.repeat(40));
	const first = readFileSync(resolve(site, 'plugins/releases/1.0.0/release.json'), 'utf8');
	stagePluginRelease(market, history, site, '1.0.0', 'a'.repeat(40));
	expect(() => stagePluginRelease(market, history, site, '1.0.0', 'b'.repeat(40))).toThrow(
		'conflict'
	);
	publish('1.0.1');
	stagePluginRelease(market, history, site, '1.0.1', 'b'.repeat(40));
	expect(readFileSync(resolve(site, 'plugins/releases/1.0.0/release.json'), 'utf8')).toBe(first);
	writeFileSync(
		resolve(market, 'catalog.json'),
		readFileSync(resolve(market, 'catalog.json'), 'utf8').replace(
			'"updatedAt":',
			'"extra": true, "updatedAt":'
		)
	);
	expect(() => stagePluginRelease(market, history, site, '1.0.1', 'b'.repeat(40))).toThrow(
		'conflict'
	);
});

it('probes published manifests and payload bytes and rejects corrupted downloads', async () => {
	const { smokePluginRelease } = await import('./plugin-release.ts');
	root = mkdtempSync(resolve(tmpdir(), 'chronos-smoke-'));
	const assets = {
		id: 'fixture',
		type: 'theme' as const,
		code: 'export default {}',
		cssCode: null,
		colorsJson: null,
		iconThemeJson: null
	};
	publishOfficialPluginMarket(root, [
		{
			...assets,
			manifest: buildManifestForPlugin(
				{ id: 'fixture', type: 'theme', name: {}, description: {}, sourceDir: 'fixture' },
				assets,
				'1.0.0'
			)
		}
	]);
	stagePluginRelease(
		resolve(root, 'dist/plugin-market'),
		resolve(root, 'history'),
		resolve(root, 'site'),
		'1.0.0',
		'a'.repeat(40)
	);
	let corrupt = false;
	const fetcher: typeof fetch = async (input) => {
		const url = new URL(input instanceof Request ? input.url : input.toString());
		const path = url.pathname.replace('/plugins/releases/1.0.0/', '');
		const bytes = readFileSync(resolve(root, 'site/plugins/releases/1.0.0', path));
		return new Response(corrupt && path.endsWith('bundle.js') ? 'corrupted' : bytes);
	};
	await expect(
		smokePluginRelease('https://example.com/plugins/releases/', '1.0.0', fetcher)
	).resolves.toBeUndefined();
	corrupt = true;
	await expect(
		smokePluginRelease('https://example.com/plugins/releases/', '1.0.0', fetcher)
	).rejects.toThrow('integrity');
});
