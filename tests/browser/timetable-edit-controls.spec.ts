import { captureOptionalScreenshot } from './screenshot';
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

test('date labels initialize the current value and discard cancelled drafts', async ({
	page,
	request
}) => {
	await request.post('/__e2e/deploy?build=old');
	await page.addInitScript(() =>
		localStorage.setItem('chronos:/Chronos:chronos:onboarding-seen', '1')
	);
	await page.goto(`/Chronos/s#${payload}`);
	await page.getByRole('button', { name: '导入为新课程表', exact: true }).click();
	await expect(page.locator('.timetable-week-pager')).toBeVisible();
	await page.goto('/Chronos/timetable/details');
	const label = page.getByRole('button', { name: '学期起始日（周一）', exact: true });
	const trigger = page.getByRole('button', {
		name: '学期起始日（周一）：2026/03/02',
		exact: true
	});
	const confirm = page.getByRole('button', { name: '确认', exact: true });
	await expect(trigger).toBeVisible();

	await label.click();
	await confirm.click();
	await expect(trigger).toBeVisible();

	await trigger.click();
	await page.getByRole('button', { name: '清除', exact: true }).click();
	await page.keyboard.press('Escape');
	await expect(confirm).toHaveCount(0);
	await label.click();
	await confirm.click();
	await expect(trigger).toBeVisible();
	await page.getByRole('button', { name: '保存', exact: true }).click();
	await expect(page.locator('.timetable-week-pager')).toBeVisible();
	await page.goto('/Chronos/timetable/details');
	await expect(trigger).toBeVisible();
});

test.describe('touch edit dismissal', () => {
	test.use({ hasTouch: true, isMobile: true, viewport: { width: 390, height: 844 } });

	for (const target of ['course', 'empty'] as const) {
		test(`empty tap exits after ${target} long press without a synthesized click`, async ({
			page,
			request
		}) => {
			await request.post('/__e2e/deploy?build=old');
			await page.clock.install({ time: new Date('2026-03-02T08:00:00+08:00') });
			await page.addInitScript(() => {
				localStorage.setItem('chronos:/Chronos:chronos:onboarding-seen', '1');
				// Exercise the iOS failure path even when the test browser synthesizes click.
				document.addEventListener(
					'click',
					(event) => {
						if (
							event.target instanceof Element &&
							event.target.closest('.timetable-week-page') &&
							!event.target.closest('button')
						) {
							event.stopImmediatePropagation();
						}
					},
					true
				);
			});
			await page.goto(`/Chronos/s#${payload}`);
			await page.getByRole('button', { name: '导入为新课程表', exact: true }).click();
			await expect.poll(() => storedCourses(page)).toHaveLength(1);
			await page.goto('/Chronos/');
			const week = page.locator('.timetable-week-page').first();
			const card = week.locator('.course-capsule[aria-label^="验证课程"]');
			await expect(card).toBeVisible();
			const empty = week.getByRole('region', { name: '本周课程表', exact: true });
			const pressTarget = target === 'course' ? card : empty;
			const box = (await pressTarget.boundingBox())!;
			const pointer = {
				pointerType: 'touch',
				pointerId: 1,
				isPrimary: true,
				button: 0,
				clientX: box.x + box.width * 0.75,
				clientY: box.y + 30
			};
			await pressTarget.dispatchEvent('pointerdown', pointer);
			await page.clock.runFor(500);
			await pressTarget.dispatchEvent('pointerup', pointer);
			const edit = page.getByRole('button', { name: '编辑课表', exact: true });
			await expect(edit).toBeVisible();
			const emptyBox = (await empty.boundingBox())!;
			await empty.tap({ position: { x: emptyBox.width * 0.75, y: 100 } });
			await expect(edit).toHaveCount(0);
			await expect(page.locator('.timetable-week-pager-locked')).toHaveCount(0);
			await card.tap();
			await expect(page.getByRole('dialog')).toBeVisible();
		});
	}
});

async function storedCourses(page: Page) {
	return page.evaluate(
		() =>
			new Promise<{ name: string; weeksCsv: string }[]>((resolve, reject) => {
				const request = indexedDB.open('chronos:/Chronos:db');
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
		await page.addInitScript(() =>
			localStorage.setItem('chronos:/Chronos:chronos:onboarding-seen', '1')
		);
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
		await captureOptionalScreenshot(page, {
			path: testInfo.outputPath('real-delete-confirmation.png')
		});
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
