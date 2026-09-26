import type { PlatformType } from '@chronos/core';
import { getBootPlatformAdapter } from '$chronos-platform-adapter';
import type { Release } from '../content/releases/release';
import type { SwUpdateProgress } from '../client/pwa-sw';

export type PlatformUpdateMode = 'service-worker' | 'external-link';

export interface PlatformUpdateAction {
	readonly mode: PlatformUpdateMode;
	readonly canApplyInApp: boolean;
	readonly actionLabelKey: string;
	applyUpdate(
		release?: Release | null,
		options?: { onProgress?: (progress: SwUpdateProgress) => void }
	): Promise<void>;
}

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
	getAndroidInstallationIdentity?: () => Promise<{
		packageId: string;
		version: string;
		versionCode: number;
		signingCertificateSha256: string;
	}>;
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
	getUpdateAction?(): PlatformUpdateAction;
	wrapHttpService?(
		inner: import('@chronos/core').IHttpService
	): import('@chronos/core').IHttpService;
}

export function getDefaultWebPlatform(): HostPlatformAdapter {
	return {
		id: 'web',
		isNative: false,
		platformType: 'web',
		supportsPwaInstall: true,
		shouldShowInstallGuide: true,
		getUpdateAction() {
			return {
				mode: 'service-worker',
				canApplyInApp: true,
				actionLabelKey: 'about.update.install',
				async applyUpdate(_release, options) {
					const { applyUpdateAndReload } = await import('../client/pwa-sw');
					await applyUpdateAndReload(options);
				}
			};
		}
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
