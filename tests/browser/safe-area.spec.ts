import { expect, test, type Page } from '@playwright/test';
import timetable from '../../packages/core/tests/fixtures/timetable.json' with { type: 'json' };
import { encodeSharePayload } from '../../packages/plugins/codec-share/src/share-link/chronos-share-link-codec.ts';
import type { Timetable } from '../../packages/core/src/domain/timetable';

const payload = await encodeSharePayload(timetable as Timetable);

test.use({ viewport: { width: 430, height: 932 }, isMobile: true, hasTouch: true });

async function setNativeInsets(
	page: Page,
	top: number,
	right: number,
	bottom: number,
	left: number
) {
	await page.evaluate(
		(values) => {
			for (const [side, value] of Object.entries(values)) {
				document.documentElement.style.setProperty(`--safe-area-inset-${side}`, `${value}px`);
			}
		},
		{ top, right, bottom, left }
	);
}

test('clock summary below the host toolbar does not add the native top inset again', async ({
	page,
	context,
	request
}, testInfo) => {
	await request.post('/__e2e/deploy?build=old');
	await page.addInitScript(() =>
		localStorage.setItem('chronos:/Chronos:chronos:onboarding-seen', '1')
	);
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
		.filter({ has: page.getByText('自定义时间', { exact: true }) })
		.last();
	await row.getByRole('button', { name: '安装', exact: true }).click();
	await expect(row.getByText('已安装', { exact: true })).toBeVisible();
	await page.goto('/Chronos/plugins/tool-clock');
	const toolbar = page.locator('.secondary-page > .ui-shell-top-bar');
	const summary = page.locator('.secondary-page header:not(.ui-shell-top-bar)');
	await expect(summary).toContainText('课表按引擎时间运行');
	const summaryPadding = await page.evaluate(
		() => `${parseFloat(getComputedStyle(document.documentElement).fontSize) * 1.5}px`
	);
	for (const top of [0, 32, 64]) {
		await setNativeInsets(page, top, 0, 16, 0);
		await expect(toolbar).toHaveCSS('padding-top', `${top}px`);
		await expect(summary).toHaveCSS('padding-top', summaryPadding);
		const toolbarBounds = (await toolbar.boundingBox())!;
		const summaryBounds = (await summary.boundingBox())!;
		expect(summaryBounds.y).toBeCloseTo(toolbarBounds.y + toolbarBounds.height, 0);
	}
	await page.getByRole('button', { name: '时间', exact: true }).click();
	await expect(page.getByRole('listbox', { name: '时间时', exact: true })).toBeVisible();
	await page.getByRole('button', { name: '取消', exact: true }).click();
	await expect(page.locator('[role="dialog"]')).toBeHidden();
	await page.screenshot({ path: testInfo.outputPath('clock-portrait.png') });
	await page.setViewportSize({ width: 932, height: 430 });
	await setNativeInsets(page, 24, 0, 16, 32);
	await expect(summary).toHaveCount(0);
	await expect(page.getByRole('button', { name: '时间', exact: true })).toBeVisible();
});

test('native safe areas move between edges on rotation even when WebView env values are stale', async ({
	page,
	request
}) => {
	await request.post('/__e2e/deploy?build=old');
	await page.addInitScript(() =>
		localStorage.setItem('chronos:/Chronos:chronos:onboarding-seen', '1')
	);
	const cdp = await page.context().newCDPSession(page);
	// Keep the browser's portrait values stale while native WindowInsets change.
	await cdp.send('Emulation.setSafeAreaInsetsOverride', {
		insets: { top: 32, right: 0, bottom: 16, left: 0 }
	});
	await page.goto('/Chronos/');
	await page.getByRole('tab', { name: '我的', exact: true }).click();
	const header = page.locator('.shell-tab-panel:not([hidden]) .ui-safe-area-top');
	const shell = page.locator('.shell-page');
	const rail = page.locator('.adaptive-edge-bar--shell');

	await setNativeInsets(page, 32, 0, 16, 0);
	await expect(header).toHaveCSS('padding-top', '32px');
	await page.setViewportSize({ width: 932, height: 430 });
	await setNativeInsets(page, 0, 0, 16, 32);
	await expect(header).toHaveCSS('padding-top', '0px');
	await expect(shell).toHaveCSS('padding-left', '32px');
	await expect(rail).toHaveCSS('padding-bottom', '24px');

	await setNativeInsets(page, 0, 32, 16, 0);
	await expect(shell).toHaveCSS('padding-left', '0px');
	await expect(rail).toHaveCSS('padding-right', '32px');
	await expect(header).toHaveCSS('padding-top', '0px');

	await page.setViewportSize({ width: 430, height: 932 });
	await setNativeInsets(page, 32, 0, 16, 0);
	await expect(header).toHaveCSS('padding-top', '32px');
	await expect(rail).toHaveCSS('padding-bottom', '16px');
	// A native zero must also override a stale env value (e.g. IME visibility).
	await setNativeInsets(page, 32, 0, 0, 0);
	await expect(rail).toHaveCSS('padding-bottom', '0px');
	await page.evaluate(() => {
		for (const side of ['top', 'right', 'bottom', 'left']) {
			document.documentElement.style.removeProperty(`--safe-area-inset-${side}`);
		}
	});
	await expect(rail).toHaveCSS('padding-bottom', '16px');
	await cdp.detach();
});

test('landscape timetable and secondary pages avoid the status bar, cutout and gesture bar together', async ({
	page,
	request
}) => {
	await request.post('/__e2e/deploy?build=old');
	await page.addInitScript(() =>
		localStorage.setItem('chronos:/Chronos:chronos:onboarding-seen', '1')
	);
	await page.goto(`/Chronos/s#${payload}`);
	await expect(page.getByRole('heading', { name: timetable.name })).toBeVisible();
	await page.getByRole('button', { name: '导入为新课程表', exact: true }).click();
	await expect(page).toHaveURL(/\/Chronos\/$/);
	const pager = page.locator('.timetable-week-pager');
	await expect(pager).toBeVisible();
	await setNativeInsets(page, 32, 0, 16, 0);
	await page.setViewportSize({ width: 932, height: 430 });
	// Android can retain a top status bar while the physical cutout moves sideways.
	await setNativeInsets(page, 24, 0, 16, 32);
	await expect.poll(async () => (await pager.boundingBox())?.y).toBe(24);
	let bounds = (await pager.boundingBox())!;
	expect(bounds.x).toBe(32);
	expect(bounds.y + bounds.height).toBe(414);
	await expect(page.locator('.timetable-week-top-bar')).not.toBeVisible();

	await setNativeInsets(page, 24, 32, 16, 0);
	await expect.poll(async () => (await pager.boundingBox())?.x).toBe(0);
	bounds = (await pager.boundingBox())!;
	expect(bounds.y).toBe(24);
	expect(bounds.x + bounds.width).toBeLessThanOrEqual(900);

	await setNativeInsets(page, 0, 32, 0, 0);
	await expect.poll(async () => (await pager.boundingBox())?.y).toBe(0);
	bounds = (await pager.boundingBox())!;
	expect(bounds.y + bounds.height).toBe(430);

	await setNativeInsets(page, 24, 0, 16, 32);
	await page.getByRole('tab', { name: '我的', exact: true }).click();
	await page.getByText('显示设置', { exact: true }).click();
	const content = page.locator('.secondary-page > .secondary-scroll-host');
	await expect(content).toBeVisible();
	await expect.poll(async () => (await content.boundingBox())?.y).toBe(24);
	bounds = (await content.boundingBox())!;
	expect(bounds.x).toBe(32);
	expect(bounds.y + bounds.height).toBe(414);
	await expect(page.locator('.secondary-page > .ui-shell-top-bar')).not.toBeVisible();

	await page.getByRole('button', { name: '返回', exact: true }).click();
	await page.getByRole('tab', { name: '课表', exact: true }).click();
	await page.setViewportSize({ width: 430, height: 932 });
	await setNativeInsets(page, 32, 0, 16, 0);
	await expect(page.locator('.timetable-week-top-bar')).toBeVisible();
	await expect(page.locator('.timetable-week-top-bar')).toHaveCSS('padding-top', '32px');
});
