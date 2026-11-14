import { createHash } from 'node:crypto';
import { expect, test, type Page } from '@playwright/test';

test.use({ viewport: { width: 430, height: 932 }, isMobile: true, hasTouch: true });

async function insets(page: Page, top: number, bottom: number) {
	await page.evaluate(
		({ top, bottom }) => {
			document.documentElement.style.setProperty('--safe-area-inset-top', `${top}px`);
			document.documentElement.style.setProperty('--safe-area-inset-bottom', `${bottom}px`);
		},
		{ top, bottom }
	);
}

test.beforeEach(async ({ page, request, context }) => {
	await request.post('/__e2e/deploy?build=old');
	await page.addInitScript(() => {
		localStorage.setItem('chronos:/Chronos:chronos:onboarding-seen', '1');
	});
	await context.route('https://ue-dnd.github.io/Chronos/plugins/releases/**', async (route) => {
		const url = new URL(route.request().url());
		const path = url.pathname.replace('/Chronos/plugins/releases/', '/__e2e/market/');
		await route.fulfill({
			response: await route.fetch({ url: `http://127.0.0.1:4179${path}${url.search}` })
		});
	});
});

test('long schema screens scroll to save and retain their values in a route and a shell tab', async ({
	page,
	context
}) => {
	const id = 'schema-layout-regression';
	const schema = Object.fromEntries(
		Array.from({ length: 20 }, (_, index) => [
			`field${index}`,
			{ type: 'string', title: `Field ${index + 1}`, default: '' }
		])
	);
	const bundle = `export default {id:'${id}',name:()=> 'Schema Layout',version:'1.0.0',defaultConfig:{},apply(ctx){ctx.registerSlot('shell.route.screen',{id:'index',title:'Schema Layout',schema:${JSON.stringify(schema)}});ctx.registerSlot('shell.bottom-bar.tab',{id:'schema-layout',label:'Schema Layout',order:99});}};`;
	await context.route('https://layout.example/**', async (route) => {
		const manifest = route.request().url().endsWith('manifest.json');
		await route.fulfill({
			contentType: manifest ? 'application/json' : 'text/javascript',
			body: manifest
				? JSON.stringify({
						id,
						name: { 'zh-CN': 'Schema Layout' },
						description: { 'zh-CN': 'Layout regression' },
						author: 'Browser test',
						version: '1.0.0',
						type: 'tool',
						toolGroup: 'dev',
						bundleFormat: 'esm',
						bundleUrl: './bundle.js',
						sha256: createHash('sha256').update(bundle).digest('hex')
					})
				: bundle
		});
	});
	await page.goto('/Chronos/plugins');
	await page.getByRole('tab', { name: '插件市场', exact: true }).click();
	await page.getByRole('button', { name: '从链接安装', exact: true }).click();
	await page.getByRole('textbox').fill('https://layout.example/manifest.json');
	await page.getByRole('button', { name: '确认安装', exact: true }).click();
	await expect(page.getByRole('dialog')).toBeHidden();
	// Closing the dialog only queues installation; wait for persistence before a full navigation.
	const installed = page
		.locator('div.flex.items-center.justify-between')
		.filter({ has: page.getByText('Schema Layout', { exact: true }) })
		.getByRole('button', { name: '卸载', exact: true });
	await expect(installed).toBeVisible();
	for (const location of ['route', 'tab']) {
		await page.goto(location === 'route' ? `/Chronos/plugins/${id}` : '/Chronos/');
		if (location === 'tab')
			await page.getByRole('tab', { name: 'Schema Layout', exact: true }).click();
		await insets(page, 59, 34);
		const first = page.getByRole('textbox', { name: 'Field 1', exact: true });
		await expect(first).toBeVisible();
		expect((await first.boundingBox())!.y).toBeGreaterThanOrEqual(59);
		const region = page.locator(
			location === 'route' ? '.secondary-page main' : '.shell-tab-panel:not([hidden])'
		);
		await region.hover();
		await page.mouse.wheel(0, 4000);
		const save = region.getByRole('button', { name: '保存设置', exact: true });
		await expect(save).toBeInViewport({ ratio: 1 });
		const last = page.getByRole('textbox', { name: 'Field 20', exact: true });
		if (location === 'route') {
			await last.fill('persisted');
			await save.click();
			await expect(save).toBeEnabled();
		} else await expect(last).toHaveValue('persisted');
	}
});

test('Today consumes the top safe area once in both a shell tab and a secondary route', async ({
	page
}) => {
	await page.goto('/Chronos/plugins');
	await page.getByRole('tab', { name: '插件市场', exact: true }).click();
	const row = page
		.locator('div.flex.items-center.justify-between')
		.filter({ has: page.getByText('今日', { exact: true }) })
		.last();
	await row.getByRole('button', { name: '安装', exact: true }).click();
	await expect(row.getByText('已安装', { exact: true })).toBeVisible();
	for (const location of ['tab', 'route']) {
		await page.goto(location === 'route' ? '/Chronos/plugins/tool-today' : '/Chronos/');
		if (location === 'tab') await page.getByRole('tab', { name: '今日', exact: true }).click();
		const header = page.locator(
			location === 'route'
				? '.secondary-page header:not(.ui-shell-top-bar)'
				: '.shell-tab-panel:not([hidden]) header'
		);
		await expect(header).toBeVisible();
		for (const top of [0, 59, 32]) {
			await insets(page, top, 34);
			const expectedPadding = await page.evaluate(
				() => `${parseFloat(getComputedStyle(document.documentElement).fontSize) * 1.5}px`
			);
			await expect(header).toHaveCSS('padding-top', expectedPadding);
			const y =
				location === 'tab'
					? top
					: await page
							.locator('.secondary-page > .ui-shell-top-bar')
							.evaluate((node) => node.getBoundingClientRect().bottom);
			await expect.poll(async () => (await header.boundingBox())!.y).toBe(y);
		}
	}
});
