import { afterEach, describe, expect, it, vi } from 'vite-plus/test';
import type { HostBuildIdentity } from '@chronos/core';

const mocks = vi.hoisted(() => ({
	prepare: vi.fn().mockResolvedValue('prepared-token'),
	cancel: vi.fn(),
	apply: vi.fn(),
	identity: vi.fn(),
	registration: vi.fn(),
	feed: vi.fn()
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
		installationStore: { load: vi.fn(), prepared: undefined },
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
import { applyPreparedWebUpdate } from './web-host-update';

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
});
