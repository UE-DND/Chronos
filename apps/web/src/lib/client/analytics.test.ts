import { afterEach, beforeEach, describe, expect, it, vi } from 'vite-plus/test';

const envState = vi.hoisted(() => ({
	PUBLIC_FIREBASE_API_KEY: '',
	PUBLIC_FIREBASE_APP_ID: '',
	PUBLIC_FIREBASE_AUTH_DOMAIN: '',
	PUBLIC_FIREBASE_MEASUREMENT_ID: '',
	PUBLIC_FIREBASE_MESSAGING_SENDER_ID: '',
	PUBLIC_FIREBASE_PROJECT_ID: '',
	PUBLIC_FIREBASE_STORAGE_BUCKET: ''
}));

const analyticsContext = vi.hoisted(() => ({
	profile: 'chronos-default',
	platform: 'web'
}));

const firebaseAnalytics = vi.hoisted(() => ({
	logEvent: vi.fn().mockResolvedValue(undefined),
	setEnabled: vi.fn().mockResolvedValue(undefined)
}));

const firebaseApp = vi.hoisted(() => ({
	initializeApp: vi.fn(),
	getApp: vi.fn(() => ({ name: '[DEFAULT]' })),
	getApps: vi.fn(() => [])
}));

const firebaseWebAnalytics = vi.hoisted(() => ({
	initializeAnalytics: vi.fn(),
	isSupported: vi.fn().mockResolvedValue(true)
}));

vi.mock('$app/env/public', () => ({
	get PUBLIC_FIREBASE_API_KEY() {
		return envState.PUBLIC_FIREBASE_API_KEY;
	},
	get PUBLIC_FIREBASE_APP_ID() {
		return envState.PUBLIC_FIREBASE_APP_ID;
	},
	get PUBLIC_FIREBASE_AUTH_DOMAIN() {
		return envState.PUBLIC_FIREBASE_AUTH_DOMAIN;
	},
	get PUBLIC_FIREBASE_MEASUREMENT_ID() {
		return envState.PUBLIC_FIREBASE_MEASUREMENT_ID;
	},
	get PUBLIC_FIREBASE_MESSAGING_SENDER_ID() {
		return envState.PUBLIC_FIREBASE_MESSAGING_SENDER_ID;
	},
	get PUBLIC_FIREBASE_PROJECT_ID() {
		return envState.PUBLIC_FIREBASE_PROJECT_ID;
	},
	get PUBLIC_FIREBASE_STORAGE_BUCKET() {
		return envState.PUBLIC_FIREBASE_STORAGE_BUCKET;
	}
}));

vi.mock('firebase/app', () => firebaseApp);
vi.mock('firebase/analytics', () => firebaseWebAnalytics);
vi.mock('@capacitor-firebase/analytics', () => ({ FirebaseAnalytics: firebaseAnalytics }));

vi.mock('#lib/boot/profile-registry.ts', () => ({
	resolveActiveProfile: () => ({ profileId: analyticsContext.profile })
}));

vi.mock('#lib/platform/host-platform.ts', () => ({
	getHostPlatform: () => ({ platformType: analyticsContext.platform })
}));

function configureWebFirebase() {
	Object.assign(envState, {
		PUBLIC_FIREBASE_API_KEY: 'public-api-key',
		PUBLIC_FIREBASE_APP_ID: '1:123:web:abc',
		PUBLIC_FIREBASE_AUTH_DOMAIN: 'chronos-production.firebaseapp.com',
		PUBLIC_FIREBASE_MEASUREMENT_ID: 'G-ABC123',
		PUBLIC_FIREBASE_MESSAGING_SENDER_ID: '123',
		PUBLIC_FIREBASE_PROJECT_ID: 'chronos-production',
		PUBLIC_FIREBASE_STORAGE_BUCKET: 'chronos-production.firebasestorage.app'
	});
}

describe('analytics', () => {
	beforeEach(() => {
		vi.resetModules();
		vi.clearAllMocks();
		Object.keys(envState).forEach((key) => ((envState as Record<string, string>)[key] = ''));
		analyticsContext.profile = 'chronos-default';
		analyticsContext.platform = 'web';
		vi.stubEnv('DEV', false);
		vi.stubEnv('MODE', 'production');
		firebaseApp.getApps.mockReturnValue([]);
		firebaseWebAnalytics.isSupported.mockResolvedValue(true);
	});

	afterEach(() => {
		vi.unstubAllEnvs();
	});

	it('does not initialize or send events without Firebase configuration', async () => {
		const { setAnalyticsCollectionEnabled, trackEvent } = await import('./analytics');

		expect(() => setAnalyticsCollectionEnabled(true)).not.toThrow();
		expect(() => trackEvent('onboarding_skip')).not.toThrow();
		expect(firebaseAnalytics.setEnabled).not.toHaveBeenCalled();
		expect(firebaseAnalytics.logEvent).not.toHaveBeenCalled();
	});

	it('initializes Firebase Web and enables collection when configured', async () => {
		configureWebFirebase();
		const { setAnalyticsCollectionEnabled } = await import('./analytics');

		setAnalyticsCollectionEnabled(true);

		await vi.waitFor(() => {
			expect(firebaseAnalytics.setEnabled).toHaveBeenCalledWith({ enabled: true });
		});
		expect(firebaseApp.initializeApp).toHaveBeenCalledWith(
			expect.objectContaining({
				projectId: 'chronos-production',
				measurementId: 'G-ABC123'
			})
		);
		expect(firebaseWebAnalytics.initializeAnalytics).toHaveBeenCalledWith(
			{ name: '[DEFAULT]' },
			{ config: { send_page_view: false } }
		);
	});

	it('flushes queued events with Chronos profile and platform properties', async () => {
		configureWebFirebase();
		const { setAnalyticsCollectionEnabled, trackEvent } = await import('./analytics');

		setAnalyticsCollectionEnabled(true);
		trackEvent('share_link_decode_success');

		await vi.waitFor(() => {
			expect(firebaseAnalytics.logEvent).toHaveBeenCalledWith({
				name: 'share_link_decode_success',
				params: {
					chronos_profile: 'chronos-default',
					chronos_platform: 'web'
				}
			});
		});
	});

	it('normalizes plugin event names and forces profile/platform properties', async () => {
		configureWebFirebase();
		const { setAnalyticsCollectionEnabled, captureAnalyticsEvent } = await import('./analytics');

		setAnalyticsCollectionEnabled(true);
		captureAnalyticsEvent('plugin.tool-wallpaper.pick', {
			source: 'plugin',
			bad: { nested: 'value' },
			chronos_profile: 'spoofed-profile',
			chronos_platform: 'ios'
		});

		await vi.waitFor(() => {
			expect(firebaseAnalytics.logEvent).toHaveBeenCalledWith({
				name: 'plugin_tool_wallpaper_pick',
				params: {
					source: 'plugin',
					chronos_profile: 'chronos-default',
					chronos_platform: 'web'
				}
			});
		});
	});

	it('normalizes invalid and reserved names and keys', async () => {
		const { normalizeAnalyticsName, normalizeAnalyticsProperties } = await import('./analytics');

		expect(normalizeAnalyticsName('7/plugin.event', 'event')).toBe('event_7_plugin_event');
		expect(normalizeAnalyticsName('firebase_open', 'event')).toBe('chronos_firebase_open');
		expect(normalizeAnalyticsName('session_start', 'event')).toBe('chronos_session_start');
		expect(normalizeAnalyticsName('x'.repeat(45), 'event')).toHaveLength(40);
		expect(normalizeAnalyticsProperties({ 'a.b': true, '': 1, ignored: null })).toEqual({
			a_b: true,
			param: 1
		});
	});

	it('classifies Android profile events consistently', async () => {
		analyticsContext.profile = 'chronos-cqut-offline';
		analyticsContext.platform = 'android';
		const { buildAnalyticsProperties } = await import('./analytics');

		expect(buildAnalyticsProperties({ action: 'create' })).toEqual({
			action: 'create',
			chronos_profile: 'chronos-cqut-offline',
			chronos_platform: 'android'
		});
		expect(firebaseApp.initializeApp).not.toHaveBeenCalled();
	});

	it('routes trackEvent through the bound analytics port', async () => {
		const { trackEvent, bindAnalyticsPort } = await import('./analytics');
		const track = vi.fn();
		bindAnalyticsPort({ track });

		trackEvent('course_save', { source: 'test' });

		expect(track).toHaveBeenCalledWith('course_save', { source: 'test' });
		expect(firebaseAnalytics.logEvent).not.toHaveBeenCalled();
	});

	it('does not initialize or queue events until collection is enabled', async () => {
		configureWebFirebase();
		const { captureAnalyticsEvent, setAnalyticsCollectionEnabled } = await import('./analytics');

		captureAnalyticsEvent('before_consent');
		expect(firebaseAnalytics.setEnabled).not.toHaveBeenCalled();

		setAnalyticsCollectionEnabled(true);
		await vi.waitFor(() => {
			expect(firebaseAnalytics.setEnabled).toHaveBeenCalledWith({ enabled: true });
		});
		expect(firebaseAnalytics.logEvent).not.toHaveBeenCalledWith(
			expect.objectContaining({ name: 'before_consent' })
		);
	});

	it('stops collection and drops queued and future events when consent is withdrawn', async () => {
		configureWebFirebase();
		const { captureAnalyticsEvent, setAnalyticsCollectionEnabled } = await import('./analytics');

		setAnalyticsCollectionEnabled(true);
		captureAnalyticsEvent('queued_event');
		setAnalyticsCollectionEnabled(false);

		await vi.waitFor(() => {
			expect(firebaseAnalytics.setEnabled).toHaveBeenLastCalledWith({ enabled: false });
		});
		captureAnalyticsEvent('after_opt_out');
		expect(firebaseAnalytics.logEvent).not.toHaveBeenCalled();
	});

	it('keeps collection disabled in development builds', async () => {
		configureWebFirebase();
		vi.stubEnv('DEV', true);
		const { setAnalyticsCollectionEnabled } = await import('./analytics');

		setAnalyticsCollectionEnabled(true);
		await Promise.resolve();
		expect(firebaseAnalytics.setEnabled).not.toHaveBeenCalled();
		expect(firebaseAnalytics.logEvent).not.toHaveBeenCalled();
	});

	it('keeps collection disabled in test mode even when a Firebase project is configured', async () => {
		configureWebFirebase();
		vi.stubEnv('MODE', 'test');
		const { setAnalyticsCollectionEnabled } = await import('./analytics');

		setAnalyticsCollectionEnabled(true);
		await Promise.resolve();
		expect(firebaseAnalytics.setEnabled).not.toHaveBeenCalled();
		expect(firebaseAnalytics.logEvent).not.toHaveBeenCalled();
	});
});
