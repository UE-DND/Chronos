import { existsSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import type { Plugin } from 'vite';
import { buildDefaultThemeCss } from '../generate-default-theme.ts';
import {
	resolveProfile,
	resolveProfileId
} from '../../apps/web/src/lib/profile-codegen/profile-definitions.ts';
import type { BundledLicenseInfo } from '../../apps/web/src/lib/legal/third-party-license-generator.ts';
import type { OfficialPluginBuildResult } from './build-plugin.ts';
import { digest, writeChanged } from './cache.ts';

export interface HostBuildContext {
	command: 'dev' | 'build';
	mode: string;
	profileId: string;
	deployment: string;
	base: string;
	environment: Record<string, string>;
	cssPath: string;
	licensesPath: string;
	themeColor: string;
	backgroundColor: string;
}
export function writeHostBuildContext(
	root: string,
	options: Omit<HostBuildContext, 'cssPath' | 'licensesPath' | 'themeColor' | 'backgroundColor'>,
	results: OfficialPluginBuildResult[]
): HostBuildContext {
	const dir = resolve(root, 'dist/host-context', options.command, options.profileId);
	const selection = resolveProfile(options.profileId).defaultTheme;
	const theme = results.find((result) => result.id === selection.pluginId);
	if (
		!theme?.colorsJson ||
		theme.manifest?.themeId !== selection.themeId ||
		digest(theme.colorsJson) !== theme.manifest.colorsSha256
	)
		throw new Error('Default theme integrity mismatch');
	const colors = JSON.parse(theme.colorsJson);
	const cssPath = resolve(dir, 'colors.css');
	writeChanged(cssPath, buildDefaultThemeCss(colors, selection.themeId));
	const licensesPath = resolve(dir, 'plugin-licenses.json');
	const licenses: BundledLicenseInfo[] = results.flatMap((result) => result.licenses ?? []);
	writeChanged(licensesPath, JSON.stringify(licenses));
	const context = {
		...options,
		cssPath,
		licensesPath,
		themeColor: colors.variants.light.colors['color.surface'] as string,
		backgroundColor: colors.variants.light.colors['color.canvas'] as string
	};
	writeChanged(resolve(dir, 'context.json'), JSON.stringify(context));
	return context;
}
export function readHostBuildContext(): HostBuildContext | undefined {
	const path = process.env.CHRONOS_BUILD_CONTEXT;
	return path && existsSync(path)
		? (JSON.parse(readFileSync(path, 'utf8')) as HostBuildContext)
		: undefined;
}
export function hostBuildContextPlugin(root: string): Plugin {
	let mode: string | undefined;
	let command: string | undefined;
	const validate = () => {
		if (process.env.VITEST) return;
		const context = readHostBuildContext();
		if (
			!context ||
			context.profileId !== resolveProfileId() ||
			(mode && context.mode !== mode) ||
			(command && context.command !== (command === 'serve' ? 'dev' : 'build')) ||
			!existsSync(context.cssPath) ||
			!existsSync(context.licensesPath)
		)
			throw new Error('Prepare host assets with vp run dev or vp run build');
	};
	return {
		name: 'chronos-host-build-context',
		configResolved(config) {
			mode = config.mode;
			command = config.command;
		},
		configureServer: validate,
		buildStart: validate,
		resolveId(source, importer) {
			if (!importer || !source.endsWith('generated-colors.css')) return;
			if (
				resolve(importer.split('?')[0]!, '..', source) !==
				resolve(root, 'apps/web/src/lib/theme/generated-colors.css')
			)
				return;
			return readHostBuildContext()?.cssPath;
		}
	};
}
