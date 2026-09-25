import { Capacitor } from '@capacitor/core';
import { Haptics, ImpactStyle, NotificationType } from '@capacitor/haptics';
import { StatusBar, Style } from '@capacitor/status-bar';
import { App } from '@capacitor/app';
import { SplashScreen } from '@capacitor/splash-screen';
import { Share } from '@capacitor/share';
import { AppLauncher } from '@capacitor/app-launcher';
import { Filesystem, Directory, Encoding } from '@capacitor/filesystem';
import type { PluginListenerHandle } from '@capacitor/core';
import type {
	NativeHostBridge,
	NativeHostCapability,
	NativeHapticImpactStyle,
	NativeHapticNotificationType,
	PlatformType
} from '@chronos/core';
import { CHRONOS_NATIVE_BRIDGE_KEY } from '@chronos/ui-kit';
import type {
	HostPlatformAdapter,
	HostPlatformInitCallbacks,
	NativeShareResult,
	PlatformUpdateAction
} from '../../web/src/lib/platform/host-platform';

export function isCapacitorNative(): boolean {
	if (typeof window === 'undefined') return false;
	try {
		return Capacitor.isNativePlatform();
	} catch {
		return false;
	}
}

export function resolvePlatformType(): PlatformType {
	if (!isCapacitorNative()) return 'web';
	return Capacitor.getPlatform() === 'android' ? 'android' : 'web';
}

const IMPACT_STYLE_MAP: Record<NativeHapticImpactStyle, ImpactStyle> = {
	light: ImpactStyle.Light,
	medium: ImpactStyle.Medium,
	heavy: ImpactStyle.Heavy
};

const NOTIFICATION_TYPE_MAP: Record<NativeHapticNotificationType, NotificationType> = {
	success: NotificationType.Success,
	warning: NotificationType.Warning,
	error: NotificationType.Error
};

async function handleHapticCall(method: string, params?: unknown): Promise<void> {
	if (!Capacitor.isPluginAvailable('Haptics')) return;

	if (method === 'impact') {
		const style = (params as { style?: NativeHapticImpactStyle })?.style ?? 'medium';
		await Haptics.impact({ style: IMPACT_STYLE_MAP[style] ?? ImpactStyle.Medium });
	} else if (method === 'notification') {
		const type = (params as { type?: NativeHapticNotificationType })?.type ?? 'success';
		await Haptics.notification({ type: NOTIFICATION_TYPE_MAP[type] ?? NotificationType.Success });
	} else if (method === 'selection') {
		await Haptics.selectionStart();
		await Haptics.selectionChanged();
	} else {
		throw new Error(`Unsupported haptic method: "${method}"`);
	}
}

export function createCapacitorNativeBridge(): NativeHostBridge {
	return {
		async callNative<T = unknown, R = unknown>(
			capability: NativeHostCapability,
			method: string,
			params?: T
		): Promise<R> {
			if (capability === 'haptic') {
				await handleHapticCall(method, params);
				return undefined as R;
			}
			throw new Error(`Unsupported native capability: "${capability}" (method: "${method}")`);
		}
	};
}

export function initMobilePlatform(callbacks?: HostPlatformInitCallbacks): () => void {
	if (typeof window === 'undefined' || !isCapacitorNative()) return () => {};

	// 1. Inject NativeHostBridge onto window for @chronos/ui-kit
	const bridge = createCapacitorNativeBridge();
	(window as unknown as Record<string, unknown>)[CHRONOS_NATIVE_BRIDGE_KEY] = bridge;

	// 2. Request persistent storage for WebView IndexedDB
	if (typeof navigator !== 'undefined' && navigator.storage?.persist) {
		void navigator.storage.persist().catch(() => {});
	}

	let disposed = false;
	const activeHandles: PluginListenerHandle[] = [];

	function trackListener(promise: Promise<PluginListenerHandle>): void {
		void promise
			.then((handle) => {
				if (disposed) {
					void handle.remove();
				} else {
					activeHandles.push(handle);
				}
			})
			.catch(() => {
				// Ignore listener attach errors on unsupported platforms
			});
	}

	if (Capacitor.isPluginAvailable('App')) {
		// Android Back Button listener
		trackListener(
			App.addListener('backButton', () => {
				const result = callbacks?.onSystemBack ? callbacks.onSystemBack() : 'exit';
				if (result === 'exit') {
					void App.exitApp();
				}
			})
		);

		// Deep links listener
		if (callbacks?.onDeepLink) {
			trackListener(
				App.addListener('appUrlOpen', (event) => {
					try {
						const url = new URL(event.url);
						callbacks.onDeepLink?.(url);
					} catch {
						// Ignore invalid deep link URLs
					}
				})
			);
		}

		// App state resume listener
		if (callbacks?.onAppResume) {
			trackListener(
				App.addListener('appStateChange', ({ isActive }) => {
					if (isActive) {
						callbacks.onAppResume?.();
					}
				})
			);
		}
	}

	return () => {
		disposed = true;
		for (const handle of activeHandles) {
			void handle.remove();
		}
		activeHandles.length = 0;
		Reflect.deleteProperty(window as object, CHRONOS_NATIVE_BRIDGE_KEY);
	};
}

export async function syncMobileStatusBarStyle(isDark: boolean): Promise<void> {
	if (!isCapacitorNative() || !Capacitor.isPluginAvailable('StatusBar')) return;
	try {
		await StatusBar.setStyle({
			style: isDark ? Style.Dark : Style.Light
		});
		if (Capacitor.getPlatform() === 'android') {
			await StatusBar.setOverlaysWebView({ overlay: true });
			await StatusBar.setBackgroundColor({ color: '#00000000' });
		}
	} catch {
		// Ignore status bar sync failures
	}
}

export async function hideMobileSplashScreen(): Promise<void> {
	if (!isCapacitorNative() || !Capacitor.isPluginAvailable('SplashScreen')) return;
	try {
		await SplashScreen.hide();
	} catch {
		// Ignore splash screen hide failures
	}
}

export async function shareFileWithMobile(
	filename: string,
	content: string | Uint8Array,
	_mimeType: string
): Promise<NativeShareResult> {
	if (!isCapacitorNative() || !Capacitor.isPluginAvailable('Share')) {
		return { status: 'failed', error: new Error('Share plugin not available') };
	}
	try {
		let data: string;
		let encoding: Encoding | undefined;
		if (typeof content === 'string') {
			data = content;
			encoding = Encoding.UTF8;
		} else {
			let binary = '';
			const len = content.byteLength;
			for (let i = 0; i < len; i++) {
				binary += String.fromCharCode(content[i]);
			}
			data = btoa(binary);
		}

		const fileResult = await Filesystem.writeFile({
			path: filename,
			data,
			directory: Directory.Cache,
			...(encoding ? { encoding } : {})
		});

		await Share.share({
			title: filename,
			url: fileResult.uri,
			dialogTitle: filename
		});

		return { status: 'shared' };
	} catch (error: unknown) {
		const message =
			error instanceof Error ? error.message.toLowerCase() : String(error).toLowerCase();
		if (message.includes('cancel') || message.includes('abort') || message.includes('dismiss')) {
			return { status: 'canceled' };
		}
		return { status: 'failed', error };
	}
}

export async function openMobileUpdateUrl(targetUrl: string): Promise<void> {
	const url = new URL(targetUrl);
	if (url.protocol !== 'https:') throw new Error('更新地址必须使用 HTTPS');
	await AppLauncher.openUrl({ url: url.toString() });
}

export function createMobilePlatformAdapter(): HostPlatformAdapter {
	const isNative = isCapacitorNative();
	const platformType = resolvePlatformType();

	return {
		id: 'mobile',
		isNative,
		platformType,
		supportsPwaInstall: false,
		shouldShowInstallGuide: false,
		init(callbacks) {
			return initMobilePlatform(callbacks);
		},
		syncTheme(isDark: boolean) {
			void syncMobileStatusBarStyle(isDark);
		},
		hideBootSplash() {
			void hideMobileSplashScreen();
		},
		shareFile(filename: string, content: string | Uint8Array, mimeType: string) {
			return shareFileWithMobile(filename, content, mimeType);
		},
		getUpdateAction(): PlatformUpdateAction {
			return {
				mode: 'external-link',
				canApplyInApp: false,
				actionLabelKey: 'about.update.external',
				async applyUpdate(release) {
					const targetUrl = release?.platforms?.android?.updateUrl;
					if (!targetUrl) throw new Error('当前版本没有可用的 Android 更新地址');
					await openMobileUpdateUrl(targetUrl);
				}
			};
		}
	};
}

export function getBootPlatformAdapter(): HostPlatformAdapter {
	return createMobilePlatformAdapter();
}
