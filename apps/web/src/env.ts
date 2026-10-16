import { defineEnvVars } from '@sveltejs/kit/env';

// Optional host settings retain their empty default for builds without analytics or native sharing.
export const variables = defineEnvVars({
	PUBLIC_CHRONOS_SHARE_IMPORT_URL: { public: true, schema: (input) => input ?? '' },
	PUBLIC_FIREBASE_API_KEY: { public: true, schema: (input) => input ?? '' },
	PUBLIC_FIREBASE_APP_ID: { public: true, schema: (input) => input ?? '' },
	PUBLIC_FIREBASE_AUTH_DOMAIN: { public: true, schema: (input) => input ?? '' },
	PUBLIC_FIREBASE_MEASUREMENT_ID: { public: true, schema: (input) => input ?? '' },
	PUBLIC_FIREBASE_MESSAGING_SENDER_ID: { public: true, schema: (input) => input ?? '' },
	PUBLIC_FIREBASE_PROJECT_ID: { public: true, schema: (input) => input ?? '' },
	PUBLIC_FIREBASE_STORAGE_BUCKET: { public: true, schema: (input) => input ?? '' }
});
