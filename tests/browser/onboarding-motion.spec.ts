import { expect, test, type Locator, type Page, type APIRequestContext } from '@playwright/test';

type DemoTimeline = {
	pause(): DemoTimeline;
	resume(): DemoTimeline;
	seek(position: string | number, suppressEvents?: boolean): DemoTimeline;
	duration(): number;
	time(): number;
	totalTime(time: number): DemoTimeline;
	paused(): boolean;
	parent: unknown;
};
type DemoRoot = HTMLElement & { __demoTimeline?: DemoTimeline };

async function openLayout(page: Page, request: APIRequestContext) {
	await request.post('/__e2e/deploy?build=old');
	await page.goto('/Chronos/');
	await expect(page.getByRole('heading', { name: '欢迎使用 Chronos', exact: true })).toBeVisible();
	for (const heading of ['阅读相关条款', '功能亮点', '安装到主屏幕', '选择课表页样式']) {
		await page.getByRole('button', { name: /^(下一步|我已阅读并继续)$/ }).click();
		// Wait for the keyed incoming page, rather than guessing its transition duration.
		await expect(page.getByRole('heading', { name: heading, exact: true })).toBeVisible();
	}
}

async function seek(root: Locator, position: string | number) {
	await expect(root).toHaveCount(1);
	await root.scrollIntoViewIfNeeded();
	await expect(root.locator('xpath=ancestor::div[contains(@class, "h-full")][1]')).toHaveCSS(
		'opacity',
		'1'
	);
	await expect
		.poll(() => root.evaluate((node) => Boolean((node as DemoRoot).__demoTimeline)))
		.toBe(true);
	await root.evaluate((node, position) => {
		(node as DemoRoot).__demoTimeline!.pause().seek(position, false);
	}, position);
}

function primary(demo: Locator) {
	return demo.locator('.course-capsule[aria-label^="高等数学"]');
}
async function column(demo: Locator) {
	return primary(demo).evaluate((node) => {
		const course = node.parentElement!.getBoundingClientRect();
		const grid = node.closest('.timetable-grid-body')!.getBoundingClientRect();
		return Math.round((course.left + course.width / 2 - grid.left) / (grid.width / 5) + 0.5);
	});
}
async function persistedCourses(page: Page) {
	return page.evaluate(
		() =>
			new Promise<unknown[]>((resolve, reject) => {
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
	{ width: 360, height: 640 },
	{ width: 932, height: 430 },
	{ width: 1280, height: 800 }
]) {
	test.describe(`${viewport.width}x${viewport.height}`, () => {
		test.use({ viewport });
		test('scroll bounds, landing, deletion and loop reset', async ({ page, request }, testInfo) => {
			await openLayout(page, request);
			const fixed = page.locator('.preview.mode-fixed');
			const compact = page.locator('.preview.mode-compact');
			await seek(fixed, 1.5);
			await seek(compact, 1.5);
			const bounds = await fixed.evaluate((root) => {
				const grid = root.querySelector('.grid')!.getBoundingClientRect();
				const viewport = root.querySelector('.viewport')!.getBoundingClientRect();
				return {
					bottom: Math.abs(grid.bottom - viewport.bottom),
					overflow: grid.height - viewport.height
				};
			});
			expect(bounds.bottom).toBeLessThan(1);
			expect(bounds.overflow).toBeGreaterThan(0);
			await expect(compact.locator('.grid')).toHaveCSS('transform', 'none');
			await page.screenshot({ path: testInfo.outputPath('layout.png') });
			await page.getByRole('button', { name: '下一步', exact: true }).click();
			const demo = page.locator('.demo');
			const before = await persistedCourses(page);
			await seek(demo, 0);
			expect(await column(demo)).toBe(1);
			await seek(demo, 0.9);
			await expect(demo.locator('.timetable-drop-preview')).toHaveCount(1);
			await expect(primary(demo).locator('..')).toHaveCSS('opacity', '0');
			await seek(demo, 1.8);
			await expect(demo.locator('.timetable-drop-preview')).toHaveCount(0);
			await expect(demo.locator('.edit-bottom-bar-controls')).toHaveCSS('opacity', '1');
			await expect(demo.locator('.touch-indicator')).toHaveCSS('opacity', '0');
			await seek(demo, 2.5);
			await seek(demo, 3.7);
			await expect(demo.locator('.timetable-drop-preview')).toContainText('高等数学');
			await seek(demo, 4.1);
			expect(await column(demo)).toBe(2);
			await expect(demo.locator('.timetable-drop-preview')).toHaveCount(0);
			await expect(demo.locator('.edit-bottom-bar-controls')).toHaveCSS('opacity', '1');
			await page.screenshot({ path: testInfo.outputPath('landed.png') });
			await seek(demo, 5.2);
			await seek(demo, 6.6);
			await expect(demo.locator('.timetable-delete-zone--active')).toHaveCount(1);
			await expect(demo.locator('.timetable-drop-preview')).toHaveCount(0);
			await expect(demo.locator('.confirm-overlay')).toHaveCSS('visibility', 'hidden');
			await page.screenshot({ path: testInfo.outputPath('over-delete.png') });
			await seek(demo, 7.6);
			await expect(demo.locator('.confirm-overlay')).toHaveCSS('visibility', 'visible');
			await expect(primary(demo).locator('..')).toHaveCSS('opacity', '1');
			await expect(demo.locator('.confirm-sheet')).toContainText('高等数学');
			await expect(demo.locator('.confirm-sheet')).toHaveCSS(
				'transform',
				'matrix(1, 0, 0, 1, 0, 0)'
			);
			const sheetBottom = await demo.evaluate((root) =>
				Math.abs(
					root.getBoundingClientRect().bottom -
						root.querySelector('.confirm-sheet')!.getBoundingClientRect().bottom
				)
			);
			expect(sheetBottom).toBeLessThan(2);
			await page.screenshot({ path: testInfo.outputPath('confirm.png') });
			await seek(demo, 9.4);
			const tapDistance = await demo.evaluate((root) => {
				const touch = root.querySelector('.touch-indicator')!.getBoundingClientRect();
				const button = root
					.querySelector('.confirm-sheet button:last-child')!
					.getBoundingClientRect();
				return Math.hypot(
					touch.left + touch.width / 2 - button.left - button.width / 2,
					touch.top + touch.height / 2 - button.top - button.height / 2
				);
			});
			expect(tapDistance).toBeLessThan(2);
			await page.screenshot({ path: testInfo.outputPath('confirm-tap.png') });
			await seek(demo, 10);
			await expect(primary(demo)).toHaveCount(0);
			await expect(demo.locator('.course-capsule')).toHaveCount(1);
			await expect(demo.locator('.confirm-overlay')).toHaveCSS('visibility', 'hidden');
			await demo.evaluate((node) => {
				const timeline = (node as DemoRoot).__demoTimeline!;
				timeline.pause().totalTime(timeline.duration() + 0.1);
			});
			await expect(demo.locator('.toolbar-view')).toBeVisible();
			expect(await column(demo)).toBe(1);
			expect(await persistedCourses(page)).toEqual(before);
			await page.getByRole('button', { name: '下一步', exact: true }).click();
			await expect(
				page.getByRole('heading', { name: '开始使用 Chronos', exact: true })
			).toBeVisible();
			await page.getByRole('button', { name: '稍后再说', exact: true }).click();
			expect(await persistedCourses(page)).toEqual(before);
		});
	});
}

test('cleanup, resize, reentry and visibility pause', async ({ page, request }) => {
	await openLayout(page, request);
	await page.getByRole('button', { name: '下一步', exact: true }).click();
	const demo = page.locator('.demo');
	await seek(demo, 6.6);
	const previous = await demo.evaluateHandle((node) => ({
		timeline: (node as DemoRoot).__demoTimeline!
	}));
	await page.setViewportSize({ width: 430, height: 800 });
	await expect.poll(() => previous.evaluate(({ timeline }) => timeline.parent === null)).toBe(true);
	await seek(demo, 1.8);
	await seek(demo, 3.7);
	await seek(demo, 4.1);
	expect(await column(demo)).toBe(2);
	const current = await demo.evaluateHandle((node) => ({
		timeline: (node as DemoRoot).__demoTimeline!
	}));
	await page.evaluate(() => {
		Object.defineProperty(document, 'hidden', { configurable: true, value: true });
		document.dispatchEvent(new Event('visibilitychange'));
	});
	expect(await current.evaluate(({ timeline }) => timeline.paused())).toBe(true);
	expect(await current.evaluate(({ timeline }) => timeline.time())).toBe(4.1);
	await page.evaluate(() => {
		Object.defineProperty(document, 'hidden', { configurable: true, value: false });
		document.dispatchEvent(new Event('visibilitychange'));
	});
	expect(await current.evaluate(({ timeline }) => timeline.paused())).toBe(false);
	await page.getByRole('button', { name: '上一步', exact: true }).click();
	await expect.poll(() => current.evaluate(({ timeline }) => timeline.parent === null)).toBe(true);
	await page.getByRole('button', { name: '下一步', exact: true }).click();
	await seek(demo, 0);
	await expect(primary(demo).locator('..')).toHaveCSS('opacity', '1');
	const reentered = await demo.evaluateHandle((node) => ({
		timeline: (node as DemoRoot).__demoTimeline!
	}));
	await page.getByRole('button', { name: '上一步', exact: true }).click();
	await page.getByRole('button', { name: '下一步', exact: true }).click();
	await expect
		.poll(() => reentered.evaluate(({ timeline }) => timeline.parent === null))
		.toBe(true);
	await seek(demo, 0);
	await page.getByRole('button', { name: '跳过', exact: true }).click();
	await expect(demo).toHaveCount(0);
});

for (const preference of ['system', 'application'] as const) {
	test(`reduced motion responds to ${preference} changes`, async ({ page, request }) => {
		await openLayout(page, request);
		await page.getByRole('button', { name: '下一步', exact: true }).click();
		const demo = page.locator('.demo');
		await seek(demo, 7.6);
		const previous = await demo.evaluateHandle((node) => ({
			timeline: (node as DemoRoot).__demoTimeline!
		}));
		if (preference === 'system') await page.emulateMedia({ reducedMotion: 'reduce' });
		else
			await page.evaluate(() => {
				localStorage.setItem('chronos:/Chronos:chronos_preferences:reduce_motion_enabled', '1');
				document.documentElement.classList.add('reduce-motion');
			});
		await expect(demo).toHaveClass(/demo-reduced/);
		await expect
			.poll(() => previous.evaluate(({ timeline }) => timeline.parent === null))
			.toBe(true);
		await expect(primary(demo).locator('..')).toHaveCSS('opacity', '1');
		await expect(demo.locator('.edit-bottom-bar-controls')).toHaveCSS('opacity', '1');
		await expect(demo.locator('.confirm-overlay')).toHaveCSS('display', 'none');
		expect(await demo.evaluate((node) => (node as DemoRoot).__demoTimeline)).toBeUndefined();
		await page.getByRole('button', { name: '上一步', exact: true }).click();
		await expect(page.locator('.preview').first()).toHaveClass(/demo-reduced/);
		await expect(page.locator('.preview.mode-fixed .grid')).toHaveCSS('transform', 'none');
		if (preference === 'system') await page.emulateMedia({ reducedMotion: 'no-preference' });
		else
			await page.evaluate(() => {
				localStorage.setItem('chronos:/Chronos:chronos_preferences:reduce_motion_enabled', '0');
				document.documentElement.classList.remove('reduce-motion');
			});
		await seek(page.locator('.preview.mode-fixed'), 0);
		await page.getByRole('button', { name: '下一步', exact: true }).click();
		await seek(demo, 0);
		await expect(demo.locator('.toolbar-view')).toBeVisible();
	});
}

test('plays the complete rehearsal automatically without writing real courses', async ({
	page,
	request
}) => {
	await openLayout(page, request);
	const before = await persistedCourses(page);
	await page.getByRole('button', { name: '下一步', exact: true }).click();
	const demo = page.locator('.demo');
	await expect(demo.locator('.timetable-drop-preview')).toHaveCount(1);
	await expect(demo.locator('.edit-bottom-bar-controls')).toHaveCSS('opacity', '1');
	await expect.poll(() => column(demo)).toBe(2);
	await expect(demo.locator('.timetable-delete-zone--active')).toHaveCount(1);
	await expect(demo.locator('.confirm-overlay')).toHaveCSS('visibility', 'visible');
	await expect(primary(demo)).toHaveCount(0);
	await expect(demo.locator('.toolbar-view')).toBeVisible();
	await expect(primary(demo)).toHaveCount(1);
	expect(await column(demo)).toBe(1);
	expect(await persistedCourses(page)).toEqual(before);
	await page.getByRole('button', { name: '跳过', exact: true }).click();
	await expect(demo).toHaveCount(0);
});
