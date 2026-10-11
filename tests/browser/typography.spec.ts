import { expect, test } from '@playwright/test';

for (const locale of ['zh-CN', 'en-US']) {
	for (const width of [390, 1280]) {
		test.describe(`system typography ${locale} at ${width}px`, () => {
			test.use({ locale, viewport: { width, height: 900 } });

			test('keeps font roles and weights consistent across pages, controls and plugins', async ({
				page,
				context,
				request
			}, testInfo) => {
				await request.post('/__e2e/deploy?build=old');
				await page.addInitScript(() =>
					localStorage.setItem('chronos:/Chronos:chronos:onboarding-seen', '1')
				);
				await context.route(
					'https://ue-dnd.github.io/Chronos/plugins/releases/**',
					async (route) => {
						const url = new URL(route.request().url());
						const path = url.pathname.replace('/Chronos/plugins/releases/', '/__e2e/market/');
						const response = await route.fetch({
							url: `http://127.0.0.1:4179${path}${url.search}`
						});
						await route.fulfill({ response });
					}
				);
				await page.goto('/Chronos/display-settings');
				for (const mode of ['light', 'dark']) {
					const label =
						locale === 'zh-CN'
							? mode === 'dark'
								? '暗色主题'
								: '亮色主题'
							: mode === 'dark'
								? 'Dark'
								: 'Light';
					await page
						.locator('label')
						.filter({ has: page.getByText(label, { exact: true }) })
						.click();
					await expect(page.getByRole('radio', { name: label, exact: true })).toBeChecked();
					await expect(page.locator('html')).toHaveCSS('font-family', 'system-ui, sans-serif');
					await expect(page.locator('html')).toHaveCSS('font-weight', '500');
					await expect(page.locator('h1').first()).toHaveCSS('font-weight', '400');
					await expect(page.locator('.ui-section-title').first()).toHaveCSS('font-weight', '500');
					await expect(page.locator('.row-title').first()).toHaveCSS('font-weight', '600');
					await page.getByRole('slider').focus();
					await page.getByRole('slider').press('End');
					expect(
						await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)
					).toBe(true);
					await page.screenshot({
						path: testInfo.outputPath(`${mode}-maximum.png`),
						fullPage: true
					});
				}

				await page.goto('/Chronos/timetable/course-editor');
				await expect(page.locator('.ui-field-label').first()).toHaveCSS('font-weight', '600');
				await expect(page.locator('.ui-form-field-input').first()).toHaveCSS('font-weight', '500');
				await expect(page.locator('.ui-form-field-input').first()).toHaveCSS(
					'font-family',
					'system-ui, sans-serif'
				);
				await expect(page.locator('.ui-btn').last()).toHaveCSS('font-weight', '600');

				const remark = page.locator('textarea[maxlength]');
				await expect(page.locator('.ui-form-field-counter')).toHaveCSS('font-weight', '400');
				await remark.fill('A'.repeat(Number(await remark.getAttribute('maxlength'))));
				await expect(page.locator('.ui-form-field-counter--limit')).toHaveCSS('font-weight', '400');
				await remark.clear();

				await page.locator('.ui-form-field-input[aria-haspopup="dialog"]').last().click();
				const sheet = page.getByRole('dialog');
				await expect(sheet.getByRole('heading')).toHaveCSS('font-weight', '400');
				await expect(sheet.getByRole('heading')).toHaveCSS('font-family', 'system-ui, sans-serif');
				await expect(sheet.getByRole('button').last()).toHaveCSS('font-weight', '600');
				await page.keyboard.press('Escape');
				await expect(sheet).toHaveCount(0);

				await page.goto('/Chronos/transfer/import');
				await expect(page.getByRole('heading', { level: 2 }).first()).toHaveCSS(
					'font-weight',
					'500'
				);
				await expect(page.getByRole('heading', { level: 2 }).first()).toHaveCSS(
					'font-family',
					'system-ui, sans-serif'
				);
				await expect(page.locator('.text-body-small.text-supporting').first()).toHaveCSS(
					'font-weight',
					'400'
				);
				await expect(page.locator('html')).toHaveCSS('font-family', 'system-ui, sans-serif');

				await page.goto('/Chronos/plugins');
				await page
					.getByRole('tab', {
						name: locale === 'zh-CN' ? '插件市场' : 'Marketplace',
						exact: true
					})
					.click();
				await page
					.getByRole('button', {
						name: locale === 'zh-CN' ? '从链接安装' : 'Install from link',
						exact: true
					})
					.click();
				const dialog = page.getByRole('dialog');
				await expect(dialog.getByRole('heading')).toHaveCSS('font-weight', '400');
				await expect(dialog.getByRole('heading')).toHaveCSS('font-family', 'system-ui, sans-serif');
				await expect(dialog.locator('.ui-btn').last()).toHaveCSS('font-weight', '600');
			});
		});
	}
}
