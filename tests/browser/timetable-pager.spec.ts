import { expect, test, type APIRequestContext, type Page } from '@playwright/test';
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

async function importTimetable(page: Page, request: APIRequestContext) {
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
	// Initial scroll synchronization suppresses events for 150 ms.
	await page.waitForTimeout(180);
	const position = () =>
		pager.evaluate((node) => (node as HTMLElement).scrollLeft / (node as HTMLElement).clientWidth);
	return { pager, position };
}

test('keeps vertical scrolling on its week and limits a touch swipe to one week', async ({
	page,
	request
}) => {
	const { pager, position } = await importTimetable(page, request);
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

test('shows the whole capsule only during week navigation and disables it after fading', async ({
	page,
	request
}) => {
	const { pager, position } = await importTimetable(page, request);
	const indicator = page.locator('#week-indicator');
	await expect(indicator).toHaveCSS('opacity', '0');
	await expect(indicator).toHaveCSS('pointer-events', 'none');
	await expect(indicator).toHaveAttribute('tabindex', '-1');
	await expect(indicator).toHaveAttribute('inert', '');

	const initial = await position();
	const rect = (await pager.boundingBox())!;
	const start = { x: rect.x + rect.width / 2, y: rect.y + rect.height / 2 };
	const dx = initial >= 15 ? 160 : -160;
	const cdp = await page.context().newCDPSession(page);
	await cdp.send('Input.dispatchTouchEvent', {
		type: 'touchStart',
		touchPoints: [{ ...start, id: 1 }]
	});
	await cdp.send('Input.dispatchTouchEvent', {
		type: 'touchMove',
		touchPoints: [{ x: start.x + dx, y: start.y, id: 1 }]
	});
	await expect(indicator).toHaveCSS('opacity', '1');
	await expect(indicator).toHaveCSS('pointer-events', 'auto');
	await expect(indicator).toHaveAttribute('tabindex', '0');
	await expect(indicator).not.toHaveAttribute('inert', '');
	await expect(indicator).toHaveCSS('backdrop-filter', 'blur(16px) saturate(1.3)');

	await cdp.send('Input.dispatchTouchEvent', { type: 'touchEnd', touchPoints: [] });
	await cdp.detach();
	await expect.poll(position).toBeCloseTo(initial + (dx > 0 ? -1 : 1), 1);
	await expect(indicator).toHaveCSS('opacity', '0');
	await expect(indicator).toHaveCSS('pointer-events', 'none');
	await expect(indicator).toHaveAttribute('inert', '');

	await swipe(page, start, -dx, 0);
	await expect(indicator).toHaveClass(/capsule-indicator--glass/);
	await expect.poll(position).toBeCloseTo(initial, 1);
	await expect(indicator).toHaveCSS('opacity', '0');
});

async function prepareMotionTest(page: Page, request: APIRequestContext) {
	const result = await importTimetable(page, request);
	const indicator = page.locator('#week-indicator');
	await result.pager.evaluate((node) => {
		node.scrollLeft = node.scrollLeft > 0 ? 0 : node.clientWidth;
	});
	await expect(indicator).toHaveAttribute('tabindex', '0');
	await indicator.press('Home');
	for (let i = 0; i < 5; i++) await indicator.press('ArrowRight');
	await expect.poll(result.position).toBe(5);
	// Programmatic navigation suppresses its scroll events for 150 ms.
	await page.waitForTimeout(180);
	const rect = (await result.pager.boundingBox())!;
	return {
		...result,
		indicator,
		start: { x: rect.x + rect.width / 2, y: rect.y + rect.height / 2 }
	};
}

async function observeMotion(page: Page) {
	return page.evaluateHandle(() => {
		const pager = document.querySelector<HTMLElement>('.timetable-week-pager')!;
		const indicator = document.querySelector<HTMLElement>('#week-indicator')!;
		const startWeek = Number(indicator.getAttribute('aria-valuemin'));
		const visibleCount = Math.min(
			4,
			Number(indicator.getAttribute('aria-valuemax')) - startWeek + 1
		);
		const samples: {
			position: number;
			blank: boolean;
			glass: boolean;
			interpolating: boolean;
			dotError: number;
		}[] = [];
		let frame = 0;
		function sample() {
			const position = pager.scrollLeft / pager.clientWidth;
			const pages = pager.querySelectorAll('.timetable-week-page');
			const first = Math.floor(position + 0.001);
			const last = Math.ceil(position - 0.001);
			const track = indicator.querySelector<HTMLElement>('.dots-track--compact')!;
			const dots = [...track.querySelectorAll<HTMLElement>('[data-week]')];
			const offset = Number(track.style.getPropertyValue('--track-offset'));
			const dotError = Math.max(
				...dots.map((dot, index) => {
					const emphasis = Math.max(
						0,
						1 - Math.abs(Number(dot.dataset.week) - position - startWeek)
					);
					const visibility = Math.min(1, index + offset + 1, visibleCount - index - offset);
					return Math.abs(Number(dot.style.opacity) - (0.4 + 0.6 * emphasis) * visibility);
				})
			);
			samples.push({
				position,
				blank: !pages[first]?.children.length || !pages[last]?.children.length,
				glass: indicator.classList.contains('capsule-indicator--glass'),
				interpolating: dots.every((dot) => dot.classList.contains('indicator-dot--interpolating')),
				dotError
			});
			frame = requestAnimationFrame(sample);
		}
		frame = requestAnimationFrame(sample);
		return {
			stop() {
				cancelAnimationFrame(frame);
				return samples;
			}
		};
	});
}

for (const close of ['outside touch', 'Escape', 'history back'] as const) {
	test(`reopens course details during exit after ${close}`, async ({ page, request }) => {
		const { pager } = await prepareMotionTest(page, request);
		const capsule = pager.locator('.timetable-week-page').nth(5).locator('.course-capsule').first();
		const rect = (await capsule.boundingBox())!;
		const point = { x: rect.x + rect.width / 2, y: rect.y + Math.min(20, rect.height / 2) };
		const dialog = page.locator('.bottom-sheet-content');
		await page.touchscreen.tap(point.x, point.y);
		await expect(dialog).toHaveAttribute('data-state', 'open');
		const courseName = await dialog.getByRole('heading').nth(1).textContent();
		// Finish the initial entrance once; subsequent cycles must not wait for exit animations.
		await expect(dialog).not.toHaveAttribute('data-starting-style');
		await page.waitForTimeout(350);
		for (let cycle = 0; cycle < 5; cycle++) {
			if (close === 'outside touch') await page.touchscreen.tap(215, 100);
			else if (close === 'Escape') await page.keyboard.press('Escape');
			else await page.goBack();
			await expect(dialog).toHaveAttribute('data-state', 'closed');
			await page.touchscreen.tap(point.x, point.y);
			await expect(dialog).toHaveAttribute('data-state', 'open', { timeout: 1000 });
		}
		// A completion from an interrupted exit must not clear the reopened course.
		await page.waitForTimeout(350);
		await expect(dialog).toHaveAttribute('data-state', 'open');
		await expect(dialog.getByRole('heading').nth(1)).toHaveText(courseName!);
	});
}

test('keeps readable travel and synchronizes the capsule during repeated and reversed swipes', async ({
	page,
	request
}) => {
	const { pager, position, indicator, start } = await prepareMotionTest(page, request);
	const probe = await observeMotion(page);
	await swipe(page, start, -110, 0);
	await page.waitForTimeout(80);
	const caught = await position();
	expect(caught).toBeGreaterThan(5.5);
	expect(caught).toBeLessThan(6);
	await swipe(page, start, -110, 0);
	await page.waitForTimeout(110);
	const reversing = await position();
	expect(reversing).toBeGreaterThan(6.5);
	expect(reversing).toBeLessThan(7);
	await swipe(page, start, 110, 0);
	await expect.poll(position).toBe(6);
	await expect(pager).toHaveCSS('scroll-snap-type', 'x mandatory');
	await expect(indicator.locator('.indicator-dot--interpolating')).toHaveCount(0);
	const samples = await probe.evaluate((probe) => probe.stop());
	await probe.dispose();
	const moving = samples.filter(
		(sample) => Math.abs(sample.position - Math.round(sample.position)) > 0.005
	);
	expect(moving.length).toBeGreaterThan(5);
	expect(moving.every((sample) => !sample.blank && sample.glass && sample.interpolating)).toBe(
		true
	);
	expect(Math.max(...moving.map((sample) => sample.dotError))).toBeLessThan(0.02);
	await expect(indicator).toHaveClass(/capsule-indicator--glass/);
	await expect(indicator).not.toHaveClass(/capsule-indicator--glass/);

	const capsule = pager.locator('.timetable-week-page').nth(6).locator('.course-capsule').first();
	await capsule.click();
	await expect(page.getByRole('dialog')).toBeVisible();
});

test('cancels a touch animation on resize and when its shell tab becomes inactive', async ({
	page,
	request
}) => {
	const { pager, position, start, indicator } = await prepareMotionTest(page, request);
	await swipe(page, start, -110, 0);
	await page.setViewportSize({ width: 480, height: 932 });
	await expect(pager).toHaveCSS('scroll-snap-type', 'x mandatory');
	await expect
		.poll(async () => {
			const offset = await position();
			return Math.abs(offset - Math.round(offset));
		})
		.toBeLessThan(0.001);
	await expect(indicator.locator('.indicator-dot--interpolating')).toHaveCount(0);

	const rect = (await pager.boundingBox())!;
	await swipe(page, { x: rect.x + rect.width / 2, y: rect.y + rect.height / 2 }, -110, 0);
	await page.getByRole('tab', { name: '我的', exact: true }).click();
	await expect(pager).toHaveCSS('scroll-snap-type', 'x mandatory');
	await page.getByRole('tab', { name: '课表', exact: true }).click();
	await expect(pager).toBeVisible();
	await expect
		.poll(async () => {
			const offset = await position();
			return Math.abs(offset - Math.round(offset));
		})
		.toBeLessThan(0.001);
	await expect(indicator.locator('.indicator-dot--interpolating')).toHaveCount(0);
});
