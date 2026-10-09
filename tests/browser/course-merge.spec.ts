import { expect, test, type Page } from '@playwright/test';
import fixture from '../../packages/core/tests/fixtures/timetable.json' with { type: 'json' };
import type { Timetable } from '../../packages/core/src/domain/timetable';
import { encodeSharePayload } from '../../packages/plugins/codec-share/src/share-link/chronos-share-link-codec.ts';
import { TIMETABLE_CLICK_GUARD_MS } from '../../apps/web/src/lib/timetable/timetable-interaction-types';

const source: Timetable = {
	...fixture,
	name: '课程合并周次回归',
	academicConfig: { ...fixture.academicConfig, endWeek: 4 },
	courses: [{ ...fixture.courses[0]!, name: '显式周次课程', weeks: [1, 2] }]
};
const payload = await encodeSharePayload(source);

test.use({ viewport: { width: 1280, height: 932 } });

async function storedCourses(page: Page) {
	return page.evaluate(async () => {
		const database = await new Promise<IDBDatabase>((resolve, reject) => {
			const request = indexedDB.open('chronos:/Chronos:db');
			request.onsuccess = () => resolve(request.result);
			request.onerror = () => reject(request.error);
		});
		try {
			return await new Promise<{ name: string; weeksCsv: string; dayOfWeek: number }[]>(
				(resolve, reject) => {
					const request = database.transaction('courses').objectStore('courses').getAll();
					request.onsuccess = () => resolve(request.result);
					request.onerror = () => reject(request.error);
				}
			);
		} finally {
			database.close();
		}
	});
}

async function changeSemesterLength(page: Page, direction: '减少' | '增加') {
	await page.goto('/Chronos/timetable/details');
	const step = page.getByRole('button', { name: `${direction}总周数`, exact: true });
	await step.click();
	await step.click();
	await page.getByRole('button', { name: '保存', exact: true }).click();
	await expect(page).toHaveURL(/\/Chronos\/$/);
}

test('shortening a semester, dragging away and back, then extending does not resurrect weeks', async ({
	page,
	request
}) => {
	await request.post('/__e2e/deploy?build=old');
	await page.clock.install({ time: new Date('2026-03-02T08:00:00+08:00') });
	await page.addInitScript(() =>
		localStorage.setItem('chronos:/Chronos:chronos:onboarding-seen', '1')
	);
	await page.goto(`/Chronos/s#${payload}`);
	await page.getByRole('button', { name: '导入为新课程表', exact: true }).click();
	await expect
		.poll(() => storedCourses(page))
		.toEqual([expect.objectContaining({ weeksCsv: '1,2' })]);
	await changeSemesterLength(page, '减少');
	await expect
		.poll(() => storedCourses(page))
		.toEqual([expect.objectContaining({ weeksCsv: '1,2' })]);

	const pager = page.locator('.timetable-week-pager');
	await expect(pager).toBeVisible();
	const index = await pager.evaluate((node) => Math.round(node.scrollLeft / node.clientWidth));
	const card = pager
		.locator('.timetable-week-page')
		.nth(index)
		.locator('.course-capsule:not(.opacity-45)')
		.filter({ hasText: '显式周次课程' });
	await card.hover();
	const original = (await card.boundingBox())!;
	const origin = { x: original.x + original.width / 2, y: original.y + 20 };
	await page.mouse.move(origin.x, origin.y);
	await page.mouse.down();
	await expect(page.locator('.timetable-delete-zone')).toBeVisible();
	await page.mouse.move(origin.x + original.width + 16, origin.y, { steps: 12 });
	await page.mouse.up();
	await expect.poll(() => storedCourses(page)).toHaveLength(2);
	// A completed drag suppresses new pointer gestures until the click guard expires.
	await page.clock.runFor(TIMETABLE_CLICK_GUARD_MS + 1);
	const moved = (await card.boundingBox())!;
	await page.mouse.move(moved.x + moved.width / 2, moved.y + 20);
	await page.mouse.down();
	await expect(page.locator('.timetable-delete-zone')).toBeVisible();
	await page.mouse.move(origin.x, origin.y, { steps: 12 });
	await page.mouse.up();
	await expect
		.poll(() => storedCourses(page))
		.toEqual([expect.objectContaining({ weeksCsv: '1,2', dayOfWeek: 1 })]);

	await changeSemesterLength(page, '增加');
	await page.reload();
	await expect(pager).toBeVisible();
	expect(await storedCourses(page)).toEqual([
		expect.objectContaining({ weeksCsv: '1,2', dayOfWeek: 1 })
	]);
});

test('dragging an unrelated course preserves distinct delimiter-bearing identities', async ({
	page,
	request
}) => {
	await request.post('/__e2e/deploy?build=old');
	await page.clock.install({ time: new Date('2026-03-02T08:00:00+08:00') });
	await page.addInitScript(() =>
		localStorage.setItem('chronos:/Chronos:chronos:onboarding-seen', '1')
	);
	const template = {
		...fixture.courses[0]!,
		location: '',
		remark: '',
		startPeriod: 1,
		endPeriod: 1
	};
	const collision: Timetable = {
		...fixture,
		academicConfig: { ...fixture.academicConfig, endWeek: 3 },
		courses: [
			{ ...template, id: 'a', name: '选修|甲', teacher: '乙', dayOfWeek: 1, weeks: [1] },
			{ ...template, id: 'b', name: '选修', teacher: '甲|乙', dayOfWeek: 1, weeks: [2] },
			{ ...template, id: 'c', name: '拖动课程', teacher: '', dayOfWeek: 2, weeks: [1] }
		]
	};
	await page.goto(`/Chronos/s#${await encodeSharePayload(collision)}`);
	await page.getByRole('button', { name: '导入为新课程表', exact: true }).click();
	const pager = page.locator('.timetable-week-pager');
	await expect(pager).toBeVisible();
	await expect.poll(() => storedCourses(page)).toHaveLength(3);
	const card = pager
		.locator('.timetable-week-page')
		.first()
		.locator('.course-capsule')
		.filter({ hasText: '拖动课程' });
	const rect = (await card.boundingBox())!;
	await page.mouse.move(rect.x + rect.width / 2, rect.y + rect.height / 2);
	await page.mouse.down();
	await expect(page.locator('.timetable-delete-zone')).toBeVisible();
	await page.mouse.move(rect.x + rect.width * 1.5 + 16, rect.y + rect.height / 2, { steps: 12 });
	await page.mouse.up();
	await expect
		.poll(
			async () =>
				(await storedCourses(page)).find((course) => course.name === '拖动课程')?.dayOfWeek
		)
		.toBe(3);
	await page.reload();
	await expect(pager).toBeVisible();
	expect(await storedCourses(page)).toEqual(
		expect.arrayContaining([
			expect.objectContaining({ name: '选修|甲', weeksCsv: '1', dayOfWeek: 1 }),
			expect.objectContaining({ name: '选修', weeksCsv: '2', dayOfWeek: 1 })
		])
	);
	expect(await storedCourses(page)).toHaveLength(3);
});
