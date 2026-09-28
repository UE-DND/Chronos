import { expect, test, type Page } from '@playwright/test';
import timetable from '../../packages/core/tests/fixtures/timetable.json' with { type: 'json' };
import { encodeSharePayload } from '../../packages/plugins/codec-share/src/share-link/chronos-share-link-codec.ts';
import type { Timetable } from '../../packages/core/src/domain/timetable';

const payload = await encodeSharePayload(timetable as Timetable);

test.use({ viewport: { width: 430, height: 932 }, isMobile: true, hasTouch: true });

async function swipe(page: Page, start: { x: number; y: number }, dx: number, dy: number) {
	const cdp = await page.context().newCDPSession(page);
	const point = (x: number, y: number) => ({ x, y, id: 1 });
	await cdp.send('Input.dispatchTouchEvent', {
		type: 'touchStart',
		touchPoints: [point(start.x, start.y)]
	});
	for (let step = 1; step <= 5; step++) {
		await cdp.send('Input.dispatchTouchEvent', {
			type: 'touchMove',
			touchPoints: [point(start.x + (dx * step) / 5, start.y + (dy * step) / 5)]
		});
	}
	await cdp.send('Input.dispatchTouchEvent', { type: 'touchEnd', touchPoints: [] });
	await cdp.detach();
}

test('keeps vertical scrolling on its week and limits a touch swipe to one week', async ({
	page,
	request
}) => {
	await request.post('/__e2e/deploy?build=old');
	await page.goto('/Chronos/');
	await page.getByRole('button', { name: '跳过', exact: true }).click();
	await page.goto(`/Chronos/s#${payload}`);
	await expect(page.getByRole('heading', { name: timetable.name })).toBeVisible();
	await page.getByRole('button', { name: '导入为新课程表', exact: true }).click();
	await expect
		.poll(() =>
			page.evaluate(
				() =>
					new Promise<number>((resolve, reject) => {
						const request = indexedDB.open('chronos');
						request.onerror = () => reject(request.error);
						request.onsuccess = () => {
							const database = request.result;
							const read = database.transaction('courses').objectStore('courses').getAll();
							read.onsuccess = () => {
								resolve(read.result.length);
								database.close();
							};
							read.onerror = () => reject(read.error);
						};
					})
			)
		)
		.toBe(timetable.courses.length);
	await page.goto('/Chronos/');
	const pager = page.locator('.timetable-week-pager');
	await expect(pager).toBeVisible();
	const position = () =>
		pager.evaluate((node) => (node as HTMLElement).scrollLeft / (node as HTMLElement).clientWidth);
	const initial = await position();
	const body = pager.locator('.timetable-week-page').nth(Math.round(initial)).getByRole('region');
	await expect(body).toHaveCSS('touch-action', 'pan-y');
	const rect = (await body.boundingBox())!;
	const start = { x: rect.x + rect.width / 2, y: rect.y + rect.height / 2 };

	await swipe(page, start, 18, -120);
	await expect.poll(position).toBeCloseTo(initial, 1);

	const dx = initial >= 15 ? 160 : -160;
	await swipe(page, start, dx, 0);
	const next = initial + (dx > 0 ? -1 : 1);
	await expect.poll(position).toBeCloseTo(next, 1);

	const capsule = pager
		.locator('.timetable-week-page')
		.nth(Math.round(next))
		.locator('.course-capsule')
		.first();
	await expect(capsule).toBeVisible();
	await expect(capsule).toHaveCSS('touch-action', 'pan-y');
	const capsuleRect = (await capsule.boundingBox())!;
	const cardStart = {
		x: capsuleRect.x + capsuleRect.width / 2,
		y: capsuleRect.y + capsuleRect.height / 2
	};
	const cardDx = cardStart.x < 215 ? 160 : -160;
	await swipe(page, cardStart, cardDx, 0);
	await expect.poll(position).toBeCloseTo(next + (cardDx > 0 ? -1 : 1), 1);
	expect(page.url()).toMatch(/\/Chronos\/?$/);
});
