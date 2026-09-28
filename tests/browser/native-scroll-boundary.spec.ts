import { expect, test, type APIRequestContext, type Locator, type Page } from '@playwright/test';

test.use({ viewport: { width: 430, height: 932 }, isMobile: true, hasTouch: true });

async function openMine(page: Page, request: APIRequestContext) {
	await request.post('/__e2e/deploy?build=old');
	await page.addInitScript(() => localStorage.setItem('chronos:onboarding-seen', '1'));
	await page.goto('/Chronos/');
	await page.getByRole('tab', { name: '我的', exact: true }).click();
	const scroll = page.locator('.shell-tab-panel:not([hidden]) .app-scroll-y');
	await expect(scroll).toBeVisible();
	await expect
		.poll(() => scroll.evaluate((node) => node.scrollHeight - node.clientHeight))
		.toBeGreaterThan(0);
	return scroll;
}

function scrollState(scroll: Locator) {
	return scroll.evaluate((node) => ({
		scrollTop: node.scrollTop,
		maxScroll: node.scrollHeight - node.clientHeight,
		viewportTop: node.getBoundingClientRect().top,
		transform: node.style.transform,
		overscrollBehaviorY: getComputedStyle(node).overscrollBehaviorY
	}));
}

test('Mine keeps its scroll viewport in place during a boundary reversal', async ({
	page,
	request
}) => {
	const scroll = await openMine(page, request);
	await scroll.evaluate((node) => (node.scrollTop = 0));
	const initial = await scrollState(scroll);
	expect(initial.overscrollBehaviorY).toBe('contain');

	const cdp = await page.context().newCDPSession(page);
	const point = (y: number) => ({ x: 215, y, id: 1 });
	try {
		await cdp.send('Input.dispatchTouchEvent', { type: 'touchStart', touchPoints: [point(300)] });
		for (const y of [380, 460, 540, 620, 700]) {
			await cdp.send('Input.dispatchTouchEvent', { type: 'touchMove', touchPoints: [point(y)] });
		}
		const pulled = await scrollState(scroll);
		expect(pulled.scrollTop).toBe(0);
		expect(pulled.viewportTop).toBeCloseTo(initial.viewportTop);
		expect(pulled.transform).toBe('');

		for (const y of [680, 640, 600, 520, 440, 360]) {
			await cdp.send('Input.dispatchTouchEvent', { type: 'touchMove', touchPoints: [point(y)] });
		}
		await expect.poll(() => scroll.evaluate((node) => node.scrollTop)).toBeGreaterThan(0);
		const reversed = await scrollState(scroll);
		expect(reversed.viewportTop).toBeCloseTo(initial.viewportTop);
		expect(reversed.transform).toBe('');
	} finally {
		await cdp.send('Input.dispatchTouchEvent', { type: 'touchEnd', touchPoints: [] });
		await cdp.detach();
	}
});

test('Mine can scroll back from a bottom boundary pull without shifting its viewport', async ({
	page,
	request
}) => {
	const scroll = await openMine(page, request);
	await scroll.evaluate((node) => (node.scrollTop = node.scrollHeight - node.clientHeight));
	const initial = await scrollState(scroll);
	const cdp = await page.context().newCDPSession(page);
	const point = (y: number) => ({ x: 215, y, id: 1 });
	try {
		await cdp.send('Input.dispatchTouchEvent', { type: 'touchStart', touchPoints: [point(700)] });
		for (const y of [620, 540, 460, 380, 300, 220, 140]) {
			await cdp.send('Input.dispatchTouchEvent', { type: 'touchMove', touchPoints: [point(y)] });
		}
		const pulled = await scrollState(scroll);
		expect(pulled.scrollTop).toBeCloseTo(initial.maxScroll);
		expect(pulled.viewportTop).toBeCloseTo(initial.viewportTop);
		expect(pulled.transform).toBe('');

		for (const y of [160, 200, 240, 320, 400, 480, 560]) {
			await cdp.send('Input.dispatchTouchEvent', { type: 'touchMove', touchPoints: [point(y)] });
		}
		await expect
			.poll(() => scroll.evaluate((node) => node.scrollTop))
			.toBeLessThan(initial.maxScroll);
		const reversed = await scrollState(scroll);
		expect(reversed.viewportTop).toBeCloseTo(initial.viewportTop);
		expect(reversed.transform).toBe('');
	} finally {
		await cdp.send('Input.dispatchTouchEvent', { type: 'touchEnd', touchPoints: [] });
		await cdp.detach();
	}
});

test('secondary pages use the same native scroll boundary setting', async ({ page, request }) => {
	await openMine(page, request);
	await page.getByText('显示设置', { exact: true }).click();
	const scroll = page.locator('.secondary-scroll').first();
	await expect(scroll).toBeVisible();
	const state = await scrollState(scroll);
	expect(state.overscrollBehaviorY).toBe('contain');
	expect(state.transform).toBe('');
});
