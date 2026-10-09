import { test, expect } from '@playwright/test';

for (const viewport of [
	{ width: 390, height: 844 },
	{ width: 1280, height: 900 }
]) {
	test(`ArKnights menu background and theme lifecycle at ${viewport.width}px`, async ({
		page,
		context,
		request
	}) => {
		await page.setViewportSize(viewport);
		await request.post('/__e2e/deploy?build=old');
		await page.addInitScript(() =>
			localStorage.setItem('chronos:/Chronos:chronos:onboarding-seen', '1')
		);
		await context.route('https://ue-dnd.github.io/Chronos/plugins/releases/**', async (route) => {
			const url = new URL(route.request().url());
			const path = url.pathname.replace('/Chronos/plugins/releases/', '/__e2e/market/');
			const response = await route.fetch({ url: `http://127.0.0.1:4179${path}${url.search}` });
			await route.fulfill({ response });
		});
		await page.goto('/Chronos/plugins');
		await page.getByRole('tab', { name: '插件市场', exact: true }).click();
		for (const name of ['Arknights', '重庆理工大学']) {
			const row = page
				.locator('div.flex.items-center.justify-between')
				.filter({ has: page.getByText(name, { exact: true }) })
				.last();
			await row.getByRole('button', { name: '安装', exact: true }).click();
			await expect(row.getByText('已安装', { exact: true })).toBeVisible();
		}
		await page.goto('/Chronos/wallpaper');
		await expect(page.getByText('Arknights 主题', { exact: true })).toBeVisible();
		await expect(page.getByText('Material 3 主题', { exact: false })).toBeVisible();
		await expect(page.getByText('纸白与石墨表面', { exact: false })).toHaveCount(0);
		await page
			.locator('label')
			.filter({ has: page.getByText('ArKnights', { exact: true }) })
			.click();
		await expect(page.locator('html')).toHaveClass(/chronos-theme-arknights/);
		await expect(page.locator('h1').first()).toHaveCSS('font-family', /Songti SC/);
		await expect(page.locator('.secondary-scroll')).toHaveCSS(
			'background-image',
			/data:image\/jpeg/
		);
		await expect(page.getByText('当前主题未提供壁纸', { exact: true })).toHaveCount(0);

		for (const mode of ['亮色主题', '暗色主题']) {
			await page.goto('/Chronos/display-settings');
			await page
				.locator('label')
				.filter({ has: page.getByText(mode, { exact: true }) })
				.click();
			await expect(page.getByRole('radio', { name: mode, exact: true })).toBeChecked();
			await expect(page.getByRole('radio', { name: '跟随系统', exact: true })).not.toBeChecked();
			await expect(page.locator('html')).toHaveClass(
				mode === '暗色主题' ? /dark/ : /chronos-theme-arknights/
			);
			await expect(page.locator('.secondary-scroll')).toHaveCSS(
				'background-image',
				/data:image\/jpeg/
			);
			await expect(page.locator('.ui-section-surface').first()).toHaveCSS('border-radius', '0px');
			const toggle = page.getByRole('switch', { name: '高亮当前节次', exact: true });
			await expect(toggle).toHaveCSS('border-radius', '0px');
			await expect(toggle.locator('[data-switch-thumb]')).toHaveCSS('border-radius', '0px');
			const initial = await toggle.getAttribute('aria-checked');
			await toggle.focus();
			await page.keyboard.press('Space');
			await expect(toggle).toHaveAttribute('aria-checked', initial === 'true' ? 'false' : 'true');
			await page.screenshot({
				animations: 'disabled',
				path: `dist/e2e/arknights-${viewport.width}-${mode}.png`
			});
			await page.goto('/Chronos/');
			const mineTab = page.getByRole('tab', { name: '我的', exact: true });
			await mineTab.click();
			await expect(mineTab).toHaveAttribute('aria-selected', 'true');
			await expect(mineTab).toHaveCSS('outline-style', 'none');
			await expect(page.locator('.mine-menu-background')).toHaveCSS(
				'background-image',
				/data:image\/jpeg/
			);
			const search = page.getByRole('searchbox', { name: '搜索设置', exact: true });
			await expect(search.locator('..')).toHaveCSS('border-radius', '0px');
			await search.fill('显示设置');
			await expect(page.getByText('显示设置', { exact: true })).toBeVisible();
			await page.getByRole('button', { name: '清空搜索', exact: true }).click();
			await expect(search).toHaveValue('');
			await page.screenshot({
				animations: 'disabled',
				path: `dist/e2e/arknights-mine-${viewport.width}-${mode}.png`
			});
			expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(
				true
			);
		}

		await page.goto('/Chronos/plugins');
		await page.getByRole('tab', { name: '插件市场', exact: true }).click();
		const marketInstallBtn = page
			.locator('div.flex.items-center.justify-between')
			.filter({ has: page.getByText('自定义时间', { exact: true }) })
			.last()
			.getByRole('button', { name: '安装', exact: true });
		await expect(marketInstallBtn).toHaveCSS(
			'background-color',
			/rgb\(74,\s*171,\s*234\)|rgb\(0,\s*106,\s*147\)/
		);
		await page.screenshot({
			animations: 'disabled',
			path: `dist/e2e/arknights-market-${viewport.width}.png`
		});

		await page.goto('/Chronos/about/install');
		await expect(page.locator('.rounded-card')).toHaveCount(2);
		for (const card of await page.locator('.rounded-card').all()) {
			await expect(card).toHaveCSS('border-radius', '0px');
		}
		await expect(page.locator('.rounded-inset')).toHaveCSS('border-radius', '0px');
		await expect(page.locator('.ui-btn-filled')).toHaveCSS('border-radius', '0px');
		await page.screenshot({
			animations: 'disabled',
			path: `dist/e2e/arknights-install-${viewport.width}.png`
		});
		await page.goto('/Chronos/transfer/import');
		await page.getByRole('tab', { name: '教务 HTML', exact: true }).click();
		const htmlButton = page.getByRole('button', { name: '选择 HTML 文件', exact: true });
		await expect(htmlButton).toHaveCSS('border-radius', '0px');
		const selectedTab = page.getByRole('tab', { name: '教务 HTML', exact: true });
		await expect(selectedTab).toHaveCSS('font-family', /monospace/);
		const selectedPaint = await selectedTab.evaluate((el) => {
			const style = getComputedStyle(el);
			return { fill: style.backgroundColor, text: style.color, signal: style.borderBottomColor };
		});
		expect(selectedPaint.fill).not.toBe('rgba(0, 0, 0, 0)');
		expect(selectedPaint.text).not.toBe(selectedPaint.fill);
		expect(selectedPaint.signal).not.toBe('rgba(0, 0, 0, 0)');
		await htmlButton.focus();
		await page.keyboard.press('Shift+Tab');
		await expect(selectedTab).toBeFocused();
		await expect(selectedTab).toHaveCSS('outline-style', 'solid');
		const chooser = page.waitForEvent('filechooser');
		await htmlButton.click();
		expect((await chooser).isMultiple()).toBe(false);
		await page.screenshot({
			animations: 'disabled',
			path: `dist/e2e/arknights-html-${viewport.width}.png`
		});

		await page.emulateMedia({ reducedMotion: 'reduce' });
		await page.goto('/Chronos/wallpaper');
		await page
			.locator('label')
			.filter({ has: page.getByText('Material 3', { exact: true }) })
			.click();
		await expect(page.locator('html')).not.toHaveClass(/chronos-theme-arknights/);
		await expect(page.locator('h1').first()).not.toHaveCSS('font-family', /Songti SC/);
		await expect(page.locator('.secondary-scroll')).toHaveCSS('background-image', 'none');
		await expect
			.poll(() =>
				page
					.locator('.ui-section-surface')
					.first()
					.evaluate(
						(el) =>
							parseFloat(getComputedStyle(el).borderRadius) /
							parseFloat(getComputedStyle(document.documentElement).fontSize)
					)
			)
			.toBe(1.25);
		await page.goto('/Chronos/about/install');
		await expect
			.poll(() =>
				page
					.locator('.rounded-card')
					.first()
					.evaluate(
						(el) =>
							parseFloat(getComputedStyle(el).borderRadius) /
							parseFloat(getComputedStyle(document.documentElement).fontSize)
					)
			)
			.toBe(1.5);
		await expect
			.poll(() =>
				page
					.locator('.rounded-inset')
					.evaluate(
						(el) =>
							parseFloat(getComputedStyle(el).borderRadius) /
							parseFloat(getComputedStyle(document.documentElement).fontSize)
					)
			)
			.toBe(0.75);
		await page.goto('/Chronos/display-settings');
		const restoredSwitch = page.getByRole('switch', { name: '高亮当前节次', exact: true });
		await expect
			.poll(() => restoredSwitch.evaluate((el) => parseFloat(getComputedStyle(el).borderRadius)))
			.toBeGreaterThan(0);
		await expect
			.poll(() =>
				restoredSwitch
					.locator('[data-switch-thumb]')
					.evaluate((el) => parseFloat(getComputedStyle(el).borderRadius))
			)
			.toBeGreaterThan(0);
		await page.goto('/Chronos/');
		await page.getByRole('tab', { name: '我的', exact: true }).click();
		const restoredSearch = page.getByRole('searchbox', { name: '搜索设置', exact: true });
		await expect
			.poll(() =>
				restoredSearch.locator('..').evaluate((el) => parseFloat(getComputedStyle(el).borderRadius))
			)
			.toBeGreaterThan(0);
		await page.goto('/Chronos/transfer/import');
		await page.getByRole('tab', { name: '教务 HTML', exact: true }).click();
		await expect
			.poll(() => htmlButton.evaluate((el) => parseFloat(getComputedStyle(el).borderRadius)))
			.toBeGreaterThan(0);
	});
}
