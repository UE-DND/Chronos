import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { createWorkbenchColorsFromTokens } from '@chronos/core/theme/workbench-colors';
import {
	buildGeneratedThemeCss,
	buildGeneratedThemeInlineCss,
	buildM3Tokens
} from '@chronos/ui-kit/theme/m3-theme';
import { writeIfChanged } from '../build-utils/write-if-changed.ts';

const themeDir = dirname(fileURLToPath(import.meta.url));
const generatedThemePath = resolve(themeDir, 'generated-colors.css');
const generatedThemeInlinePath = fileURLToPath(
	new URL('../../../../../packages/ui-kit/src/theme/theme-inline.generated.css', import.meta.url)
);
const generatedWorkbenchPath = fileURLToPath(
	new URL(
		'../../../../../packages/ui-kit/src/theme/m3-default-workbench.generated.ts',
		import.meta.url
	)
);

const generatedM3JsonPath = fileURLToPath(
	new URL('../../../../../packages/plugins/theme-m3/theme-m3.colors.json', import.meta.url)
);

function writeGeneratedM3DefaultWorkbench(): void {
	const workbench = createWorkbenchColorsFromTokens(buildM3Tokens('light'), buildM3Tokens('dark'));
	writeIfChanged(
		generatedM3JsonPath,
		`${JSON.stringify(
			{
				id: 'm3-default',
				name: { 'zh-cn': 'Material 3', en: 'Material 3' },
				variants: { light: { colors: workbench.light }, dark: { colors: workbench.dark } }
			},
			null,
			'\t'
		)}\n`
	);

	writeIfChanged(
		generatedWorkbenchPath,
		`/* generated, do not edit */

export const m3DefaultWorkbenchColors: {
	light: Record<string, string>;
	dark: Record<string, string>;
} = ${JSON.stringify(workbench, null, '\t')};
`
	);
}

export function writeGeneratedThemeCss() {
	writeGeneratedM3DefaultWorkbench();
	writeIfChanged(generatedThemeInlinePath, buildGeneratedThemeInlineCss());
	writeIfChanged(generatedThemePath, buildGeneratedThemeCss());
	return generatedThemePath;
}
