import { describe, expect, it, vi, beforeEach, afterEach } from 'vite-plus/test';
import { ChronosEngine } from '@chronos/core';
import type { ChronosEnv } from '@chronos/core';
import { DEFAULT_USER_PREFERENCES } from '@chronos/core';
import {
	emptyInstallationState,
	OfficialPluginInstalledStore,
	parseInstallationState
} from './installed-store';

function createMockEnv() {
	const kv = new Map<string, unknown>();
	const env: ChronosEnv = {
		platform: 'node',
		http: { request: vi.fn() },
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
			getPluginData: async <T>(pluginId: string, key: string) =>
				(kv.get(`${pluginId}:${key}`) as T) ?? null,
			setPluginData: async <T>(pluginId: string, key: string, val: T) => {
				kv.set(`${pluginId}:${key}`, val);
			},
			deletePluginData: async () => {},
			onChanged: () => ({ dispose: () => {} })
		},
		vault: {
			isSupported: async () => false,
			storeSecret: vi.fn(),
			getSecret: vi.fn(),
			removeSecret: vi.fn()
		},
		runtime: {
			sha256: async () => 'hash'
		}
	};
	return { env, kv };
}

describe('OfficialPluginInstalledStore', () => {
	let engine: ChronosEngine;
	let store: OfficialPluginInstalledStore;

	beforeEach(async () => {
		const mock = createMockEnv();
		engine = new ChronosEngine({ env: mock.env, onNotification: vi.fn() });
		await engine.init();
		store = new OfficialPluginInstalledStore(engine);
	});
	afterEach(() => {
		vi.unstubAllGlobals();
		vi.restoreAllMocks();
	});

	it.each(['notification failure', 'dispose during commit'])(
		'preserves a successful installation after %s',
		async (scenario) => {
			const gate = Promise.withResolvers<void>();
			let persisted = emptyInstallationState();
			let closed = false;
			const postMessage = vi.fn(() => {
				throw new DOMException(
					closed ? 'Channel closed' : 'Notification failed',
					'InvalidStateError'
				);
			});
			vi.stubGlobal('window', {});
			vi.stubGlobal(
				'BroadcastChannel',
				class {
					postMessage = postMessage;
					close() {
						closed = true;
					}
				}
			);
			vi.spyOn(console, 'error').mockImplementation(() => {});
			const installing = new OfficialPluginInstalledStore(engine, {
				read: async () => structuredClone(persisted),
				transaction: async (change) => {
					await gate.promise;
					const state = structuredClone(persisted);
					change(state);
					persisted = state;
					return state;
				}
			});
			const listener = vi.fn();
			installing.onChanged(listener);
			const pending = installing.upsert({
				manifest: { id: 'theme' } as never,
				origin: { kind: 'user' },
				installedAt: 1,
				wallpaperAssetId: 'new-wallpaper'
			});
			if (scenario === 'dispose during commit') installing.dispose();
			gate.resolve();
			await expect(pending).resolves.toBeUndefined();
			expect(persisted.records[0]?.wallpaperAssetId).toBe('new-wallpaper');
			expect(installing.find('theme')?.wallpaperAssetId).toBe('new-wallpaper');
			expect(listener).toHaveBeenCalledTimes(scenario === 'notification failure' ? 1 : 0);
			installing.dispose();
		}
	);

	it('rejects invalid development state without overwriting it', async () => {
		const invalid = [{ obsolete: true }];
		await engine.storage.setPluginData('core.official-plugins', 'installed_plugins', invalid);
		await expect(store.load()).rejects.toThrow('Invalid plugin installation state');
		expect(
			await engine.storage.getPluginData('core.official-plugins', 'installed_plugins')
		).toEqual(invalid);
	});
	it('rejects obsolete enable state without migrating development data', () => {
		expect(() =>
			parseInstallationState({
				records: [
					{ manifest: { id: 'old' }, origin: { kind: 'user' }, enabled: false, installedAt: 1 }
				],
				removed: [],
				seeded: true,
				revision: 0,
				generation: ''
			})
		).toThrow('reset development data manually');
	});
	it('notifies change listeners on persist', async () => {
		const listener = vi.fn();
		store.onChanged(listener);
		await store.load();
		await store.upsert({
			manifest: {
				id: 'p1',
				name: { 'zh-CN': 'P' },
				version: '1',
				description: { 'zh-CN': 'P' },
				author: 'Chronos',
				type: 'tool',
				bundleFormat: 'esm',
				bundleUrl: '/b.js',
				sha256: 'abc'
			},
			origin: { kind: 'user' as const },
			installedAt: 1
		});
		expect(listener).toHaveBeenCalled();
	});

	it('persists explicit removal and clears it only after reinstall succeeds', async () => {
		await store.load();
		await store.remove('removed');
		const restarted = new OfficialPluginInstalledStore(engine);
		await restarted.load();
		expect(restarted.getRemoved()).toEqual(['removed']);
		expect(restarted.getCache()).toEqual([]);
		await restarted.upsert({
			manifest: { id: 'removed' } as never,
			origin: { kind: 'user' },
			installedAt: 1
		});
		await store.load();
		expect(store.getRemoved()).toEqual([]);
		expect(store.getCache()).toHaveLength(1);
	});
	it('merges independent windows and rejects a late download after uninstall', async () => {
		const other = new OfficialPluginInstalledStore(engine);
		await Promise.all([store.load(), other.load()]);
		const record = (id: string) => ({
			manifest: { id } as never,
			origin: { kind: 'user' as const },
			installedAt: 1
		});
		await Promise.all([store.upsert(record('a')), other.upsert(record('b'))]);
		await store.load();
		expect(
			store
				.getCache()
				.map((record) => record.manifest.id)
				.sort()
		).toEqual(['a', 'b']);
		const revision = store.find('a')!.revision;
		await other.remove('a');
		await expect(store.upsert(record('a'), revision)).rejects.toThrow('Plugin changed');
		await store.load();
		expect(store.has('a')).toBe(false);
	});
	it('freezes writes only for a complete snapshot and prevents old host writes after takeover', async () => {
		const host = {
			version: '1.0.2',
			buildId: 'a'.repeat(64),
			sourceCommit: 'b'.repeat(40),
			profileId: 'chronos-default',
			deploymentId: 'pages',
			target: 'pages' as const
		};
		await store.startHost(host);
		await store.upsert({
			manifest: { id: 'a' } as never,
			origin: { kind: 'user' },
			installedAt: 1
		});
		const other = new OfficialPluginInstalledStore(engine);
		await other.startHost(host);
		await other.upsert(other.find('a')!);
		const target = { ...host, buildId: 'c'.repeat(64) };
		await expect(
			store.prepare({
				target,
				revision: store.revision,
				records: [],
				token: 'stale',
				until: Date.now() + 10000
			})
		).rejects.toThrow('Installed plugins changed');
		await store.load();
		await store.prepare({
			target,
			revision: store.revision,
			records: [],
			token: 'ready',
			until: Date.now() + 10000
		});
		await expect(other.remove('a')).rejects.toThrow('Application update in progress');
		const updated = new OfficialPluginInstalledStore(engine);
		await updated.startHost(target);
		await expect(store.startHost(host, host.buildId)).rejects.toThrow('Host generation changed');
		await other.startHost(target, host.buildId);
		expect(other.prepared).toBeUndefined();
		await expect(store.remove('a')).rejects.toThrow('Application update in progress');
		expect(updated.find('a')).toBeDefined();
	});
});
