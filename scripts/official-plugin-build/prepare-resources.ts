import { watchInputs } from './watch-inputs.ts';
import { spawn } from 'node:child_process';
import { existsSync, mkdirSync, mkdtempSync, readFileSync, rmSync } from 'node:fs';
import { resolve } from 'node:path';
import { pathToFileURL } from 'node:url';
import { build } from 'vite';
import type { OfficialPluginDef } from '../official-plugins.config.ts';
import { createChronosAliasRecord } from '../resolve-chronos-aliases.ts';
import {
	buildConfigurationKey,
	captureBuildInputs,
	readBuildCache,
	writeBuildCache,
	writeChanged,
	type BuildInputs
} from './cache.ts';

export interface PreparedResources {
	colorsJson?: string;
	iconsJson?: string;
	aliases: Record<string, string>;
	inputs: BuildInputs;
	cacheHit: boolean;
}
export async function preparePluginResources(
	plugin: OfficialPluginDef,
	root: string
): Promise<PreparedResources> {
	const empty = { files: {}, directories: {}, scans: {} };
	if (!plugin.prepareResources)
		return {
			colorsJson: plugin.colorsJson,
			iconsJson: plugin.iconsJson,
			aliases: {},
			inputs: empty,
			cacheHit: true
		};
	const dir = resolve(root, 'dist/plugin-cache/resources', plugin.id);
	mkdirSync(dir, { recursive: true });
	const key = buildConfigurationKey(root, { prepareResources: plugin.prepareResources });
	const cachePath = resolve(dir, 'resources.json');
	type Value = { colorsJson?: string; iconsJson?: string };
	let cache = readBuildCache<Value>(cachePath, key);
	const cacheHit = Boolean(cache);
	if (!cache) {
		const temporary = mkdtempSync(resolve(dir, '.prepare-'));
		try {
			const watched = new Set<string>();
			let inputs = { files: [] as string[], directories: [] as string[], scans: [] as string[] };
			await build({
				configFile: false,
				root,
				logLevel: 'warn',
				resolve: { alias: createChronosAliasRecord(root) },
				plugins: [
					watchInputs(watched),
					{
						name: 'chronos-resource-inputs',
						generateBundle() {
							inputs = captureBuildInputs([...this.getModuleIds(), ...watched]);
						}
					}
				],
				build: {
					ssr: plugin.prepareResources,
					outDir: resolve(temporary, 'runner'),
					minify: false,
					rolldownOptions: { output: { entryFileNames: 'prepare.mjs', codeSplitting: false } }
				},
				ssr: { noExternal: true }
			});
			const entry = pathToFileURL(resolve(temporary, 'runner/prepare.mjs')).href;
			const outDir = resolve(temporary, 'output');
			mkdirSync(outDir);
			const code = `const {prepareResources}=await import(${JSON.stringify(entry)}); const result=await prepareResources(${JSON.stringify(outDir)}); process.stdout.write(JSON.stringify(result));`;
			const result = await new Promise<string>((done, reject) => {
				const child = spawn(process.execPath, ['--input-type=module', '-e', code], {
					cwd: root,
					stdio: ['ignore', 'pipe', 'inherit']
				});
				let output = '';
				child.stdout.on('data', (chunk) => {
					output += String(chunk);
				});
				child.on('error', reject);
				child.on('close', (status) =>
					status === 0
						? done(output)
						: reject(new Error(`${plugin.id}: resource preparation failed (${status})`))
				);
			});
			const generated = JSON.parse(result) as Value;
			const value: Value = {};
			for (const field of ['colorsJson', 'iconsJson'] as const) {
				const file = generated[field];
				if (file) {
					const absolute = resolve(outDir, file);
					if (!absolute.startsWith(`${outDir}/`) || !existsSync(absolute))
						throw new Error(`Invalid generated ${field}: ${file}`);
					value[field] = readFileSync(absolute, 'utf8');
				}
			}
			cache = writeBuildCache(
				cachePath,
				key,
				inputs.files,
				inputs.directories,
				inputs.scans,
				value
			);
		} finally {
			rmSync(temporary, { recursive: true, force: true });
		}
	}
	const result: PreparedResources = {
		colorsJson: plugin.colorsJson,
		iconsJson: plugin.iconsJson,
		aliases: {},
		inputs: cache.inputs,
		cacheHit
	};
	for (const field of ['colorsJson', 'iconsJson'] as const) {
		if (cache.value[field] !== undefined) {
			const file = resolve(dir, field === 'colorsJson' ? 'colors.json' : 'icons.json');
			writeChanged(file, cache.value[field]);
			result[field] = file;
			if (plugin[field]) result.aliases[plugin[field]] = file;
		}
	}
	return result;
}
