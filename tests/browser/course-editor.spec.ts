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

		test('stretches the segmented thumb before contracting without a second press layer', async ({
			page,
			request
		}) => {
			await request.post('/__e2e/deploy?build=old');
			await page.goto('/Chronos/');
			await page.getByRole('button', { name: '跳过', exact: true }).click();
			await page.goto(`/Chronos/s#${payload}`);
			await page.getByRole('button', { name: '导入为新课程表', exact: true }).click();
			await page.goto('/Chronos/timetable/course-editor');

			const thumb = page.locator('.ui-segmented-thumb');
			for (const name of ['指定周次', '整学期', '指定周次']) {
				const tab = page.getByRole('tab', { name, exact: true });
				await tab.scrollIntoViewIfNeeded();
				const box = await tab.boundingBox();
				if (!box) throw new Error('Recurrence tab has no bounding box');
				await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2);
				const initial = await thumb.boundingBox();
				if (!initial) throw new Error('Recurrence thumb has no bounding box');
				await page.mouse.down();
				const pressedBackground = await tab.evaluate((node) => {
					// Complete press feedback deterministically before releasing the pointer.
					for (const animation of node.getAnimations()) animation.finish();
					return getComputedStyle(node).backgroundColor;
				});
				expect(pressedBackground).toBe('rgba(0, 0, 0, 0)');
				await page.mouse.up();
				const released = await tab.evaluate((node) => ({
					background: getComputedStyle(node).backgroundColor,
					transitions: node
						.getAnimations()
						.map((animation) =>
							animation instanceof CSSTransition ? animation.transitionProperty : null
						)
				}));
				expect(released.background).toBe('rgba(0, 0, 0, 0)');
				expect(released.transitions).not.toContain('background-color');
				await expect(tab).toHaveAttribute('aria-selected', 'true');
				const stretched = await thumb.evaluate((node) => {
					for (const animation of node.getAnimations()) {
						animation.pause();
						animation.currentTime = 60;
					}
					return node.getBoundingClientRect().toJSON();
				});
				expect(stretched.width).toBeGreaterThan(initial.width + 10);
				if (name === '指定周次') expect(stretched.x).toBeCloseTo(initial.x, 0);
				else expect(stretched.right).toBeCloseTo(initial.x + initial.width, 0);
				await thumb.evaluate((node) => {
					for (const animation of node.getAnimations()) animation.finish();
				});
				const settled = await thumb.boundingBox();
				expect(settled?.width).toBeCloseTo(initial.width, 0);
			}
			const reversal = await thumb.evaluate(async (node) => {
				const track = node.parentElement!;
				const tabs = track.querySelectorAll<HTMLButtonElement>('[role="tab"]');
				tabs[0].click();
				await Promise.resolve();
				for (const animation of node.getAnimations()) {
					animation.pause();
					animation.currentTime = 130;
				}
				const before = node.getBoundingClientRect().toJSON();
				tabs[1].click();
				await Promise.resolve();
				const after = node.getBoundingClientRect().toJSON();
				for (const animation of node.getAnimations()) animation.finish();
				return { before, after, settled: node.getBoundingClientRect().toJSON() };
			});
			expect(reversal.after.x).toBeCloseTo(reversal.before.x, 0);
			expect(reversal.after.width).toBeCloseTo(reversal.before.width, 0);
			expect(reversal.settled.width).toBeLessThan(reversal.before.width);
			await expect(page.getByRole('tab', { name: '指定周次', exact: true })).toHaveAttribute(
				'aria-selected',
				'true'
			);

			await page.emulateMedia({ reducedMotion: 'reduce' });
			await page.getByRole('tab', { name: '整学期', exact: true }).click();
			expect(await thumb.evaluate((node) => node.getAnimations().length)).toBe(0);
			await expect(page.getByRole('tab', { name: '整学期', exact: true })).toHaveAttribute(
				'aria-selected',
				'true'
			);
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
