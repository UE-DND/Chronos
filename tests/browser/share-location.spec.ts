import { expect, test } from '@playwright/test';
import fixture from '../../packages/core/tests/fixtures/timetable.json' with { type: 'json' };
import { encodeSharePayload } from '../../packages/plugins/codec-share/src/share-link/chronos-share-link-codec.ts';
import type { Timetable } from '../../packages/core/src/domain/timetable';

const locations = ['两江校区 弘远楼A101', '两江操场14', ''];
const source: Timetable = {
	...fixture,
	courses: fixture.courses
		.slice(0, 3)
		.map((course, index) => ({ ...course, name: `地点回归${index}`, location: locations[index]! }))
};
const payload = await encodeSharePayload(source);

test('mixed classroom, full and empty locations survive share import and reload', async ({
	page,
	request
}) => {
	await request.post('/__e2e/deploy?build=old');
	await page.addInitScript(() => localStorage.setItem('chronos:onboarding-seen', '1'));
	await page.goto(`/Chronos/s#${payload}`);
	await page.getByRole('button', { name: '导入为新课程表', exact: true }).click();
	await expect(page.locator('.timetable-week-pager')).toBeVisible();
	await page.reload();
	await expect(page.locator('.timetable-week-pager')).toBeVisible();
	const actual = await page.evaluate(
		() =>
			new Promise<string[]>((resolve, reject) => {
				const open = indexedDB.open('chronos');
				open.onerror = () => reject(open.error);
				open.onsuccess = () => {
					const database = open.result;
					const read = database.transaction('courses').objectStore('courses').getAll();
					read.onsuccess = () => {
						resolve(
							read.result
								.sort((a, b) => a.name.localeCompare(b.name))
								.map((course) => course.location)
						);
						database.close();
					};
					read.onerror = () => {
						database.close();
						reject(read.error);
					};
				};
			})
	);
	expect(actual).toEqual(locations);
});
