import { expect, test } from '@playwright/test';
import fixture from '../../packages/core/tests/fixtures/timetable.json' with { type: 'json' };
import type { Timetable } from '../../packages/core/src/domain/timetable';
import { encodeSharePayload } from '../../packages/plugins/codec-share/src/share-link/chronos-share-link-codec.ts';

const courseNames = [
	'操作系统',
	'毛泽东思想和中国特色社会主义理论体系概论',
	'深度学习（双语）',
	'数据库原理及应用',
	'物联网感知与控制技术',
	'物联网通信技术',
	'形势与政策5',
	'移动开发技术及应用',
	'编译原理',
	'软件工程导论',
	'计算机网络'
];

const largeTimetable: Timetable = {
	...fixture,
	name: '2026 春季课表',
	courses: courseNames.map((name, index) => ({
		...fixture.courses[0]!,
		id: `confirm-course-${index}`,
		name,
		dayOfWeek: (index % 5) + 1,
		startPeriod: 1,
		endPeriod: 2,
		weeks: [1, 2, 3, 4]
	}))
};

const largePayload = await encodeSharePayload(largeTimetable);
const existingPayload = await encodeSharePayload({ ...fixture, name: '现有课表 A' } as Timetable);

test('collapses long course capsule lists and disables overwrite when no timetable exists', async ({
	page,
	request
}) => {
	await page.setViewportSize({ width: 390, height: 844 });
	await request.post('/__e2e/deploy?build=old');
	await page.addInitScript(() =>
		localStorage.setItem('chronos:/Chronos:chronos:onboarding-seen', '1')
	);

	await page.goto(`/Chronos/s#${largePayload}`);
	await expect(page.getByRole('heading', { name: largeTimetable.name, exact: true })).toBeVisible();
	await expect(page.getByText('11 门', { exact: true })).toBeVisible();
	await expect(page.getByText('1–16 周', { exact: true })).toBeVisible();
	await expect(page.getByText('2026/03/02', { exact: true })).toBeVisible();

	const courseItems = page.locator('ul[role="list"] > li.course-capsule');
	await expect(courseItems).toHaveCount(8);

	const expandButton = page.getByRole('button', { name: '展开其余 3 门课程', exact: true });
	await expect(expandButton).toHaveAttribute('aria-expanded', 'false');
	await expandButton.click();

	await expect(courseItems).toHaveCount(11);
	const collapseButton = page.getByRole('button', { name: '收起部分课程', exact: true });
	await expect(collapseButton).toHaveAttribute('aria-expanded', 'true');
	await collapseButton.click();
	await expect(courseItems).toHaveCount(8);

	const overwriteRadio = page.getByRole('radio', { name: '覆盖当前课程表', exact: true });
	await expect(overwriteRadio).toBeDisabled();
	await expect(page.getByText('当前没有可覆盖的课程表', { exact: true })).toBeVisible();
	expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
});

test('shows overwrite caution notice and danger CTA when switching to overwrite mode', async ({
	page,
	request
}) => {
	await page.setViewportSize({ width: 390, height: 844 });
	await request.post('/__e2e/deploy?build=old');
	await page.addInitScript(() =>
		localStorage.setItem('chronos:/Chronos:chronos:onboarding-seen', '1')
	);

	await page.goto(`/Chronos/s#${existingPayload}`);
	await page.getByRole('button', { name: '导入为新课程表', exact: true }).click();
	await expect(page.locator('.timetable-week-pager')).toBeVisible();

	await page.goto(`/Chronos/s#${largePayload}`);
	await expect(page.getByText('当前课程表：现有课表 A', { exact: true })).toBeVisible();

	const asNewButton = page.getByRole('button', { name: '导入为新课程表', exact: true });
	await expect(asNewButton).toHaveClass(/ui-btn-filled/);
	await expect(page.getByRole('note')).toHaveCount(0);

	await page
		.locator('label')
		.filter({ has: page.getByRole('radio', { name: '覆盖当前课程表', exact: true }) })
		.click();

	await expect(page.getByRole('radio', { name: '覆盖当前课程表', exact: true })).toBeChecked();
	await expect(
		page.getByRole('note').filter({
			hasText: '将替换「现有课表 A」的全部课程与设置，此操作不可撤销。'
		})
	).toBeVisible();
	const overwriteButton = page.getByRole('button', { name: '覆盖当前课程表', exact: true });
	await expect(overwriteButton).toHaveClass(/ui-btn-danger/);

	await page
		.locator('label')
		.filter({ has: page.getByRole('radio', { name: '作为新课程表导入', exact: true }) })
		.click();

	await expect(page.getByRole('radio', { name: '作为新课程表导入', exact: true })).toBeChecked();
	await expect(page.getByRole('note')).toHaveCount(0);
	await expect(page.getByRole('button', { name: '导入为新课程表', exact: true })).toHaveClass(
		/ui-btn-filled/
	);
});
