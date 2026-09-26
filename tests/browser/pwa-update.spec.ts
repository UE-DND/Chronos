import { readFileSync } from 'node:fs';
import { test, expect, type Page } from '@playwright/test';
import type { Timetable } from '../../packages/core/src/domain/timetable';
const timetable: Timetable = JSON.parse(
	readFileSync(
		new URL('../../packages/core/tests/fixtures/timetable.json', import.meta.url),
		'utf8'
	)
);

const payload = readFileSync(new URL('../../dist/e2e/scenario.payload', import.meta.url), 'utf8');
const oldFeed = JSON.parse(
	readFileSync(new URL('../../dist/e2e/old/version.json', import.meta.url), 'utf8')
);
const newFeed = JSON.parse(
	readFileSync(new URL('../../dist/e2e/new/version.json', import.meta.url), 'utf8')
);

async function workerBuild(page: Page) {
	try {
		return await page.evaluate(async () => {
			const worker = navigator.serviceWorker.controller;
			if (!worker) return null;
			return new Promise<string>((resolve) => {
				const channel = new MessageChannel();
				channel.port1.onmessage = (event) => {
					channel.port1.close();
					resolve(event.data.buildId);
				};
				worker.postMessage({ type: 'CHRONOS_HOST_IDENTITY' }, [channel.port2]);
			});
		});
	} catch (error) {
		if (error instanceof Error && /Execution context was destroyed/.test(error.message))
			return null;
		throw error;
	}
}
async function stored(page: Page) {
	return page.evaluate(async () => {
		const database = await new Promise<IDBDatabase>((resolve, reject) => {
			const request = indexedDB.open('chronos');
			request.onsuccess = () => resolve(request.result);
			request.onerror = () => reject(request.error);
		});
		const read = (table: string) =>
			new Promise<unknown[]>((resolve, reject) => {
				const request = database.transaction(table).objectStore(table).getAll();
				request.onsuccess = () => resolve(request.result);
				request.onerror = () => reject(request.error);
			});
		const [tables, courses, pluginData] = await Promise.all([
			read('timetables'),
			read('courses'),
			read('pluginData')
		]);
		database.close();
		const row = (pluginData as { id: string; valueJson: string }[]).find(
			(row) => row.id === 'core.official-plugins:installed_plugins'
		);
		return { tables, courses, installation: row ? JSON.parse(row.valueJson) : null };
	});
}

async function importScenario(page: Page) {
	await page.goto('/Chronos/');
	await page.getByRole('button', { name: '跳过', exact: true }).click();
	await page.goto(`/Chronos/s#${payload}`);
	await expect(page.getByRole('heading', { name: timetable.name })).toBeVisible();
	await page.getByRole('button', { name: '导入为新课程表', exact: true }).click();
	await expect.poll(async () => (await stored(page)).courses.length).toBe(timetable.courses.length);
	await expect.poll(() => workerBuild(page)).toBe(oldFeed.host.buildId);
}

test.beforeAll(() => {
	expect(newFeed.host.version).toBe(oldFeed.host.version);
	expect(newFeed.host.buildId).not.toBe(oldFeed.host.buildId);
});

test.beforeEach(async ({ context, request }) => {
	await request.post('/__e2e/deploy?build=old');
	// Only the upstream transport is replaced. Catalog, manifests, hashes and ESM are actual build output.
	await context.route('https://ue-dnd.github.io/Chronos/plugins/releases/**', async (route) => {
		const path = new URL(route.request().url()).pathname.replace(
			'/Chronos/plugins/releases/',
			'/__e2e/market/'
		);
		const result = await route.fetch({
			url: `http://127.0.0.1:4179${path}${new URL(route.request().url()).search}`
		});
		await route.fulfill({ response: result });
	});
});

test('rejects an unauthorized worker and keeps the current timetable', async ({
	page,
	request
}) => {
	await importScenario(page);
	await request.post('/__e2e/deploy?build=new');
	const result = await page.evaluate(async () => {
		const registration = (await navigator.serviceWorker.getRegistration())!;
		const terminal = new Promise<string>((resolve) =>
			registration.addEventListener(
				'updatefound',
				() => {
					const worker = registration.installing!;
					worker.addEventListener('statechange', () => {
						if (['installed', 'redundant'].includes(worker.state)) resolve(worker.state);
					});
				},
				{ once: true }
			)
		);
		await registration.update();
		return terminal;
	});
	expect(result).toBe('redundant');
	expect(await workerBuild(page)).toBe(oldFeed.host.buildId);
	expect((await stored(page)).courses).toHaveLength(timetable.courses.length);
	expect(
		await page.evaluate(async () =>
			Boolean((await navigator.serviceWorker.getRegistration())?.waiting)
		)
	).toBe(false);
});

test('retries preparation, updates every window and preserves disabled plugins offline', async ({
	page,
	context,
	request
}) => {
	await importScenario(page);
	await page.goto('/Chronos/plugins');
	await page.getByRole('tab', { name: '插件市场', exact: true }).click();
	const clockRow = page
		.locator('div.flex.items-center.justify-between')
		.filter({ has: page.getByText('自定义时间', { exact: true }) })
		.last();
	await clockRow.getByRole('button', { name: '安装', exact: true }).click();
	await expect
		.poll(async () =>
			(await stored(page)).installation?.records.some(
				(record: { manifest: { id: string } }) => record.manifest.id === 'tool-clock'
			)
		)
		.toBe(true);
	await page.getByRole('tab', { name: /^已安装/ }).click();
	await page.getByRole('switch').click();
	await expect
		.poll(
			async () =>
				(await stored(page)).installation?.records.find(
					(record: { manifest: { id: string } }) => record.manifest.id === 'tool-clock'
				)?.enabled
		)
		.toBe(false);
	const other = await context.newPage();
	await other.goto('/Chronos/');
	await expect.poll(() => workerBuild(other)).toBe(oldFeed.host.buildId);
	await page.bringToFront();
	await request.post('/__e2e/deploy?build=new');
	await request.post('/__e2e/market-failure?enabled=true');
	await page.goto('/Chronos/about/update');
	await page.getByRole('button', { name: '立即安装更新', exact: true }).click();
	await expect(page.getByText('安装更新失败，请重试', { exact: true })).toBeVisible();
	expect(await workerBuild(page)).toBe(oldFeed.host.buildId);
	const before = await stored(page);
	expect(before.installation.prepared).toBeUndefined();
	expect(before.courses).toHaveLength(timetable.courses.length);
	await request.post('/__e2e/market-failure?enabled=false');
	await page.getByRole('button', { name: /立即安装更新|重试/, exact: true }).click();
	await expect.poll(() => workerBuild(page)).toBe(newFeed.host.buildId);
	await other.bringToFront();
	await expect.poll(() => workerBuild(other)).toBe(newFeed.host.buildId);
	await expect
		.poll(async () => (await stored(page)).installation?.generation)
		.toBe(newFeed.host.buildId);
	const after = await stored(page);
	expect(after.installation.prepared).toBeUndefined();
	expect(
		after.installation.records.find(
			(record: { manifest: { id: string } }) => record.manifest.id === 'tool-clock'
		)?.enabled
	).toBe(false);
	expect(after.courses).toEqual(before.courses);
	expect(after.tables).toEqual(before.tables);
	await context.setOffline(true);
	await page.goto('/Chronos/');
	await expect.poll(() => workerBuild(page)).toBe(newFeed.host.buildId);
	await expect(page.getByRole('button', { name: /^课程设计，/ }).first()).toBeVisible();
	const offline = await stored(page);
	expect(offline.courses).toEqual(before.courses);
	expect(offline.tables).toEqual(before.tables);
});
