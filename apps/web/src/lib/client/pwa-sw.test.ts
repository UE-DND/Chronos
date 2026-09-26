import { afterEach, beforeEach, describe, expect, it, vi } from 'vite-plus/test';

let probeSwUpdate: (typeof import('./pwa-sw'))['probeSwUpdate'];
let applyUpdateAndReload: (typeof import('./pwa-sw'))['applyUpdateAndReload'];
let waitForSwActivationAndReload: (typeof import('./pwa-sw'))['waitForSwActivationAndReload'];
let waitForWaitingWorker: (typeof import('./pwa-sw'))['waitForWaitingWorker'];

beforeEach(async () => {
	vi.resetModules();
	const mod = await import('./pwa-sw');
	probeSwUpdate = mod.probeSwUpdate;
	applyUpdateAndReload = mod.applyUpdateAndReload;
	waitForSwActivationAndReload = mod.waitForSwActivationAndReload;
	waitForWaitingWorker = mod.waitForWaitingWorker;
});

function createRegistrationStub(overrides: Record<string, unknown> = {}) {
	const listeners = new Map<string, Set<() => void>>();
	return {
		waiting: undefined,
		installing: undefined,
		update: vi.fn().mockResolvedValue(undefined),
		addEventListener: vi.fn((event: string, listener: () => void) => {
			if (!listeners.has(event)) listeners.set(event, new Set());
			listeners.get(event)!.add(listener);
		}),
		removeEventListener: vi.fn((event: string, listener: () => void) => {
			listeners.get(event)?.delete(listener);
		}),
		emit(event: string) {
			for (const listener of listeners.get(event) ?? []) {
				listener();
			}
		},
		...overrides
	};
}

describe('probeSwUpdate', () => {
	afterEach(() => {
		vi.unstubAllGlobals();
		vi.useRealTimers();
	});
	it('detects a remote build without installing a worker before authorization', async () => {
		const { HOST_BUILD } = await import('$lib/config/app-meta');
		const registration = createRegistrationStub();
		vi.stubGlobal('window', {});
		vi.stubGlobal('navigator', {
			serviceWorker: { getRegistration: vi.fn().mockResolvedValue(registration) }
		});
		vi.stubGlobal(
			'fetch',
			vi.fn(async () =>
				Response.json({
					formatVersion: 1,
					host: { ...HOST_BUILD, buildId: 'f'.repeat(64) },
					release: { tagName: `v${HOST_BUILD.version}`, name: '', body: '', publishedAt: '' },
					requiredPluginIds: [],
					pluginCatalogUrl: `https://ue-dnd.github.io/Chronos/plugins/releases/${HOST_BUILD.version}/catalog.json`
				})
			)
		);
		await expect(probeSwUpdate()).resolves.toBe(true);
		expect(registration.update).not.toHaveBeenCalled();
	});
	it('keeps the application running when the deployment feed is unavailable', async () => {
		vi.stubGlobal('window', {});
		vi.stubGlobal('navigator', { serviceWorker: {} });
		vi.stubGlobal('fetch', vi.fn().mockRejectedValue(new Error('offline')));
		await expect(probeSwUpdate()).resolves.toBe(false);
	});
});

describe('waitForWaitingWorker', () => {
	afterEach(() => {
		vi.unstubAllGlobals();
		vi.useRealTimers();
	});

	it('returns immediately when a waiting worker already exists', async () => {
		const onProgress = vi.fn();
		const registration = createRegistrationStub({ waiting: {} });

		await expect(waitForWaitingWorker(registration as never, { onProgress })).resolves.toBe(
			'ready'
		);

		expect(onProgress).toHaveBeenCalledWith({ phase: 'installing', percent: null });
		expect(registration.update).not.toHaveBeenCalled();
	});

	it('waits for installing worker to reach waiting', async () => {
		vi.useFakeTimers();
		const onProgress = vi.fn();
		let stateChangeListener: (() => void) | undefined;
		const worker = {
			state: 'installing',
			addEventListener: vi.fn((event: string, listener: () => void) => {
				if (event === 'statechange') stateChangeListener = listener;
			}),
			removeEventListener: vi.fn()
		};
		const registration = createRegistrationStub({ installing: worker });

		const pending = waitForWaitingWorker(registration as never, {
			onProgress,
			timeoutMs: 1000
		});
		await Promise.resolve();

		expect(onProgress).toHaveBeenCalledWith({ phase: 'downloading', percent: null });

		Object.defineProperty(registration, 'waiting', { value: {}, configurable: true });
		worker.state = 'installed';
		stateChangeListener?.();

		await expect(pending).resolves.toBe('ready');
		expect(onProgress).toHaveBeenCalledWith({ phase: 'installing', percent: null });
	});

	it('returns update_failed when registration.update throws', async () => {
		const registration = createRegistrationStub({
			update: vi.fn().mockRejectedValue(new Error('offline'))
		});

		await expect(waitForWaitingWorker(registration as never)).resolves.toBe('update_failed');
	});

	it('returns idle when update finds no new worker', async () => {
		vi.useFakeTimers();
		const registration = createRegistrationStub();

		const pending = waitForWaitingWorker(registration as never, { timeoutMs: 1000 });
		await vi.advanceTimersByTimeAsync(1000);

		await expect(pending).resolves.toBe('idle');
	});

	it('returns timeout when installing worker never becomes waiting', async () => {
		vi.useFakeTimers();
		const worker = {
			state: 'installing',
			addEventListener: vi.fn(),
			removeEventListener: vi.fn()
		};
		const registration = createRegistrationStub({ installing: worker });

		const pending = waitForWaitingWorker(registration as never, { timeoutMs: 1000 });
		await vi.advanceTimersByTimeAsync(1000);

		await expect(pending).resolves.toBe('timeout');
	});

	it('reaches ready when waiting is assigned after installed without another statechange', async () => {
		vi.useFakeTimers();
		const onProgress = vi.fn();
		let stateChangeListener: (() => void) | undefined;
		const worker = {
			state: 'installing',
			addEventListener: vi.fn((event: string, listener: () => void) => {
				if (event === 'statechange') stateChangeListener = listener;
			}),
			removeEventListener: vi.fn()
		};
		const registration = createRegistrationStub({ installing: worker });

		const pending = waitForWaitingWorker(registration as never, {
			onProgress,
			timeoutMs: 10_000
		});
		await Promise.resolve();

		expect(onProgress).toHaveBeenCalledWith({ phase: 'downloading', percent: null });

		worker.state = 'installed';
		Object.defineProperty(registration, 'installing', { value: undefined, configurable: true });
		stateChangeListener?.();

		Object.defineProperty(registration, 'waiting', { value: worker, configurable: true });
		await vi.advanceTimersByTimeAsync(2000);

		expect(onProgress).toHaveBeenCalledWith({ phase: 'installing', percent: null });
		await expect(pending).resolves.toBe('ready');
	});

	it('reaches ready when attach finds an already-installed worker before waiting is set', async () => {
		vi.useFakeTimers();
		const onProgress = vi.fn();
		let stateChangeListener: (() => void) | undefined;
		const worker = {
			state: 'installed',
			addEventListener: vi.fn((event: string, listener: () => void) => {
				if (event === 'statechange') stateChangeListener = listener;
			}),
			removeEventListener: vi.fn()
		};
		const registration = createRegistrationStub({ installing: worker });

		const pending = waitForWaitingWorker(registration as never, {
			onProgress,
			timeoutMs: 10_000
		});
		await Promise.resolve();

		expect(onProgress).toHaveBeenCalledWith({ phase: 'downloading', percent: null });
		expect(stateChangeListener).toBeDefined();

		Object.defineProperty(registration, 'waiting', { value: worker, configurable: true });
		await vi.advanceTimersByTimeAsync(2000);

		expect(onProgress).toHaveBeenCalledWith({ phase: 'installing', percent: null });
		await expect(pending).resolves.toBe('ready');
	});

	it('returns redundant when installing worker becomes redundant', async () => {
		vi.useFakeTimers();
		let stateChangeListener: (() => void) | undefined;
		const worker = {
			state: 'installing',
			addEventListener: vi.fn((event: string, listener: () => void) => {
				if (event === 'statechange') stateChangeListener = listener;
			}),
			removeEventListener: vi.fn()
		};
		const registration = createRegistrationStub({ installing: worker });

		const pending = waitForWaitingWorker(registration as never, { timeoutMs: 1000 });
		worker.state = 'redundant';
		stateChangeListener?.();

		await expect(pending).resolves.toBe('redundant');
	});
});

describe('waitForSwActivationAndReload', () => {
	const reload = vi.fn();

	beforeEach(() => {
		reload.mockReset();
	});

	afterEach(() => {
		vi.unstubAllGlobals();
	});

	it('reloads immediately when no service worker is waiting', async () => {
		await waitForSwActivationAndReload(async () => ({ waiting: undefined }) as never, reload);

		expect(reload).toHaveBeenCalledOnce();
	});

	it('calls updateServiceWorker and still reloads when no worker is waiting', async () => {
		const swUpdater = vi.fn().mockResolvedValue(undefined);

		await waitForSwActivationAndReload(
			async () => ({ waiting: undefined }) as never,
			reload,
			3000,
			swUpdater
		);

		expect(swUpdater).toHaveBeenCalledWith(true);
		expect(reload).toHaveBeenCalledOnce();
	});

	it('reloads after controllerchange when a waiting worker exists', async () => {
		vi.useFakeTimers();
		const postMessage = vi.fn();
		const swUpdater = vi.fn();
		let controllerListener: (() => void) | undefined;

		vi.stubGlobal('navigator', {
			serviceWorker: {
				addEventListener: vi.fn((event, listener) => {
					if (event === 'controllerchange') controllerListener = listener;
				}),
				removeEventListener: vi.fn()
			}
		});

		const pending = waitForSwActivationAndReload(
			async () => ({ waiting: { postMessage } }) as never,
			reload,
			3000,
			swUpdater
		);
		await Promise.resolve();

		expect(postMessage).toHaveBeenCalledWith({ type: 'SKIP_WAITING' });
		expect(swUpdater).not.toHaveBeenCalled();
		expect(reload).not.toHaveBeenCalled();

		controllerListener?.();
		await pending;

		expect(reload).toHaveBeenCalledOnce();
		vi.useRealTimers();
	});

	it('does not reload when controllerchange never fires', async () => {
		vi.useFakeTimers();
		const postMessage = vi.fn();
		const swUpdater = vi.fn();

		vi.stubGlobal('navigator', {
			serviceWorker: {
				addEventListener: vi.fn(),
				removeEventListener: vi.fn()
			}
		});

		const pending = waitForSwActivationAndReload(
			async () => ({ waiting: { postMessage } }) as never,
			reload,
			3000,
			swUpdater
		);
		const assertion = expect(pending).rejects.toMatchObject({ code: 'activate_timeout' });

		await vi.advanceTimersByTimeAsync(3000);
		await assertion;
		expect(reload).not.toHaveBeenCalled();
		expect(swUpdater).not.toHaveBeenCalled();
		vi.useRealTimers();
	});
});

describe('applyUpdateAndReload', () => {
	afterEach(() => {
		vi.unstubAllGlobals();
		vi.useRealTimers();
	});

	it('throws download_failed when registration.update fails during install', async () => {
		const registration = createRegistrationStub({
			update: vi.fn().mockRejectedValue(new Error('offline'))
		});
		vi.stubGlobal('window', {});
		vi.stubGlobal('navigator', {
			serviceWorker: {
				getRegistration: vi.fn().mockResolvedValue(registration)
			}
		});

		await expect(applyUpdateAndReload()).rejects.toMatchObject({ code: 'download_failed' });
	});

	it('reloads without deleting caches owned by other applications when no worker update is found', async () => {
		vi.useFakeTimers();
		const reload = vi.fn();
		const cachesDelete = vi.fn().mockResolvedValue(true);
		const cachesStub = { delete: cachesDelete };
		const registration = createRegistrationStub();

		vi.stubGlobal('window', { location: { reload }, caches: cachesStub });
		vi.stubGlobal('caches', cachesStub);
		vi.stubGlobal('navigator', {
			serviceWorker: {
				getRegistration: vi.fn().mockResolvedValue(registration)
			}
		});

		const pending = applyUpdateAndReload();
		await vi.advanceTimersByTimeAsync(2_000);
		await pending;

		expect(cachesDelete).not.toHaveBeenCalled();
		expect(reload).toHaveBeenCalledOnce();
	});

	it('reports activation progress and preserves unrelated caches', async () => {
		const reload = vi.fn();
		const cachesDelete = vi.fn().mockResolvedValue(true);
		const postMessage = vi.fn();
		let controllerListener: (() => void) | undefined;
		const onProgress = vi.fn();
		const cachesStub = { delete: cachesDelete };
		const registration = createRegistrationStub({ waiting: { postMessage } });

		vi.stubGlobal('window', { location: { reload }, caches: cachesStub });
		vi.stubGlobal('caches', cachesStub);
		vi.stubGlobal('navigator', {
			serviceWorker: {
				getRegistration: vi.fn().mockResolvedValue(registration),
				addEventListener: vi.fn((event, listener) => {
					if (event === 'controllerchange') controllerListener = listener;
				}),
				removeEventListener: vi.fn()
			}
		});

		const pending = applyUpdateAndReload({ onProgress });
		await vi.waitFor(() => expect(postMessage).toHaveBeenCalled());

		expect(onProgress).toHaveBeenCalledWith({ phase: 'installing', percent: null });
		expect(cachesDelete).not.toHaveBeenCalled();
		expect(postMessage).toHaveBeenCalledWith({ type: 'SKIP_WAITING' });

		controllerListener?.();
		await pending;

		expect(onProgress).toHaveBeenCalledWith({ phase: 'restarting', percent: null });
		expect(cachesDelete).not.toHaveBeenCalled();
		expect(reload).toHaveBeenCalledOnce();
	});

	it('does not drop pages-cache or reload when skip waiting never activates', async () => {
		vi.useFakeTimers();
		const reload = vi.fn();
		const cachesDelete = vi.fn().mockResolvedValue(true);
		const postMessage = vi.fn();
		const cachesStub = { delete: cachesDelete };
		const registration = createRegistrationStub({ waiting: { postMessage } });

		vi.stubGlobal('window', { location: { reload }, caches: cachesStub });
		vi.stubGlobal('caches', cachesStub);
		vi.stubGlobal('navigator', {
			serviceWorker: {
				getRegistration: vi.fn().mockResolvedValue(registration),
				addEventListener: vi.fn(),
				removeEventListener: vi.fn()
			}
		});

		const pending = applyUpdateAndReload();
		const assertion = expect(pending).rejects.toMatchObject({ code: 'activate_timeout' });
		await vi.advanceTimersByTimeAsync(3000);

		await assertion;
		expect(cachesDelete).not.toHaveBeenCalled();
		expect(reload).not.toHaveBeenCalled();
	});

	it('waits for download before activating when waiting worker is not ready yet', async () => {
		vi.useFakeTimers();
		const reload = vi.fn();
		const cachesDelete = vi.fn().mockResolvedValue(true);
		const postMessage = vi.fn();
		let controllerListener: (() => void) | undefined;
		let stateChangeListener: (() => void) | undefined;
		const onProgress = vi.fn();
		const cachesStub = { delete: cachesDelete };
		const worker = {
			state: 'installing',
			addEventListener: vi.fn((event: string, listener: () => void) => {
				if (event === 'statechange') stateChangeListener = listener;
			}),
			removeEventListener: vi.fn()
		};
		const registration = createRegistrationStub({ installing: worker });

		vi.stubGlobal('window', { location: { reload }, caches: cachesStub });
		vi.stubGlobal('caches', cachesStub);
		vi.stubGlobal('navigator', {
			serviceWorker: {
				getRegistration: vi.fn().mockResolvedValue(registration),
				addEventListener: vi.fn((event, listener) => {
					if (event === 'controllerchange') controllerListener = listener;
				}),
				removeEventListener: vi.fn()
			}
		});

		const pending = applyUpdateAndReload({ onProgress });
		await vi.waitFor(() => expect(stateChangeListener).toBeDefined());

		Object.defineProperty(registration, 'waiting', { value: { postMessage }, configurable: true });
		worker.state = 'installed';
		stateChangeListener?.();
		await vi.waitFor(() => expect(postMessage).toHaveBeenCalled());
		expect(cachesDelete).not.toHaveBeenCalled();

		controllerListener?.();
		await pending;

		expect(onProgress).toHaveBeenCalledWith({ phase: 'downloading', percent: null });
		expect(onProgress).toHaveBeenCalledWith({ phase: 'installing', percent: null });
		expect(cachesDelete).not.toHaveBeenCalled();
		expect(reload).toHaveBeenCalledOnce();
		vi.useRealTimers();
	});
});
