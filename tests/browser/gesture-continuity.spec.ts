import { expect, test } from '@playwright/test';

test.use({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true });

test('ignores grabs during compositor closing, then restores focus and history once', async ({
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
	// Pause the browser animation itself; JS clock mocks do not control compositor frames.
	await page.evaluate(() => {
		const animate = Object.getOwnPropertyDescriptor(Element.prototype, 'animate')!
			.value as Element['animate'];
		Element.prototype.animate = function (...args) {
			const animation = animate.apply(this, args);
			animation.pause();
			animation.currentTime = 64;
			return animation;
		};
		history.back();
	});
	await expect(dialog).toHaveAttribute('data-closing', '');
	const before = await offset();
	expect(before).toBeGreaterThan(0);
	const handle = dialog.locator('.touch-none').first();
	const rect = (await handle.boundingBox())!;
	const point = { x: rect.x + rect.width / 2, y: rect.y + rect.height / 2, id: 1 };
	const cdp = await page.context().newCDPSession(page);
	try {
		await cdp.send('Input.dispatchTouchEvent', { type: 'touchStart', touchPoints: [point] });
		await expect(dialog).not.toHaveAttribute('data-dragging', '');
		await expect(dialog).toHaveAttribute('data-closing', '');
		expect(await offset()).toBeCloseTo(before);
		await cdp.send('Input.dispatchTouchEvent', {
			type: 'touchMove',
			touchPoints: [{ ...point, y: point.y - 40 }]
		});
		await cdp.send('Input.dispatchTouchEvent', { type: 'touchCancel', touchPoints: [] });
		await expect(dialog).toHaveAttribute('data-closing', '');
		await dialog.evaluate((el) => el.getAnimations().forEach((animation) => animation.finish()));
		await expect(dialog).toBeHidden();
		await expect(page).toHaveURL(url);
		await expect(row).toBeFocused();
		await page.evaluate(() => history.back());
		await expect(page).not.toHaveURL(url);
	} finally {
		await cdp.detach();
	}
});
