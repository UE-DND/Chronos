import { expect, test } from '@playwright/test';
import fixture from '../../packages/core/tests/fixtures/timetable.json' with { type: 'json' };
import { encodeSharePayload } from '../../packages/plugins/codec-share/src/share-link/chronos-share-link-codec.ts';
import type { Timetable } from '../../packages/core/src/domain/timetable';
import { courseToRow, timetableToRow } from '../../apps/web/src/lib/storage/mappers';

const current: Timetable = {
	...fixture,
	id: 'today-current',
	name: '早课课表',
	academicConfig: {
		...fixture.academicConfig,
		termStartDate: '2026-03-02',
		periodTimes: [{ index: 1, startTime: '08:00', endTime: '08:45' }]
	},
	courses: [
		{ ...fixture.courses[0]!, id: 'early', name: '早课', startPeriod: 1, endPeriod: 1, weeks: [1] }
	]
};
const other: Timetable = {
	...current,
	id: 'today-other',
	name: '晚课课表',
	academicConfig: {
		...current.academicConfig,
		periodTimes: [
			...current.academicConfig.periodTimes,
			{ index: 2, startTime: '09:00', endTime: '09:45' }
		]
	},
	courses: [{ ...current.courses[0]!, id: 'later', name: '晚课', startPeriod: 2, endPeriod: 2 }]
};
const payload = await encodeSharePayload(current);

for (const viewport of [
	{ name: 'mobile', width: 430, height: 932, isMobile: true },
	{ name: 'desktop', width: 1280, height: 800, isMobile: false }
]) {
	test.describe(viewport.name, () => {
		test.use({
			viewport: { width: viewport.width, height: viewport.height },
			isMobile: viewport.isMobile,
			hasTouch: viewport.isMobile,
			timezoneId: 'Asia/Shanghai'
		});
		test('Today uses each timetable time across scopes, routes and clock states', async ({
			page,
			context,
			request
		}, testInfo) => {
			const errors: string[] = [];
			page.on('pageerror', (error) => errors.push(error.message));
			await request.post('/__e2e/deploy?build=old');
			await page.clock.setFixedTime(new Date('2026-03-02T08:50:00+08:00'));
			await page.addInitScript(() => localStorage.setItem('chronos:onboarding-seen', '1'));
			await context.route('https://ue-dnd.github.io/Chronos/plugins/releases/**', async (route) => {
				const url = new URL(route.request().url());
				const path = url.pathname.replace('/Chronos/plugins/releases/', '/__e2e/market/');
				const response = await route.fetch({ url: `http://127.0.0.1:4179${path}${url.search}` });
				await route.fulfill({ response });
			});
			await page.goto(`/Chronos/s#${payload}`);
			await expect(page.getByRole('heading', { name: current.name })).toBeVisible();
			await page.getByRole('button', { name: '导入为新课程表', exact: true }).click();
			await expect(page).toHaveURL(/\/Chronos\/$/);
			await page.evaluate(
				async ({ timetable, courses }) => {
					const database = await new Promise<IDBDatabase>((resolve, reject) => {
						const request = indexedDB.open('chronos');
						request.onsuccess = () => resolve(request.result);
						request.onerror = () => reject(request.error);
					});
					try {
						await new Promise<void>((resolve, reject) => {
							const transaction = database.transaction(['timetables', 'courses'], 'readwrite');
							transaction.oncomplete = () => resolve();
							transaction.onabort = () => reject(transaction.error);
							transaction.objectStore('timetables').add(timetable);
							for (const course of courses) transaction.objectStore('courses').add(course);
						});
					} finally {
						database.close();
					}
				},
				{
					timetable: timetableToRow(other),
					courses: other.courses.map((course) => courseToRow(course, other.id))
				}
			);
			await page.goto('/Chronos/plugins');
			await page.getByRole('tab', { name: '插件市场', exact: true }).click();
			const plugin = page
				.locator('div.flex.items-center.justify-between')
				.filter({ has: page.getByText('今日', { exact: true }) })
				.last();
			await plugin.getByRole('button', { name: '安装', exact: true }).click();
			await expect(plugin.getByText('已安装', { exact: true })).toBeVisible();
			const courseRow = (name: string) =>
				page
					.locator('li')
					.filter({ has: page.getByText(name, { exact: true }) })
					.filter({ visible: true });
			const early = courseRow('早课');
			const later = courseRow('晚课');
			await page.goto('/Chronos/');
			await page.getByRole('tab', { name: '今日', exact: true }).click();
			await expect(early).toContainText('08:00');
			await expect(later).toHaveCount(0);
			await page.getByRole('tab', { name: '全部课表', exact: true }).click();
			await expect(later).toContainText('09:00');
			await expect(later).toContainText('09:45');
			await expect(later).toContainText('准备上课');
			await expect(early.getByRole('button')).toHaveClass(/opacity-60/);
			await page.screenshot({ path: testInfo.outputPath('today-preparing.png') });

			await page.goto('/Chronos/plugins/tool-today');
			await expect(later).toContainText('准备上课');
			await expect(later).toContainText('09:00');
			await page.getByRole('tab', { name: '当前课表', exact: true }).click();
			await expect(later).toHaveCount(0);
			await page.getByRole('button', { name: '返回', exact: true }).click();
			await expect(page).toHaveURL(/\/Chronos\/$/);
			await page.getByRole('tab', { name: '今日', exact: true }).click();
			await expect(page.getByRole('tab', { name: '当前课表', exact: true })).toHaveAttribute(
				'aria-selected',
				'true'
			);
			await page.getByRole('tab', { name: '全部课表', exact: true }).click();
			await expect(later).toContainText('准备上课');

			await page.goto('/Chronos/feedback-settings');
			await page.getByRole('button', { name: /提醒时间/ }).click();
			const wheel = page.getByRole('listbox', { name: '提醒时间' });
			await wheel.focus();
			await wheel.press('Home');
			await page.getByRole('button', { name: '确定', exact: true }).click();
			await page.goto('/Chronos/plugins/tool-today/index');
			await expect(later).toContainText('09:00');
			await expect(later.getByText('准备上课', { exact: true })).toHaveCount(0);

			await page.clock.setFixedTime(new Date('2026-03-02T09:10:00+08:00'));
			await page.reload();
			await expect(later).toContainText('上课中');
			await expect(early.getByRole('button')).toHaveClass(/opacity-60/);
			await page.goto('/Chronos/manage-timetables');
			const timetableOption = page.getByRole('button', { name: /晚课课表/ });
			await timetableOption.click();
			await expect(timetableOption.getByRole('radio')).toBeChecked();
			await page.goto('/Chronos/');
			await page.getByRole('tab', { name: '今日', exact: true }).click();
			await page.getByRole('tab', { name: '当前课表', exact: true }).click();
			await expect(early).toHaveCount(0);
			await expect(later).toContainText('上课中');
			await expect(later).toContainText('09:45');
			await page.getByRole('tab', { name: '课表', exact: true }).click();
			await expect(page.getByText('晚课', { exact: true }).filter({ visible: true })).toBeVisible();
			await page.getByRole('tab', { name: '今日', exact: true }).click();
			await expect(later).toContainText('上课中');

			await page.clock.setFixedTime(new Date('2026-03-02T10:00:00+08:00'));
			await page.reload();
			await page.getByRole('tab', { name: '今日', exact: true }).click();
			await page.getByRole('tab', { name: '全部课表', exact: true }).click();
			await expect(later.getByRole('button')).toHaveClass(/opacity-60/);
			await expect(later.getByText('上课中', { exact: true })).toHaveCount(0);
			await expect(later).toContainText('09:00');
			await page.clock.setFixedTime(new Date('2026-03-03T09:10:00+08:00'));
			await page.reload();
			await page.getByRole('tab', { name: '今日', exact: true }).click();
			await expect(page.getByText('今天没有课', { exact: true })).toBeVisible();
			await page.getByRole('tab', { name: '当前课表', exact: true }).click();
			await expect(page.getByText('今天没有课', { exact: true })).toBeVisible();
			expect(errors).toEqual([]);
		});
	});
}
