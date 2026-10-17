import {
	PUBLIC_FIREBASE_API_KEY,
	PUBLIC_FIREBASE_APP_ID,
	PUBLIC_FIREBASE_AUTH_DOMAIN,
	PUBLIC_FIREBASE_MEASUREMENT_ID,
	PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
	PUBLIC_FIREBASE_PROJECT_ID,
	PUBLIC_FIREBASE_STORAGE_BUCKET
} from '$app/env/public';
import type { IAnalyticsService } from '@chronos/core';
import { resolveActiveProfile } from '#lib/boot/profile-registry.ts';
import { getHostPlatform } from '#lib/platform/host-platform.ts';

/** Host-owned analytics events (apps/web UI, PWA, settings). Plugin events use `trackPluginAnalytics`. */
export type HostAnalyticsEvent =
	| 'wallpaper_pick'
	| 'wallpaper_crop_cancel'
	| 'wallpaper_crop_confirm'
	| 'wallpaper_clear'
	| 'wallpaper_colors_change'
	| 'wallpaper_mask_change'
	| 'wallpaper_source_change'
	| 'shell_tab_scroll_top'
	| 'onboarding_step_next'
	| 'onboarding_step_back'
	| 'onboarding_skip'
	| 'onboarding_legal_continue'
	| 'onboarding_start_import'
	| 'onboarding_layout_selected'
	| 'empty_import_click'
	| 'empty_import_guide_open'
	| 'timetable_week_swipe'
	| 'timetable_week_scrub'
	| 'timetable_week_jump_current'
	| 'course_detail_open'
	| 'course_editor_open'
	| 'course_save'
	| 'course_delete'
	| 'import_source_select'
	| 'share_link_decode_success'
	| 'share_link_decode_fail'
	| 'import_mode_select'
	| 'import_confirm'
	| 'export_copy_link'
	| 'export_slot_execute_attempt'
	| 'export_slot_execute_success'
	| 'export_slot_execute_fail'
	| 'settings_theme_change'
	| 'settings_color_scheme_change'
	| 'settings_layout_change'
	| 'settings_capsule_corner_change'
	| 'settings_locale_change'
	| 'settings_haptic_feedback_change'
	| 'settings_period_highlight_change'
	| 'settings_reduce_motion_change'
	| 'settings_prepare_reminder_change'
	| 'timetable_switch'
	| 'timetable_delete'
	| 'timetable_overlap_expand'
	| 'timetable_course_reorder'
	| 'timetable_course_delete_week'
	| 'timetable_details_save'
	| 'timetable_details_reset'
	| 'pwa_install_prompt_show'
	| 'pwa_install_accept'
	| 'pwa_install_snooze'
	| 'pwa_install_dismiss'
	| 'pwa_install_cta_click'
	| 'pwa_update_apply'
	| 'pwa_update_install_fail'
	| 'android_update_start'
	| 'android_update_confirmation'
	| 'android_update_result'
	| 'external_update_open'
	| 'update_check_attempt'
	| 'update_check_success'
	| 'update_check_fail'
	| 'release_detail_open'
	| 'about_clear_all_data'
	| 'developer_easter_egg_open';

type AnalyticsProperties = Record<string, string | number | boolean>;

interface AnalyticsClient {
	logEvent(name: string, params?: AnalyticsProperties): Promise<void> | void;
	setEnabled(enabled: boolean): Promise<void> | void;
}

let client: AnalyticsClient | null = null;
let pending: Array<[string, AnalyticsProperties | undefined]> | null = null;
let analyticsPort: IAnalyticsService | null = null;
let initializing: Promise<void> | null = null;
let collectionEnabled = false;

const RESERVED_EVENT_PREFIXES = ['firebase_', 'google_', 'ga_'];
const RESERVED_EVENT_NAMES = new Set([
	'ad_activeview',
	'app_clear_data',
	'app_exception',
	'app_remove',
	'app_store_refund',
	'app_update',
	'app_upgrade',
	'dynamic_link_app_open',
	'dynamic_link_app_update',
	'error',
	'firebase_campaign',
	'first_open',
	'first_visit',
	'in_app_purchase',
	'notification_dismiss',
	'notification_foreground',
	'notification_open',
	'notification_receive',
	'notification_send',
	'os_update',
	'screen_view',
	'session_start',
	'user_engagement'
]);
const GA_NAME_PATTERN = /[^A-Za-z0-9_]+/g;

export function normalizeAnalyticsName(value: string, fallback: string): string {
	let normalized = value.replace(GA_NAME_PATTERN, '_').replace(/^_+|_+$/g, '');
	if (!normalized) normalized = fallback;
	if (!/^[A-Za-z]/.test(normalized)) normalized = `event_${normalized}`;
	const lowercase = normalized.toLowerCase();
	if (
		RESERVED_EVENT_PREFIXES.some((prefix) => lowercase.startsWith(prefix)) ||
		RESERVED_EVENT_NAMES.has(lowercase)
	) {
		normalized = `chronos_${normalized}`;
	}
	return normalized.slice(0, 40);
}

export function normalizeAnalyticsProperties(
	properties?: Record<string, unknown>
): AnalyticsProperties {
	const normalized: AnalyticsProperties = {};
	for (const [key, value] of Object.entries(properties ?? {})) {
		if (
			(typeof value !== 'string' && typeof value !== 'number' && typeof value !== 'boolean') ||
			(typeof value === 'number' && !Number.isFinite(value)) ||
			Object.keys(normalized).length >= 23
		)
			continue;
		const normalizedKey = normalizeAnalyticsName(key, 'param');
		if (normalizedKey === 'chronos_profile' || normalizedKey === 'chronos_platform') continue;
		normalized[normalizedKey] = typeof value === 'string' ? value.slice(0, 100) : value;
	}
	return normalized;
}

function hasFirebaseWebConfig(): boolean {
	return Boolean(
		PUBLIC_FIREBASE_API_KEY?.trim() &&
		PUBLIC_FIREBASE_APP_ID?.trim() &&
		PUBLIC_FIREBASE_AUTH_DOMAIN?.trim() &&
		PUBLIC_FIREBASE_MEASUREMENT_ID?.trim() &&
		PUBLIC_FIREBASE_MESSAGING_SENDER_ID?.trim() &&
		PUBLIC_FIREBASE_PROJECT_ID?.trim()
	);
}

function isAndroidHost(): boolean {
	return getHostPlatform().platformType === 'android';
}

export function bindAnalyticsPort(service: IAnalyticsService): void {
	analyticsPort = service;
}

function canInitializeAnalytics(): boolean {
	return (
		!import.meta.env.DEV &&
		import.meta.env.MODE !== 'test' &&
		__ANALYTICS_ENABLED__ &&
		!(isAndroidHost() && !__FIREBASE_ANDROID_CONFIGURED__) &&
		(isAndroidHost() || hasFirebaseWebConfig())
	);
}

/** Applies the persisted user choice and starts or stops collection immediately. */
export function setAnalyticsCollectionEnabled(enabled: boolean): void {
	const changed = collectionEnabled !== enabled;
	if (!enabled) {
		collectionEnabled = false;
		pending = null;
		if (client) void client.setEnabled(false);
		return;
	}
	if (!canInitializeAnalytics()) {
		collectionEnabled = false;
		pending = null;
		return;
	}

	collectionEnabled = true;
	if (client) {
		if (changed) void client.setEnabled(true);
		return;
	}
	if (initializing) {
		pending ??= [];
		return;
	}
	initAnalytics();
}

function initAnalytics() {
	if (!collectionEnabled || !canInitializeAnalytics() || client || initializing) return;
	pending = [];
	initializing = (async () => {
		if (isAndroidHost()) {
			const adapter = getHostPlatform().analytics;
			if (adapter) {
				client = {
					logEvent(name, params) {
						return adapter.logEvent(name, params);
					},
					setEnabled(enabled) {
						return adapter.setEnabled(enabled);
					}
				};
			}
		} else {
			const { initializeApp, getApps, getApp } = await import('firebase/app');
			if (getApps().length === 0) {
				initializeApp({
					apiKey: PUBLIC_FIREBASE_API_KEY,
					authDomain: PUBLIC_FIREBASE_AUTH_DOMAIN,
					projectId: PUBLIC_FIREBASE_PROJECT_ID,
					storageBucket: PUBLIC_FIREBASE_STORAGE_BUCKET || undefined,
					messagingSenderId: PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
					appId: PUBLIC_FIREBASE_APP_ID,
					measurementId: PUBLIC_FIREBASE_MEASUREMENT_ID
				});
			}
			const { initializeAnalytics, isSupported, logEvent, setAnalyticsCollectionEnabled } =
				await import('firebase/analytics');
			if (!(await isSupported())) {
				pending = null;
				return;
			}
			const analyticsInstance = initializeAnalytics(getApp(), {
				config: { send_page_view: false }
			});
			client = {
				logEvent(name, params) {
					logEvent(analyticsInstance, name, params);
				},
				setEnabled(enabled) {
					setAnalyticsCollectionEnabled(analyticsInstance, enabled);
				}
			};
		}
		if (client) {
			await client.setEnabled(collectionEnabled);
			if (!collectionEnabled) {
				pending = null;
				await client.setEnabled(false);
				return;
			}
			const queued = pending;
			pending = null;
			for (const [name, properties] of queued ?? []) {
				logWithClient(client, name, properties);
			}
		}
	})()
		.catch(() => {
			pending = null;
		})
		.finally(() => {
			initializing = null;
		});
}

export function buildAnalyticsProperties(
	properties?: Record<string, unknown>
): AnalyticsProperties {
	return {
		...normalizeAnalyticsProperties(properties),
		chronos_profile: resolveActiveProfile().profileId,
		chronos_platform: isAndroidHost() ? 'android' : 'web'
	};
}

function logWithClient(
	activeClient: AnalyticsClient,
	name: string,
	properties?: AnalyticsProperties
) {
	void activeClient.logEvent(
		normalizeAnalyticsName(name, 'event'),
		buildAnalyticsProperties(properties)
	);
}

/** Firebase Analytics capture — accepts host and plugin event names. */
export function captureAnalyticsEvent(name: string, properties?: Record<string, unknown>) {
	if (!collectionEnabled) return;
	if (client) {
		logWithClient(client, name, properties as AnalyticsProperties | undefined);
		return;
	}
	pending?.push([name, normalizeAnalyticsProperties(properties)]);
}

/** UI telemetry facade — routes through `IAnalyticsService` when the engine port is bound. */
export function trackEvent(
	name: HostAnalyticsEvent,
	properties?: Record<string, string | number | boolean>
) {
	if (analyticsPort) {
		analyticsPort.track(name, properties);
		return;
	}
	captureAnalyticsEvent(name, properties);
}
