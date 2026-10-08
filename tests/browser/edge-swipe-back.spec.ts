import { expect, test } from '@playwright/test';

test.use({ viewport: { width: 430, height: 932 }, isMobile: true, hasTouch: true });

test('edge scrolling ignores sideways jitter while deliberate swipes still return', async ({
	page,
	request
}) => {
	await request.post('/__e2e/deploy?build=old');
	await page.addInitScript(() => localStorage.setItem('chronos:onboarding-seen', '1'));
	await page.goto('/Chronos/');
	await page.getByRole('tab', { name: '我的', exact: true }).click();
	await page.getByText('显示设置', { exact: true }).click();
	const secondary = page.locator('.secondary-root');
	await expect(page.locator('.secondary-page')).toBeVisible();
	await expect(page.locator('html')).not.toHaveClass(/nav-forward|nav-back/);
	await expect
		.poll(() => secondary.evaluate((node) => new DOMMatrix(getComputedStyle(node).transform).m42))
		.toBe(0);
	const url = page.url();
	const cdp = await page.context().newCDPSession(page);
	const point = (x: number, y: number) => ({ x, y, id: 1 });
	try {
		await cdp.send('Input.dispatchTouchEvent', {
			type: 'touchStart',
			touchPoints: [point(10, 300)]
		});
		await cdp.send('Input.dispatchTouchEvent', {
			type: 'touchMove',
			touchPoints: [point(13, 302)]
		});
		expect(await secondary.evaluate((node) => node.style.transform)).toBe('');
		for (const [x, y] of [
			[22, 324],
			[28, 360],
			[50, 420]
		]) {
			await cdp.send('Input.dispatchTouchEvent', { type: 'touchMove', touchPoints: [point(x, y)] });
		}
		await cdp.send('Input.dispatchTouchEvent', { type: 'touchEnd', touchPoints: [] });
		await expect(page).toHaveURL(url);
		expect(await secondary.evaluate((node) => node.style.transform)).toBe('');

		await cdp.send('Input.dispatchTouchEvent', {
			type: 'touchStart',
			touchPoints: [point(10, 300)]
		});
		for (const x of [40, 80, 120, 170, 220]) {
			await cdp.send('Input.dispatchTouchEvent', {
				type: 'touchMove',
				touchPoints: [point(x, 300)]
			});
		}
		expect(await secondary.evaluate((node) => node.style.transform)).toContain('translate3d');
		await cdp.send('Input.dispatchTouchEvent', { type: 'touchEnd', touchPoints: [] });
		await expect(page.locator('.secondary-page')).toHaveCount(0);
		await expect(page.getByRole('tab', { name: '我的', exact: true })).toHaveAttribute(
			'aria-selected',
			'true'
		);
	} finally {
		await cdp.detach();
	}
});
