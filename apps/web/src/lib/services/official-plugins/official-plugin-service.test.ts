import { describe, expect, it, vi, beforeEach, type Mock } from 'vite-plus/test';
import { ChronosEngine } from '@chronos/core';
import type {
	ChronosEnv,
	HttpRequestOptions,
	HttpResponse,
	StorageChangeEvent
} from '@chronos/core';
import { DEFAULT_USER_PREFERENCES, PLUGIN_CONFIG_STORAGE_KEY } from '@chronos/core';
import { OfficialPluginService } from './official-plugin-service';
import { OfficialPluginAssetPipeline } from './asset-pipeline';
import { OfficialPluginCatalogClient } from './catalog-client';
import { OfficialPluginInstalledStore } from './installed-store';
import { OfficialPluginRuntimeActivator } from './runtime-activator';
import { INSTALLED_STORAGE_KEY, OFFICIAL_PLUGINS_PLUGIN_ID } from './official-plugin-types';
import { loadEsmPluginFromCode } from './plugin-bundle';
import type { OfficialPluginCatalog, PluginManifest } from '@chronos/core';

type HttpMock = Mock<(url: string, options?: HttpRequestOptions) => Promise<HttpResponse>>;

const SAMPLE_BUNDLE = `
export default {
  id: 'test-plugin',
  name: function () { return 'Test'; },
  version: '1.0.0',
  apply: function (ctx) {
    ctx.registerSlot('mine.item', {
      id: 'test-item',
      sectionId: 'app-support',
      title: function () { return 'Test'; },
      href: '/test',
      order: 1
    });
  }
};
`;

function httpResponse(overrides: Partial<HttpResponse> = {}): HttpResponse {
	return {
		status: 200,
		statusText: 'OK',
		headers: {},
		ok: true,
		text: async () => '',
		json: async <T>() => undefined as T,
		bytes: async () => new Uint8Array(),
		...overrides
	};
}

function createMockEnv(httpRequest: HttpMock = vi.fn()) {
	const kv = new Map<string, unknown>();

	const env: ChronosEnv = {
		platform: 'node',
		http: {
			request: httpRequest
		},
		storage: {
			getTimetable: async () => null,
			listTimetables: async () => [],
			saveTimetable: async () => {},
			deleteTimetable: async () => {},
			getActiveTimetableId: async () => null,
			setActiveTimetableId: async () => {},
			queryCourses: async () => [],
			getPreferences: async () => ({ ...DEFAULT_USER_PREFERENCES }),
			savePreferences: async () => {},
			getPluginData: async <T>(pluginId: string, key: string): Promise<T | null> =>
				(kv.get(`${pluginId}:${key}`) as T) ?? null,
			setPluginData: async <T>(pluginId: string, key: string, val: T): Promise<void> => {
				kv.set(`${pluginId}:${key}`, val);
			},
			deletePluginData: async (pluginId: string, key: string): Promise<void> => {
				kv.delete(`${pluginId}:${key}`);
			},
			clearPluginData: async (pluginId: string): Promise<void> => {
				for (const key of kv.keys()) {
					if (key.startsWith(`${pluginId}:`)) kv.delete(key);
				}
			},
			onChanged: (_l: (e: StorageChangeEvent) => void) => ({ dispose: () => {} })
		},
		vault: {
			isSupported: async () => false,
			storeSecret: vi.fn(),
			getSecret: vi.fn(),
			removeSecret: vi.fn()
		},
		runtime: {
			sha256: async (data: string) => {
				const { createHash } = await import('node:crypto');
				return createHash('sha256').update(data).digest('hex');
			}
		}
	};

	return { env, httpRequest };
}

function createService(engine: ChronosEngine, hostVersion = '0.4.1'): OfficialPluginService {
	const installedStore = new OfficialPluginInstalledStore(engine);
	const runtimeActivator = new OfficialPluginRuntimeActivator(engine, (pluginId) =>
		installedStore.has(pluginId)
	);
	return new OfficialPluginService(engine, {
		catalogClient: new OfficialPluginCatalogClient(engine),
		assetPipeline: new OfficialPluginAssetPipeline(engine),
		installedStore,
		runtimeActivator,
		hostVersion
	});
}

const OFFICIAL_MANIFEST_URL = '/official-plugins/manifests/test-plugin.manifest.json';

describe('loadEsmPluginFromCode', () => {
	it('parses export default ESM plugin objects', async () => {
		const plugin = await loadEsmPluginFromCode(SAMPLE_BUNDLE);
		expect(plugin.id).toBe('test-plugin');
		expect(typeof plugin.apply).toBe('function');
	});

	it('rejects bundles without apply()', async () => {
		await expect(loadEsmPluginFromCode('export default { id: "x" };')).rejects.toThrow(
			/Invalid plugin bundle/
		);
	});

	it('does not fall back to named export plugin', async () => {
		const namedOnly = `
export const plugin = {
  id: 'named-plugin',
  name: function () { return 'Named'; },
  version: '1.0.0',
  apply: function () {}
};
`;
		await expect(loadEsmPluginFromCode(namedOnly)).rejects.toThrow(/Invalid plugin bundle/);
	});
});

describe('OfficialPluginService', () => {
	let engine: ChronosEngine;
	let service: OfficialPluginService;
	let httpRequest: HttpMock;
	let onNotification: ReturnType<typeof vi.fn>;

	beforeEach(async () => {
		httpRequest = vi.fn();
		onNotification = vi.fn();
		const mock = createMockEnv(httpRequest);
		engine = new ChronosEngine({
			env: mock.env,
			onNotification: onNotification as (message: string, type: 'error' | 'info' | 'warn') => void
		});
		await engine.init();
		service = createService(engine);
	});

	it('fetches and parses official plugin catalog', async () => {
		const catalog: OfficialPluginCatalog = {
			version: 1,
			updatedAt: Date.now(),
			manifests: ['/official-plugins/manifests/test.manifest.json']
		};

		httpRequest.mockResolvedValueOnce(
			httpResponse({
				json: async <T>() => catalog as T
			})
		);

		const result = await service.fetchCatalog('/official-plugins/catalog.json');
		expect(result.manifests.length).toBe(1);
	});

	it('installs plugin via loadPlugin after sha256 verification', async () => {
		const hash = await engine.env.runtime.sha256(SAMPLE_BUNDLE);
		const manifest: PluginManifest = {
			id: 'test-plugin',
			name: { 'zh-CN': 'Test' },
			version: '1.0.0',
			description: { 'zh-CN': 'Test plugin' },
			author: 'Chronos',
			type: 'tool',
			toolGroup: 'utility',
			bundleFormat: 'esm',
			bundleUrl: '/test.bundle.js',
			sha256: hash
		};

		httpRequest.mockResolvedValueOnce(httpResponse({ text: async () => SAMPLE_BUNDLE }));

		await service.install(manifest);
		expect(engine.isPluginLoaded('test-plugin')).toBe(true);
		expect(service.listInstalled().length).toBe(1);
	});

	it('rejects install when sha256 mismatch', async () => {
		const manifest: PluginManifest = {
			id: 'test-plugin',
			name: { 'zh-CN': 'Test' },
			version: '1.0.0',
			description: { 'zh-CN': 'Test plugin' },
			author: 'Chronos',
			type: 'tool',
			toolGroup: 'utility',
			bundleFormat: 'esm',
			bundleUrl: '/test.bundle.js',
			sha256: 'deadbeef'
		};

		httpRequest.mockResolvedValue(httpResponse({ text: async () => SAMPLE_BUNDLE }));

		await expect(service.install(manifest)).rejects.toThrow(/integrity check failed/);
	});

	it('does not persist record when activation fails', async () => {
		const mismatchedBundle = SAMPLE_BUNDLE.replace("id: 'test-plugin'", "id: 'other-plugin'");
		const hash = await engine.env.runtime.sha256(mismatchedBundle);
		const manifest: PluginManifest = {
			id: 'test-plugin',
			name: { 'zh-CN': 'Test' },
			version: '1.0.0',
			description: { 'zh-CN': 'Test plugin' },
			author: 'Chronos',
			type: 'tool',
			toolGroup: 'utility',
			bundleFormat: 'esm',
			bundleUrl: '/test.bundle.js',
			sha256: hash
		};

		httpRequest.mockResolvedValueOnce(httpResponse({ text: async () => mismatchedBundle }));

		await expect(service.install(manifest)).rejects.toThrow(/id mismatch/);
		expect(service.getInstalled('test-plugin')).toBeUndefined();
		expect(service.listInstalled()).toHaveLength(0);
	});

	it('uninstalls plugin and clears engine state', async () => {
		const hash = await engine.env.runtime.sha256(SAMPLE_BUNDLE);
		const manifest: PluginManifest = {
			id: 'test-plugin',
			name: { 'zh-CN': 'Test' },
			version: '1.0.0',
			description: { 'zh-CN': 'Test plugin' },
			author: 'Chronos',
			type: 'tool',
			toolGroup: 'utility',
			bundleFormat: 'esm',
			bundleUrl: '/test.bundle.js',
			sha256: hash
		};

		httpRequest.mockResolvedValueOnce(httpResponse({ text: async () => SAMPLE_BUNDLE }));
		await service.install(manifest);
		await service.uninstall('test-plugin');
		expect(engine.isPluginLoaded('test-plugin')).toBe(false);
	});

	it('uninstall wipes plugin-namespaced data', async () => {
		const hash = await engine.env.runtime.sha256(SAMPLE_BUNDLE);
		const manifest: PluginManifest = {
			id: 'test-plugin',
			name: { 'zh-CN': 'Test' },
			version: '1.0.0',
			description: { 'zh-CN': 'Test plugin' },
			author: 'Chronos',
			type: 'tool',
			toolGroup: 'utility',
			bundleFormat: 'esm',
			bundleUrl: '/test.bundle.js',
			sha256: hash
		};

		httpRequest.mockResolvedValueOnce(httpResponse({ text: async () => SAMPLE_BUNDLE }));
		await service.install(manifest);

		await engine.storage.setPluginData('test-plugin', 'wallpaper_image', { base64: 'x' });
		expect(await engine.storage.getPluginData('test-plugin', 'wallpaper_image')).not.toBeNull();

		await service.uninstall('test-plugin');

		expect(await engine.storage.getPluginData('test-plugin', 'wallpaper_image')).toBeNull();
		expect(
			await engine.storage.getPluginData('core.official-plugins', 'installed_plugins')
		).not.toBeNull();
	});

	it('keeps one installed record and activation across repeated initialization', async () => {
		const hash = await engine.env.runtime.sha256(SAMPLE_BUNDLE);
		const manifest: PluginManifest = {
			id: 'test-plugin',
			name: { 'zh-CN': 'Test' },
			version: '1.0.0',
			description: { 'zh-CN': 'Test plugin' },
			author: 'Chronos',
			type: 'tool',
			toolGroup: 'utility',
			bundleFormat: 'esm',
			bundleUrl: '/test.bundle.js',
			sha256: hash
		};

		await engine.loadPlugin(await loadEsmPluginFromCode(SAMPLE_BUNDLE));
		expect(engine.slots.getSlotItem('mine.item', 'test-item')).toBeDefined();

		await engine.storage.setPluginData('core.official-plugins', 'installed_plugins', {
			records: [
				{
					manifest,
					code: SAMPLE_BUNDLE,
					enabled: true,
					origin: { kind: 'user' as const },
					installedAt: Date.now()
				}
			],
			removed: [],
			seeded: true
		});

		const loadPluginSpy = vi.spyOn(engine, 'loadPlugin');
		await service.init();

		await service.init();
		expect(loadPluginSpy).toHaveBeenCalledTimes(1);
		expect(engine.isPluginLoaded('test-plugin')).toBe(true);
		expect(engine.slots.getSlotItem('mine.item', 'test-item')).toBeDefined();
		expect(service.listInstalled()).toHaveLength(1);

		const stored = await engine.storage.getPluginData<{ records: unknown[] }>(
			'core.official-plugins',
			'installed_plugins'
		);
		expect(stored?.records).toHaveLength(1);
	});

	it('resetAfterFactoryClear unloads plugins and clears installed cache', async () => {
		const hash = await engine.env.runtime.sha256(SAMPLE_BUNDLE);
		const manifest: PluginManifest = {
			id: 'test-plugin',
			name: { 'zh-CN': 'Test' },
			version: '1.0.0',
			description: { 'zh-CN': 'Test plugin' },
			author: 'Chronos',
			type: 'tool',
			toolGroup: 'utility',
			bundleFormat: 'esm',
			bundleUrl: '/test.bundle.js',
			sha256: hash
		};

		httpRequest.mockResolvedValueOnce(httpResponse({ text: async () => SAMPLE_BUNDLE }));
		await service.install(manifest);
		expect(engine.isPluginLoaded('test-plugin')).toBe(true);
		expect(service.listInstalled()).toHaveLength(1);

		await service.resetAfterFactoryClear();

		expect(engine.isPluginLoaded('test-plugin')).toBe(false);
		expect(service.listInstalled()).toHaveLength(0);
		expect(service.isPluginActive('test-plugin')).toBe(false);
	});

	it('installs from manifest URL', async () => {
		const hash = await engine.env.runtime.sha256(SAMPLE_BUNDLE);
		const manifest: PluginManifest = {
			id: 'test-plugin',
			name: { 'zh-CN': 'Link' },
			version: '1.0.0',
			description: { 'zh-CN': 'Link plugin' },
			author: 'Community',
			type: 'tool',
			toolGroup: 'utility',
			bundleFormat: 'esm',
			bundleUrl: 'bundle.js',
			sha256: hash
		};
		const manifestUrl = 'https://cdn.example.com/plugins/link/manifest.json';

		httpRequest.mockImplementation(async (url: string) => {
			if (url === manifestUrl) {
				return httpResponse({ json: async <T>() => manifest as T });
			}
			if (url.startsWith('https://cdn.example.com/plugins/link/bundle.js')) {
				return httpResponse({ text: async () => SAMPLE_BUNDLE });
			}
			throw new Error(`Unexpected URL: ${url}`);
		});

		await service.installFromManifestUrl(manifestUrl);
		expect(engine.isPluginLoaded('test-plugin')).toBe(true);
		expect(httpRequest).toHaveBeenCalledWith(
			expect.stringContaining('https://cdn.example.com/plugins/link/bundle.js?v='),
			expect.anything()
		);
	});

	it('rejects invalid manifest install URLs', async () => {
		await expect(service.installFromManifestUrl('javascript:alert(1)')).rejects.toThrow(
			/http or https/
		);
	});

	it('activates cached plugins before awaiting catalog sync', async () => {
		const hash = await engine.env.runtime.sha256(SAMPLE_BUNDLE);
		const completeManifest: PluginManifest = {
			id: 'test-plugin',
			name: { 'zh-CN': 'Test' },
			version: '0.4.1',
			description: { 'zh-CN': 'Test plugin' },
			author: 'Chronos',
			type: 'tool',
			toolGroup: 'utility',
			bundleFormat: 'esm',
			bundleUrl: '/test.bundle.js',
			sha256: hash
		};

		await engine.storage.setPluginData(OFFICIAL_PLUGINS_PLUGIN_ID, INSTALLED_STORAGE_KEY, {
			records: [
				{
					manifest: completeManifest,
					code: SAMPLE_BUNDLE,
					cssCode: '.x{color:red}',
					manifestUrl: OFFICIAL_MANIFEST_URL,
					enabled: true,
					origin: { kind: 'user' as const },
					installedAt: Date.now()
				}
			],
			removed: [],
			seeded: true
		});

		const syncSpy = vi
			.spyOn(
				Object.getPrototypeOf(service) as { syncWithHostCatalog(): Promise<void> },
				'syncWithHostCatalog'
			)
			.mockImplementation(() => new Promise(() => {}));

		try {
			const initPromise = service.init();
			await vi.waitFor(() => {
				expect(engine.isPluginLoaded('test-plugin')).toBe(true);
			});
			await expect(
				Promise.race([
					initPromise,
					new Promise((_, reject) => setTimeout(() => reject(new Error('still pending')), 50))
				])
			).rejects.toThrow('still pending');
		} finally {
			syncSpy.mockRestore();
		}
	});

	it('syncs stale official plugins from catalog during init without notifications', async () => {
		const hash = await engine.env.runtime.sha256(SAMPLE_BUNDLE);
		const staleManifest: PluginManifest = {
			id: 'test-plugin',
			name: { 'zh-CN': 'Test' },
			version: '0.4.0',
			description: { 'zh-CN': 'Test plugin' },
			author: 'Chronos',
			type: 'tool',
			toolGroup: 'utility',
			bundleFormat: 'esm',
			bundleUrl: '/test.bundle.js',
			sha256: hash
		};
		const freshManifest: PluginManifest = {
			...staleManifest,
			version: '0.4.1'
		};

		await engine.storage.setPluginData(OFFICIAL_PLUGINS_PLUGIN_ID, INSTALLED_STORAGE_KEY, {
			records: [
				{
					manifest: staleManifest,
					code: SAMPLE_BUNDLE,
					manifestUrl: OFFICIAL_MANIFEST_URL,
					enabled: true,
					origin: { kind: 'user' as const },
					installedAt: Date.now()
				}
			],
			removed: [],
			seeded: true
		});

		httpRequest.mockImplementation(async (url: string) => {
			if (url === '/official-plugins/catalog.json') {
				return httpResponse({
					json: async <T>() =>
						({
							version: 1,
							updatedAt: Date.now(),
							manifests: [OFFICIAL_MANIFEST_URL]
						}) as T
				});
			}
			if (url === OFFICIAL_MANIFEST_URL) {
				return httpResponse({ json: async <T>() => freshManifest as T });
			}
			if (
				url.split('?')[0] === '/test.bundle.js' ||
				url.split('?')[0] === 'http://localhost/test.bundle.js'
			) {
				return httpResponse({ text: async () => SAMPLE_BUNDLE });
			}
			throw new Error(`Unexpected URL: ${url}`);
		});

		await service.init();

		expect(service.getInstalled('test-plugin')?.manifest.version).toBe('0.4.1');
		expect(onNotification).not.toHaveBeenCalled();
	});

	it('does not sync external link installs during init', async () => {
		const hash = await engine.env.runtime.sha256(SAMPLE_BUNDLE);
		const manifest: PluginManifest = {
			id: 'test-plugin',
			name: { 'zh-CN': 'Link' },
			version: '0.4.0',
			description: { 'zh-CN': 'Link plugin' },
			author: 'Community',
			type: 'tool',
			toolGroup: 'utility',
			bundleFormat: 'esm',
			bundleUrl: 'bundle.js',
			sha256: hash
		};
		const manifestUrl = 'https://cdn.example.com/plugins/link/manifest.json';

		await engine.storage.setPluginData(OFFICIAL_PLUGINS_PLUGIN_ID, INSTALLED_STORAGE_KEY, {
			records: [
				{
					manifest,
					code: SAMPLE_BUNDLE,
					manifestUrl,
					enabled: true,
					origin: { kind: 'user' as const },
					installedAt: Date.now()
				}
			],
			removed: [],
			seeded: true
		});

		await service.init();

		expect(service.getInstalled('test-plugin')?.manifest.version).toBe('0.4.0');
		expect(httpRequest).not.toHaveBeenCalled();
	});

	it('keeps cached official plugins when catalog sync fails during init', async () => {
		const hash = await engine.env.runtime.sha256(SAMPLE_BUNDLE);
		const staleManifest: PluginManifest = {
			id: 'test-plugin',
			name: { 'zh-CN': 'Test' },
			version: '0.4.0',
			description: { 'zh-CN': 'Test plugin' },
			author: 'Chronos',
			type: 'tool',
			toolGroup: 'utility',
			bundleFormat: 'esm',
			bundleUrl: '/test.bundle.js',
			sha256: hash
		};

		await engine.storage.setPluginData(OFFICIAL_PLUGINS_PLUGIN_ID, INSTALLED_STORAGE_KEY, {
			records: [
				{
					manifest: staleManifest,
					code: SAMPLE_BUNDLE,
					manifestUrl: OFFICIAL_MANIFEST_URL,
					enabled: true,
					origin: { kind: 'user' as const },
					installedAt: Date.now()
				}
			],
			removed: [],
			seeded: true
		});

		httpRequest.mockRejectedValueOnce(new Error('offline'));

		await expect(service.init()).resolves.toBeUndefined();
		expect(service.getInstalled('test-plugin')?.manifest.version).toBe('0.4.0');
	});

	it('preserves plugin config when syncing stale official plugins during init', async () => {
		const hash = await engine.env.runtime.sha256(SAMPLE_BUNDLE);
		const staleManifest: PluginManifest = {
			id: 'test-plugin',
			name: { 'zh-CN': 'Test' },
			version: '0.4.0',
			description: { 'zh-CN': 'Test plugin' },
			author: 'Chronos',
			type: 'tool',
			toolGroup: 'utility',
			bundleFormat: 'esm',
			bundleUrl: '/test.bundle.js',
			sha256: hash
		};
		const freshManifest: PluginManifest = {
			...staleManifest,
			version: '0.4.1'
		};

		await engine.storage.setPluginData(OFFICIAL_PLUGINS_PLUGIN_ID, INSTALLED_STORAGE_KEY, {
			records: [
				{
					manifest: staleManifest,
					code: SAMPLE_BUNDLE,
					manifestUrl: OFFICIAL_MANIFEST_URL,
					enabled: true,
					origin: { kind: 'user' as const },
					installedAt: Date.now()
				}
			],
			removed: [],
			seeded: true
		});
		await engine.storage.setPluginData('test-plugin', PLUGIN_CONFIG_STORAGE_KEY, {
			enabled: true
		});

		httpRequest.mockImplementation(async (url: string) => {
			if (url === '/official-plugins/catalog.json') {
				return httpResponse({
					json: async <T>() =>
						({
							version: 1,
							updatedAt: Date.now(),
							manifests: [OFFICIAL_MANIFEST_URL]
						}) as T
				});
			}
			if (url === OFFICIAL_MANIFEST_URL) {
				return httpResponse({ json: async <T>() => freshManifest as T });
			}
			if (
				url.split('?')[0] === '/test.bundle.js' ||
				url.split('?')[0] === 'http://localhost/test.bundle.js'
			) {
				return httpResponse({ text: async () => SAMPLE_BUNDLE });
			}
			throw new Error(`Unexpected URL: ${url}`);
		});

		await service.init();

		expect(service.getInstalled('test-plugin')?.manifest.version).toBe('0.4.1');
		expect(await service.getPluginConfig<{ enabled: boolean }>('test-plugin')).toEqual({
			enabled: true
		});
	});

	it('installs plugin through installQueue with progress and state transitions', async () => {
		const queuedBundle = SAMPLE_BUNDLE.replace(/test-plugin/g, 'queued-plugin');
		const hash = await engine.env.runtime.sha256(queuedBundle);
		const manifest: PluginManifest = {
			id: 'queued-plugin',
			name: { 'zh-cn': 'Queued Plugin', en: 'Queued Plugin' },
			version: '1.0.0',
			bundleUrl: '/queued.bundle.js',
			bundleFormat: 'esm',
			description: { 'zh-cn': 'Queued description', en: 'Queued description' },
			author: 'Test Author',
			sha256: hash,
			type: 'tool',
			toolGroup: 'utility'
		};

		httpRequest.mockImplementation(async () => {
			return httpResponse({ text: async () => queuedBundle });
		});

		expect(service.installQueue.getTask('queued-plugin')).toBeUndefined();

		service.installQueue.enqueue(manifest);

		expect(service.installQueue.isBusy('queued-plugin')).toBe(true);

		await vi.waitFor(() => {
			expect(service.getInstalled('queued-plugin')).toBeDefined();
		});

		expect(service.installQueue.getTask('queued-plugin')).toBeUndefined();
		expect(service.isPluginActive('queued-plugin')).toBe(true);
	});

	it('rolls back active runtime when hot update activation fails', async () => {
		const hash = await engine.env.runtime.sha256(SAMPLE_BUNDLE);
		const manifest: PluginManifest = {
			id: 'test-plugin',
			name: { 'zh-CN': 'Test' },
			version: '1.0.0',
			description: { 'zh-CN': 'Test plugin' },
			author: 'Chronos',
			type: 'tool',
			toolGroup: 'utility',
			bundleFormat: 'esm',
			bundleUrl: '/test.bundle.js',
			sha256: hash
		};

		httpRequest.mockResolvedValueOnce(httpResponse({ text: async () => SAMPLE_BUNDLE }));
		await service.install(manifest);
		expect(service.isPluginActive('test-plugin')).toBe(true);

		const mismatchedBundle = SAMPLE_BUNDLE.replace("id: 'test-plugin'", "id: 'other-plugin'");
		await expect(
			service.applyHotUpdate({
				id: 'test-plugin',
				code: mismatchedBundle,
				cssCode: null,
				colorsJson: null,
				iconThemeJson: null
			})
		).rejects.toThrow(/id mismatch/);

		expect(service.getInstalled('test-plugin')?.code).toBe(SAMPLE_BUNDLE);
		expect(service.isPluginActive('test-plugin')).toBe(true);
	});

	it('updates disabled plugin assets through applyHotUpdate without activating runtime', async () => {
		const hash = await engine.env.runtime.sha256(SAMPLE_BUNDLE);
		const manifest: PluginManifest = {
			id: 'test-plugin',
			name: { 'zh-CN': 'Test' },
			version: '1.0.0',
			description: { 'zh-CN': 'Test plugin' },
			author: 'Chronos',
			type: 'tool',
			toolGroup: 'utility',
			bundleFormat: 'esm',
			bundleUrl: '/test.bundle.js',
			sha256: hash
		};

		httpRequest.mockResolvedValueOnce(httpResponse({ text: async () => SAMPLE_BUNDLE }));
		await service.install(manifest);
		await service.disable('test-plugin');
		await engine.storage.setPluginData('test-plugin', PLUGIN_CONFIG_STORAGE_KEY, {
			choice: 'kept'
		});
		await engine.storage.setPluginData('test-plugin', 'private', { draft: 'kept' });

		const updatedBundle = SAMPLE_BUNDLE.replace('Test', 'Updated');
		const updated = await service.applyHotUpdate({
			id: 'test-plugin',
			code: updatedBundle,
			cssCode: null,
			colorsJson: null,
			iconThemeJson: null
		});

		expect(updated.code).toBe(updatedBundle);
		expect(updated.enabled).toBe(false);
		expect(await engine.storage.getPluginData('test-plugin', PLUGIN_CONFIG_STORAGE_KEY)).toEqual({
			choice: 'kept'
		});
		expect(await engine.storage.getPluginData('test-plugin', 'private')).toEqual({ draft: 'kept' });
		expect(service.isPluginActive('test-plugin')).toBe(false);
	});

	it('rolls back runtime when an upgrade install is aborted after deactivation', async () => {
		const hash = await engine.env.runtime.sha256(SAMPLE_BUNDLE);
		const manifestV1: PluginManifest = {
			id: 'test-plugin',
			name: { 'zh-CN': 'Test' },
			version: '1.0.0',
			description: { 'zh-CN': 'Test plugin' },
			author: 'Chronos',
			type: 'tool',
			toolGroup: 'utility',
			bundleFormat: 'esm',
			bundleUrl: '/test.bundle.js',
			sha256: hash
		};

		const installedStore = new OfficialPluginInstalledStore(engine);
		const runtimeActivator = new OfficialPluginRuntimeActivator(engine, (pluginId) =>
			installedStore.has(pluginId)
		);
		const rollbackService = new OfficialPluginService(engine, {
			catalogClient: new OfficialPluginCatalogClient(engine),
			assetPipeline: new OfficialPluginAssetPipeline(engine),
			installedStore,
			runtimeActivator,
			hostVersion: '0.4.1'
		});

		httpRequest.mockResolvedValue(httpResponse({ text: async () => SAMPLE_BUNDLE }));
		await rollbackService.install(manifestV1);
		expect(rollbackService.getInstalled('test-plugin')?.manifest.version).toBe('1.0.0');
		expect(rollbackService.isPluginActive('test-plugin')).toBe(true);

		const controller = new AbortController();
		const originalDeactivate = runtimeActivator.deactivate.bind(runtimeActivator);
		const deactivateSpy = vi
			.spyOn(runtimeActivator, 'deactivate')
			.mockImplementation(async (pluginId, options) => {
				await originalDeactivate(pluginId, options);
				controller.abort();
			});

		const manifestV2: PluginManifest = {
			...manifestV1,
			version: '2.0.0'
		};

		await expect(
			rollbackService.install(manifestV2, undefined, { signal: controller.signal })
		).rejects.toMatchObject({ name: 'AbortError' });

		expect(rollbackService.getInstalled('test-plugin')?.manifest.version).toBe('1.0.0');
		expect(rollbackService.isPluginActive('test-plugin')).toBe(true);

		deactivateSpy.mockRestore();
	});
});

describe('profile preinstallation lifecycle', () => {
	async function setupProfile() {
		const { env, httpRequest } = createMockEnv();
		const engine = new ChronosEngine({ env });
		await engine.init();
		const colors = JSON.stringify({
			id: 'custom-default',
			name: 'Custom',
			variants: {
				light: { colors: { 'color.primary': '#123456' } },
				dark: { colors: { 'color.primary': '#654321' } }
			}
		});
		const theme: PluginManifest = {
			id: 'custom-theme',
			name: { en: 'Custom' },
			description: {},
			author: 'Test',
			version: '0.4.1',
			type: 'theme',
			bundleFormat: 'esm',
			themeId: 'custom-default',
			colorsUrl: '/custom.json',
			colorsSha256: await env.runtime.sha256(colors)
		};
		const tool: PluginManifest = {
			id: 'test-plugin',
			name: { en: 'Tool' },
			description: {},
			author: 'Test',
			version: '0.4.1',
			type: 'tool',
			toolGroup: 'utility',
			bundleFormat: 'esm',
			bundleUrl: '/test.js',
			sha256: await env.runtime.sha256(SAMPLE_BUNDLE)
		};
		httpRequest.mockImplementation(async (url: string) => {
			const path = new URL(url, 'http://localhost').pathname;
			if (path.endsWith('custom-theme.manifest.json'))
				return httpResponse({ json: async <T>() => theme as T });
			if (path.endsWith('test-plugin.manifest.json'))
				return httpResponse({ json: async <T>() => tool as T });
			if (path === '/custom.json') return httpResponse({ text: async () => colors });
			if (path === '/test.js') return httpResponse({ text: async () => SAMPLE_BUNDLE });
			throw new Error(`Unexpected URL ${url}`);
		});
		const profile = {
			profileId: 'custom',
			name: 'Custom',
			defaultTheme: { pluginId: theme.id, themeId: 'custom-default' },
			preinstall: [{ id: theme.id }, { id: tool.id, config: { answer: 42 } }]
		};
		const service = createService(engine);
		await service.prepareProfile(profile);
		return { engine, env, httpRequest, profile, service, theme, tool, colors };
	}
	it('keeps the default theme selected throughout asset replacement', async () => {
		const { engine, service, theme } = await setupProfile();
		const changes: (string | null)[] = [];
		const subscription = engine.events.on('theme:changed', ({ themeId }) => {
			changes.push(themeId);
		});
		await service.install(theme, undefined, { system: true, silent: true });
		expect(changes.length).toBeGreaterThan(0);
		expect(changes).not.toContain(null);
		subscription.dispose();
		service.dispose();
		engine.dispose();
	});

	it('hot updates a JSON default to ESM and restores either format after failure', async () => {
		const { engine, service, theme, colors } = await setupProfile();
		const snapshot = JSON.parse(colors);
		const code = `export default {
			id: 'custom-theme', name: () => 'Custom', version: '1',
			apply(ctx) { ctx.registerSlot('theme.definition', {
				id: 'custom-default', name: 'Custom',
				workbenchColors: ${JSON.stringify({
					light: snapshot.variants.light.colors,
					dark: snapshot.variants.dark.colors
				})}
			}); }
		};`;
		const update = { id: theme.id, code, colorsJson: colors, cssCode: null, iconThemeJson: null };
		const original = service.getInstalled(theme.id);
		await expect(
			service.applyHotUpdate({ ...update, code: code.replace("'custom-default'", "'wrong'") })
		).rejects.toThrow('ESM theme must register');
		expect(service.getInstalled(theme.id)).toEqual(original);
		expect(engine.themes.isSelectable('custom-default')).toBe(true);
		expect(engine.themes.isSelectable('wrong')).toBe(false);
		await service.applyHotUpdate(update);
		expect(engine.isPluginLoaded(theme.id)).toBe(true);
		const first = engine.themes.getTheme('custom-default');
		await service.applyHotUpdate(update);
		expect(engine.themes.getTheme('custom-default')).not.toBe(first);
		await expect(
			service.applyHotUpdate({ ...update, code: code.replace("'custom-default'", "'wrong'") })
		).rejects.toThrow('ESM theme must register');
		expect(engine.isPluginLoaded(theme.id)).toBe(true);
		expect(engine.themes.isSelectable('wrong')).toBe(false);
		expect(engine.defaultThemeId).toBe('custom-default');
		expect(engine.state.activeThemeId).toBe('custom-default');
		await expect(engine.unloadPlugin(theme.id)).rejects.toThrow('cannot be removed');
		service.dispose();
		engine.dispose();
	});

	it('keeps failed enables disabled and allows retry', async () => {
		const { engine, service, profile, tool } = await setupProfile();
		await service.prepareProfile({
			...profile,
			preinstall: [{ id: profile.defaultTheme.pluginId }]
		});
		await service.install(tool);
		await service.disable(tool.id);
		const load = vi
			.spyOn(engine, 'loadPlugin')
			.mockRejectedValueOnce(new Error('activation failed'));
		await expect(service.enable(tool.id)).rejects.toThrow('activation failed');
		expect(service.getInstalled(tool.id)?.enabled).toBe(false);
		expect(service.isPluginActive(tool.id)).toBe(false);
		const store = new OfficialPluginInstalledStore(engine);
		await store.load();
		expect(store.find(tool.id)?.enabled).toBe(false);
		await service.enable(tool.id);
		expect(service.isPluginActive(tool.id)).toBe(true);
		expect(service.getInstalled(tool.id)?.enabled).toBe(true);
		load.mockRestore();
		service.dispose();
		engine.dispose();
	});

	it('rolls back activation when persisting the enabled flag fails', async () => {
		const { engine, service, profile, tool } = await setupProfile();
		await service.prepareProfile({
			...profile,
			preinstall: [{ id: profile.defaultTheme.pluginId }]
		});
		await service.install(tool);
		await service.disable(tool.id);
		const load = vi
			.spyOn(engine.storage, 'setPluginData')
			.mockRejectedValueOnce(new Error('storage failed'));
		await expect(service.enable(tool.id)).rejects.toThrow('storage failed');
		expect(service.getInstalled(tool.id)?.enabled).toBe(false);
		expect(service.isPluginActive(tool.id)).toBe(false);
		const store = new OfficialPluginInstalledStore(engine);
		await store.load();
		expect(store.find(tool.id)?.enabled).toBe(false);
		await service.enable(tool.id);
		expect(service.isPluginActive(tool.id)).toBe(true);
		expect(service.getInstalled(tool.id)?.enabled).toBe(true);
		load.mockRestore();
		service.dispose();
		engine.dispose();
	});

	it('boots a non-M3 default first and shares records with market management', async () => {
		const { engine, service } = await setupProfile();
		expect(engine.state.activeThemeId).toBe('custom-default');
		expect(service.listInstalled()).toHaveLength(1);
		await service.init();
		expect(service.listInstalled()).toHaveLength(2);
		expect(service.getInstalled('test-plugin')?.origin).toEqual({
			kind: 'profile',
			profileId: 'custom'
		});
		expect(engine.getPluginContext('test-plugin').config.answer).toBe(42);
		await expect(service.disable('custom-theme')).rejects.toThrow('required');
		await expect(service.uninstall('custom-theme')).rejects.toThrow('required');
		service.dispose();
		engine.dispose();
	});
	it('restores required installs and configuration, and releases plugins removed from the profile', async () => {
		const { engine, service, profile, tool } = await setupProfile();
		await service.init();
		await expect(service.disable(tool.id)).rejects.toThrow('required');
		await expect(service.uninstall(tool.id)).rejects.toThrow('required');
		const store = new OfficialPluginInstalledStore(engine);
		await store.load();
		await store.upsert({
			...service.getInstalled(tool.id)!,
			origin: { kind: 'user' },
			enabled: false
		});
		await engine.storage.setPluginData(tool.id, '__config__', { answer: 99 });
		service.dispose();
		const second = createService(engine);
		await second.prepareProfile({
			...profile,
			preinstall: [{ id: 'custom-theme' }, { id: tool.id, config: { answer: 0 } }]
		});
		await second.init();
		expect(second.getInstalled(tool.id)?.enabled).toBe(true);
		expect(second.isPreinstalledPlugin(tool.id)).toBe(true);
		expect(second.getInstalled(tool.id)?.origin).toEqual({ kind: 'user' });
		await expect(second.uninstall(tool.id)).rejects.toThrow('required');
		expect(second.getInstalled(tool.id)?.initialConfig).toEqual({ answer: 42 });
		await second.enable(tool.id);
		expect(engine.getPluginContext(tool.id).config.answer).toBe(99);
		await second.prepareProfile({ ...profile, preinstall: [{ id: 'custom-theme' }] });
		expect(second.isPreinstalledPlugin(tool.id)).toBe(false);
		await second.disable(tool.id);
		await second.uninstall(tool.id);
		second.dispose();
		const third = createService(engine);
		await third.prepareProfile(profile);
		await third.init();
		expect(third.getInstalled(tool.id)?.enabled).toBe(true);
		const state = await engine.storage.getPluginData<{ removed: string[] }>(
			OFFICIAL_PLUGINS_PLUGIN_ID,
			INSTALLED_STORAGE_KEY
		);
		expect(state?.removed).not.toContain(tool.id);
		third.dispose();
		engine.dispose();
	});
	it('activates verified stale default cache offline and rolls back an invalid replacement', async () => {
		const { engine, service, profile, httpRequest, theme } = await setupProfile();
		const original = service.getInstalled(theme.id);
		service.dispose();
		httpRequest.mockRejectedValue(new Error('offline'));
		const restarted = createService(engine, '0.4.2');
		await restarted.prepareProfile(profile);
		expect(engine.defaultThemeId).toBe('custom-default');
		await restarted.init();
		expect(engine.themes.isSelectable('custom-default')).toBe(true);
		const wrong = JSON.stringify({
			id: 'wrong',
			name: 'Wrong',
			variants: { light: { colors: {} }, dark: { colors: {} } }
		});
		await expect(
			restarted.applyHotUpdate({
				id: theme.id,
				code: null,
				cssCode: null,
				colorsJson: wrong,
				iconThemeJson: null
			})
		).rejects.toThrow('Invalid default theme');
		expect(restarted.getInstalled(theme.id)).toEqual(original);
		expect(engine.defaultThemeId).toBe('custom-default');
		expect(engine.themes.isSelectable('wrong')).toBe(false);
		restarted.dispose();
		engine.dispose();
	});
	it('overrides an old user removal for a newly required default provider', async () => {
		const { engine, service, profile, theme } = await setupProfile();
		service.dispose();
		await engine.storage.setPluginData(OFFICIAL_PLUGINS_PLUGIN_ID, INSTALLED_STORAGE_KEY, {
			records: [],
			removed: [theme.id],
			seeded: true
		});
		const next = createService(engine);
		await next.prepareProfile(profile);
		expect(next.getInstalled(theme.id)?.enabled).toBe(true);
		expect(engine.defaultThemeId).toBe('custom-default');
		next.dispose();
		engine.dispose();
	});
});
