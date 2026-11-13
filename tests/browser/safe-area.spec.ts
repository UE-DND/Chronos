import { captureOptionalScreenshot } from './screenshot';
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

for (const mode of ['light', 'dark']) {
	test(`status bar has a fixed theme background before startup and across navigation in ${mode} mode`, async ({
		page,
		request
	}) => {
		await request.post('/__e2e/deploy?build=old');
		await page.addInitScript((mode) => {
			localStorage.setItem('chronos:/Chronos:chronos:onboarding-seen', '1');
			localStorage.setItem('chronos:/Chronos:chronos_preferences:theme_mode', mode);
		}, mode);
		// The workaround must be present before hydration, including offline launches.
		const html = await (await request.get('/Chronos/')).text();
		expect(html).toContain('id="chronos-status-bar-background"');
		await page.goto('/Chronos/');
		await setNativeInsets(page, 59, 0, 34, 0);
		await page.getByRole('tab', { name: '我的', exact: true }).click();
		await page.getByText('显示设置', { exact: true }).click();
		const background = page.locator('#chronos-status-bar-background');
		const color = await background.evaluate((node) => getComputedStyle(node).backgroundColor);
		expect(color).not.toBe('rgba(0, 0, 0, 0)');
		await expect(page.locator('body')).toHaveCSS('background-color', color);
		await expect(background).toHaveCSS('position', 'fixed');
		await expect(background).toHaveCSS('pointer-events', 'none');
		await expect(background).toHaveCSS('background-clip', 'text');
		await expect(page.locator('html')).toHaveCSS('color-scheme', mode);
		await page.setViewportSize({ width: 430, height: 500 });
		const scroll = page.locator('.secondary-page .secondary-scroll');
		await scroll.hover();
		await page.mouse.wheel(0, 1000);
		await expect.poll(() => scroll.evaluate((node) => node.scrollTop)).toBeGreaterThan(0);
		await expect(page.getByRole('button', { name: '返回', exact: true })).toBeInViewport();
		for (const viewport of [
			{ width: 430, height: 932 },
			{ width: 932, height: 430 }
		]) {
			await page.setViewportSize(viewport);
			const bounds = (await background.boundingBox())!;
			expect(bounds.y).toBe(0);
			expect(bounds.width).toBe(viewport.width);
			// WebKit ignores fixed containers no taller than 10px when sampling chrome.
			expect(bounds.height).toBeGreaterThan(10);
			expect(await page.evaluate(() => window.scrollY)).toBe(0);
			expect(
				await page.evaluate(() => document.documentElement.scrollHeight <= window.innerHeight)
			).toBe(true);
		}
		await page.goto('/Chronos/wallpaper');
		await page.getByText(mode === 'light' ? '暗色主题' : '亮色主题', { exact: true }).click();
		await expect(background).not.toHaveCSS('background-color', color);
		await expect(page.locator('body')).toHaveCSS(
			'background-color',
			await background.evaluate((node) => getComputedStyle(node).backgroundColor)
		);
	});
}

test.describe('iOS landscape rail', () => {
	test.use({
		userAgent:
			'Mozilla/5.0 (iPhone; CPU iPhone OS 18_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.0 Mobile/15E148 Safari/604.1'
	});

	for (const standalone of [true, false]) {
		test(`reserves the right cutout only when needed in ${standalone ? 'PWA' : 'Safari'}`, async ({
			page,
			request
		}, testInfo) => {
			await request.post('/__e2e/deploy?build=old');
			await page.addInitScript((installed) => {
				Object.defineProperty(navigator, 'standalone', { value: installed });
				Object.defineProperty(navigator, 'userAgentData', { value: undefined });
				Object.defineProperty(window, 'orientation', { value: 90, configurable: true });
				localStorage.setItem('chronos:/Chronos:chronos:onboarding-seen', '1');
				localStorage.setItem(
					'chronos:/Chronos:chronos:pwa-install-snoozed-until',
					String(Date.now() + 86400000)
				);
			}, standalone);
			await page.setViewportSize({ width: 932, height: 430 });
			const cdp = await page.context().newCDPSession(page);
			await cdp.send('Emulation.setSafeAreaInsetsOverride', {
				insets: { top: 0, right: 59, bottom: 21, left: 59 }
			});
			await page.goto('/Chronos/');
			await page.getByRole('tab', { name: '我的', exact: true }).click();
			const rail = page.locator('.adaptive-edge-bar--shell');
			await expect(rail).toHaveCSS('padding-right', standalone ? '0px' : '59px');
			await expect(rail).toHaveCSS('width', standalone ? '72px' : '131px');
			await expect(page.locator('.shell-page')).toHaveCSS('padding-left', '59px');
			await expect(rail).toHaveCSS('padding-bottom', '29px');
			await page.getByText('显示设置', { exact: true }).click();
			const secondary = page.locator('.adaptive-edge-bar--secondary');
			await expect(secondary).toHaveCSS('width', standalone ? '72px' : '131px');
			await expect(page.locator('.secondary-page')).toHaveCSS(
				'padding-right',
				standalone ? '72px' : '131px'
			);
			await captureOptionalScreenshot(page, {
				path: testInfo.outputPath('landscape-left-cutout.png')
			});

			// Rotating to put the sensor housing on the right must restore the full inset.
			await page.evaluate(() => {
				Object.defineProperty(window, 'orientation', { value: -90, configurable: true });
				window.dispatchEvent(new Event('orientationchange'));
			});
			await expect(secondary).toHaveCSS('padding-right', '59px');
			await expect(secondary).toHaveCSS('width', '131px');
			await page.evaluate(() => {
				Object.defineProperty(window, 'orientation', { value: 90, configurable: true });
				window.dispatchEvent(new Event('orientationchange'));
			});
			await expect(secondary).toHaveCSS('padding-right', standalone ? '0px' : '59px');
			// Explicit host insets remain authoritative, even in an iOS-looking environment.
			await setNativeInsets(page, 0, 32, 21, 59);
			await expect(secondary).toHaveCSS('padding-right', '32px');
			await expect(secondary).toHaveCSS('width', '104px');
			await page.setViewportSize({ width: 430, height: 932 });
			await setNativeInsets(page, 59, 0, 34, 0);
			await page.getByRole('button', { name: '返回', exact: true }).click();
			await expect(rail).toHaveCSS('padding-bottom', '34px');
			await expect(page.locator('.shell-tab-bar')).toHaveCSS('width', '430px');
			await cdp.detach();
		});
	}
});

test('sheet stays docked while its handle is pulled upwards', async ({
	page,
	request
}, testInfo) => {
	await request.post('/__e2e/deploy?build=old');
	await page.addInitScript(() =>
		localStorage.setItem('chronos:/Chronos:chronos:onboarding-seen', '1')
	);
	await page.goto(`/Chronos/s#${payload}`);
	await page.getByRole('button', { name: '导入为新课程表', exact: true }).click();
	await expect(page).toHaveURL(/\/Chronos\/$/);
	await setNativeInsets(page, 24, 0, 34, 0);
	await page.locator('.course-capsule').first().click();
	const sheet = page.getByRole('dialog', { name: '课程详情', exact: true });
	const offset = () =>
		sheet.evaluate((node) => new DOMMatrix(getComputedStyle(node).transform).m42);
	await expect.poll(offset).toBe(0);

	for (const viewport of [
		{ width: 430, height: 932 },
		{ width: 932, height: 430 }
	]) {
		await page.setViewportSize(viewport);
		const handle = (await sheet.locator('.touch-none').boundingBox())!;
		const x = handle.x + handle.width / 2;
		const y = handle.y + handle.height / 2;
		await page.mouse.move(x, y);
		await page.mouse.down();
		await page.mouse.move(x, Math.max(0, y - 270), { steps: 10 });
		await expect(sheet).toHaveAttribute('data-dragging', '');
		expect(await offset()).toBe(0);
		const bounds = (await sheet.boundingBox())!;
		expect(bounds.y + bounds.height).toBeCloseTo(viewport.height, 0);
		await captureOptionalScreenshot(page, {
			path: testInfo.outputPath(`sheet-upward-${viewport.width}.png`)
		});
		await page.mouse.move(x, y - 5);
		await page.mouse.up();
		await expect(sheet).not.toHaveAttribute('data-dragging');
		await expect(sheet).not.toHaveAttribute('data-snapping-back');
		await expect(sheet).toBeVisible();
		await expect.poll(offset).toBe(0);
	}
	await page.keyboard.press('Escape');
	await expect(sheet).toBeHidden();
});

test('dialog keeps its input and footer reachable in a short viewport with safe areas', async ({
	page,
	request
}) => {
	await request.post('/__e2e/deploy?build=old');
	await page.addInitScript(() =>
		localStorage.setItem('chronos:/Chronos:chronos:onboarding-seen', '1')
	);
	await page.goto('/Chronos/plugins');
	await page.getByRole('tab', { name: '插件市场', exact: true }).click();
	await page.getByRole('button', { name: '从链接安装', exact: true }).click();
	const dialog = page.getByRole('dialog', { name: '从链接安装', exact: true });
	await expect(dialog).toBeVisible();
	await setNativeInsets(page, 24, 0, 16, 0);

	for (const viewport of [
		{ width: 430, height: 280 },
		{ width: 932, height: 280 }
	]) {
		await page.setViewportSize(viewport);
		await expect
			.poll(async () => {
				const bounds = (await dialog.boundingBox())!;
				const margin = await page.evaluate(() =>
					parseFloat(getComputedStyle(document.documentElement).fontSize)
				);
				return (
					bounds.y >= 24 + margin - 1 &&
					bounds.y + bounds.height <= viewport.height - 16 - margin + 1
				);
			})
			.toBe(true);
		const input = dialog.getByRole('textbox');
		await input.fill('https://example.com/plugin.manifest.json');
		await expect(input).toBeInViewport();
		await expect(dialog.getByRole('button', { name: '取消', exact: true })).toBeInViewport({
			ratio: 1
		});
	}
	await dialog.getByRole('button', { name: '取消', exact: true }).click();
	await expect(dialog).toBeHidden();
});

test('landscape sheet preserves the bottom safe area for its footer and scrollable content', async ({
	page,
	request
}) => {
	await request.post('/__e2e/deploy?build=old');
	await page.addInitScript(() =>
		localStorage.setItem('chronos:/Chronos:chronos:onboarding-seen', '1')
	);
	await page.goto(`/Chronos/s#${payload}`);
	await page.getByRole('button', { name: '导入为新课程表', exact: true }).click();
	await expect(page).toHaveURL(/\/Chronos\/$/);
	await page.setViewportSize({ width: 932, height: 430 });
	await setNativeInsets(page, 24, 0, 32, 0);
	await page.getByRole('tab', { name: '我的', exact: true }).click();
	await page.getByText('管理课程表', { exact: true }).click();
	await page.getByRole('button', { name: '删除课表', exact: true }).click();
	const sheet = page.getByRole('dialog', { name: '删除课表？', exact: true });
	await expect(sheet).toBeVisible();
	const cancel = sheet.getByRole('button', { name: '取消', exact: true });
	for (const bottom of [32, 0, 16]) {
		await setNativeInsets(page, 24, 0, bottom, 0);
		await expect
			.poll(async () => {
				const bounds = (await cancel.boundingBox())!;
				return bounds.y + bounds.height <= 430 - bottom;
			})
			.toBe(true);
	}
	await cancel.click();
	await expect(sheet).toBeHidden();
	await page.getByRole('button', { name: '返回', exact: true }).click();
	await page.getByRole('tab', { name: '课表', exact: true }).click();
	await setNativeInsets(page, 24, 0, 32, 0);
	await page.locator('.course-capsule').first().click();
	const detail = page.getByRole('dialog', { name: '课程详情', exact: true });
	await expect(detail).toBeVisible();
	const content = detail.locator('.app-scroll-y');
	await expect
		.poll(async () =>
			content.evaluate((node) => {
				const padding = parseFloat(getComputedStyle(node).paddingBottom);
				return padding >= 32;
			})
		)
		.toBe(true);
});

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
	await captureOptionalScreenshot(page, { path: testInfo.outputPath('clock-portrait.png') });
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

test('empty timetable keeps its content and import action reachable in a short landscape viewport', async ({
	page,
	request
}) => {
	await request.post('/__e2e/deploy?build=old');
	await page.addInitScript(() =>
		localStorage.setItem('chronos:/Chronos:chronos:onboarding-seen', '1')
	);
	await page.setViewportSize({ width: 932, height: 280 });
	await page.goto('/Chronos/');
	await setNativeInsets(page, 24, 0, 16, 32);
	await page.getByRole('tab', { name: '课表', exact: true }).click();
	const panel = page.locator('.shell-tab-panel:not([hidden])');
	await expect(panel.getByRole('heading', { name: '还没有课程表', exact: true })).toBeVisible();
	const image = panel.locator('img');
	const imageBounds = (await image.boundingBox())!;
	expect(imageBounds.y).toBeGreaterThanOrEqual(24);
	expect(imageBounds.x).toBeGreaterThanOrEqual(32);
	const guide = panel.getByRole('button', { name: '查看导入方式说明', exact: true });
	await panel.hover();
	await page.mouse.wheel(0, 1000);
	await expect(guide).toBeInViewport({ ratio: 1 });
	const guideBounds = (await guide.boundingBox())!;
	expect(guideBounds.y + guideBounds.height).toBeLessThanOrEqual(264);
	const importLink = panel.getByRole('link', { name: '导入课程表', exact: true });
	await expect(importLink).toBeInViewport({ ratio: 1 });
	await importLink.click();
	await expect(page).toHaveURL(/\/Chronos\/transfer\/import$/);
});

test('onboarding footer avoids the system gesture area in landscape', async ({ page, request }) => {
	await request.post('/__e2e/deploy?build=old');
	await page.setViewportSize({ width: 568, height: 320 });
	await page.goto('/Chronos/');
	await setNativeInsets(page, 24, 32, 32, 59);
	const onboarding = page.getByRole('dialog');
	const next = onboarding.getByRole('button', { name: '下一步', exact: true });
	await expect(next).toBeVisible();
	const bounds = (await next.boundingBox())!;
	expect(bounds.x).toBeGreaterThanOrEqual(59);
	expect(bounds.x + bounds.width).toBeLessThanOrEqual(568 - 32);
	expect(bounds.y + bounds.height).toBeLessThanOrEqual(320 - 32);
	await next.click();
	await expect(onboarding.getByRole('checkbox')).toBeVisible();
});
