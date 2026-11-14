/** Run with vpx apps/web/tests/browser/verify-markdown.ts (Chromium and WebKit). */
import { mkdtemp, readFile, readdir, rm, symlink, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { createServer } from 'vite-plus';
import { svelte } from '@sveltejs/vite-plugin-svelte';
import { chromium, webkit, expect } from '@playwright/test';

declare global {
	interface Window {
		__markdownQa: {
			render(markdown: string): Promise<void>;
			show(markdown: string): void;
			finish(markdown: string): Promise<void>;
			pending(markdown: string): boolean;
			unmount(): Promise<void>;
		};
		__markdownExecuted?: boolean;
	}
}

const repository = fileURLToPath(new URL('../../../../', import.meta.url));
const directory = await mkdtemp(join(tmpdir(), 'chronos-markdown-'));
const sourceUrl = (path: string) => `/@fs${path.replaceAll('\\', '/')}`;
const lib = join(repository, 'apps/web/src/lib');
await symlink(join(repository, 'node_modules'), join(directory, 'node_modules'), 'dir');
await writeFile(
	join(directory, 'index.html'),
	'<div id="output"></div><div id="component"></div><script type="module" src="/main.js"></script>'
);
await writeFile(join(directory, 'i18n.ts'), 'export const hostT = (key: string) => key;');
await writeFile(
	join(directory, 'controlled-parser.js'),
	`
import { parseMarkdown as realParse } from ${JSON.stringify(sourceUrl(join(lib, 'content/markdown.ts')))};
const jobs = new Map();
let failedOnce = false;
export function parseMarkdown(markdown) {
  if (markdown.startsWith('hold:')) return new Promise((resolve) => jobs.set(markdown, resolve));
  if (markdown === 'retry' && !failedOnce) {
    failedOnce = true;
    return Promise.reject(new Error('Simulated dependency failure'));
  }
  return realParse(markdown);
}
export const pending = (markdown) => jobs.has(markdown);
export async function finish(markdown) {
  const fragment = await realParse(markdown);
  jobs.get(markdown)(fragment);
  jobs.delete(markdown);
}
`
);
await writeFile(
	join(directory, 'Harness.svelte'),
	`<script>
import MarkdownContent from ${JSON.stringify(sourceUrl(join(lib, 'content/MarkdownContent.svelte')))};
let markdown = $state('Ready');
export function show(value) { markdown = value; }
</script>
<MarkdownContent {markdown} class="document" />`
);
await writeFile(
	join(directory, 'main.js'),
	`
import { parseMarkdown } from ${JSON.stringify(sourceUrl(join(lib, 'content/markdown.ts')))};
import { finish, pending } from './controlled-parser.js';
import Harness from './Harness.svelte';
import { mount, unmount } from 'svelte';
const component = mount(Harness, { target: document.querySelector('#component') });
window.__markdownQa = {
  async render(markdown) {
    const fragment = await parseMarkdown(markdown);
    if (!(fragment instanceof DocumentFragment)) throw new Error('Expected sanitized DOM nodes');
    document.querySelector('#output').replaceChildren(fragment);
  },
  show: (markdown) => component.show(markdown),
  finish, pending,
  unmount: () => unmount(component)
};
`
);
const server = await createServer({
	configFile: false,
	root: directory,
	logLevel: 'silent',
	plugins: [
		svelte({
			configFile: false,
			compilerOptions: {
				runes: ({ filename }) =>
					filename.split(/[/\\]/).includes('node_modules') ? undefined : true
			}
		})
	],
	resolve: {
		alias: [
			{ find: '#lib/i18n/host-i18n.svelte.ts', replacement: join(directory, 'i18n.ts') },
			{
				find: '#lib/content/markdown.ts',
				replacement: join(directory, 'controlled-parser.js')
			},
			{ find: '#lib', replacement: lib }
		],
		dedupe: ['svelte']
	},
	server: { host: '127.0.0.1', port: 0, fs: { allow: [directory, repository] } },
	optimizeDeps: { noDiscovery: true }
});

try {
	await server.listen();
	for (const [name, browserType] of Object.entries({ chromium, webkit })) {
		const browser = await browserType.launch({ headless: true });
		try {
			const page = await browser.newPage();
			const unhandledErrors: string[] = [];
			page.on('pageerror', (error) => unhandledErrors.push(error.message));
			await page.goto(server.resolvedUrls!.local[0]!);
			await expect(page.locator('#component .document')).toHaveText('Ready');
			const render = (markdown: string) =>
				page.evaluate((value) => window.__markdownQa.render(value), markdown);
			await render(
				'<math><mtext><table><mglyph><style><!--</style><img title="--><img src=x onerror=\'window.__markdownExecuted = true\'>">'
			);
			await expect(page.locator('#output img, #output math, #output style')).toHaveCount(0);
			await render(`
<img src="missing" onerror="window.__markdownExecuted = true">
<svg><g onload="window.__markdownExecuted = true"></g></svg>
<iframe srcdoc="<script>parent.__markdownExecuted = true</script>"></iframe>
<form><input name="action"><button onclick="window.__markdownExecuted = true">Unsafe</button></form>
<style>body { display: none }</style><script>window.__markdownExecuted = true</script>
<p style="color:red" data-user="secret" onclick="window.__markdownExecuted = true" aria-label="spoofed">Safe text</p>
[JS](javascript:alert%281%29)
<a href="java&#x09;script:alert(1)">Encoded JS</a>
<a href="data:text/html,unsafe">Data</a>
<a href="ftp://example.com">FTP</a>
`);
			await expect(page.locator('#output')).toContainText('Safe text');
			expect(
				await page.locator('#output').evaluate((node) => ({
					unsafeElements: node.querySelectorAll(
						'img,svg,math,iframe,form,input,button,style,script'
					).length,
					unsafeAttributes: [...node.querySelectorAll('*')].flatMap((element) =>
						[...element.attributes]
							.filter((attribute) => /^(?:on|data-|aria-|style$)/i.test(attribute.name))
							.map((attribute) => attribute.name)
					),
					unsafeLinks: [...node.querySelectorAll('a[href]')].map((link) =>
						link.getAttribute('href')
					)
				}))
			).toEqual({ unsafeElements: 0, unsafeAttributes: [], unsafeLinks: [] });
			expect(await page.evaluate(() => window.__markdownExecuted)).toBeUndefined();
			await render(`
# Document

**Bold** and *emphasis*, ~~removed~~ and \`code\`.

> Quotation

1. Ordered
2. Next

- Unordered

| Header | Value |
| --- | --- |
| First | Second |

\`\`\`js
const value = '<safe>';
\`\`\`

[External](https://example.com/path "A & B") [Internal](/local) [Anchor](#part) [Mail](mailto:hello@example.com)
`);
			await expect(page.locator('#output h1')).toHaveText('Document');
			await expect(page.locator('#output table th')).toHaveText(['Header', 'Value']);
			await expect(page.locator('#output table td')).toHaveText(['First', 'Second']);
			await expect(page.locator('#output blockquote')).toHaveText('Quotation');
			await expect(page.locator('#output pre code')).toContainText("const value = '<safe>';");
			await expect(page.locator('#output strong')).toHaveText('Bold');
			await expect(page.locator('#output em')).toHaveText('emphasis');
			await expect(page.locator('#output del')).toHaveText('removed');
			await expect(page.locator('#output ol li')).toHaveText(['Ordered', 'Next']);
			await expect(page.locator('#output ul li')).toHaveText('Unordered');
			await expect(page.getByRole('link', { name: 'External', exact: true })).toHaveAttribute(
				'rel',
				'noopener noreferrer'
			);
			await expect(page.getByRole('link', { name: 'External', exact: true })).toHaveAttribute(
				'target',
				'_blank'
			);
			for (const label of ['Internal', 'Anchor', 'Mail']) {
				await expect(page.getByRole('link', { name: label, exact: true })).not.toHaveAttribute(
					'target'
				);
			}
			const releases = join(lib, 'content/releases/entries');
			for (const path of [
				...['privacy-policy.md', 'terms-of-service.md'].map((name) =>
					join(repository, 'apps/web/static/legal', name)
				),
				...(await readdir(releases))
					.filter((name) => name.endsWith('.md'))
					.map((name) => join(releases, name))
			]) {
				await render(await readFile(path, 'utf8'));
				await expect(page.locator('#output')).not.toBeEmpty();
			}
			await page.evaluate(() => window.__markdownQa.show('retry'));
			await expect(page.getByText('content.markdown.failed', { exact: true })).toBeVisible();
			await expect(page.locator('#component .document')).toBeEmpty();
			await page.getByRole('button', { name: 'ui.fetch.retry' }).click();
			await expect(page.locator('#component .document')).toHaveText('retry');
			await page.evaluate(() => window.__markdownQa.show('hold:older'));
			await expect
				.poll(() => page.evaluate(() => window.__markdownQa.pending('hold:older')))
				.toBe(true);
			await page.evaluate(() => window.__markdownQa.show('Newest'));
			await expect(page.locator('#component .document')).toHaveText('Newest');
			await page.evaluate(() => window.__markdownQa.finish('hold:older'));
			await expect(page.locator('#component .document')).toHaveText('Newest');
			await page.evaluate(() => window.__markdownQa.show('hold:unmounted'));
			await expect
				.poll(() => page.evaluate(() => window.__markdownQa.pending('hold:unmounted')))
				.toBe(true);
			await page.evaluate(() => window.__markdownQa.unmount());
			await page.evaluate(() => window.__markdownQa.finish('hold:unmounted'));
			await expect(page.locator('#component')).toBeEmpty();
			expect(unhandledErrors).toEqual([]);
			console.log(
				`${name}: Markdown sanitization, document formatting, retry and stale results passed`
			);
		} finally {
			await browser.close();
		}
	}
} finally {
	await server.close();
	await rm(directory, { recursive: true, force: true });
}
