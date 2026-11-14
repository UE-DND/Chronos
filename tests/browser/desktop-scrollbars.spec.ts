import { expect, test, type Page } from '@playwright/test';

// Chromium hides native scrollbar hit targets by default in headless mode.
test.use({ launchOptions: { ignoreDefaultArgs: ['--hide-scrollbars'] } });

async function openDisplaySettings(page: Page) {
	await page.addInitScript(() => {
		localStorage.setItem('chronos:/Chronos:chronos:onboarding-seen', '1');
		localStorage.setItem('chronos:/Chronos:chronos:pwa-install-snoozed-until', '9999999999999');
	});
	await page.goto('/Chronos/');
	await page.getByRole('tab', { name: '我的', exact: true }).click();
	await page.getByText('显示设置', { exact: true }).click();
	const scroll = page.locator('.secondary-scroll').first();
	await expect(scroll).toBeVisible();
	return scroll;
}

test.beforeEach(async ({ request }) => {
	await request.post('/__e2e/deploy?build=old');
});

test.describe('desktop content scrolling', () => {
	test.use({
		viewport: { width: 1100, height: 640 },
		isMobile: false,
		hasTouch: false
	});

	test('content exposes native scrollbars without a duplicate overlay thumb', async ({ page }) => {
		const scroll = await openDisplaySettings(page);
		await expect
			.poll(() => scroll.evaluate((node) => getComputedStyle(node).scrollbarWidth))
			.toBe('auto');
		const { height, maxScroll } = await scroll.evaluate((node) => ({
			height: node.scrollHeight,
			maxScroll: node.scrollHeight - node.clientHeight
		}));
		expect(maxScroll).toBeGreaterThan(0);
		await scroll.hover();
		await page.mouse.wheel(0, height);
		await expect.poll(() => scroll.evaluate((node) => node.scrollTop)).toBe(maxScroll);
		await expect(scroll.locator('..').locator('.secondary-scroll-thumb')).toBeHidden();
		const gutter = await scroll.evaluate(
			(node: HTMLElement) => node.offsetWidth - node.clientWidth
		);
		const box = (await scroll.boundingBox())!;
		const thumbCenter = await scroll.evaluate(
			(node) => ((node.scrollTop + node.clientHeight / 2) * node.clientHeight) / node.scrollHeight
		);
		// The wheel reveals OS overlay scrollbars; classic scrollbars occupy a gutter.
		const x = box.x + box.width - (gutter > 0 ? gutter / 2 : 6);
		await page.mouse.move(x, box.y + thumbCenter);
		await page.mouse.down();
		await page.mouse.move(x, box.y + thumbCenter - 100, { steps: 6 });
		await page.mouse.up();
		await expect.poll(() => scroll.evaluate((node) => node.scrollTop)).toBeLessThan(maxScroll);
	});

	test('bottom navigation retains a visible keyboard focus indicator', async ({ page }) => {
		await page.addInitScript(() =>
			localStorage.setItem('chronos:/Chronos:chronos:onboarding-seen', '1')
		);
		await page.goto('/Chronos/');
		const mine = page.getByRole('tab', { name: '我的', exact: true });
		await expect(mine).toBeVisible();
		await page.keyboard.press('Tab');
		await mine.focus();
		await expect(mine).toBeFocused();
		await expect
			.poll(() => mine.evaluate((node) => getComputedStyle(node).outlineWidth))
			.toBe('2px');
		await expect(mine).toHaveCSS('outline-style', 'solid');
	});

	test('native scrollbars honor forced colors', async ({ page }) => {
		await page.emulateMedia({ forcedColors: 'active' });
		const scroll = await openDisplaySettings(page);
		const styles = await scroll.evaluate((node) => {
			const style = getComputedStyle(node);
			return { width: style.scrollbarWidth, color: style.scrollbarColor };
		});
		expect(styles).toEqual({ width: 'auto', color: 'auto' });
	});
});

test.describe('touch content scrolling', () => {
	test.use({ viewport: { width: 430, height: 640 }, isMobile: true, hasTouch: true });

	test('touch keeps transient scrollbar feedback and the existing zoom policy', async ({
		page
	}) => {
		const scroll = await openDisplaySettings(page);
		expect(await scroll.evaluate((node) => getComputedStyle(node).scrollbarWidth)).toBe('none');
		await scroll.evaluate((node) => {
			node.scrollTop = 100;
			node.dispatchEvent(new Event('scroll'));
		});
		const thumb = scroll.locator('..').locator('.secondary-scroll-thumb');
		await expect(thumb).toHaveCSS('opacity', '1');
		await expect(thumb).toHaveCSS('opacity', '0');
		await expect(page.locator('meta[name="viewport"]')).toHaveAttribute(
			'content',
			/user-scalable=no/
		);
	});
});
