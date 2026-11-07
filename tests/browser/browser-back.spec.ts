import { expect, test, type Page } from '@playwright/test';

test.use({ viewport: { width: 430, height: 932 }, isMobile: true, hasTouch: true });

async function openDisplaySettings(page: Page) {
	await page.goto('/Chronos/');
	await page.getByRole('tab', { name: '我的', exact: true }).click();
	await page.getByText('显示设置', { exact: true }).click();
	await expect(page.locator('.secondary-page')).toBeVisible();
	await expect(page.locator('html')).not.toHaveClass(/nav-forward|nav-back/);
}

for (const device of [
	{ name: 'touch browser', userAgent: undefined, standalone: false },
	{
		name: 'iPhone PWA',
		userAgent:
			'Mozilla/5.0 (iPhone; CPU iPhone OS 18_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148',
		standalone: true
	},
	{
		name: 'iPhone Safari',
		userAgent:
			'Mozilla/5.0 (iPhone; CPU iPhone OS 18_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.0 Mobile/15E148 Safari/604.1',
		standalone: false
	},
	{
		name: 'iPad PWA with a desktop user agent',
		userAgent:
			'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.0 Safari/605.1.15',
		standalone: true
	}
]) {
	test.describe(device.name, () => {
		test.use({ userAgent: device.userAgent });

		test('leaves edge gestures to the browser without moving a second page layer', async ({
			page,
			request
		}) => {
			await request.post('/__e2e/deploy?build=old');
			await page.addInitScript((standalone) => {
				// These profiles exercise app behavior, not the iOS system compositor.
				Object.defineProperty(navigator, 'userAgentData', { value: undefined });
				Object.defineProperty(navigator, 'standalone', { value: standalone });
				localStorage.setItem('chronos:/Chronos:chronos:onboarding-seen', '1');
				localStorage.setItem('chronos:/Chronos:chronos:pwa-install-snoozed-until', '9999999999999');
			}, device.standalone);
			await openDisplaySettings(page);
			const url = page.url();
			const cdp = await page.context().newCDPSession(page);
			try {
				for (const release of ['touchCancel', 'touchEnd'] as const) {
					await cdp.send('Input.dispatchTouchEvent', {
						type: 'touchStart',
						touchPoints: [{ x: 10, y: 300, id: 1 }]
					});
					for (const x of [40, 80, 120, 170, 220]) {
						await cdp.send('Input.dispatchTouchEvent', {
							type: 'touchMove',
							touchPoints: [{ x, y: 300, id: 1 }]
						});
					}
					expect(
						await page
							.locator('.secondary-root, .shell-root')
							.evaluateAll((nodes) => nodes.map((node) => (node as HTMLElement).style.transform))
					).toEqual(['', '']);
					await cdp.send('Input.dispatchTouchEvent', { type: release, touchPoints: [] });
					await expect(page).toHaveURL(url);
					await expect(page.locator('.secondary-page')).toBeVisible();
				}
				await page
					.locator('.secondary-page')
					.getByRole('button', { name: '返回', exact: true })
					.first()
					.click();
				await expect(page.locator('.secondary-page')).toHaveCount(0);
				await expect(page.getByRole('tab', { name: '我的', exact: true })).toHaveAttribute(
					'aria-selected',
					'true'
				);
				await page.goForward();
				await expect(page).toHaveURL(url);
				await expect(page.locator('.secondary-page')).toBeVisible();
				await page.goBack();
				await expect(page.locator('.secondary-page')).toHaveCount(0);
			} finally {
				await cdp.detach();
			}
		});
	});
}

test('nested history and deep-link fallback preserve the shell until the final return', async ({
	page,
	request
}) => {
	await request.post('/__e2e/deploy?build=old');
	await page.addInitScript(() =>
		localStorage.setItem('chronos:/Chronos:chronos:onboarding-seen', '1')
	);
	await page.goto('/Chronos/open-source-licenses');
	await page.locator('.secondary-page a[href$="/open-source-licenses/project"]').click();
	await expect(page).toHaveURL(/\/open-source-licenses\/project$/);
	await expect(page.locator('html')).not.toHaveClass(/nav-forward|nav-back/);
	await page.goBack();
	await expect(page).toHaveURL(/\/open-source-licenses$/);
	await expect(page.locator('html')).not.toHaveClass(/nav-forward|nav-back/);
	await expect(page.locator('.shell-content')).toHaveCSS('content-visibility', 'hidden');
	await page
		.locator('.secondary-page')
		.getByRole('button', { name: '返回', exact: true })
		.first()
		.click();
	await expect(page).toHaveURL(/\/about$/);
	await expect(page.locator('html')).not.toHaveClass(/nav-forward|nav-back/);
	await page
		.locator('.secondary-page')
		.getByRole('button', { name: '返回', exact: true })
		.first()
		.click();
	await expect(page.locator('.secondary-page')).toHaveCount(0);
	await expect(page.getByRole('tab', { name: '我的', exact: true })).toHaveAttribute(
		'aria-selected',
		'true'
	);
	await expect(page.locator('.shell-content')).toHaveCSS('content-visibility', 'visible');
});
