import { createHash } from 'node:crypto';
import { test, expect, type Page } from '@playwright/test';
import { PREFERENCE_STORAGE_KEYS } from '../../packages/core/src/domain/preferences';
import type { PluginInstallationState } from '../../apps/web/src/lib/services/official-plugins/installed-store';

async function installation(page: Page, stale?: { id: string; external?: boolean }) {
	return page.evaluate(async (stale) => {
		const database = await new Promise<IDBDatabase>((resolve, reject) => {
			const request = indexedDB.open('chronos');
			request.onsuccess = () => resolve(request.result);
			request.onerror = () => reject(request.error);
		});
		try {
			return await new Promise<PluginInstallationState>((resolve, reject) => {
				const transaction = database.transaction('pluginData', stale ? 'readwrite' : 'readonly');
				const table = transaction.objectStore('pluginData');
				const request = table.get('core.official-plugins:installed_plugins');
				let state: PluginInstallationState;
				request.onsuccess = () => {
					const row = request.result;
					if (!row) {
						reject(new Error('Missing installation state'));
						return;
					}
					state = JSON.parse(row.valueJson);
					if (!stale) return;
					const record = state.records.find((record) => record.manifest.id === stale.id);
					if (!record) {
						reject(new Error(`Missing installed plugin: ${stale.id}`));
						return;
					}
					// Both e2e builds have the same host version; seed only the prior-host metadata.
					if (stale.external) record.acceptedHostVersion = '0.0.0';
					else record.manifest.version = '0.0.0';
					record.revision = state.revision + 1;
					state.revision++;
					table.put({ ...row, valueJson: JSON.stringify(state) });
				};
				transaction.oncomplete = () => resolve(state);
				transaction.onerror = () => reject(transaction.error);
				transaction.onabort = () => reject(transaction.error);
			});
		} finally {
			database.close();
		}
	}, stale);
}

function pluginRow(page: Page, name: string) {
	return page
		.locator('div.flex.items-center.justify-between')
		.filter({ has: page.getByText(name, { exact: true }) })
		.last();
}

async function installClock(page: Page) {
	await page.goto('/Chronos/plugins');
	await page.getByRole('tab', { name: '插件市场', exact: true }).click();
	await pluginRow(page, '自定义时间').getByRole('button', { name: '安装', exact: true }).click();
	await expect
		.poll(async () =>
			(await installation(page)).records.some((r) => r.manifest.id === 'tool-clock')
		)
		.toBe(true);
}

async function uninstall(page: Page, name: string, id: string) {
	await pluginRow(page, name).getByRole('button', { name: '卸载', exact: true }).click();
	await page.getByRole('dialog').getByRole('button', { name: '卸载', exact: true }).click();
	await expect
		.poll(async () =>
			(await installation(page)).records.some((record) => record.manifest.id === id)
		)
		.toBe(false);
}

async function preferredTheme(page: Page) {
	return page.evaluate((key) => localStorage.getItem(key), PREFERENCE_STORAGE_KEYS.visualThemeId);
}

test.beforeEach(async ({ page, request, context }) => {
	await request.post('/__e2e/deploy?build=old');
	await page.addInitScript(() => localStorage.setItem('chronos:onboarding-seen', '1'));
	await context.route('https://ue-dnd.github.io/Chronos/plugins/releases/**', async (route) => {
		const url = new URL(route.request().url());
		const path = url.pathname.replace('/Chronos/plugins/releases/', '/__e2e/market/');
		const response = await route.fetch({ url: `http://127.0.0.1:4179${path}${url.search}` });
		await route.fulfill({ response });
	});
});

for (const stage of ['catalog', 'manifest']) {
	test(`uninstall during host-sync ${stage} does not resurrect the plugin`, async ({
		page,
		context
	}) => {
		await installClock(page);
		const record = (await installation(page)).records.find(
			(record) => record.manifest.id === 'tool-clock'
		)!;
		const bundlePath = new URL(record.manifest.bundleUrl!, record.manifestUrl).pathname;
		await installation(page, { id: 'tool-clock' });
		const started = Promise.withResolvers<void>();
		const release = Promise.withResolvers<void>();
		let downloads = 0;
		const pattern = stage === 'catalog' ? '**/catalog.json' : '**/tool-clock.manifest.json';
		await context.route(pattern, async (route) => {
			started.resolve();
			await release.promise;
			await route.fallback();
		});
		page.on('request', (request) => {
			if (new URL(request.url()).pathname === bundlePath) downloads++;
		});
		try {
			await page.reload();
			await started.promise;
			await uninstall(page, '自定义时间', 'tool-clock');
		} finally {
			release.resolve();
		}
		await page.waitForLoadState('networkidle');
		expect(downloads).toBe(0);
		expect(
			(await installation(page)).records.some((record) => record.manifest.id === 'tool-clock')
		).toBe(false);
		expect((await installation(page)).removed).toContain('tool-clock');
		await page.reload();
		await expect(pluginRow(page, '自定义时间')).toHaveCount(0);
	});
}

for (const confirm of [false, true]) {
	test(`unrelated uninstall preserves a pending external theme, and uninstalling its ${confirm ? 'confirmed' : 'pending'} owner reverts`, async ({
		page,
		context
	}) => {
		const id = 'lifecycle-theme';
		const name = 'Lifecycle Theme';
		const colors = JSON.stringify({
			id,
			name,
			variants: {
				light: { colors: { 'color.primary': '#123456' } },
				dark: { colors: { 'color.primary': '#abcdef' } }
			}
		});
		await context.route('https://lifecycle.example/**', async (route) => {
			const manifest = new URL(route.request().url()).pathname.endsWith('manifest.json');
			await route.fulfill({
				contentType: 'application/json',
				body: manifest
					? JSON.stringify({
							id,
							name: { en: name, 'zh-CN': name },
							description: { en: 'Theme lifecycle regression' },
							author: 'Browser test',
							version: '1.0.0',
							type: 'theme',
							themeId: id,
							bundleFormat: 'esm',
							colorsUrl: './colors.json',
							colorsSha256: createHash('sha256').update(colors).digest('hex')
						})
					: colors
			});
		});
		await installClock(page);
		const defaultThemeId = (await installation(page)).records.find(
			(record) => record.manifest.id === 'theme-m3'
		)?.manifest.themeId;
		expect(defaultThemeId).toBeTruthy();
		await page.getByRole('button', { name: '从链接安装', exact: true }).click();
		await page
			.getByPlaceholder('https://example.com/plugin.manifest.json')
			.fill('https://lifecycle.example/manifest.json');
		await page.getByRole('button', { name: '确认安装', exact: true }).click();
		await expect
			.poll(async () =>
				(await installation(page)).records.some((record) => record.manifest.id === id)
			)
			.toBe(true);
		await page.goto('/Chronos/wallpaper');
		await page
			.locator('label')
			.filter({ has: page.getByText(name, { exact: true }) })
			.click();
		await expect.poll(() => preferredTheme(page)).toBe(id);

		await installation(page, { id, external: true });
		await page.goto('/Chronos/plugins');
		await expect(
			pluginRow(page, name).getByRole('button', { name: '确认兼容并运行', exact: true })
		).toBeVisible();
		await uninstall(page, '自定义时间', 'tool-clock');
		expect(await preferredTheme(page)).toBe(id);
		await page.reload();
		expect(await preferredTheme(page)).toBe(id);
		if (confirm) {
			await pluginRow(page, name)
				.getByRole('button', { name: '确认兼容并运行', exact: true })
				.click();
			await expect(
				pluginRow(page, name).getByRole('button', { name: '确认兼容并运行', exact: true })
			).toHaveCount(0);
			await page.goto('/Chronos/wallpaper');
			await page
				.locator('label')
				.filter({ has: page.getByText(name, { exact: true }) })
				.click();
			await page.goto('/Chronos/plugins');
		} else {
			await expect(
				pluginRow(page, name).getByRole('button', { name: '确认兼容并运行', exact: true })
			).toBeVisible();
		}
		await uninstall(page, name, id);
		await expect.poll(() => preferredTheme(page)).toBe(defaultThemeId);
		await page.reload();
		await expect.poll(() => preferredTheme(page)).toBe(defaultThemeId);
	});
}
