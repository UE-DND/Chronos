import { expect, test } from '@playwright/test';
import fixture from '../../packages/core/tests/fixtures/timetable.json' with { type: 'json' };
import { encodeSharePayload } from '../../packages/plugins/codec-share/src/share-link/chronos-share-link-codec.ts';
import type { Timetable } from '../../packages/core/src/domain/timetable';

const timetable: Timetable = {
	...fixture,
	courses: [
		{ ...fixture.courses[0]!, id: 'range', name: '双节课程', startPeriod: 9, endPeriod: 10 },
		{ ...fixture.courses[0]!, id: 'single', name: '单节课程', startPeriod: 11, endPeriod: 11 },
		{ ...fixture.courses[0]!, id: 'late-range', name: '晚间课程', startPeriod: 14, endPeriod: 15 }
	],
	academicConfig: {
		...fixture.academicConfig,
		periodTimes: [
			...fixture.academicConfig.periodTimes,
			{ index: 5, startTime: '12:00', endTime: '12:45' },
			{ index: 6, startTime: '13:00', endTime: '13:45' },
			{ index: 7, startTime: '14:00', endTime: '14:45' },
			{ index: 8, startTime: '15:00', endTime: '15:45' },
			{ index: 9, startTime: '19:00', endTime: '19:45' },
			{ index: 10, startTime: '19:50', endTime: '20:35' },
			{ index: 11, startTime: '20:40', endTime: '21:25' },
			{ index: 12, startTime: '21:30', endTime: '22:15' },
			{ index: 13, startTime: '22:20', endTime: '22:55' },
			{ index: 14, startTime: '23:00', endTime: '23:15' },
			{ index: 15, startTime: '23:20', endTime: '23:35' },
			{ index: 16, startTime: '23:40', endTime: '23:55' }
		]
	}
};
const payload = await encodeSharePayload(timetable);

for (const locale of ['zh-CN', 'en-US']) {
	test.describe(`Today typography ${locale}`, () => {
		test.use({ locale, timezoneId: 'Asia/Shanghai' });
		test('keeps period badges compact with sixteen daily periods and maximum font size', async ({
			page,
			context,
			request
		}, testInfo) => {
			await request.post('/__e2e/deploy?build=old');
			await page.clock.setFixedTime(new Date('2026-03-02T18:50:00+08:00'));
			await page.addInitScript(() =>
				localStorage.setItem('chronos:/Chronos:chronos:onboarding-seen', '1')
			);
			await context.route('https://ue-dnd.github.io/Chronos/plugins/releases/**', async (route) => {
				const url = new URL(route.request().url());
				const path = url.pathname.replace('/Chronos/plugins/releases/', '/__e2e/market/');
				const response = await route.fetch({ url: `http://127.0.0.1:4179${path}${url.search}` });
				await route.fulfill({ response });
			});
			await page.goto(`/Chronos/s#${payload}`);
			await page
				.getByRole('button', {
					name: locale === 'zh-CN' ? '导入为新课程表' : 'Import as new timetable',
					exact: true
				})
				.click();
			await expect(page).toHaveURL(/\/Chronos\/$/);
			await page.goto('/Chronos/plugins');
			await page
				.getByRole('tab', { name: locale === 'zh-CN' ? '插件市场' : 'Marketplace', exact: true })
				.click();
			const plugin = page
				.locator('div.flex.items-center.justify-between')
				.filter({ has: page.getByText(locale === 'zh-CN' ? '今日' : 'Today', { exact: true }) })
				.last();
			await plugin
				.getByRole('button', { name: locale === 'zh-CN' ? '安装' : 'Install', exact: true })
				.click();
			await expect(
				plugin.getByText(locale === 'zh-CN' ? '已安装' : 'Installed', { exact: true })
			).toBeVisible();

			for (const scale of ['1', '1.3']) {
				await page.evaluate((value) => {
					localStorage.setItem('chronos:/Chronos:chronos_preferences:font_size_scale', value);
				}, scale);
				for (const width of [320, 390, 1280]) {
					await page.setViewportSize({ width, height: 900 });
					await page.goto('/Chronos/plugins/tool-today');
					await expect(page.locator('html')).toHaveCSS('--font-size-scale', scale);
					const labels =
						locale === 'zh-CN'
							? ['第 9-10 节', '第 11 节', '第 14-15 节']
							: ['Periods 9-10', 'Period 11', 'Periods 14-15'];
					const expectedNumbers = [['9', '10'], ['11'], ['14', '15']];
					for (const [index, label] of labels.entries()) {
						const period = page.getByRole('img', { name: label, exact: true });
						await expect(period).toBeVisible();
						const layout = await period.evaluate((element) => {
							const badges = Array.from(element.querySelectorAll('span')).filter((badge) =>
								badge.textContent?.trim()
							);
							const rects = badges.map((badge) => badge.getBoundingClientRect());
							const container = element.getBoundingClientRect();
							const rem = parseFloat(getComputedStyle(document.documentElement).fontSize);
							return {
								numbers: badges.map((badge) => badge.textContent!.trim()),
								uniform: rects.every((rect) => Math.abs(rect.width - 1.25 * rem) < 1),
								compact: container.width <= 3.5 * rem && container.height <= 1.5 * rem,
								fits: rects.every(
									(rect) => rect.left >= container.left && rect.right <= container.right
								)
							};
						});
						expect(layout).toEqual({
							numbers: expectedNumbers[index],
							uniform: true,
							compact: true,
							fits: true
						});
					}
					const connector = page
						.getByText('19:00', { exact: true })
						.filter({ visible: true })
						.locator('..');
					expect(
						await connector.evaluate((column) => {
							const [start, line, end] = Array.from(column.children).map((element) =>
								element.getBoundingClientRect()
							);
							return (
								line!.height > 0 &&
								line!.top > start!.bottom &&
								line!.bottom < end!.top &&
								Math.abs(line!.x + line!.width / 2 - (start!.x + start!.width / 2)) < 1 &&
								Math.abs(line!.x + line!.width / 2 - (end!.x + end!.width / 2)) < 1
							);
						})
					).toBe(true);
					await page.screenshot({ path: testInfo.outputPath(`today-${width}-${scale}.png`) });
				}
			}
		});
	});
}
