import { createHash } from 'node:crypto';
import { existsSync, readFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { resolveMarketFile, marketFiles } from './market-files.ts';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '../..');
const defaultWebPublicDir = resolve(root, 'dist/plugin-market');

const ASSET_FIELDS: ReadonlyArray<readonly [urlField: string, hashField: string]> = [
	['bundleUrl', 'sha256'],
	['cssUrl', 'cssSha256'],
	['colorsUrl', 'colorsSha256'],
	['iconThemeUrl', 'iconThemeSha256']
];

import { OFFICIAL_PLUGINS } from '../official-plugins.config.ts';

function pluginRequiresTailwindSource(pluginId: string): boolean {
	const plugin = OFFICIAL_PLUGINS.find((entry) => entry.id === pluginId);
	if (!plugin) return false;
	return plugin.tailwindSource ?? Boolean(plugin.entry);
}

const CSS_FINGERPRINTS: Record<string, readonly string[]> = {
	'tool-today': ['bg-secondary-container', 'divide-outline'],
	'tool-calendar-holidays': ['text-error'],
	'tool-qrcode': ['border-dashed'],
	'tool-error-log': ['font-mono', 'divide-outline'],
	'tool-clock': ['divide-outline']
};

const PREFLIGHT_MARKERS = ['border: 0 solid', 'border:0 solid'] as const;

function verifySelfContainedPluginCss(
	catalog: { manifests: string[] },
	webPublicDir: string
): number {
	let failures = 0;
	const seen = new Set<string>();

	for (const manifestUrl of catalog.manifests) {
		const manifestPath = resolveMarketFile(
			webPublicDir,
			resolve(webPublicDir, 'catalog.json'),
			manifestUrl
		);
		if (!existsSync(manifestPath)) continue;
		const manifest = JSON.parse(readFileSync(manifestPath, 'utf8')) as Record<string, unknown>;
		const pluginId = typeof manifest.id === 'string' ? manifest.id : undefined;
		if (!pluginId || seen.has(pluginId)) continue;
		seen.add(pluginId);

		if (!pluginRequiresTailwindSource(pluginId)) continue;

		const cssUrl = manifest.cssUrl;
		if (typeof cssUrl !== 'string' || !cssUrl) {
			console.error(`✗ ${pluginId}: missing self-contained cssUrl`);
			failures++;
			continue;
		}

		const cssPath = resolveMarketFile(webPublicDir, manifestPath, cssUrl);
		if (!existsSync(cssPath)) {
			console.error(`✗ ${pluginId}: missing bundle.css at ${cssUrl}`);
			failures++;
			continue;
		}

		const cssContent = readFileSync(cssPath, 'utf8');
		if (PREFLIGHT_MARKERS.some((marker) => cssContent.includes(marker))) {
			console.error(`✗ ${pluginId}: bundle.css appears to include Tailwind Preflight`);
			failures++;
		}
		if (/--color-surface:\s*#/.test(cssContent)) {
			console.error(`✗ ${pluginId}: bundle.css must not emit :root token hex values`);
			failures++;
		}

		const fingerprints = CSS_FINGERPRINTS[pluginId] ?? [];
		for (const token of fingerprints) {
			if (!cssContent.includes(token)) {
				console.error(`✗ ${pluginId}: bundle.css missing fingerprint "${token}"`);
				failures++;
			}
		}
	}

	return failures;
}

/**
 * Verifies that every official-plugin asset on disk matches the sha256 declared
 * in its manifest. Stale artifacts (rebuilt bundle without recomputed manifest,
 * or vice versa) fail loudly here instead of at user install time.
 */
export function verifyOfficialPlugins(webPublicDir = defaultWebPublicDir, checkCss = true): void {
	marketFiles(webPublicDir);
	const catalogPath = resolve(webPublicDir, 'catalog.json');
	const catalog = JSON.parse(readFileSync(catalogPath, 'utf8')) as { manifests: string[] };
	let failures = 0;

	for (const manifestUrl of catalog.manifests) {
		const manifestPath = resolveMarketFile(
			webPublicDir,
			resolve(webPublicDir, 'catalog.json'),
			manifestUrl
		);
		if (!existsSync(manifestPath)) {
			console.error(`✗ missing manifest: ${manifestUrl}`);
			failures++;
			continue;
		}
		const manifest = JSON.parse(readFileSync(manifestPath, 'utf8')) as Record<string, unknown>;
		const pluginId = typeof manifest.id === 'string' && manifest.id ? manifest.id : manifestUrl;

		let assetBytes = 0;
		if (typeof manifest.colorsUrl === 'string') {
			const colorPath = resolveMarketFile(webPublicDir, manifestPath, manifest.colorsUrl);
			if (existsSync(colorPath)) {
				const wallpaper = JSON.parse(readFileSync(colorPath, 'utf8')).wallpaper;
				if (wallpaper) {
					const imagePath = resolveMarketFile(webPublicDir, colorPath, wallpaper.url);
					if (existsSync(imagePath)) assetBytes += readFileSync(imagePath).byteLength;
					if (
						!existsSync(imagePath) ||
						createHash('sha256').update(readFileSync(imagePath)).digest('hex') !== wallpaper.sha256
					) {
						console.error(`✗ ${pluginId}: wallpaper integrity mismatch`);
						failures++;
					}
				}
			}
		}

		for (const [urlField, hashField] of ASSET_FIELDS) {
			const url = manifest[urlField];
			const expected = manifest[hashField];
			if (url === undefined && expected === undefined) continue;
			if (typeof url !== 'string' || typeof expected !== 'string') {
				console.error(`✗ ${pluginId}: ${urlField}/${hashField} presence mismatch`);
				failures++;
				continue;
			}
			const assetPath = resolveMarketFile(webPublicDir, manifestPath, url);
			if (!existsSync(assetPath)) {
				console.error(`✗ ${pluginId}: missing asset ${url}`);
				failures++;
				continue;
			}
			const asset = readFileSync(assetPath);
			assetBytes += asset.byteLength;
			const actual = createHash('sha256').update(asset).digest('hex');
			if (actual !== expected) {
				console.error(
					`✗ ${pluginId}: ${url} sha256 ${actual.slice(0, 16)}… != declared ${expected.slice(0, 16)}…`
				);
				failures++;
			}
		}
		if (manifest.downloadSizeBytes !== assetBytes) {
			console.error(`✗ ${pluginId}: downloadSizeBytes does not match ${assetBytes} asset bytes`);
			failures++;
		}
	}

	if (checkCss) failures += verifySelfContainedPluginCss(catalog, webPublicDir);

	if (failures > 0) {
		console.error(`verify-official-plugins: ${failures} failure(s)`);
		throw new Error(`Official plugin verification failed (${failures})`);
	} else {
		console.log('verify-official-plugins: all assets match declared hashes');
	}
}

const isMain = process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url);
if (isMain) {
	verifyOfficialPlugins(process.argv[2]);
}
