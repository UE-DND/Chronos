import { HOST_BUILD } from '$lib/config/app-meta';
import { registerSW } from 'virtual:pwa-register';

let registered = false;
let needRefresh = false;

let updateServiceWorker: ((reloadPage?: boolean) => Promise<void>) | undefined;
const updateAvailableListeners = new Set<() => void>();

const CONTROLLER_CHANGE_TIMEOUT_MS = 3000;
const SW_DOWNLOAD_TIMEOUT_MS = 120_000;
const SW_WAIT_POLL_MS = 250;
const SW_UPDATEFOUND_GRACE_MS = 2_000;

export type SwUpdatePhase = 'downloading' | 'installing' | 'restarting';

export interface SwUpdateProgress {
	phase: SwUpdatePhase;
	/** Service Worker APIs expose lifecycle states, not byte-level download progress. */
	percent: number | null;
}

export type SwUpdateErrorCode =
	| 'download_timeout'
	| 'download_failed'
	| 'no_registration'
	| 'activate_timeout';

export type WaitForWaitingWorkerResult =
	| 'ready'
	| 'update_failed'
	| 'timeout'
	| 'redundant'
	| 'idle';

export class SwUpdateError extends Error {
	readonly code: SwUpdateErrorCode;

	constructor(code: SwUpdateErrorCode) {
		super(code);
		this.name = 'SwUpdateError';
		this.code = code;
	}
}

export interface ApplyUpdateOptions {
	onProgress?: (progress: SwUpdateProgress) => void;
	targetBuildId?: string;
}

export function isSwUpdatePending(): boolean {
	return needRefresh;
}

export function onSwUpdateAvailable(listener: () => void): () => void {
	updateAvailableListeners.add(listener);
	return () => {
		updateAvailableListeners.delete(listener);
	};
}

function notifyUpdateAvailable() {
	needRefresh = true;
	for (const listener of updateAvailableListeners) {
		listener();
	}
}

function registerServiceWorker() {
	updateServiceWorker = registerSW({
		immediate: true,
		onNeedRefresh() {
			notifyUpdateAvailable();
		}
	});
}

export function ensurePwaSwRegistered() {
	if (registered || typeof window === 'undefined') return;
	registered = true;

	// Register immediately: installability requires an active SW with a
	// fetch handler, idle-deferral delays beforeinstallprompt eligibility.
	registerServiceWorker();
	navigator.serviceWorker.addEventListener('controllerchange', () => {
		void checkControllerIdentity();
	});
	document.addEventListener('visibilitychange', () => {
		if (document.visibilityState === 'visible') void checkControllerIdentity();
	});
}

function markUpdatePending(): boolean {
	notifyUpdateAvailable();
	return true;
}

function reportProgress(
	onProgress: ApplyUpdateOptions['onProgress'],
	progress: SwUpdateProgress
): void {
	onProgress?.(progress);
}

export async function waitForWaitingWorker(
	registration: ServiceWorkerRegistration,
	options?: { onProgress?: (progress: SwUpdateProgress) => void; timeoutMs?: number }
): Promise<WaitForWaitingWorkerResult> {
	const onProgress = options?.onProgress;
	const timeoutMs = options?.timeoutMs ?? SW_DOWNLOAD_TIMEOUT_MS;

	if (registration.waiting) {
		reportProgress(onProgress, { phase: 'installing', percent: null });
		markUpdatePending();
		return 'ready';
	}

	reportProgress(onProgress, { phase: 'downloading', percent: null });

	try {
		await registration.update();
	} catch {
		return 'update_failed';
	}

	if (registration.waiting) {
		reportProgress(onProgress, { phase: 'installing', percent: null });
		markUpdatePending();
		return 'ready';
	}

	return new Promise((resolve) => {
		let settled = false;
		let sawInstalling = Boolean(registration.installing);
		let stateChangeListener: (() => void) | undefined;
		let timeoutId: ReturnType<typeof setTimeout> | undefined;
		let pollId: ReturnType<typeof setInterval> | undefined;
		let attachedWorker: ServiceWorker | undefined;

		const cleanup = () => {
			if (stateChangeListener && attachedWorker) {
				attachedWorker.removeEventListener('statechange', stateChangeListener);
			}
			registration.removeEventListener('updatefound', onUpdateFound);
			if (pollId) clearInterval(pollId);
			if (timeoutId) clearTimeout(timeoutId);
		};

		const finish = (result: WaitForWaitingWorkerResult) => {
			if (settled) return;
			settled = true;
			cleanup();
			resolve(result);
		};

		const armTimeout = () => {
			if (timeoutId) clearTimeout(timeoutId);
			const ms = sawInstalling ? timeoutMs : Math.min(timeoutMs, SW_UPDATEFOUND_GRACE_MS);
			timeoutId = setTimeout(() => {
				finish(sawInstalling || registration.installing ? 'timeout' : 'idle');
			}, ms);
		};

		const tryFinishReady = (): boolean => {
			if (!registration.waiting) return false;
			reportProgress(onProgress, { phase: 'installing', percent: null });
			markUpdatePending();
			finish('ready');
			return true;
		};

		const attachInstallingWorker = (worker: ServiceWorker) => {
			if (stateChangeListener && attachedWorker) {
				attachedWorker.removeEventListener('statechange', stateChangeListener);
			}
			sawInstalling = true;
			attachedWorker = worker;
			reportProgress(onProgress, { phase: 'downloading', percent: null });

			stateChangeListener = () => {
				if (worker.state === 'installed') {
					if (tryFinishReady()) return;
					queueMicrotask(() => {
						tryFinishReady();
					});
				}
				if (worker.state === 'redundant') {
					finish('redundant');
				}
			};

			worker.addEventListener('statechange', stateChangeListener);
			stateChangeListener();
			if (!settled) armTimeout();
		};

		const onUpdateFound = () => {
			if (registration.installing) {
				attachInstallingWorker(registration.installing);
			}
		};

		registration.addEventListener('updatefound', onUpdateFound);

		if (registration.installing) {
			attachInstallingWorker(registration.installing);
		}

		if (settled) return;

		pollId = setInterval(() => {
			tryFinishReady();
		}, SW_WAIT_POLL_MS);

		armTimeout();
	});
}

function mapWaitingWorkerResultToError(result: WaitForWaitingWorkerResult): SwUpdateError {
	switch (result) {
		case 'update_failed':
		case 'redundant':
			return new SwUpdateError('download_failed');
		case 'timeout':
			return new SwUpdateError('download_timeout');
		default:
			return new SwUpdateError('download_failed');
	}
}

export async function probeSwUpdate(): Promise<boolean> {
	if (typeof window === 'undefined' || !('serviceWorker' in navigator)) return false;
	try {
		const { fetchLatestProjectRelease } =
			await import('$lib/content/releases/release-feed-adapter');
		const result = await fetchLatestProjectRelease();
		if (result.ok) {
			if (result.value.hostUpdate?.host.buildId !== HOST_BUILD.buildId) return markUpdatePending();
			needRefresh = Boolean((await navigator.serviceWorker.getRegistration())?.waiting);
		}
		return needRefresh;
	} catch {
		return needRefresh;
	}
}
export function readWorkerIdentity(
	worker: ServiceWorker
): Promise<import('@chronos/core').HostBuildIdentity> {
	return new Promise((resolve, reject) => {
		const channel = new MessageChannel();
		const timeout = setTimeout(() => {
			channel.port1.close();
			reject(new SwUpdateError('download_failed'));
		}, 3000);
		channel.port1.onmessage = (event) => {
			clearTimeout(timeout);
			channel.port1.close();
			resolve(event.data);
		};
		worker.postMessage({ type: 'CHRONOS_HOST_IDENTITY' }, [channel.port2]);
	});
}
let reloading = false;
async function checkControllerIdentity() {
	if (reloading || !navigator.serviceWorker.controller) return;
	try {
		const host = await readWorkerIdentity(navigator.serviceWorker.controller);
		if (host.buildId === HOST_BUILD.buildId) return;
		reloading = true;
		const { disposeAppEngine } = await import('$lib/services/app-engine');
		disposeAppEngine();
		window.location.reload();
	} catch (error) {
		console.error('[host-generation]', error);
	}
}

function reloadPage(): void {
	needRefresh = false;
	window.location.reload();
}

export async function waitForSwActivationAndReload(
	getRegistration: () => Promise<ServiceWorkerRegistration | undefined>,
	reload: () => void | Promise<void> = reloadPage,
	timeoutMs = CONTROLLER_CHANGE_TIMEOUT_MS,
	swUpdater: ((reloadPage?: boolean) => Promise<void>) | undefined = updateServiceWorker
): Promise<void> {
	const registration = await getRegistration();
	const waiting = registration?.waiting;

	if (!waiting) {
		try {
			await swUpdater?.(true);
		} catch {
			// ignore updater errors; reload below still applies cache-bust update
		}
		await reload();
		return;
	}

	await new Promise<void>((resolve, reject) => {
		let settled = false;
		let timeoutId: ReturnType<typeof setTimeout> | undefined;

		const onControllerChange = () => {
			if (settled) return;
			settled = true;
			if (timeoutId) clearTimeout(timeoutId);
			navigator.serviceWorker.removeEventListener('controllerchange', onControllerChange);
			resolve();
		};

		const onTimeout = () => {
			if (settled) return;
			settled = true;
			navigator.serviceWorker.removeEventListener('controllerchange', onControllerChange);
			reject(new SwUpdateError('activate_timeout'));
		};

		navigator.serviceWorker.addEventListener('controllerchange', onControllerChange);
		waiting.postMessage({ type: 'SKIP_WAITING' });
		timeoutId = setTimeout(onTimeout, timeoutMs);
	});

	await reload();
}

export async function applyUpdateAndReload(options?: ApplyUpdateOptions): Promise<void> {
	if (typeof window === 'undefined') return;

	const onProgress = options?.onProgress;

	if (!('serviceWorker' in navigator)) {
		throw new SwUpdateError('download_failed');
	}

	const registration = await navigator.serviceWorker.getRegistration();
	if (!registration) {
		throw new SwUpdateError('no_registration');
	}

	if (!registration.waiting) {
		const result = await waitForWaitingWorker(registration, { onProgress });
		if (result === 'idle' && !options?.targetBuildId) {
			reportProgress(onProgress, { phase: 'restarting', percent: null });
			reportProgress(onProgress, { phase: 'restarting', percent: null });
			reloadPage();
			return;
		}
		if (result !== 'ready') {
			throw mapWaitingWorkerResultToError(result);
		}
	} else {
		reportProgress(onProgress, { phase: 'installing', percent: null });
		markUpdatePending();
	}

	if (!registration.waiting) {
		throw new SwUpdateError('download_failed');
	}

	if (
		options?.targetBuildId &&
		(await readWorkerIdentity(registration.waiting)).buildId !== options.targetBuildId
	)
		throw new SwUpdateError('download_failed');
	reportProgress(onProgress, { phase: 'restarting', percent: null });

	await waitForSwActivationAndReload(
		() => Promise.resolve(registration),
		async () => {
			reportProgress(onProgress, { phase: 'restarting', percent: null });
			reloadPage();
		}
	);
}
