import { defineEnvVars } from '@sveltejs/kit/env';

// Optional host settings retain their empty default for builds without analytics or native sharing.
export const variables = defineEnvVars({
	PUBLIC_CHRONOS_SHARE_IMPORT_URL: { public: true, schema: (input) => input ?? '' },
	PUBLIC_POSTHOG_KEY: { public: true, schema: (input) => input ?? '' },
	PUBLIC_POSTHOG_HOST: { public: true, schema: (input) => input ?? '' }
});
