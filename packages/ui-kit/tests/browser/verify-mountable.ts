/** Run with vpx packages/ui-kit/tests/browser/verify-mountable.ts (requires installed Chromium). */
import { mkdtemp, writeFile, rm, symlink } from 'node:fs/promises';
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
		__chronosPluginUiQa: {
			show(defer?: boolean): Promise<void>;
			accept(): void;
			setLocale(locale: string): void;
			closeParent(): void;
			uninstall(): Promise<void>;
			activeOverlays(): string[];
			unmount(): Promise<void>;
		};
	}
}

const repository = fileURLToPath(new URL('../../../../', import.meta.url));
const fixture = fileURLToPath(new URL('./FailingPluginScreen.svelte', import.meta.url));
const directory = await mkdtemp(join(tmpdir(), 'chronos-plugin-boundary-'));
await symlink(join(repository, 'node_modules'), join(directory, 'node_modules'), 'dir');
const sourceUrl = (path: string) => `/@fs${path.replaceAll('\\', '/')}`;
await writeFile(
	join(directory, 'index.html'),
	'<div id="app"></div><div id="boundary-app"></div><script type="module" src="/main.js"></script>'
);
await writeFile(
	join(directory, 'main.js'),
	`
import { mountableSvelteComponent } from ${JSON.stringify(sourceUrl(join(repository, 'packages/ui-kit/src/plugin-screen/mountable-svelte.ts')))};
import TestComponent from ${JSON.stringify(sourceUrl(fixture))};
import BoundaryPluginScreen from ${JSON.stringify(sourceUrl(join(repository, 'packages/ui-kit/tests/browser/BoundaryPluginScreen.svelte')))};
import PluginBoundaryHost from ${JSON.stringify(sourceUrl(join(repository, 'packages/ui-kit/tests/browser/PluginBoundaryHost.svelte')))};
import { ChronosEngine, DEFAULT_USER_PREFERENCES } from ${JSON.stringify(sourceUrl(join(repository, 'packages/core/src/index.ts')))};
import { ReactiveChronosController } from ${JSON.stringify(sourceUrl(join(repository, 'packages/ui-kit/src/reactivity/engine-controller.svelte.ts')))};
import { createHistoryOverlaySync } from ${JSON.stringify(sourceUrl(join(repository, 'packages/ui-kit/src/overlay/history-overlay.ts')))};
import { mount, unmount } from 'svelte';
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
const data = new Map();
const engine = new ChronosEngine({
  presetI18nCatalogs: [{ pluginId: 'host-ui', messages: Object.fromEntries(['en', 'failure'].map((locale) => [locale, {
    'pluginScreen.failed': 'Plugin screen failed to load', 'pluginScreen.retry': 'Reload'
  }])) }],
  env: {
  platform: 'web',
  http: { request: async () => { throw new Error('Unexpected fixture HTTP request'); } },
  storage: {
    getTimetable: async () => null, listTimetables: async () => [],
    saveTimetable: async () => {}, deleteTimetable: async () => {},
    getActiveTimetableId: async () => null, setActiveTimetableId: async () => {},
    queryCourses: async () => [], getPreferences: async () => DEFAULT_USER_PREFERENCES,
    savePreferences: async () => {},
    getPluginData: async (id, key) => data.get(id + ':' + key) ?? null,
    setPluginData: async (id, key, value) => { data.set(id + ':' + key, value); },
    deletePluginData: async (id, key) => { data.delete(id + ':' + key); }
  },
  runtime: { sha256: async () => 'fixture' }
}});
await engine.init();
const overlays = new Map();
const uiController = new ReactiveChronosController(engine, { overlayHistoryPort: {
  openOverlay(id, dismiss) {
    const token = Symbol(id);
    overlays.set(token, { id, dismiss });
    const release = () => { overlays.delete(token); };
    return { close: release, dispose: release };
  }
}});
const parent = createHistoryOverlaySync({ overlayId: 'host-parent', setOpen() {} });
let host;
let pendingHandle;
window.__chronosPluginUiQa = {
  async show(defer = false) {
    parent.syncOpenState(true);
    pendingHandle = await engine.loadPlugin({
      id: 'boundary-plugin', name: 'Boundary plugin', version: '1',
      apply(context) {
        context.registerSlot('shell.route.screen', {
          id: 'boundary-plugin', title: 'Boundary plugin',
          component: mountableSvelteComponent(BoundaryPluginScreen)
        });
      }
    }, { deferAcceptance: defer });
    host ??= mount(PluginBoundaryHost, { target: document.querySelector('#boundary-app'), props: {
      controller: uiController, pluginId: 'boundary-plugin', parent
    }});
  },
  accept: () => pendingHandle.accept(),
  setLocale: (locale) => engine.setLocale(locale),
  closeParent: () => parent.syncOpenState(false),
  uninstall: () => engine.unloadPlugin('boundary-plugin'),
  activeOverlays: () => [...overlays.values()].map((overlay) => overlay.id).sort(),
  async unmount() {
    await unmount(host);
    parent.dispose();
    uiController.dispose();
    engine.dispose();
  }
};
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
	await page.evaluate(() => window.__chronosPluginUiQa.show(true));
	await expect(page.getByTestId('boundary')).toHaveCount(0);
	await page.evaluate(() => window.__chronosPluginUiQa.accept());
	await expect(page.getByTestId('boundary')).toHaveText('isolated');
	await expect(page.getByTestId('owner')).toHaveText('boundary-plugin');
	await expect(page.getByTestId('edge-count')).toHaveText('1');
	await expect(page.getByText('Nested overlay content')).toBeVisible();
	expect(await page.evaluate(() => window.__chronosPluginUiQa.activeOverlays())).toEqual([
		'nested-plugin-overlay',
		'plugin-overlay'
	]);
	await page.evaluate(() => window.__chronosPluginUiQa.setLocale('en'));
	await expect(page.getByTestId('locale')).toHaveText('en');
	await page.evaluate(() => window.__chronosPluginUiQa.closeParent());
	await expect(page.getByTestId('sheet-status')).toHaveText('closed/closed');
	await expect(page.getByText('Nested overlay content')).toHaveCount(0);
	expect(await page.evaluate(() => window.__chronosPluginUiQa.activeOverlays())).toEqual([]);
	await page.evaluate(() => window.__chronosPluginUiQa.setLocale('failure'));
	await expect(page.getByText('Plugin screen failed to load')).toBeVisible();
	await expect(page.getByTestId('edge-count')).toHaveText('0');
	await page.evaluate(() => window.__chronosPluginUiQa.setLocale('en'));
	await page.getByRole('button', { name: 'Reload' }).click();
	await expect(page.getByTestId('boundary')).toHaveText('isolated');
	await expect(page.getByText('Nested overlay content')).toBeVisible();
	await page.evaluate(() => window.__chronosPluginUiQa.uninstall());
	await expect(page.getByTestId('boundary')).toHaveCount(0);
	await expect(page.getByText('Nested overlay content')).toHaveCount(0);
	await expect(page.getByTestId('edge-count')).toHaveText('0');
	expect(await page.evaluate(() => window.__chronosPluginUiQa.activeOverlays())).toEqual([]);
	await page.evaluate(() => window.__chronosPluginUiQa.unmount());
	expect(unhandledErrors).toEqual([]);
	expect(
		reportedErrors.filter((message) => message.includes('[MountableSvelteHost] render failed:'))
	).toHaveLength(4);
	console.log(
		'Plugin UI whitelist, state subscriptions, nested overlays, failure/reload and uninstall: passed'
	);
} finally {
	await browser?.close();
	await server.close();
	await rm(directory, { recursive: true, force: true });
}
