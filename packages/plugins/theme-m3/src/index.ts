import { createThemeFromColorJson, parseColorThemeJson } from '@chronos/core';
import colors from '../theme-m3.colors.json';
/** Test and tooling access to the same JSON distributed by the market. */
export const m3DefaultTheme = createThemeFromColorJson(parseColorThemeJson(colors));
