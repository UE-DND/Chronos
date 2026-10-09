import { test, expect, type Page } from '@playwright/test';

async function pluginValue(page: Page, base: string, write?: string) {
	return page.evaluate(
		async ({ base, write }) => {
			const database = await new Promise<IDBDatabase>((resolve, reject) => {
				const request = indexedDB.open(`chronos:${base}:db`);
				request.onsuccess = () => resolve(request.result);
				request.onerror = () => reject(request.error);
			});
			try {
				return await new Promise<string | null>((resolve, reject) => {
					const tx = database.transaction('pluginData', write ? 'readwrite' : 'readonly');
					const store = tx.objectStore('pluginData');
					if (write)
						store.put({
							id: 'isolation:private',
							pluginId: 'isolation',
							key: 'private',
							valueJson: JSON.stringify(write),
							updatedAt: 1
						});
					const request = store.get('isolation:private');
					tx.oncomplete = () => resolve(request.result?.valueJson ?? null);
					tx.onabort = () => reject(tx.error);
				});
			} finally {
				database.close();
			}
		},
		{ base, write }
	);
}

test('same-origin deployments isolate storage, synchronization and clearing', async ({
	context,
	page,
	request
}) => {
	await request.post('/__e2e/deploy?build=old');
	await context.addInitScript(() => {
		for (const base of ['/Chronos', '/Other']) {
			localStorage.setItem(`chronos:${base}:chronos:onboarding-seen`, '1');
		}
	});
	await context.route('https://ue-dnd.github.io/Chronos/plugins/releases/**', async (route) => {
		const url = new URL(route.request().url());
		const path = url.pathname.replace('/Chronos/plugins/releases/', '/__e2e/market/');
		await route.fulfill({
			response: await route.fetch({ url: `http://127.0.0.1:4179${path}${url.search}` })
		});
	});
	const other = await context.newPage();
	await page.goto('/Chronos/about');
	await other.goto('/Other/about');
	for (const [tab, base] of [
		[page, '/Chronos'],
		[other, '/Other']
	] as const) {
		await expect
			.poll(() =>
				tab.evaluate(
					async (base) =>
						(await indexedDB.databases()).some((db) => db.name === `chronos:${base}:db`),
					base
				)
			)
			.toBe(true);
		await expect(tab.getByRole('button', { name: /清除所有数据 当前占用/ })).toBeVisible();
	}
	await pluginValue(page, '/Chronos', 'first');
	await expect.poll(() => pluginValue(other, '/Other')).toBeNull();
	await pluginValue(other, '/Other', 'second');
	await expect.poll(() => pluginValue(page, '/Chronos')).toBe('"first"');
	await page.evaluate(() => {
		localStorage.setItem('chronos:/Chronos:chronos_preferences:theme_mode', 'dark');
		localStorage.setItem('chronos:/Other:chronos_preferences:theme_mode', 'light');
		sessionStorage.setItem('chronos:/Chronos:chronos:private', 'first');
		sessionStorage.setItem('chronos:/Other:chronos:private', 'second');
	});
	await page.reload();
	await other.reload();
	await expect(page.locator('html')).toHaveClass(/dark/);
	await expect(other.locator('html')).not.toHaveClass(/dark/);
	await other.evaluate(async () => {
		const cache = await caches.open('chronos:/Other:legal');
		await cache.put('/Other/isolation', new Response('other cache'));
		(window as Window & { isolationReloads?: number }).isolationReloads = 0;
	});
	await page.getByRole('button', { name: /清除所有数据 当前占用/ }).click();
	await page.getByRole('dialog').getByRole('button', { name: '清除', exact: true }).click();
	await expect.poll(() => pluginValue(page, '/Chronos')).toBeNull();
	expect(await pluginValue(other, '/Other')).toBe('"second"');
	expect(
		await other.evaluate(() =>
			localStorage.getItem('chronos:/Other:chronos_preferences:theme_mode')
		)
	).toBe('light');
	expect(
		await page.evaluate(() => sessionStorage.getItem('chronos:/Chronos:chronos:private'))
	).toBeNull();
	expect(await page.evaluate(() => sessionStorage.getItem('chronos:/Other:chronos:private'))).toBe(
		'second'
	);
	expect(
		await other.evaluate(async () =>
			(await (await caches.open('chronos:/Other:legal')).match('/Other/isolation'))?.text()
		)
	).toBe('other cache');
	expect(
		await other.evaluate(() => (window as Window & { isolationReloads?: number }).isolationReloads)
	).toBe(0);
});
