import { createHash } from 'node:crypto';
import { writeChanged } from './cache.ts';
import { resolve } from 'node:path';
import type { OfficialPluginDef } from '../official-plugins.config.ts';
import type { ResolvedServerPlugin } from './server-definition.ts';
import { pluginAssetUrl, pluginDevAssetUrl } from './urls.ts';

export interface OfficialPluginAssetPayload {
	wallpaperBytes?: Uint8Array;
	code: string | null;
	cssCode: string | null;
	colorsJson: string | null;
	iconThemeJson: string | null;
}

export function buildManifestForPlugin(
	plugin: OfficialPluginDef,
	assets: OfficialPluginAssetPayload,
	releaseVersion: string,
	serverPlugin?: ResolvedServerPlugin | null
): Record<string, unknown> {
	const manifest: Record<string, unknown> = {
		id: plugin.id,
		name: plugin.name,
		version: releaseVersion,
		description: plugin.description,
		author: 'Chronos',
		type: plugin.type,
		bundleFormat: 'esm'
	};
	if (plugin.type === 'tool') {
		manifest.toolGroup = plugin.toolGroup;
	}

	if (serverPlugin)
		manifest.optionalServerCapabilities = [
			{ pluginId: serverPlugin.id, action: serverPlugin.definition.proxy.action }
		];

	applyAssetManifestFields(manifest, assets, (fileName) => pluginAssetUrl(plugin.id, fileName));

	return manifest;
}

export function writePluginManifest(
	manifestDir: string,
	pluginId: string,
	manifest: Record<string, unknown>
): void {
	writeChanged(
		resolve(manifestDir, `${pluginId}.manifest.json`),
		`${JSON.stringify(manifest, null, '\t')}\n`
	);
}

function applyAssetManifestFields(
	manifest: Record<string, unknown>,
	assets: OfficialPluginAssetPayload,
	urlFor: (fileName: string) => string
): void {
	manifest.downloadSizeBytes =
		[assets.code, assets.cssCode, assets.colorsJson, assets.iconThemeJson].reduce(
			(total, text) => total + Buffer.byteLength(text ?? '', 'utf8'),
			0
		) + (assets.wallpaperBytes?.byteLength ?? 0);

	if (assets.colorsJson) {
		manifest.colorsUrl = urlFor('colors.json');
		manifest.colorsSha256 = createHash('sha256').update(assets.colorsJson).digest('hex');
		const declaredId = (JSON.parse(assets.colorsJson) as { id?: unknown }).id;
		if (typeof declaredId === 'string' && declaredId) {
			manifest.themeId = declaredId;
		}
	}

	if (assets.iconThemeJson) {
		manifest.iconThemeUrl = urlFor('icons.json');
		manifest.iconThemeSha256 = createHash('sha256').update(assets.iconThemeJson).digest('hex');
	}

	if (assets.code) {
		manifest.bundleUrl = urlFor('bundle.js');
		manifest.sha256 = createHash('sha256').update(assets.code).digest('hex');
	}

	if (assets.cssCode) {
		manifest.cssUrl = urlFor('bundle.css');
		manifest.cssSha256 = createHash('sha256').update(assets.cssCode).digest('hex');
	}
}

export function buildDevManifestForPlugin(
	plugin: OfficialPluginDef,
	assets: OfficialPluginAssetPayload,
	releaseVersion: string,
	rev: string,
	serverPlugin?: ResolvedServerPlugin | null
): Record<string, unknown> {
	const manifest: Record<string, unknown> = {
		id: plugin.id,
		name: plugin.name,
		version: releaseVersion,
		description: plugin.description,
		author: 'Chronos',
		type: plugin.type,
		bundleFormat: 'esm',
		devRev: rev
	};
	if (plugin.type === 'tool') {
		manifest.toolGroup = plugin.toolGroup;
	}
	if (serverPlugin)
		manifest.optionalServerCapabilities = [
			{ pluginId: serverPlugin.id, action: serverPlugin.definition.proxy.action }
		];

	applyAssetManifestFields(manifest, assets, (fileName) =>
		pluginDevAssetUrl(plugin.id, rev, fileName)
	);

	return manifest;
}

export function writeDevPluginManifest(
	manifestPath: string,
	manifest: Record<string, unknown>
): void {
	writeChanged(manifestPath, `${JSON.stringify(manifest, null, '\t')}\n`);
}
