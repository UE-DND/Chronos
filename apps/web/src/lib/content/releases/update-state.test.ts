import { describe, expect, it, vi } from 'vite-plus/test';
import { createUpdateState } from './update-state.svelte';
import { createReleaseFeedAdapter, fetchLatestProjectRelease } from './release-feed-adapter';
import * as serviceWorkerAdapter from './service-worker-adapter';
import { HOST_BUILD } from '$lib/config/app-meta';
import { AppError, failure, success } from '@chronos/core';
import type { NativeUpdateState, PlatformUpdateAction } from '$lib/platform/host-platform';

describe('native APK update lifecycle', () => {
	function setup(initial: NativeUpdateState = { phase: 'idle', percent: null, canCancel: false }) {
		let listener: ((state: NativeUpdateState) => void) | undefined;
		const sw = {
			isSupported: () => true,
			isUpdatePending: vi.fn(() => true),
			checkForUpdate: vi.fn(),
			applyUpdateAndReload: vi.fn()
		};
		const action: PlatformUpdateAction = {
			mode: 'native-apk',
			canApplyInApp: true,
			actionLabelKey: 'about.update.android.install',
			applyUpdate: vi.fn(async () => undefined),
			native: {
				getState: vi.fn(async () => initial),
				subscribe: vi.fn(async (callback) => {
					listener = callback;
					return () => {
						listener = undefined;
					};
				}),
				continueUpdate: vi.fn(async () => ({
					phase: 'installing' as const,
					percent: null,
					canCancel: false
				})),
				cancelUpdate: vi.fn(async () => ({
					phase: 'canceled' as const,
					percent: null,
					canCancel: false
				}))
			}
		};
		const controller = createUpdateState({
			currentVersion: '1.0.0',
			platformUpdateAction: action,
			swAdapter: sw,
			fetchLatestRelease: async () =>
				success({ tagName: 'v1.0.1', name: '', body: '', publishedAt: '' })
		});
		return { controller, action, sw, emit: (state: NativeUpdateState) => listener?.(state) };
	}

	it('never checks or installs a service worker and remains active after enqueue', async () => {
		const { controller, action, sw, emit } = setup();
		const dispose = await controller.observeNativeUpdate();
		await controller.checkUpdate();
		await controller.installUpdate();
		emit({ phase: 'downloading', percent: 32, canCancel: true });
		await controller.installUpdate();
		expect(action.applyUpdate).toHaveBeenCalledTimes(1);
		expect(sw.isUpdatePending).not.toHaveBeenCalled();
		expect(sw.checkForUpdate).not.toHaveBeenCalled();
		expect(sw.applyUpdateAndReload).not.toHaveBeenCalled();
		expect(controller.state.installPercent).toBe(32);
		expect(controller.state.updating).toBe(true);
		dispose();
	});
	it('restores confirmation and supports continuing without the release feed', async () => {
		const { controller, action } = setup({
			phase: 'awaiting-confirmation',
			percent: null,
			canCancel: true,
			targetVersion: '1.0.1'
		});
		const dispose = await controller.observeNativeUpdate();
		expect(controller.state.installPhase).toBe('awaiting-confirmation');
		expect(controller.state.hasUpdate).toBe(true);
		await controller.continueNativeUpdate();
		expect(action.native?.continueUpdate).toHaveBeenCalledOnce();
		expect(controller.state.installPhase).toBe('installing');
		dispose();
	});
	it('does not let the previous successful task hide a newer release', async () => {
		const { controller } = setup({
			phase: 'succeeded',
			percent: null,
			canCancel: false,
			targetVersion: '1.0.0'
		});
		const dispose = await controller.observeNativeUpdate();
		await controller.checkUpdate();
		expect(controller.state.hasNewerVersion).toBe(true);
		expect(controller.state.hasUpdate).toBe(true);
		dispose();
	});

	it('can start a newer release after an older task failed', async () => {
		const { controller, action } = setup({
			phase: 'failed',
			percent: null,
			canCancel: false,
			targetVersion: '1.0.0',
			errorCode: 'version_conflict'
		});
		const dispose = await controller.observeNativeUpdate();
		await controller.checkUpdate();
		await controller.installUpdate();
		expect(action.applyUpdate).toHaveBeenCalledOnce();
		expect(action.native?.continueUpdate).not.toHaveBeenCalled();
		dispose();
	});

	it('reports terminal failures and cancellation without leaving a spinner', async () => {
		const { controller, emit } = setup({ phase: 'downloading', percent: 10, canCancel: true });
		const dispose = await controller.observeNativeUpdate();
		emit({ phase: 'failed', percent: null, canCancel: false, errorCode: 'signature_mismatch' });
		expect(controller.state.updating).toBe(false);
		expect(controller.state.errorMessage).toBe('about.update.android.error.signature_mismatch');
		emit({ phase: 'downloading', percent: 20, canCancel: true });
		await controller.cancelNativeUpdate();
		expect(controller.state.updating).toBe(false);
		expect(controller.state.nativeState?.phase).toBe('canceled');
		dispose();
	});
});

describe('fetchLatestProjectRelease', () => {
	it('times out a stalled request even without AbortSignal.timeout support', async () => {
		vi.useFakeTimers();
		const savedTimeout = Object.getOwnPropertyDescriptor(AbortSignal, 'timeout');
		Reflect.deleteProperty(AbortSignal, 'timeout');
		try {
			const fetchFn = vi.fn(
				(_url: unknown, options: RequestInit) =>
					new Promise<Response>((_resolve, reject) => {
						options.signal?.addEventListener('abort', () =>
							reject(new DOMException('Aborted', 'AbortError'))
						);
					})
			);
			const pending = fetchLatestProjectRelease(fetchFn as unknown as typeof fetch);
			await vi.advanceTimersByTimeAsync(8000);
			expect(fetchFn.mock.calls[0]![1].signal?.aborted).toBe(true);
			const result = await pending;
			expect(result.ok).toBe(false);
			if (!result.ok) expect(result.error.message).toContain('超时');
		} finally {
			if (savedTimeout) Object.defineProperty(AbortSignal, 'timeout', savedTimeout);
			vi.useRealTimers();
		}
	});

	it('successfully parses release from project version.json', async () => {
		const mockFetch = vi.fn().mockResolvedValue({
			ok: true,
			status: 200,
			json: async () => ({
				formatVersion: 1,
				host: { ...HOST_BUILD, version: '0.2.0' },
				requiredPluginIds: [],
				pluginCatalogUrl: 'https://ue-dnd.github.io/Chronos/plugins/releases/0.2.0/catalog.json',
				release: {
					tagName: 'v0.2.0',
					name: 'Chronos 0.2.0',
					publishedAt: '2026-08-18',
					body: '### 新增\n- 软件更新页面'
				}
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

	it('rejects an obsolete release feed instead of treating it as an Android artifact', async () => {
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
		expect(result.ok).toBe(false);
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
	it('reports remote failure for automatic retry instead of accepting a local fallback', async () => {
		const listReleases = vi.fn(async () =>
			success([{ tagName: 'v0.2.0', name: '', body: '', publishedAt: '' }])
		);
		const controller = createUpdateState({
			allowLocalFallback: false,
			fetchLatestRelease: async () => failure(AppError.network('offline')),
			localCatalog: { listReleases, getRelease: async () => failure(AppError.notFound('none')) },
			checkSwUpdate: async () => false
		});
		expect(await controller.checkUpdate()).toBe(false);
		expect(listReleases).not.toHaveBeenCalled();
		expect(controller.state.checking).toBe(false);
		expect(controller.state.errorMessage).toBe('offline');
	});

	it('shares an in-flight check between automatic and manual callers', async () => {
		let finish = () => {};
		const release = { tagName: 'v0.2.0', name: '', body: '', publishedAt: '' };
		const fetchLatestRelease = vi.fn(
			() =>
				new Promise<ReturnType<typeof success<typeof release>>>((resolve) => {
					finish = () => resolve(success(release));
				})
		);
		const controller = createUpdateState({ fetchLatestRelease, checkSwUpdate: async () => false });
		const first = controller.checkUpdate();
		const second = controller.checkUpdate();
		await Promise.resolve();
		expect(first).toBe(second);
		expect(fetchLatestRelease).toHaveBeenCalledOnce();
		finish();
		expect(await first).toBe(true);
		expect(controller.state.checking).toBe(false);
	});

	it('finishes a check when the service worker adapter rejects, allowing a later retry', async () => {
		const checkSwUpdate = vi
			.fn()
			.mockRejectedValueOnce(new Error('SW unavailable'))
			.mockResolvedValue(false);
		const controller = createUpdateState({
			checkSwUpdate,
			fetchLatestRelease: async () =>
				success({ tagName: 'v0.2.0', name: '', body: '', publishedAt: '' })
		});
		expect(await controller.checkUpdate()).toBe(false);
		expect(controller.state.checking).toBe(false);
		expect(await controller.checkUpdate()).toBe(true);
		expect(controller.state.errorMessage).toBeNull();
	});

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
			(options?: { onProgress?: (p: { phase: string; percent: number | null }) => void }) =>
				new Promise<void>((resolve) => {
					resolveInstall = resolve;
					options?.onProgress?.({ phase: 'downloading', percent: null });
					options?.onProgress?.({ phase: 'installing', percent: null });
				})
		);
		const updateState = createUpdateState({
			currentVersion: '0.2.0',
			applyUpdate: applyUpdateMock
		});

		const installPromise = updateState.installUpdate();

		expect(updateState.state.updating).toBe(true);
		expect(updateState.state.installPhase).toBe('installing');
		expect(updateState.state.installPercent).toBeNull();

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
					onProgress?: (progress: { phase: string; percent: number | null }) => void;
				}) => {
					options?.onProgress?.({ phase: 'installing', percent: null });
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
