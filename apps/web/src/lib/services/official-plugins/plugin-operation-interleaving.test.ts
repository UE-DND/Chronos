import { describe, expect, it, vi, beforeEach, type Mock } from 'vite-plus/test';
import {
	ChronosEngine,
	DEFAULT_USER_PREFERENCES,
	type ChronosEnv,
	type HttpRequestOptions,
	type HttpResponse,
	type PluginManifest
} from '@chronos/core';
import { OfficialPluginService } from './official-plugin-service';
import { OfficialPluginAssetPipeline } from './asset-pipeline';
import { OfficialPluginCatalogClient } from './catalog-client';
import { OfficialPluginInstalledStore } from './installed-store';
import { OfficialPluginRuntimeActivator } from './runtime-activator';

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
			onChanged: () => ({ dispose: () => {} })
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

describe('PluginOperationCoordinator interleaving in OfficialPluginService', () => {
	let engine: ChronosEngine;
	let service: OfficialPluginService;
	let httpRequest: HttpMock;

	beforeEach(async () => {
		httpRequest = vi.fn();
		const mock = createMockEnv(httpRequest);
		engine = new ChronosEngine({
			env: mock.env,
			onNotification: vi.fn()
		});
		await engine.init();
		service = createService(engine);
	});

	it('aborts in-flight install when uninstall is called concurrently, preventing resurrection', async () => {
		const hash = await engine.env.runtime.sha256(SAMPLE_BUNDLE);
		const manifest: PluginManifest = {
			id: 'test-plugin',
			name: { 'zh-CN': 'Test' },
			version: '1.0.0',
			description: { 'zh-CN': 'Test' },
			author: 'Chronos',
			type: 'tool',
			toolGroup: 'utility',
			bundleFormat: 'esm',
			bundleUrl: '/test.bundle.js',
			sha256: hash
		};

		let downloadStarted = false;
		let releaseDownload!: () => void;
		const downloadGate = new Promise<void>((resolve) => {
			releaseDownload = resolve;
		});

		httpRequest.mockImplementation(async (url, options) => {
			if (url.includes('test.bundle.js')) {
				downloadStarted = true;
				// Wait until released or signal aborted
				await new Promise<void>((resolve, reject) => {
					void downloadGate.then(resolve);
					options?.signal?.addEventListener('abort', () => {
						reject(new DOMException('Aborted', 'AbortError'));
					});
				});
				return httpResponse({ text: async () => SAMPLE_BUNDLE });
			}
			return httpResponse();
		});

		// Start install in background
		const installPromise = service.install(manifest, '/test.manifest.json');

		// Wait until install begins downloading
		while (!downloadStarted) {
			await new Promise((r) => setTimeout(r, 10));
		}

		// Interleave uninstall
		const uninstallPromise = service.uninstall('test-plugin');

		// Releasing download gate just in case
		releaseDownload();

		// Install should be aborted
		await expect(installPromise).rejects.toThrow(/abort/i);
		await uninstallPromise;

		// Assert plugin is not installed or active
		expect(service.getInstalled('test-plugin')).toBeUndefined();
		expect(engine.isPluginLoaded('test-plugin')).toBe(false);
	});

	it('aborts in-flight install when disable is called concurrently', async () => {
		const hash = await engine.env.runtime.sha256(SAMPLE_BUNDLE);
		const manifest: PluginManifest = {
			id: 'test-plugin',
			name: { 'zh-CN': 'Test' },
			version: '1.0.0',
			description: { 'zh-CN': 'Test' },
			author: 'Chronos',
			type: 'tool',
			toolGroup: 'utility',
			bundleFormat: 'esm',
			bundleUrl: '/test.bundle.js',
			sha256: hash
		};

		let downloadStarted = false;
		httpRequest.mockImplementation(async (url, options) => {
			if (url.includes('test.bundle.js')) {
				downloadStarted = true;
				await new Promise<void>((resolve, reject) => {
					options?.signal?.addEventListener('abort', () => {
						reject(new DOMException('Aborted', 'AbortError'));
					});
				});
				return httpResponse({ text: async () => SAMPLE_BUNDLE });
			}
			return httpResponse();
		});

		const installPromise = service.install(manifest, '/test.manifest.json');

		while (!downloadStarted) {
			await new Promise((r) => setTimeout(r, 10));
		}

		// disable aborts current operations for test-plugin
		const disablePromise = service.disable('test-plugin').catch(() => {
			// expected to throw Plugin not installed since it wasn't yet installed
		});

		await expect(installPromise).rejects.toThrow(/abort/i);
		await disablePromise;

		expect(service.getInstalled('test-plugin')).toBeUndefined();
		expect(engine.isPluginLoaded('test-plugin')).toBe(false);
	});

	it('aborts in-flight HMR update when uninstall is called', async () => {
		const hash = await engine.env.runtime.sha256(SAMPLE_BUNDLE);
		const manifest: PluginManifest = {
			id: 'test-plugin',
			name: { 'zh-CN': 'Test' },
			version: '1.0.0',
			description: { 'zh-CN': 'Test' },
			author: 'Chronos',
			type: 'tool',
			toolGroup: 'utility',
			bundleFormat: 'esm',
			bundleUrl: '/test.bundle.js',
			sha256: hash
		};

		httpRequest.mockResolvedValue(httpResponse({ text: async () => SAMPLE_BUNDLE }));
		await service.install(manifest, '/test.manifest.json');
		expect(service.getInstalled('test-plugin')).toBeDefined();

		// Now simulate slow wallpaper or asset download during applyHotUpdate
		const updatedCode = SAMPLE_BUNDLE.replace('1.0.0', '1.0.1');

		// Interleave: uninstall during HMR
		const abortController = new AbortController();
		const hmrPromise = service.applyHotUpdate(
			{
				id: 'test-plugin',
				code: updatedCode,
				cssCode: null,
				colorsJson: null,
				iconThemeJson: null
			},
			{ signal: abortController.signal }
		);

		const uninstallPromise = service.uninstall('test-plugin');

		await Promise.allSettled([hmrPromise, uninstallPromise]);

		expect(service.getInstalled('test-plugin')).toBeUndefined();
		expect(engine.isPluginLoaded('test-plugin')).toBe(false);
	});

	it('executes concurrent operations on different plugins independently', async () => {
		const bundleA = SAMPLE_BUNDLE.replace('test-plugin', 'plugin-a');
		const bundleB = SAMPLE_BUNDLE.replace('test-plugin', 'plugin-b');
		const hashA = await engine.env.runtime.sha256(bundleA);
		const hashB = await engine.env.runtime.sha256(bundleB);

		const manifestA: PluginManifest = {
			id: 'plugin-a',
			name: { 'zh-CN': 'A' },
			version: '1.0.0',
			description: { 'zh-CN': 'A' },
			author: 'Chronos',
			type: 'tool',
			toolGroup: 'utility',
			bundleFormat: 'esm',
			bundleUrl: '/a.bundle.js',
			sha256: hashA
		};
		const manifestB: PluginManifest = {
			id: 'plugin-b',
			name: { 'zh-CN': 'B' },
			version: '1.0.0',
			description: { 'zh-CN': 'B' },
			author: 'Chronos',
			type: 'tool',
			toolGroup: 'utility',
			bundleFormat: 'esm',
			bundleUrl: '/b.bundle.js',
			sha256: hashB
		};

		httpRequest.mockImplementation(async (url) => {
			if (url.includes('a.bundle.js')) {
				return httpResponse({ text: async () => bundleA });
			}
			if (url.includes('b.bundle.js')) {
				return httpResponse({ text: async () => bundleB });
			}
			return httpResponse();
		});

		await Promise.all([
			service.install(manifestA, '/a.manifest.json'),
			service.install(manifestB, '/b.manifest.json')
		]);

		expect(service.getInstalled('plugin-a')).toBeDefined();
		expect(service.getInstalled('plugin-b')).toBeDefined();
		expect(engine.isPluginLoaded('plugin-a')).toBe(true);
		expect(engine.isPluginLoaded('plugin-b')).toBe(true);
	});

	it('serializes operations on the same plugin in FIFO order', async () => {
		const hash = await engine.env.runtime.sha256(SAMPLE_BUNDLE);
		const manifest: PluginManifest = {
			id: 'test-plugin',
			name: { 'zh-CN': 'Test' },
			version: '1.0.0',
			description: { 'zh-CN': 'Test' },
			author: 'Chronos',
			type: 'tool',
			toolGroup: 'utility',
			bundleFormat: 'esm',
			bundleUrl: '/test.bundle.js',
			sha256: hash
		};

		httpRequest.mockResolvedValue(httpResponse({ text: async () => SAMPLE_BUNDLE }));
		await service.install(manifest, '/test.manifest.json');

		const executionOrder: string[] = [];

		const p1 = service.disable('test-plugin').then(() => {
			executionOrder.push('disable');
		});
		const p2 = service.enable('test-plugin').then(() => {
			executionOrder.push('enable');
		});

		await Promise.all([p1, p2]);

		expect(executionOrder).toEqual(['disable', 'enable']);
		expect(service.getInstalled('test-plugin')?.enabled).toBe(true);
		expect(engine.isPluginLoaded('test-plugin')).toBe(true);
	});
});
