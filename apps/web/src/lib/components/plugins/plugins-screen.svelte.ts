import type { PluginManifest } from '@chronos/core';
import {
	getAppEngine,
	getOfficialPluginService,
	ensureEngineFullyReady
} from '#lib/services/app-engine.ts';
import type {
	OfficialPluginService,
	InstalledOfficialPluginRecord
} from '#lib/services/official-plugins/official-plugin-service.ts';
import type { PluginInstallTask } from '#lib/services/official-plugins/install-queue.ts';
import { assertValidManifestInstallUrl } from '#lib/services/official-plugins/manifest-url.ts';
import { snackbarKey } from '#lib/components/ui/snackbar-state.svelte.ts';

interface PluginsScreenDeps {
	service: OfficialPluginService;
	ready(): Promise<unknown>;
	notify: typeof snackbarKey;
}

export function createPluginsScreen(
	deps: PluginsScreenDeps = {
		service: getOfficialPluginService(),
		ready: ensureEngineFullyReady,
		notify: snackbarKey
	}
) {
	const service = deps.service;
	let installationFrozen = $state(false);
	let installedRecords = $state.raw<readonly InstalledOfficialPluginRecord[]>([]);
	let updateStatuses = $state.raw<Record<string, ReturnType<typeof service.getUpdateStatus>>>({});
	let preinstallFailures = $state.raw<readonly [string, string][]>([]);
	let catalogManifests = $state.raw<Array<{ url: string; manifest: PluginManifest }>>([]);
	let queueTasks = $state.raw<readonly PluginInstallTask[]>([]);
	let loadingCatalog = $state(false);
	let catalogError = $state<string | null>(null);
	let operatingPluginId = $state<string | null>(null);
	let linkInstallInProgress = $state(false);
	let session: object | undefined;
	let stop: (() => void) | undefined;
	let catalogRequest: Promise<void> | undefined;

	const taskMap: ReadonlyMap<string, PluginInstallTask> = $derived(
		new Map(queueTasks.map((task) => [task.pluginId, task]))
	);
	const activeInstallTasks = $derived(
		queueTasks.filter((task) => task.status !== 'completed' && task.status !== 'canceled')
	);
	const message = (error: unknown) => (error instanceof Error ? error.message : String(error));
	function refreshInstalled() {
		installationFrozen = service.installationStore.isFrozen;
		installedRecords = [...service.listInstalled()];
		updateStatuses = Object.fromEntries(
			installedRecords.map((record) => [
				record.manifest.id,
				service.getUpdateStatus(record.manifest.id)
			])
		);
		preinstallFailures = [...service.listFailures()];
	}
	function refreshQueue() {
		queueTasks = service.installQueue.getTasks();
	}

	function loadCatalog(): Promise<void> {
		if (!session) return Promise.resolve();
		if (catalogRequest) return catalogRequest;
		const current = session;
		loadingCatalog = true;
		catalogError = null;
		const request = (async () => {
			try {
				const catalog = await service.fetchCatalog();
				if (session !== current) return;
				const entries = await Promise.all(
					catalog.manifests.map(async (url) => ({
						url,
						manifest: await service.fetchManifest(url)
					}))
				);
				if (session === current) catalogManifests = entries;
			} catch (error) {
				if (session === current) catalogError = message(error);
			} finally {
				if (session === current) loadingCatalog = false;
			}
		})();
		catalogRequest = request;
		void request.finally(() => {
			if (catalogRequest === request) catalogRequest = undefined;
		});
		return request;
	}
	function start(): () => void {
		if (stop) return stop;
		const current = {};
		session = current;
		const installed = service.onChanged(refreshInstalled);
		const queue = service.installQueue.onChanged(({ kind }) => {
			refreshQueue();
			if (kind === 'state') refreshInstalled();
		});
		void Promise.resolve()
			.then(() => deps.ready())
			.then(async () => {
				if (session !== current) return;
				refreshInstalled();
				refreshQueue();
				await loadCatalog();
			})
			.catch((error) => {
				if (session !== current) return;
				catalogError = message(error);
				console.error('[plugins-startup]', error);
			});
		stop = () => {
			if (session !== current) return;
			session = undefined;
			installed.dispose();
			queue.dispose();
			catalogRequest = undefined;
			loadingCatalog = false;
			linkInstallInProgress = false;
			operatingPluginId = null;
			stop = undefined;
		};
		return stop;
	}
	const canChange = () => Boolean(session && !service.installationStore.isFrozen);
	async function installLink(input: string): Promise<boolean> {
		if (!canChange() || linkInstallInProgress) return false;
		const url = input.trim();
		if (!url) {
			deps.notify('snackbar.manifestRequired');
			return false;
		}
		try {
			assertValidManifestInstallUrl(url);
		} catch {
			deps.notify('snackbar.manifestInvalid');
			return false;
		}
		const current = session;
		linkInstallInProgress = true;
		try {
			const manifest = await service.fetchManifest(url);
			if (session !== current || !canChange()) return false;
			service.installQueue.enqueue(manifest, url);
			return true;
		} catch (error) {
			if (session === current) deps.notify('snackbar.install.failed', { message: message(error) });
			return false;
		} finally {
			if (session === current) linkInstallInProgress = false;
		}
	}
	async function operate(
		id: string,
		action: () => Promise<void>,
		failure: 'snackbar.uninstall.failed' | 'snackbar.confirmCompatibility.failed'
	) {
		if (!canChange() || operatingPluginId) return;
		const current = session;
		operatingPluginId = id;
		try {
			await action();
		} catch (error) {
			if (session === current) deps.notify(failure, { message: message(error) });
		} finally {
			if (session === current) operatingPluginId = null;
		}
	}
	return {
		get state() {
			return {
				installationFrozen,
				installedRecords,
				updateStatuses,
				preinstallFailures,
				catalogManifests,
				loadingCatalog,
				catalogError,
				operatingPluginId,
				linkInstallInProgress,
				taskMap,
				activeInstallTasks
			} as const;
		},
		start,
		loadCatalog,
		installLink,
		install(manifest: PluginManifest, url?: string) {
			if (canChange()) service.installQueue.enqueue(manifest, url);
		},
		cancel(id: string) {
			if (session) service.installQueue.cancel(id);
		},
		retry(id: string) {
			if (canChange()) service.installQueue.retry(id);
		},
		uninstall(id: string) {
			return operate(id, () => service.uninstall(id), 'snackbar.uninstall.failed');
		},
		confirmCompatibility(id: string) {
			return operate(
				id,
				() => service.confirmHostCompatibility(id),
				'snackbar.confirmCompatibility.failed'
			);
		},
		retryPreinstall: () => service.retryPreinstall(),
		retryPendingUpdates: () => service.retryPendingUpdates(),
		isInstalled: (id: string) => installedRecords.some((record) => record.manifest.id === id),
		isPreinstalled: (id: string) => service.isPreinstalledPlugin(id),
		needsUpdate: (manifest: PluginManifest) =>
			installedRecords.some(
				(record) =>
					record.manifest.id === manifest.id && record.manifest.version !== manifest.version
			),
		hasUnavailableServerCapability: (manifest: PluginManifest) =>
			manifest.optionalServerCapabilities?.some(
				(cap) => !getAppEngine().http.supportsPluginServer?.(cap.pluginId, cap.action)
			) ?? false
	};
}
