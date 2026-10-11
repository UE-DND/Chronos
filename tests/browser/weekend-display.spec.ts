import { expect, test, type Locator, type Page } from '@playwright/test';
import fixture from '../../packages/core/tests/fixtures/timetable.json' with { type: 'json' };
import type { Timetable } from '../../packages/core/src/domain/timetable';
import { encodeSharePayload } from '../../packages/plugins/codec-share/src/share-link/chronos-share-link-codec';

const source: Timetable = {
	...fixture,
	name: '周末临时显示回归',
	academicConfig: { ...fixture.academicConfig, endWeek: 3 },
	courses: [
		{ ...fixture.courses[0]!, id: 'weekday', name: '工作日课程', weeks: [1, 2, 3] },
		{ ...fixture.courses[0]!, id: 'saturday', name: '周六课程', dayOfWeek: 6, weeks: [1, 2, 3] },
		{ ...fixture.courses[0]!, id: 'sunday', name: '周日课程', dayOfWeek: 7, weeks: [1, 2, 3] }
	]
};
const payload = await encodeSharePayload(source);

test.use({ viewport: { width: 430, height: 932 }, timezoneId: 'Asia/Shanghai' });

async function openOptions(page: Page, week: Locator) {
	const options = page.getByRole('button', { name: '布局选项', exact: true });
	if (!(await options.isVisible())) {
		const card = week.locator('.course-capsule[aria-label^="工作日课程"]');
		await card.hover();
		await page.mouse.down();
		await page.clock.runFor(500);
		await expect(page.locator('.timetable-delete-zone')).toBeVisible();
		await page.mouse.up();
	}
	await options.click();
	await expect(page.getByRole('dialog')).toBeVisible();
	return {
		saturday: page.getByRole('switch', { name: '显示周六', exact: true }),
		sunday: page.getByRole('switch', { name: '显示周日', exact: true })
	};
}

async function closeOptions(page: Page) {
	await page.keyboard.press('Escape');
	await expect(page.getByRole('dialog')).toHaveCount(0);
}

async function expectWeekend(week: Locator, saturday: boolean, sunday: boolean) {
	await expect(week.getByText('六', { exact: true })).toHaveCount(saturday ? 1 : 0);
	await expect(week.getByText('日', { exact: true })).toHaveCount(sunday ? 1 : 0);
	await expect(week.locator('.course-capsule[aria-label^="周六课程"]')).toHaveCount(
		saturday ? 1 : 0
	);
	await expect(week.locator('.course-capsule[aria-label^="周日课程"]')).toHaveCount(sunday ? 1 : 0);
}

test('temporary weekends follow midnight, week navigation and saved switches', async ({
	page,
	request
}, testInfo) => {
	await request.post('/__e2e/deploy?build=old');
	await page.clock.install({ time: new Date('2026-03-06T23:58:00+08:00') });
	await page.addInitScript(() =>
		localStorage.setItem('chronos:/Chronos:chronos:onboarding-seen', '1')
	);
	await page.goto(`/Chronos/s#${payload}`);
	await page.getByRole('button', { name: '导入为新课程表', exact: true }).click();
	const pager = page.locator('.timetable-week-pager');
	await expect(pager).toBeVisible();
	const firstWeek = pager.locator('.timetable-week-page').nth(0);
	const secondWeek = pager.locator('.timetable-week-page').nth(1);
	await expectWeekend(firstWeek, true, true);

	// Import derives enabled switches from the weekend courses; disable them through the real UI.
	let switches = await openOptions(page, firstWeek);
	await switches.saturday.click();
	await switches.sunday.click();
	await expect(switches.saturday).toHaveAttribute('aria-checked', 'false');
	await expect(switches.sunday).toHaveAttribute('aria-checked', 'false');
	await closeOptions(page);
	await expectWeekend(firstWeek, false, false);

	// Advance the existing day clock across midnight without a reload or visibility event.
	await page.clock.fastForward(2 * 60_000);
	await expectWeekend(firstWeek, true, false);
	await expectWeekend(secondWeek, false, false);
	switches = await openOptions(page, firstWeek);
	await expect(switches.saturday).toHaveAttribute('aria-checked', 'false');
	await expect(switches.sunday).toHaveAttribute('aria-checked', 'false');
	await switches.sunday.click();
	await closeOptions(page);
	await expectWeekend(firstWeek, true, true);
	await expectWeekend(secondWeek, false, true);
	switches = await openOptions(page, firstWeek);
	await switches.sunday.click();
	await closeOptions(page);
	await expectWeekend(firstWeek, true, false);

	await page.clock.fastForward(24 * 60 * 60_000);
	await expectWeekend(firstWeek, true, true);
	await pager.evaluate((node) => node.scrollTo({ left: node.clientWidth, behavior: 'instant' }));
	await expect
		.poll(() => pager.evaluate((node) => node.scrollLeft / node.clientWidth))
		.toBeCloseTo(1);
	await expectWeekend(secondWeek, false, false);
	await page.getByRole('tab', { name: '课表', exact: true }).click();
	await expect
		.poll(() => pager.evaluate((node) => node.scrollLeft / node.clientWidth))
		.toBeCloseTo(0);
	await expectWeekend(firstWeek, true, true);
	await page.screenshot({ path: testInfo.outputPath('sunday-temporary-columns.png') });

	// Reopening the app and settings must retain disabled switches even while both columns are shown.
	await page.reload();
	await expectWeekend(firstWeek, true, true);
	switches = await openOptions(page, firstWeek);
	await expect(switches.saturday).toHaveAttribute('aria-checked', 'false');
	await expect(switches.sunday).toHaveAttribute('aria-checked', 'false');
	await closeOptions(page);
	await page.clock.fastForward(24 * 60 * 60_000);
	await expectWeekend(firstWeek, false, false);
	await page.keyboard.press('Escape');
	await page.getByRole('tab', { name: '课表', exact: true }).click();
	await expect
		.poll(() => pager.evaluate((node) => node.scrollLeft / node.clientWidth))
		.toBeCloseTo(1);
	await expectWeekend(secondWeek, false, false);
});
