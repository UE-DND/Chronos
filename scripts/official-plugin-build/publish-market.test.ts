import { afterEach, expect, it, vi } from 'vite-plus/test';
import { mkdtempSync, readFileSync, rmSync, existsSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { resolve } from 'node:path';
import * as cache from './cache.ts';
import { publishOfficialPluginMarket } from './publish-market.ts';
import { buildManifestForPlugin } from './build-manifest.ts';
import { verifyOfficialPlugins } from './verify-official-plugins.ts';
let root = '';
afterEach(() => {
	vi.restoreAllMocks();
	if (root) rmSync(root, { recursive: true, force: true });
});
function plugin(id: string, code: string) {
	const assets = {
		id,
		type: 'theme' as const,
		code,
		cssCode: null,
		colorsJson: null,
		iconThemeJson: null
	};
	return {
		...assets,
		licenses: [{ name: 'fixture-dep', version: code, license: 'MIT' }],
		manifest: buildManifestForPlugin(
			{ id, type: 'theme', name: { en: id }, description: {}, sourceDir: id },
			assets,
			'1.0.0'
		)
	};
}
it('keeps the live catalog and its bytes readable across failed publication, then switches atomically', () => {
	root = mkdtempSync(resolve(tmpdir(), 'chronos-market-'));
	const publicRoot = resolve(root, 'dist/plugin-market');
	const catalogPath = resolve(publicRoot, 'catalog.json');
	const first = publishOfficialPluginMarket(root, [
		plugin('fixture', 'old'),
		plugin('removed', 'removed')
	]);
	const originalCatalog = readFileSync(catalogPath, 'utf8');
	const originalAsset = resolve(
		publicRoot,
		'manifests',
		'revision',
		String(first[0].manifest!.bundleUrl)
	);
	const write = cache.writeChanged;
	const observed: boolean[] = [];
	const spy = vi.spyOn(cache, 'writeChanged').mockImplementation((path, value) => {
		if (path.startsWith(publicRoot)) {
			observed.push(
				existsSync(catalogPath) &&
					readFileSync(catalogPath, 'utf8') === originalCatalog &&
					readFileSync(originalAsset, 'utf8') === 'old'
			);
			if (path === catalogPath) throw new Error('interrupted at commit');
		}
		write(path, value);
	});
	expect(() => publishOfficialPluginMarket(root, [plugin('fixture', 'new')])).toThrow(
		'interrupted at commit'
	);
	expect(observed.length).toBeGreaterThan(0);
	expect(observed.every(Boolean)).toBe(true);
	expect(readFileSync(catalogPath, 'utf8')).toBe(originalCatalog);
	verifyOfficialPlugins(publicRoot);
	spy.mockRestore();
	publishOfficialPluginMarket(root, [plugin('fixture', 'new')]);
	verifyOfficialPlugins(publicRoot);
	const catalog = readFileSync(catalogPath, 'utf8');
	expect(JSON.parse(catalog).manifests).toHaveLength(1);
	expect(catalog).not.toBe(originalCatalog);
	expect(readFileSync(originalAsset, 'utf8')).toBe('old');
	expect(
		JSON.parse(
			readFileSync(
				resolve(
					publicRoot,
					'manifests',
					JSON.parse(catalog).manifests[0].split('/')[2],
					'fixture.licenses.json'
				),
				'utf8'
			)
		)
			.map((item: { version: string }) => item.version)
			.sort()
	).toEqual(['new']);
	publishOfficialPluginMarket(root, [plugin('fixture', 'new')]);
	expect(readFileSync(catalogPath, 'utf8')).toBe(catalog);
});
it('never replaces a valid catalog when staged integrity verification fails', () => {
	root = mkdtempSync(resolve(tmpdir(), 'chronos-market-'));
	publishOfficialPluginMarket(root, [plugin('fixture', 'old')]);
	const path = resolve(root, 'dist/plugin-market/catalog.json');
	const before = readFileSync(path, 'utf8');
	const invalid = plugin('fixture', 'new');
	invalid.code = 'corrupted';
	expect(() => publishOfficialPluginMarket(root, [invalid])).toThrow('verification failed');
	expect(readFileSync(path, 'utf8')).toBe(before);
});
