import { expect, test, type Page, type Locator } from '@playwright/test';
import fixture from '../../packages/core/tests/fixtures/timetable.json' with { type: 'json' };
import { encodeSharePayload } from '../../packages/plugins/codec-share/src/share-link/chronos-share-link-codec.ts';
import type { Timetable } from '../../packages/core/src/domain/timetable';
import { PREFERENCE_STORAGE_KEYS } from '../../packages/core/src/domain/preferences';

const timetable: Timetable = {
	...fixture,
	name: '课程边框高亮',
	courses: [
		{ ...fixture.courses[0]!, id: 'current', name: '今天跨节', weeks: [1, 2] },
		{ ...fixture.courses[0]!, id: 'other-day', name: '明天同节', dayOfWeek: 2, weeks: [1, 2] },
		{
			...fixture.courses[0]!,
			id: 'later',
			name: '今天后续',
			startPeriod: 3,
			endPeriod: 3,
			weeks: [1, 2]
		},
		{
			...fixture.courses[0]!,
			id: 'future',
			name: '未来周课程',
			startPeriod: 4,
			endPeriod: 4,
			weeks: [2]
		}
	]
};
const payload = await encodeSharePayload(timetable);
const current = (root: Locator) => root.locator('.course-capsule[data-current-course]');
const card = (root: Locator, name: string) =>
	root.locator('.course-capsule').filter({ hasText: name });

test.use({
	viewport: { width: 430, height: 932 },
	isMobile: true,
	hasTouch: true,
	timezoneId: 'Asia/Shanghai'
});

async function setTime(page: Page, time: string) {
	await page.clock.setFixedTime(new Date(time));
	await page.evaluate(() => document.dispatchEvent(new Event('visibilitychange')));
}

async function expectPrimaryBorder(capsule: Locator) {
	const colors = await capsule.evaluate((node) => {
		const probe = document.createElement('span');
		probe.style.color = 'var(--color-primary)';
		document.body.append(probe);
		const result = {
			border: getComputedStyle(node).borderColor,
			primary: getComputedStyle(probe).color
		};
		probe.remove();
		return result;
	});
	expect(colors.border).toBe(colors.primary);
	await expect(capsule).toHaveCSS('border-top-width', '1px');
	await expect(capsule).toHaveCSS('box-shadow', /0px 0px 0px 1px inset/);
}

test.beforeEach(async ({ page, request }) => {
	await request.post('/__e2e/deploy?build=old');
	await page.clock.setFixedTime(new Date('2026-03-02T08:10:00+08:00'));
	await page.addInitScript(() => localStorage.setItem('chronos:onboarding-seen', '1'));
});

async function importTimetable(page: Page, source: Timetable = timetable) {
	const share = source === timetable ? payload : await encodeSharePayload(source);
	await page.goto(`/Chronos/s#${share}`);
	await page.getByRole('button', { name: '导入为新课程表', exact: true }).click();
	await expect(page.locator('.timetable-week-pager')).toBeVisible();
}

test('switch, live time and week changes highlight only the current course', async ({ page }) => {
	await importTimetable(page);
	const pager = page.locator('.timetable-week-pager');
	const week = pager.locator('.timetable-week-page').first();
	await expect(current(pager)).toHaveCount(0);
	const before = await card(week, '今天跨节').boundingBox();

	await page.goto('/Chronos/display-settings');
	const toggle = page.getByRole('switch', { name: '高亮当前节次', exact: true });
	await expect(toggle).toHaveAttribute('aria-checked', 'false');
	await toggle.click();
	await expect(toggle).toHaveAttribute('aria-checked', 'true');
	await page.getByRole('button', { name: '返回', exact: true }).click();
	await page.getByRole('tab', { name: '课表', exact: true }).click();
	await expect(current(pager)).toHaveCount(1);
	await expect(current(week)).toContainText('今天跨节');
	await expectPrimaryBorder(current(week));
	const after = await current(week).boundingBox();
	expect(after?.width).toBe(before?.width);
	expect(after?.height).toBe(before?.height);
	await expect(pager.locator('.period-active')).toHaveCount(0);
	await expect(week.locator('aside .timetable-chrome-side-time')).toHaveCount(4);
	await expect(card(week, '明天同节')).not.toHaveAttribute('data-current-course');
	await expect(card(week, '未来周课程')).toHaveCount(0);

	await setTime(page, '2026-03-02T08:50:00+08:00');
	await expect(current(pager)).toHaveCount(0);
	await setTime(page, '2026-03-02T09:10:00+08:00');
	await expect(current(week)).toContainText('今天跨节');
	await setTime(page, '2026-03-02T10:10:00+08:00');
	await expect(current(week)).toContainText('今天后续');

	// Move through the real pager's scroll handler and wait for its state.
	await pager.evaluate((node) => node.scrollTo({ left: node.clientWidth, behavior: 'instant' }));
	await expect
		.poll(() => pager.evaluate((node) => node.scrollLeft / node.clientWidth))
		.toBeCloseTo(1);
	await expect(current(pager.locator('.timetable-week-page').nth(1))).toHaveCount(0);
	await page.locator('#week-indicator').click();
	await expect
		.poll(() => pager.evaluate((node) => node.scrollLeft / node.clientWidth))
		.toBeCloseTo(0);
	await expect(current(week)).toContainText('今天后续');

	await setTime(page, '2026-03-02T12:00:00+08:00');
	await expect(current(pager)).toHaveCount(0);
	await setTime(page, '2026-03-03T08:10:00+08:00');
	await expect(current(week)).toContainText('明天同节');

	await page.goto('/Chronos/display-settings');
	await toggle.click();
	await expect(toggle).toHaveAttribute('aria-checked', 'false');
	await page.getByRole('button', { name: '返回', exact: true }).click();
	await page.getByRole('tab', { name: '课表', exact: true }).click();
	await expect(current(pager)).toHaveCount(0);
});

test('overlap placeholders stay neutral and expanded current courses each get a border', async ({
	page
}) => {
	await page.addInitScript((key) => {
		if (localStorage.getItem(key) === null) localStorage.setItem(key, '1');
	}, PREFERENCE_STORAGE_KEYS.currentPeriodHighlightEnabled);
	await importTimetable(page, {
		...timetable,
		courses: [timetable.courses[0]!, { ...timetable.courses[0]!, id: 'overlap', name: '重叠课程' }]
	});
	const week = page.locator('.timetable-week-page').first();
	const placeholder = week.getByRole('button', { name: /2 门课程重叠/ });
	await expect(placeholder).toBeVisible();
	await expect(placeholder).not.toHaveAttribute('data-current-course');
	await expect(current(week)).toHaveCount(0);
	await placeholder.click();
	await expect(current(week)).toHaveCount(2);
	await expectPrimaryBorder(current(week).nth(0));
	await expectPrimaryBorder(current(week).nth(1));
	await setTime(page, '2026-03-02T08:50:00+08:00');
	await expect(current(week)).toHaveCount(0);
});

for (const variant of [
	{ mode: 'light', layout: 'compact', corners: 'sharp' },
	{ mode: 'dark', layout: 'compact', corners: 'pill' },
	{ mode: 'light', layout: 'fixed', corners: 'pill' },
	{ mode: 'dark', layout: 'fixed', corners: 'sharp' }
]) {
	test(`border and wallpaper preview in ${variant.mode}/${variant.layout}/${variant.corners}`, async ({
		page
	}, testInfo) => {
		await page.addInitScript(
			({ keys, variant }) => {
				if (localStorage.getItem(keys.themeMode) !== null) return;
				localStorage.setItem(keys.currentPeriodHighlightEnabled, '1');
				localStorage.setItem(keys.themeMode, variant.mode);
				localStorage.setItem(keys.timetableLayoutMode, variant.layout);
				localStorage.setItem(keys.capsuleCornerStyle, variant.corners);
			},
			{ keys: PREFERENCE_STORAGE_KEYS, variant }
		);
		await importTimetable(page);
		const pager = page.locator('.timetable-week-pager');
		await expect(current(pager)).toHaveCount(1);
		await expectPrimaryBorder(current(pager));
		await page.screenshot({ path: testInfo.outputPath('main.png') });

		await page.goto('/Chronos/wallpaper/preview');
		const data = await page.evaluate(() => {
			const canvas = document.createElement('canvas');
			canvas.width = 430;
			canvas.height = 932;
			const context = canvas.getContext('2d')!;
			context.fillStyle = '#c5b6a0';
			context.fillRect(0, 0, 430, 932);
			return canvas.toDataURL('image/png').split(',')[1];
		});
		await page.locator('input[type=file]').setInputFiles({
			name: 'highlight.png',
			mimeType: 'image/png',
			buffer: Buffer.from(data, 'base64')
		});
		const preview = page.getByRole('region', { name: '课表预览', exact: true });
		await expect(current(preview)).toHaveCount(1);
		await expectPrimaryBorder(current(preview));
		await expect(preview.locator('.period-active')).toHaveCount(0);
		await page.screenshot({ path: testInfo.outputPath('crop-preview.png') });
		await setTime(page, '2026-03-02T08:50:00+08:00');
		await expect(current(preview)).toHaveCount(0);
		await setTime(page, '2026-03-02T09:10:00+08:00');
		await expect(current(preview)).toHaveCount(1);
		await page
			.getByRole('button', { name: '确认裁剪', exact: true })
			.filter({ visible: true })
			.click();
		await expect(page.getByLabel('画布裁剪手势', { exact: true })).toHaveCount(0);
		await expect(current(preview)).toHaveCount(1);
		await expectPrimaryBorder(current(preview));
		await page.screenshot({ path: testInfo.outputPath('wallpaper-preview.png') });

		await page.goto('/Chronos/display-settings');
		await page.getByRole('switch', { name: '高亮当前节次', exact: true }).click();
		await page.goto('/Chronos/wallpaper/preview');
		await expect(preview).toBeVisible();
		await expect(current(preview)).toHaveCount(0);
	});
}
