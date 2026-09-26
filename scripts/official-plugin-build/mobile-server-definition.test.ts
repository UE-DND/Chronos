import { afterEach, describe, expect, it } from 'vite-plus/test';
import { mkdirSync, mkdtempSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { resolve } from 'node:path';
import {
	resolveOfficialMobilePlugin,
	resolveOfficialMobilePlugins
} from './mobile-server-definition.ts';

describe('mobile plugin server discovery', () => {
	let root = '';
	const catalog = [
		{ id: 'alpha', sourceDir: 'alpha-package' },
		{ id: 'beta', sourceDir: 'beta-package' }
	];

	function fixture(
		plugin: (typeof catalog)[number],
		options: {
			mobile?: boolean;
			definitionExport?: boolean;
			pluginId?: string;
			actions?: string[];
			cookieOrigins?: string[];
		} = {}
	) {
		if (!root) root = mkdtempSync(resolve(tmpdir(), 'chronos-mobile-plugin-'));
		const packageDir = resolve(root, 'packages/plugins', plugin.sourceDir);
		mkdirSync(resolve(packageDir, 'server'), { recursive: true });
		mkdirSync(resolve(packageDir, 'mobile'), { recursive: true });
		writeFileSync(resolve(packageDir, 'server/index.ts'), 'export const serverManifest = {};\n');
		writeFileSync(
			resolve(packageDir, 'server/definition.ts'),
			`export const serverDefinition = ${JSON.stringify({
				pluginId: plugin.id,
				proxy: { action: 'preview', domains: ['example.org'] }
			})};\n`
		);
		writeFileSync(resolve(packageDir, 'mobile/index.ts'), 'export {};\n');
		writeFileSync(
			resolve(packageDir, 'mobile/definition.ts'),
			`export const mobilePluginDefinition = ${JSON.stringify({
				pluginId: options.pluginId ?? plugin.id,
				actions: options.actions ?? ['preview'],
				cookieOrigins: options.cookieOrigins ?? ['https://login.example.org']
			})};\n`
		);
		writeFileSync(
			resolve(packageDir, 'package.json'),
			JSON.stringify({
				name: `@fixture/${plugin.id}`,
				type: 'module',
				exports: {
					'./server': './server/index.ts',
					'./server/definition': './server/definition.ts',
					...(options.mobile === false ? {} : { './mobile': './mobile/index.ts' }),
					...(options.definitionExport === false
						? {}
						: { './mobile/definition': './mobile/definition.ts' })
				}
			})
		);
	}

	afterEach(() => {
		if (root) rmSync(root, { recursive: true, force: true });
		root = '';
	});

	it('ignores plugins without a mobile export and resolves opted-in handlers', async () => {
		fixture(catalog[0]);
		fixture(catalog[1], { mobile: false, definitionExport: false });

		const resolved = await resolveOfficialMobilePlugins(root, catalog);

		expect(resolved).toHaveLength(1);
		expect(resolved[0]).toMatchObject({
			id: 'alpha',
			importPath: '@fixture/alpha/mobile',
			definition: {
				pluginId: 'alpha',
				actions: ['preview'],
				allowedDomains: ['example.org'],
				cookieOrigins: ['https://login.example.org']
			}
		});
	});

	it('rejects partial exports, mismatched identity or actions, and invalid cookie origins', async () => {
		fixture(catalog[0], { definitionExport: false });
		await expect(resolveOfficialMobilePlugin(catalog[0], root)).rejects.toThrow(
			'mobile and mobile/definition exports must be declared together'
		);

		fixture(catalog[0], { pluginId: 'wrong' });
		await expect(resolveOfficialMobilePlugin(catalog[0], root)).rejects.toThrow(
			'mobilePluginDefinition.pluginId'
		);

		fixture(catalog[0], { actions: ['sync'] });
		await expect(resolveOfficialMobilePlugin(catalog[0], root)).rejects.toThrow(
			'must match serverDefinition.proxy.action'
		);

		fixture(catalog[0], { actions: ['preview', 'preview'] });
		await expect(resolveOfficialMobilePlugin(catalog[0], root)).rejects.toThrow(
			'Duplicate mobile plugin action: preview'
		);

		fixture(catalog[0], { cookieOrigins: ['http://other.org'] });
		await expect(resolveOfficialMobilePlugin(catalog[0], root)).rejects.toThrow(
			'HTTPS cookie origin must belong to a declared proxy domain'
		);
	});

	it('rejects duplicate plugin IDs in the generated registry input', async () => {
		fixture(catalog[0]);
		await expect(resolveOfficialMobilePlugins(root, [catalog[0], catalog[0]])).rejects.toThrow(
			'Duplicate mobile plugin'
		);
	});
});
