import { expect, test } from '@playwright/test';
import fixture from '../../packages/core/tests/fixtures/timetable.json' with { type: 'json' };
import { encodeSharePayload } from '../../packages/plugins/codec-share/src/share-link/chronos-share-link-codec.ts';
import type { Timetable } from '../../packages/core/src/domain/timetable';

const payload = (name: string) => encodeSharePayload({ ...fixture, name } as Timetable);

test('preserves concurrent course edits from two tabs in the same IndexedDB timetable', async ({
	page,
	context,
	request
}) => {
	await request.post('/__e2e/deploy?build=old');
	await context.addInitScript(() =>
		localStorage.setItem('chronos:/Chronos:chronos:onboarding-seen', '1')
	);
	await page.goto(`/Chronos/s#${await payload('并发编辑课表')}`);
	await page.getByRole('button', { name: '导入为新课程表', exact: true }).click();
	await expect(page.locator('.timetable-week-pager')).toBeVisible();
	const readCourses = () =>
		page.evaluate(async () => {
			const database = await new Promise<IDBDatabase>((resolve, reject) => {
				const request = indexedDB.open('chronos:/Chronos:db');
				request.onsuccess = () => resolve(request.result);
				request.onerror = () => reject(request.error);
			});
			try {
				return await new Promise<{ id: string; name: string }[]>((resolve, reject) => {
					const request = database.transaction('courses').objectStore('courses').getAll();
					request.onsuccess = () => resolve(request.result);
					request.onerror = () => reject(request.error);
				});
			} finally {
				database.close();
			}
		});
	const initialCourses = await readCourses();
	const edits = [
		{ id: initialCourses.find((course) => course.name === '线性代数')!.id, name: '窗口 A 修改' },
		{ id: initialCourses.find((course) => course.name === '大学英语')!.id, name: '窗口 B 修改' }
	];
	const other = await context.newPage();
	const tabs = [page, other];
	await Promise.all(
		tabs.map(async (tab, index) => {
			await tab.goto(`/Chronos/timetable/course-editor?courseId=${edits[index]!.id}`);
			await tab.getByRole('textbox', { name: '课程名称', exact: true }).fill(edits[index]!.name);
		})
	);
	await Promise.all(
		tabs.map((tab) => tab.getByRole('button', { name: '保存', exact: true }).click())
	);
	for (const tab of tabs) await expect(tab.locator('.timetable-week-pager')).toBeVisible();
	await expect
		.poll(async () => {
			const courses = await readCourses();
			return edits.map((edit) => courses.find((course) => course.id === edit.id)?.name);
		})
		.toEqual(edits.map((edit) => edit.name));
	for (const tab of tabs) {
		await tab.reload();
		for (const edit of edits) {
			await tab.goto(`/Chronos/timetable/course-editor?courseId=${edit.id}`);
			await expect(tab.getByRole('textbox', { name: '课程名称', exact: true })).toHaveValue(
				edit.name
			);
		}
	}
});

test('synchronizes the overwrite target across tabs and preserves the other timetable', async ({
	page,
	context,
	request
}) => {
	await request.post('/__e2e/deploy?build=old');
	await context.addInitScript(() =>
		localStorage.setItem('chronos:/Chronos:chronos:onboarding-seen', '1')
	);
	for (const name of ['课表 A', '课表 B']) {
		await page.goto(`/Chronos/s#${await payload(name)}`);
		await page.getByRole('button', { name: '导入为新课程表', exact: true }).click();
		await expect(page.locator('.timetable-week-pager')).toBeVisible();
	}
	await page.goto('/Chronos/manage-timetables');
	await page.getByRole('button', { name: /课表 A/ }).click();
	await expect(page.getByRole('button', { name: /课表 A/ }).locator('input')).toBeChecked();
	const other = await context.newPage();
	await other.goto(`/Chronos/s#${await payload('导入 C')}`);
	await expect(other.getByText('当前课程表：课表 A', { exact: true })).toBeVisible();
	await page.getByRole('button', { name: /课表 B/ }).click();
	await expect(other.getByText('当前课程表：课表 B', { exact: true })).toBeVisible();
	await other.getByRole('button', { name: /覆盖当前课程表/ }).click();
	await other.getByRole('button', { name: '覆盖当前课程表', exact: true }).click();
	await expect(other.locator('.timetable-week-pager')).toBeVisible();
	await other.goto('/Chronos/manage-timetables');
	await expect(other.getByRole('button', { name: /课表 A/ })).toBeVisible();
	await expect(other.getByRole('button', { name: /导入 C/ })).toBeVisible();
	await expect(other.getByRole('button', { name: /课表 B/ })).toHaveCount(0);
	await other.reload();
	await expect(other.getByRole('button', { name: /课表 A/ })).toBeVisible();
	await expect(other.getByRole('button', { name: /导入 C/ }).locator('input')).toBeChecked();
});

test('pins the deletion target across tabs and broadcasts deletion of an inactive timetable', async ({
	page,
	context,
	request
}) => {
	await request.post('/__e2e/deploy?build=old');
	await context.addInitScript(() =>
		localStorage.setItem('chronos:/Chronos:chronos:onboarding-seen', '1')
	);
	for (const name of ['课表 A', '课表 B']) {
		await page.goto(`/Chronos/s#${await payload(name)}`);
		await page.getByRole('button', { name: '导入为新课程表', exact: true }).click();
		await expect(page.locator('.timetable-week-pager')).toBeVisible();
	}
	await page.goto('/Chronos/manage-timetables');
	await page.getByRole('button', { name: /课表 A/ }).click();
	await expect(page.getByRole('button', { name: /课表 A/ }).locator('input')).toBeChecked();
	await page.getByRole('button', { name: '删除课表', exact: true }).click();
	const dialog = page.getByRole('dialog');
	await expect(dialog).toContainText('课表 A');
	const other = await context.newPage();
	await other.goto('/Chronos/manage-timetables');
	await other.getByRole('button', { name: /课表 B/ }).click();
	await expect(page.getByRole('button', { name: /课表 B/ }).locator('input')).toBeChecked();
	await expect(dialog).toContainText('课表 A');
	await expect(dialog).not.toContainText('课表 B');
	const activeBefore = await other.evaluate(() =>
		localStorage.getItem('chronos:/Chronos:chronos_preferences:current_timetable_id')
	);
	await dialog.getByRole('button', { name: '删除', exact: true }).click();
	await expect(dialog).not.toBeVisible();
	for (const tab of [page, other]) {
		await expect(tab.getByRole('button', { name: /课表 A/ })).toHaveCount(0);
		await expect(tab.getByRole('button', { name: /课表 B/ }).locator('input')).toBeChecked();
	}
	expect(
		await other.evaluate(() =>
			localStorage.getItem('chronos:/Chronos:chronos_preferences:current_timetable_id')
		)
	).toBe(activeBefore);
	await page.reload();
	await expect(page.getByRole('button', { name: /课表 B/ }).locator('input')).toBeChecked();
});

test('reports committed deletion separately when saving the successor selection fails', async ({
	page,
	context,
	request
}) => {
	await request.post('/__e2e/deploy?build=old');
	await context.addInitScript(() =>
		localStorage.setItem('chronos:/Chronos:chronos:onboarding-seen', '1')
	);
	for (const name of ['课表 A', '课表 B']) {
		await page.goto(`/Chronos/s#${await payload(name)}`);
		await page.getByRole('button', { name: '导入为新课程表', exact: true }).click();
		await expect(page.locator('.timetable-week-pager')).toBeVisible();
	}
	await page.goto('/Chronos/manage-timetables');
	await page.getByRole('button', { name: '删除课表', exact: true }).click();
	const dialog = page.getByRole('dialog');
	await expect(dialog).toContainText('课表 B');
	await page.evaluate(() => {
		const original = Object.getOwnPropertyDescriptor(Storage.prototype, 'setItem')!
			.value as Storage['setItem'];
		Storage.prototype.setItem = function (key, value) {
			if (key === 'chronos:/Chronos:chronos_preferences:current_timetable_id')
				throw new DOMException('Test write failure', 'QuotaExceededError');
			original.call(this, key, value);
		};
	});
	await dialog.getByRole('button', { name: '删除', exact: true }).click();
	await expect(dialog).not.toBeVisible();
	await expect(
		page.getByRole('status').filter({ hasText: '课表已删除，但后续状态更新失败，请重新选择课表' })
	).toBeVisible();
	await expect(page.getByRole('button', { name: /课表 B/ })).toHaveCount(0);
	await expect(page.getByRole('button', { name: /课表 A/ }).locator('input')).not.toBeChecked();
	expect(
		await page.evaluate(() =>
			localStorage.getItem('chronos:/Chronos:chronos_preferences:current_timetable_id')
		)
	).toBeNull();
	await page.reload();
	await expect(page.getByRole('button', { name: /课表 A/ }).locator('input')).toBeChecked();
	await expect(page.getByRole('button', { name: /课表 B/ })).toHaveCount(0);
});
