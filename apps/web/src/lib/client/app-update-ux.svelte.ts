import { isSwUpdatePending, onSwUpdateAvailable } from '#lib/client/pwa-sw.ts';
import {
	createUpdateState,
	type SoftwareUpdateStateController
} from '#lib/content/releases/update-state.svelte.ts';

const CHECK_INTERVAL_MS = 5 * 60_000;
const RETRY_DELAYS_MS = [10_000, 30_000, 60_000, CHECK_INTERVAL_MS];
let initialized = false;
let timer: ReturnType<typeof setTimeout> | undefined;
let running = false;
let failures = 0;
let lastSuccessAt: number | undefined;

function clearCheckTimer() {
	if (timer !== undefined) clearTimeout(timer);
	timer = undefined;
}

function canCheckAutomatically(): boolean {
	return (
		document.visibilityState !== 'hidden' &&
		navigator.onLine !== false &&
		!appUpdateNotice.hasUpdate
	);
}

/** Shared by browser foreground/network events and the native resume callback. */
export async function checkAppUpdateOnResume(force = false): Promise<void> {
	if (!initialized) return;
	clearCheckTimer();
	if (running || !canCheckAutomatically()) return;
	if (!force && lastSuccessAt !== undefined && Date.now() - lastSuccessAt < CHECK_INTERVAL_MS) {
		timer = setTimeout(
			() => void checkAppUpdateOnResume(),
			CHECK_INTERVAL_MS - (Date.now() - lastSuccessAt)
		);
		return;
	}
	running = true;
	let success = false;
	try {
		success = await getAppUpdateState().checkUpdate();
	} catch {
		// Keep automatic detection quiet; the update page owns error messages.
	} finally {
		running = false;
	}
	if (success) {
		failures = 0;
		lastSuccessAt = Date.now();
	} else {
		lastSuccessAt = undefined;
		failures += 1;
	}
	if (!canCheckAutomatically()) return;
	const delay = success
		? CHECK_INTERVAL_MS
		: RETRY_DELAYS_MS[Math.min(failures - 1, RETRY_DELAYS_MS.length - 1)]!;
	timer = setTimeout(() => void checkAppUpdateOnResume(), delay);
}
let updateRequired = $state(false);
let updateState: SoftwareUpdateStateController | undefined;

export function getAppUpdateState(): SoftwareUpdateStateController {
	return (updateState ??= createUpdateState({ allowLocalFallback: false }));
}

export const appUpdateNotice = {
	get hasUpdate() {
		return updateRequired || getAppUpdateState().state.hasUpdate;
	}
};

export function initAppUpdateUx(listenUpdate = onSwUpdateAvailable) {
	if (initialized || typeof window === 'undefined') return;
	initialized = true;
	if (getAppUpdateState().updateAction?.mode === 'service-worker') {
		updateRequired = isSwUpdatePending();
		listenUpdate(() => {
			updateRequired = true;
		});
		window.addEventListener('chronos-update-required', () => {
			updateRequired = true;
		});
	}
	window.addEventListener('online', () => void checkAppUpdateOnResume(true));
	window.addEventListener('offline', clearCheckTimer);
	document.addEventListener('visibilitychange', () => {
		if (document.visibilityState === 'hidden') clearCheckTimer();
		else void checkAppUpdateOnResume();
	});
	void checkAppUpdateOnResume();
}
