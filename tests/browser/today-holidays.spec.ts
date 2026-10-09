import { expect, test } from '@playwright/test';
import fixture from '../../packages/core/tests/fixtures/timetable.json' with { type: 'json' };
import { encodeSharePayload } from '../../packages/plugins/codec-share/src/share-link/chronos-share-link-codec.ts';
import type { Timetable } from '../../packages/core/src/domain/timetable';
import holidays from '../../packages/plugins/calendar-holidays/static/data/2026.json' with { type: 'json' };

const timetable: Timetable = {
	...fixture,
	name: '节假日回归课表',
	academicConfig: { ...fixture.academicConfig, termStartDate: '2026-09-28' },
	courses: [{ ...fixture.courses[0]!, name: '节假日测试课程', dayOfWeek: 4, weeks: [1] }]
};
const payload = await encodeSharePayload(timetable);

test.use({ viewport: { width: 430, height: 932 }, isMobile: true, hasTouch: true });

test('manual holiday sync clears Today courses and uninstall restores them', async ({
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
	await page.getByRole('tab', { name: '今日', exact: true }).click();
	await expect(page.getByText('节假日测试课程', { exact: true })).toBeVisible();
	await page.getByRole('tab', { name: '我的', exact: true }).click();
	await page.getByText('法定节假日', { exact: true }).click();
	await page.getByRole('button', { name: '同步', exact: true }).click();
	await expect(page.getByRole('button', { name: '重新同步', exact: true })).toBeVisible();
	await page.goto('/Chronos/');
	await page.getByRole('tab', { name: '今日', exact: true }).click();
	await expect(page.getByText('今天没有课', { exact: true })).toBeVisible();
	await page.getByRole('tab', { name: '全部课表', exact: true }).click();
	await expect(page.getByText('今天没有课', { exact: true })).toBeVisible();
	await page.goto('/Chronos/plugins');
	const row = page
		.locator('div.flex.items-center.justify-between')
		.filter({ has: page.getByText('法定节假日', { exact: true }) })
		.last();
	await row.getByRole('button', { name: '卸载', exact: true }).click();
	await page.getByRole('dialog').getByRole('button', { name: '卸载', exact: true }).click();
	await expect(page.getByText('法定节假日', { exact: true })).toHaveCount(0);
	await page.goto('/Chronos/');
	await page.getByRole('tab', { name: '今日', exact: true }).click();
	await expect(page.getByText('节假日测试课程', { exact: true })).toBeVisible();
});
