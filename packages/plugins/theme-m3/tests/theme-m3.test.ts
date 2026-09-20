import { buildM3Tokens } from '../src/m3-theme';
import { createWorkbenchColorsFromTokens } from '@chronos/core';
import { expect, it } from 'vite-plus/test';
import { createThemeFromColorJson, parseColorThemeJson } from '@chronos/core';
import { m3DefaultTheme } from '../src/index';
import colorsJson from '../theme-m3.colors.json';
import { OFFICIAL_PLUGINS } from '../../../../scripts/official-plugins.config';

it('ships the same theme identity and colors through the profile and market', () => {
	const theme = createThemeFromColorJson(parseColorThemeJson(colorsJson));
	expect(theme.id).toBe(m3DefaultTheme.id);
	expect(theme.workbenchColors).toEqual(m3DefaultTheme.workbenchColors);
	expect(theme.workbenchColors).toEqual(
		createWorkbenchColorsFromTokens(buildM3Tokens('light'), buildM3Tokens('dark'))
	);
	expect(theme.wallpaper).toBeUndefined();
	const manifest = OFFICIAL_PLUGINS.find((plugin) => plugin.id === 'theme-m3');
	expect(manifest?.colorsJson).toMatch(/theme-m3.colors.json$/);
	expect(manifest?.entry).toMatch(/theme-m3\/src\/index.ts$/);
	expect(m3DefaultTheme.resolveWallpaperColors).toBeTypeOf('function');
});
