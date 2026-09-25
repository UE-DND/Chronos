import type { PlatformType } from '@chronos/core';
import { getBootPlatformAdapter } from '$chronos-platform-adapter';

export type NativeShareResult =
	| { status: 'shared' }
	| { status: 'canceled' }
	| { status: 'failed'; error?: unknown };

export interface HostPlatformInitCallbacks {
	onSystemBack?: () => 'consumed' | 'exit';
	onDeepLink?: (url: URL) => void;
	onAppResume?: () => void;
}

export interface HostPlatformAdapter {
	readonly id: 'web' | 'mobile';
	readonly isNative: boolean;
	readonly platformType: PlatformType;
	readonly supportsPwaInstall: boolean;
	readonly shouldShowInstallGuide: boolean;
	init?(callbacks?: HostPlatformInitCallbacks): () => void;
	syncTheme?(isDark: boolean): void;
	hideBootSplash?(): void;
	shareFile?(
		filename: string,
		content: string | Uint8Array,
		mimeType: string
	): Promise<NativeShareResult>;
}

export function getDefaultWebPlatform(): HostPlatformAdapter {
	return {
		id: 'web',
		isNative: false,
		platformType: 'web',
		supportsPwaInstall: true,
		shouldShowInstallGuide: true
	};
}

let currentPlatform: HostPlatformAdapter | null = null;

export function getHostPlatform(): HostPlatformAdapter {
	return (currentPlatform ??= getBootPlatformAdapter());
}

export function setHostPlatform(platform: HostPlatformAdapter): void {
	currentPlatform = platform;
}

export function resetHostPlatform(): void {
	currentPlatform = null;
}
