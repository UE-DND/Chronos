import { expect, test } from '@playwright/test';

test('haptic settings reflect browser support without overwriting the saved preference', async ({
	page,
	request
}) => {
	await request.post('/__e2e/deploy?build=old');
	await page.addInitScript(() => {
		localStorage.setItem('chronos:/Chronos:chronos:onboarding-seen', '1');
		localStorage.setItem('chronos:/Chronos:chronos_preferences:haptic_feedback_enabled', '1');
	});
	await page.goto('/Chronos/feedback-settings');
	const supported = await page.evaluate(() => typeof navigator.vibrate === 'function');
	const row = page.locator('label').filter({ hasText: '振动反馈' });
	const toggle = row.getByRole('switch');
	if (supported) {
		await expect(toggle).toBeEnabled();
		await expect(toggle).toBeChecked();
		await expect(row).not.toContainText('当前浏览器不支持振动反馈');
	} else {
		await expect(toggle).toBeDisabled();
		await expect(toggle).not.toBeChecked();
		await expect(row).toContainText('当前浏览器不支持振动反馈');
	}
	expect(
		await page.evaluate(() =>
			localStorage.getItem('chronos:/Chronos:chronos_preferences:haptic_feedback_enabled')
		)
	).toBe('1');
});
