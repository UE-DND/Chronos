import { afterEach, beforeEach, describe, expect, it, vi } from 'vite-plus/test';

const envState = vi.hoisted(() => ({
	PUBLIC_POSTHOG_KEY: '',
	PUBLIC_POSTHOG_HOST: 'https://eu.i.posthog.com'
}));

const analyticsContext = vi.hoisted(() => ({
	profile: 'chronos-default',
	platform: 'web'
}));

const posthog = vi.hoisted(() => ({
	init: vi.fn(),
	capture: vi.fn()
}));

vi.mock('$env/dynamic/public', () => ({
	env: envState
}));

vi.mock('$lib/boot/profile-registry', () => ({
	resolveActiveProfile: () => ({ profileId: analyticsContext.profile })
}));

vi.mock('$lib/platform/host-platform', () => ({
	getHostPlatform: () => ({ platformType: analyticsContext.platform })
}));

vi.mock('posthog-js', () => ({
	default: posthog
}));

describe('analytics', () => {
	beforeEach(() => {
		vi.resetModules();
		vi.clearAllMocks();
		envState.PUBLIC_POSTHOG_KEY = '';
		analyticsContext.profile = 'chronos-default';
		analyticsContext.platform = 'web';
		vi.stubEnv('DEV', false);
	});

	afterEach(() => {
		vi.unstubAllEnvs();
	});

	it('does not throw and no-ops without a key', async () => {
		const { initAnalytics, trackEvent } = await import('./analytics');

		expect(() => initAnalytics()).not.toThrow();
		expect(() => trackEvent('onboarding_skip')).not.toThrow();
		expect(posthog.init).not.toHaveBeenCalled();
		expect(posthog.capture).not.toHaveBeenCalled();
	});

	it('inits posthog with privacy-first config', async () => {
		envState.PUBLIC_POSTHOG_KEY = 'phc_test';
		const { initAnalytics } = await import('./analytics');

		initAnalytics();

		await vi.waitFor(() => {
			expect(posthog.init).toHaveBeenCalled();
		});
		expect(posthog.init).toHaveBeenCalledWith(
			'phc_test',
			expect.objectContaining({
				autocapture: false,
				disable_session_recording: true,
				capture_performance: { web_vitals: false }
			})
		);
	});

	it('flushes events captured before posthog finishes loading', async () => {
		envState.PUBLIC_POSTHOG_KEY = 'phc_test';
		const { initAnalytics, trackEvent } = await import('./analytics');

		initAnalytics();
		trackEvent('share_link_decode_success');

		await vi.waitFor(() => {
			expect(posthog.capture).toHaveBeenCalledWith('share_link_decode_success', {
				chronos_profile: 'chronos-default',
				chronos_platform: 'web'
			});
		});
	});

	it('captureAnalyticsEvent accepts plugin-scoped event names', async () => {
		envState.PUBLIC_POSTHOG_KEY = 'phc_test';
		const { initAnalytics, captureAnalyticsEvent } = await import('./analytics');

		initAnalytics();
		captureAnalyticsEvent('plugin.tool-wallpaper.pick', {
			source: 'plugin',
			chronos_profile: 'spoofed-profile',
			chronos_platform: 'ios'
		});

		await vi.waitFor(() => {
			expect(posthog.capture).toHaveBeenCalledWith('plugin.tool-wallpaper.pick', {
				source: 'plugin',
				chronos_profile: 'chronos-default',
				chronos_platform: 'web'
			});
		});
	});

	it('classifies Android profile events consistently', async () => {
		envState.PUBLIC_POSTHOG_KEY = 'phc_test';
		analyticsContext.profile = 'chronos-cqut-offline';
		analyticsContext.platform = 'android';
		const { initAnalytics, trackEvent } = await import('./analytics');

		initAnalytics();
		trackEvent('course_save', { action: 'create' });

		await vi.waitFor(() => {
			expect(posthog.capture).toHaveBeenCalledWith('course_save', {
				action: 'create',
				chronos_profile: 'chronos-cqut-offline',
				chronos_platform: 'android'
			});
		});
	});

	it('routes trackEvent through bound analytics port', async () => {
		const { trackEvent, bindAnalyticsPort } = await import('./analytics');
		const track = vi.fn();
		bindAnalyticsPort({ track });

		trackEvent('course_save', { source: 'test' });

		expect(track).toHaveBeenCalledWith('course_save', { source: 'test' });
		expect(posthog.capture).not.toHaveBeenCalled();
	});
});
