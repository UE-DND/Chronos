import { checkAppUpdateOnResume } from '$lib/client/app-update-ux.svelte';
import type { AppShellController } from '$lib/app/app-shell.svelte';
import { connectivity } from '$lib/platform/connectivity.svelte';
import { onboardingController } from '$lib/client/onboarding.svelte';
import { isPwaStandalone, pwaInstallController } from '$lib/client/pwa-install.svelte';
import { initAnalytics } from '$lib/client/analytics';

import { attachOfflineUx } from '$lib/platform/offline-ux.svelte';
import {
	ensureEngineFullyReady,
	ensureEngineReady,
	getAppController,
	getOfficialPluginService
} from '$lib/services/app-engine';
import { configureHostI18n } from '$lib/i18n/host-i18n.svelte';
import { getHostPlatform } from '$lib/platform/host-platform';
import { installScrollBoundaryFeedback } from '$lib/platform/scroll-boundary-feedback';
import { dispatchSystemBack } from '$lib/navigation/nav-coordinator';
import type { TimetableScreenController } from '$lib/timetable/timetable-screen.svelte';
import type { ShellTabController } from '$lib/shell/shell-tab.svelte';
import { createTodayWidgetSyncService, type TodayWidgetSyncService } from './today-widget-sync';
import { registerHyperellipse } from 'hyperellipse';

export type PlatformBootstrapDeps = {
	shell: AppShellController;
	timetableScreen: TimetableScreenController;
	shellTab: ShellTabController;
};

export type PlatformBootstrapController = {
	init(): () => void;
};

export function createPlatformBootstrap(deps: PlatformBootstrapDeps): PlatformBootstrapController {
	let started = false;
	let disposeEffects: (() => void) | null = null;
	let disposeOfflineUx: (() => void) | null = null;
	let disposePlatform: (() => void) | null = null;
	let disposeScrollBoundaryFeedback: (() => void) | null = null;
	let todayWidgetSync: TodayWidgetSyncService | null = null;

	function init(): () => void {
		if (started) return () => {};
		started = true;

		const platform = getHostPlatform();
		if (
			(platform.isNative && platform.platformType === 'android') ||
			(!platform.isNative && isPwaStandalone())
		) {
			disposeScrollBoundaryFeedback = installScrollBoundaryFeedback();
		}

		disposePlatform =
			platform.init?.({
				onSystemBack: () => dispatchSystemBack(),
				onDeepLink: (url) => {
					if (url.protocol === 'chronos:' && url.hostname === 'today') {
						void ensureEngineFullyReady()
							.then(() => {
								const hasTodayTab = getAppController()
									.getSlots('shell.bottom-bar.tab')
									.some((tab) => tab.id === 'today');
								deps.shellTab.setActiveTab(hasTodayTab ? 'today' : 'timetable');
								if (!hasTodayTab) deps.timetableScreen.jumpToCurrentWeek();
								return import('$lib/navigation/nav-coordinator');
							})
							.then(({ navigateForward }) => navigateForward('/', { replace: true }))
							.catch((error) =>
								console.error('[platform] Failed to open today widget link', error)
							);
						return;
					}
					const path = url.hostname === 's' || url.pathname.startsWith('/s') ? '/s' : url.pathname;
					const target = `${path}${url.search}${url.hash}`;
					void import('$lib/navigation/nav-coordinator').then(({ navigateForward }) => {
						void navigateForward(target);
					});
				},
				onAppResume: () => {
					void checkAppUpdateOnResume();
					void ensureEngineReady().then((engine) => {
						engine.refreshSystemTime();
						void deps.shell.classNotifications.sync(true);
						void todayWidgetSync?.sync();
						void getOfficialPluginService().retryPendingUpdates();
					});
				}
			}) ?? null;

		registerHyperellipse();
		connectivity.init();
		const retry = () => {
			if (navigator.onLine) void getOfficialPluginService().retryPendingUpdates();
			void import('$lib/client/web-host-update')
				.then((module) => module.recoverInterruptedWebUpdate())
				.catch(console.error);
		};
		const resume = () => {
			if (document.visibilityState === 'visible') retry();
		};
		window.addEventListener('online', retry);
		document.addEventListener('visibilitychange', resume);

		void ensureEngineReady()
			.then((engine) => {
				configureHostI18n({
					onLocaleChanged: (handler) => engine.events.on('i18n:localeChanged', handler)
				});
				void import('$lib/client/web-host-update')
					.then((module) => module.recoverInterruptedWebUpdate())
					.catch(console.error);
				deps.shell.init();
				deps.shell.classNotifications.start();
				deps.timetableScreen.init(deps.shell);
				todayWidgetSync?.dispose();
				todayWidgetSync = createTodayWidgetSyncService(engine, platform, {
					visibilityTarget: document
				});
				todayWidgetSync.start();
				// Gate first so the async install init cannot auto-popup behind onboarding.
				if (!platform.supportsPwaInstall) {
					pwaInstallController.setInstallPromptGate(() => true);
				} else {
					pwaInstallController.setInstallPromptGate(() => onboardingController.state.open);
				}
				void pwaInstallController.init();
				initAnalytics();
				window.__chronosHideBootFallback?.();
				platform.hideBootSplash?.();

				disposeOfflineUx = attachOfflineUx(connectivity);

				disposeEffects = $effect.root(() => {
					$effect(() => {
						if (deps.timetableScreen.state.hasLoadedAppState) {
							onboardingController.maybeShow(Boolean(deps.timetableScreen.state.currentTimetable));
						}
					});

					$effect(() => {
						if (onboardingController.state.open) {
							pwaInstallController.cancelScheduledDialog();
							pwaInstallController.dismiss({ track: false });
						} else {
							pwaInstallController.tryScheduleInstallDialog();
						}
					});

					$effect(() => {
						platform.syncTheme?.(deps.shell.state.isDark);
					});
				});
			})
			.catch((error) => {
				console.error('[bootstrap] Failed to initialize profile', error);
				platform.hideBootSplash?.();
				window.__chronosShowBootFailure?.();
			});

		return () => {
			window.removeEventListener('online', retry);
			document.removeEventListener('visibilitychange', resume);
			disposeEffects?.();
			disposeEffects = null;
			deps.shell.appearance.destroy();
			deps.shell.classNotifications.dispose();
			disposeOfflineUx?.();
			disposeOfflineUx = null;
			todayWidgetSync?.dispose();
			todayWidgetSync = null;
			connectivity.destroy();
			disposeScrollBoundaryFeedback?.();
			disposeScrollBoundaryFeedback = null;
			disposePlatform?.();
			disposePlatform = null;
			started = false;
		};
	}

	return { init };
}
