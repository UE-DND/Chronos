import { expect, test, type Page } from '@playwright/test';

test.use({ viewport: { width: 430, height: 932 }, isMobile: true, hasTouch: true });

async function setNativeInsets(
	page: Page,
	top: number,
	right: number,
	bottom: number,
	left: number
) {
	await page.evaluate(
		(values) => {
			for (const [side, value] of Object.entries(values)) {
				document.documentElement.style.setProperty(`--safe-area-inset-${side}`, `${value}px`);
			}
		},
		{ top, right, bottom, left }
	);
}

test('native safe areas move between edges on rotation even when WebView env values are stale', async ({
	page,
	request
}) => {
	await request.post('/__e2e/deploy?build=old');
	await page.addInitScript(() => localStorage.setItem('chronos:onboarding-seen', '1'));
	const cdp = await page.context().newCDPSession(page);
	// Keep the browser's portrait values stale while native WindowInsets change.
	await cdp.send('Emulation.setSafeAreaInsetsOverride', {
		insets: { top: 32, right: 0, bottom: 16, left: 0 }
	});
	await page.goto('/Chronos/');
	await page.getByRole('tab', { name: '我的', exact: true }).click();
	const header = page.locator('.shell-tab-panel:not([hidden]) .ui-safe-area-top');
	const shell = page.locator('.shell-page');
	const rail = page.locator('.adaptive-edge-bar--shell');

	await setNativeInsets(page, 32, 0, 16, 0);
	await expect(header).toHaveCSS('padding-top', '32px');
	await page.setViewportSize({ width: 932, height: 430 });
	await setNativeInsets(page, 0, 0, 16, 32);
	await expect(header).toHaveCSS('padding-top', '0px');
	await expect(shell).toHaveCSS('padding-left', '32px');
	await expect(rail).toHaveCSS('padding-bottom', '24px');

	await setNativeInsets(page, 0, 32, 16, 0);
	await expect(shell).toHaveCSS('padding-left', '0px');
	await expect(rail).toHaveCSS('padding-right', '32px');
	await expect(header).toHaveCSS('padding-top', '0px');

	await page.setViewportSize({ width: 430, height: 932 });
	await setNativeInsets(page, 32, 0, 16, 0);
	await expect(header).toHaveCSS('padding-top', '32px');
	await expect(rail).toHaveCSS('padding-bottom', '16px');
	// A native zero must also override a stale env value (e.g. IME visibility).
	await setNativeInsets(page, 32, 0, 0, 0);
	await expect(rail).toHaveCSS('padding-bottom', '0px');
	await page.evaluate(() => {
		for (const side of ['top', 'right', 'bottom', 'left']) {
			document.documentElement.style.removeProperty(`--safe-area-inset-${side}`);
		}
	});
	await expect(rail).toHaveCSS('padding-bottom', '16px');
	await cdp.detach();
});
