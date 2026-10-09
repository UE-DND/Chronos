import { HOST_BUILD } from '#lib/config/app-meta.ts';
import { dev } from '$app/env';
import { fetchLatestProjectRelease } from '#lib/content/releases/release-feed-adapter.ts';
import { applyUpdateAndReload, readWorkerIdentity, type ApplyUpdateOptions } from './pwa-sw';

let applying: Promise<void> | undefined;
let recovering: Promise<void> | undefined;
const progressListeners = new Set<NonNullable<ApplyUpdateOptions['onProgress']>>();

/** Re-read persisted ownership before deciding whether a preparation can be released. */
async function reconcile(expectedToken?: string): Promise<boolean> {
	const { getOfficialPluginService } = await import('#lib/services/app-engine.ts');
	const service = getOfficialPluginService();
	const store = service.installationStore;
	await store.load();
	const prepared = store.prepared;

	if (
		!prepared ||
		prepared.target.buildId === HOST_BUILD.buildId ||
		(expectedToken && prepared.token !== expectedToken)
	)
		return false;

	const registration = await navigator.serviceWorker.getRegistration();
	if (
		registration?.active &&
		(await readWorkerIdentity(registration.active)).buildId === prepared.target.buildId
	) {
		window.location.reload();
		return true;
	}
	// Preserve authorization while a worker may still be downloading or awaiting takeover.
	if (registration?.waiting || registration?.installing) return false;
	await service.cancelHostPreparation(prepared.token);
	return false;
}

async function apply(options?: ApplyUpdateOptions): Promise<void> {
	const { ensureEngineFullyReady, getOfficialPluginService } =
		await import('#lib/services/app-engine.ts');
	await ensureEngineFullyReady();
	const service = getOfficialPluginService();
	await service.installationStore.load();
	const prepared = service.installationStore.prepared;
	const registration = await navigator.serviceWorker.getRegistration();
	let token: string;
	let targetBuildId: string;
	if (prepared && (registration?.waiting || registration?.installing)) {
		token = prepared.token;
		targetBuildId = prepared.target.buildId;
	} else {
		if (await reconcile()) return;
		const result = await fetchLatestProjectRelease();
		if (!result.ok) throw new Error(result.error.message);
		const update = result.value.hostUpdate;
		if (!update || update.host.buildId === HOST_BUILD.buildId)
			throw new Error('No different host build is available');
		options?.onProgress?.({ phase: 'downloading', percent: 0 });
		token = await service.prepareHostUpdate(update, (percent) =>
			options?.onProgress?.({ phase: 'downloading', percent })
		);
		targetBuildId = update.host.buildId;
	}
	try {
		await applyUpdateAndReload({ ...options, targetBuildId });
	} catch (error) {
		// Failed observations preserve the snapshot and must not obscure the original update error.
		try {
			await reconcile(token);
		} catch (recoveryError) {
			console.error('[update] Failed to reconcile preparation', recoveryError);
		}
		throw error;
	}
}

/** Prepare assets without evaluating future plugin code, then authorize exactly one worker identity. */
export function applyPreparedWebUpdate(options?: ApplyUpdateOptions): Promise<void> {
	if (options?.onProgress) progressListeners.add(options.onProgress);
	if (!applying) {
		applying = (async () => {
			await recovering;
			await apply({
				...options,
				onProgress: (progress) => {
					for (const listener of progressListeners) listener(progress);
				}
			});
		})().finally(() => {
			applying = undefined;
			progressListeners.clear();
		});
	}
	return applying;
}

export function recoverInterruptedWebUpdate(): Promise<void> {
	if (dev || HOST_BUILD.target === 'mobile' || !('serviceWorker' in navigator))
		return Promise.resolve();
	// An active application owns its failure reconciliation; background events must not undo it.
	if (applying)
		return applying.then(
			() => {},
			() => {}
		);
	if (!recovering)
		recovering = reconcile()
			.then(() => {})
			.finally(() => {
				recovering = undefined;
			});
	return recovering;
}
