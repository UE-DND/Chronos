/// <reference types="node" />

import { writeFileSync, readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { createWorkbenchColorsFromTokens } from '@chronos/core/theme/workbench-colors';
import { buildM3Tokens } from './src/m3-theme.ts';
export function prepareResources() {
	const colors = createWorkbenchColorsFromTokens(buildM3Tokens('light'), buildM3Tokens('dark'));
	const path = fileURLToPath(new URL('./theme-m3.colors.json', import.meta.url));
	const output =
		JSON.stringify(
			{
				id: 'm3-default',
				name: { 'zh-cn': 'Material 3', en: 'Material 3' },
				variants: { light: { colors: colors.light }, dark: { colors: colors.dark } }
			},
			null,
			'\t'
		) + '\n';
	let old = '';
	try {
		old = readFileSync(path, 'utf8');
	} catch {
		/* first build */
	}
	if (old !== output) writeFileSync(path, output);
}
