import type { ClassNotificationBatch, PlatformType, TodayWidgetSnapshot } from '@chronos/core';
import {
	createWebClassNotifications,
	initWebClassNotificationLinks
} from './web-class-notifications';
import { getBootPlatformAdapter } from '$chronos-platform-adapter';
import type { Release } from '../content/releases/release';

export type PlatformUpdateMode = 'service-worker' | 'external-link' | 'native-apk';

export type HostUpdatePhase =
	| 'downloading'
	| 'installing'
	| 'restarting'
	| 'verifying'
	| 'awaiting-permission'
	| 'awaiting-confirmation'
	| 'waiting-network';
export interface HostUpdateProgress {
	phase: HostUpdatePhase;
	percent: number | null;
}
export interface NativeUpdateState {
	phase: Exclude<HostUpdatePhase, 'restarting'> | 'idle' | 'succeeded' | 'failed' | 'canceled';
	percent: number | null;
	canCancel: boolean;
	taskId?: string;
	targetVersion?: string;
	sizeBytes?: number;
	errorCode?: string;
}

export interface NativeUpdateAction {
	getState(this: void): Promise<NativeUpdateState>;
	subscribe(this: void, listener: (state: NativeUpdateState) => void): Promise<() => void>;
	continueUpdate(this: void): Promise<NativeUpdateState>;
	cancelUpdate(this: void): Promise<NativeUpdateState>;
}

export interface PlatformUpdateAction {
	readonly mode: PlatformUpdateMode;
	readonly canApplyInApp: boolean;
	readonly actionLabelKey: string;
	readonly native?: NativeUpdateAction;
	applyUpdate(
		this: void,
		release?: Release | null,
		options?: { onProgress?: (progress: HostUpdateProgress) => void }
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

export interface ClassNotificationStatus {
	readonly supported: boolean;
	readonly permission: 'prompt' | 'granted' | 'denied';
	readonly exact: boolean;
}

export interface ClassNotificationMessage extends ClassNotificationBatch {
	courses: (ClassNotificationBatch['courses'][number] & { body: string })[];
	title: string;
	body: string;
}

export interface ClassNotificationAdapter {
	readonly background: boolean;
	getStatus(this: void): Promise<ClassNotificationStatus>;
	/** Only called directly from a user interaction. */
	requestPermission(this: void): Promise<ClassNotificationStatus>;
	openSettings(this: void): Promise<void>;
	replacePlan(this: void, plan: ClassNotificationMessage[]): Promise<void>;
	sendTest(this: void, title: string, body: string): Promise<void>;
	clearData(this: void): Promise<void>;
	dispose(this: void): void;
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
	updateBackState?(canGoBack: boolean): void;
	shareFile?(
		filename: string,
		content: string | Uint8Array,
		mimeType: string
	): Promise<NativeShareResult>;
	updateTodayWidgetSnapshot?(snapshot: TodayWidgetSnapshot): Promise<void>;
	classNotifications?: ClassNotificationAdapter;
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
		classNotifications: createWebClassNotifications(),
		init: initWebClassNotificationLinks,
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
