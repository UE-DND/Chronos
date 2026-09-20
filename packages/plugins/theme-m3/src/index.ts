import {
	createThemeFromColorJson,
	parseColorThemeJson,
	defineChronosPlugin,
	designTokensToWorkbenchColors
} from '@chronos/core';
import colors from '../theme-m3.colors.json';
import { colorsFromImageBytes, coursePaletteFromSources, schemeAccentCssVars } from './m3-theme';
export const m3DefaultTheme = {
	...createThemeFromColorJson(parseColorThemeJson(colors)),
	resolveWallpaperColors(
		this: void,
		{
			pixels,
			mode,
			signal
		}: { pixels: Uint8ClampedArray; mode: 'light' | 'dark'; signal: AbortSignal }
	) {
		signal.throwIfAborted();
		const { seed, ranked } = colorsFromImageBytes(pixels);
		const vars = schemeAccentCssVars(seed, mode === 'dark');
		return {
			workbenchColors: designTokensToWorkbenchColors(
				Object.fromEntries(
					Object.entries(vars).map(([key, value]) => [key.replace('--color-', ''), value])
				)
			),
			coursePalette: coursePaletteFromSources(ranked)
		};
	}
};
export function createM3ThemePlugin() {
	return defineChronosPlugin({
		id: 'theme-m3',
		nameKey: 'name',
		messages: { en: { name: 'Material 3' }, 'zh-cn': { name: 'Material 3' } },
		category: 'theme',
		apply(ctx) {
			ctx.registerSlot('theme.definition', m3DefaultTheme);
		}
	});
}
export default createM3ThemePlugin();
