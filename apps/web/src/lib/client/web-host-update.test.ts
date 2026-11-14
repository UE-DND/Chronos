import { afterEach, beforeEach, describe, expect, it, vi } from 'vite-plus/test';
import {
	emptyInstallationState,
	OfficialPluginInstalledStore,
	type PreparedPluginUpdate
} from '#lib/services/official-plugins/installed-store.ts';
import type { ChronosEngine, HostBuildIdentity } from '@chronos/core';

const mocks = vi.hoisted(() => ({
	prepare: vi.fn().mockResolvedValue('prepared-token'),
	cancel: vi.fn(),
	apply: vi.fn(),
	identity: vi.fn(),
	registration: vi.fn(),
	feed: vi.fn(),
	prepared: undefined as PreparedPluginUpdate | undefined
}));
const current: HostBuildIdentity = {
	version: '1.0.2',
	buildId: 'a'.repeat(64),
	sourceCommit: 'b'.repeat(40),
	profileId: 'chronos-default',
	deploymentId: 'pages',
	target: 'pages'
};
const target = { ...current, buildId: 'c'.repeat(64) };
vi.mock('#lib/config/app-meta.ts', () => ({
	HOST_BUILD: { buildId: 'a'.repeat(64), target: 'pages' }
}));
vi.mock('#lib/services/app-engine.ts', () => ({
	ensureEngineFullyReady: vi.fn(),
	getOfficialPluginService: () => ({
		installationStore: {
			load: vi.fn(),
			get prepared() {
				return mocks.prepared;
			}
		},
		prepareHostUpdate: mocks.prepare,
		cancelHostPreparation: mocks.cancel
	})
}));
vi.mock('#lib/content/releases/release-feed-adapter.ts', () => ({
	fetchLatestProjectRelease: mocks.feed
}));
vi.mock('./pwa-sw', () => ({
	applyUpdateAndReload: mocks.apply,
	readWorkerIdentity: mocks.identity
}));
vi.mock('$app/env', () => ({ dev: false }));
import { applyPreparedWebUpdate, recoverInterruptedWebUpdate } from './web-host-update';

beforeEach(() => {
	mocks.prepared = undefined;
	mocks.cancel.mockImplementation(async (token: string) => {
		if (mocks.prepared?.token === token) mocks.prepared = undefined;
	});
	mocks.prepare.mockImplementation(async () => {
		mocks.prepared = {
			target,
			token: 'prepared-token',
			records: [],
			revision: 0,
			until: Date.now() + 180000
		};
		return 'prepared-token';
	});
});
afterEach(() => {
	vi.clearAllMocks();
	vi.restoreAllMocks();
	vi.unstubAllGlobals();
});
describe('prepared Web update recovery', () => {
	it.each(['old-active', 'target-active', 'target-waiting'])(
		'cancels only a discarded snapshot when activation races another window (%s)',
		async (state) => {
			vi.stubGlobal('navigator', { serviceWorker: { getRegistration: mocks.registration } });
			mocks.registration.mockResolvedValue({
				active: {},
				waiting: state === 'target-waiting' ? {} : undefined
			});
			mocks.identity.mockResolvedValue(state === 'target-active' ? target : current);
			mocks.feed.mockResolvedValue({ ok: true, value: { hostUpdate: { host: target } } });
			mocks.apply.mockRejectedValue(new Error('activation race'));
			await expect(applyPreparedWebUpdate()).rejects.toThrow('activation race');
			if (state === 'old-active') expect(mocks.cancel).toHaveBeenCalledWith('prepared-token');
			else expect(mocks.cancel).not.toHaveBeenCalled();
		}
	);
	it.each(['waiting', 'installing', 'active', 'absent', 'unknown'] as const)(
		'recovers expired prepared snapshot with %s worker',
		async (state) => {
			mocks.prepared = {
				target,
				token: 'existing',
				revision: 0,
				records: [],
				until: Date.now() - 1
			};
			vi.stubGlobal('navigator', { serviceWorker: { getRegistration: mocks.registration } });
			const reload = vi.fn();
			vi.stubGlobal('window', { location: { reload } });
			mocks.registration.mockResolvedValue({
				waiting: state === 'waiting' ? {} : undefined,
				installing: state === 'installing' ? {} : undefined,
				active: state === 'active' || state === 'unknown' ? {} : undefined
			});
			mocks.identity.mockImplementation(async () => {
				if (state === 'unknown') throw new Error('identity unavailable');
				return target;
			});
			if (state === 'unknown')
				await expect(recoverInterruptedWebUpdate()).rejects.toThrow('identity unavailable');
			else await recoverInterruptedWebUpdate();
			expect(mocks.cancel).toHaveBeenCalledTimes(state === 'absent' ? 1 : 0);
			expect(reload).toHaveBeenCalledTimes(state === 'active' ? 1 : 0);
		}
	);
	it('preserves another window preparation before its worker starts installing', async () => {
		vi.stubGlobal('navigator', { serviceWorker: { getRegistration: mocks.registration } });
		mocks.registration.mockResolvedValue({ active: {} });
		mocks.identity.mockResolvedValue(current);
		mocks.feed.mockResolvedValue({ ok: true, value: { hostUpdate: { host: target } } });
		const installGate = Promise.withResolvers<void>();
		mocks.apply.mockReturnValue(installGate.promise);
		// Each browser window has its own applying/recovering promises, but shares IndexedDB.
		vi.resetModules();
		const otherWindow = await import('./web-host-update');
		const applying = applyPreparedWebUpdate();
		try {
			await vi.waitFor(() => expect(mocks.apply).toHaveBeenCalledOnce());
			await otherWindow.recoverInterruptedWebUpdate();
			expect(mocks.cancel).not.toHaveBeenCalled();
			expect(mocks.prepared?.token).toBe('prepared-token');
		} finally {
			installGate.resolve();
			await applying;
		}
	});
	it('releases a preparation abandoned before worker installation after its lease expires', async () => {
		const now = vi.spyOn(Date, 'now').mockReturnValue(100);
		mocks.prepared = {
			target,
			token: 'abandoned',
			revision: 0,
			records: [],
			until: 101
		};
		vi.stubGlobal('navigator', { serviceWorker: { getRegistration: mocks.registration } });
		mocks.registration.mockResolvedValue({ active: {} });
		mocks.identity.mockResolvedValue(current);
		await recoverInterruptedWebUpdate();
		expect(mocks.cancel).not.toHaveBeenCalled();
		now.mockReturnValue(101);
		await recoverInterruptedWebUpdate();
		expect(mocks.cancel).toHaveBeenCalledWith('abandoned');
		expect(mocks.prepared).toBeUndefined();
	});
	it('does not replace another window live preparation when an update is requested', async () => {
		let state = {
			...emptyInstallationState(),
			prepared: {
				target,
				token: 'other-window',
				revision: 0,
				records: [],
				until: Date.now() + 180000
			} as PreparedPluginUpdate | undefined
		};
		const store = new OfficialPluginInstalledStore({} as ChronosEngine, {
			read: async () => structuredClone(state),
			transaction: async (change) => {
				const next = structuredClone(state);
				change(next);
				state = next;
				mocks.prepared = state.prepared;
				return next;
			}
		});
		mocks.prepared = state.prepared;
		mocks.cancel.mockImplementation((token: string) => store.cancelPreparation(token));
		mocks.prepare.mockImplementation(async () => {
			await store.prepare({
				target,
				token: 'replacement',
				revision: 0,
				records: [],
				until: Date.now() + 180000
			});
			return 'replacement';
		});
		vi.stubGlobal('navigator', { serviceWorker: { getRegistration: mocks.registration } });
		mocks.registration.mockResolvedValue({ active: {} });
		mocks.identity.mockResolvedValue(current);
		mocks.feed.mockResolvedValue({ ok: true, value: { hostUpdate: { host: target } } });
		try {
			await expect(applyPreparedWebUpdate()).rejects.toThrow(
				'Update is already running in another window'
			);
			expect(mocks.cancel).not.toHaveBeenCalled();
			await store.load();
			expect(store.prepared?.token).toBe('other-window');
			expect(mocks.apply).not.toHaveBeenCalled();
		} finally {
			store.dispose();
		}
	});
	it('releases a worker-extended authorization when the worker was discarded', async () => {
		mocks.prepared = {
			target,
			token: 'discarded-worker',
			revision: 0,
			records: [],
			until: Number.MAX_SAFE_INTEGER
		};
		vi.stubGlobal('navigator', { serviceWorker: { getRegistration: mocks.registration } });
		mocks.registration.mockResolvedValue({ active: {} });
		mocks.identity.mockResolvedValue(current);
		await recoverInterruptedWebUpdate();
		expect(mocks.cancel).toHaveBeenCalledWith('discarded-worker');
		expect(mocks.prepared).toBeUndefined();
	});
	it('reuses an existing preparation without fetching or downloading plugins', async () => {
		mocks.prepared = {
			target,
			token: 'existing',
			revision: 0,
			records: [],
			until: Date.now() + 180000
		};
		vi.stubGlobal('navigator', { serviceWorker: { getRegistration: mocks.registration } });
		mocks.registration.mockResolvedValue({ waiting: {} });
		mocks.apply.mockResolvedValue(undefined);
		await applyPreparedWebUpdate();
		expect(mocks.prepare).not.toHaveBeenCalled();
		expect(mocks.feed).not.toHaveBeenCalled();
		expect(mocks.apply).toHaveBeenCalledWith(
			expect.objectContaining({ targetBuildId: target.buildId })
		);
	});
	it('merges applications and postpones recovery while preparation is pending', async () => {
		const gate = Promise.withResolvers<string>();
		mocks.prepare.mockReturnValueOnce(gate.promise);
		vi.stubGlobal('navigator', { serviceWorker: { getRegistration: mocks.registration } });
		mocks.registration.mockResolvedValue({});
		mocks.apply.mockResolvedValue(undefined);
		mocks.feed.mockResolvedValue({ ok: true, value: { hostUpdate: { host: target } } });
		const first = applyPreparedWebUpdate();
		await vi.waitFor(() => expect(mocks.prepare).toHaveBeenCalledOnce());
		const second = applyPreparedWebUpdate();
		const recovery = recoverInterruptedWebUpdate();
		expect(mocks.cancel).not.toHaveBeenCalled();
		gate.resolve('prepared-token');
		await Promise.all([first, second, recovery]);
		expect(mocks.prepare).toHaveBeenCalledOnce();
		expect(mocks.apply).toHaveBeenCalledOnce();
	});
});
