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
