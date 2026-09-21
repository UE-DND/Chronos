import { existsSync, mkdirSync, mkdtempSync, readFileSync, rmSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import type { OfficialPluginDef } from '../official-plugins.config.ts';
import type { BundledLicenseInfo } from '../../apps/web/src/lib/legal/third-party-license-generator.ts';
import { compileOfficialPluginEntry } from './compile-entry.ts';
import { publishDevPluginBuild } from './dev-publish.ts';
import { buildManifestForPlugin, writePluginManifest } from './build-manifest.ts';
import { createOfficialPluginBuildPaths, type OfficialPluginBuildPaths } from './paths.ts';
import { resolveOfficialServerPlugin } from './server-definition.ts';
import { preparePluginResources } from './prepare-resources.ts';
import { digest, snapshotInputs, writeChanged, type BuildInputs } from './cache.ts';

export type OfficialPluginBuildMode = 'production' | 'dev';
export interface BuildOfficialPluginOptions {
	root: string;
	releaseVersion: string;
	createAliasRecord: (root?: string) => Record<string, string>;
	mode: OfficialPluginBuildMode;
	rev?: string;
	paths?: OfficialPluginBuildPaths;
	publish?: boolean;
	signal?: AbortSignal;
	environment?: Record<string, string>;
}
export interface OfficialPluginBuildResult {
	wallpaperBytes?: Uint8Array;
	id: string;
	type: 'theme' | 'source' | 'codec' | 'tool';
	rev?: string;
	manifest?: Record<string, unknown>;
	code: string | null;
	cssCode: string | null;
	colorsJson: string | null;
	iconThemeJson: string | null;
	licenses?: BundledLicenseInfo[];
	inputs?: BuildInputs;
	cacheStatus?: { resources: boolean; compile: boolean };
}
export function publishProductionPlugin(
	result: OfficialPluginBuildResult,
	paths: OfficialPluginBuildPaths
): void {
	const dir = paths.pluginBundleDir(result.id);
	mkdirSync(dir, { recursive: true });
	const files = {
		'bundle.js': result.code,
		'bundle.css': result.cssCode,
		'colors.json': result.colorsJson,
		'icons.json': result.iconThemeJson,
		'wallpaper.image': result.wallpaperBytes
	};
	for (const [name, value] of Object.entries(files)) {
		const path = resolve(dir, name);
		if (value != null) writeChanged(path, value);
		else rmSync(path, { force: true });
	}
	writePluginManifest(paths.manifestDir, result.id, result.manifest!);
}
export async function buildOfficialPluginAssets(
	plugin: OfficialPluginDef,
	options: BuildOfficialPluginOptions
): Promise<OfficialPluginBuildResult> {
	const { root, releaseVersion, createAliasRecord, mode } = options;
	const prepared = await preparePluginResources(plugin, root);
	const paths = options.paths ?? createOfficialPluginBuildPaths(root);
	const assets: OfficialPluginBuildResult = {
		id: plugin.id,
		type: plugin.type,
		code: null,
		cssCode: null,
		colorsJson: null,
		iconThemeJson: null,
		licenses: [],
		cacheStatus: { resources: prepared.cacheHit, compile: true }
	};
	const resourceFiles: string[] = [];
	if (prepared.colorsJson) {
		resourceFiles.push(prepared.colorsJson);
		assets.colorsJson = readFileSync(prepared.colorsJson, 'utf8');
		const colors = JSON.parse(assets.colorsJson);
		if (colors.wallpaper) {
			const sourceUrl = colors.wallpaper.url;
			if (typeof sourceUrl !== 'string' || !sourceUrl || /^[a-z]+:/i.test(sourceUrl))
				throw new Error('Theme wallpaper must be a local image path');
			const imagePath = resolve(dirname(prepared.colorsJson), sourceUrl);
			resourceFiles.push(imagePath);
			assets.wallpaperBytes = readFileSync(imagePath);
			colors.wallpaper = { url: './wallpaper.image', sha256: digest(assets.wallpaperBytes) };
			assets.colorsJson = JSON.stringify(colors);
		}
	}
	if (prepared.iconsJson) {
		resourceFiles.push(prepared.iconsJson);
		assets.iconThemeJson = readFileSync(prepared.iconsJson, 'utf8');
	}
	let compileInputs: BuildInputs = { files: {}, directories: {}, scans: {} };
	if (plugin.entry) {
		if (!existsSync(plugin.entry)) throw new Error(`${plugin.id}: missing entry ${plugin.entry}`);
		mkdirSync(paths.compileDistDir, { recursive: true });
		const temporary = mkdtempSync(resolve(paths.compileDistDir, `.${plugin.id}-`));
		try {
			const compiled = await compileOfficialPluginEntry(
				plugin,
				root,
				createAliasRecord,
				temporary,
				releaseVersion,
				{ mode, resourceAliases: prepared.aliases, environment: options.environment }
			);
			if (!compiled.code) throw new Error(`${plugin.id}: no bundle.js`);
			assets.code = compiled.code;
			assets.cssCode = compiled.cssCode;
			assets.licenses = compiled.licenses;
			assets.cacheStatus!.compile = compiled.cacheHit;
			compileInputs = compiled.inputs;
		} finally {
			rmSync(temporary, { recursive: true, force: true });
		}
	}
	const packageDir = resolve(root, 'packages/plugins', plugin.sourceDir);
	resourceFiles.push(resolve(packageDir, 'package.json'));
	if (existsSync(resolve(packageDir, 'server/definition.ts')))
		resourceFiles.push(resolve(packageDir, 'server/definition.ts'));
	const resourceInputs = snapshotInputs(resourceFiles, [], []);
	assets.inputs = {
		files: { ...prepared.inputs.files, ...compileInputs.files, ...resourceInputs.files },
		directories: { ...prepared.inputs.directories, ...compileInputs.directories },
		scans: { ...prepared.inputs.scans, ...compileInputs.scans }
	};
	const serverPlugin = await resolveOfficialServerPlugin(plugin, root);
	assets.manifest = buildManifestForPlugin(plugin, assets, releaseVersion, serverPlugin);
	options.signal?.throwIfAborted();
	if (mode === 'dev') {
		const rev = options.rev ?? digest(JSON.stringify(assets.manifest)).slice(0, 24);
		const published = publishDevPluginBuild({
			plugin,
			serverPlugin,
			rev,
			files: assets,
			releaseVersion,
			paths
		});
		assets.rev = published.rev;
		assets.manifest = published.manifest;
	} else if (options.publish !== false) publishProductionPlugin(assets, paths);
	console.log(
		`[chronos-plugin] ${plugin.id} resources=${prepared.cacheHit ? 'hit' : 'built'} compile=${assets.cacheStatus!.compile ? 'hit' : 'built'}`
	);
	return assets;
}
