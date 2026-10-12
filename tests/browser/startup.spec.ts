import { expect, test } from '@playwright/test';

test.use({ viewport: { width: 430, height: 932 }, isMobile: true, hasTouch: true });

test.beforeEach(async ({ page, request }) => {
	await request.post('/__e2e/deploy?build=old');
	await page.addInitScript(() => {
		localStorage.setItem('chronos:/Chronos:chronos:onboarding-seen', '1');
		window.requestIdleCallback = () => 1;
		window.cancelIdleCallback = () => {};
	});
});

test('starts and reloads offline without idle callbacks or a touch', async ({ page, context }) => {
	await context.route('https://ue-dnd.github.io/**', () => new Promise<void>(() => {}));
	await page.goto('/Chronos/');
	await expect(page.getByRole('tab', { name: '课表', exact: true })).toHaveAttribute(
		'aria-selected',
		'true'
	);
	await expect(page.locator('#chronos-boot-fallback')).toBeHidden();
	await page.evaluate(() => navigator.serviceWorker.ready);
	await expect
		.poll(() => page.evaluate(() => Boolean(navigator.serviceWorker.controller)))
		.toBe(true);
	await context.setOffline(true);
	await page.reload();
	await expect(page.getByRole('tab', { name: '课表', exact: true })).toHaveAttribute(
		'aria-selected',
		'true'
	);
	await expect(page.locator('#chronos-boot-fallback')).toBeHidden();
	await expect(page.locator('[data-startup-state]')).toHaveCount(0);
});

test('restores a cached plugin default home without briefly selecting the timetable', async ({
	page,
	context
}) => {
	await context.route('https://ue-dnd.github.io/Chronos/plugins/releases/**', async (route) => {
		const url = new URL(route.request().url());
		const path = url.pathname.replace('/Chronos/plugins/releases/', '/__e2e/market/');
		const response = await route.fetch({ url: `http://127.0.0.1:4179${path}${url.search}` });
		await route.fulfill({ response });
	});
	await page.goto('/Chronos/plugins');
	await page.getByRole('tab', { name: '插件市场', exact: true }).click();
	const row = page
		.locator('div.flex.items-center.justify-between')
		.filter({ has: page.getByText('今日', { exact: true }) })
		.last();
	await row.getByRole('button', { name: '安装', exact: true }).click();
	await expect(row.getByText('已安装', { exact: true })).toBeVisible();
	await page.addInitScript(() => {
		const selected: string[] = [];
		Object.assign(window, { startupSelectedTabs: selected });
		new MutationObserver(() => {
			const tab = document.querySelector('.shell-tab-bar [role="tab"][aria-selected="true"]');
			if (tab) selected.push(tab.textContent?.trim() ?? '');
		}).observe(document, {
			subtree: true,
			childList: true,
			attributes: true,
			attributeFilter: ['aria-selected']
		});
	});
	await page.goto('/Chronos/');
	await expect(page.getByRole('tab', { name: '今日', exact: true })).toHaveAttribute(
		'aria-selected',
		'true'
	);
	await expect(page.locator('#chronos-boot-fallback')).toBeHidden();
	const selections = await page.evaluate(
		() => (window as unknown as { startupSelectedTabs: string[] }).startupSelectedTabs
	);
	expect(selections.length).toBeGreaterThan(0);
	expect(selections.every((label) => label === '今日')).toBe(true);
});

test.describe('bounded startup failures', () => {
	test.use({ serviceWorkers: 'block' });
	test('shows a core failure instead of a blank page when the theme cannot finish loading', async ({
		page,
		context
	}) => {
		await page.clock.install();
		await context.route('**/theme-m3.manifest.json*', () => new Promise<void>(() => {}));
		await page.goto('/Chronos/');
		await page.clock.pauseAt(new Date(await page.evaluate(() => Date.now() + 1000)));
		await page.clock.runFor(25_100);
		await expect(page.locator('[data-startup-state="failed"]')).toBeVisible();
		await expect(page.getByRole('button', { name: '重新启动', exact: true })).toBeVisible();
		await expect(page.getByRole('button', { name: '进入课表', exact: true })).toHaveCount(0);
		await expect(page.locator('#chronos-boot-fallback')).toBeHidden();
	});
	test('shows plugin timeout and keeps an explicit timetable choice after a late response', async ({
		page,
		context
	}) => {
		await page.clock.install();
		let release!: () => void;
		let finished!: () => void;
		const released = new Promise<void>((resolve) => {
			release = resolve;
		});
		const completed = new Promise<void>((resolve) => {
			finished = resolve;
		});
		await context.route('**/codec-share.manifest.json*', async (route) => {
			const response = await route.fetch();
			await released;
			await route.fulfill({ response });
			finished();
		});
		await page.goto('/Chronos/');
		await expect(page.locator('[data-startup-state="loading"]')).toBeVisible();
		await expect(page.locator('#chronos-boot-fallback')).toBeHidden();
		await page.clock.pauseAt(new Date(await page.evaluate(() => Date.now() + 1000)));
		await page.clock.runFor(10_100);
		await expect(page.locator('[data-startup-state="failed"]')).toBeVisible();
		await page.getByRole('button', { name: '进入课表', exact: true }).click();
		await page.clock.runFor(100);
		await expect(page.getByRole('tab', { name: '课表', exact: true })).toHaveAttribute(
			'aria-selected',
			'true'
		);
		release();
		await completed;
		await page.clock.runFor(100);
		await expect(page.getByRole('tab', { name: '课表', exact: true })).toHaveAttribute(
			'aria-selected',
			'true'
		);
		await expect(page.locator('[data-startup-state]')).toHaveCount(0);
		await page.clock.resume();
		await page.getByRole('tab', { name: '我的', exact: true }).click();
		await page.getByRole('link', { name: '导入课程表', exact: true }).click();
		await expect(page.locator('[data-startup-state="failed"]')).toBeVisible();
	});
});
