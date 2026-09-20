import { DEFAULT_VISUAL_THEME_ID } from '@chronos/core';
export const BUILTIN_COLOR_SCHEME_VIBRANT = 'vibrant';
export const M3_DEFAULT_THEME_ID = DEFAULT_VISUAL_THEME_ID;
export function resolveColorSchemeId(visualThemeId: string | undefined): string {
	return !visualThemeId || visualThemeId === DEFAULT_VISUAL_THEME_ID
		? BUILTIN_COLOR_SCHEME_VIBRANT
		: visualThemeId;
}
export function resolveColorSchemeThemeId(schemeId: string): string {
	return schemeId === BUILTIN_COLOR_SCHEME_VIBRANT ? DEFAULT_VISUAL_THEME_ID : schemeId;
}
