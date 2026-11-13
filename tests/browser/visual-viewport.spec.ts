import { expect, test, type Page } from '@playwright/test';
import timetable from '../../packages/core/tests/fixtures/timetable.json' with { type: 'json' };
import { encodeSharePayload } from '../../packages/plugins/codec-share/src/share-link/chronos-share-link-codec.ts';
import type { Timetable } from '../../packages/core/src/domain/timetable';

const payload = await encodeSharePayload(timetable as Timetable);

test.use({ viewport: { width: 430, height: 932 }, isMobile: true, hasTouch: true });

async function visualViewport(page: Page, height: number, offsetTop: number, scale = 1) {
	await page.evaluate(
		({ height, offsetTop, scale }) => {
			Object.assign(window.visualViewport!, { height, offsetTop, scale });
			window.visualViewport!.dispatchEvent(new Event('resize'));
			window.visualViewport!.dispatchEvent(new Event('scroll'));
		},
		{ height, offsetTop, scale }
	);
}

test.beforeEach(async ({ page, request }) => {
	await request.post('/__e2e/deploy?build=old');
	await page.addInitScript(() => {
		localStorage.setItem('chronos:/Chronos:chronos:onboarding-seen', '1');
		const viewport = Object.assign(new EventTarget(), {
			height: innerHeight,
			offsetTop: 0,
			scale: 1
		});
		Object.defineProperty(window, 'visualViewport', { value: viewport, configurable: true });
	});
});

test('keeps the shell, secondary pages and a portaled dialog in the visual viewport without resizing the layout viewport', async ({
	page
}) => {
	await page.goto('/Chronos/');
	await page.getByRole('tab', { name: '我的', exact: true }).click();
	await visualViewport(page, 420, 80);
	await expect
		.poll(async () => (await page.locator('.shell-page').boundingBox())!.height)
		.toBe(420);
	const bounds = (await page.locator('.shell-tab-bar').boundingBox())!;
	expect(bounds.y + bounds.height).toBe(500);
	expect(await page.evaluate(() => innerHeight)).toBe(932);
	await page.getByText('显示设置', { exact: true }).click();
	await expect
		.poll(async () => (await page.locator('.secondary-page').boundingBox())!.height)
		.toBe(420);
	expect((await page.locator('.secondary-page').boundingBox())!.y).toBe(80);
	await page.goto('/Chronos/plugins');
	await page.getByRole('tab', { name: '插件市场', exact: true }).click();
	await page.getByRole('button', { name: '从链接安装', exact: true }).click();
	const dialog = page.getByRole('dialog', { name: '从链接安装', exact: true });
	await dialog.getByRole('textbox').fill('https://example.com/manifest.json');
	await visualViewport(page, 320, 120);
	await expect
		.poll(async () => {
			const rect = (await dialog.boundingBox())!;
			return rect.y >= 120 && rect.y + rect.height <= 440;
		})
		.toBe(true);
	await expect(dialog.getByRole('button', { name: '取消', exact: true })).toBeInViewport({
		ratio: 1
	});
	await dialog.getByRole('button', { name: '取消', exact: true }).click();
	await visualViewport(page, 932, 0);
	await expect
		.poll(async () => (await page.locator('.secondary-page').boundingBox())!.height)
		.toBe(932);
	await visualViewport(page, 400, 100, 2);
	await expect(page.locator('.secondary-page')).toHaveCSS('height', '932px');
});

test('timetable content and a portaled sheet follow keyboard resizing and recover after dismissal', async ({
	page
}) => {
	await page.goto(`/Chronos/s#${payload}`);
	await page.getByRole('button', { name: '导入为新课程表', exact: true }).click();
	const pager = page.locator('.timetable-week-pager');
	await expect(pager).toBeVisible();
	await page.locator('.course-capsule').first().click();
	const sheet = page.getByRole('dialog', { name: '课程详情', exact: true });
	await expect(sheet).toBeVisible();
	await visualViewport(page, 420, 80);
	await expect
		.poll(async () => {
			const bounds = (await sheet.boundingBox())!;
			return Math.abs(bounds.y + bounds.height - 500) < 1 && bounds.y >= 80;
		})
		.toBe(true);
	const pagerBounds = (await pager.boundingBox())!;
	expect(pagerBounds.y).toBeGreaterThanOrEqual(80);
	expect(pagerBounds.y + pagerBounds.height).toBeLessThanOrEqual(500);
	await page.keyboard.press('Escape');
	await expect(sheet).toBeHidden();
	await visualViewport(page, 932, 0);
	await expect
		.poll(async () => {
			const bounds = (await page.locator('.shell-tab-bar').boundingBox())!;
			return bounds.y + bounds.height;
		})
		.toBe(932);
});
