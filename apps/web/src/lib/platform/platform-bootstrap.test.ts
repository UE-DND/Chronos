import { afterEach, beforeEach, describe, expect, it, vi } from 'vite-plus/test';
vi.mock('hyperellipse', () => ({ registerHyperellipse: vi.fn() }));

const mocks = vi.hoisted(() => ({
	connectivityInit: vi.fn(),
	connectivityDestroy: vi.fn(),
	pwaInstallInit: vi.fn().mockResolvedValue(undefined),
	setInstallPromptGate: vi.fn(),
	tryScheduleInstallDialog: vi.fn(),
	isPwaStandalone: vi.fn(() => false),
	installScrollBoundaryFeedback: vi.fn(() => vi.fn()),
	initAnalytics: vi.fn(),
	attachOfflineUx: vi.fn(() => vi.fn()),
	checkAppUpdateOnResume: vi.fn(async () => {}),
	refreshSystemTime: vi.fn(),
	retryPendingUpdates: vi.fn(),
	listenWindow: vi.fn<(name: string, listener: EventListener) => void>(),
	listenDocument: vi.fn<(name: string, listener: EventListener) => void>(),
	onboardingState: { open: false } as { open: boolean },
	tabIds: ['today'] as string[]
}));

vi.mock('$lib/platform/connectivity.svelte', () => ({
	connectivity: {
		init: mocks.connectivityInit,
		destroy: mocks.connectivityDestroy,
		isOnline: true
	}
}));

vi.mock('$lib/client/pwa-install.svelte', () => ({
	isPwaStandalone: mocks.isPwaStandalone,
	pwaInstallController: {
		init: mocks.pwaInstallInit,
		setInstallPromptGate: mocks.setInstallPromptGate,
		cancelScheduledDialog: vi.fn(),
		dismiss: vi.fn(),
		tryScheduleInstallDialog: mocks.tryScheduleInstallDialog
	}
}));

vi.mock('$lib/platform/scroll-boundary-feedback', () => ({
	installScrollBoundaryFeedback: mocks.installScrollBoundaryFeedback
}));

vi.mock('$lib/client/web-host-update', () => ({ recoverInterruptedWebUpdate: vi.fn() }));
vi.mock('$lib/client/app-update-ux.svelte', () => ({
	checkAppUpdateOnResume: mocks.checkAppUpdateOnResume
}));

vi.mock('$lib/client/analytics', () => ({
	initAnalytics: mocks.initAnalytics
}));

vi.mock('$lib/services/app-engine', () => ({
	ensureEngineFullyReady: vi.fn().mockResolvedValue(undefined),
	ensureEngineReady: vi.fn().mockResolvedValue({
		events: { on: vi.fn(() => ({ dispose: vi.fn() })) },
		refreshSystemTime: mocks.refreshSystemTime
	}),
	getOfficialPluginService: () => ({ retryPendingUpdates: mocks.retryPendingUpdates }),
	getAppController: vi.fn(() => ({
		getSlots: () => mocks.tabIds.map((id) => ({ id }))
	})),
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
		destroy: vi.fn(),
		init: vi.fn(),
		classNotifications: { start: vi.fn(), sync: vi.fn(), dispose: vi.fn() },
		appearance,
		controller: {
			activeThemeId: 'm3-default',
			userPreferences: { wallpaperSource: 'theme', wallpaperColorEnabled: false }
		},
		state: { isDark: false, initialized: false }
	};
	const timetableScreen = {
		init: vi.fn(),
		destroy: vi.fn(),
		jumpToCurrentWeek: vi.fn(),
		state: {
			hasLoadedAppState: false,
			currentTimetable: null
		}
	};
	const shellTab = { setActiveTab: vi.fn() };
	const deps = { shell, timetableScreen, shellTab } as unknown as PlatformBootstrapDeps;

	beforeEach(() => {
		vi.clearAllMocks();
		mocks.tabIds = ['today'];
		mocks.onboardingState.open = false;
		vi.stubGlobal('document', {
			addEventListener: mocks.listenDocument,
			removeEventListener: vi.fn()
		});
		vi.stubGlobal('window', {
			location: { href: 'https://chronos.example/' },
			__chronosHideBootFallback: vi.fn(),
			addEventListener: mocks.listenWindow,
			removeEventListener: vi.fn()
		});
	});

	afterEach(() => {
		vi.unstubAllGlobals();
	});

	it('does not start resources after release while engine readiness is pending', async () => {
		const { ensureEngineReady } = await import('$lib/services/app-engine');
		let resolve!: (engine: Awaited<ReturnType<typeof ensureEngineReady>>) => void;
		const engine = await ensureEngineReady();
		vi.mocked(ensureEngineReady).mockReturnValueOnce(
			new Promise((done) => {
				resolve = done;
			})
		);
		const teardown = createPlatformBootstrap(deps).init();
		teardown();
		resolve(engine);
		await new Promise((done) => setTimeout(done, 0));
		expect(shell.init).not.toHaveBeenCalled();
		expect(mocks.pwaInstallInit).not.toHaveBeenCalled();
		expect(window.__chronosHideBootFallback).not.toHaveBeenCalled();
	});
	it('does not let an old disposer release a subsequent mount', async () => {
		const platform = createPlatformBootstrap(deps);
		const old = platform.init();
		await vi.waitFor(() => expect(shell.init).toHaveBeenCalledTimes(1));
		old();
		const next = platform.init();
		await vi.waitFor(() => expect(shell.init).toHaveBeenCalledTimes(2));
		old();
		expect(shell.destroy).toHaveBeenCalledTimes(1);
		next();
		next();
		expect(shell.destroy).toHaveBeenCalledTimes(2);
	});
	it('releases resources acquired before startup fails', async () => {
		shell.init.mockImplementationOnce(() => {
			throw new Error('shell failed');
		});
		const platform = createPlatformBootstrap(deps);
		const teardown = platform.init();
		await vi.waitFor(() => expect(shell.destroy).toHaveBeenCalledOnce());
		expect(mocks.connectivityDestroy).toHaveBeenCalledOnce();
		expect(timetableScreen.init).not.toHaveBeenCalled();
		teardown();
		expect(shell.destroy).toHaveBeenCalledOnce();
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
		expect(shell.destroy).toHaveBeenCalled();
	});

	it('is idempotent on repeated init', () => {
		const platform = createPlatformBootstrap(deps);
		platform.init();
		platform.init();

		expect(mocks.connectivityInit).toHaveBeenCalledTimes(1);
	});

	it('checks app updates through the native resume callback', async () => {
		const { setHostPlatform, resetHostPlatform } = await import('./host-platform');
		let callbacks: import('./host-platform').HostPlatformInitCallbacks | undefined;
		setHostPlatform({
			id: 'mobile',
			isNative: true,
			platformType: 'android',
			supportsPwaInstall: false,
			shouldShowInstallGuide: false,
			init(next) {
				callbacks = next;
				return () => {};
			}
		});
		const teardown = createPlatformBootstrap(deps).init();
		try {
			callbacks?.onAppResume?.();
			expect(mocks.checkAppUpdateOnResume).toHaveBeenCalledOnce();
			await vi.waitFor(() => expect(mocks.refreshSystemTime).toHaveBeenCalledOnce());
			const online = mocks.listenWindow.mock.calls.find(([name]) => name === 'online')?.[1];
			const visible = mocks.listenDocument.mock.calls.find(
				([name]) => name === 'visibilitychange'
			)?.[1];
			if (typeof online === 'function') online(new Event('online'));
			if (typeof visible === 'function') visible(new Event('visibilitychange'));
			expect(mocks.retryPendingUpdates).not.toHaveBeenCalled();
		} finally {
			teardown();
			resetHostPlatform();
		}
	});

	it('routes the Today widget deep link to the Today tab when the plugin exists', async () => {
		const { setHostPlatform, resetHostPlatform } = await import('./host-platform');
		let callbacks: import('./host-platform').HostPlatformInitCallbacks | undefined;
		setHostPlatform({
			id: 'mobile',
			isNative: true,
			platformType: 'android',
			supportsPwaInstall: false,
			shouldShowInstallGuide: false,
			init(next) {
				callbacks = next;
				return vi.fn();
			}
		});

		const platform = createPlatformBootstrap(deps);
		const teardown = platform.init();
		callbacks?.onDeepLink?.(new URL('chronos://today'));

		await vi.waitFor(() => expect(shellTab.setActiveTab).toHaveBeenCalledWith('today'));
		teardown();
		resetHostPlatform();
	});

	it('falls back to the main timetable tab when the Today plugin is absent', async () => {
		mocks.tabIds = ['timetable'];
		const { setHostPlatform, resetHostPlatform } = await import('./host-platform');
		let callbacks: import('./host-platform').HostPlatformInitCallbacks | undefined;
		setHostPlatform({
			id: 'mobile',
			isNative: true,
			platformType: 'android',
			supportsPwaInstall: false,
			shouldShowInstallGuide: false,
			init(next) {
				callbacks = next;
				return vi.fn();
			}
		});

		const platform = createPlatformBootstrap(deps);
		const teardown = platform.init();
		callbacks?.onDeepLink?.(new URL('chronos://today'));

		await vi.waitFor(() => expect(shellTab.setActiveTab).toHaveBeenCalledWith('timetable'));
		teardown();
		resetHostPlatform();
	});

	it('hides splash screen on boot failure so error UI is shown', async () => {
		const { ensureEngineReady } = await import('$lib/services/app-engine');
		vi.mocked(ensureEngineReady).mockRejectedValueOnce(new Error('Profile boot error'));
		const hideBootSplash = vi.fn();
		const showBootFailure = vi.fn();
		vi.stubGlobal('window', {
			__chronosHideBootFallback: vi.fn(),
			addEventListener: vi.fn(),
			removeEventListener: vi.fn(),
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
