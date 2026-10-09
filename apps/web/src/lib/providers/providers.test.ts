import { createPluginInstallationRepository } from '#lib/storage/plugin-installation-repository.ts';
import { emptyInstallationState } from '#lib/services/official-plugins/installed-store.ts';
import type { InstalledOfficialPluginRecord } from '#lib/services/official-plugins/official-plugin-types.ts';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vite-plus/test';
import {
	DexieStorageProvider,
	WebHttpProxyProvider,
	PluginProxyHttpAdapter,
	WebRuntimeProvider,
	WebAnalyticsProvider,
	createWebProviders,
	createWebChronosEnv
} from './index';
import { createCourse, createTimetable, StorageClearError } from '@chronos/core';
import type {
	ChronosDB,
	CourseRow,
	PluginBinaryRow,
	PluginDataRow,
	TimetableRow
} from '#lib/storage/db.ts';

const hostBase = vi.hoisted(() => ({ value: '' }));
const publicEnv = vi.hoisted(() => ({ PUBLIC_CHRONOS_SHARE_IMPORT_URL: '' }));
vi.mock('$app/paths', () => ({
	base: '',
	resolve: (path: string) => hostBase.value + '/' + path.replace(/^\//, '')
}));
vi.mock('$app/env/public', () => ({
	get PUBLIC_CHRONOS_SHARE_IMPORT_URL() {
		return publicEnv.PUBLIC_CHRONOS_SHARE_IMPORT_URL;
	}
}));
afterEach(() => {
	vi.unstubAllGlobals();
	hostBase.value = '';
	publicEnv.PUBLIC_CHRONOS_SHARE_IMPORT_URL = '';
});

vi.mock('#lib/boot/plugin-proxy-meta.generated.ts', () => ({
	deploymentHasServerPlugins: vi.fn(() => true)
}));

import { deploymentHasServerPlugins } from '#lib/boot/plugin-proxy-meta.generated.ts';

class MockStorage implements Storage {
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
	const timetablesMap = new Map<string, TimetableRow>();
	const coursesMap = new Map<string, CourseRow>();
	const pluginDataMap = new Map<string, PluginDataRow>();
	const pluginBinaryMap = new Map<string, PluginBinaryRow>();
	const imageRows = new Map<string, { id: string; blob: Blob }>();

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
		images: {
			toCollection: () => ({ primaryKeys: async () => [...imageRows.keys()] }),
			put: vi.fn(async (row: { id: string; blob: Blob }) => {
				imageRows.set(row.id, row);
				return row.id;
			}),
			get: vi.fn(async (id: string) => imageRows.get(id)),
			bulkDelete: vi.fn(async (ids: string[]) => {
				for (const id of ids) imageRows.delete(id);
			}),
			clear: vi.fn(async () => imageRows.clear()),
			toArray: vi.fn(async () => [...imageRows.values()])
		},
		timetables: {
			clear: vi.fn(async () => {
				timetablesMap.clear();
			}),
			get: vi.fn(async (id: string) => timetablesMap.get(id) ?? undefined),
			put: vi.fn(async (row: TimetableRow) => {
				timetablesMap.set(row.id, row);
				return row.id;
			}),
			delete: vi.fn(async (id: string) => {
				timetablesMap.delete(id);
			}),
			orderBy: vi.fn(() => ({
				reverse: () => ({
					toArray: async () =>
						Array.from(timetablesMap.values()).sort((a, b) => b.updatedAt - a.updatedAt)
				})
			})),
			toArray: async () => Array.from(timetablesMap.values())
		},
		courses: {
			clear: vi.fn(async () => {
				coursesMap.clear();
			}),
			where: vi.fn((_field: string) => ({
				equals: (val: unknown) => ({
					toArray: async () => Array.from(coursesMap.values()).filter((c) => c.timetableId === val),
					primaryKeys: async () =>
						Array.from(coursesMap.values())
							.filter((c) => c.timetableId === val)
							.map((c) => c.id),
					delete: async () => {
						for (const [id, c] of Array.from(coursesMap.entries())) {
							if (c.timetableId === val) coursesMap.delete(id);
						}
					}
				}),
				anyOf: (vals: unknown[]) => ({
					toArray: async () =>
						Array.from(coursesMap.values()).filter((c) =>
							(vals as string[]).includes(c.timetableId)
						)
				})
			})),
			toArray: async () => Array.from(coursesMap.values()),
			bulkPut: vi.fn(async (rows: CourseRow[]) => {
				for (const r of rows) coursesMap.set(r.id, r);
			}),
			bulkDelete: vi.fn(async (ids: string[]) => {
				for (const id of ids) coursesMap.delete(id);
			})
		},
		pluginData: {
			toCollection: () => ({ primaryKeys: async () => [...pluginDataMap.keys()] }),
			bulkDelete: vi.fn(async (ids: string[]) => {
				for (const id of ids) pluginDataMap.delete(id);
			}),
			clear: vi.fn(async () => {
				pluginDataMap.clear();
			}),
			get: vi.fn(async (id: string) => pluginDataMap.get(id) ?? undefined),
			put: vi.fn(async (row: PluginDataRow) => {
				pluginDataMap.set(row.id, row);
				return row.id;
			}),
			delete: vi.fn(async (id: string) => {
				pluginDataMap.delete(id);
			}),
			where: vi.fn(() => ({
				equals: (pluginId: string) => ({
					delete: async () => {
						for (const [id, row] of pluginDataMap.entries()) {
							if (row.pluginId === pluginId) pluginDataMap.delete(id);
						}
					}
				})
			})),
			toArray: async () => Array.from(pluginDataMap.values())
		},
		pluginBinary: {
			clear: vi.fn(async () => {
				pluginBinaryMap.clear();
			}),
			get: vi.fn(async (id: string) => pluginBinaryMap.get(id) ?? undefined),
			put: vi.fn(async (row: PluginBinaryRow) => {
				pluginBinaryMap.set(row.id, row);
				return row.id;
			}),
			delete: vi.fn(async (id: string) => {
				pluginBinaryMap.delete(id);
			}),
			where: vi.fn(() => ({
				equals: (pluginId: string) => ({
					delete: async () => {
						for (const [id, row] of pluginBinaryMap.entries()) {
							if (row.pluginId === pluginId) pluginBinaryMap.delete(id);
						}
					}
				})
			})),
			toArray: async () => Array.from(pluginBinaryMap.values())
		},
		transaction: vi.fn(async (_mode: string, ...args: unknown[]) => {
			const fn = args[args.length - 1] as () => Promise<void>;
			return fn();
		})
	} as unknown as ChronosDB;
}

describe('Web Providers', () => {
	let db: ChronosDB;
	let localStorage: MockStorage;

	beforeEach(() => {
		db = createMockDb();
		localStorage = new MockStorage();
	});

	it('DexieStorageProvider defaults timetableLayoutMode to compact when unset', async () => {
		const storage = new DexieStorageProvider(db, localStorage);
		expect((await storage.getPreferences()).timetableLayoutMode).toBe('compact');
	});

	it('DexieStorageProvider preserves timetableLayoutMode on partial preferences update', async () => {
		const storage = new DexieStorageProvider(db, localStorage);
		await storage.savePreferences({ timetableLayoutMode: 'compact' });
		expect((await storage.getPreferences()).timetableLayoutMode).toBe('compact');

		// Partial update of another preference should not reset layout mode
		await storage.savePreferences({ themeMode: 'dark' });
		const prefs = await storage.getPreferences();
		expect(prefs.themeMode).toBe('dark');
		expect(prefs.timetableLayoutMode).toBe('compact');
	});

	it('DexieStorageProvider persists capsuleCornerStyle rounded', async () => {
		const storage = new DexieStorageProvider(db, localStorage);
		await storage.savePreferences({ capsuleCornerStyle: 'rounded' });
		expect((await storage.getPreferences()).capsuleCornerStyle).toBe('rounded');

		await storage.savePreferences({ capsuleCornerStyle: 'pill' });
		expect((await storage.getPreferences()).capsuleCornerStyle).toBe('pill');

		await storage.savePreferences({ capsuleCornerStyle: 'sharp' });
		expect((await storage.getPreferences()).capsuleCornerStyle).toBe('sharp');
	});

	it('DexieStorageProvider reads and writes the locale preference', async () => {
		const storage = new DexieStorageProvider(db, localStorage);
		await storage.savePreferences({ locale: 'en' });
		expect((await storage.getPreferences()).locale).toBe('en');
	});

	it('DexieStorageProvider persists timetables, courses, and plugin data', async () => {
		const storage = new DexieStorageProvider(db, localStorage);

		const course = createCourse({
			id: 'c101',
			name: '计算机系统结构',
			dayOfWeek: 2,
			startPeriod: 3,
			endPeriod: 4,
			weeks: [1, 2, 3, 4]
		});

		const timetable = createTimetable({
			id: 'tt_test',
			name: '测试课表',
			courses: [course]
		});

		await storage.saveTimetable(timetable);

		const fetched = await storage.getTimetable('tt_test');
		expect(fetched).not.toBeNull();
		expect(fetched?.name).toBe('测试课表');
		expect(fetched?.courses.length).toBe(1);

		await storage.setPluginData('my-plugin', 'key1', { count: 42 });
		const pluginData = await storage.getPluginData<{ count: number }>('my-plugin', 'key1');
		expect(pluginData).toEqual({ count: 42 });

		const blob = new Blob([new Uint8Array([4, 5, 6])], { type: 'image/png' });
		await storage.setPluginData('my-plugin', 'binary', blob);
		const loadedBlob = await storage.getPluginData<Blob>('my-plugin', 'binary');
		expect(loadedBlob).toBeInstanceOf(Blob);
		expect(new Uint8Array(await (loadedBlob as Blob).arrayBuffer())).toEqual(
			new Uint8Array([4, 5, 6])
		);

		await storage.deletePluginData('my-plugin', 'key1');
		expect(await storage.getPluginData('my-plugin', 'key1')).toBeNull();

		storage.dispose();
	});

	it('DexieStorageProvider listTimetables counts distinct course names across tables', async () => {
		const storage = new DexieStorageProvider(db, localStorage);
		const older = Date.now() - 1000;
		const newer = Date.now();

		await storage.saveTimetable(
			createTimetable({
				id: 'tt_a',
				name: '课表 A',
				updatedAt: newer,
				courses: [
					createCourse({
						id: 'c-a1',
						name: '高等数学',
						dayOfWeek: 1,
						startPeriod: 1,
						endPeriod: 2,
						weeks: [1]
					}),
					createCourse({
						id: 'c-a2',
						name: '高等数学',
						dayOfWeek: 3,
						startPeriod: 1,
						endPeriod: 2,
						weeks: [1]
					})
				]
			})
		);
		await storage.saveTimetable(
			createTimetable({
				id: 'tt_b',
				name: '课表 B',
				updatedAt: older,
				courses: [
					createCourse({
						id: 'c-b1',
						name: '线性代数',
						dayOfWeek: 2,
						startPeriod: 1,
						endPeriod: 2,
						weeks: [1]
					})
				]
			})
		);

		const list = await storage.listTimetables();
		expect(list.map((entry) => ({ id: entry.id, courseCount: entry.courseCount }))).toEqual([
			{ id: 'tt_a', courseCount: 1 },
			{ id: 'tt_b', courseCount: 1 }
		]);

		storage.dispose();
	});

	it('DexieStorageProvider queryCourses returns cross-timetable hits in one call', async () => {
		const storage = new DexieStorageProvider(db, localStorage);

		const courseA = createCourse({
			id: 'c-a',
			name: '数据结构',
			location: 'A101',
			dayOfWeek: 3,
			startPeriod: 1,
			endPeriod: 2,
			weeks: [1]
		});
		const courseB = createCourse({
			id: 'c-b',
			name: '操作系统',
			location: 'B202',
			dayOfWeek: 3,
			startPeriod: 3,
			endPeriod: 4,
			weeks: [1]
		});

		await storage.saveTimetable(
			createTimetable({ id: 'tt_a', name: '课表 A', courses: [courseA] })
		);
		await storage.saveTimetable(
			createTimetable({ id: 'tt_b', name: '课表 B', courses: [courseB] })
		);

		const hits = await storage.queryCourses({ dayOfWeek: 3, week: 1 });
		expect(hits).toHaveLength(2);
		expect(hits.map((h) => h.timetableId).sort()).toEqual(['tt_a', 'tt_b']);

		const roomHits = await storage.queryCourses({ location: { contains: 'A101' } });
		expect(roomHits).toHaveLength(1);
		expect(roomHits[0]?.course.name).toBe('数据结构');

		storage.dispose();
	});

	it('createWebProviders instantiates all web providers', () => {
		const providers = createWebProviders({ database: db, localStorage, enablePluginProxy: true });
		expect(providers.storage).toBeInstanceOf(DexieStorageProvider);
		expect(providers.http).toBeInstanceOf(PluginProxyHttpAdapter);
		expect(providers.runtime).toBeInstanceOf(WebRuntimeProvider);
		expect(providers.analytics).toBeInstanceOf(WebAnalyticsProvider);
	});

	it('WebHttpProxyProvider enforces SSRF and domain whitelist protection', async () => {
		const http = new WebHttpProxyProvider(['allowed.example.com']);

		// SSRF attack: loopback
		await expect(http.request('http://127.0.0.1:8080/admin', { bypassCors: true })).rejects.toThrow(
			/SSRF Protection/
		);

		// SSRF attack: private IP
		await expect(http.request('http://192.168.1.1/gateway', { bypassCors: true })).rejects.toThrow(
			/SSRF Protection/
		);

		// Whitelist rejection
		await expect(
			http.request('https://evil.attacker.com/steal', { bypassCors: true })
		).rejects.toThrow(/not in the allowed proxy whitelist/);
	});

	it('WebHttpProxyProvider aborts fetch when timeout elapses alongside an external signal', async () => {
		const http = new WebHttpProxyProvider();
		const fetchMock = vi.fn((_url: string, init?: RequestInit) => {
			return new Promise<Response>((_resolve, reject) => {
				init?.signal?.addEventListener('abort', () => {
					reject(new DOMException('Aborted', 'AbortError'));
				});
			});
		});
		vi.stubGlobal('fetch', fetchMock);

		await expect(
			http.request('https://example.com/slow', {
				timeoutMs: 30,
				signal: new AbortController().signal
			})
		).rejects.toMatchObject({ name: 'TimeoutError' });

		expect(fetchMock).toHaveBeenCalledTimes(1);
		expect(fetchMock.mock.calls[0]?.[1]?.signal).toBeDefined();

		vi.unstubAllGlobals();
	});

	it('WebHttpProxyProvider rejects bypassCors when server plugins are disabled', async () => {
		vi.mocked(deploymentHasServerPlugins).mockReturnValue(false);
		const http = new WebHttpProxyProvider();

		await expect(http.request('https://example.com/api', { bypassCors: true })).rejects.toThrow(
			'Server-side proxy is not available in this build'
		);

		vi.mocked(deploymentHasServerPlugins).mockReturnValue(true);
	});

	it('WebRuntimeProvider supports sha256 hashing', async () => {
		const runtime = new WebRuntimeProvider();
		expect(runtime.platform).toBe('web');

		const hash = await runtime.sha256('Chronos');
		expect(hash).toBeDefined();
		expect(hash.length).toBe(64);
	});

	it('WebAnalyticsProvider routes host and plugin events cleanly', () => {
		const analytics = new WebAnalyticsProvider();
		expect(() => {
			analytics.track('timetable_switch', { timetableId: 'tt_123' });
			analytics.track('plugin.tool-wallpaper.pick', {
				source: 'plugin',
				plugin_id: 'tool-wallpaper'
			});
		}).not.toThrow();
	});

	it('PluginProxyHttpAdapter posts explicit proxy payloads', async () => {
		const inner = new WebHttpProxyProvider();
		const adapter = new PluginProxyHttpAdapter(inner);
		const fetchPayload = {
			payload: {
				eventList: [{ eventName: '测试课程' }]
			},
			campusId: 'huaxi',
			campusPeriodTimes: { huaxi: [] }
		};
		const fetchMock = vi.fn(async () => ({
			ok: true,
			status: 200,
			json: async () => ({ ok: true, payload: fetchPayload })
		}));
		vi.stubGlobal('window', {});
		vi.stubGlobal('fetch', fetchMock);

		const response = await adapter.proxy!('source-cqut', 'preview', {
			account: 'stu001',
			password: 'pass123'
		});

		expect(fetchMock).toHaveBeenCalledWith(
			'/api/plugins/source-cqut/preview',
			expect.objectContaining({
				method: 'POST',
				body: JSON.stringify({ account: 'stu001', password: 'pass123' })
			})
		);
		const json = await response.json();
		expect(json).toEqual(fetchPayload);
		vi.unstubAllGlobals();
	});

	it('createWebProviders uses plain HTTP when plugin proxy disabled', () => {
		const providers = createWebProviders({ database: db, localStorage, enablePluginProxy: false });
		expect(providers.http).toBeInstanceOf(WebHttpProxyProvider);
		expect(providers.http).not.toBeInstanceOf(PluginProxyHttpAdapter);
	});

	it('clearAllData keeps the installed host while purging user resources and runtime caches', async () => {
		const clearImages = vi.spyOn(db.images, 'bulkDelete');
		const remaining = new Set([
			'chronos:/:shell:build',
			'chronos:/:precache-precache-v2',
			'chronos:/:legal',
			'pages-cache',
			'other-cache'
		]);
		const deleted: string[] = [];
		const fakeCaches = {
			keys: async () => [...remaining],
			open: async () => ({ keys: async () => [], match: async () => undefined }),
			delete: async (name: string) => {
				deleted.push(name);
				return remaining.delete(name);
			}
		};
		const storage = new DexieStorageProvider(
			db,
			localStorage,
			fakeCaches as unknown as CacheStorage
		);

		await storage.clearAllData();

		expect(clearImages).toHaveBeenCalledOnce();
		expect(deleted).toEqual(['chronos:/:legal']);
		expect([...remaining]).toEqual([
			'chronos:/:shell:build',
			'chronos:/:precache-precache-v2',
			'pages-cache',
			'other-cache'
		]);
	});

	it('retains only current profile resources, resetting all user data and removal markers', async () => {
		const record = (
			id: string,
			profileId = 'profile',
			version = '1.0.0'
		): InstalledOfficialPluginRecord => ({
			manifest: { id, version } as never,
			origin: { kind: 'profile', profileId },
			installedAt: 1,
			code: 'code',
			cssCode: 'css',
			wallpaperAssetId: `${id}-image`
		});
		const retained = record('preinstall');
		const state = {
			...emptyInstallationState(),
			generation: 'build',
			revision: 4,
			seeded: true,
			removed: ['preinstall'],
			records: [
				retained,
				record('extra'),
				record('other-profile', 'other'),
				record('old', 'profile', '0.9.0')
			]
		};
		const storage = new DexieStorageProvider(db, localStorage, null, {
			profileId: 'profile',
			preinstallIds: ['preinstall', 'other-profile', 'old'],
			hostVersion: '1.0.0',
			hostBuildId: 'build'
		});
		await createPluginInstallationRepository(db).transaction((saved) =>
			Object.assign(saved, state)
		);
		await storage.setPluginData('preinstall', '__config__', { password: 'secret' });
		await storage.setPluginData('preinstall', 'binary', new Uint8Array([1]));
		await storage.saveTimetable(createTimetable({ id: 'user', name: '用户课表', courses: [] }));
		await db.images.put({ id: 'preinstall-image', blob: new Blob(['bundled']) });
		await db.images.put({ id: 'custom-wallpaper', blob: new Blob(['private']) });
		await db.images.put({ id: 'extra-image', blob: new Blob(['extra']) });
		localStorage.setItem('chronos:test', 'private');
		localStorage.setItem('third-party', 'kept');
		await storage.clearAllData();
		const after = await createPluginInstallationRepository(db).read();
		expect(after).toMatchObject({
			generation: 'build',
			revision: 5,
			seeded: false,
			removed: [],
			records: [{ ...retained, revision: 5 }]
		});
		expect(after?.records).toHaveLength(1);
		expect(await db.pluginData.toArray()).toHaveLength(1);
		expect(await db.pluginBinary.toArray()).toEqual([]);
		expect(await storage.listTimetables()).toEqual([]);
		expect((await db.images.toArray()).map((row) => row.id)).toEqual(['preinstall-image']);
		expect(localStorage.getItem('chronos:test')).toBeNull();
		expect(localStorage.getItem('third-party')).toBe('kept');
	});

	it('reports post-commit cache failure after clearing all other user storage', async () => {
		const caches = {
			keys: async () => ['chronos:/:legal'],
			delete: async () => {
				throw new Error('denied');
			}
		};
		const storage = new DexieStorageProvider(db, localStorage, caches as unknown as CacheStorage);
		await storage.setPluginData('plugin', 'secret', 'private');
		localStorage.setItem('chronos:test', 'private');
		await expect(storage.clearAllData()).rejects.toBeInstanceOf(StorageClearError);
		expect(await storage.getPluginData('plugin', 'secret')).toBeNull();
		expect(localStorage.getItem('chronos:test')).toBeNull();
	});

	it.each(['generation', 'web-lock', 'native-lock'])(
		'rejects reset before deleting anything during %s',
		async (kind) => {
			const state = {
				...emptyInstallationState(),
				generation: kind === 'generation' ? 'other-build' : 'build'
			};
			if (kind !== 'generation')
				state.prepared = {
					target: { buildId: 'next', target: kind === 'native-lock' ? 'mobile' : 'pages' } as never,
					revision: 0,
					records: [],
					token: 'lock',
					until: kind === 'native-lock' ? null : Date.now() + 60_000
				};
			const storage = new DexieStorageProvider(db, localStorage, null, {
				profileId: 'profile',
				preinstallIds: [],
				hostVersion: '1',
				hostBuildId: 'build'
			});
			await createPluginInstallationRepository(db).transaction((saved) =>
				Object.assign(saved, state)
			);
			localStorage.setItem('chronos:test', 'kept');
			await expect(storage.clearAllData()).rejects.toThrow('Application update');
			expect(vi.spyOn(db.timetables, 'clear')).not.toHaveBeenCalled();
			expect(vi.spyOn(db.pluginBinary, 'clear')).not.toHaveBeenCalled();
			expect(localStorage.getItem('chronos:test')).toBe('kept');
		}
	);

	it('dispose removes cross-tab storage listener', () => {
		const removeListener = vi.fn();
		const addListener = vi.fn();
		const fakeWindow = {
			addEventListener: addListener,
			removeEventListener: removeListener
		};
		vi.stubGlobal('window', fakeWindow);

		const storage = new DexieStorageProvider(db, localStorage);
		expect(addListener).toHaveBeenCalledWith('storage', expect.any(Function));

		storage.dispose();
		expect(removeListener).toHaveBeenCalledWith('storage', expect.any(Function));

		vi.unstubAllGlobals();
	});
});

it.each(['', '/Chronos'])('host links include the deployment base %s', (base) => {
	hostBase.value = base;
	vi.stubGlobal('window', {
		addEventListener: vi.fn(),
		removeEventListener: vi.fn(),
		location: { origin: 'https://host.test', pathname: '/unrelated' }
	});
	const env = createWebChronosEnv({ database: createMockDb(), localStorage: new MockStorage() });
	expect(env.hostLinks.getImportUrl()).toBe(`https://host.test${base}/s`);
});
it('host links are unavailable during SSR', () => {
	vi.stubGlobal('window', undefined);
	const env = createWebChronosEnv({ database: createMockDb(), localStorage: new MockStorage() });
	expect(env.hostLinks.getImportUrl()).toBeNull();
});

it('native host links use a configured public import URL instead of the WebView origin', () => {
	publicEnv.PUBLIC_CHRONOS_SHARE_IMPORT_URL = 'https://share.example/Chronos/s';
	vi.stubGlobal('window', {
		addEventListener: vi.fn(),
		removeEventListener: vi.fn(),
		location: { origin: 'https://localhost' }
	});
	const env = createWebChronosEnv({
		database: createMockDb(),
		localStorage: new MockStorage(),
		platform: 'android'
	});
	expect(env.hostLinks.getImportUrl()).toBe('https://share.example/Chronos/s');

	publicEnv.PUBLIC_CHRONOS_SHARE_IMPORT_URL = '';
	expect(env.hostLinks.getImportUrl()).toBeNull();
});

it('reports web platform by default and allows overriding to ios or android', () => {
	const defaultEnv = createWebChronosEnv({
		database: createMockDb(),
		localStorage: new MockStorage()
	});
	expect(defaultEnv.platform).toBe('web');

	const iosEnv = createWebChronosEnv({
		database: createMockDb(),
		localStorage: new MockStorage(),
		platform: 'ios'
	});
	expect(iosEnv.platform).toBe('ios');

	const androidEnv = createWebChronosEnv({
		database: createMockDb(),
		localStorage: new MockStorage(),
		platform: 'android'
	});
	expect(androidEnv.platform).toBe('android');
});
