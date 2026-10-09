import { test, expect } from '@playwright/test';

test.use({ viewport: { width: 430, height: 932 }, isMobile: true, hasTouch: true });

for (const labels of [
	{
		locale: 'zh-cn',
		heading: '反馈设置',
		title: '提醒时间',
		minutes: (n: number) => `${n} 分钟前`,
		cancel: '取消',
		confirm: '确定'
	},
	{
		locale: 'en',
		heading: 'Feedback settings',
		title: 'Reminder time',
		minutes: (n: number) => `${n} min before`,
		cancel: 'Cancel',
		confirm: 'OK'
	}
]) {
	test.describe(labels.locale, () => {
		test.use({ locale: labels.locale === 'en' ? 'en-US' : 'zh-CN' });
		test(`preparation wheel confirms and cancels in ${labels.locale}`, async ({
			page,
			request
		}, testInfo) => {
			await request.post('/__e2e/deploy?build=old');
			await page.addInitScript(() =>
				localStorage.setItem('chronos:/Chronos:chronos:onboarding-seen', '1')
			);
			await page.goto('/Chronos/feedback-settings');
			await expect(page.getByRole('heading', { name: labels.heading, exact: true })).toBeVisible();
			const row = page.getByRole('button', { name: new RegExp(labels.title) });
			await expect(row).toContainText(labels.minutes(30));
			await row.click();
			const wheel = page.getByRole('listbox', { name: labels.title });
			await expect(wheel.getByRole('option')).toHaveCount(12);
			await expect(wheel.getByRole('option', { name: '30', exact: true })).toHaveAttribute(
				'aria-selected',
				'true'
			);
			await expect.poll(() => wheel.evaluate((node) => Math.round(node.scrollTop))).toBe(200);
			await expect
				.poll(() =>
					page
						.getByRole('dialog')
						.evaluate((node) => Math.round(node.getBoundingClientRect().bottom))
				)
				.toBe(932);
			await page.screenshot({ path: testInfo.outputPath(`feedback-${labels.locale}.png`) });
			await wheel.focus();
			await wheel.press('End');
			await expect.poll(() => wheel.evaluate((node) => Math.round(node.scrollTop))).toBe(440);
			await expect(wheel.getByRole('option', { name: '60', exact: true })).toHaveAttribute(
				'aria-selected',
				'true'
			);
			await page.getByRole('button', { name: labels.cancel, exact: true }).click();
			await expect(wheel).toBeHidden();
			await expect(row).toContainText(labels.minutes(30));
			await row.click();
			await expect(wheel.getByRole('option', { name: '30', exact: true })).toHaveAttribute(
				'aria-selected',
				'true'
			);
			await wheel.focus();
			await wheel.press('Home');
			await expect.poll(() => wheel.evaluate((node) => Math.round(node.scrollTop))).toBe(0);
			await page.getByRole('button', { name: labels.confirm, exact: true }).click();
			await expect(wheel).toBeHidden();
			await expect(row).toContainText(labels.minutes(5));
			expect(
				await page.evaluate(() =>
					localStorage.getItem('chronos:/Chronos:chronos_preferences:prepare_reminder_minutes')
				)
			).toBe('5');
			await page.reload();
			await expect(row).toContainText(labels.minutes(5));
		});
	});
}
