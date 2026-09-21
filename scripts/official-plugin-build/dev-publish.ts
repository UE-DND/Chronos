import { existsSync, mkdirSync, readFileSync, renameSync, rmSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';
import type { OfficialPluginDef } from '../official-plugins.config.ts';
import type { ResolvedServerPlugin } from './server-definition.ts';
import { OFFICIAL_PLUGIN_BUNDLE_CSS, OFFICIAL_PLUGIN_BUNDLE_JS } from './compile-entry.ts';
import { buildDevManifestForPlugin, writeDevPluginManifest } from './build-manifest.ts';
import { digest } from './cache.ts';
import { createOfficialPluginBuildPaths, type OfficialPluginBuildPaths } from './paths.ts';

export interface DevPluginBuildFiles {
	wallpaperBytes?: Uint8Array;
	code: string | null;
	cssCode: string | null;
	colorsJson: string | null;
	iconThemeJson: string | null;
}

export interface PublishDevPluginBuildOptions {
	plugin: OfficialPluginDef;
	serverPlugin?: ResolvedServerPlugin | null;
	rev: string;
	files: DevPluginBuildFiles;
	releaseVersion: string;
	root?: string;
	paths?: OfficialPluginBuildPaths;
}

export interface PublishDevPluginBuildResult {
	rev: string;
	manifest: Record<string, unknown>;
}

function writeDevAssetFiles(dir: string, files: DevPluginBuildFiles): void {
	mkdirSync(dir, { recursive: true });
	if (files.wallpaperBytes) writeFileSync(resolve(dir, 'wallpaper.image'), files.wallpaperBytes);

	if (files.code) {
		writeFileSync(resolve(dir, OFFICIAL_PLUGIN_BUNDLE_JS), files.code, 'utf8');
	}
	if (files.cssCode) {
		writeFileSync(resolve(dir, OFFICIAL_PLUGIN_BUNDLE_CSS), files.cssCode, 'utf8');
	}
	if (files.colorsJson) {
		writeFileSync(resolve(dir, 'colors.json'), files.colorsJson, 'utf8');
	}
	if (files.iconThemeJson) {
		writeFileSync(resolve(dir, 'icons.json'), files.iconThemeJson, 'utf8');
	}
}

export function publishDevPluginBuild(
	options: PublishDevPluginBuildOptions
): PublishDevPluginBuildResult {
	const { plugin, serverPlugin, rev, files, releaseVersion } = options;
	const paths = options.paths ?? createOfficialPluginBuildPaths(options.root ?? process.cwd());
	const pluginDir = paths.devOutDir(plugin.id);
	const tempDir = paths.devTempDir(plugin.id);
	const revDir = paths.devRevDir(plugin.id, rev);

	rmSync(tempDir, { recursive: true, force: true });
	writeDevAssetFiles(tempDir, files);

	const manifest = buildDevManifestForPlugin(plugin, files, releaseVersion, rev, serverPlugin);
	writeFileSync(
		resolve(tempDir, 'manifest.json'),
		`${JSON.stringify(manifest, null, '\t')}\n`,
		'utf8'
	);

	mkdirSync(pluginDir, { recursive: true });
	if (existsSync(revDir)) {
		const names = [
			'bundle.js',
			'bundle.css',
			'colors.json',
			'icons.json',
			'wallpaper.image',
			'manifest.json'
		];
		const same = names.every((name) => {
			const fresh = resolve(tempDir, name),
				existing = resolve(revDir, name);
			return (
				existsSync(fresh) === existsSync(existing) &&
				(!existsSync(fresh) || digest(readFileSync(fresh)) === digest(readFileSync(existing)))
			);
		});
		if (same) rmSync(tempDir, { recursive: true, force: true });
		else {
			rmSync(revDir, { recursive: true, force: true });
			renameSync(tempDir, revDir);
		}
	} else renameSync(tempDir, revDir);
	writeDevPluginManifest(paths.devManifestPath(plugin.id), manifest);

	return { rev, manifest };
}

export function readPublishedDevManifest(
	pluginId: string,
	root?: string
): Record<string, unknown> | null {
	const paths = createOfficialPluginBuildPaths(root ?? process.cwd());
	const manifestPath = paths.devManifestPath(pluginId);
	if (!existsSync(manifestPath)) return null;
	return JSON.parse(readFileSync(manifestPath, 'utf8')) as Record<string, unknown>;
}
