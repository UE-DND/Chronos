import { mkdtempSync, mkdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { resolve } from 'node:path';
import { createServer } from 'node:http';
import { runInNewContext } from 'node:vm';
import { afterEach, expect, it } from 'vite-plus/test';
import type { HostBuildIdentity } from '../../../../packages/core/src/types/host-update.ts';
import { finalizeWorkerArtifacts } from './worker-artifacts.ts';

let output: string | undefined;

afterEach(() => {
	if (output) rmSync(output, { recursive: true, force: true });
	output = undefined;
});

it('keeps a null preparation lock active in the generated worker', () => {
	output = mkdtempSync(resolve(tmpdir(), 'chronos-worker-'));
	const host: HostBuildIdentity = {
		version: '1.0.0',
		buildId: 'a'.repeat(64),
		sourceCommit: 'b'.repeat(40),
		profileId: 'chronos-default',
		deploymentId: 'pages',
		target: 'pages'
	};
	mkdirSync(resolve(output, '_app'), { recursive: true });
	mkdirSync(resolve(output, `_chronos/${host.buildId}`), { recursive: true });
	writeFileSync(resolve(output, `_chronos/${host.buildId}/shell.html`), '');
	writeFileSync(resolve(output, '_app/env.js'), '');
	const workboxSource = 'self.addEventListener("fetch", () => {});';
	writeFileSync(resolve(output, 'sw.js'), workboxSource);

	finalizeWorkerArtifacts(output, host, '');

	const source = readFileSync(resolve(output, `sw-host-gate-${host.buildId}.js`), 'utf8');
	expect(source).toContain('prepared.until === null || prepared.until > Date.now()');
	const worker = readFileSync(resolve(output, 'sw.js'), 'utf8');
	expect(worker).toBe(
		`importScripts("sw-host-gate-${host.buildId}.js", "sw-class-notifications.js");\n${workboxSource}`
	);
});

it.each(['', '/Chronos'])('serves redirected offline pages at base %s', async (base) => {
	const shell = '<!doctype html><title>Chronos</title>';
	const upstream = createServer((request, response) => {
		if (request.url === '/shell.html') {
			response.writeHead(308, { location: '/shell' });
			response.end();
		} else {
			response.writeHead(200, { 'content-type': 'text/html', 'x-shell': 'verified' });
			response.end(shell);
		}
	});
	await new Promise<void>((resolve) => upstream.listen(0, '127.0.0.1', resolve));
	try {
		const address = upstream.address();
		if (!address || typeof address === 'string') throw new Error('Missing upstream address');
		const redirected = await fetch(`http://127.0.0.1:${address.port}/shell.html`);
		expect(redirected.redirected).toBe(true);

		output = mkdtempSync(resolve(tmpdir(), 'chronos-worker-'));
		const host: HostBuildIdentity = {
			version: '1.0.0',
			buildId: 'a'.repeat(64),
			sourceCommit: 'b'.repeat(40),
			profileId: 'chronos-cqut',
			deploymentId: 'chronos-cqut',
			target: 'cloudflare'
		};
		mkdirSync(resolve(output, '_app'), { recursive: true });
		mkdirSync(resolve(output, `_chronos/${host.buildId}`), { recursive: true });
		writeFileSync(resolve(output, `_chronos/${host.buildId}/shell.html`), shell);
		writeFileSync(resolve(output, '_app/env.js'), '');
		writeFileSync(resolve(output, 'sw.js'), '');
		finalizeWorkerArtifacts(output, host, base);

		const cache = new Map<string, Response>();
		const listeners = new Map<string, (event: unknown) => void>();
		let downloads = 0;
		runInNewContext(readFileSync(resolve(output, `sw-host-gate-${host.buildId}.js`), 'utf8'), {
			Response,
			URL,
			AbortController,
			crypto: globalThis.crypto,
			setTimeout,
			clearTimeout,
			fetch: () => {
				downloads += 1;
				return Promise.resolve(redirected.clone());
			},
			caches: {
				open: () =>
					Promise.resolve({
						match: (url: string) => Promise.resolve(cache.get(url)?.clone()),
						put: (url: string, response: Response) => {
							cache.set(url, response.clone());
							return Promise.resolve();
						}
					})
			},
			self: {
				location: { origin: 'https://chronos.test' },
				addEventListener: (type: string, listener: (event: unknown) => void) =>
					listeners.set(type, listener)
			}
		});
		function dispatchFetch(path: string, mode = 'navigate'): Promise<Response> | undefined {
			let result: Promise<Response> | undefined;
			listeners.get('fetch')!({
				request: { url: `https://chronos.test${base}${path}`, mode },
				respondWith: (response: Promise<Response>) => {
					result = response;
				}
			});
			return result;
		}
		for (const path of ['/', '/plugins', '/plugins/tool-clock', '/plugins/tool-clock/settings']) {
			const pending = dispatchFetch(path);
			expect(pending, path).toBeDefined();
			const response = await pending!;
			expect(response.redirected).toBe(false);
			expect(response.status).toBe(200);
			expect(response.headers.get('x-shell')).toBe('verified');
			expect(await response.text()).toBe(shell);
		}
		expect(downloads).toBe(1);
		for (const path of [
			'/api/plugins/source-cqut/preview',
			'/plugins/releases/1.0.0/',
			'/plugins/releases/1.0.0/catalog.json',
			'/official-plugins/catalog.json',
			'/official-plugins/bundles/tool-clock.js',
			'/version.json'
		]) {
			expect(dispatchFetch(path), path).toBeUndefined();
		}
		expect(dispatchFetch('/plugins/tool-clock', 'cors')).toBeUndefined();
	} finally {
		await new Promise<void>((resolve, reject) =>
			upstream.close((error) => (error ? reject(error) : resolve()))
		);
	}
});
