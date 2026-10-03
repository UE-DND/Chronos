import { afterEach, beforeEach, describe, expect, it, vi } from 'vite-plus/test';

const { snackbarKey, checkUpdate, state, isSwUpdatePending } = vi.hoisted(() => ({
	snackbarKey: vi.fn(),
	checkUpdate: vi.fn(async () => true),
	state: { hasUpdate: false },
	isSwUpdatePending: vi.fn(() => false)
}));
vi.mock('./pwa-sw', () => ({ isSwUpdatePending, onSwUpdateAvailable: vi.fn() }));
vi.mock('$lib/content/releases/update-state.svelte', () => ({
	createUpdateState: () => ({ state, checkUpdate, updateAction: { mode: 'service-worker' } })
}));
vi.mock('$lib/components/ui/snackbar-state.svelte', () => ({ snackbarKey }));

describe('initAppUpdateUx', () => {
	beforeEach(() => {
		vi.clearAllMocks();
		vi.useFakeTimers();
		checkUpdate.mockResolvedValue(true);
		vi.resetModules();
		state.hasUpdate = false;
		isSwUpdatePending.mockReturnValue(false);
		vi.stubGlobal('window', new EventTarget());
		vi.stubGlobal('document', Object.assign(new EventTarget(), { visibilityState: 'visible' }));
		vi.stubGlobal('navigator', { onLine: true });
	});

	afterEach(() => {
		vi.clearAllTimers();
		vi.useRealTimers();
		vi.unstubAllGlobals();
	});

	it('checks once at startup and exposes the shared result without a snackbar', async () => {
		const { initAppUpdateUx, appUpdateNotice, getAppUpdateState } =
			await import('./app-update-ux.svelte');
		initAppUpdateUx();
		initAppUpdateUx();
		expect(checkUpdate).toHaveBeenCalledOnce();
		expect(appUpdateNotice.hasUpdate).toBe(false);
		state.hasUpdate = true;
		expect(appUpdateNotice.hasUpdate).toBe(true);
		expect(getAppUpdateState()).toBe(getAppUpdateState());
		state.hasUpdate = false;
		expect(appUpdateNotice.hasUpdate).toBe(false);
		expect(snackbarKey).not.toHaveBeenCalled();
	});

	it('retains a service worker update received after the startup check', async () => {
		const { initAppUpdateUx, appUpdateNotice } = await import('./app-update-ux.svelte');
		let notifyUpdate = () => {};
		initAppUpdateUx((listener) => {
			notifyUpdate = listener;
			return () => {};
		});
		notifyUpdate();
		notifyUpdate();
		expect(appUpdateNotice.hasUpdate).toBe(true);
		expect(snackbarKey).not.toHaveBeenCalled();
	});

	it('exposes an already pending update when initialized', async () => {
		isSwUpdatePending.mockReturnValue(true);
		const { initAppUpdateUx, appUpdateNotice } = await import('./app-update-ux.svelte');
		initAppUpdateUx();
		expect(appUpdateNotice.hasUpdate).toBe(true);
		expect(snackbarKey).not.toHaveBeenCalled();
	});

	it('exposes a host update required by a plugin request without a snackbar', async () => {
		const { initAppUpdateUx, appUpdateNotice } = await import('./app-update-ux.svelte');
		initAppUpdateUx();
		window.dispatchEvent(new Event('chronos-update-required'));
		expect(appUpdateNotice.hasUpdate).toBe(true);
		expect(snackbarKey).not.toHaveBeenCalled();
	});
	it('retries a failed startup check without requiring an online event', async () => {
		checkUpdate.mockResolvedValueOnce(false).mockImplementationOnce(async () => {
			state.hasUpdate = true;
			return true;
		});
		const { initAppUpdateUx, appUpdateNotice } = await import('./app-update-ux.svelte');
		initAppUpdateUx();
		await vi.advanceTimersByTimeAsync(10_000);
		expect(checkUpdate).toHaveBeenCalledTimes(2);
		expect(appUpdateNotice.hasUpdate).toBe(true);
		expect(snackbarKey).not.toHaveBeenCalled();
	});

	it('waits while offline and checks immediately when connectivity returns', async () => {
		vi.stubGlobal('navigator', { onLine: false });
		const { initAppUpdateUx } = await import('./app-update-ux.svelte');
		initAppUpdateUx();
		await vi.advanceTimersByTimeAsync(60_000);
		expect(checkUpdate).not.toHaveBeenCalled();
		Object.assign(navigator, { onLine: true });
		window.dispatchEvent(new Event('online'));
		await vi.advanceTimersByTimeAsync(0);
		expect(checkUpdate).toHaveBeenCalledOnce();
	});

	it('pauses in the background and retries a failed check on resume', async () => {
		checkUpdate.mockResolvedValue(false);
		const { initAppUpdateUx } = await import('./app-update-ux.svelte');
		initAppUpdateUx();
		await vi.advanceTimersByTimeAsync(0);
		Object.assign(document, { visibilityState: 'hidden' });
		document.dispatchEvent(new Event('visibilitychange'));
		await vi.advanceTimersByTimeAsync(60_000);
		expect(checkUpdate).toHaveBeenCalledOnce();
		Object.assign(document, { visibilityState: 'visible' });
		document.dispatchEvent(new Event('visibilitychange'));
		await vi.advanceTimersByTimeAsync(0);
		expect(checkUpdate).toHaveBeenCalledTimes(2);
	});

	it('backs off repeated failures, then rechecks after a successful result becomes stale', async () => {
		checkUpdate.mockResolvedValue(false);
		const { initAppUpdateUx } = await import('./app-update-ux.svelte');
		initAppUpdateUx();
		await vi.advanceTimersByTimeAsync(10_000 + 30_000 + 60_000);
		expect(checkUpdate).toHaveBeenCalledTimes(4);
		checkUpdate.mockResolvedValue(true);
		await vi.advanceTimersByTimeAsync(300_000);
		expect(checkUpdate).toHaveBeenCalledTimes(5);
		document.dispatchEvent(new Event('visibilitychange'));
		await vi.advanceTimersByTimeAsync(0);
		expect(checkUpdate).toHaveBeenCalledTimes(5);
		await vi.advanceTimersByTimeAsync(300_000);
		expect(checkUpdate).toHaveBeenCalledTimes(6);
	});

	it('does not start overlapping automatic checks or keep polling after an update is found', async () => {
		let finish: (value: boolean) => void = () => {};
		checkUpdate.mockImplementationOnce(
			() =>
				new Promise<boolean>((resolve) => {
					finish = resolve;
				})
		);
		const { initAppUpdateUx } = await import('./app-update-ux.svelte');
		initAppUpdateUx();
		window.dispatchEvent(new Event('online'));
		document.dispatchEvent(new Event('visibilitychange'));
		expect(checkUpdate).toHaveBeenCalledOnce();
		state.hasUpdate = true;
		finish(true);
		await vi.advanceTimersByTimeAsync(600_000);
		expect(checkUpdate).toHaveBeenCalledOnce();
	});
	it('retries an unexpected rejection without leaving the check locked', async () => {
		checkUpdate.mockRejectedValueOnce(new Error('temporarily unavailable'));
		const { initAppUpdateUx } = await import('./app-update-ux.svelte');
		initAppUpdateUx();
		await vi.advanceTimersByTimeAsync(10_000);
		expect(checkUpdate).toHaveBeenCalledTimes(2);
		expect(snackbarKey).not.toHaveBeenCalled();
	});

	it('retries through the native resume entry point without waiting for a browser visibility event', async () => {
		checkUpdate.mockResolvedValueOnce(false);
		const { initAppUpdateUx, checkAppUpdateOnResume } = await import('./app-update-ux.svelte');
		initAppUpdateUx();
		await vi.advanceTimersByTimeAsync(0);
		await checkAppUpdateOnResume();
		expect(checkUpdate).toHaveBeenCalledTimes(2);
	});
});
