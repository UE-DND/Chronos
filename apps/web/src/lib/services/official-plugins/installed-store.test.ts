import { describe, expect, it, vi, beforeEach } from 'vite-plus/test';
import { ChronosEngine } from '@chronos/core';
import type { ChronosEnv } from '@chronos/core';
import { DEFAULT_USER_PREFERENCES } from '@chronos/core';
import { OfficialPluginInstalledStore } from './installed-store';

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

	it('rejects invalid development state without overwriting it', async () => {
		const invalid = [{ obsolete: true }];
		await engine.storage.setPluginData('core.official-plugins', 'installed_plugins', invalid);
		await expect(store.load()).rejects.toThrow('Invalid plugin installation state');
		expect(
			await engine.storage.getPluginData('core.official-plugins', 'installed_plugins')
		).toEqual(invalid);
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
			enabled: true,
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
			enabled: true,
			installedAt: 1
		});
		await store.load();
		expect(store.getRemoved()).toEqual([]);
		expect(store.getCache()).toHaveLength(1);
	});
});
