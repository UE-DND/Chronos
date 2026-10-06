import { SvelteDate } from 'svelte/reactivity';
import { APP_VERSION, HOST_BUILD } from '$lib/config/app-meta';
import { trackEvent } from '$lib/client/analytics';
import type { AppResult } from '@chronos/core';
import type { ReleaseCatalog } from './catalog';
import { compareReleaseVersions, type Release } from './release';
import { createReleaseFeedAdapter, type ReleaseFeedAdapter } from './release-feed-adapter';
import { SwUpdateError, type ApplyUpdateOptions } from '$lib/client/pwa-sw';
import {
	getHostPlatform,
	type PlatformUpdateAction,
	type HostUpdatePhase,
	type NativeUpdateState
} from '$lib/platform/host-platform';
import {
	createDefaultServiceWorkerAdapter,
	type ServiceWorkerAdapter
} from './service-worker-adapter';

export type UpdateSource = 'none' | 'semver' | 'sw' | 'both';

export type InstallPhase = HostUpdatePhase;

interface SoftwareUpdateState {
	nativeState: NativeUpdateState | null;
	checking: boolean;
	updating: boolean;
	installPhase: InstallPhase | null;
	installPercent: number | null;
	hasUpdate: boolean;
	hasNewerVersion: boolean;
	updateSource: UpdateSource;
	currentVersion: string;
	latestRelease: Release | null;
	errorMessage: string | null;
	lastChecked: SvelteDate | null;
}

export interface UpdateStateOptions {
	allowLocalFallback?: boolean;
	currentVersion?: string;
	releaseFeedAdapter?: ReleaseFeedAdapter;
	swAdapter?: ServiceWorkerAdapter;
	platformUpdateAction?: PlatformUpdateAction;
	fetchLatestRelease?: () => Promise<AppResult<Release>>;
	localCatalog?: ReleaseCatalog;
	checkSwUpdate?: () => Promise<boolean>;
	applyUpdate?: (options?: ApplyUpdateOptions) => Promise<void>;
}

interface CachedCheckSnapshot {
	release: Release | null;
	hasNewerVersion: boolean;
	hasUpdate: boolean;
	updateSource: UpdateSource;
}

export function createUpdateState(options: UpdateStateOptions = {}) {
	const currentVersion = options.currentVersion ?? APP_VERSION;
	const hostUpdateAction = options.platformUpdateAction ?? getHostPlatform().getUpdateAction?.();
	const isNativeUpdatePlatform = hostUpdateAction?.mode === 'native-apk';
	const isExternalUpdatePlatform =
		hostUpdateAction?.mode === 'external-link' || isNativeUpdatePlatform;
	const feedAdapter: ReleaseFeedAdapter =
		options.releaseFeedAdapter ??
		createReleaseFeedAdapter({
			fetchLatestRelease: options.fetchLatestRelease,
			localCatalog: options.localCatalog,
			versionUrl:
				isExternalUpdatePlatform && typeof __ANDROID_RELEASE_FEED_URL__ === 'string'
					? __ANDROID_RELEASE_FEED_URL__
					: undefined,
			allowLocalFallback: options.allowLocalFallback ?? !isExternalUpdatePlatform,
			requireVersionUrl: isExternalUpdatePlatform
		});

	const defaultSw = createDefaultServiceWorkerAdapter();
	const swAdapter: ServiceWorkerAdapter = options.swAdapter ?? {
		isSupported: () => defaultSw.isSupported(),
		isUpdatePending: () => defaultSw.isUpdatePending(),
		checkForUpdate: options.checkSwUpdate ?? (() => defaultSw.checkForUpdate()),
		applyUpdateAndReload: options.applyUpdate ?? ((opts) => defaultSw.applyUpdateAndReload(opts))
	};

	let cachedCheckSnapshot = $state<CachedCheckSnapshot | null>(null);
	let checking = $state(true);
	let updating = $state(false);
	let installPhase = $state<InstallPhase | null>(null);
	let installPercent = $state<number | null>(null);
	let hasUpdate = $state(false);
	let hasNewerVersion = $state(false);
	let updateSource = $state<UpdateSource>('none');
	let latestRelease = $state<Release | null>(null);
	let errorMessage = $state<string | null>(null);
	let lastChecked = $state<SvelteDate | null>(null);
	let nativeState = $state.raw<NativeUpdateState | null>(null);

	function applyNativeState(snapshot: NativeUpdateState) {
		nativeState = snapshot;
		if (snapshot.phase === 'idle') return;
		const active = !['idle', 'succeeded', 'failed', 'canceled'].includes(snapshot.phase);
		updating = active;
		installPhase = active ? (snapshot.phase as HostUpdatePhase) : null;
		installPercent = snapshot.percent;
		errorMessage =
			snapshot.phase === 'failed'
				? `about.update.android.error.${snapshot.errorCode ?? 'install_failed'}`
				: null;
		if (
			active ||
			(snapshot.phase === 'failed' &&
				snapshot.targetVersion != null &&
				compareReleaseVersions(snapshot.targetVersion, currentVersion) > 0)
		) {
			hasUpdate = true;
			hasNewerVersion =
				snapshot.targetVersion != null &&
				compareReleaseVersions(snapshot.targetVersion, currentVersion) > 0;
		}
		if (snapshot.phase === 'succeeded' && !hasNewerVersion) applyUpdateSignals(false, false);
	}

	async function observeNativeUpdate(): Promise<() => void> {
		const native = hostUpdateAction?.native;
		if (!native) return () => {};
		let receivedEvent = false;
		const dispose = await native.subscribe((snapshot) => {
			receivedEvent = true;
			applyNativeState(snapshot);
		});
		try {
			const snapshot = await native.getState();
			if (!receivedEvent) applyNativeState(snapshot);
		} catch {
			dispose();
			errorMessage = 'about.update.android.error.install_failed';
			return () => {};
		}
		return dispose;
	}

	async function continueNativeUpdate() {
		try {
			if (hostUpdateAction?.native)
				applyNativeState(await hostUpdateAction.native.continueUpdate());
		} catch {
			errorMessage = 'about.update.android.error.install_failed';
		}
	}
	async function cancelNativeUpdate() {
		try {
			if (hostUpdateAction?.native) applyNativeState(await hostUpdateAction.native.cancelUpdate());
		} catch {
			errorMessage = 'about.update.android.error.install_failed';
		}
	}

	function resolveUpdateSource(newerVersion: boolean, swHasUpdate: boolean): UpdateSource {
		if (newerVersion && swHasUpdate) return 'both';
		if (newerVersion) return 'semver';
		if (swHasUpdate) return 'sw';
		return 'none';
	}

	function applyUpdateSignals(newerVersion: boolean, swHasUpdate: boolean) {
		hasNewerVersion = newerVersion;
		hasUpdate = newerVersion || swHasUpdate;
		updateSource = resolveUpdateSource(newerVersion, swHasUpdate);
	}

	function commitCheckSnapshot() {
		cachedCheckSnapshot = {
			release: latestRelease,
			hasNewerVersion,
			hasUpdate,
			updateSource
		};
	}

	function restoreCachedCheckSnapshot(swHasUpdate: boolean): boolean {
		if (!cachedCheckSnapshot) return false;

		latestRelease = cachedCheckSnapshot.release;
		const newerVersion =
			cachedCheckSnapshot.release != null
				? compareReleaseVersions(cachedCheckSnapshot.release.tagName, currentVersion) > 0
				: cachedCheckSnapshot.hasNewerVersion;
		applyUpdateSignals(newerVersion, swHasUpdate);
		return true;
	}

	async function performCheck(): Promise<boolean> {
		checking = true;
		errorMessage = null;
		trackEvent('update_check_attempt');

		let swHasUpdate = false;
		try {
			swHasUpdate =
				!isExternalUpdatePlatform &&
				(swAdapter.isUpdatePending() || (await swAdapter.checkForUpdate()));
			const result = await feedAdapter.fetchLatestRelease();
			if (result.ok) {
				const release = result.value;
				latestRelease = release;
				const newerVersion = compareReleaseVersions(release.tagName, currentVersion) > 0;
				applyUpdateSignals(
					newerVersion,
					swHasUpdate ||
						Boolean(release.hostUpdate && release.hostUpdate.host.buildId !== HOST_BUILD.buildId)
				);
				commitCheckSnapshot();
				trackEvent('update_check_success', {
					has_update: hasUpdate,
					latest_version: release.tagName,
					update_source: updateSource
				});
				return true;
			} else if (swHasUpdate) {
				applyUpdateSignals(false, swHasUpdate);
				commitCheckSnapshot();
				trackEvent('update_check_success', {
					has_update: true,
					update_source: updateSource
				});
			} else if (!isExternalUpdatePlatform && restoreCachedCheckSnapshot(swHasUpdate)) {
				trackEvent('update_check_success', {
					has_update: hasUpdate,
					latest_version: latestRelease?.tagName ?? '',
					update_source: updateSource,
					cached: true
				});
			} else {
				errorMessage = result.error.message;
				applyUpdateSignals(false, swHasUpdate);
				trackEvent('update_check_fail', {
					error_message: errorMessage
				});
			}
		} catch (err) {
			if (swHasUpdate) {
				applyUpdateSignals(false, swHasUpdate);
				commitCheckSnapshot();
				trackEvent('update_check_success', {
					has_update: true,
					update_source: updateSource
				});
			} else if (!isExternalUpdatePlatform && restoreCachedCheckSnapshot(swHasUpdate)) {
				trackEvent('update_check_success', {
					has_update: hasUpdate,
					latest_version: latestRelease?.tagName ?? '',
					update_source: updateSource,
					cached: true
				});
			} else {
				errorMessage = err instanceof Error ? err.message : '检查更新失败';
				applyUpdateSignals(false, swHasUpdate);
				trackEvent('update_check_fail', {
					error_message: errorMessage
				});
			}
		} finally {
			lastChecked = new SvelteDate();
			checking = false;
			if (nativeState) applyNativeState(nativeState);
		}
		return false;
	}

	let checkInFlight: Promise<boolean> | undefined;
	function checkUpdate(): Promise<boolean> {
		return (checkInFlight ??= performCheck().finally(() => {
			checkInFlight = undefined;
		}));
	}

	function resolveInstallError(err: unknown): string {
		if (err instanceof SwUpdateError) {
			if (err.code === 'download_timeout') {
				return 'about.update.error.downloadTimeout';
			}
			if (err.code === 'download_failed' || err.code === 'no_registration') {
				return 'about.update.error.downloadFailed';
			}
		}
		return 'about.update.error.installFailed';
	}

	const platformUpdateAction: PlatformUpdateAction | undefined = isNativeUpdatePlatform
		? hostUpdateAction
		: hostUpdateAction
			? {
					mode: hostUpdateAction.mode,
					canApplyInApp: hostUpdateAction.canApplyInApp,
					actionLabelKey: hostUpdateAction.actionLabelKey,
					applyUpdate(release, opts) {
						if (!hostUpdateAction.canApplyInApp) {
							return hostUpdateAction.applyUpdate(release, opts);
						}
						return swAdapter.applyUpdateAndReload(opts);
					}
				}
			: undefined;

	async function installUpdate() {
		if (updating) return;
		updating = true;
		errorMessage = null;

		if (isNativeUpdatePlatform) {
			if (!platformUpdateAction?.native) {
				updating = false;
				errorMessage = 'about.update.android.error.install_failed';
				return;
			}
			try {
				if (nativeState?.phase === 'failed' && !latestRelease) {
					applyNativeState(await platformUpdateAction.native.continueUpdate());
				} else {
					await platformUpdateAction.applyUpdate(latestRelease, {
						onProgress: (progress) => {
							installPhase = progress.phase;
							installPercent = progress.percent;
						}
					});
				}
				applyNativeState(await platformUpdateAction.native.getState());
			} catch (error) {
				updating = false;
				const code =
					typeof error === 'object' && error != null && 'code' in error
						? String(error.code)
						: 'install_failed';
				errorMessage = `about.update.android.error.${code}`;
			}
			return;
		}

		if (platformUpdateAction && !platformUpdateAction.canApplyInApp) {
			trackEvent('external_update_open');
			try {
				await platformUpdateAction.applyUpdate(latestRelease);
			} catch (err) {
				errorMessage = err instanceof Error ? err.message : '打开更新链接失败';
			} finally {
				updating = false;
			}
			return;
		}

		installPhase = 'downloading';
		installPercent = null;
		trackEvent('pwa_update_apply');
		try {
			if (platformUpdateAction) {
				await platformUpdateAction.applyUpdate(latestRelease, {
					onProgress: (progress) => {
						installPhase = progress.phase;
						installPercent = progress.percent;
					}
				});
			} else {
				await swAdapter.applyUpdateAndReload({
					onProgress: (progress) => {
						installPhase = progress.phase;
						installPercent = progress.percent;
					}
				});
			}
			// Reload should unmount the page; reset if the browser did not navigate.
			updating = false;
			installPhase = null;
			installPercent = 0;
		} catch (err) {
			updating = false;
			installPhase = null;
			installPercent = 0;
			errorMessage = resolveInstallError(err);
			trackEvent('pwa_update_install_fail', {
				code: err instanceof SwUpdateError ? err.code : 'install_failed'
			});
		}
	}

	const state = $derived({
		nativeState,
		checking,
		updating,
		installPhase,
		installPercent,
		hasUpdate,
		hasNewerVersion,
		updateSource,
		currentVersion,
		latestRelease,
		errorMessage,
		lastChecked
	} satisfies SoftwareUpdateState);

	return {
		get state() {
			return state;
		},
		get updateAction() {
			return platformUpdateAction;
		},
		observeNativeUpdate,
		continueNativeUpdate,
		cancelNativeUpdate,
		checkUpdate,
		installUpdate
	};
}

export type SoftwareUpdateStateController = ReturnType<typeof createUpdateState>;
