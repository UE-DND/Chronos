import { mkdtemp, mkdir, readFile, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { resolve } from 'node:path';
import { describe, expect, it } from 'vite-plus/test';
import { prepareMobileAssets } from './mobile-assets.ts';

describe('mobile assets', () => {
	it('removes PWA-only assets and their HTML reference while preserving app resources', async () => {
		const output = await mkdtemp(resolve(tmpdir(), 'chronos-mobile-assets-'));
		try {
			await mkdir(resolve(output, 'pwa'));
			await mkdir(resolve(output, 'official-plugins'));
			for (const asset of [
				'apple-touch-icon.png',
				'pwa-192.png',
				'pwa-192-maskable.png',
				'pwa-512.png',
				'pwa-512-maskable.png',
				'pwa/screenshot-narrow.png',
				'chronos-icon.svg',
				'official-plugins/catalog.json'
			])
				await writeFile(resolve(output, asset), 'asset');
			await writeFile(
				resolve(output, 'index.html'),
				'<link rel="apple-touch-icon" href="/apple-touch-icon.png"><link rel="icon" href="/chronos-icon.svg"><main>Chronos</main>'
			);
			await prepareMobileAssets(output);
			expect(await readFile(resolve(output, 'index.html'), 'utf8')).toBe(
				'<link rel="icon" href="/chronos-icon.svg"><main>Chronos</main>'
			);
			expect(await readFile(resolve(output, 'chronos-icon.svg'), 'utf8')).toBe('asset');
			expect(await readFile(resolve(output, 'official-plugins/catalog.json'), 'utf8')).toBe(
				'asset'
			);
			for (const asset of [
				'apple-touch-icon.png',
				'pwa-192.png',
				'pwa-192-maskable.png',
				'pwa-512.png',
				'pwa-512-maskable.png',
				'pwa/screenshot-narrow.png'
			]) {
				await expect(readFile(resolve(output, asset))).rejects.toMatchObject({ code: 'ENOENT' });
			}
			expect(await readFile(resolve(output, 'webview-error.html'), 'utf8')).toContain(
				'无法加载 Chronos'
			);
			// Safe to rerun on already-filtered output.
			await prepareMobileAssets(output);
		} finally {
			await rm(output, { recursive: true, force: true });
		}
	});
});
