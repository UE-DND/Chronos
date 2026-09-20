import { createHash } from 'node:crypto';
import { readFileSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';
import {
	WORKBENCH_COLOR_REGISTRY,
	validateWorkbenchColors
} from '../packages/core/src/theme/workbench-colors.ts';

export function buildDefaultThemeCss(raw: unknown, themeId: string): string {
	const theme = raw as {
		id?: string;
		variants?: Record<string, { colors: Record<string, string> }>;
	};
	if (theme?.id !== themeId) throw new Error('Default theme resource ID mismatch');
	return (
		'/* generated from Profile default theme; do not edit */\n@layer tokens {\n' +
		(['light', 'dark'] as const)
			.map((mode) => {
				const result = validateWorkbenchColors(theme.variants?.[mode]?.colors);
				const required = Object.keys(WORKBENCH_COLOR_REGISTRY).filter((key) =>
					key.startsWith('color.')
				);
				if (result.errors.length || required.some((key) => !result.colors[key]))
					throw new Error(`Incomplete default theme colors: ${themeId}/${mode}`);
				const declarations = Object.entries(result.colors)
					.map(
						([key, value]) =>
							`\t\t${WORKBENCH_COLOR_REGISTRY[key as keyof typeof WORKBENCH_COLOR_REGISTRY].cssVar}: ${value};`
					)
					.join('\n');
				return `\t${mode === 'light' ? ':root' : ':root.dark'}:not(.chronos-theme-active) {\n${declarations}\n\t}`;
			})
			.join('\n\n') +
		'\n}\n'
	);
}
export function writeDefaultThemeCss(
	root: string,
	selection: { pluginId: string; themeId: string }
): { themeColor: string; backgroundColor: string } {
	const market = resolve(root, 'apps/web/static/official-plugins');
	const manifest = JSON.parse(
		readFileSync(resolve(market, `manifests/${selection.pluginId}.manifest.json`), 'utf8')
	);
	if (
		manifest.id !== selection.pluginId ||
		manifest.themeId !== selection.themeId ||
		!manifest.colorsUrl
	)
		throw new Error('Default theme must publish static colors');
	const assetPath = resolve(
		root,
		'apps/web/static',
		new URL(manifest.colorsUrl, 'https://build.invalid').pathname.replace(/^\//, '')
	);
	const colorsText = readFileSync(assetPath, 'utf8');
	if (createHash('sha256').update(colorsText).digest('hex') !== manifest.colorsSha256)
		throw new Error('Default theme integrity mismatch');
	const colors = JSON.parse(colorsText);
	const css = buildDefaultThemeCss(colors, selection.themeId);
	const target = resolve(root, 'apps/web/src/lib/theme/generated-colors.css');
	let previous = '';
	try {
		previous = readFileSync(target, 'utf8');
	} catch {
		/* first build */
	}
	if (previous !== css) writeFileSync(target, css);
	return {
		themeColor: colors.variants.light.colors['color.surface'],
		backgroundColor: colors.variants.light.colors['color.canvas']
	};
}
