/** Run with vpx packages/ui-kit/tests/browser/verify-mountable.ts (requires installed Chromium). */
import { mkdtemp, writeFile, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { createServer } from 'vite-plus';
import { svelte } from '@sveltejs/vite-plugin-svelte';
import { chromium, expect, type Browser } from '@playwright/test';

declare global {
	interface Window {
		__chronosPluginBoundaryQa: {
			show(fail: boolean, kind?: string): void;
			change(fail: boolean): void;
			unmount(): void;
		};
	}
}

const repository = fileURLToPath(new URL('../../../../', import.meta.url));
const fixture = fileURLToPath(new URL('./FailingPluginScreen.svelte', import.meta.url));
const directory = await mkdtemp(join(tmpdir(), 'chronos-plugin-boundary-'));
const sourceUrl = (path: string) => `/@fs${path.replaceAll('\\', '/')}`;
await writeFile(
	join(directory, 'index.html'),
	'<div id="app"></div><script type="module" src="/main.js"></script>'
);
await writeFile(
	join(directory, 'main.js'),
	`
import { mountableSvelteComponent } from ${JSON.stringify(sourceUrl(join(repository, 'packages/ui-kit/src/plugin-screen/mountable-svelte.ts')))};
import TestComponent from ${JSON.stringify(sourceUrl(fixture))};
const controller = { translatePlugin: (_plugin, key) => ({ 'pluginScreen.failed': 'Plugin screen failed to load', 'pluginScreen.retry': 'Reload' })[key] };
let kind = 'effect';
let handle;
window.__chronosPluginBoundaryQa = {
  show(fail, nextKind = 'effect') {
    handle?.unmount();
    kind = nextKind;
    handle = mountableSvelteComponent(TestComponent).mount(document.querySelector('#app'), { fail, kind, controller });
  },
  change: (fail) => handle.update({ fail, kind, controller }),
  unmount: () => handle.unmount()
};
window.__chronosPluginBoundaryQa.show(false);
`
);
const server = await createServer({
	configFile: false,
	root: directory,
	logLevel: 'silent',
	plugins: [svelte({ configFile: false, compilerOptions: { runes: true } })],
	resolve: {
		alias: [{ find: '@chronos/core', replacement: join(repository, 'packages/core/src/index.ts') }],
		dedupe: ['svelte']
	},
	server: { host: '127.0.0.1', port: 0, fs: { allow: [directory, repository] } },
	optimizeDeps: { noDiscovery: true }
});
let browser: Browser | undefined;
try {
	await server.listen();
	browser = await chromium.launch({ headless: true });
	const page = await browser.newPage();
	const unhandledErrors: string[] = [];
	const reportedErrors: string[] = [];
	page.on('pageerror', (error) => unhandledErrors.push(error.message));
	page.on('console', (message) => {
		if (message.type() === 'error') reportedErrors.push(message.text());
	});
	await page.goto(server.resolvedUrls!.local[0]!);
	await expect(page.getByText('Course content')).toBeVisible();
	await page.evaluate(() => window.__chronosPluginBoundaryQa.change(true));
	await expect(page.getByText('Plugin screen failed to load')).toBeVisible();
	await expect(page.getByText('Course content')).toHaveCount(0);
	await page.evaluate(() => window.__chronosPluginBoundaryQa.change(false));
	await expect(page.getByText('Plugin screen failed to load')).toBeVisible();
	await page.getByRole('button', { name: 'Reload' }).click();
	await expect(page.getByText('Course content')).toBeVisible();
	for (const kind of ['effect', 'render']) {
		await page.evaluate((kind) => window.__chronosPluginBoundaryQa.show(true, kind), kind);
		await expect(page.getByText('Plugin screen failed to load')).toBeVisible();
		await page.evaluate(() => window.__chronosPluginBoundaryQa.change(false));
		await page.getByRole('button', { name: 'Reload' }).click();
		await expect(page.getByText('Course content')).toBeVisible();
	}
	await page.evaluate(() => window.__chronosPluginBoundaryQa.unmount());
	await expect(page.getByText('Course content')).toHaveCount(0);
	expect(unhandledErrors).toEqual([]);
	expect(
		reportedErrors.filter((message) => message.includes('[MountableSvelteHost] render failed:'))
	).toHaveLength(3);
	console.log('Plugin render/effect failure, stopped subtree, explicit reset and unmount: passed');
} finally {
	await browser?.close();
	await server.close();
	await rm(directory, { recursive: true, force: true });
}
