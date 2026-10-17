import { expect, test, type Locator, type Page, type APIRequestContext } from '@playwright/test';

async function openLayout(page: Page, request: APIRequestContext) {
	await request.post('/__e2e/deploy?build=old');
	await page.goto('/Chronos/');
	await expect(page.getByRole('heading', { name: '欢迎使用 Chronos', exact: true })).toBeVisible();
	for (const heading of ['阅读相关条款', '功能亮点', '安装到主屏幕', '选择课表页样式']) {
		if (heading === '功能亮点') {
			await expect(
				page.getByRole('button', { name: '我已阅读并继续', exact: true })
			).toBeDisabled();
			await page
				.getByRole('checkbox', {
					name: '我已仔细阅读并同意《Chronos 服务协议》与《Chronos 隐私政策》',
					exact: true
				})
				.check();
		}
		await page.getByRole('button', { name: /^(下一步|我已阅读并继续)$/ }).click();
		// Wait for the keyed incoming page, rather than guessing its transition duration.
		await expect(page.getByRole('heading', { name: heading, exact: true })).toBeVisible();
	}
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
	{ width: 360, height: 640 },
	{ width: 932, height: 430 }
]) {
	test.describe(`${viewport.width}x${viewport.height}`, () => {
		test.use({ viewport });
		test('keeps layout choices visible and lets the user finish onboarding', async ({
			page,
			request
		}) => {
			await openLayout(page, request);
			for (const mode of ['fixed', 'compact']) {
				const preview = page.locator(`.preview.mode-${mode}`);
				await preview.scrollIntoViewIfNeeded();
				await expect(preview).toBeVisible();
			}
			expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(
				true
			);
			await page.getByRole('button', { name: '下一步', exact: true }).click();
			await expect(page.locator('.demo')).toBeVisible();
			await page.getByRole('button', { name: '上一步', exact: true }).click();
			await page.getByRole('button', { name: '下一步', exact: true }).click();
			await expect(page.locator('.demo')).toHaveCount(1);
			await page.getByRole('button', { name: '下一步', exact: true }).click();
			await page.getByRole('button', { name: '稍后再说', exact: true }).click();
			await expect(page.getByRole('dialog')).toHaveCount(0);
		});
	});
}

for (const preference of ['system', 'application'] as const) {
	test(`keeps the demonstration still with the ${preference} reduced-motion preference`, async ({
		page,
		request
	}) => {
		await page.clock.install();
		if (preference === 'application')
			await page.addInitScript(() => {
				localStorage.setItem('chronos:/Chronos:chronos_preferences:reduce_motion_enabled', '1');
			});
		await openLayout(page, request);
		await page.getByRole('button', { name: '下一步', exact: true }).click();
		const demo = page.locator('.demo');
		if (preference === 'system') {
			await expect(demo.locator('.timetable-drop-preview')).toHaveCount(1);
			await page.emulateMedia({ reducedMotion: 'reduce' });
		}
		await expect(demo.locator('.edit-bottom-bar-controls')).toBeVisible();
		await expect(primary(demo)).toBeVisible();
		await page.clock.runFor(6_000);
		expect(await column(demo)).toBe(1);
		await expect(demo.locator('.timetable-drop-preview')).toHaveCount(0);
		await expect(demo.locator('.confirm-overlay')).toBeHidden();
		await expect(demo.locator('.edit-bottom-bar-controls')).toBeVisible();
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
	await expect(demo.locator('.edit-bottom-bar-controls')).toBeVisible();
	await expect.poll(() => column(demo)).toBe(2);
	await expect(demo.locator('.timetable-delete-zone--active')).toHaveCount(1);
	await expect(demo.locator('.confirm-overlay')).toHaveCSS('visibility', 'visible');
	await expect(primary(demo)).toHaveCount(0);
	await expect(demo.locator('.toolbar-view')).toBeVisible();
	await expect(primary(demo)).toHaveCount(1);
	expect(await column(demo)).toBe(1);
	expect(await persistedCourses(page)).toEqual(before);
	await page.getByRole('button', { name: '下一步', exact: true }).click();
	await page.getByRole('button', { name: '稍后再说', exact: true }).click();
	await expect(page.getByRole('dialog')).toHaveCount(0);
	await expect(demo).toHaveCount(0);
});
