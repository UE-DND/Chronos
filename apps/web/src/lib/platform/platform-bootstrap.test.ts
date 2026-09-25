import { afterEach, beforeEach, describe, expect, it, vi } from 'vite-plus/test';

const mocks = vi.hoisted(() => ({
	connectivityInit: vi.fn(),
	connectivityDestroy: vi.fn(),
	pwaInstallInit: vi.fn().mockResolvedValue(undefined),
	setInstallPromptGate: vi.fn(),
	tryScheduleInstallDialog: vi.fn(),
	initAnalytics: vi.fn(),
	attachOfflineUx: vi.fn(() => vi.fn()),
	onboardingState: { open: false } as { open: boolean }
}));

vi.mock('$lib/platform/connectivity.svelte', () => ({
	connectivity: {
		init: mocks.connectivityInit,
		destroy: mocks.connectivityDestroy,
		isOnline: true
	}
}));

vi.mock('$lib/client/pwa-install.svelte', () => ({
	pwaInstallController: {
		init: mocks.pwaInstallInit,
		setInstallPromptGate: mocks.setInstallPromptGate,
		cancelScheduledDialog: vi.fn(),
		dismiss: vi.fn(),
		tryScheduleInstallDialog: mocks.tryScheduleInstallDialog
	}
}));

vi.mock('$lib/client/analytics', () => ({
	initAnalytics: mocks.initAnalytics
}));

vi.mock('$lib/services/app-engine', () => ({
	ensureEngineReady: vi.fn().mockResolvedValue({
		events: { on: vi.fn(() => ({ dispose: vi.fn() })) }
	}),
	getAppEngine: vi.fn(() => ({
		themes: { getTheme: vi.fn() },
		state: { activeThemeId: 'm3-default' },
		storage: { deletePluginData: vi.fn().mockResolvedValue(undefined) }
	}))
}));

vi.mock('$lib/platform/offline-ux.svelte', () => ({
	attachOfflineUx: mocks.attachOfflineUx
}));

vi.mock('$lib/client/onboarding.svelte', () => ({
	onboardingController: {
		state: mocks.onboardingState,
		maybeShow: vi.fn()
	}
}));

import { createPlatformBootstrap, type PlatformBootstrapDeps } from './platform-bootstrap.svelte';

describe('createPlatformBootstrap', () => {
	const appearance = {
		apply: vi.fn(),
		destroy: vi.fn(),
		coursePalette: []
	};
	const shell = {
		init: vi.fn(),
		appearance,
		controller: {
			activeThemeId: 'm3-default',
			userPreferences: { wallpaperSource: 'theme', wallpaperColorEnabled: false }
		},
		state: { isDark: false, initialized: false }
	};
	const timetableScreen = {
		init: vi.fn(),
		state: {
			hasLoadedAppState: false,
			currentTimetable: null
		}
	};
	const deps = { shell, timetableScreen } as unknown as PlatformBootstrapDeps;

	beforeEach(() => {
		vi.clearAllMocks();
		mocks.onboardingState.open = false;
		vi.stubGlobal('window', { __chronosHideBootFallback: vi.fn() });
	});

	afterEach(() => {
		vi.unstubAllGlobals();
	});

	it('runs startup sequence in order', async () => {
		const platform = createPlatformBootstrap(deps);
		const teardown = platform.init();

		await vi.waitFor(() => {
			expect(shell.init).toHaveBeenCalled();
		});

		expect(mocks.connectivityInit).toHaveBeenCalled();
		expect(timetableScreen.init).toHaveBeenCalledWith(shell);
		expect(mocks.pwaInstallInit).toHaveBeenCalled();
		expect(mocks.initAnalytics).toHaveBeenCalled();
		expect(mocks.setInstallPromptGate).toHaveBeenCalled();
		const installPromptGate = mocks.setInstallPromptGate.mock.calls[0][0];
		expect(installPromptGate()).toBe(false);
		mocks.onboardingState.open = true;
		expect(installPromptGate()).toBe(true);
		expect(mocks.attachOfflineUx).toHaveBeenCalled();
		expect(window.__chronosHideBootFallback).toHaveBeenCalled();

		teardown();
		expect(mocks.connectivityDestroy).toHaveBeenCalled();
		expect(appearance.destroy).toHaveBeenCalled();
	});

	it('is idempotent on repeated init', () => {
		const platform = createPlatformBootstrap(deps);
		platform.init();
		platform.init();

		expect(mocks.connectivityInit).toHaveBeenCalledTimes(1);
	});

	it('hides splash screen on boot failure so error UI is shown', async () => {
		const { ensureEngineReady } = await import('$lib/services/app-engine');
		vi.mocked(ensureEngineReady).mockRejectedValueOnce(new Error('Profile boot error'));
		const hideBootSplash = vi.fn();
		const showBootFailure = vi.fn();
		vi.stubGlobal('window', {
			__chronosHideBootFallback: vi.fn(),
			__chronosShowBootFailure: showBootFailure
		});

		const { setHostPlatform, resetHostPlatform } = await import('./host-platform');
		setHostPlatform({
			id: 'mobile',
			isNative: true,
			platformType: 'android',
			supportsPwaInstall: false,
			shouldShowInstallGuide: false,
			hideBootSplash
		});

		const platform = createPlatformBootstrap(deps);
		platform.init();

		await vi.waitFor(() => {
			expect(hideBootSplash).toHaveBeenCalled();
			expect(showBootFailure).toHaveBeenCalled();
		});

		resetHostPlatform();
	});
});
