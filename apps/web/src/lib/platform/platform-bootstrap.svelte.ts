import type { AppShellController } from '$lib/app/app-shell.svelte';
import { connectivity } from '$lib/platform/connectivity.svelte';
import { onboardingController } from '$lib/client/onboarding.svelte';
import { pwaInstallController } from '$lib/client/pwa-install.svelte';
import { initAnalytics } from '$lib/client/analytics';

import { attachOfflineUx } from '$lib/platform/offline-ux.svelte';
import { ensureEngineReady, getOfficialPluginService } from '$lib/services/app-engine';
import { configureHostI18n } from '$lib/i18n/host-i18n.svelte';
import { getHostPlatform } from '$lib/platform/host-platform';
import { dispatchSystemBack } from '$lib/navigation/nav-coordinator';
import type { TimetableScreenController } from '$lib/timetable/timetable-screen.svelte';
import { registerHyperellipse } from 'hyperellipse';

export type PlatformBootstrapDeps = {
	shell: AppShellController;
	timetableScreen: TimetableScreenController;
};

export type PlatformBootstrapController = {
	init(): () => void;
};

export function createPlatformBootstrap(deps: PlatformBootstrapDeps): PlatformBootstrapController {
	let started = false;
	let disposeEffects: (() => void) | null = null;
	let disposeOfflineUx: (() => void) | null = null;
	let disposePlatform: (() => void) | null = null;

	function init(): () => void {
		if (started) return () => {};
		started = true;

		const platform = getHostPlatform();

		disposePlatform =
			platform.init?.({
				onSystemBack: () => dispatchSystemBack(),
				onDeepLink: (url) => {
					const path = url.hostname === 's' || url.pathname.startsWith('/s') ? '/s' : url.pathname;
					const target = `${path}${url.search}${url.hash}`;
					void import('$lib/navigation/nav-coordinator').then(({ navigateForward }) => {
						void navigateForward(target);
					});
				},
				onAppResume: () => {
					void ensureEngineReady().then((engine) => {
						engine.refreshSystemTime();
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
				deps.timetableScreen.init(deps.shell);
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
			disposeOfflineUx?.();
			disposeOfflineUx = null;
			connectivity.destroy();
			disposePlatform?.();
			disposePlatform = null;
			started = false;
		};
	}

	return { init };
}
