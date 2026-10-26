import { appStartup } from '#lib/boot/startup.svelte.ts';
import { hostT } from '#lib/i18n/host-i18n.svelte.ts';
import { SvelteDate } from 'svelte/reactivity';
import { APP_VERSION, HOST_BUILD } from '#lib/config/app-meta.ts';
import { trackEvent } from '#lib/client/analytics.ts';
import type { AppResult } from '@chronos/core';
import type { ReleaseCatalog } from './catalog';
import { compareReleaseVersions, type Release } from './release';
import {
	createReleaseFeedAdapter,
	type ReleaseFeedAdapter,
	type ReleaseFeedKind
} from './release-feed-adapter';
import { SwUpdateError, type ApplyUpdateOptions } from '#lib/client/pwa-sw.ts';
import {
	getHostPlatform,
	type PlatformUpdateAction,
	type HostUpdatePhase,
	type NativeUpdateState
} from '#lib/platform/host-platform.ts';
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
	packageShared: boolean;
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
	const isIosPackageUpdate = hostUpdateAction?.mode === 'external-ipa';
	const feedKind: ReleaseFeedKind = isNativeUpdatePlatform
		? 'android'
		: isIosPackageUpdate
			? 'ios'
			: 'web';
	const requiresPublishedFeed = feedKind !== 'web';
	const feedUrl =
		feedKind === 'android' && typeof __ANDROID_RELEASE_FEED_URL__ === 'string'
			? __ANDROID_RELEASE_FEED_URL__
			: feedKind === 'ios' && typeof __IOS_RELEASE_FEED_URL__ === 'string'
				? __IOS_RELEASE_FEED_URL__
				: undefined;
	const feedAdapter: ReleaseFeedAdapter =
		options.releaseFeedAdapter ??
		createReleaseFeedAdapter({
			fetchLatestRelease: options.fetchLatestRelease,
			localCatalog: options.localCatalog,
			versionUrl: feedUrl,
			allowLocalFallback: options.allowLocalFallback ?? !requiresPublishedFeed,
			requireVersionUrl: requiresPublishedFeed,
			feedKind
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
	let packageShared = $state(false);
	let nativeState = $state.raw<NativeUpdateState | null>(null);

	function updateErrorKey(code: string): string {
		return isIosPackageUpdate
			? `about.update.ios.error.${code}`
			: `about.update.android.error.${code}`;
	}

	function releaseHasNewBuild(release: Release | null): boolean {
		return Boolean(release?.hostUpdate && release.hostUpdate.host.buildId !== HOST_BUILD.buildId);
	}

	function applyNativeState(snapshot: NativeUpdateState) {
		nativeState = snapshot;
		if (snapshot.phase === 'idle') return;
		const active = !['idle', 'succeeded', 'failed', 'canceled'].includes(snapshot.phase);
		updating = active;
		installPhase = active ? (snapshot.phase as HostUpdatePhase) : null;
		installPercent = snapshot.percent;
		errorMessage =
			snapshot.phase === 'failed' ? updateErrorKey(snapshot.errorCode ?? 'install_failed') : null;
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
			errorMessage = updateErrorKey('install_failed');
			return () => {};
		}
		return dispose;
	}

	async function continueNativeUpdate() {
		try {
			if (hostUpdateAction?.native)
				applyNativeState(await hostUpdateAction.native.continueUpdate());
		} catch {
			errorMessage = updateErrorKey('install_failed');
		}
	}
	async function cancelNativeUpdate() {
		try {
			if (hostUpdateAction?.native) applyNativeState(await hostUpdateAction.native.cancelUpdate());
		} catch {
			errorMessage = updateErrorKey('install_failed');
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
		packageShared = false;
		trackEvent('update_check_attempt');

		let swHasUpdate = false;
		try {
			swHasUpdate =
				!requiresPublishedFeed &&
				(swAdapter.isUpdatePending() || (await swAdapter.checkForUpdate()));
			const result = await feedAdapter.fetchLatestRelease();
			if (result.ok) {
				const release = result.value;
				latestRelease = release;
				const newerVersion = compareReleaseVersions(release.tagName, currentVersion) > 0;
				applyUpdateSignals(newerVersion, swHasUpdate || releaseHasNewBuild(release));
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
			} else if (!requiresPublishedFeed && restoreCachedCheckSnapshot(swHasUpdate)) {
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
			} else if (!requiresPublishedFeed && restoreCachedCheckSnapshot(swHasUpdate)) {
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

	function resolveIosPackageError(error: unknown): string {
		const code =
			typeof error === 'object' && error != null && 'code' in error ? String(error.code) : '';
		if (
			code === 'plugin_prepare_failed' ||
			code === 'integrity_mismatch' ||
			code === 'download_failed' ||
			code === 'download_canceled' ||
			code === 'share_canceled' ||
			code === 'share_failed' ||
			code === 'invalid_descriptor'
		) {
			return `about.update.ios.error.${code}`;
		}
		return 'about.update.ios.error.download_failed';
	}

	const platformUpdateAction: PlatformUpdateAction | undefined = isNativeUpdatePlatform
		? hostUpdateAction
		: hostUpdateAction
			? {
					...hostUpdateAction,
					applyUpdate(release, opts) {
						if (!hostUpdateAction.canApplyInApp) {
							return hostUpdateAction.applyUpdate(release, opts);
						}
						return swAdapter.applyUpdateAndReload(opts);
					}
				}
			: undefined;

	async function installUpdate() {
		if (appStartup.state.failure) {
			errorMessage = hostT('startup.pluginsFailed');
			return;
		}
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

		if (isIosPackageUpdate && platformUpdateAction) {
			installPhase = 'downloading';
			installPercent = null;
			try {
				await platformUpdateAction.applyUpdate(latestRelease, {
					onProgress: (progress) => {
						installPhase = progress.phase;
						installPercent = progress.percent;
					}
				});
				packageShared = true;
			} catch (error) {
				packageShared = false;
				errorMessage = resolveIosPackageError(error);
			} finally {
				updating = false;
				installPhase = null;
				installPercent = null;
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
		lastChecked,
		packageShared
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
