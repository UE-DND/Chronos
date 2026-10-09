import { expect, test, type APIRequestContext, type Page } from '@playwright/test';

declare global {
	interface Window {
		__routeMotion: {
			pause: boolean;
			animations: Animation[];
			completed: number;
			canceled: number;
		};
	}
}

test.use({ viewport: { width: 430, height: 932 }, isMobile: true, hasTouch: true });

async function openMine(page: Page, request: APIRequestContext, pause = false) {
	await request.post('/__e2e/deploy?build=old');
	await page.addInitScript((pause) => {
		localStorage.setItem('chronos:/Chronos:chronos:onboarding-seen', '1');
		// Exercise the same real DOM fallback used by the native Android host.
		delete (Document.prototype as { startViewTransition?: unknown }).startViewTransition;
		window.__routeMotion = { pause, animations: [], completed: 0, canceled: 0 };
		// oxlint-disable-next-line typescript/unbound-method -- Rebound with apply below.
		const animate = Element.prototype.animate;
		Element.prototype.animate = function (...args) {
			const animation = animate.apply(this, args);
			if (this.matches('.secondary-root,.shell-root')) {
				const probe = window.__routeMotion;
				probe.animations.push(animation);
				if (probe.pause) animation.pause();
				void animation.finished.then(
					() => ++probe.completed,
					() => ++probe.canceled
				);
			}
			return animation;
		};
	}, pause);
	await page.goto('/Chronos/');
	await page.getByRole('tab', { name: '我的', exact: true }).click();
}

function resume(page: Page) {
	return page.evaluate(() => {
		window.__routeMotion.pause = false;
		for (const animation of window.__routeMotion.animations) {
			if (animation.playState === 'paused') animation.play();
		}
	});
}

test('delayed native motion keeps the shell visible and holds the exit until route commit', async ({
	page,
	request
}) => {
	await openMine(page, request, true);
	await page.getByText('显示设置', { exact: true }).click();
	await expect.poll(() => page.evaluate(() => window.__routeMotion.animations.length)).toBe(2);
	const shellContent = page.locator('.shell-content');
	await expect(shellContent).toHaveCSS('content-visibility', 'visible');
	// Exceed both former fixed timers while the real animations remain paused.
	await page.waitForTimeout(350);
	await expect(shellContent).toHaveCSS('content-visibility', 'visible');
	expect(await page.evaluate(() => window.__routeMotion.completed)).toBe(0);
	await resume(page);
	await expect(shellContent).toHaveCSS('content-visibility', 'hidden');
	expect(await page.evaluate(() => window.__routeMotion.completed)).toBe(2);

	await page.evaluate(() => {
		window.__routeMotion.pause = true;
		(document.querySelector('.secondary-page button[aria-label="返回"]') as HTMLElement).click();
	});
	await expect.poll(() => page.evaluate(() => window.__routeMotion.animations.length)).toBe(4);
	await expect(shellContent).toHaveCSS('content-visibility', 'visible');
	await page.waitForTimeout(350);
	await expect(page.locator('.secondary-page')).toHaveCount(1);
	expect(await page.evaluate(() => window.__routeMotion.completed)).toBe(2);
	await resume(page);
	await expect(page.locator('.secondary-page')).toHaveCount(0);
	await expect(shellContent).toHaveCSS('content-visibility', 'visible');
	expect(await page.evaluate(() => window.__routeMotion.completed)).toBe(4);
	expect(await page.evaluate(() => window.__routeMotion.canceled)).toBe(0);
});

test('returning during entry does not leave the shell frozen or navigation waiting', async ({
	page,
	request
}) => {
	await openMine(page, request, true);
	await page.getByText('显示设置', { exact: true }).click();
	await expect.poll(() => page.evaluate(() => window.__routeMotion.animations.length)).toBe(2);
	await page.evaluate(() => {
		window.__routeMotion.pause = false;
		(document.querySelector('.secondary-page button[aria-label="返回"]') as HTMLElement).click();
	});
	await expect(page.locator('.secondary-page')).toHaveCount(0);
	await expect(page.locator('.shell-content')).toHaveCSS('content-visibility', 'visible');
	expect(await page.evaluate(() => window.__routeMotion.canceled)).toBe(2);
	await page.getByText('反馈设置', { exact: true }).click();
	await expect(page.getByRole('heading', { name: '反馈设置', exact: true })).toBeVisible();
});

test.describe('native reduced motion', () => {
	test.use({ reducedMotion: 'reduce' });
	test('commits entry and return without starting route animations', async ({ page, request }) => {
		await openMine(page, request);
		await page.getByText('显示设置', { exact: true }).click();
		await page
			.locator('.secondary-page')
			.getByRole('button', { name: '返回', exact: true })
			.first()
			.click();
		await expect(page.locator('.secondary-page')).toHaveCount(0);
		await expect(page.locator('.shell-content')).toHaveCSS('content-visibility', 'visible');
		expect(await page.evaluate(() => window.__routeMotion.animations.length)).toBe(0);
	});
});
