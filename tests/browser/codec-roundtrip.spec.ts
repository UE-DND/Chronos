import { expect, test, type Page } from '@playwright/test';
import fixture from '../../packages/core/tests/fixtures/timetable.json' with { type: 'json' };
import type { Timetable } from '../../packages/core/src/domain/timetable';
import { encodeSharePayload } from '../../packages/plugins/codec-share/src/share-link/chronos-share-link-codec.ts';

const timetable: Timetable = {
	...fixture,
	name: '二维码整学期回归',
	courses: [
		{ ...fixture.courses[0]!, id: 'whole-semester', name: '整学期课程', weeks: [] },
		{ ...fixture.courses[2]!, id: 'first-week', name: '仅第一周课程', weeks: [1] }
	]
};
const payload = await encodeSharePayload(timetable);

async function storedWeeks(page: Page) {
	return page.evaluate(async () => {
		const database = await new Promise<IDBDatabase>((resolve, reject) => {
			const request = indexedDB.open('chronos:/Chronos:db');
			request.onsuccess = () => resolve(request.result);
			request.onerror = () => reject(request.error);
		});
		try {
			const courses = await new Promise<{ name: string; weeksCsv: string }[]>((resolve, reject) => {
				const request = database.transaction('courses').objectStore('courses').getAll();
				request.onsuccess = () => resolve(request.result);
				request.onerror = () => reject(request.error);
			});
			return {
				wholeSemester: courses
					.filter((course) => course.name === '整学期课程')
					.map((course) => course.weeksCsv),
				firstWeek: courses
					.filter((course) => course.name === '仅第一周课程')
					.map((course) => course.weeksCsv)
			};
		} finally {
			database.close();
		}
	});
}

test('QR PNG download and file import preserve whole-semester weeks after reload', async ({
	page,
	context,
	request
}, testInfo) => {
	await request.post('/__e2e/deploy?build=old');
	await page.clock.install({ time: new Date('2026-03-30T08:00:00+08:00') });
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
	await expect(page.getByRole('heading', { name: timetable.name })).toBeVisible();
	await page.getByRole('button', { name: '导入为新课程表', exact: true }).click();
	await expect(page).toHaveURL(/\/Chronos\/$/);
	await expect.poll(() => storedWeeks(page)).toEqual({ wholeSemester: [''], firstWeek: ['1'] });

	await page.goto('/Chronos/plugins');
	await page.getByRole('tab', { name: '插件市场', exact: true }).click();
	const plugin = page
		.locator('div.flex.items-center.justify-between')
		.filter({ has: page.getByText('二维码', { exact: true }) })
		.last();
	await plugin.getByRole('button', { name: '安装', exact: true }).click();
	await expect(plugin.getByText('已安装', { exact: true })).toBeVisible();

	await page.goto('/Chronos/transfer/export');
	await page.getByRole('tab', { name: '二维码', exact: true }).click();
	const downloadPromise = page.waitForEvent('download');
	await page.getByRole('button', { name: '导出为 二维码', exact: true }).click();
	const download = await downloadPromise;
	expect(download.suggestedFilename()).toBe(`${timetable.name}-qrcode.png`);
	const pngPath = testInfo.outputPath(download.suggestedFilename());
	await download.saveAs(pngPath);

	await page.goto('/Chronos/transfer/import');
	await page.getByRole('tab', { name: /^二维码/ }).click();
	const fileChooserPromise = page.waitForEvent('filechooser');
	await page.getByRole('button', { name: '选择图片', exact: true }).click();
	await (await fileChooserPromise).setFiles(pngPath);
	await expect(page.getByRole('heading', { name: timetable.name })).toBeVisible();
	await page.getByRole('button', { name: '作为新课程表导入', exact: true }).click();
	await page.getByRole('button', { name: '导入为新课程表', exact: true }).click();
	await expect(page).toHaveURL(/\/Chronos\/$/);
	await expect
		.poll(() => storedWeeks(page))
		.toEqual({ wholeSemester: ['', ''], firstWeek: ['1', '1'] });
	await page.reload();
	await expect(page.locator('.timetable-week-pager')).toBeVisible();
	expect(await storedWeeks(page)).toEqual({ wholeSemester: ['', ''], firstWeek: ['1', '1'] });
});
