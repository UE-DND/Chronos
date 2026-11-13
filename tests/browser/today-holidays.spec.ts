import { expect, test, type Page } from '@playwright/test';
import fixture from '../../packages/core/tests/fixtures/timetable.json' with { type: 'json' };
import { encodeSharePayload } from '../../packages/plugins/codec-share/src/share-link/chronos-share-link-codec.ts';
import type { Timetable } from '../../packages/core/src/domain/timetable';
import holidays from '../../packages/plugins/calendar-holidays/static/data/2026.json' with { type: 'json' };
import nextYearHolidays from '../../packages/plugins/calendar-holidays/static/data/2027.json' with { type: 'json' };

const timetable: Timetable = {
	...fixture,
	name: '节假日回归课表',
	academicConfig: { ...fixture.academicConfig, termStartDate: '2026-09-28' },
	courses: [{ ...fixture.courses[0]!, name: '节假日测试课程', dayOfWeek: 4, weeks: [1] }]
};
const payload = await encodeSharePayload(timetable);

async function readCalendarCache(page: Page) {
	return page.evaluate(async () => {
		const database = await new Promise<IDBDatabase>((resolve, reject) => {
			const request = indexedDB.open('chronos:/Chronos:db');
			request.onsuccess = () => resolve(request.result);
			request.onerror = () => reject(request.error);
		});
		try {
			return await new Promise<Record<
				string,
				{ years: Record<string, { holidays: { date: string; label: string }[] }> }
			> | null>((resolve, reject) => {
				const transaction = database.transaction('pluginData', 'readonly');
				const request = transaction
					.objectStore('pluginData')
					.get('tool-calendar-holidays:calendars');
				request.onsuccess = () =>
					resolve(request.result ? JSON.parse(request.result.valueJson) : null);
				request.onerror = () => reject(request.error);
			});
		} finally {
			database.close();
		}
	});
}

test.use({ viewport: { width: 430, height: 932 }, isMobile: true, hasTouch: true });

test('committed holidays survive offline reload, refresh another window and clear on uninstall', async ({
	page,
	context,
	request
}) => {
	await request.post('/__e2e/deploy?build=old');
	await page.clock.setFixedTime(new Date('2026-10-01T09:00:00+08:00'));
	await page.addInitScript(() =>
		localStorage.setItem('chronos:/Chronos:chronos:onboarding-seen', '1')
	);
	await context.route('https://ue-dnd.github.io/Chronos/plugins/releases/**', async (route) => {
		const url = new URL(route.request().url());
		const path = url.pathname.replace('/Chronos/plugins/releases/', '/__e2e/market/');
		const response = await route.fetch({ url: `http://127.0.0.1:4179${path}${url.search}` });
		await route.fulfill({ response });
	});
	await context.route(
		'https://fastly.jsdelivr.net/gh/NateScarlet/holiday-cn@master/2026.json',
		(route) => route.fulfill({ json: holidays })
	);
	await context.route(
		'https://fastly.jsdelivr.net/gh/NateScarlet/holiday-cn@master/2027.json',
		(route) => route.fulfill({ json: nextYearHolidays })
	);
	await page.goto(`/Chronos/s#${payload}`);
	await expect(page.getByRole('heading', { name: timetable.name })).toBeVisible();
	await page.getByRole('button', { name: '导入为新课程表', exact: true }).click();
	await expect(page).toHaveURL(/\/Chronos\/$/);
	await page.goto('/Chronos/plugins');
	await page.getByRole('tab', { name: '插件市场', exact: true }).click();
	for (const name of ['今日', '法定节假日']) {
		const row = page
			.locator('div.flex.items-center.justify-between')
			.filter({ has: page.getByText(name, { exact: true }) })
			.last();
		await row.getByRole('button', { name: '安装', exact: true }).click();
		await expect(row.getByText('已安装', { exact: true })).toBeVisible();
	}
	await page.goto('/Chronos/');
	await page.getByRole('tab', { name: '课表', exact: true }).click();
	const mainCourse = page
		.locator('.timetable-week-page')
		.first()
		.locator('.course-capsule')
		.filter({ hasText: '节假日测试课程' });
	await expect(mainCourse).toBeVisible();
	await expect(mainCourse).not.toHaveAttribute('aria-label', /放假/);
	await page.getByRole('tab', { name: '今日', exact: true }).click();
	await expect(
		page.locator('.plugin-screen-container').getByText('节假日测试课程', { exact: true })
	).toBeVisible();
	const other = await context.newPage();
	await other.clock.setFixedTime(new Date('2026-10-01T09:00:00+08:00'));
	await other.goto('/Chronos/');
	await other.getByRole('tab', { name: '今日', exact: true }).click();
	await expect(
		other.locator('.plugin-screen-container').getByText('节假日测试课程', { exact: true })
	).toBeVisible();
	await page.getByRole('tab', { name: '我的', exact: true }).click();
	await page.getByText('法定节假日', { exact: true }).click();
	await page.getByRole('button', { name: '同步', exact: true }).click();
	await expect(page.getByRole('button', { name: '重新同步', exact: true })).toBeVisible();
	await expect
		.poll(async () =>
			Object.values((await readCalendarCache(page)) ?? {})[0]?.years['2026']?.holidays.some(
				(day) => day.date === '2026-10-01'
			)
		)
		.toBe(true);
	await expect(other.getByText('今天没有课', { exact: true })).toBeVisible();
	await page.goto('/Chronos/');
	await page.getByRole('tab', { name: '课表', exact: true }).click();
	await expect(mainCourse).toHaveAttribute('aria-label', /放假/);
	await expect(mainCourse).toHaveCSS('opacity', '0.4');
	await page.getByRole('tab', { name: '今日', exact: true }).click();
	await expect(page.getByText('今天没有课', { exact: true })).toBeVisible();
	await page.getByRole('tab', { name: '全部课表', exact: true }).click();
	await expect(page.getByText('今天没有课', { exact: true })).toBeVisible();
	await page.evaluate(async () => {
		await navigator.serviceWorker.ready;
	});
	await expect
		.poll(() => page.evaluate(() => navigator.serviceWorker.controller !== null))
		.toBe(true);
	await context.setOffline(true);
	await page.reload();
	await expect(page.getByText('今天没有课', { exact: true })).toBeVisible();
	await context.setOffline(false);
	await page.goto('/Chronos/plugins');
	const row = page
		.locator('div.flex.items-center.justify-between')
		.filter({ has: page.getByText('法定节假日', { exact: true }) })
		.last();
	await row.getByRole('button', { name: '卸载', exact: true }).click();
	await page.getByRole('dialog').getByRole('button', { name: '卸载', exact: true }).click();
	await expect(page.getByText('法定节假日', { exact: true })).toHaveCount(0);
	await expect.poll(() => readCalendarCache(page)).toBeNull();
	await expect(
		other.locator('.plugin-screen-container').getByText('节假日测试课程', { exact: true })
	).toBeVisible();
	await page.goto('/Chronos/');
	await page.getByRole('tab', { name: '课表', exact: true }).click();
	await expect(mainCourse).toBeVisible();
	await expect(mainCourse).not.toHaveAttribute('aria-label', /放假/);
	await expect(mainCourse).toHaveCSS('opacity', '1');
	await page.getByRole('tab', { name: '今日', exact: true }).click();
	await expect(
		page.locator('.plugin-screen-container').getByText('节假日测试课程', { exact: true })
	).toBeVisible();
	await page.goto('/Chronos/plugins');
	await page.getByRole('tab', { name: '插件市场', exact: true }).click();
	const reinstall = page
		.locator('div.flex.items-center.justify-between')
		.filter({ has: page.getByText('法定节假日', { exact: true }) })
		.last();
	await reinstall.getByRole('button', { name: '安装', exact: true }).click();
	await expect(reinstall.getByText('已安装', { exact: true })).toBeVisible();
	expect(await readCalendarCache(page)).toBeNull();
	await page.goto('/Chronos/');
	await page.getByRole('tab', { name: '今日', exact: true }).click();
	await expect(
		page.locator('.plugin-screen-container').getByText('节假日测试课程', { exact: true })
	).toBeVisible();
	await other.close();
});
