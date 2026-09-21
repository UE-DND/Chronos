import { withBuildEnvironment } from './build-environment.ts';
import { watchInputs } from './watch-inputs.ts';
import { existsSync, mkdirSync, readFileSync, readdirSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { build, type Plugin } from 'vite';
import { svelte } from '@sveltejs/vite-plugin-svelte';
import tailwindcss from '@tailwindcss/vite';
import { collectBundledLicenses } from '../../apps/web/src/lib/legal/bundled-licenses.ts';
import type { BundledLicenseInfo } from '../../apps/web/src/lib/legal/third-party-license-generator.ts';
import {
	buildConfigurationKey,
	captureBuildInputs,
	readBuildCache,
	writeBuildCache,
	type BuildInputs
} from './cache.ts';
import type { OfficialPluginDef } from '../official-plugins.config.ts';

export const OFFICIAL_PLUGIN_BUNDLE_JS = 'bundle.js';
export const OFFICIAL_PLUGIN_BUNDLE_CSS = 'bundle.css';

/**
 * Vite lib mode extracts CSS to a sidecar file but leaves a runtime `import
 * './styles.css'` in the JS chunk. Strip those imports in Rollup renderChunk
 * (CSS is injected separately via activate / bundle.css).
 */
function removeLibModeCssImports(): Plugin {
	return {
		name: 'chronos-remove-lib-css-imports',
		apply: 'build',
		renderChunk(code) {
			return code.replace(/import\s*['"][^'"]+\.css['"];?\s*/g, '');
		}
	};
}

export async function compileOfficialPluginEntry(
	plugin: OfficialPluginDef,
	root: string,
	createAliasRecord: (root?: string) => Record<string, string>,
	outDir: string,
	releaseVersion: string,
	options: {
		mode?: 'dev' | 'production';
		resourceAliases?: Record<string, string>;
		environment?: Record<string, string>;
	} = {}
): Promise<{
	code: string | null;
	cssCode: string | null;
	licenses: BundledLicenseInfo[];
	inputs: BuildInputs;
	cacheHit: boolean;
}> {
	if (!plugin.entry || !existsSync(plugin.entry)) {
		return {
			code: null,
			cssCode: null,
			licenses: [],
			inputs: { files: {}, directories: {}, scans: {} },
			cacheHit: true
		};
	}

	const mode = options.mode ?? 'production';
	const cachePath = resolve(root, 'dist/plugin-cache', mode, plugin.id, 'compile.json');
	const key = buildConfigurationKey(root, {
		entry: plugin.entry,
		releaseVersion,
		mode,
		aliases: options.resourceAliases,
		environment: Object.fromEntries(
			Object.entries(options.environment ?? {}).filter(([key]) => /^(PUBLIC_|VITE_)/.test(key))
		)
	});
	const cached = readBuildCache<{
		code: string | null;
		cssCode: string | null;
		licenses: BundledLicenseInfo[];
	}>(cachePath, key);
	if (cached) return { ...cached.value, inputs: cached.inputs, cacheHit: true };
	const licenses: BundledLicenseInfo[] = [];
	const watched = new Set<string>();
	let inputs = { files: [] as string[], directories: [] as string[], scans: [] as string[] };
	mkdirSync(outDir, { recursive: true });

	await withBuildEnvironment(mode, () =>
		build({
			configFile: false,
			mode: mode === 'dev' ? 'development' : 'production',
			logLevel: 'warn',
			root: resolve(root, 'apps/web'),
			plugins: [
				watchInputs(watched),
				{
					name: 'chronos-generated-resource-aliases',
					enforce: 'pre',
					resolveId(source, importer) {
						if (!importer || !source.startsWith('.')) return;
						return options.resourceAliases?.[resolve(dirname(importer.split('?')[0]!), source)];
					}
				},
				tailwindcss(),
				svelte({ compilerOptions: { runes: true, dev: mode === 'dev' } }),
				...collectBundledLicenses((deps) => licenses.push(...deps)),
				{
					name: 'chronos-plugin-inputs',
					generateBundle() {
						inputs = captureBuildInputs([...this.getModuleIds(), ...watched]);
					}
				}
			],
			define: {
				__CHRONOS_PLUGIN_VERSION__: JSON.stringify(releaseVersion),
				'process.env.NODE_ENV': JSON.stringify(mode === 'dev' ? 'development' : 'production'),
				'import.meta.env.DEV': JSON.stringify(mode === 'dev'),
				'import.meta.env.PROD': JSON.stringify(mode === 'production')
			},
			resolve: {
				alias: createAliasRecord(root),
				conditions: ['module', 'browser', mode === 'dev' ? 'development' : 'production']
			},
			build: {
				emptyOutDir: true,
				minify: mode === 'dev' ? false : 'oxc',
				cssCodeSplit: false,
				lib: {
					entry: plugin.entry,
					formats: ['es'],
					fileName: () => OFFICIAL_PLUGIN_BUNDLE_JS
				},
				outDir,
				rollupOptions: {
					output: { codeSplitting: false },
					plugins: [removeLibModeCssImports()]
				}
			}
		})
	);

	let code: string | null = null;
	const builtPath = resolve(outDir, OFFICIAL_PLUGIN_BUNDLE_JS);
	if (existsSync(builtPath)) {
		code = readFileSync(builtPath, 'utf8');
	}

	let cssCode: string | null = null;
	const distFiles = existsSync(outDir) ? readdirSync(outDir) : [];
	const emittedCss = distFiles.find((f) => f.endsWith('.css'));
	if (emittedCss && existsSync(resolve(outDir, emittedCss))) {
		const raw = readFileSync(resolve(outDir, emittedCss), 'utf8');
		if (raw.trim().length > 0) cssCode = raw;
	}

	const value = { code, cssCode, licenses };
	const record = writeBuildCache(
		cachePath,
		key,
		inputs.files,
		inputs.directories,
		inputs.scans,
		value
	);
	return { ...value, inputs: record.inputs, cacheHit: false };
}
