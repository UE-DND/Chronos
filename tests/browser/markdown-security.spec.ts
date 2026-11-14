import { readFileSync } from 'node:fs';
import { expect, test } from '@playwright/test';

const feed = JSON.parse(
	readFileSync(new URL('../../dist/e2e/old/version.json', import.meta.url), 'utf8')
) as { release: { tagName: string; name: string } };

test('renders a previously unopened Markdown page on the first offline visit', async ({
	page,
	context,
	request
}) => {
	await request.post('/__e2e/deploy?build=old');
	await context.route('https://ue-dnd.github.io/**', () => new Promise<void>(() => {}));
	await page.addInitScript(() => {
		localStorage.setItem('chronos:/Chronos:chronos:onboarding-seen', '1');
	});
	await page.goto('/Chronos/');
	await expect(page.locator('#chronos-boot-fallback')).toBeHidden();
	await expect(page.getByRole('tab', { name: '课表', exact: true })).toBeVisible();
	await page.evaluate(() => navigator.serviceWorker.ready);
	await expect
		.poll(() => page.evaluate(() => Boolean(navigator.serviceWorker.controller)))
		.toBe(true);
	await context.setOffline(true);
	await page.goto(`/Chronos/about/releases/${feed.release.tagName}`);
	await expect(page.getByRole('heading', { name: feed.release.name, exact: true })).toBeVisible();
	await expect(page.locator('.markdown-prose')).toBeVisible();
	await expect(page.locator('.markdown-prose')).not.toBeEmpty();
	await expect(page.getByText('无法显示文档内容，请重试。', { exact: true })).toHaveCount(0);
});
