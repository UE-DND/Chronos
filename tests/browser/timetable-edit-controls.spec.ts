import { expect, test, type Page } from '@playwright/test';
import fixture from '../../packages/core/tests/fixtures/timetable.json' with { type: 'json' };
import type { Timetable } from '../../packages/core/src/domain/timetable';
import { encodeSharePayload } from '../../packages/plugins/codec-share/src/share-link/chronos-share-link-codec';

const source: Timetable = {
	...fixture,
	name: '长按编辑回归',
	academicConfig: {
		...fixture.academicConfig,
		termStartDate: '2026-03-02',
		startWeek: 1,
		endWeek: 2
	},
	courses: [
		{
			...fixture.courses[0]!,
			name: '验证课程',
			dayOfWeek: 1,
			startPeriod: 1,
			endPeriod: 1,
			weeks: [1, 2]
		}
	]
};
const payload = await encodeSharePayload(source);

async function storedCourses(page: Page) {
	return page.evaluate(
		() =>
			new Promise<{ name: string; weeksCsv: string }[]>((resolve, reject) => {
				const request = indexedDB.open('chronos');
				request.onerror = () => reject(request.error);
				request.onsuccess = () => {
					const db = request.result;
					const read = db.transaction('courses').objectStore('courses').getAll();
					read.onsuccess = () => {
						resolve(read.result);
						db.close();
					};
					read.onerror = () => reject(read.error);
				};
			})
	);
}

for (const viewport of [
	{ width: 430, height: 932 },
	{ width: 1280, height: 800 },
	{ width: 932, height: 430 }
]) {
	test(`shared edit controls and week deletion at ${viewport.width}x${viewport.height}`, async ({
		page,
		request
	}, testInfo) => {
		await page.setViewportSize(viewport);
		await request.post('/__e2e/deploy?build=old');
		await page.clock.install({ time: new Date('2026-03-02T08:00:00+08:00') });
		await page.addInitScript(() => localStorage.setItem('chronos:onboarding-seen', '1'));
		await page.goto(`/Chronos/s#${payload}`);
		await page.getByRole('button', { name: '导入为新课程表', exact: true }).click();
		await expect.poll(() => storedCourses(page)).toHaveLength(1);
		await page.goto('/Chronos/');
		const card = page
			.locator('.timetable-week-page')
			.first()
			.locator('.course-capsule[aria-label^="验证课程"]');
		await expect(card).toBeVisible();
		async function hold() {
			await card.hover();
			const box = (await card.boundingBox())!;
			await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2);
			await page.mouse.down();
			await page.clock.runFor(500);
			await expect(page.locator('.timetable-delete-zone')).toBeVisible();
		}
		await hold();
		await page.mouse.up();
		const edit = page.getByRole('button', { name: '编辑课表', exact: true });
		await expect(edit).toBeVisible();
		await page.getByRole('button', { name: '布局选项', exact: true }).click();
		await expect(page.getByRole('dialog')).toBeVisible();
		await page.keyboard.press('Escape');
		await expect(page.getByRole('dialog')).toHaveCount(0);
		await edit.click();
		await expect(page).toHaveURL(/\/timetable\/details$/);
		await page.goBack();
		await expect(card).toBeVisible();
		await hold();
		await page.mouse.up();
		await page.getByRole('button', { name: '新增课程', exact: true }).click();
		await expect(page).toHaveURL(/\/timetable\/course-editor/);
		await page.goBack();
		await expect(card).toBeVisible();

		async function requestDeletion() {
			await hold();
			const zone = (await page.locator('.timetable-delete-zone').boundingBox())!;
			await page.mouse.move(zone.x + zone.width / 2, zone.y + zone.height / 2, { steps: 12 });
			await expect(page.locator('.timetable-delete-zone--active')).toBeVisible();
			await page.mouse.up();
			await expect(page.getByRole('dialog')).toBeVisible();
			await expect(page.getByRole('dialog')).toContainText('仅删除第 1 周');
		}
		await requestDeletion();
		await page.getByRole('button', { name: '取消', exact: true }).click();
		await expect(page.getByRole('dialog')).toHaveCount(0);
		expect((await storedCourses(page))[0]?.weeksCsv).toBe('1,2');
		await expect(card).toBeVisible();
		await requestDeletion();
		await page.screenshot({ path: testInfo.outputPath('real-delete-confirmation.png') });
		await page.getByRole('button', { name: '删除', exact: true }).click();
		await expect(page.getByRole('dialog')).toHaveCount(0);
		await expect.poll(async () => (await storedCourses(page))[0]?.weeksCsv).toBe('2');
		await expect(card).toHaveCount(0);
		await page.reload();
		await expect(page.locator('.timetable-week-pager')).toBeVisible();
		await expect(card).toHaveCount(0);
		expect((await storedCourses(page))[0]?.weeksCsv).toBe('2');
	});
}
