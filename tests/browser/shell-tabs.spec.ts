import { test, expect } from '@playwright/test';

test.use({ viewport: { width: 430, height: 932 }, isMobile: true, hasTouch: true });

test('keeps inactive shell panels hidden after plugin utilities load', async ({
	page,
	request
}) => {
	await request.post('/__e2e/deploy?build=old');
	await page.addInitScript(() => localStorage.setItem('chronos:onboarding-seen', '1'));
	await page.goto('/Chronos/');
	const mineTab = page.getByRole('tab', { name: '我的', exact: true });
	const timetableTab = page.getByRole('tab', { name: '课表', exact: true });
	await mineTab.click();
	await expect(page.getByRole('heading', { name: '我的', exact: true })).toBeVisible();

	// Plugins ship only the utilities they use, and inject them after the host stylesheet.
	await page.addStyleTag({ content: '@layer utilities { .flex { display: flex; } }' });
	const panels = page.locator('.shell-content > div > [aria-hidden]');
	const minePanel = panels.filter({ has: page.locator('h1', { hasText: '我的' }) });
	const mountedMine = await minePanel.elementHandle();
	const location = page.url();
	const historyLength = await page.evaluate(() => history.length);

	for (let i = 0; i < 3; i++) {
		await timetableTab.click();
		await expect(timetableTab).toHaveAttribute('aria-selected', 'true');
		await expect(page.getByRole('heading', { name: '还没有课程表', exact: true })).toBeVisible();
		await expect(minePanel).toHaveCSS('display', 'none');
		await expect(minePanel).toHaveAttribute('inert', '');
		await expect(panels.filter({ visible: true })).toHaveCount(1);

		await mineTab.click();
		await expect(mineTab).toHaveAttribute('aria-selected', 'true');
		await expect(page.getByRole('heading', { name: '我的', exact: true })).toBeVisible();
		await expect(panels.filter({ visible: true })).toHaveCount(1);
	}

	expect(await mountedMine?.evaluate((node) => node.isConnected)).toBe(true);
	expect(page.url()).toBe(location);
	expect(await page.evaluate(() => history.length)).toBe(historyLength);
});
