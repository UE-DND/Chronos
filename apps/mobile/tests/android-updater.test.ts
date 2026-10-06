import { beforeEach, describe, expect, it, vi } from 'vite-plus/test';
import type { SelectedAndroidUpdate } from '@chronos/core';
import type { NativeUpdateState } from '../../web/src/lib/platform/host-platform';

const mocks = vi.hoisted(() => ({
	start: vi.fn(),
	state: vi.fn(),
	cancel: vi.fn(),
	continue: vi.fn(),
	prepare: vi.fn(),
	release: vi.fn(),
	prepared: undefined as { token: string; target: { buildId: string } } | undefined,
	host: { buildId: 'old' },
	listener: undefined as ((state: NativeUpdateState) => void) | undefined
}));
vi.mock('@capacitor/core', () => ({
	registerPlugin: () => ({
		startUpdate: mocks.start,
		getState: mocks.state,
		cancelUpdate: mocks.cancel,
		continueUpdate: mocks.continue,
		takeEvents: async () => ({ events: [] }),
		addListener: async (_: string, listener: typeof mocks.listener) => {
			mocks.listener = listener;
			return { remove: vi.fn() };
		}
	})
}));
vi.mock('../../web/src/lib/client/analytics', () => ({ trackEvent: vi.fn() }));
vi.mock('../../web/src/lib/config/app-meta', () => ({ HOST_BUILD: mocks.host }));
vi.mock('../../web/src/lib/boot/profile-registry', () => ({
	resolveActiveProfile: () => ({ preinstall: [{ id: 'required' }] })
}));
vi.mock('../../web/src/lib/services/app-engine', () => ({
	ensureEngineFullyReady: async () => {},
	getOfficialPluginService: () => ({
		installationStore: {
			load: async () => {},
			get prepared() {
				return mocks.prepared;
			}
		},
		prepareHostUpdate: mocks.prepare,
		cancelHostPreparation: mocks.release
	})
}));
const update = {
	host: { buildId: 'next', version: '1.2.3', target: 'mobile' },
	pluginCatalogUrl: 'https://example.test/catalog.json'
} as SelectedAndroidUpdate;
const active: NativeUpdateState = {
	phase: 'downloading',
	percent: 0,
	canCancel: true,
	update,
	preparationToken: 'token'
};

beforeEach(() => {
	vi.resetModules();
	vi.clearAllMocks();
	mocks.prepared = undefined;
	mocks.host.buildId = 'old';
	mocks.state.mockResolvedValue({ phase: 'idle', percent: null, canCancel: false });
	mocks.start.mockImplementation(async () => {
		mocks.state.mockResolvedValue(active);
		return active;
	});
	mocks.cancel.mockResolvedValue({ phase: 'canceled', percent: null, canCancel: false });
	mocks.prepare.mockImplementation(async () => {
		mocks.prepared = { token: 'token', target: update.host };
		return 'token';
	});
	mocks.release.mockImplementation(async () => {
		mocks.prepared = undefined;
	});
});
function deferred<T>() {
	let resolve!: (value: T) => void;
	const promise = new Promise<T>((done) => {
		resolve = done;
	});
	return { promise, resolve };
}
async function action() {
	return (await import('../src/android-updater')).createAndroidUpdateAction();
}

describe('Android plugin preparation', () => {
	it('prepares all optional plugins before starting the APK and merges repeated clicks', async () => {
		const gate = deferred<string>();
		mocks.prepare.mockReturnValueOnce(gate.promise);
		const a = await action();
		const first = a.applyUpdate({ androidUpdate: update } as never);
		await vi.waitFor(() => expect(mocks.prepare).toHaveBeenCalledOnce());
		const second = a.applyUpdate({ androidUpdate: update } as never);
		expect(mocks.start).not.toHaveBeenCalled();
		expect((await a.native!.getState()).phase).toBe('downloading');
		gate.resolve('token');
		await Promise.all([first, second]);
		expect(mocks.start).toHaveBeenCalledExactlyOnceWith({ update, preparationToken: 'token' });
		expect(mocks.prepare).toHaveBeenCalledWith(
			expect.objectContaining({ requiredPluginIds: ['required'] }),
			expect.any(Function),
			expect.objectContaining({ signal: expect.any(AbortSignal) })
		);
	});
	it('does not start the APK when plugins fail', async () => {
		mocks.prepare.mockRejectedValueOnce(new Error('integrity mismatch'));
		await expect(
			(await action()).applyUpdate({ androidUpdate: update } as never)
		).rejects.toMatchObject({ code: 'plugin_prepare_failed' });
		expect(mocks.start).not.toHaveBeenCalled();
	});
	it('cancels preparation without starting an APK, including a late preparation completion', async () => {
		const gate = deferred<string>();
		mocks.prepare.mockReturnValueOnce(gate.promise);
		const a = await action();
		const running = a.applyUpdate({ androidUpdate: update } as never);
		await vi.waitFor(() => expect(mocks.prepare).toHaveBeenCalledOnce());
		expect((await a.native!.cancelUpdate()).phase).toBe('canceled');
		gate.resolve('token');
		await running;
		expect(mocks.start).not.toHaveBeenCalled();
		expect(mocks.release).toHaveBeenCalledWith('token');
	});
	it.each(['downloading', 'awaiting-permission', 'awaiting-confirmation'] as const)(
		'preserves the matching snapshot during %s after restart',
		async (phase) => {
			mocks.prepared = { token: 'token', target: update.host };
			mocks.state.mockResolvedValue({ ...active, phase });
			await (await action()).native!.getState();
			expect(mocks.release).not.toHaveBeenCalled();
		}
	);
	it.each(['idle', 'failed', 'canceled'] as const)(
		'releases an abandoned snapshot in %s',
		async (phase) => {
			mocks.prepared = { token: 'token', target: update.host };
			mocks.state.mockResolvedValue({ ...active, phase });
			await (await action()).native!.getState();
			expect(mocks.release).toHaveBeenCalledWith('token');
		}
	);
	it('retries a failed pinned target through preparation instead of native continue', async () => {
		mocks.state.mockResolvedValue({ ...active, phase: 'failed' });
		await (await action()).native!.continueUpdate();
		expect(mocks.prepare).toHaveBeenCalledOnce();
		expect(mocks.continue).not.toHaveBeenCalled();
		expect(mocks.start).toHaveBeenCalledWith({ update, preparationToken: 'token' });
	});
	it('reports preparation progress through the public update action and page subscription', async () => {
		const a = await action();
		const state = vi.fn();
		const progress = vi.fn();
		const dispose = await a.native!.subscribe(state);
		mocks.prepare.mockImplementationOnce(async (_update, onProgress) => {
			onProgress(37);
			return 'token';
		});
		await a.applyUpdate({ androidUpdate: update } as never, { onProgress: progress });
		expect(state).toHaveBeenCalledWith(
			expect.objectContaining({ phase: 'downloading', percent: 37, canCancel: true })
		);
		expect(progress).toHaveBeenCalledWith({ phase: 'downloading', percent: 37 });
		dispose();
	});
	it('keeps an already authorized native target even if the feed changes', async () => {
		mocks.state.mockResolvedValue(active);
		await (
			await action()
		).applyUpdate({
			androidUpdate: { ...update, host: { ...update.host, buildId: 'later' } }
		} as never);
		expect(mocks.prepare).not.toHaveBeenCalled();
		expect(mocks.start).not.toHaveBeenCalled();
	});
	it('preserves a task that started despite a lost bridge response', async () => {
		mocks.start.mockImplementationOnce(async () => {
			mocks.state.mockResolvedValue(active);
			throw new Error('bridge lost');
		});
		await expect((await action()).applyUpdate({ androidUpdate: update } as never)).rejects.toThrow(
			'bridge lost'
		);
		expect(mocks.release).not.toHaveBeenCalled();
		expect(mocks.prepared?.token).toBe('token');
	});
	it('keeps unknown native ownership until it can be observed', async () => {
		mocks.prepared = { token: 'token', target: update.host };
		mocks.state.mockRejectedValueOnce(new Error('state unavailable'));
		await expect((await action()).native!.getState()).rejects.toThrow('state unavailable');
		expect(mocks.release).not.toHaveBeenCalled();
	});
	it('preserves the target snapshot for adoption when the new host sees native success', async () => {
		mocks.host.buildId = 'next';
		mocks.prepared = { token: 'token', target: update.host };
		mocks.state.mockResolvedValue({ ...active, phase: 'succeeded' });
		await (await action()).native!.getState();
		expect(mocks.release).not.toHaveBeenCalled();
	});
	it('re-reads native ownership instead of trusting a delayed terminal notification', async () => {
		mocks.prepared = { token: 'token', target: update.host };
		mocks.state.mockResolvedValue(active);
		const state = vi.fn();
		const dispose = await (await action()).native!.subscribe(state);
		mocks.listener!({ ...active, phase: 'canceled' });
		await vi.waitFor(() => expect(state).toHaveBeenCalledWith(active));
		expect(mocks.release).not.toHaveBeenCalled();
		dispose();
	});
	it('releases a preparation that does not belong to the active native task', async () => {
		mocks.prepared = { token: 'orphan', target: update.host };
		mocks.state.mockResolvedValue(active);
		await (await action()).native!.getState();
		expect(mocks.release).toHaveBeenCalledWith('orphan');
	});
});
