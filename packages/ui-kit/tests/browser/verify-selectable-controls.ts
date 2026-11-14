/** Run with vpx packages/ui-kit/tests/browser/verify-selectable-controls.ts. */
import { mkdtemp, writeFile, rm, symlink } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { createServer } from 'vite-plus';
import { svelte } from '@sveltejs/vite-plugin-svelte';
import { chromium, webkit, expect, type Browser } from '@playwright/test';

declare global {
	interface Window {
		__chronosSelectableQa: {
			commit(success: boolean): Promise<void>;
			setDisabled(disabled: boolean): Promise<void>;
			hideSelection(): Promise<void>;
			setTab(value: string): Promise<void>;
			finishLogin(success: boolean): void;
		};
	}
}

const repository = fileURLToPath(new URL('../../../../', import.meta.url));
const fixture = fileURLToPath(new URL('./SelectableControlsHost.svelte', import.meta.url));
const directory = await mkdtemp(join(tmpdir(), 'chronos-selectable-controls-'));
await symlink(join(repository, 'node_modules'), join(directory, 'node_modules'), 'dir');
await writeFile(
	join(directory, 'index.html'),
	`<style>.sr-only{position:absolute;width:1px;height:1px;padding:0;margin:-1px;overflow:hidden;clip:rect(0,0,0,0);white-space:nowrap;border-width:0}</style>
<div id="app"></div><script type="module" src="/main.js"></script>`
);
await writeFile(
	join(directory, 'main.js'),
	`import { mount } from 'svelte';
import Host from ${JSON.stringify(`/@fs${fixture}`)};
mount(Host, { target: document.querySelector('#app') });`
);
const server = await createServer({
	configFile: false,
	root: directory,
	logLevel: 'silent',
	plugins: [svelte({ configFile: false, compilerOptions: { runes: true } })],
	resolve: {
		alias: [
			{ find: '@chronos/core', replacement: join(repository, 'packages/core/src/index.ts') },
			{ find: '@chronos/ui-kit', replacement: join(repository, 'packages/ui-kit/src/index.ts') }
		],
		dedupe: ['svelte']
	},
	server: { host: '127.0.0.1', port: 0, fs: { allow: [directory, repository] } },
	optimizeDeps: { noDiscovery: true }
});
let browser: Browser | undefined;
try {
	await server.listen();
	for (const engine of [chromium, webkit]) {
		browser = await engine.launch({ headless: true });
		const page = await browser.newPage();
		const errors: string[] = [];
		page.on('pageerror', (error) => errors.push(error.message));
		await page.goto(server.resolvedUrls!.local[0]!);
		const tabs = page.getByRole('tablist', { name: 'Views', exact: true }).getByRole('tab');
		await tabs.nth(0).focus();
		await page.keyboard.press('ArrowRight');
		await expect(tabs.nth(1)).toBeFocused();
		await page.keyboard.press('ArrowRight');
		await expect(tabs.nth(2)).toBeFocused();
		await expect(page.getByTestId('tab-value')).toHaveText('third');
		await page.keyboard.press('ArrowRight');
		await expect(tabs.nth(0)).toBeFocused();
		await page.keyboard.press('End');
		await expect(tabs.nth(2)).toBeFocused();
		await page.keyboard.press('Home');
		await expect(tabs.nth(0)).toBeFocused();
		await page.evaluate(() => window.__chronosSelectableQa.setTab('second'));
		await page.getByRole('button', { name: 'Before', exact: true }).focus();
		await page.keyboard.press('Tab');
		await expect(tabs.nth(1)).toBeFocused();
		await page.keyboard.press('Tab');
		await expect(page.getByRole('textbox', { name: 'After', exact: true })).toBeFocused();
		const scrolling = page.getByRole('tablist', { name: 'Scrollable views', exact: true });
		await scrolling.getByRole('tab', { name: 'First', exact: true }).focus();
		for (const name of ['Second', 'Third', 'Fourth']) {
			await page.keyboard.press('ArrowRight');
			await expect(scrolling.getByRole('tab', { name, exact: true })).toBeFocused();
			await expect(scrolling.getByRole('tab', { name, exact: true })).toHaveAttribute(
				'aria-selected',
				'true'
			);
		}

		const scope = page.getByRole('radiogroup', { name: 'Scope', exact: true });
		await scope.getByRole('radio', { name: 'First', exact: true }).focus();
		await page.keyboard.press('ArrowRight');
		await expect(scope.getByRole('radio', { name: 'Second', exact: true })).toBeFocused();
		await expect(scope.getByRole('radio', { name: 'Second', exact: true })).toBeChecked();
		await page.keyboard.press('ArrowDown');
		await expect(scope.getByRole('radio', { name: 'Third', exact: true })).toBeChecked();
		await page.keyboard.press('ArrowUp');
		await expect(scope.getByRole('radio', { name: 'Second', exact: true })).toBeChecked();

		const deferred = page.getByRole('group', { name: 'Deferred selection', exact: true });
		const first = deferred.getByRole('radio', { name: 'First', exact: true });
		const second = deferred.getByRole('radio', { name: 'Second', exact: true });
		await expect(first).toHaveAccessibleDescription('First description');
		await deferred
			.locator('label')
			.filter({ has: page.getByRole('radio', { name: 'Second', exact: true }) })
			.click();
		await expect(page.getByTestId('selection-calls')).toHaveText('1');
		await expect(first).toBeChecked();
		await expect(second).not.toBeChecked();
		await page.evaluate(() => window.__chronosSelectableQa.commit(false));
		await expect(first).toBeChecked();
		await expect(page.getByTestId('selection-value')).toHaveText('first');
		await deferred
			.locator('label')
			.filter({ has: page.getByRole('radio', { name: 'Second', exact: true }) })
			.click();
		await expect(page.getByTestId('selection-calls')).toHaveText('2');
		await page.evaluate(() => window.__chronosSelectableQa.commit(true));
		await expect(second).toBeChecked();
		await expect(first).not.toBeChecked();
		await second.focus();
		await page.keyboard.press('ArrowRight');
		await expect(deferred.getByRole('radio', { name: 'Third', exact: true })).toBeFocused();
		await expect(page.getByTestId('selection-calls')).toHaveText('3');
		await expect(second).toBeChecked();
		await page.evaluate(() => window.__chronosSelectableQa.commit(false));
		await expect(second).toBeChecked();
		const callsBeforeDisable = await page.getByTestId('selection-calls').textContent();
		await first.evaluate((input) => {
			(input as HTMLInputElement).click();
			return window.__chronosSelectableQa.setDisabled(true);
		});
		await page.evaluate(() => new Promise<void>((resolve) => setTimeout(resolve, 0)));
		await expect(page.getByTestId('selection-calls')).toHaveText(callsBeforeDisable!);
		await expect(first).toBeDisabled();
		const previousCalls = await page.getByTestId('selection-calls').textContent();
		await deferred.getByText('First', { exact: true }).click({ force: true });
		await expect(page.getByTestId('selection-calls')).toHaveText(previousCalls!);
		await page.evaluate(() => window.__chronosSelectableQa.setDisabled(false));
		await first.evaluate((input) => {
			(input as HTMLInputElement).click();
			return window.__chronosSelectableQa.hideSelection();
		});
		await page.evaluate(() => new Promise<void>((resolve) => setTimeout(resolve, 0)));
		await expect(page.getByTestId('selection-calls')).toHaveText(previousCalls!);

		const groupOne = page.getByRole('group', { name: 'Group one', exact: true });
		const groupTwo = page.getByRole('group', { name: 'Group two', exact: true });
		await groupOne
			.locator('label')
			.filter({ has: page.getByRole('radio', { name: 'Second', exact: true }) })
			.click();
		await expect(groupOne.getByRole('radio', { name: 'Second', exact: true })).toBeChecked();
		await expect(groupTwo.getByRole('radio', { name: 'First', exact: true })).toBeChecked();

		const login = page.getByRole('region', { name: 'CQUT login', exact: true });
		const username = login.locator('input[name=username]');
		const password = login.locator('input[name=password]');
		await username.fill('2026000001');
		await password.fill('fixture-password');
		await login.getByRole('button', { name: '显示密码', exact: true }).click();
		await expect(password).toHaveAttribute('type', 'text');
		await expect(page.getByTestId('login-calls')).toHaveText('0');
		await password.focus();
		await page.keyboard.press('Enter');
		await expect(page.getByTestId('login-calls')).toHaveText('1');
		await page.keyboard.press('Enter');
		await expect(page.getByTestId('login-calls')).toHaveText('1');
		await page.evaluate(() => window.__chronosSelectableQa.finishLogin(true));
		await expect(page.getByTestId('login-continued')).toHaveText('1');
		await page.evaluate(() => window.dispatchEvent(new Event('offline')));
		await password.focus();
		await page.keyboard.press('Enter');
		await expect(page.getByTestId('login-calls')).toHaveText('1');
		await page.evaluate(() => window.dispatchEvent(new Event('online')));
		await username.fill('');
		await password.press('Enter');
		await expect(page.getByTestId('login-calls')).toHaveText('1');
		expect(errors).toEqual([]);
		console.log(`${engine.name()} selectable controls and CQUT form browser checks passed.`);
		await browser.close();
		browser = undefined;
	}
} finally {
	await browser?.close();
	await server.close();
	await rm(directory, { recursive: true, force: true });
}
