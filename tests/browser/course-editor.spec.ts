import { expect, test } from '@playwright/test';
import timetable from '../../packages/core/tests/fixtures/timetable.json' with { type: 'json' };
import { encodeSharePayload } from '../../packages/plugins/codec-share/src/share-link/chronos-share-link-codec.ts';
import type { Timetable } from '../../packages/core/src/domain/timetable';

const payload = await encodeSharePayload(timetable as Timetable);

for (const width of [430, 1280]) {
	test.describe(`course editor startup at ${width}px`, () => {
		test.use({ viewport: { width, height: 932 } });

		test('reloads an existing course and saves edits back to the timetable', async ({
			page,
			request
		}) => {
			await request.post('/__e2e/deploy?build=old');
			await page.goto('/Chronos/');
			await page.getByRole('button', { name: '跳过', exact: true }).click();
			await page.goto(`/Chronos/s#${payload}`);
			await page.getByRole('button', { name: '导入为新课程表', exact: true }).click();
			const pager = page.locator('.timetable-week-pager');
			await expect(pager).toBeVisible();
			const openCourse = async (name?: string) => {
				const index = await pager.evaluate((node) =>
					Math.round(node.scrollLeft / node.clientWidth)
				);
				const cards = pager.locator('.timetable-week-page').nth(index).locator('.course-capsule');
				await (name ? cards.filter({ hasText: name }) : cards.first()).click();
				await page.getByRole('button', { name: '编辑课程', exact: true }).click();
			};
			await openCourse();
			const nameField = page.getByRole('textbox', { name: '课程名称', exact: true });
			await expect(nameField).toBeVisible();
			const originalName = await nameField.inputValue();
			const editorUrl = page.url();
			await page.reload();
			await expect(nameField).toHaveValue(originalName);
			await expect(page.getByText('未找到课程', { exact: true })).toHaveCount(0);
			await nameField.fill('刷新后修改的课程');
			await page.getByRole('button', { name: '保存', exact: true }).click();
			await expect(pager).toBeVisible();
			await openCourse('刷新后修改的课程');
			await expect(nameField).toHaveValue('刷新后修改的课程');
			await page.goto(editorUrl);
			await expect(nameField).toHaveValue('刷新后修改的课程');

			await page.goto('/Chronos/timetable/course-editor?courseId=missing-course');
			await expect(page.getByText('未找到课程', { exact: true })).toBeVisible();
			await expect(page.getByRole('button', { name: '保存', exact: true })).toHaveCount(0);
			await page.goto('/Chronos/timetable/course-editor');
			await expect(nameField).toHaveValue('');
			await expect(page.getByRole('button', { name: '保存', exact: true })).toBeDisabled();
		});

		test('shows a missing course after startup with no timetable', async ({ page, request }) => {
			await request.post('/__e2e/deploy?build=old');
			await page.goto('/Chronos/');
			await page.getByRole('button', { name: '跳过', exact: true }).click();
			await page.goto('/Chronos/timetable/course-editor?courseId=missing-course');
			await expect(page.getByText('未找到课程', { exact: true })).toBeVisible();
			await expect(page.getByRole('button', { name: '保存', exact: true })).toHaveCount(0);
		});
	});
}
