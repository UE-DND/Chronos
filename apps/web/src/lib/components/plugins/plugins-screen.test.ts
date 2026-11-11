import { describe, expect, it, vi } from 'vite-plus/test';
import type { OfficialPluginService } from '#lib/services/official-plugins/official-plugin-service.ts';
import type { PluginManifest } from '@chronos/core';
import { createPluginsScreen } from './plugins-screen.svelte';

function fixture() {
	const listeners = new Set<() => void>();
	const queueListeners = new Set<(event: { kind: 'state' }) => void>();
	const installed = [
		{ manifest: { id: 'plugin', version: '1' }, origin: { kind: 'user' }, installedAt: 1 }
	];
	const notify = vi.fn();
	const service = {
		installationStore: { isFrozen: false },
		listInstalled: () => installed,
		listFailures: () => new Map(),
		getUpdateStatus: () => undefined,
		onChanged: (listener: () => void) => {
			listeners.add(listener);
			return { dispose: () => listeners.delete(listener) };
		},
		fetchCatalog: vi.fn().mockResolvedValue({ manifests: [], version: 1 }),
		fetchManifest: vi.fn().mockResolvedValue({ id: 'download', version: '1' }),
		uninstall: vi.fn().mockResolvedValue(undefined),
		confirmHostCompatibility: vi.fn().mockResolvedValue(undefined),
		installQueue: {
			getTasks: () => [],
			onChanged: (listener: (event: { kind: 'state' }) => void) => {
				queueListeners.add(listener);
				return { dispose: () => queueListeners.delete(listener) };
			},
			enqueue: vi.fn(),
			cancel: vi.fn(),
			retry: vi.fn()
		}
	};
	const screen = createPluginsScreen({
		service: service as unknown as OfficialPluginService,
		ready: async () => {},
		notify
	});
	const stop = screen.start();
	return { screen, stop, service, installed, listeners, queueListeners, notify };
}

describe('plugin screen controller', () => {
	it('owns subscriptions and ignores catalog completion after leaving the screen', async () => {
		const { screen, stop, service, listeners, queueListeners } = fixture();
		const result = Promise.withResolvers<{ manifests: string[]; version: number }>();
		service.fetchCatalog.mockReturnValueOnce(result.promise);
		await vi.waitFor(() => expect(screen.state.loadingCatalog).toBe(true));
		const loading = screen.loadCatalog();
		expect(listeners.size).toBe(1);
		expect(queueListeners.size).toBe(1);
		stop();
		result.resolve({ manifests: ['/plugin.manifest.json'], version: 1 });
		await loading;
		expect(listeners.size).toBe(0);
		expect(queueListeners.size).toBe(0);
		expect(service.fetchManifest).not.toHaveBeenCalled();
		expect(screen.state.catalogManifests).toEqual([]);
	});

	it('coalesces overlapping catalog requests and keeps failures visible for retry', async () => {
		const { screen, stop, service } = fixture();
		try {
			await vi.waitFor(() => expect(service.fetchCatalog).toHaveBeenCalledOnce());
			const result = Promise.withResolvers<never>();
			service.fetchCatalog.mockReturnValueOnce(result.promise);
			const first = screen.loadCatalog();
			const second = screen.loadCatalog();
			expect(first).toBe(second);
			result.reject(new Error('offline'));
			await first;
			expect(screen.state.catalogError).toBe('offline');
			await screen.loadCatalog();
			expect(screen.state.catalogError).toBeNull();
			expect(service.fetchCatalog).toHaveBeenCalledTimes(3);
		} finally {
			stop();
		}
	});

	it.each(['dispose', 'freeze'])(
		'does not enqueue a link installation after %s during manifest loading',
		async (action) => {
			const { screen, stop, service } = fixture();
			const result = Promise.withResolvers<PluginManifest>();
			service.fetchManifest.mockReturnValueOnce(result.promise);
			const installing = screen.installLink('https://plugin.test/plugin.manifest.json');
			if (action === 'dispose') stop();
			else service.installationStore.isFrozen = true;
			result.resolve({ id: 'download', version: '1' } as PluginManifest);
			expect(await installing).toBe(false);
			expect(service.installQueue.enqueue).not.toHaveBeenCalled();
			expect(screen.state.linkInstallInProgress).toBe(false);
			stop();
		}
	);

	it('reports operation failure and releases busy state without changing installed records', async () => {
		const { screen, stop, service, notify } = fixture();
		try {
			await vi.waitFor(() => expect(screen.state.installedRecords).toHaveLength(1));
			service.uninstall.mockRejectedValueOnce(new Error('write failed'));
			await screen.uninstall('plugin');
			expect(screen.state.operatingPluginId).toBeNull();
			expect(screen.state.installedRecords).toHaveLength(1);
			expect(notify).toHaveBeenCalledWith('snackbar.uninstall.failed', { message: 'write failed' });
		} finally {
			stop();
		}
	});

	it('keeps a manifest failure distinct from a successful empty catalog', async () => {
		const { screen, stop, service } = fixture();
		try {
			await vi.waitFor(() => expect(service.fetchCatalog).toHaveBeenCalledOnce());
			await screen.loadCatalog();
			service.fetchCatalog.mockResolvedValueOnce({
				manifests: ['/plugin.manifest.json'],
				version: 1
			});
			service.fetchManifest.mockRejectedValueOnce(new Error('manifest unavailable'));
			await screen.loadCatalog();
			expect(screen.state.catalogError).toBe('manifest unavailable');
		} finally {
			stop();
		}
	});
});
