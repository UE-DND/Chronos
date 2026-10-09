import { createPluginInstallationRepository } from '#lib/storage/plugin-installation-repository.ts';
import { createHash } from 'node:crypto';
import { APP_VERSION, HOST_BUILD } from '#lib/config/app-meta.ts';
import { readFile } from 'node:fs/promises';
import { afterAll } from 'vite-plus/test';
import { describe, it, expect, beforeEach, vi } from 'vite-plus/test';
import { PREFERENCE_STORAGE_KEYS } from '@chronos/core';
import {
	getAppController,
	disposeAppEngine,
	ensureEngineReady,
	ensureEngineFullyReady,
	getOfficialPluginService,
	resetAppToInitialState
} from './app-engine';
import type { ChronosDB } from '#lib/storage/db.ts';
import type { InstalledOfficialPluginRecord } from './official-plugins/official-plugin-types';

class MockLocalStorage implements Storage {
	private map = new Map<string, string>();
	get length(): number {
		return this.map.size;
	}
	clear(): void {
		this.map.clear();
	}
	getItem(key: string): string | null {
		return this.map.get(key) ?? null;
	}
	key(index: number): string | null {
		return Array.from(this.map.keys())[index] ?? null;
	}
	removeItem(key: string): void {
		this.map.delete(key);
	}
	setItem(key: string, value: string): void {
		this.map.set(key, value);
	}
}

function createMockDb(): ChronosDB {
	const pluginRows = new Map<string, unknown>();
	const binaryRows = new Map<string, unknown>();
	const imageRows = new Map<string, unknown>();
	const resourceRows = new Map<string, import('#lib/storage/db.ts').PluginResourceRow>();

	return {
		pluginResources: {
			get: vi.fn(async (id: string) => resourceRows.get(id)),
			bulkGet: vi.fn(async (ids: string[]) => ids.map((id) => resourceRows.get(id))),
			put: vi.fn(async (row: import('#lib/storage/db.ts').PluginResourceRow) => {
				resourceRows.set(row.id, row);
			}),
			bulkDelete: vi.fn(async (ids: string[]) => {
				for (const id of ids) resourceRows.delete(id);
			}),
			toArray: vi.fn(async () => [...resourceRows.values()])
		},
		timetables: {
			get: vi.fn(async () => undefined),
			put: vi.fn(async () => 'id'),
			delete: vi.fn(async () => {}),
			clear: vi.fn(async () => {}),
			orderBy: vi.fn(() => ({ reverse: () => ({ toArray: async () => [] }) }))
		},
		courses: {
			clear: vi.fn(async () => {}),
			where: vi.fn(() => ({
				equals: () => ({
					toArray: async () => [],
					primaryKeys: async () => [],
					delete: async () => {}
				})
			})),
			bulkPut: vi.fn(async () => {}),
			bulkDelete: vi.fn(async () => {})
		},
		pluginBinary: {
			get: vi.fn(async (id: string) => binaryRows.get(id)),
			delete: vi.fn(async (id: string) => {
				binaryRows.delete(id);
			}),
			put: vi.fn(async (row: { id: string }) => {
				binaryRows.set(row.id, row);
				return row.id;
			}),
			clear: vi.fn(async () => binaryRows.clear()),
			toArray: vi.fn(async () => [...binaryRows.values()])
		},
		pluginData: {
			toCollection: () => ({ primaryKeys: async () => [...pluginRows.keys()] }),
			bulkDelete: vi.fn(async (ids: string[]) => {
				for (const id of ids) pluginRows.delete(id);
			}),
			get: vi.fn(async (id: string) => pluginRows.get(id)),
			put: vi.fn(async (row: { id: string }) => {
				pluginRows.set(row.id, row);
				return row.id;
			}),
			delete: vi.fn(async (id: string) => {
				pluginRows.delete(id);
			}),
			clear: vi.fn(async () => pluginRows.clear()),
			toArray: vi.fn(async () => [...pluginRows.values()])
		},
		images: {
			toCollection: () => ({ primaryKeys: async () => [...imageRows.keys()] }),
			bulkDelete: vi.fn(async (ids: string[]) => {
				for (const id of ids) imageRows.delete(id);
			}),
			get: vi.fn(async (id: string) => imageRows.get(id)),
			put: vi.fn(async (row: { id: string }) => {
				imageRows.set(row.id, row);
				return row.id;
			}),
			delete: vi.fn(async (id: string) => {
				imageRows.delete(id);
			}),
			clear: vi.fn(async () => imageRows.clear()),
			toArray: vi.fn(async () => [...imageRows.values()])
		},
		transaction: vi.fn(async (_mode: string, ...args: unknown[]) => {
			const fn = args[args.length - 1] as () => Promise<void>;
			return fn();
		})
	} as unknown as ChronosDB;
}

describe('app-engine bootstrap', () => {
	beforeEach(() => {
		disposeAppEngine();
	});

	it('registers shell slots after profile bootstrap completes', async () => {
		const mockDb = createMockDb();
		const mockStore = new MockLocalStorage();
		const opts = { database: mockDb, localStorage: mockStore };

		const controller = getAppController(opts);
		expect(controller.getSlots('shell.bottom-bar.tab')).toEqual([]);

		await ensureEngineReady(opts);

		expect(controller.getSlots('shell.bottom-bar.tab').map((tab) => tab.id)).toEqual([
			'timetable',
			'mine'
		]);
		expect(controller.getSlots('mine.section').length).toBeGreaterThan(0);
	});

	it('initializes shared ChronosEngine and ReactiveChronosController with builtin plugins and m3 theme', async () => {
		const mockDb = createMockDb();
		const mockStore = new MockLocalStorage();

		const engine = await ensureEngineFullyReady({ database: mockDb, localStorage: mockStore });

		expect(engine).toBeDefined();
		expect(engine.themes.getTheme('m3-default')).toBeDefined();

		const controller = getAppController({ database: mockDb, localStorage: mockStore });
		expect(controller).toBeDefined();
		expect(controller.getSlots('import.source.tab').length).toBeGreaterThan(0);
		expect(controller.getSlots('export.action').length).toBeGreaterThan(0);
		expect(controller.getSlots('shell.bottom-bar.tab').map((tab) => tab.id)).toEqual([
			'timetable',
			'mine'
		]);
		expect(controller.getSlots('mine.section').length).toBeGreaterThan(0);
		expect(controller.getSlots('mine.item').length).toBeGreaterThan(0);
		expect(engine.themes.getThemes().length).toBeGreaterThan(0);
	});

	it('lists deferred builtins after the engine is fully ready', async () => {
		const mockDb = createMockDb();
		const mockStore = new MockLocalStorage();
		await ensureEngineFullyReady({ database: mockDb, localStorage: mockStore });
		const ids = getOfficialPluginService()
			.listInstalled()
			.map((plugin) => plugin.manifest.id);
		expect(ids).not.toContain('core-shell');
		expect(ids).toContain('theme-m3');
		expect(ids.length).toBeGreaterThan(1);
	});

	it('restores plugin theme from preferences after phase 2 bootstrap', async () => {
		const themeColorsJson = JSON.stringify({
			id: 'yumemita',
			name: 'YUMEMITA',
			variants: {
				light: { colors: { 'color.primary': '#2288dd' } },
				dark: { colors: { 'color.primary': '#2288dd' } }
			}
		});
		const installedThemePlugin: InstalledOfficialPluginRecord = {
			manifest: {
				id: 'theme-yumemita',
				name: { 'zh-CN': 'YUMEMITA' },
				version: '1.0.0',
				description: { 'zh-CN': 'Theme' },
				author: 'Chronos',
				type: 'theme',
				bundleFormat: 'esm',
				themeId: 'yumemita',
				colorsUrl: '/theme-yumemita.colors.json',
				colorsSha256: createHash('sha256').update(themeColorsJson).digest('hex')
			},
			acceptedHostVersion: APP_VERSION,
			colorsJson: themeColorsJson,
			manifestUrl: 'https://example.com/theme-yumemita.manifest.json',
			origin: { kind: 'user' as const },
			installedAt: 1
		};

		const mockDb = createMockDb();
		await createPluginInstallationRepository(mockDb).transaction((state) => {
			state.records = [installedThemePlugin];
			state.seeded = true;
		});

		const mockStore = new MockLocalStorage();
		mockStore.setItem(PREFERENCE_STORAGE_KEYS.visualThemeId, 'yumemita');

		vi.stubGlobal('requestIdleCallback', (cb: () => void) => {
			cb();
			return 1;
		});

		try {
			const engine = await ensureEngineFullyReady({ database: mockDb, localStorage: mockStore });
			expect(engine.themes.getTheme('yumemita')).toBeDefined();
			expect(engine.state.activeThemeId).toBe('yumemita');
		} finally {
			vi.unstubAllGlobals();
		}
	});

	it('waits for idle-scheduled phase 2 before listing deferred builtins', async () => {
		let idleQueued: (() => void) | undefined;
		vi.stubGlobal('requestIdleCallback', (cb: () => void) => {
			idleQueued = cb;
			return 1;
		});

		try {
			const mockDb = createMockDb();
			const mockStore = new MockLocalStorage();
			const fullyReady = ensureEngineFullyReady({ database: mockDb, localStorage: mockStore });

			await ensureEngineReady({ database: mockDb, localStorage: mockStore });
			expect(typeof idleQueued).toBe('function');

			let settled = false;
			void fullyReady.then(() => {
				settled = true;
			});
			await Promise.resolve();
			expect(settled).toBe(false);

			idleQueued?.();
			await fullyReady;
			expect(settled).toBe(true);

			const ids = getOfficialPluginService()
				.listInstalled()
				.map((plugin) => plugin.manifest.id);
			expect(ids).toContain('codec-share');
			expect(ids.length).toBeGreaterThan(1);
		} finally {
			vi.unstubAllGlobals();
		}
	});

	it('clears user data while reusing preinstalls without HTTP or installation', async () => {
		const mockDb = createMockDb();
		const mockStore = new MockLocalStorage();
		const engine = await ensureEngineFullyReady({ database: mockDb, localStorage: mockStore });
		const service = getOfficialPluginService();
		const before = structuredClone(service.listInstalled());
		const oldContext = engine.getPluginContext('theme-m3');
		await oldContext.updateConfig({ private: 'secret' });
		const request = vi.spyOn(engine.http, 'request').mockRejectedValue(new Error('offline'));
		const install = vi.spyOn(service, 'install');
		expect(await resetAppToInitialState()).toEqual({ status: 'complete' });
		expect(request).not.toHaveBeenCalled();
		expect(install).not.toHaveBeenCalled();
		expect(service.listInstalled().map((r) => [r.manifest.id, r.code, r.installedAt])).toEqual(
			before.map((r) => [r.manifest.id, r.code, r.installedAt])
		);
		expect(await engine.storage.getPluginData('theme-m3', '__config__')).toBeNull();
		expect(engine.getPluginContext('theme-m3')).not.toBe(oldContext);
		expect(engine.getPluginContext('theme-m3').config).not.toHaveProperty('private');
	});

	it('coalesces concurrent resets and runs host cleanup only once after the transaction', async () => {
		const mockDb = createMockDb();
		await ensureEngineFullyReady({ database: mockDb, localStorage: new MockLocalStorage() });
		const cleanup = vi.fn(async () => {
			expect(vi.spyOn(mockDb.timetables, 'clear')).toHaveBeenCalledOnce();
		});
		const first = resetAppToInitialState(cleanup);
		const second = resetAppToInitialState(cleanup);
		expect(second).toBe(first);
		expect(await first).toEqual({ status: 'complete' });
		expect(cleanup).toHaveBeenCalledOnce();
	});

	it('reports post-commit host cleanup failure while keeping preinstalls usable', async () => {
		const mockDb = createMockDb();
		await ensureEngineFullyReady({ database: mockDb, localStorage: new MockLocalStorage() });
		const log = vi.spyOn(console, 'error').mockImplementation(() => {});
		try {
			expect(
				await resetAppToInitialState(async () => {
					throw new Error('notification cleanup failed');
				})
			).toEqual({ status: 'recovery-failed' });
			expect(vi.spyOn(mockDb.timetables, 'clear')).toHaveBeenCalledOnce();
			expect(getOfficialPluginService().isPluginActive('theme-m3')).toBe(true);
		} finally {
			log.mockRestore();
		}
	});

	it.each(['missing', 'corrupt'])(
		'repairs only the affected preinstall after %s resources',
		async (kind) => {
			const mockDb = createMockDb();
			await ensureEngineFullyReady({
				database: mockDb,
				localStorage: new MockLocalStorage()
			});
			await createPluginInstallationRepository(mockDb).transaction((state) => {
				if (kind === 'missing')
					state.records = state.records.filter((r) => r.manifest.id !== 'codec-share');
				else state.records.find((r) => r.manifest.id === 'codec-share')!.code = 'corrupt';
			});
			const install = vi.spyOn(getOfficialPluginService(), 'install');
			const log = vi.spyOn(console, 'error').mockImplementation(() => {});
			try {
				expect(await resetAppToInitialState()).toEqual({ status: 'complete' });
				expect(install.mock.calls.map(([manifest]) => manifest.id)).toEqual(['codec-share']);
			} finally {
				log.mockRestore();
			}
		}
	);

	it('rejects an update lock before host cleanup or data deletion', async () => {
		const mockDb = createMockDb();
		const engine = await ensureEngineFullyReady({
			database: mockDb,
			localStorage: new MockLocalStorage()
		});
		const service = getOfficialPluginService();
		await service.installationStore.prepare({
			target: { ...HOST_BUILD, buildId: 'next' },
			revision: service.installationStore.revision,
			records: [],
			token: 'lock',
			until: Date.now() + 60_000
		});
		const cleanup = vi.fn(async () => {});
		await expect(resetAppToInitialState(cleanup)).rejects.toThrow();
		expect(cleanup).not.toHaveBeenCalled();
		expect(vi.spyOn(mockDb.timetables, 'clear')).not.toHaveBeenCalled();
		expect(engine.isPluginLoaded('theme-m3')).toBe(true);
	});

	it('retries profile restoration once after clearing data', async () => {
		const mockDb = createMockDb();
		const mockStore = new MockLocalStorage();
		await ensureEngineFullyReady({ database: mockDb, localStorage: mockStore });
		const service = getOfficialPluginService();
		const prepareProfile = vi
			.spyOn(service, 'prepareProfile')
			.mockRejectedValueOnce(new Error('temporary preinstall failure'));

		const result = await resetAppToInitialState();

		expect(result).toEqual({ status: 'complete' });
		expect(prepareProfile).toHaveBeenCalledTimes(2);
		expect(service.listInstalled().map((record) => record.manifest.id)).toEqual(
			expect.arrayContaining(['theme-m3', 'codec-share'])
		);
	});

	it('reports recovery failure after the data has already been cleared', async () => {
		const mockDb = createMockDb();
		const mockStore = new MockLocalStorage();
		await ensureEngineFullyReady({ database: mockDb, localStorage: mockStore });
		const service = getOfficialPluginService();
		vi.spyOn(service, 'prepareProfile').mockRejectedValue(new Error('preinstall unavailable'));
		const log = vi.spyOn(console, 'error').mockImplementation(() => {});

		try {
			const result = await resetAppToInitialState();

			expect(result).toEqual({ status: 'recovery-failed' });
			expect(
				JSON.parse(
					(await mockDb.pluginData.get('core.official-plugins:installed_plugins'))!.valueJson
				).records.map((r: InstalledOfficialPluginRecord) => r.manifest.id)
			).toContain('theme-m3');
		} finally {
			log.mockRestore();
		}
	});

	it('still rejects when the storage clearing phase fails', async () => {
		const mockDb = createMockDb();
		const mockStore = new MockLocalStorage();
		await ensureEngineFullyReady({ database: mockDb, localStorage: mockStore });
		vi.spyOn(mockDb.timetables, 'clear').mockRejectedValueOnce(new Error('storage unavailable'));

		await expect(resetAppToInitialState()).rejects.toThrow('storage unavailable');
	});
});

describe('theme preferences during deferred boot', () => {
	it('keeps a pending choice until restoration confirms it is absent', async () => {
		disposeAppEngine();
		let resume: (() => void) | undefined;
		vi.stubGlobal('requestIdleCallback', (cb: () => void) => {
			resume = cb;
			return 1;
		});
		const store = new MockLocalStorage();
		store.setItem(PREFERENCE_STORAGE_KEYS.visualThemeId, 'removed');
		try {
			const engine = await ensureEngineReady({ database: createMockDb(), localStorage: store });
			expect(engine.state.activeThemeId).toBe('m3-default');
			expect(store.getItem(PREFERENCE_STORAGE_KEYS.visualThemeId)).toBe('removed');
			resume?.();
			await ensureEngineFullyReady();
			expect(store.getItem(PREFERENCE_STORAGE_KEYS.visualThemeId)).toBe('m3-default');
		} finally {
			disposeAppEngine();
			vi.unstubAllGlobals();
		}
	});
	it('preserves a choice when its installed theme temporarily fails to activate', async () => {
		disposeAppEngine();
		const db = createMockDb();
		const record: InstalledOfficialPluginRecord = {
			manifest: {
				id: 'theme-broken',
				name: { en: 'Broken' },
				description: { en: '' },
				author: 'Test',
				version: '1',
				type: 'theme',
				bundleFormat: 'esm',
				themeId: 'broken',
				colorsUrl: '/broken.json'
			},
			colorsJson: 'invalid json',
			origin: { kind: 'user' as const },
			installedAt: 1
		};
		await createPluginInstallationRepository(db).transaction((state) => {
			state.records = [record];
			state.seeded = true;
		});
		const store = new MockLocalStorage();
		store.setItem(PREFERENCE_STORAGE_KEYS.visualThemeId, 'broken');
		const engine = await ensureEngineFullyReady({ database: db, localStorage: store });
		expect(engine.state.activeThemeId).toBe('m3-default');
		expect(store.getItem(PREFERENCE_STORAGE_KEYS.visualThemeId)).toBe('broken');
		disposeAppEngine();
	});
});

beforeEach(() => {
	vi.stubGlobal('fetch', async (input: string | URL | Request) => {
		const url = new URL(
			input instanceof Request ? input.url : input.toString(),
			'http://localhost'
		);
		const bytes = await readFile(new URL(`../../../static${url.pathname}`, import.meta.url));
		return new Response(bytes, { status: 200 });
	});
});
afterAll(() => {
	disposeAppEngine();
	vi.unstubAllGlobals();
});
