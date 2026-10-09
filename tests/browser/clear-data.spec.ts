import { test, expect, type Page } from '@playwright/test';
import type { PluginInstallationState } from '../../apps/web/src/lib/services/official-plugins/installed-store';

const installationId = 'core.official-plugins:installed_plugins';
const tableNames = [
	'timetables',
	'courses',
	'pluginData',
	'pluginBinary',
	'images',
	'pluginResources'
];

async function snapshot(page: Page) {
	return page.evaluate(
		async ({ tableNames, installationId }) => {
			if (
				!(await indexedDB.databases()).some((database) => database.name === 'chronos:/Chronos:db')
			) {
				return { rows: tableNames.map(() => [] as string[]), state: null };
			}
			const database = await new Promise<IDBDatabase>((resolve, reject) => {
				const request = indexedDB.open('chronos:/Chronos:db');
				request.onsuccess = () => resolve(request.result);
				request.onerror = () => reject(request.error);
			});
			try {
				if (!database.objectStoreNames.contains('pluginData'))
					return { rows: tableNames.map(() => [] as string[]), state: null };
				const rows = await Promise.all(
					tableNames.map(
						(name) =>
							new Promise<{ id: string; valueJson?: string }[]>((resolve, reject) => {
								const request = database.transaction(name).objectStore(name).getAll();
								request.onsuccess = () => resolve(request.result);
								request.onerror = () => reject(request.error);
							})
					)
				);
				const installation = rows[2]!.find((row) => row.id === installationId);
				return {
					rows: rows.map((rows) => rows.map((row) => row.id)),
					state: installation
						? (JSON.parse(installation.valueJson!) as PluginInstallationState)
						: null
				};
			} finally {
				database.close();
			}
		},
		{ tableNames, installationId }
	);
}

async function seedUserData(page: Page) {
	await page.evaluate(async () => {
		const database = await new Promise<IDBDatabase>((resolve, reject) => {
			const request = indexedDB.open('chronos:/Chronos:db');
			request.onsuccess = () => resolve(request.result);
			request.onerror = () => reject(request.error);
		});
		try {
			await new Promise<void>((resolve, reject) => {
				const tx = database.transaction(
					['timetables', 'courses', 'pluginData', 'pluginBinary', 'images'],
					'readwrite'
				);
				tx.objectStore('timetables').put({
					id: 'user-timetable',
					name: '用户课表',
					configJson: '{}',
					createdAt: 1,
					updatedAt: 1
				});
				tx.objectStore('courses').put({
					id: 'user-course',
					timetableId: 'user-timetable',
					name: '课程',
					dayOfWeek: 1,
					startPeriod: 1,
					endPeriod: 2,
					weeksCsv: '1',
					teacher: '',
					location: '',
					remark: ''
				});
				tx.objectStore('pluginData').put({
					id: 'theme-m3:private',
					pluginId: 'theme-m3',
					key: 'private',
					valueJson: JSON.stringify({ password: 'secret' }),
					updatedAt: 1
				});
				tx.objectStore('pluginBinary').put({
					id: 'theme-m3:binary',
					pluginId: 'theme-m3',
					key: 'binary',
					bytes: new Uint8Array([1]).buffer,
					mimeType: 'application/octet-stream',
					updatedAt: 1
				});
				tx.objectStore('images').put({ id: 'custom-wallpaper', blob: new Blob(['private']) });
				tx.oncomplete = () => resolve();
				tx.onabort = () => reject(tx.error);
			});
		} finally {
			database.close();
		}
		localStorage.setItem('chronos:/Chronos:chronos:private', 'secret');
		localStorage.setItem('third-party', 'keep');
	});
}

async function confirmClear(page: Page) {
	await page.getByRole('button', { name: /清除所有数据 当前占用/ }).click();
	await page.getByRole('dialog').getByRole('button', { name: '清除', exact: true }).click();
}

test.beforeEach(async ({ page, request, context }) => {
	await request.post('/__e2e/deploy?build=old');
	await page.addInitScript(() => {
		localStorage.setItem('chronos:/Chronos:chronos:onboarding-seen', '1');
		const clear = Object.getOwnPropertyDescriptor(IDBObjectStore.prototype, 'clear')!
			.value as IDBObjectStore['clear'];
		IDBObjectStore.prototype.clear = function () {
			if (this.name === 'courses' && sessionStorage.getItem('e2e:fail-clear')) {
				throw new Error('Injected transaction failure');
			}
			return clear.call(this);
		};
	});
	await context.route('https://ue-dnd.github.io/Chronos/plugins/releases/**', async (route) => {
		const url = new URL(route.request().url());
		const path = url.pathname.replace('/Chronos/plugins/releases/', '/__e2e/market/');
		const response = await route.fetch({ url: `http://127.0.0.1:4179${path}${url.search}` });
		await route.fulfill({ response });
	});
	await page.goto('/Chronos/about');
	await expect
		.poll(async () =>
			(await snapshot(page)).state?.records.some((r) => r.manifest.id === 'codec-share')
		)
		.toBe(true);
	await page.evaluate(() => navigator.serviceWorker.ready.then(() => undefined));
	await seedUserData(page);
});

test('clears real IndexedDB offline without reinstalling preinstalls and reloads other windows', async ({
	page,
	context
}) => {
	await page.goto('/Chronos/plugins');
	await page.getByRole('tab', { name: '插件市场', exact: true }).click();
	await page
		.locator('div.flex.items-center.justify-between')
		.filter({ has: page.getByText('自定义时间', { exact: true }) })
		.last()
		.getByRole('button', { name: '安装', exact: true })
		.click();
	await expect
		.poll(async () =>
			(await snapshot(page)).state?.records.some((r) => r.manifest.id === 'tool-clock')
		)
		.toBe(true);
	await page.goto('/Chronos/about');
	const before = (await snapshot(page)).state!;
	const other = await context.newPage();
	await other.goto('/Chronos/about');
	await expect(other.getByText('存储占用情况', { exact: true })).toBeVisible();
	await expect
		.poll(async () => (await snapshot(other)).state?.records.length)
		.toBe(before.records.length);
	let reloads = 0;
	other.on('framenavigated', (frame) => {
		if (frame === other.mainFrame()) reloads++;
	});
	const resourceRequests: string[] = [];
	page.on('request', (request) => {
		if (/official-plugins|plugins\/releases/.test(request.url()))
			resourceRequests.push(request.url());
	});
	await context.setOffline(true);
	await confirmClear(page);
	await expect(page.getByText('已清除所有数据', { exact: true })).toBeVisible();
	const after = await snapshot(page);
	expect(after.state!.records.map((r) => [r.manifest.id, r.resourceId, r.installedAt])).toEqual(
		before.records
			.filter((r) => r.origin.kind === 'profile')
			.map((r) => [r.manifest.id, r.resourceId, r.installedAt])
	);
	expect(after.rows[0]).toEqual([]);
	expect(after.rows[1]).toEqual([]);
	expect(after.rows[2]).toEqual([installationId]);
	expect(after.rows[3]).toEqual([]);
	expect(after.rows[4]).not.toContain('custom-wallpaper');
	expect(after.rows[5].sort()).toEqual(
		after.state!.records.map((record) => record.resourceId!).sort()
	);
	expect(after.state!.records.every((record) => !Object.hasOwn(record, 'code'))).toBe(true);
	expect(after.state!.generation).toBe(before.generation);
	expect(after.state!.revision).toBeGreaterThan(before.revision);
	expect(resourceRequests).toEqual([]);
	expect(
		await page.evaluate(() => localStorage.getItem('chronos:/Chronos:chronos:private'))
	).toBeNull();
	expect(await page.evaluate(() => localStorage.getItem('third-party'))).toBe('keep');
	await expect.poll(() => reloads).toBeGreaterThan(0);
	await expect(page.getByText(/当前占用/)).not.toHaveText('当前占用 0 B');
});

test('rolls back all IndexedDB changes when a deletion fails, then allows retry', async ({
	page
}) => {
	await page.goto('/Chronos/plugins');
	await page.getByRole('tab', { name: '插件市场', exact: true }).click();
	await page
		.locator('div.flex.items-center.justify-between')
		.filter({ has: page.getByText('自定义时间', { exact: true }) })
		.last()
		.getByRole('button', { name: '安装', exact: true })
		.click();
	await expect
		.poll(async () =>
			(await snapshot(page)).state?.records.some((r) => r.manifest.id === 'tool-clock')
		)
		.toBe(true);
	await page.goto('/Chronos/about');
	const before = await snapshot(page);
	await page.evaluate(() => sessionStorage.setItem('e2e:fail-clear', '1'));
	await confirmClear(page);
	await expect(page.getByText('清除失败，请重试', { exact: true })).toBeVisible();
	expect(await snapshot(page)).toEqual(before);
	expect(await page.evaluate(() => localStorage.getItem('chronos:/Chronos:chronos:private'))).toBe(
		'secret'
	);
	await page.evaluate(() => sessionStorage.removeItem('e2e:fail-clear'));
	await page.getByRole('dialog').getByRole('button', { name: '清除', exact: true }).click();
	await expect(page.getByText('已清除所有数据', { exact: true })).toBeVisible();
	expect((await snapshot(page)).rows[2]).toEqual([installationId]);
});
