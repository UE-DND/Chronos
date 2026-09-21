import { PluginBuildCoordinator } from './coordinator.ts';
import { afterEach, describe, expect, it } from 'vite-plus/test';
import { mkdtempSync, mkdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { buildOfficialPluginAssets } from './build-plugin.ts';
import { createOfficialPluginBuildPaths } from './paths.ts';
import { createChronosAliasRecord } from '../resolve-chronos-aliases.ts';
import { preparePluginResources } from './prepare-resources.ts';
import { inputAffected } from './cache.ts';
import type { OfficialPluginDef } from '../official-plugins.config.ts';
const root = fileURLToPath(new URL('../..', import.meta.url));
let temporary = '';
afterEach(() => {
	if (temporary) rmSync(temporary, { recursive: true, force: true });
});
function fixture(id: string) {
	temporary = mkdtempSync(resolve(tmpdir(), 'chronos-incremental-'));
	mkdirSync(resolve(temporary, 'published'));
	writeFileSync(resolve(temporary, 'package.json'), '{"name":"@fixture/plugin","type":"module"}');
	const plugin: OfficialPluginDef = {
		id,
		sourceDir: temporary,
		type: 'theme',
		name: { en: 'Fixture' },
		description: {},
		entry: resolve(temporary, 'entry.ts'),
		colorsJson: resolve(temporary, 'colors.json')
	};
	writeFileSync(plugin.colorsJson!, '{"id":"fixture","value":1}');
	writeFileSync(plugin.entry!, 'import {value} from "./shared"; export default {value};');
	writeFileSync(resolve(temporary, 'shared.ts'), 'export const value = 1;');
	const options = {
		root,
		mode: 'dev' as const,
		releaseVersion: '0.0.0-test',
		createAliasRecord: createChronosAliasRecord,
		paths: createOfficialPluginBuildPaths(root, { devPluginsRoot: resolve(temporary, 'published') })
	};
	return { plugin, options };
}
describe('incremental plugin build contract', () => {
	it('reuses compilation for metadata/resources, detects shared imports, and recovers from failed builds', async () => {
		const { plugin, options } = fixture('fixture-incremental');
		const first = await buildOfficialPluginAssets(plugin, options);
		const second = await buildOfficialPluginAssets(plugin, options);
		expect(second.cacheStatus?.compile).toBe(true);
		expect(second.rev).toBe(first.rev);
		writeFileSync(resolve(temporary, 'README.md'), 'documentation');
		expect(inputAffected(second.inputs!, resolve(temporary, 'README.md'))).toBe(false);
		const metadata = await buildOfficialPluginAssets(
			{ ...plugin, description: { en: 'changed' } },
			options
		);
		expect(metadata.cacheStatus?.compile).toBe(true);
		expect(metadata.rev).not.toBe(first.rev);
		writeFileSync(plugin.colorsJson!, '{"id":"fixture","value":2}');
		const resource = await buildOfficialPluginAssets(plugin, options);
		expect(resource.cacheStatus?.compile).toBe(true);
		expect(resource.rev).not.toBe(first.rev);
		const shared = resolve(temporary, 'shared.ts');
		expect(inputAffected(first.inputs!, shared)).toBe(true);
		writeFileSync(shared, 'export const value = 2;');
		const changed = await buildOfficialPluginAssets(plugin, options);
		expect(changed.cacheStatus?.compile).toBe(false);
		expect(changed.code).not.toBe(first.code);
		const published = readFileSync(options.paths.devManifestPath(plugin.id), 'utf8');
		writeFileSync(shared, 'export const = ;');
		await expect(buildOfficialPluginAssets(plugin, options)).rejects.toThrow();
		expect(readFileSync(options.paths.devManifestPath(plugin.id), 'utf8')).toBe(published);
		writeFileSync(shared, 'export const value = 2;');
		expect((await buildOfficialPluginAssets(plugin, options)).cacheStatus?.compile).toBe(true);
	}, 60_000);
	it('retries a failed new import when its previously unknown file appears', async () => {
		const { plugin } = fixture('fixture-new-import');
		const coordinator = new PluginBuildCoordinator({
			root,
			plugins: [plugin],
			mode: 'dev',
			releaseVersion: '0.0.0-test'
		});
		try {
			await coordinator.prepare();
			writeFileSync(plugin.entry!, 'import {value} from "./new/shared"; export default {value};');
			await expect(coordinator.prepare()).rejects.toThrow();
			const path = resolve(temporary, 'new/shared.ts');
			mkdirSync(resolve(temporary, 'new'));
			writeFileSync(path, 'export const value = 10;');
			expect(coordinator.affected(path)).toEqual([plugin.id]);
			expect(coordinator.affected(resolve(temporary, 'README.md'))).toEqual([]);
			expect((await coordinator.prepare())[0].code).toContain('10');
		} finally {
			coordinator.dispose();
		}
		await expect(coordinator.prepare()).rejects.toThrow();
	}, 60_000);

	it('executes changed resource preparation dependencies in a fresh process', async () => {
		const { plugin } = fixture('fixture-resources');
		plugin.prepareResources = resolve(temporary, 'build.ts');
		writeFileSync(
			plugin.prepareResources,
			'import {writeFileSync} from "node:fs"; import {value} from "./shared.ts"; export function prepareResources(outDir) { writeFileSync(outDir+"/colors.json",JSON.stringify({value})); return {colorsJson:"colors.json"}; }'
		);
		const before = readFileSync(plugin.colorsJson!, 'utf8');
		const first = await preparePluginResources(plugin, root);
		expect(JSON.parse(readFileSync(first.colorsJson!, 'utf8')).value).toBe(1);
		expect((await preparePluginResources(plugin, root)).cacheHit).toBe(true);
		writeFileSync(resolve(temporary, 'shared.ts'), 'export const value = 5;');
		const updated = await preparePluginResources(plugin, root);
		expect(JSON.parse(readFileSync(updated.colorsJson!, 'utf8')).value).toBe(5);
		expect(readFileSync(plugin.colorsJson!, 'utf8')).toBe(before);
	}, 60_000);
});
