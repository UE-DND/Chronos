import { afterEach, expect, it } from 'vite-plus/test';
import { mkdtempSync, mkdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, resolve } from 'node:path';
import { OFFICIAL_PLUGINS } from '../../../../../scripts/official-plugins.config.ts';
import { digest, writeBuildCache } from '../../../../../scripts/official-plugin-build/cache.ts';
import { declaredDevelopmentLicenses } from './dev-licenses.ts';
let root = '';
afterEach(() => {
	if (root) rmSync(root, { recursive: true, force: true });
});
it('invalidates persisted license results after collector or cache implementation changes', () => {
	root = mkdtempSync(resolve(tmpdir(), 'chronos-license-cache-'));
	const write = (path: string, value: string) => {
		const file = resolve(root, path);
		mkdirSync(dirname(file), { recursive: true });
		writeFileSync(file, value);
	};
	const collector = 'apps/web/src/lib/legal/dev-licenses.ts';
	const cacheImplementation = 'scripts/official-plugin-build/cache.ts';
	write(collector, 'collector v1');
	write(cacheImplementation, 'cache v1');
	write(
		'apps/web/package.json',
		JSON.stringify({ name: '@chronos/web', dependencies: { fixture: '1' } })
	);
	write(
		'apps/web/node_modules/fixture/package.json',
		JSON.stringify({ name: 'fixture', version: '1', license: 'MIT' })
	);
	for (const plugin of OFFICIAL_PLUGINS)
		write(
			`packages/plugins/${plugin.sourceDir}/package.json`,
			JSON.stringify({ name: `@chronos/${plugin.id}` })
		);
	const cachePath = resolve(root, 'dist/plugin-cache/dev-licenses.json');
	writeBuildCache(cachePath, 'declared-runtime-dependencies', [], [], [], []);
	const expected = [{ name: 'fixture', version: '1', license: 'MIT' }];
	expect(declaredDevelopmentLicenses(root)).toEqual(expected);
	for (const source of [collector, cacheImplementation]) {
		const cached = JSON.parse(readFileSync(cachePath, 'utf8'));
		cached.value = [];
		cached.digest = digest(JSON.stringify(cached.value));
		writeFileSync(cachePath, JSON.stringify(cached));
		expect(declaredDevelopmentLicenses(root)).toEqual([]);
		write(source, 'updated implementation');
		expect(declaredDevelopmentLicenses(root)).toEqual(expected);
	}
});
