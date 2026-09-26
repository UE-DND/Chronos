import { defineConfig } from '@playwright/test';
export default defineConfig({
	testDir: './tests/browser',
	outputDir: './dist/e2e/results',
	fullyParallel: false,
	workers: 1,
	forbidOnly: Boolean(process.env.CI),
	timeout: 90_000,
	expect: { timeout: 15_000 },
	reporter: [['list'], ['html', { outputFolder: 'dist/e2e/report', open: 'never' }]],
	use: {
		baseURL: 'http://127.0.0.1:4179',
		actionTimeout: 15_000,
		browserName: 'chromium',
		locale: 'zh-CN',
		serviceWorkers: 'allow',
		trace: 'retain-on-failure',
		screenshot: 'only-on-failure'
	},
	webServer: {
		command: 'node --experimental-strip-types scripts/e2e/server.ts',
		url: 'http://127.0.0.1:4179/Chronos/',
		reuseExistingServer: false
	}
});
