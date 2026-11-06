import { copyFile, readFile, readdir, rm, writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';

/** Finalize only the mobile adapter's output, before Capacitor copies it. */
export async function prepareMobileAssets(output: string): Promise<void> {
	for (const asset of [
		'apple-touch-icon.png',
		'pwa-192.png',
		'pwa-192-maskable.png',
		'pwa-512.png',
		'pwa-512-maskable.png',
		'pwa',
		'sw.js',
		'sw.js.map',
		'manifest.webmanifest',
		...(await readdir(output)).filter((name) => /^workbox-.*\.js(?:\.map)?$/.test(name))
	]) {
		await rm(resolve(output, asset), { recursive: true, force: true });
	}
	const indexPath = resolve(output, 'index.html');
	const index = await readFile(indexPath, 'utf8');
	await writeFile(
		indexPath,
		index.replace(/<link\b[^>]*\brel="(?:apple-touch-icon|manifest)"[^>]*>/g, '')
	);
	await copyFile(
		new URL('../../../mobile/resources/webview-error.html', import.meta.url),
		resolve(output, 'webview-error.html')
	);
}
