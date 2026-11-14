import { describe, expect, it, vi } from 'vite-plus/test';
import type { ChronosEngine } from '@chronos/core';
import { OfficialPluginService } from './official-plugin-service';
import { OfficialPluginInstalledStore } from './installed-store';
import type { InstalledOfficialPluginRecord } from './official-plugin-types';
import type { OfficialPluginRuntimeActivator } from './runtime-activator';
import type { OfficialPluginAssetPipeline } from './asset-pipeline';
import type { OfficialPluginCatalogClient } from './catalog-client';

async function fixture() {
	let persisted: unknown = null;
	const engine = {
		storage: {
			getPluginData: async () => structuredClone(persisted),
			setPluginData: async (_pluginId: string, _key: string, value: unknown) => {
				persisted = structuredClone(value);
			}
		},
		clearDefaultTheme: vi.fn()
	} as unknown as ChronosEngine;
	const store = new OfficialPluginInstalledStore(engine);
	const other = new OfficialPluginInstalledStore(engine);
	const active = new Map<string, number | undefined>();
	const started = Promise.withResolvers<void>();
	const release = Promise.withResolvers<void>();
	const activated = Promise.withResolvers<void>();
	const runtime = {
		isActive: (id: string) => active.has(id),
		activate: vi.fn(async (record: InstalledOfficialPluginRecord) => {
			if (record.manifest.id === 'slow-plugin') {
				started.resolve();
				await release.promise;
			}
			active.set(record.manifest.id, record.revision);
			if (record.manifest.id === 'slow-plugin') activated.resolve();
		}),
		deactivate: vi.fn(async (id: string) => {
			active.delete(id);
		}),
		disposeAll: () => active.clear()
	};
	const service = new OfficialPluginService(engine, {
		installedStore: store,
		runtimeActivator: runtime as unknown as OfficialPluginRuntimeActivator,
		assetPipeline: {} as OfficialPluginAssetPipeline,
		catalogClient: {} as OfficialPluginCatalogClient,
		hostVersion: '1'
	});
	vi.spyOn(service, 'retryPendingUpdates').mockResolvedValue();
	await service.init();
	const record = (id: string): InstalledOfficialPluginRecord => ({
		manifest: { id, version: '1' } as never,
		acceptedHostVersion: '1',
		origin: { kind: 'user' },
		installedAt: 1
	});
	return { service, store, other, active, started, release, activated, record, runtime };
}

describe('runtime follows external installation changes', () => {
	it('publishes ready status after a failed cached activation succeeds on retry', async () => {
		const { service, store, other, record, runtime } = await fixture();
		const id = 'external-plugin';
		try {
			runtime.activate.mockRejectedValueOnce(new Error('Temporary activation failure'));
			await other.upsert(record(id));
			await store.load();
			store.notify();
			await expect(service.waitForSettled()).rejects.toThrow('Plugin restoration failed');
			expect(service.getUpdateStatus(id)?.status).toBe('failed');
			expect(service.isPluginActive(id)).toBe(false);

			const observed: ReturnType<typeof service.getUpdateStatus>[] = [];
			const subscription = service.onChanged(() => observed.push(service.getUpdateStatus(id)));
			store.notify();
			await service.waitForSettled();

			expect(service.isPluginActive(id)).toBe(true);
			expect(service.listFailures().has(id)).toBe(false);
			expect(service.getUpdateStatus(id)).toEqual({ status: 'ready' });
			expect(observed.at(-1)).toEqual({ status: 'ready' });
			subscription.dispose();
		} finally {
			service.dispose();
		}
	});

	it('deactivates a plugin removed while its asynchronous activation is pending', async () => {
		const { service, store, other, started, release, activated } = await fixture();
		try {
			await other.upsert({
				manifest: { id: 'slow-plugin', version: '1' } as never,
				acceptedHostVersion: '1',
				origin: { kind: 'user' },
				installedAt: 1
			});
			await store.load();
			store.notify();
			await started.promise;
			await other.remove('slow-plugin');
			await store.load();
			store.notify();
			release.resolve();
			await activated.promise;
			await vi.waitFor(() => expect(service.isPluginActive('slow-plugin')).toBe(false));
			expect(service.getInstalled('slow-plugin')).toBeUndefined();
		} finally {
			release.resolve();
			service.dispose();
		}
	});

	it('runs another pass for an installation added during asynchronous activation', async () => {
		const { service, store, other, started, release, record } = await fixture();
		try {
			await other.upsert(record('slow-plugin'));
			await store.load();
			store.notify();
			await started.promise;
			await other.upsert(record('next-plugin'));
			await store.load();
			store.notify();
			release.resolve();
			await vi.waitFor(() => expect(service.isPluginActive('next-plugin')).toBe(true));
			expect(service.isPluginActive('slow-plugin')).toBe(true);
		} finally {
			release.resolve();
			service.dispose();
		}
	});
});
