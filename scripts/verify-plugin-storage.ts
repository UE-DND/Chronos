/** Real IndexedDB transactions and BroadcastChannel; vpx scripts/verify-plugin-storage.ts. */
import { mkdtemp, writeFile, rm, symlink } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { createServer } from 'vite-plus';
import { chromium, expect } from '@playwright/test';
import { HOLIDAY_PLUGIN_ID } from '../packages/plugins/calendar-holidays/src/constants';
import type { createStorageFixture } from './fixtures/plugin-storage-browser';

declare global {
	interface Window {
		storageQa: Awaited<ReturnType<typeof createStorageFixture>>;
	}
}
const repository = fileURLToPath(new URL('../', import.meta.url));
const directory = await mkdtemp(join(tmpdir(), 'chronos-storage-'));
await symlink(join(repository, 'node_modules'), join(directory, 'node_modules'), 'dir');
await writeFile(join(directory, 'index.html'), '<script type="module" src="/main.js"></script>');
await writeFile(
	join(directory, 'main.js'),
	`import { createStorageFixture } from ${JSON.stringify(`/@fs${join(repository, 'scripts/fixtures/plugin-storage-browser.ts')}`)}; window.storageQa = await createStorageFixture();`
);
const server = await createServer({
	configFile: false,
	root: directory,
	logLevel: 'error',
	resolve: {
		alias: [
			{ find: '@chronos/core', replacement: join(repository, 'packages/core/src/index.ts') },
			{ find: '#lib', replacement: join(repository, 'apps/web/src/lib') },
			{ find: '$app/paths', replacement: join(repository, 'apps/web/src/test-mocks/app-paths.ts') }
		]
	},
	server: { host: '127.0.0.1', port: 0, fs: { allow: [repository, directory] } }
});
await server.listen();
const browser = await chromium.launch({ headless: true });
try {
	const context = await browser.newContext();
	const first = await context.newPage();
	const second = await context.newPage();
	const errors: string[] = [];
	for (const page of [first, second]) {
		page.on('pageerror', (error) => errors.push(error.message));
		await page.goto(server.resolvedUrls!.local[0]!);
		await page.waitForFunction(() => Boolean(window.storageQa));
	}
	const old = first.evaluate(() => window.storageQa.sync('one'));
	await expect.poll(() => first.evaluate(() => window.storageQa.requests().length)).toBe(1);
	const newer = second.evaluate(() => window.storageQa.sync('one'));
	await expect.poll(() => second.evaluate(() => window.storageQa.requests().length)).toBe(1);
	await second.evaluate(() => window.storageQa.respond(0, 'newer'));
	expect(await newer).toBe('success');
	await expect.poll(() => first.evaluate(() => window.storageQa.requests()[0]?.aborted)).toBe(true);
	await first.evaluate(() => window.storageQa.respond(0, 'stale'));
	expect(await old).toBe('AbortError');
	await expect
		.poll(() => first.evaluate(() => window.storageQa.holidays('one')))
		.toEqual([{ date: '2026-03-02', label: 'newer' }]);
	const one = first.evaluate(() => window.storageQa.sync('one'));
	const two = second.evaluate(() => window.storageQa.sync('two'));
	await expect.poll(() => first.evaluate(() => window.storageQa.requests().length)).toBe(2);
	await expect.poll(() => second.evaluate(() => window.storageQa.requests().length)).toBe(2);
	await second.evaluate(() => window.storageQa.respond(1, 'two'));
	await first.evaluate(() => window.storageQa.respond(1, 'one'));
	expect(await Promise.all([one, two])).toEqual(['success', 'success']);
	await expect
		.poll(() => first.evaluate(() => window.storageQa.holidays('two')))
		.toEqual([{ date: '2026-03-02', label: 'two' }]);
	const cache = await first.evaluate(() => window.storageQa.cache());
	await first.evaluate(() => window.storageQa.upgrade());
	expect(await second.evaluate(() => window.storageQa.oldWrite())).toBe('rejected');
	expect(await first.evaluate(() => window.storageQa.cache())).toEqual(cache);
	await first.evaluate(() => window.storageQa.upgrade(true));
	expect(await first.evaluate(() => window.storageQa.holidays('one'))).toEqual([
		{ date: '2026-03-02', label: 'one' }
	]);
	await first.evaluate(() => window.storageQa.writeBinary());
	expect(await first.evaluate(() => window.storageQa.uninstall(true))).toBe('restored');
	expect(await first.evaluate(() => window.storageQa.data())).toEqual({
		installed: true,
		resources: 1,
		binary: 1,
		late: null
	});
	expect(await first.evaluate(() => window.storageQa.cache())).toEqual(cache);
	await first.reload();
	await first.waitForFunction(() => Boolean(window.storageQa));
	expect(await first.evaluate(() => window.storageQa.requests())).toEqual([]);
	expect(await first.evaluate(() => window.storageQa.holidays('one'))).toEqual([
		{ date: '2026-03-02', label: 'one' }
	]);
	const hanging = first.evaluate(() => window.storageQa.sync('one'));
	await expect.poll(() => first.evaluate(() => window.storageQa.requests().length)).toBe(1);
	expect(await first.evaluate(() => window.storageQa.uninstall())).toBe('removed');
	expect(await first.evaluate(() => window.storageQa.data())).toEqual({
		installed: false,
		resources: 0,
		binary: 0,
		late: null
	});
	expect(await first.evaluate(() => window.storageQa.cache())).toBeNull();
	const removed = await second.evaluate(() => window.storageQa.removalState());
	expect(removed.removed).toEqual([HOLIDAY_PLUGIN_ID]);
	expect(removed.removalRevisions?.[HOLIDAY_PLUGIN_ID]).toBeGreaterThan(0);
	await first.evaluate(() => window.storageQa.reinstall());
	const reinstalled = await second.evaluate(() => window.storageQa.removalState());
	expect(reinstalled.removed).toEqual([]);
	expect(reinstalled.removalRevisions?.[HOLIDAY_PLUGIN_ID]).toBeUndefined();
	const fresh = first.evaluate(() => window.storageQa.sync('one'));
	await expect.poll(() => first.evaluate(() => window.storageQa.requests().length)).toBe(2);
	await first.evaluate(() => window.storageQa.respond(1, 'reinstalled'));
	expect(await fresh).toBe('success');
	await first.evaluate(() => window.storageQa.respond(0, 'uninstalled request'));
	expect(await hanging).toBe('AbortError');
	expect(await first.evaluate(() => window.storageQa.holidays('one'))).toEqual([
		{ date: '2026-03-02', label: 'reinstalled' }
	]);
	expect(await first.evaluate(() => window.storageQa.uninstall())).toBe('removed');
	const removedAgain = await second.evaluate(() => window.storageQa.removalState());
	expect(removedAgain.removalRevisions?.[HOLIDAY_PLUGIN_ID]).toBeGreaterThan(
		removed.removalRevisions![HOLIDAY_PLUGIN_ID]!
	);
	await first.evaluate(() => window.storageQa.reset());
	const reset = await second.evaluate(() => window.storageQa.removalState());
	expect(reset.removed).toEqual([]);
	expect(reset.removalRevisions).toBeUndefined();
	for (const page of [first, second]) await page.evaluate(() => window.storageQa.close());
	expect(errors).toEqual([]);
	console.log(
		'IndexedDB scope revisions, atomic rollback/deletion, concurrent windows, reload, stale requests and reset: passed'
	);
} finally {
	await browser.close();
	await server.close();
	await rm(directory, { recursive: true, force: true });
}
