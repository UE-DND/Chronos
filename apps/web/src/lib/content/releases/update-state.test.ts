import { describe, expect, it, vi } from 'vite-plus/test';
import { createUpdateState } from './update-state.svelte';
import { createReleaseFeedAdapter, fetchLatestProjectRelease } from './release-feed-adapter';
import * as serviceWorkerAdapter from './service-worker-adapter';
import { AppError, failure, success } from '@chronos/core';

describe('fetchLatestProjectRelease', () => {
	it('successfully parses release from project version.json', async () => {
		const mockFetch = vi.fn().mockResolvedValue({
			ok: true,
			status: 200,
			json: async () => ({
				tagName: 'v0.2.0',
				name: 'Chronos 0.2.0',
				publishedAt: '2026-08-18',
				body: '### 新增\n- 软件更新页面'
			})
		});

		const result = await fetchLatestProjectRelease(
			mockFetch as unknown as typeof fetch,
			'/version.json'
		);
		expect(result.ok).toBe(true);
		if (result.ok) {
			expect(result.value.tagName).toBe('v0.2.0');
			expect(result.value.name).toBe('Chronos 0.2.0');
		}
	});

	it('handles 404 not found and network failure', async () => {
		const mock404 = vi.fn().mockResolvedValue({ ok: false, status: 404 });
		const notFoundResult = await fetchLatestProjectRelease(
			mock404 as unknown as typeof fetch,
			'/version.json'
		);
		expect(notFoundResult.ok).toBe(false);

		const mockError = vi.fn().mockRejectedValue(new Error('Network offline'));
		const errorResult = await fetchLatestProjectRelease(
			mockError as unknown as typeof fetch,
			'/version.json'
		);
		expect(errorResult.ok).toBe(false);
	});

	it('keeps only a valid HTTPS Android update URL from the remote feed', async () => {
		const fetchFn = vi.fn().mockResolvedValue({
			ok: true,
			status: 200,
			json: async () => ({
				tagName: 'v0.3.0',
				platforms: { android: { updateUrl: 'market://details?id=chronos' } }
			})
		});
		const result = await fetchLatestProjectRelease(
			fetchFn as unknown as typeof fetch,
			'/version.json'
		);
		expect(result.ok).toBe(true);
		if (result.ok) expect(result.value.platforms).toBeUndefined();
	});
});

describe('createReleaseFeedAdapter', () => {
	it('does not fall back to the bundled catalog when remote-only mode is enabled', async () => {
		const listReleases = vi.fn(async () =>
			success([{ tagName: 'v9.9.9', name: 'local', publishedAt: '', body: '' }])
		);
		const adapter = createReleaseFeedAdapter({
			fetchLatestRelease: async () => failure(AppError.network('offline')),
			localCatalog: { listReleases, getRelease: async () => failure(AppError.notFound('none')) },
			allowLocalFallback: false
		});
		const result = await adapter.fetchLatestRelease();
		expect(result.ok).toBe(false);
		expect(listReleases).not.toHaveBeenCalled();
	});

	it('returns unavailable without requesting a same-origin feed when the URL is unset', async () => {
		const fetchFn = vi.fn();
		const adapter = createReleaseFeedAdapter({
			fetchFn: fetchFn as unknown as typeof fetch,
			versionUrl: '',
			allowLocalFallback: false,
			requireVersionUrl: true
		});
		const result = await adapter.fetchLatestRelease();
		expect(result.ok).toBe(false);
		expect(fetchFn).not.toHaveBeenCalled();
	});
});

describe('createUpdateState', () => {
	it('starts in checking state so the first paint is not up to date', () => {
		const updateState = createUpdateState({
			currentVersion: '0.2.0',
			checkSwUpdate: async () => false
		});

		expect(updateState.state.checking).toBe(true);
		expect(updateState.state.hasUpdate).toBe(false);
		expect(updateState.state.lastChecked).toBeNull();
	});

	it('detects when a newer version is available from remote', async () => {
		const updateState = createUpdateState({
			currentVersion: '0.1.4',
			fetchLatestRelease: async () =>
				success({
					tagName: 'v0.2.0',
					name: 'Chronos 0.2.0',
					publishedAt: '2026-08-18',
					body: '新功能发布'
				}),
			checkSwUpdate: async () => false,
			applyUpdate: async () => {}
		});

		expect(updateState.state.hasUpdate).toBe(false);
		await updateState.checkUpdate();

		expect(updateState.state.checking).toBe(false);
		expect(updateState.state.hasUpdate).toBe(true);
		expect(updateState.state.latestRelease?.tagName).toBe('v0.2.0');
		expect(updateState.state.errorMessage).toBeNull();
		expect(updateState.state.lastChecked).not.toBeNull();
	});

	it('detects when already on latest version', async () => {
		const updateState = createUpdateState({
			currentVersion: '0.2.0',
			fetchLatestRelease: async () =>
				success({
					tagName: 'v0.2.0',
					name: 'Chronos 0.2.0',
					publishedAt: '2026-08-18',
					body: '当前版本'
				}),
			checkSwUpdate: async () => false,
			applyUpdate: async () => {}
		});

		await updateState.checkUpdate();

		expect(updateState.state.checking).toBe(false);
		expect(updateState.state.hasUpdate).toBe(false);
		expect(updateState.state.latestRelease?.tagName).toBe('v0.2.0');
	});

	it('does NOT trigger update when remote version is lower than current version', async () => {
		const updateState = createUpdateState({
			currentVersion: '0.2.1',
			fetchLatestRelease: async () =>
				success({
					tagName: 'v0.2.0',
					name: 'Chronos 0.2.0',
					publishedAt: '2026-08-18',
					body: '旧版本'
				}),
			checkSwUpdate: async () => false,
			applyUpdate: async () => {}
		});

		await updateState.checkUpdate();

		expect(updateState.state.checking).toBe(false);
		expect(updateState.state.hasUpdate).toBe(false);
	});

	it('falls back to local catalog when remote fetch fails', async () => {
		const updateState = createUpdateState({
			currentVersion: '0.2.0',
			fetchLatestRelease: async () => failure(AppError.network('Offline')),
			localCatalog: {
				getRelease: async () => failure(AppError.notFound('none')),
				listReleases: async () =>
					success([
						{
							tagName: 'v0.2.0',
							name: 'Chronos 0.2.0',
							publishedAt: '2026-08-18',
							body: '本地最新'
						}
					])
			},
			checkSwUpdate: async () => false
		});

		await updateState.checkUpdate();

		expect(updateState.state.checking).toBe(false);
		expect(updateState.state.hasUpdate).toBe(false);
		expect(updateState.state.latestRelease?.tagName).toBe('v0.2.0');
		expect(updateState.state.errorMessage).toBeNull();
	});

	it('detects update when catalog fallback matches current version but SW is waiting', async () => {
		const updateState = createUpdateState({
			currentVersion: '0.2.0',
			fetchLatestRelease: async () => failure(AppError.network('Offline')),
			localCatalog: {
				getRelease: async () => failure(AppError.notFound('none')),
				listReleases: async () =>
					success([
						{
							tagName: 'v0.2.0',
							name: 'Chronos 0.2.0',
							publishedAt: '2026-08-18',
							body: '本地最新'
						}
					])
			},
			checkSwUpdate: async () => true,
			applyUpdate: async () => {}
		});

		await updateState.checkUpdate();

		expect(updateState.state.checking).toBe(false);
		expect(updateState.state.hasUpdate).toBe(true);
		expect(updateState.state.hasNewerVersion).toBe(false);
		expect(updateState.state.updateSource).toBe('sw');
		expect(updateState.state.latestRelease?.tagName).toBe('v0.2.0');
	});

	it('detects update when remote reports same version but SW is waiting', async () => {
		const updateState = createUpdateState({
			currentVersion: '0.2.0',
			fetchLatestRelease: async () =>
				success({
					tagName: 'v0.2.0',
					name: 'Chronos 0.2.0',
					publishedAt: '2026-08-18',
					body: '当前版本'
				}),
			checkSwUpdate: async () => true,
			applyUpdate: async () => {}
		});

		await updateState.checkUpdate();

		expect(updateState.state.checking).toBe(false);
		expect(updateState.state.hasUpdate).toBe(true);
		expect(updateState.state.hasNewerVersion).toBe(false);
		expect(updateState.state.updateSource).toBe('sw');
	});

	it('detects update when service worker has a waiting update upon remote failure', async () => {
		const updateState = createUpdateState({
			currentVersion: '0.2.0',
			fetchLatestRelease: async () => failure(AppError.network('Offline')),
			localCatalog: {
				getRelease: async () => failure(AppError.notFound('none')),
				listReleases: async () => success([])
			},
			checkSwUpdate: async () => true,
			applyUpdate: async () => {}
		});

		await updateState.checkUpdate();

		expect(updateState.state.checking).toBe(false);
		expect(updateState.state.hasUpdate).toBe(true);
		expect(updateState.state.errorMessage).toBeNull();
	});

	it('reports failure event when check update fails completely', async () => {
		const updateState = createUpdateState({
			currentVersion: '0.2.0',
			fetchLatestRelease: async () => failure(AppError.network('网络连接失败')),
			localCatalog: {
				getRelease: async () => failure(AppError.notFound('none')),
				listReleases: async () => failure(AppError.notFound('none'))
			},
			checkSwUpdate: async () => false
		});

		await updateState.checkUpdate();

		expect(updateState.state.checking).toBe(false);
		expect(updateState.state.hasUpdate).toBe(false);
		expect(updateState.state.errorMessage).toBe('网络连接失败');
	});

	it('triggers applyUpdate and tracks event when installUpdate is called', async () => {
		const applyUpdateMock = vi.fn().mockResolvedValue(undefined);
		const updateState = createUpdateState({
			currentVersion: '0.2.0',
			applyUpdate: applyUpdateMock
		});

		await updateState.installUpdate();

		expect(applyUpdateMock).toHaveBeenCalled();
	});

	it('updates install progress from applyUpdate callbacks', async () => {
		let resolveInstall!: () => void;
		const applyUpdateMock = vi.fn().mockImplementation(
			(options?: { onProgress?: (p: { phase: string; percent: number }) => void }) =>
				new Promise<void>((resolve) => {
					resolveInstall = resolve;
					options?.onProgress?.({ phase: 'downloading', percent: 25 });
					options?.onProgress?.({ phase: 'installing', percent: 80 });
				})
		);
		const updateState = createUpdateState({
			currentVersion: '0.2.0',
			applyUpdate: applyUpdateMock
		});

		const installPromise = updateState.installUpdate();

		expect(updateState.state.updating).toBe(true);
		expect(updateState.state.installPhase).toBe('installing');
		expect(updateState.state.installPercent).toBe(80);

		resolveInstall();
		await installPromise;

		expect(updateState.state.updating).toBe(false);
		expect(updateState.state.installPhase).toBeNull();
	});

	it('resets updating state and stores i18n key when install fails', async () => {
		const { SwUpdateError } = await import('$lib/client/pwa-sw');
		const applyUpdateMock = vi.fn().mockRejectedValue(new SwUpdateError('download_timeout'));
		const updateState = createUpdateState({
			currentVersion: '0.2.0',
			applyUpdate: applyUpdateMock
		});

		await updateState.installUpdate();

		expect(updateState.state.updating).toBe(false);
		expect(updateState.state.installPhase).toBeNull();
		expect(updateState.state.errorMessage).toBe('about.update.error.downloadTimeout');
	});

	it('maps download_failed install errors to the download failed message key', async () => {
		const { SwUpdateError } = await import('$lib/client/pwa-sw');
		const applyUpdateMock = vi.fn().mockRejectedValue(new SwUpdateError('download_failed'));
		const updateState = createUpdateState({
			currentVersion: '0.2.0',
			applyUpdate: applyUpdateMock
		});

		await updateState.installUpdate();

		expect(updateState.state.errorMessage).toBe('about.update.error.downloadFailed');
	});

	it('keeps the last successful check when a later remote fetch fails', async () => {
		let fetchCount = 0;
		const updateState = createUpdateState({
			currentVersion: '0.2.0',
			fetchLatestRelease: async () => {
				fetchCount += 1;
				if (fetchCount === 1) {
					return success({
						tagName: 'v0.3.0',
						name: 'Chronos 0.3.0',
						publishedAt: '2026-08-19',
						body: 'new'
					});
				}
				return failure(AppError.network('offline'));
			},
			localCatalog: {
				getRelease: async () => failure(AppError.notFound('none')),
				listReleases: async () => failure(AppError.notFound('none'))
			},
			checkSwUpdate: async () => false
		});

		await updateState.checkUpdate();
		expect(updateState.state.hasUpdate).toBe(true);
		expect(updateState.state.latestRelease?.tagName).toBe('v0.3.0');

		await updateState.checkUpdate();
		expect(updateState.state.hasUpdate).toBe(true);
		expect(updateState.state.latestRelease?.tagName).toBe('v0.3.0');
		expect(updateState.state.errorMessage).toBeNull();
	});

	it('forwards install progress through the built-in service worker adapter', async () => {
		const applyUpdateAndReload = vi
			.fn()
			.mockImplementation(
				async (options?: {
					onProgress?: (progress: { phase: string; percent: number }) => void;
				}) => {
					options?.onProgress?.({ phase: 'installing', percent: 80 });
				}
			);
		vi.spyOn(serviceWorkerAdapter, 'createDefaultServiceWorkerAdapter').mockReturnValue({
			isSupported: () => true,
			isUpdatePending: () => false,
			checkForUpdate: async () => false,
			applyUpdateAndReload
		});

		const updateState = createUpdateState();
		await updateState.installUpdate();

		expect(applyUpdateAndReload).toHaveBeenCalledWith({
			onProgress: expect.any(Function)
		});
	});

	it('supports pluggable ServiceWorkerAdapter and ReleaseFeedAdapter', async () => {
		const mockSwAdapter = {
			isSupported: () => true,
			isUpdatePending: () => false,
			checkForUpdate: vi.fn().mockResolvedValue(false),
			applyUpdateAndReload: vi.fn().mockResolvedValue(undefined)
		};
		const mockFeedAdapter = {
			fetchLatestRelease: vi.fn().mockResolvedValue(
				success({
					tagName: 'v0.3.0',
					name: 'Chronos 0.3.0',
					publishedAt: '2026-08-19',
					body: 'Major upgrade'
				})
			)
		};

		const updateState = createUpdateState({
			currentVersion: '0.2.0',
			swAdapter: mockSwAdapter,
			releaseFeedAdapter: mockFeedAdapter
		});

		await updateState.checkUpdate();
		expect(updateState.state.hasUpdate).toBe(true);
		expect(updateState.state.latestRelease?.tagName).toBe('v0.3.0');
		expect(mockSwAdapter.checkForUpdate).toHaveBeenCalledOnce();
		expect(mockFeedAdapter.fetchLatestRelease).toHaveBeenCalledOnce();

		await updateState.installUpdate();
		expect(mockSwAdapter.applyUpdateAndReload).toHaveBeenCalledOnce();
	});

	it('uses platformUpdateAction external link without setting fake download progress', async () => {
		const applyUpdateMock = vi.fn().mockResolvedValue(undefined);
		const updateState = createUpdateState({
			currentVersion: '0.2.0',
			fetchLatestRelease: async () =>
				success({
					tagName: 'v0.3.0',
					name: 'Chronos 0.3.0',
					publishedAt: '2026-08-19',
					body: 'Major upgrade',
					platforms: { android: { updateUrl: 'https://example.com/update' } }
				}),
			platformUpdateAction: {
				mode: 'external-link',
				canApplyInApp: false,
				actionLabelKey: 'about.update.external',
				applyUpdate: applyUpdateMock
			}
		});

		await updateState.checkUpdate();
		expect(updateState.updateAction?.canApplyInApp).toBe(false);
		expect(updateState.updateAction?.actionLabelKey).toBe('about.update.external');

		await updateState.installUpdate();

		expect(applyUpdateMock).toHaveBeenCalledWith(
			expect.objectContaining({ tagName: 'v0.3.0' }),
			undefined
		);
		expect(updateState.state.updating).toBe(false);
		expect(updateState.state.installPhase).toBeNull();
	});

	it('reports Android feed failure instead of using local releases or service workers', async () => {
		const checkSwUpdate = vi.fn(async () => true);
		const listReleases = vi.fn(async () =>
			success([{ tagName: 'v9.9.9', name: 'bundled', publishedAt: '', body: '' }])
		);
		const updateState = createUpdateState({
			currentVersion: '0.2.0',
			fetchLatestRelease: async () => failure(AppError.network('offline')),
			localCatalog: { listReleases, getRelease: async () => failure(AppError.notFound('none')) },
			checkSwUpdate,
			platformUpdateAction: {
				mode: 'external-link',
				canApplyInApp: false,
				actionLabelKey: 'about.update.external',
				applyUpdate: vi.fn()
			}
		});

		await updateState.checkUpdate();

		expect(updateState.state.hasUpdate).toBe(false);
		expect(updateState.state.latestRelease).toBeNull();
		expect(updateState.state.errorMessage).toBe('offline');
		expect(listReleases).not.toHaveBeenCalled();
		expect(checkSwUpdate).not.toHaveBeenCalled();
	});
});
