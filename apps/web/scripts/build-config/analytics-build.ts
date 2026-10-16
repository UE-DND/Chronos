import type { DeployTarget } from './deploy-targets.ts';

export function analyticsEnabledForBuild(options: {
	target: DeployTarget;
	mode: string;
	firebaseConfigured: boolean;
	vercelEnvironment?: string;
	mobileReleaseOptIn?: string;
}): boolean {
	// Analytics unit tests mock the SDK and need to exercise the enabled path.
	if (options.mode === 'test') return true;
	if (!options.firebaseConfigured) return false;
	if (options.target === 'vercel') return options.vercelEnvironment === 'production';
	if (options.target === 'mobile') return options.mobileReleaseOptIn === 'true';
	return false;
}
