import { afterEach, describe, expect, it } from 'vite-plus/test';
import { mkdtempSync, mkdirSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { resolve } from 'node:path';
import {
	resolveDeploymentServerPlugins,
	resolveOfficialServerPlugin
} from '../../../../../scripts/official-plugin-build/server-definition.ts';

describe('server plugin package discovery', () => {
	let root = '';
	const catalog = [
		{ id: 'alpha', sourceDir: 'alpha-package' },
		{ id: 'beta', sourceDir: 'beta-package' }
	];

	function fixture(
		plugin: (typeof catalog)[number],
		options: {
			definitionId?: string;
			serverExport?: boolean;
			definitionExport?: boolean;
			action?: string;
			domains?: string[];
		} = {}
	) {
		if (!root) root = mkdtempSync(resolve(tmpdir(), 'chronos-server-plugin-'));
		const packageDir = resolve(root, 'packages/plugins', plugin.sourceDir);
		mkdirSync(resolve(packageDir, 'server'), { recursive: true });
		writeFileSync(resolve(packageDir, 'server/index.ts'), 'export const serverManifest = {};\n');
		writeFileSync(
			resolve(packageDir, 'server/definition.ts'),
			`export const serverDefinition = ${JSON.stringify({
				pluginId: options.definitionId ?? plugin.id,
				proxy: { action: options.action ?? 'preview', domains: options.domains ?? ['example.org'] }
			})};\n`
		);
		writeFileSync(
			resolve(packageDir, 'package.json'),
			JSON.stringify({
				name: `@fixture/${plugin.id}`,
				type: 'module',
				exports: {
					...(options.serverExport === false ? {} : { './server': './server/index.ts' }),
					...(options.definitionExport === false
						? {}
						: { './server/definition': './server/definition.ts' })
				}
			})
		);
	}

	afterEach(() => {
		if (root) rmSync(root, { recursive: true, force: true });
		root = '';
	});

	it('resolves two unrelated packages without host module entries', async () => {
		fixture(catalog[0]);
		fixture(catalog[1], { action: 'sync', domains: ['beta.example.org'] });
		const selected = await resolveDeploymentServerPlugins(['alpha', 'beta'], root, catalog);
		expect(
			selected.map(({ id, importPath, definition }) => [id, importPath, definition.proxy.action])
		).toEqual([
			['alpha', '@fixture/alpha/server', 'preview'],
			['beta', '@fixture/beta/server', 'sync']
		]);
		expect(selected[1].definition.proxy.domains).toEqual(['beta.example.org']);
	});

	it('fails for unknown or repeated deployment IDs', async () => {
		fixture(catalog[0]);
		await expect(resolveDeploymentServerPlugins(['missing'], root, catalog)).rejects.toThrow(
			'Unknown server plugin'
		);
		await expect(resolveDeploymentServerPlugins(['alpha', 'alpha'], root, catalog)).rejects.toThrow(
			'Duplicate server plugin'
		);
	});

	it('rejects missing exports and mismatched declarations', async () => {
		fixture(catalog[0], { definitionExport: false });
		await expect(resolveOfficialServerPlugin(catalog[0], root, true)).rejects.toThrow(
			'must be declared together'
		);
		fixture(catalog[0], { serverExport: false });
		await expect(resolveOfficialServerPlugin(catalog[0], root, true)).rejects.toThrow(
			'must be declared together'
		);
		fixture(catalog[0], { definitionId: 'wrong' });
		await expect(resolveOfficialServerPlugin(catalog[0], root, true)).rejects.toThrow(
			'serverDefinition.pluginId'
		);
	});

	it('rejects malformed action and duplicate or invalid domains', async () => {
		fixture(catalog[0], { action: 'preview/extra' });
		await expect(resolveOfficialServerPlugin(catalog[0], root, true)).rejects.toThrow(
			'single URL segment'
		);
		fixture(catalog[0], { domains: ['example.org', 'example.org'] });
		await expect(resolveOfficialServerPlugin(catalog[0], root, true)).rejects.toThrow(
			'Duplicate server proxy domain'
		);
		fixture(catalog[0], { domains: ['https://example.org'] });
		await expect(resolveOfficialServerPlugin(catalog[0], root, true)).rejects.toThrow(
			'Invalid server proxy domain'
		);
		fixture(catalog[0], { domains: ['bad..example.org'] });
		await expect(resolveOfficialServerPlugin(catalog[0], root, true)).rejects.toThrow(
			'Invalid server proxy domain'
		);
	});
});
