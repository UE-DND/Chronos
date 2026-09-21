/// <reference types="node" />

import { writeFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { createWorkbenchColorsFromTokens } from '@chronos/core/theme/workbench-colors';
import { buildM3Tokens } from './src/m3-theme.ts';
export function prepareResources(outDir: string) {
	const colors = createWorkbenchColorsFromTokens(buildM3Tokens('light'), buildM3Tokens('dark'));
	const path = resolve(outDir, 'colors.json');
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
	writeFileSync(path, output);
	return { colorsJson: 'colors.json' };
}
