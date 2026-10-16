import { describe, expect, it } from 'vite-plus/test';
import { analyticsEnabledForBuild } from './analytics-build.ts';

describe('analytics build gate', () => {
	it('enables configured official production Web builds only', () => {
		expect(
			analyticsEnabledForBuild({
				target: 'vercel',
				mode: 'production',
				firebaseConfigured: true,
				vercelEnvironment: 'production'
			})
		).toBe(true);
		expect(
			analyticsEnabledForBuild({
				target: 'vercel',
				mode: 'production',
				firebaseConfigured: true,
				vercelEnvironment: 'preview'
			})
		).toBe(false);
	});

	it('requires explicit release opt-in for configured mobile builds', () => {
		const base = { target: 'mobile' as const, mode: 'production', firebaseConfigured: true };
		expect(analyticsEnabledForBuild(base)).toBe(false);
		expect(analyticsEnabledForBuild({ ...base, mobileReleaseOptIn: 'true' })).toBe(true);
	});

	it('keeps unconfigured and static Pages builds disabled', () => {
		expect(
			analyticsEnabledForBuild({
				target: 'vercel',
				mode: 'production',
				firebaseConfigured: false,
				vercelEnvironment: 'production'
			})
		).toBe(false);
		expect(
			analyticsEnabledForBuild({
				target: 'pages',
				mode: 'production',
				firebaseConfigured: true
			})
		).toBe(false);
	});
});
