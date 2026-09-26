import { describe, expect, it } from 'vite-plus/test';
import type { PluginManifest } from '@chronos/core';
import type { InstalledOfficialPluginRecord } from './official-plugin-types';
import {
	buildCatalogManifestMap,
	isOfficialCatalogManifestUrl,
	shouldSyncInstalledPlugin
} from './sync-installed-plugins';

function record(
	overrides: Partial<InstalledOfficialPluginRecord> & { manifest: PluginManifest }
): InstalledOfficialPluginRecord {
	return {
		code: null,
		enabled: true,
		origin: { kind: 'user' as const },
		installedAt: 1,
		...overrides
	};
}

const BASE_MANIFEST: PluginManifest = {
	id: 'test-plugin',
	name: { 'zh-CN': 'Test' },
	version: '0.4.0',
	description: { 'zh-CN': 'Test' },
	author: 'Chronos',
	type: 'tool',
	bundleFormat: 'esm',
	bundleUrl: '/official-plugins/bundles/test-plugin/bundle.js',
	sha256: 'abc'
};

describe('isOfficialCatalogManifestUrl', () => {
	it('matches built-in official manifest paths', () => {
		expect(
			isOfficialCatalogManifestUrl('/official-plugins/manifests/tool-today.manifest.json')
		).toBe(true);
	});

	it('rejects external URLs', () => {
		expect(isOfficialCatalogManifestUrl('https://cdn.example.com/manifest.json')).toBe(false);
	});
});

describe('shouldSyncInstalledPlugin', () => {
	it('skips when versions already match and assets are complete', () => {
		expect(
			shouldSyncInstalledPlugin(
				record({
					manifest: { ...BASE_MANIFEST, version: '0.4.1' },
					manifestUrl: '/official-plugins/manifests/test-plugin.manifest.json',
					code: 'export default {}',
					cssCode: '.x{color:red}'
				}),
				'0.4.1'
			)
		).toBe(false);
	});

	it('does not backfill same-version tool plugins missing cssCode', () => {
		expect(
			shouldSyncInstalledPlugin(
				record({
					manifest: { ...BASE_MANIFEST, version: '0.4.1' },
					manifestUrl: '/official-plugins/manifests/test-plugin.manifest.json',
					code: 'export default {}'
				}),
				'0.4.1'
			)
		).toBe(false);
	});

	it('does not infer an official source for records without a manifest URL', () => {
		expect(shouldSyncInstalledPlugin(record({ manifest: BASE_MANIFEST }), '0.4.1')).toBe(false);
	});

	it('syncs stale official plugins', () => {
		expect(
			shouldSyncInstalledPlugin(
				record({
					manifest: BASE_MANIFEST,
					manifestUrl: '/official-plugins/manifests/test-plugin.manifest.json'
				}),
				'0.4.1'
			)
		).toBe(true);
	});

	it('skips external link installs even when versions differ', () => {
		expect(
			shouldSyncInstalledPlugin(
				record({
					manifest: BASE_MANIFEST,
					manifestUrl: 'https://cdn.example.com/plugins/test/manifest.json'
				}),
				'0.4.1'
			)
		).toBe(false);
	});
});

describe('buildCatalogManifestMap', () => {
	it('indexes manifests by plugin id', async () => {
		const manifest: PluginManifest = { ...BASE_MANIFEST, version: '0.4.1' };
		const map = await buildCatalogManifestMap(
			{
				version: 1,
				updatedAt: 1,
				manifests: ['/official-plugins/manifests/test-plugin.manifest.json']
			},
			async () => manifest
		);

		expect(map.get('test-plugin')).toEqual({
			manifest,
			manifestUrl: '/official-plugins/manifests/test-plugin.manifest.json'
		});
	});
});

describe('release-specific sync', () => {
	it('updates required plugins from local assets and optional plugins from Pages, leaving external installs alone', async () => {
		const { vi } = await import('vite-plus/test');
		const { syncInstalledPluginsWithHost } = await import('./sync-installed-plugins');
		const remote = 'https://ue-dnd.github.io/Chronos/plugins/releases/';
		const url = (version: string, id: string) =>
			`${remote}${version}/manifests/rev/${id}.manifest.json`;
		const records = [
			record({
				manifest: { ...BASE_MANIFEST, id: 'required' },
				manifestUrl: url('0.4.0', 'required')
			}),
			record({
				manifest: { ...BASE_MANIFEST, id: 'optional' },
				manifestUrl: url('0.4.0', 'optional')
			}),
			record({
				manifest: { ...BASE_MANIFEST, id: 'external' },
				manifestUrl: 'https://external.example/manifest.json'
			})
		];
		const install = vi.fn(async () => {});
		const fetchCatalog = vi.fn(async (catalog: string) => ({
			version: 1,
			updatedAt: 0,
			manifests: catalog.startsWith('/')
				? ['/official-plugins/manifests/rev/required.manifest.json']
				: [url('0.4.1', 'optional')]
		}));
		const fetchManifest = vi.fn(async (path: string) => ({
			...BASE_MANIFEST,
			id: path.includes('required') ? 'required' : 'optional',
			version: '0.4.1'
		}));
		vi.stubEnv('DEV', false);
		try {
			await syncInstalledPluginsWithHost({
				hostVersion: '0.4.1',
				preinstallIds: ['required'],
				getInstalledRecords: () => records,
				install,
				catalogClient: { fetchCatalog, fetchManifest } as never
			});
			expect(fetchCatalog.mock.calls.map(([path]) => path)).toEqual([
				'/official-plugins/catalog.json',
				`${remote}0.4.1/catalog.json`
			]);
			expect(install.mock.calls).toHaveLength(2);
		} finally {
			vi.unstubAllEnvs();
		}
	});
	it('keeps stale cache when the remote catalog is unavailable or has the wrong version', async () => {
		const { vi } = await import('vite-plus/test');
		const { syncInstalledPluginsWithHost } = await import('./sync-installed-plugins');
		const url =
			'https://ue-dnd.github.io/Chronos/plugins/releases/0.4.1/manifests/rev/test-plugin.manifest.json';
		const install = vi.fn(async () => {});
		const cached = record({
			manifest: BASE_MANIFEST,
			code: 'cached',
			manifestUrl: url.replace('0.4.1', '0.4.0')
		});
		vi.stubEnv('DEV', false);
		try {
			for (const fail of [true, false]) {
				await syncInstalledPluginsWithHost({
					hostVersion: '0.4.1',
					getInstalledRecords: () => [cached],
					install,
					catalogClient: {
						fetchCatalog: async () => {
							if (fail) throw new Error('offline');
							return { version: 1, manifests: [url] };
						},
						fetchManifest: async () => BASE_MANIFEST
					} as never
				});
			}
			expect(install).not.toHaveBeenCalled();
			expect(cached.code).toBe('cached');
		} finally {
			vi.unstubAllEnvs();
		}
	});
});
