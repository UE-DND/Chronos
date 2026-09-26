import { HOST_BUILD } from '$lib/config/app-meta';
import { fetchLatestProjectRelease } from '$lib/content/releases/release-feed-adapter';
import { applyUpdateAndReload, readWorkerIdentity, type ApplyUpdateOptions } from './pwa-sw';

/** Prepare assets without evaluating future plugin code, then authorize exactly one worker identity. */
export async function applyPreparedWebUpdate(options?: ApplyUpdateOptions): Promise<void> {
	const { ensureEngineFullyReady, getOfficialPluginService } =
		await import('$lib/services/app-engine');
	await ensureEngineFullyReady();
	const service = getOfficialPluginService();
	await service.installationStore.load();
	const prepared = service.installationStore.prepared;
	const registration = await navigator.serviceWorker.getRegistration();
	if (prepared && registration?.waiting) {
		return applyUpdateAndReload({ ...options, targetBuildId: prepared.target.buildId });
	}
	const result = await fetchLatestProjectRelease();
	if (!result.ok) throw new Error(result.error.message);
	const update = result.value.hostUpdate;
	if (!update || update.host.buildId === HOST_BUILD.buildId)
		throw new Error('No different host build is available');
	options?.onProgress?.({ phase: 'downloading', percent: 0 });
	const token = await service.prepareHostUpdate(update, (percent) =>
		options?.onProgress?.({ phase: 'downloading', percent })
	);
	try {
		await applyUpdateAndReload({ ...options, targetBuildId: update.host.buildId });
	} catch (error) {
		const registration = await navigator.serviceWorker.getRegistration();
		// A downloaded or installing worker still needs the snapshot when the last window closes.
		if (
			!registration?.waiting &&
			!registration?.installing &&
			(!registration?.active ||
				(await readWorkerIdentity(registration.active)).buildId !== update.host.buildId)
		)
			await service.cancelHostPreparation(token);
		throw error;
	}
}

export async function recoverInterruptedWebUpdate(): Promise<void> {
	if (HOST_BUILD.target === 'mobile' || !('serviceWorker' in navigator)) return;
	const { getOfficialPluginService } = await import('$lib/services/app-engine');
	const store = getOfficialPluginService().installationStore;
	await store.load();
	const prepared = store.prepared;
	if (!prepared || prepared.target.buildId === HOST_BUILD.buildId) return;
	const registration = await navigator.serviceWorker.getRegistration();
	if (!registration?.waiting && !registration?.installing) {
		if (
			registration?.active &&
			(await readWorkerIdentity(registration.active)).buildId === prepared.target.buildId
		) {
			window.location.reload();
			return;
		}
		await getOfficialPluginService().cancelHostPreparation(prepared.token);
	}
}
