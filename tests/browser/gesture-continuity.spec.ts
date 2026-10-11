import { expect, test } from '@playwright/test';

test.use({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true });

test('grabs a history-closing sheet from its visible position and restores its history entry', async ({
	page,
	request
}) => {
	await request.post('/__e2e/deploy?build=old');
	await page.addInitScript(() =>
		localStorage.setItem('chronos:/Chronos:chronos:onboarding-seen', '1')
	);
	await page.goto('/Chronos/feedback-settings');
	const row = page.getByRole('button', { name: /提醒时间/ });
	await row.click();
	const dialog = page.getByRole('dialog');
	const offset = () =>
		dialog.evaluate((el) => new DOMMatrixReadOnly(getComputedStyle(el).transform).m42);
	await expect.poll(offset).toBe(0);
	const url = page.url();
	const instant = new Date();
	await page.clock.install({ time: instant });
	await page.clock.pauseAt(new Date(instant.getTime() + 1000));
	await page.evaluate(() => history.back());
	await expect(dialog).toHaveAttribute('data-closing', '');
	await page.clock.runFor(64);
	const before = await offset();
	expect(before).toBeGreaterThan(0);
	const handle = dialog.locator('.touch-none').first();
	const rect = (await handle.boundingBox())!;
	const point = { x: rect.x + rect.width / 2, y: rect.y + rect.height / 2, id: 1 };
	const cdp = await page.context().newCDPSession(page);
	try {
		await cdp.send('Input.dispatchTouchEvent', { type: 'touchStart', touchPoints: [point] });
		await expect(dialog).toHaveAttribute('data-dragging', '');
		expect(await offset()).toBeCloseTo(before);
		await page.clock.runFor(20);
		await cdp.send('Input.dispatchTouchEvent', {
			type: 'touchMove',
			touchPoints: [{ ...point, y: point.y - 40 }]
		});
		await cdp.send('Input.dispatchTouchEvent', { type: 'touchCancel', touchPoints: [] });
		await page.clock.runFor(1500);
		await expect.poll(offset).toBe(0);
		await expect(page).toHaveURL(url);
		// A second Back must still dismiss this sheet instead of leaving its route.
		await page.evaluate(() => history.back());
		await expect(dialog).toHaveAttribute('data-closing', '');
		await page.clock.runFor(1500);
		await expect(dialog).toBeHidden();
		await expect(page).toHaveURL(url);
		await expect(row).toBeFocused();
	} finally {
		await cdp.detach();
	}
});
