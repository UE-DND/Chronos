import { afterEach, beforeEach, describe, expect, it, vi } from 'vite-plus/test';
import type { AndroidStableUpdate } from '@chronos/core';

const mocks = vi.hoisted(() => ({
	ensurePwaSwRegistered: vi.fn(),
	isSwUpdatePending: vi.fn(() => true),
	onSwUpdateAvailable: vi.fn(),
	probeSwUpdate: vi.fn(),
	applyUpdate: vi.fn(async () => {}),
	getIdentity: vi.fn(async () => ({
		packageId: 'org.uednd.chronos',
		version: '1.1.2',
		versionCode: 1001002,
		signingCertificateSha256: 'c'.repeat(64)
	}))
}));

vi.mock('./pwa-sw', () => ({
	ensurePwaSwRegistered: mocks.ensurePwaSwRegistered,
	isSwUpdatePending: mocks.isSwUpdatePending,
	onSwUpdateAvailable: mocks.onSwUpdateAvailable,
	probeSwUpdate: mocks.probeSwUpdate,
	SwUpdateError: class extends Error {}
}));
vi.mock('./pwa-install.svelte', () => ({}));
vi.mock('./web-host-update', () => ({ applyPreparedWebUpdate: vi.fn() }));
vi.mock('./analytics', () => ({ trackEvent: vi.fn() }));
vi.mock('$lib/config/app-meta', () => ({
	APP_VERSION: '1.1.2',
	ANDROID_SIGNING_CERTIFICATE: 'c'.repeat(64),
	HOST_BUILD: {
		version: '1.1.2',
		profileId: 'chronos-default',
		deploymentId: 'mobile',
		target: 'mobile',
		buildId: 'a'.repeat(64),
		sourceCommit: 'b'.repeat(40)
	}
}));

const feedUrl = 'https://ue-dnd.github.io/Chronos/android/stable.json';

function makeFeed(version = '1.1.3'): AndroidStableUpdate {
	return {
		formatVersion: 1,
		release: { tagName: `v${version}`, name: 'Chronos', body: '', publishedAt: '' },
		packageId: 'org.uednd.chronos',
		versionCode: 1001000 + Number(version.split('.')[2]),
		signingCertificateSha256: 'c'.repeat(64),
		profiles: {
			'chronos-default': {
				host: {
					version,
					profileId: 'chronos-default',
					deploymentId: 'mobile',
					target: 'mobile',
					buildId: 'd'.repeat(64),
					sourceCommit: 'e'.repeat(40)
				},
				apkUrl: `https://github.com/UE-DND/Chronos/releases/download/v${version}/Chronos-default-${version}.apk`,
				sha256: 'f'.repeat(64),
				sizeBytes: 12345,
				pluginCatalogUrl: `https://ue-dnd.github.io/Chronos/plugins/releases/${version}/catalog.json`
			}
		}
	};
}

function response(feed = makeFeed()) {
	return new Response(JSON.stringify(feed), { status: 200 });
}

describe('Android automatic APK update detection', () => {
	const fetchFeed = vi.fn<typeof fetch>();

	beforeEach(async () => {
		vi.resetModules();
		vi.clearAllMocks();
		vi.useFakeTimers();
		fetchFeed.mockReset().mockResolvedValue(response());
		mocks.getIdentity.mockResolvedValue({
			packageId: 'org.uednd.chronos',
			version: '1.1.2',
			versionCode: 1001002,
			signingCertificateSha256: 'c'.repeat(64)
		});
		vi.stubGlobal('window', new EventTarget());
		vi.stubGlobal('document', Object.assign(new EventTarget(), { visibilityState: 'visible' }));
		vi.stubGlobal('navigator', { onLine: true });
		vi.stubGlobal('fetch', fetchFeed);
		vi.stubGlobal('__ANDROID_RELEASE_FEED_URL__', feedUrl);
		const { setHostPlatform } = await import('$lib/platform/host-platform');
		setHostPlatform({
			id: 'mobile',
			isNative: true,
			platformType: 'android',
			supportsPwaInstall: false,
			shouldShowInstallGuide: false,
			getAndroidInstallationIdentity: mocks.getIdentity,
			getUpdateAction: () => ({
				mode: 'native-apk',
				canApplyInApp: true,
				actionLabelKey: 'about.update.android.install',
				applyUpdate: mocks.applyUpdate,
				native: {
					getState: async () => ({ phase: 'downloading', percent: 0, canCancel: true }),
					subscribe: async () => () => {},
					continueUpdate: async () => ({ phase: 'installing', percent: null, canCancel: false }),
					cancelUpdate: async () => ({ phase: 'canceled', percent: null, canCancel: false })
				}
			})
		});
	});

	afterEach(() => {
		vi.clearAllTimers();
		vi.useRealTimers();
		vi.unstubAllGlobals();
	});

	async function start() {
		await import('../../hooks.client');
		await vi.advanceTimersByTimeAsync(0);
		return import('./app-update-ux.svelte');
	}

	it('keeps Service Worker registration and signals enabled for the Web platform', async () => {
		const { setHostPlatform, getDefaultWebPlatform } = await import('$lib/platform/host-platform');
		setHostPlatform(getDefaultWebPlatform());
		const { appUpdateNotice } = await start();
		expect(mocks.ensurePwaSwRegistered).toHaveBeenCalledOnce();
		expect(mocks.isSwUpdatePending).toHaveBeenCalledOnce();
		expect(mocks.onSwUpdateAvailable).toHaveBeenCalledOnce();
		expect(appUpdateNotice.hasUpdate).toBe(true);
	});

	it('checks the independent feed at startup without Service Worker APIs or downloading the APK', async () => {
		const { appUpdateNotice, getAppUpdateState } = await start();
		expect(fetchFeed).toHaveBeenCalledOnce();
		expect(fetchFeed.mock.calls[0]![0]).toEqual(expect.stringContaining(`${feedUrl}?t=`));
		expect(mocks.getIdentity).toHaveBeenCalledOnce();
		expect(appUpdateNotice.hasUpdate).toBe(true);
		expect(getAppUpdateState().state.latestRelease?.androidUpdate?.host.version).toBe('1.1.3');
		expect(mocks.ensurePwaSwRegistered).not.toHaveBeenCalled();
		expect(mocks.isSwUpdatePending).not.toHaveBeenCalled();
		expect(mocks.onSwUpdateAvailable).not.toHaveBeenCalled();
		expect(mocks.probeSwUpdate).not.toHaveBeenCalled();
		expect(mocks.applyUpdate).not.toHaveBeenCalled();
		await vi.advanceTimersByTimeAsync(600_000);
		expect(fetchFeed).toHaveBeenCalledOnce();
	});

	it.each(['1.1.2', '1.1.1'])(
		'does not flag version %s or react to Web update-required signals',
		async (version) => {
			fetchFeed.mockResolvedValue(response(makeFeed(version)));
			const { appUpdateNotice, getAppUpdateState } = await start();
			window.dispatchEvent(new Event('chronos-update-required'));
			expect(appUpdateNotice.hasUpdate).toBe(false);
			expect(getAppUpdateState().state.latestRelease?.tagName).toBe(`v${version}`);
			expect(mocks.applyUpdate).not.toHaveBeenCalled();
		}
	);

	it('finds a new APK on the five-minute foreground poll and installs only after a user action', async () => {
		fetchFeed.mockResolvedValueOnce(response(makeFeed('1.1.2'))).mockResolvedValue(response());
		const { appUpdateNotice, getAppUpdateState } = await start();
		await vi.advanceTimersByTimeAsync(300_000);
		expect(fetchFeed).toHaveBeenCalledTimes(2);
		expect(appUpdateNotice.hasUpdate).toBe(true);
		expect(mocks.applyUpdate).not.toHaveBeenCalled();
		await getAppUpdateState().installUpdate();
		expect(mocks.applyUpdate).toHaveBeenCalledWith(
			getAppUpdateState().state.latestRelease,
			expect.objectContaining({ onProgress: expect.any(Function) })
		);
	});

	it('pauses in the background, then checks an expired result through the native resume callback', async () => {
		fetchFeed.mockResolvedValueOnce(response(makeFeed('1.1.2'))).mockResolvedValue(response());
		const { appUpdateNotice, checkAppUpdateOnResume } = await start();
		Object.assign(document, { visibilityState: 'hidden' });
		document.dispatchEvent(new Event('visibilitychange'));
		await vi.advanceTimersByTimeAsync(600_000);
		expect(fetchFeed).toHaveBeenCalledOnce();
		Object.assign(document, { visibilityState: 'visible' });
		await checkAppUpdateOnResume();
		expect(fetchFeed).toHaveBeenCalledTimes(2);
		expect(appUpdateNotice.hasUpdate).toBe(true);
	});

	it('waits offline and checks on network recovery', async () => {
		Object.assign(navigator, { onLine: false });
		const { appUpdateNotice } = await start();
		expect(fetchFeed).not.toHaveBeenCalled();
		Object.assign(navigator, { onLine: true });
		window.dispatchEvent(new Event('online'));
		await vi.advanceTimersByTimeAsync(0);
		expect(fetchFeed).toHaveBeenCalledOnce();
		expect(appUpdateNotice.hasUpdate).toBe(true);
	});

	it('merges a manual page check with an in-flight automatic request', async () => {
		let finish: (value: Response) => void = () => {};
		fetchFeed.mockImplementationOnce(
			() =>
				new Promise((resolve) => {
					finish = resolve;
				})
		);
		const { appUpdateNotice, getAppUpdateState } = await start();
		const manualCheck = getAppUpdateState().checkUpdate();
		expect(fetchFeed).toHaveBeenCalledOnce();
		finish(response());
		expect(await manualCheck).toBe(true);
		expect(appUpdateNotice.hasUpdate).toBe(true);
		expect(fetchFeed).toHaveBeenCalledOnce();
	});

	it.each(['unavailable', 'signature', 'profile'] as const)(
		'retries an invalid %s feed without prompting or downloading',
		async (failure) => {
			const feed = makeFeed();
			if (failure === 'signature') feed.signingCertificateSha256 = '0'.repeat(64);
			if (failure === 'profile') feed.profiles = {};
			fetchFeed.mockResolvedValueOnce(
				failure === 'unavailable' ? new Response(null, { status: 503 }) : response(feed)
			);
			const { appUpdateNotice, getAppUpdateState } = await start();
			expect(appUpdateNotice.hasUpdate).toBe(false);
			expect(getAppUpdateState().state.errorMessage).toBeTruthy();
			expect(mocks.applyUpdate).not.toHaveBeenCalled();
			await vi.advanceTimersByTimeAsync(10_000);
			expect(appUpdateNotice.hasUpdate).toBe(true);
			expect(fetchFeed).toHaveBeenCalledTimes(2);
		}
	);

	it('aborts a stalled feed request after eight seconds and retries', async () => {
		fetchFeed.mockImplementationOnce(
			(_url, options) =>
				new Promise((_resolve, reject) => {
					options?.signal?.addEventListener('abort', () =>
						reject(new DOMException('Aborted', 'AbortError'))
					);
				})
		);
		const { appUpdateNotice, getAppUpdateState } = await start();
		await vi.advanceTimersByTimeAsync(8_000);
		expect(getAppUpdateState().state.errorMessage).toContain('超时');
		expect(appUpdateNotice.hasUpdate).toBe(false);
		await vi.advanceTimersByTimeAsync(10_000);
		expect(fetchFeed).toHaveBeenCalledTimes(2);
		expect(appUpdateNotice.hasUpdate).toBe(true);
	});
});
