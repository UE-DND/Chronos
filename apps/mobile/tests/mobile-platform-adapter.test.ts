import { afterEach, beforeEach, describe, expect, it, vi } from 'vite-plus/test';
import { CHRONOS_NATIVE_BRIDGE_KEY } from '@chronos/ui-kit';
import {
	createCapacitorNativeBridge,
	createMobilePlatformAdapter,
	hideMobileSplashScreen,
	initMobilePlatform,
	isCapacitorNative,
	resolvePlatformType,
	shareFileWithMobile,
	syncMobileStatusBarStyle
} from '../src/mobile-platform-adapter';

const mockHaptics = vi.hoisted(() => ({
	impact: vi.fn(),
	notification: vi.fn(),
	selectionStart: vi.fn(),
	selectionChanged: vi.fn()
}));

const mockStatusBar = vi.hoisted(() => ({
	setStyle: vi.fn(),
	setOverlaysWebView: vi.fn(),
	setBackgroundColor: vi.fn()
}));

const mockApp = vi.hoisted(() => ({
	addListener: vi.fn(),
	exitApp: vi.fn()
}));

const mockAppLauncher = vi.hoisted(() => ({ openUrl: vi.fn().mockResolvedValue(undefined) }));

const mockSplashScreen = vi.hoisted(() => ({
	hide: vi.fn()
}));

const mockShare = vi.hoisted(() => ({
	share: vi.fn()
}));

const mockFilesystem = vi.hoisted(() => ({
	writeFile: vi.fn().mockResolvedValue({ uri: 'file:///cache/test.txt' })
}));

const mockClipboard = vi.hoisted(() => ({
	read: vi.fn().mockResolvedValue({ value: 'mocked clipboard text' }),
	write: vi.fn().mockResolvedValue(undefined)
}));

const capacitorState = vi.hoisted(() => ({
	isNative: false,
	platform: 'web',
	isPluginAvailable: (_name: string) => true
}));

vi.mock('@capacitor/clipboard', () => ({
	Clipboard: mockClipboard
}));

vi.mock('@capacitor/core', () => ({
	Capacitor: {
		isNativePlatform: () => capacitorState.isNative,
		getPlatform: () => capacitorState.platform,
		isPluginAvailable: (name: string) => capacitorState.isPluginAvailable(name)
	}
}));

vi.mock('@capacitor/haptics', () => ({
	Haptics: mockHaptics,
	ImpactStyle: { Light: 'LIGHT', Medium: 'MEDIUM', Heavy: 'HEAVY' },
	NotificationType: { Success: 'SUCCESS', Warning: 'WARNING', Error: 'ERROR' }
}));

vi.mock('@capacitor/status-bar', () => ({
	StatusBar: mockStatusBar,
	Style: { Dark: 'DARK', Light: 'LIGHT' }
}));

vi.mock('@capacitor/app', () => ({
	App: mockApp
}));

vi.mock('@capacitor/app-launcher', () => ({ AppLauncher: mockAppLauncher }));

vi.mock('@capacitor/splash-screen', () => ({
	SplashScreen: mockSplashScreen
}));

vi.mock('@capacitor/share', () => ({
	Share: mockShare
}));

vi.mock('@capacitor/filesystem', () => ({
	Filesystem: mockFilesystem,
	Directory: { Cache: 'CACHE' },
	Encoding: { UTF8: 'utf8' }
}));

describe('mobile-platform-adapter', () => {
	beforeEach(() => {
		vi.clearAllMocks();
		capacitorState.isNative = false;
		capacitorState.platform = 'web';
		capacitorState.isPluginAvailable = () => true;
		vi.stubGlobal('window', {});
	});

	afterEach(() => {
		vi.unstubAllGlobals();
	});

	describe('platform identification', () => {
		it('returns false and web when in web environment', () => {
			capacitorState.isNative = false;
			capacitorState.platform = 'web';
			expect(isCapacitorNative()).toBe(false);
			expect(resolvePlatformType()).toBe('web');
		});

		it('reports Android for the supported native platform', () => {
			capacitorState.isNative = true;
			capacitorState.platform = 'android';
			expect(isCapacitorNative()).toBe(true);
			expect(resolvePlatformType()).toBe('android');

			capacitorState.platform = 'ios';
			// No iOS Capacitor target is shipped, so unknown native targets are not exposed as iOS.
			expect(resolvePlatformType()).toBe('web');
		});
	});

	describe('NativeHostBridge', () => {
		it('maps impact haptic calls to Capacitor Haptics.impact', async () => {
			capacitorState.isNative = true;
			const bridge = createCapacitorNativeBridge();

			await bridge.callNative('haptic', 'impact', { style: 'heavy' });
			expect(mockHaptics.impact).toHaveBeenCalledWith({ style: 'HEAVY' });
		});

		it('maps notification haptic calls to Capacitor Haptics.notification', async () => {
			capacitorState.isNative = true;
			const bridge = createCapacitorNativeBridge();

			await bridge.callNative('haptic', 'notification', { type: 'error' });
			expect(mockHaptics.notification).toHaveBeenCalledWith({ type: 'ERROR' });
		});

		it('maps selection haptic calls to selectionStart and selectionChanged', async () => {
			capacitorState.isNative = true;
			const bridge = createCapacitorNativeBridge();

			await bridge.callNative('haptic', 'selection');
			expect(mockHaptics.selectionStart).toHaveBeenCalled();
			expect(mockHaptics.selectionChanged).toHaveBeenCalled();
		});

		it('rejects unsupported capability explicitly instead of returning undefined', async () => {
			const bridge = createCapacitorNativeBridge();
			await expect(bridge.callNative('storage', 'getTimetable', {})).rejects.toThrow(
				'Unsupported native capability: "storage"'
			);
		});

		it('maps readText clipboard calls to Capacitor Clipboard.read', async () => {
			capacitorState.isNative = true;
			const bridge = createCapacitorNativeBridge();

			const text = await bridge.callNative('clipboard', 'readText');
			expect(mockClipboard.read).toHaveBeenCalled();
			expect(text).toBe('mocked clipboard text');
		});

		it('maps writeText clipboard calls to Capacitor Clipboard.write', async () => {
			capacitorState.isNative = true;
			const bridge = createCapacitorNativeBridge();

			await bridge.callNative('clipboard', 'writeText', { text: 'new text' });
			expect(mockClipboard.write).toHaveBeenCalledWith({ string: 'new text' });
		});

		it('rejects unsupported haptic method explicitly', async () => {
			const bridge = createCapacitorNativeBridge();
			await expect(bridge.callNative('haptic', 'vibrate', {})).rejects.toThrow(
				'Unsupported haptic method: "vibrate"'
			);
		});
	});

	describe('lifecycle and listener cleanup', () => {
		it('injects bridge into window and cleans up on teardown', async () => {
			capacitorState.isNative = true;
			const handleRemove = vi.fn().mockResolvedValue(undefined);
			mockApp.addListener.mockResolvedValue({ remove: handleRemove });

			const teardown = initMobilePlatform();
			expect(
				(window as unknown as Record<string, unknown>)[CHRONOS_NATIVE_BRIDGE_KEY]
			).toBeDefined();

			teardown();
			expect(
				(window as unknown as Record<string, unknown>)[CHRONOS_NATIVE_BRIDGE_KEY]
			).toBeUndefined();
			await vi.waitFor(() => {
				expect(handleRemove).toHaveBeenCalled();
			});
		});

		it('handles race condition when teardown is called before addListener resolves', async () => {
			capacitorState.isNative = true;
			let resolveListener!: (val: { remove: () => Promise<void> }) => void;
			const listenerPromise = new Promise<{ remove: () => Promise<void> }>((resolve) => {
				resolveListener = resolve;
			});
			mockApp.addListener.mockReturnValue(listenerPromise);

			const teardown = initMobilePlatform();
			// Teardown is called immediately before listener promise resolves
			teardown();

			const handleRemove = vi.fn().mockResolvedValue(undefined);
			resolveListener({ remove: handleRemove });

			// Wait for the promise continuation
			await vi.waitFor(() => {
				expect(handleRemove).toHaveBeenCalled();
			});
		});

		it('invokes onSystemBack and exits app if returning exit', async () => {
			capacitorState.isNative = true;
			let backHandler: (() => void) | undefined;
			mockApp.addListener.mockImplementation((event: string, handler: () => void) => {
				if (event === 'backButton') backHandler = handler;
				return Promise.resolve({ remove: vi.fn() });
			});

			const onSystemBack = vi.fn().mockReturnValue('exit');
			initMobilePlatform({ onSystemBack });

			backHandler?.();
			expect(onSystemBack).toHaveBeenCalled();
			expect(mockApp.exitApp).toHaveBeenCalled();
		});

		it('invokes onDeepLink and onAppResume callbacks', async () => {
			capacitorState.isNative = true;
			const handlers: Record<string, (ev: unknown) => void> = {};
			mockApp.addListener.mockImplementation((event: string, handler: (ev: unknown) => void) => {
				handlers[event] = handler;
				return Promise.resolve({ remove: vi.fn() });
			});

			const onDeepLink = vi.fn();
			const onAppResume = vi.fn();
			initMobilePlatform({ onDeepLink, onAppResume });

			handlers.appUrlOpen?.({ url: 'chronos://s#1.payload' });
			expect(onDeepLink).toHaveBeenCalledWith(new URL('chronos://s#1.payload'));

			handlers.appStateChange?.({ isActive: true });
			expect(onAppResume).toHaveBeenCalled();
		});
	});

	describe('status bar and splash screen', () => {
		it('syncs status bar style to dark or light', async () => {
			capacitorState.isNative = true;
			capacitorState.platform = 'android';
			await syncMobileStatusBarStyle(true);

			expect(mockStatusBar.setStyle).toHaveBeenCalledWith({ style: 'DARK' });
			expect(mockStatusBar.setOverlaysWebView).toHaveBeenCalledWith({ overlay: true });
		});

		it('hides splash screen on call', async () => {
			capacitorState.isNative = true;
			await hideMobileSplashScreen();
			expect(mockSplashScreen.hide).toHaveBeenCalled();
		});
	});

	describe('shareFileWithMobile', () => {
		it('returns shared when share succeeds', async () => {
			capacitorState.isNative = true;
			mockShare.share.mockResolvedValue({});

			const result = await shareFileWithMobile('test.txt', '中文课表', 'text/plain');
			expect(result).toEqual({ status: 'shared' });
			expect(mockFilesystem.writeFile).toHaveBeenCalledWith(
				expect.objectContaining({ path: 'test.txt', data: '中文课表', encoding: 'utf8' })
			);
		});

		it('writes binary files as Base64 without text encoding', async () => {
			capacitorState.isNative = true;
			mockShare.share.mockResolvedValue({});

			await shareFileWithMobile(
				'test.bin',
				new Uint8Array([0, 255, 42]),
				'application/octet-stream'
			);
			expect(mockFilesystem.writeFile).toHaveBeenCalledWith(
				expect.objectContaining({ path: 'test.bin', data: 'AP8q' })
			);
			expect(mockFilesystem.writeFile.mock.calls[0][0]).not.toHaveProperty('encoding');
		});

		it('returns canceled when user dismisses share dialog', async () => {
			capacitorState.isNative = true;
			mockShare.share.mockRejectedValue(new Error('Share canceled by user'));

			const result = await shareFileWithMobile('test.txt', 'hello', 'text/plain');
			expect(result).toEqual({ status: 'canceled' });
		});

		it('returns failed when unexpected error occurs', async () => {
			capacitorState.isNative = true;
			const err = new Error('Disk full');
			mockFilesystem.writeFile.mockRejectedValue(err);

			const result = await shareFileWithMobile('test.txt', 'hello', 'text/plain');
			expect(result).toEqual({ status: 'failed', error: err });
		});
	});

	describe('createMobilePlatformAdapter', () => {
		it('returns HostPlatformAdapter contract', () => {
			capacitorState.isNative = true;
			capacitorState.platform = 'android';
			const adapter = createMobilePlatformAdapter();
			expect(adapter.id).toBe('mobile');
			expect(adapter.isNative).toBe(true);
			expect(adapter.platformType).toBe('android');
			expect(adapter.supportsPwaInstall).toBe(false);
			expect(adapter.shouldShowInstallGuide).toBe(false);
		});

		it('opens a configured HTTPS update URL with Capacitor AppLauncher', async () => {
			capacitorState.isNative = true;
			capacitorState.platform = 'android';
			const adapter = createMobilePlatformAdapter();
			const action = adapter.getUpdateAction?.();

			expect(action).toBeDefined();
			expect(action?.mode).toBe('external-link');
			expect(action?.canApplyInApp).toBe(false);
			expect(action?.actionLabelKey).toBe('about.update.external');

			await action?.applyUpdate({
				tagName: 'v1.1.0',
				name: 'Chronos 1.1.0',
				publishedAt: '2026-09-25',
				body: '',
				platforms: {
					android: { updateUrl: 'https://example.com/chronos.apk' }
				}
			});

			expect(mockAppLauncher.openUrl).toHaveBeenCalledWith({
				url: 'https://example.com/chronos.apk'
			});
		});

		it('does not invent an update URL when release metadata omits one', async () => {
			capacitorState.isNative = true;
			capacitorState.platform = 'android';
			const adapter = createMobilePlatformAdapter();
			const action = adapter.getUpdateAction?.();

			await expect(
				action?.applyUpdate({
					tagName: 'v1.1.0',
					name: 'Chronos 1.1.0',
					publishedAt: '2026-09-25',
					body: ''
				})
			).rejects.toThrow('当前版本没有可用的 Android 更新地址');

			expect(mockAppLauncher.openUrl).not.toHaveBeenCalled();
		});
	});
});
