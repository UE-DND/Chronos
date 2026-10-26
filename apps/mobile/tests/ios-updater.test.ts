import { beforeEach, describe, expect, it, vi } from 'vite-plus/test';
import type { SelectedIosUpdate } from '@chronos/core';

const mocks = vi.hoisted(() => ({
	download: vi.fn(),
	cancelPlugin: vi.fn(),
	share: vi.fn(),
	prepare: vi.fn(),
	cancel: vi.fn(),
	prepared: undefined as { token: string; target: { buildId: string } } | undefined,
	host: { buildId: 'old' }
}));

vi.mock('@capacitor/core', () => ({
	registerPlugin: () => ({
		download: mocks.download,
		cancel: mocks.cancelPlugin,
		addListener: async () => ({ remove: vi.fn() })
	})
}));
vi.mock('@capacitor/share', () => ({ Share: { share: mocks.share } }));
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
		cancelHostPreparation: mocks.cancel
	})
}));

const update = {
	host: {
		version: '1.2.3',
		buildId: 'next',
		sourceCommit: 'b'.repeat(40),
		profileId: 'chronos-default',
		deploymentId: 'mobile',
		target: 'mobile'
	},
	release: { tagName: 'v1.2.3', name: 'Chronos 1.2.3', publishedAt: '2026-10-24', body: '' },
	bundleId: 'org.uednd.chronos',
	ipaUrl: 'https://github.com/UE-DND/Chronos/releases/download/v1.2.3/Chronos-default-1.2.3.ipa',
	sha256: 'd'.repeat(64),
	sizeBytes: 100,
	pluginCatalogUrl: 'https://ue-dnd.github.io/Chronos/plugins/releases/1.2.3/catalog.json',
	minimumOsVersion: '17.4'
} as SelectedIosUpdate;

async function action() {
	return (await import('../src/ios-updater')).createIosUpdateAction();
}

describe('iOS package update', () => {
	beforeEach(() => {
		vi.resetModules();
		vi.clearAllMocks();
		mocks.prepared = undefined;
		mocks.host.buildId = 'old';
		mocks.prepare.mockResolvedValue('token');
		mocks.cancel.mockResolvedValue(undefined);
		mocks.cancelPlugin.mockResolvedValue(undefined);
		mocks.download.mockResolvedValue({ uri: 'file:///cache/Chronos.ipa', sha256: update.sha256 });
		mocks.share.mockResolvedValue(undefined);
	});

	it('prepares plugins, verifies the download, and shares the IPA', async () => {
		const progress = vi.fn();
		await (await action()).applyUpdate({ iosUpdate: update } as never, { onProgress: progress });
		expect(mocks.prepare).toHaveBeenCalledOnce();
		expect(mocks.download).toHaveBeenCalledWith({ url: update.ipaUrl, sha256: update.sha256 });
		expect(mocks.share).toHaveBeenCalledWith(
			expect.objectContaining({ url: 'file:///cache/Chronos.ipa' })
		);
		expect(mocks.cancel).not.toHaveBeenCalled();
	});

	it('shares a verified package again without downloading or discarding the snapshot', async () => {
		const first = await action();
		await first.applyUpdate({ iosUpdate: update } as never);
		mocks.share.mockRejectedValueOnce(new Error('Share canceled'));
		await expect(first.applyUpdate({ iosUpdate: update } as never)).rejects.toMatchObject({
			code: 'share_canceled'
		});
		expect(mocks.download).toHaveBeenCalledOnce();
		expect(mocks.cancel).not.toHaveBeenCalled();
	});

	it('drops an abandoned snapshot for another build on the next launch', async () => {
		mocks.prepared = { token: 'stale', target: { buildId: 'next' } };
		await (await action()).native?.getState();
		expect(mocks.cancel).toHaveBeenCalledWith('stale');
	});

	it('reports plugin preparation failures separately from download failures', async () => {
		mocks.prepare.mockRejectedValueOnce(new Error('offline'));
		await expect(
			(await action()).applyUpdate({ iosUpdate: update } as never)
		).rejects.toMatchObject({ code: 'plugin_prepare_failed' });
		expect(mocks.download).not.toHaveBeenCalled();
	});

	it('cancels while plugins are still being prepared', async () => {
		let signal: AbortSignal | undefined;
		mocks.prepare.mockImplementationOnce(
			(_update: unknown, _progress: unknown, options: { signal?: AbortSignal }) =>
				new Promise((_, reject) => {
					signal = options.signal;
					options.signal?.addEventListener('abort', () => {
						reject(Object.assign(new Error('The operation was aborted'), { name: 'AbortError' }));
					});
				})
		);
		const updating = await action();
		const applying = updating.applyUpdate({ iosUpdate: update } as never);
		const canceled = expect(applying).rejects.toMatchObject({ code: 'download_canceled' });
		await vi.waitFor(() => expect(mocks.prepare).toHaveBeenCalledOnce());

		expect(await updating.native?.getState()).toMatchObject({
			phase: 'downloading',
			canCancel: true
		});
		await updating.native?.cancelUpdate();

		await canceled;
		expect(signal?.aborted).toBe(true);
		expect(mocks.download).not.toHaveBeenCalled();
		expect(mocks.share).not.toHaveBeenCalled();
	});

	it('cancels the prepared snapshot when preparation resolves after cancellation', async () => {
		let resolvePrepare: ((token: string) => void) | undefined;
		mocks.prepare.mockImplementationOnce(
			() =>
				new Promise<string>((resolve) => {
					resolvePrepare = resolve;
				})
		);
		const updating = await action();
		const applying = updating.applyUpdate({ iosUpdate: update } as never);
		const canceled = expect(applying).rejects.toMatchObject({ code: 'download_canceled' });
		await vi.waitFor(() => expect(mocks.prepare).toHaveBeenCalledOnce());

		await updating.native?.cancelUpdate();
		resolvePrepare?.('late-token');

		await canceled;
		expect(mocks.cancel).toHaveBeenCalledWith('late-token');
		expect(mocks.download).not.toHaveBeenCalled();
		expect(mocks.share).not.toHaveBeenCalled();
	});

	it('cancels an in-flight download and skips the share sheet', async () => {
		let rejectDownload: ((error: Error) => void) | undefined;
		mocks.download.mockImplementationOnce(
			() =>
				new Promise((_, reject) => {
					rejectDownload = reject;
				})
		);
		mocks.cancelPlugin.mockImplementationOnce(async () => {
			rejectDownload?.(new Error('download canceled'));
		});
		const updating = await action();
		const applying = updating.applyUpdate({ iosUpdate: update } as never);
		await vi.waitFor(() => expect(mocks.download).toHaveBeenCalledOnce());
		await updating.native?.cancelUpdate();
		await expect(applying).rejects.toMatchObject({ code: 'download_canceled' });
		expect(mocks.cancelPlugin).toHaveBeenCalledOnce();
		expect(mocks.cancel).toHaveBeenCalledWith('token');
		expect(mocks.share).not.toHaveBeenCalled();
	});

	it('discards the verified package when sharing fails for a non-cancel reason', async () => {
		const updating = await action();
		mocks.share.mockRejectedValueOnce(new Error('share unavailable'));
		await expect(updating.applyUpdate({ iosUpdate: update } as never)).rejects.toMatchObject({
			code: 'share_failed'
		});
		await updating.applyUpdate({ iosUpdate: update } as never);
		expect(mocks.download).toHaveBeenCalledTimes(2);
	});
});
