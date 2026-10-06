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
	let current: { alive: boolean } | null = null;

	function init(): () => void {
		if (current) return () => {};
		const session = { alive: true };
		current = session;
		const cleanups: (() => void)[] = [];
		let todayWidgetSync: TodayWidgetSyncService | null = null;
		function own(cleanup: (() => void) | void | null) {
			if (cleanup) cleanups.push(cleanup);
		}
		function teardown() {
			if (!session.alive) return;
			session.alive = false;
			if (current === session) current = null;
			for (const cleanup of cleanups.splice(0).reverse()) {
				try {
					cleanup();
				} catch (error) {
					console.error('[bootstrap] Failed to release resource', error);
				}
			}
		}

		const platform = getHostPlatform();
		function failed(error: unknown) {
			if (!session.alive) return;
			teardown();
			console.error('[bootstrap] Failed to initialize profile', error);
			platform.hideBootSplash?.();
			window.__chronosShowBootFailure?.();
		}
		try {
			if (
				(platform.isNative && platform.platformType === 'android') ||
				(!platform.isNative && isPwaStandalone())
			) {
				own(installScrollBoundaryFeedback());
			}

			own(
				platform.init?.({
					onSystemBack: () => {
						return session.alive ? dispatchSystemBack() : 'consumed';
					},
					onDeepLink: (url) => {
						if (!session.alive) return;
						if (url.protocol === 'chronos:' && url.hostname === 'today') {
							void ensureEngineFullyReady()
								.then(async () => {
									if (!session.alive) return;
									const hasTodayTab = getAppController()
										.getSlots('shell.bottom-bar.tab')
										.some((tab) => tab.id === 'today');
									deps.shellTab.setActiveTab(hasTodayTab ? 'today' : 'timetable');
									if (!hasTodayTab) deps.timetableScreen.jumpToCurrentWeek();
									const { navigateForward } = await import('$lib/navigation/nav-coordinator');
									if (session.alive) await navigateForward('/', { replace: true });
								})
								.catch((error) =>
									console.error('[platform] Failed to open today widget link', error)
								);
							return;
						}
						const path =
							url.hostname === 's' || url.pathname.startsWith('/s') ? '/s' : url.pathname;
						const target = `${path}${url.search}${url.hash}`;
						void import('$lib/navigation/nav-coordinator')
							.then(({ navigateForward }) => {
								if (session.alive) void navigateForward(target);
							})
							.catch(console.error);
					},
					onAppResume: () => {
						if (!session.alive) return;
						void checkAppUpdateOnResume();
						void ensureEngineReady()
							.then((engine) => {
								if (!session.alive) return;
								engine.refreshSystemTime();
								void deps.shell.classNotifications.sync(true);
								void todayWidgetSync?.sync();
								if (!platform.isNative) void getOfficialPluginService().retryPendingUpdates();
								else void platform.getUpdateAction?.()?.native?.getState().catch(console.error);
							})
							.catch(console.error);
					}
				})
			);

			registerHyperellipse();
			own(() => connectivity.destroy());
			connectivity.init();
			const retry = () => {
				if (!session.alive) return;
				if (navigator.onLine && !platform.isNative)
					void getOfficialPluginService().retryPendingUpdates();
				if (platform.isNative)
					void platform.getUpdateAction?.()?.native?.getState().catch(console.error);
				void import('$lib/client/web-host-update')
					.then((module) => {
						if (session.alive) return module.recoverInterruptedWebUpdate();
					})
					.catch(console.error);
			};
			const resume = () => {
				if (document.visibilityState === 'visible') retry();
			};
			window.addEventListener('online', retry);
			document.addEventListener('visibilitychange', resume);
			own(() => {
				window.removeEventListener('online', retry);
				document.removeEventListener('visibilitychange', resume);
			});

			void ensureEngineReady()
				.then((engine) => {
					if (!session.alive) return;
					configureHostI18n({
						onLocaleChanged: (handler) => engine.events.on('i18n:localeChanged', handler)
					});
					void import('$lib/client/web-host-update')
						.then((module) => {
							if (session.alive) return module.recoverInterruptedWebUpdate();
						})
						.catch(console.error);
					own(() => deps.shell.destroy());
					deps.shell.init();
					own(() => deps.timetableScreen.destroy());
					deps.timetableScreen.init(deps.shell);

					todayWidgetSync = createTodayWidgetSyncService(engine, platform, {
						visibilityTarget: document
					});
					own(() => todayWidgetSync?.dispose());
					todayWidgetSync.start();
					// Gate first so the async install init cannot auto-popup behind onboarding.
					if (!platform.supportsPwaInstall) {
						pwaInstallController.setInstallPromptGate(() => true);
					} else {
						pwaInstallController.setInstallPromptGate(() => onboardingController.state.open);
					}
					own(() => {
						pwaInstallController.cancelScheduledDialog();
						pwaInstallController.dismiss({ track: false });
						pwaInstallController.setInstallPromptGate(() => true);
					});
					void pwaInstallController.init(() => session.alive).catch(console.error);
					initAnalytics();
					window.__chronosHideBootFallback?.();
					platform.hideBootSplash?.();

					own(attachOfflineUx(connectivity));

					own(
						$effect.root(() => {
							$effect(() => {
								if (deps.timetableScreen.state.hasLoadedAppState) {
									onboardingController.maybeShow(
										Boolean(deps.timetableScreen.state.currentTimetable)
									);
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
						})
					);
				})
				.catch(failed);
		} catch (error) {
			failed(error);
		}

		return teardown;
	}

	return { init };
}
