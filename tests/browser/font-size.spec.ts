import { chromium, expect, test } from '@playwright/test';
import { PREFERENCE_STORAGE_KEYS } from './storage-keys';
import timetable from '../../packages/core/tests/fixtures/timetable.json' with { type: 'json' };
import { encodeSharePayload } from '../../packages/plugins/codec-share/src/share-link/chronos-share-link-codec.ts';
import type { Timetable } from '../../packages/core/src/domain/timetable';

test.use({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true });

for (const locale of ['zh-CN', 'en-US']) {
	test.describe(locale, () => {
		test.use({ locale });
		test('four steps preview, persist, reload and synchronize across windows', async ({
			page,
			context,
			request
		}, testInfo) => {
			await request.post('/__e2e/deploy?build=old');
			await page.addInitScript(() =>
				localStorage.setItem('chronos:/Chronos:chronos:onboarding-seen', '1')
			);
			await page.goto('/Chronos/display-settings');
			const slider = page.getByRole('slider', {
				name: locale === 'zh-CN' ? '字体大小' : 'Font size'
			});
			await expect(slider).toHaveValue('1');
			const font = () =>
				page.locator('html').evaluate((el) => parseFloat(getComputedStyle(el).fontSize));
			await expect.poll(font).toBe(15);
			const other = await context.newPage();
			await other.goto('/Chronos/display-settings');
			await expect(other.getByRole('slider')).toHaveValue('1');
			await slider.focus();
			await slider.press('Home');
			await expect.poll(font).toBe(13.5);
			await slider.press('End');
			await expect.poll(font).toBe(19.5);
			await expect
				.poll(() =>
					page.evaluate((key) => localStorage.getItem(key), PREFERENCE_STORAGE_KEYS.fontSizeScale)
				)
				.toBe('1.3');
			await expect(other.getByRole('slider')).toHaveValue('3');
			await page.reload();
			await expect(slider).toHaveValue('3');
			await expect.poll(font).toBe(19.5);
			await expect(slider).toHaveAttribute(
				'aria-valuetext',
				locale === 'zh-CN' ? '最大' : 'Largest'
			);
			await page.screenshot({ path: testInfo.outputPath('font-maximum.png'), fullPage: true });
			await slider.scrollIntoViewIfNeeded();
			const rect = (await slider.boundingBox())!;
			await page.mouse.move(rect.x + rect.width - 8, rect.y + rect.height / 2);
			await page.mouse.down();
			await page.mouse.move(rect.x + 8, rect.y + rect.height / 2);
			await expect(slider).toHaveValue('0');
			await expect.poll(font).toBe(13.5);
			expect(
				await page.evaluate(
					(key) => localStorage.getItem(key),
					PREFERENCE_STORAGE_KEYS.fontSizeScale
				)
			).toBe('1.3');
			await page.mouse.up();
			await expect
				.poll(() =>
					page.evaluate((key) => localStorage.getItem(key), PREFERENCE_STORAGE_KEYS.fontSizeScale)
				)
				.toBe('0.9');
			expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(
				true
			);
			await other.close();
		});
	});
}

test('large course text retains compact layout and full details', async ({
	page,
	request
}, testInfo) => {
	await request.post('/__e2e/deploy?build=old');
	await page.addInitScript(() =>
		localStorage.setItem('chronos:/Chronos:chronos:onboarding-seen', '1')
	);
	const source = structuredClone(timetable) as Timetable;
	for (const course of source.courses) course.name += ' · 一段用于验证大字号换行的完整课程名称';
	const payload = await encodeSharePayload(source);
	await page.goto(`/Chronos/s#${payload}`);
	await page.getByRole('button', { name: '导入为新课程表', exact: true }).click();
	await expect
		.poll(() =>
			page.evaluate((key) => localStorage.getItem(key), PREFERENCE_STORAGE_KEYS.currentTimetableId)
		)
		.not.toBeNull();
	await page.goto('/Chronos/');
	const card = page.locator('.timetable-week-page button.course-capsule').first();
	await expect(card).toBeVisible();
	const title = card.locator('span.break-all');
	const before = await title.evaluate((el) => parseFloat(getComputedStyle(el).fontSize));
	await page.goto('/Chronos/display-settings');
	const slider = page.getByRole('slider');
	await slider.focus();
	await slider.press('End');
	await expect
		.poll(() =>
			page.evaluate((key) => localStorage.getItem(key), PREFERENCE_STORAGE_KEYS.fontSizeScale)
		)
		.toBe('1.3');
	await page.goto('/Chronos/');
	await expect(card).toBeVisible();
	await expect(page.locator('.fit-layout').first()).toBeVisible();
	expect(await title.evaluate((el) => parseFloat(getComputedStyle(el).fontSize))).toBeGreaterThan(
		before
	);
	await page.screenshot({ path: testInfo.outputPath('compact-large.png') });
	await card.click();
	const detail = page.locator('h2');
	await expect(detail).toContainText('一段用于验证大字号换行的完整课程名称');
	await expect(detail).toHaveCSS('white-space', 'normal');
	await expect
		.poll(() =>
			page
				.getByRole('dialog')
				.evaluate((el) => new DOMMatrixReadOnly(getComputedStyle(el).transform).m42)
		)
		.toBe(0);
	await page.screenshot({ path: testInfo.outputPath('detail-large.png') });
	await page.keyboard.press('Escape');
	await expect(page.getByRole('dialog')).toBeHidden();
	await page.goto('/Chronos/display-settings');
	await page.getByText('滚动查看', { exact: true }).click();
	await expect
		.poll(() =>
			page.evaluate((key) => localStorage.getItem(key), PREFERENCE_STORAGE_KEYS.timetableLayoutMode)
		)
		.toBe('fixed');
	await page.goto('/Chronos/');
	await expect(card).toBeVisible();
	await expect(page.locator('.fit-layout')).toHaveCount(0);
	expect(await title.evaluate((el) => parseFloat(getComputedStyle(el).fontSize))).toBeGreaterThan(
		before
	);
	await page.screenshot({ path: testInfo.outputPath('scroll-large.png') });
});

test('failed saves restore the saved step, and clearing data restores standard text', async ({
	page,
	request
}) => {
	await request.post('/__e2e/deploy?build=old');
	await page.addInitScript(() =>
		localStorage.setItem('chronos:/Chronos:chronos:onboarding-seen', '1')
	);
	await page.goto('/Chronos/display-settings');
	await page.evaluate((key) => {
		const setItem = Object.getOwnPropertyDescriptor(Storage.prototype, 'setItem')!
			.value as Storage['setItem'];
		let failed = false;
		Storage.prototype.setItem = function (name, value) {
			if (name === key && !failed) {
				failed = true;
				throw new DOMException('Test failure', 'QuotaExceededError');
			}
			setItem.call(this, name, value);
		};
	}, PREFERENCE_STORAGE_KEYS.fontSizeScale);
	const slider = page.getByRole('slider');
	await slider.focus();
	await slider.press('End');
	await expect(page.getByRole('status').filter({ hasText: '设置保存失败，请重试' })).toBeVisible();
	await expect(slider).toHaveValue('1');
	await expect(page.locator('html')).toHaveCSS('font-size', '15px');
	await slider.press('End');
	await expect
		.poll(() =>
			page.evaluate((key) => localStorage.getItem(key), PREFERENCE_STORAGE_KEYS.fontSizeScale)
		)
		.toBe('1.3');
	await page.goto('/Chronos/about');
	await page.getByRole('button', { name: /清除所有数据 当前占用/ }).click();
	await page.getByRole('dialog').getByRole('button', { name: '清除', exact: true }).click();
	await expect(page.getByText('已清除所有数据', { exact: true })).toBeVisible();
	await expect(page.locator('html')).toHaveCSS('font-size', '15px');
	await page.goto('/Chronos/display-settings');
	await expect(slider).toHaveValue('1');
});

test('uses the browser default text size on the first rendered page', async ({ request }) => {
	await request.post('/__e2e/deploy?build=old');
	const browser = await chromium.launch({ args: ['--blink-settings=defaultFontSize=20'] });
	try {
		const page = await browser.newPage({ viewport: { width: 390, height: 844 } });
		await page.addInitScript(() => {
			localStorage.setItem('chronos:/Chronos:chronos:onboarding-seen', '1');
			localStorage.setItem('chronos:/Chronos:chronos_preferences:font_size_scale', '1.3');
			const changes: string[] = [];
			Object.defineProperty(window, 'fontScaleHistory', { value: changes });
			new MutationObserver(() => {
				const scale = document.documentElement?.style.getPropertyValue('--font-size-scale');
				if (scale) changes.push(scale);
			}).observe(document, { subtree: true, attributes: true, attributeFilter: ['style'] });
		});
		await page.goto('http://127.0.0.1:4179/Chronos/display-settings');
		await expect(page.getByRole('slider')).toHaveValue('3');
		await expect
			.poll(() => page.locator('html').evaluate((el) => parseFloat(getComputedStyle(el).fontSize)))
			.toBe(24.375);
		expect(await page.evaluate(() => Reflect.get(window, 'fontScaleHistory'))).not.toContain('1');
	} finally {
		await browser.close();
	}
});

test('maximum text size fits the Arknights theme in portrait and landscape', async ({
	page,
	context,
	request
}, testInfo) => {
	await request.post('/__e2e/deploy?build=old');
	await page.addInitScript(() => {
		localStorage.setItem('chronos:/Chronos:chronos:onboarding-seen', '1');
		localStorage.setItem('chronos:/Chronos:chronos_preferences:font_size_scale', '1.3');
	});
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
		.filter({ has: page.getByText('Arknights', { exact: true }) })
		.last();
	await row.getByRole('button', { name: '安装', exact: true }).click();
	await expect(row.getByText('已安装', { exact: true })).toBeVisible();
	await page.goto('/Chronos/wallpaper');
	await page
		.locator('label')
		.filter({ has: page.getByText('ArKnights', { exact: true }) })
		.click();
	await expect(page.locator('html')).toHaveClass(/chronos-theme-arknights/);
	await page.goto('/Chronos/display-settings');
	for (const viewport of [
		{ width: 390, height: 844 },
		{ width: 844, height: 390 }
	]) {
		await page.setViewportSize(viewport);
		await expect(page.getByRole('slider')).toHaveValue('3');
		await page.getByRole('slider').scrollIntoViewIfNeeded();
		expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(
			true
		);
		await page.screenshot({
			path: testInfo.outputPath(`arknights-font-${viewport.width}.png`),
			fullPage: true
		});
	}
});
