import { afterEach, describe, expect, it } from 'vite-plus/test';
import { existsSync, mkdtempSync, readFileSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { resolve } from 'node:path';
import type { ResolvedServerPlugin } from '../../../../../scripts/official-plugin-build/server-definition';
import type { ResolvedMobilePlugin } from '../../../../../scripts/official-plugin-build/mobile-server-definition';
import { writeMobileServerArtifacts, writeServerArtifacts } from './chronos-profile-plugin';

describe('server deployment artifacts', () => {
	let webRoot = '';
	afterEach(() => {
		if (webRoot) rmSync(webRoot, { recursive: true, force: true });
		webRoot = '';
	});

	it('includes only enabled server modules and removes the route for offline builds', () => {
		webRoot = mkdtempSync(resolve(tmpdir(), 'chronos-server-artifacts-'));
		const plugins: ResolvedServerPlugin[] = [
			{
				id: 'alpha',
				importPath: '@fixture/alpha/server',
				definition: { pluginId: 'alpha', proxy: { action: 'preview', domains: ['example.org'] } }
			},
			{
				id: 'beta',
				importPath: '@fixture/beta/server',
				definition: { pluginId: 'beta', proxy: { action: 'sync', domains: ['beta.example.org'] } }
			}
		];
		const registryPath = resolve(webRoot, 'src/lib/boot/plugin-proxy-meta.generated.ts');
		const loaderPath = resolve(webRoot, 'src/lib/server/plugin-server-loader.generated.ts');
		const routePath = resolve(webRoot, 'src/routes/api/plugins/[pluginId]/[...action]/+server.ts');

		writeServerArtifacts(webRoot, plugins);
		const registry = readFileSync(registryPath, 'utf8');
		const loader = readFileSync(loaderPath, 'utf8');
		expect(registry).toContain('pluginId: "alpha", action: "preview"');
		expect(registry).toContain('pluginId: "beta", action: "sync"');
		expect(registry).not.toContain('example.org');
		expect(loader).toContain('import("@fixture/alpha/server")');
		expect(loader).toContain('import("@fixture/beta/server")');
		expect(existsSync(routePath)).toBe(true);

		writeServerArtifacts(webRoot, []);
		expect(readFileSync(registryPath, 'utf8')).toContain('ACTIVE_SERVER_PLUGIN_IDS = []');
		expect(readFileSync(loaderPath, 'utf8')).not.toContain('@fixture/');
		expect(existsSync(routePath)).toBe(false);
	});
});

describe('mobile plugin server artifacts', () => {
	let mobileRoot = '';
	afterEach(() => {
		if (mobileRoot) rmSync(mobileRoot, { recursive: true, force: true });
		mobileRoot = '';
	});

	it('generates static imports and origin-scoped metadata without routing branches', () => {
		mobileRoot = mkdtempSync(resolve(tmpdir(), 'chronos-mobile-artifacts-'));
		const plugins: ResolvedMobilePlugin[] = [
			{
				id: 'alpha',
				importPath: '@fixture/alpha/mobile',
				definition: {
					pluginId: 'alpha',
					actions: ['preview'],
					allowedDomains: ['example.org'],
					cookieOrigins: ['https://login.example.org']
				}
			}
		];
		const output = resolve(mobileRoot, 'src/lib/boot/mobile-plugin-server-registry.generated.ts');

		writeMobileServerArtifacts(mobileRoot, plugins);
		const generated = readFileSync(output, 'utf8');
		expect(generated).toContain('from "@fixture/alpha/mobile"');
		expect(generated).toContain('"allowedDomains":["example.org"]');
		expect(generated).toContain('"cookieOrigins":["https://login.example.org"]');
		expect(generated).not.toContain('if (pluginId');

		writeMobileServerArtifacts(mobileRoot, []);
		expect(readFileSync(output, 'utf8')).not.toContain('@fixture/');
	});
});
