import { describe, expect, it } from 'vite-plus/test';
import { createServer } from 'vite';
import { fileURLToPath } from 'node:url';
import {
	assertCloudflareModuleGraph,
	CLOUDFLARE_SERVER_CONDITIONS
} from './cloudflare-build-guard.ts';

describe('Cloudflare server dependency graph', () => {
	it('resolves Svelte server APIs and the CQUT fetch session in the same SSR environment', async () => {
		const webRoot = fileURLToPath(new URL('../../', import.meta.url));
		const importer = fileURLToPath(
			new URL('../../../../packages/plugins/source-cqut/server/index.ts', import.meta.url)
		);
		const server = await createServer({
			configFile: false,
			root: webRoot,
			ssr: {
				resolve: { conditions: CLOUDFLARE_SERVER_CONDITIONS },
				noExternal: ['svelte', '@chronos/plugin-source-cqut']
			}
		});
		try {
			const resolver = server.environments.ssr.pluginContainer;
			const svelte = await resolver.resolveId('svelte', importer);
			const session = await resolver.resolveId('#cqut-server-session', importer);
			expect(svelte?.id).toMatch(/\/svelte\/src\/index-server\.js$/);
			expect(session?.id).toMatch(/\/source-cqut\/server\/fetch-cqut-session\.ts$/);
		} finally {
			await server.close();
		}
	});

	it.each([
		'node:dns',
		'node:dns/promises',
		'undici',
		'/repo/node_modules/.pnpm/undici@8.5.0/node_modules/undici/index.js',
		'/repo/packages/plugins/source-cqut/server/dispatcher.ts',
		'/repo/packages/plugins/source-cqut/server/node-cqut-session.ts'
	])('rejects a Node network dependency: %s', (id) => {
		expect(() => assertCloudflareModuleGraph([id])).toThrow('Node network dependencies');
	});
	it('accepts the native fetch session and shared parser modules', () => {
		expect(() =>
			assertCloudflareModuleGraph([
				'/repo/packages/plugins/source-cqut/server/fetch-cqut-session.ts',
				'/repo/packages/plugins/source-cqut/server/cookie-jar.ts',
				'/repo/packages/plugins/source-cqut/src/html-parser.ts'
			])
		).not.toThrow();
	});
});
