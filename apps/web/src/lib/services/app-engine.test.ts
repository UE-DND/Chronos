import { createHash } from 'node:crypto';
import { APP_VERSION } from '$lib/config/app-meta';
import { readFile } from 'node:fs/promises';
import { afterAll } from 'vite-plus/test';
import { describe, it, expect, beforeEach, vi } from 'vite-plus/test';
import { PREFERENCE_STORAGE_KEYS } from '@chronos/core';
import {
	getAppController,
	disposeAppEngine,
	ensureEngineReady,
	ensureEngineFullyReady,
	getOfficialPluginService
} from './app-engine';
import type { ChronosDB } from '$lib/storage/db';
import {
	INSTALLED_STORAGE_KEY,
	OFFICIAL_PLUGINS_PLUGIN_ID,
	type InstalledOfficialPluginRecord
} from './official-plugins/official-plugin-types';

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
	return {
		timetables: {
			get: vi.fn(async () => undefined),
			put: vi.fn(async () => 'id'),
			delete: vi.fn(async () => {}),
			orderBy: vi.fn(() => ({ reverse: () => ({ toArray: async () => [] }) }))
		},
		courses: {
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
			get: vi.fn(async () => undefined),
			delete: vi.fn(async () => {}),
			put: vi.fn(async () => {})
		},
		pluginData: {
			get: vi.fn(async (id: string) => pluginRows.get(id)),
			put: vi.fn(async (row: { id: string }) => {
				pluginRows.set(row.id, row);
				return row.id;
			}),
			delete: vi.fn(async (id: string) => {
				pluginRows.delete(id);
			})
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
			enabled: true,
			origin: { kind: 'user' as const },
			installedAt: 1
		};

		const installedPluginDataId = `${OFFICIAL_PLUGINS_PLUGIN_ID}:${INSTALLED_STORAGE_KEY}`;
		const installedPluginDataRow = {
			id: installedPluginDataId,
			pluginId: OFFICIAL_PLUGINS_PLUGIN_ID,
			key: INSTALLED_STORAGE_KEY,
			valueJson: JSON.stringify({
				records: [installedThemePlugin],
				removed: [],
				revision: 0,
				generation: '',
				seeded: true
			}),
			updatedAt: 1
		};
		const mockDb = createMockDb();
		const readPluginRow = mockDb.pluginData.get.bind(mockDb.pluginData);
		const getPluginData = vi.fn(
			async (id: string) =>
				(await readPluginRow(id)) ??
				(id === installedPluginDataId ? installedPluginDataRow : undefined)
		);
		Object.defineProperty(mockDb.pluginData, 'get', { value: getPluginData });

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
			enabled: true,
			origin: { kind: 'user' as const },
			installedAt: 1
		};
		const key = `${OFFICIAL_PLUGINS_PLUGIN_ID}:${INSTALLED_STORAGE_KEY}`;
		const readPluginRow = db.pluginData.get.bind(db.pluginData);
		Object.defineProperty(db.pluginData, 'get', {
			value: vi.fn(
				async (id: string) =>
					(await readPluginRow(id)) ??
					(id === key
						? {
								valueJson: JSON.stringify({
									records: [record],
									removed: [],
									revision: 0,
									generation: '',
									seeded: true
								})
							}
						: undefined)
			)
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
