import { afterEach, beforeEach, describe, expect, it, vi } from 'vite-plus/test';
import type { PreparedPluginUpdate } from '$lib/services/official-plugins/installed-store';
import type { HostBuildIdentity } from '@chronos/core';

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
vi.mock('$lib/config/app-meta', () => ({
	HOST_BUILD: { buildId: 'a'.repeat(64), target: 'pages' }
}));
vi.mock('$lib/services/app-engine', () => ({
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
vi.mock('$lib/content/releases/release-feed-adapter', () => ({
	fetchLatestProjectRelease: mocks.feed
}));
vi.mock('./pwa-sw', () => ({
	applyUpdateAndReload: mocks.apply,
	readWorkerIdentity: mocks.identity
}));
vi.mock('$app/environment', () => ({ dev: false }));
import { applyPreparedWebUpdate, recoverInterruptedWebUpdate } from './web-host-update';

beforeEach(() => {
	mocks.prepared = undefined;
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
		'recovers prepared snapshot with %s worker',
		async (state) => {
			mocks.prepared = {
				target,
				token: 'existing',
				revision: 0,
				records: [],
				until: Date.now() + 180000
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
