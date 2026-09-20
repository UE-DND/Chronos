import { describe, expect, it } from 'vite-plus/test';
import {
	createThemeFromColorJson,
	parseColorThemeJson,
	type ThemeContribution
} from '@chronos/core';
import { m3DefaultTheme } from '@chronos/ui-kit';
describe('ThemeContribution', () => {
	it('allows image contributions without any dynamic color adapter', () => {
		const wallpaper = new Blob(['image']);
		const theme: ThemeContribution = { ...m3DefaultTheme, id: 'custom', wallpaper };
		expect(theme.wallpaper).toBe(wallpaper);
		expect(Object.keys(theme.workbenchColors.light).length).toBeGreaterThan(0);
		expect(m3DefaultTheme.wallpaper).toBeUndefined();
	});
	it('requires integrity metadata for downloadable wallpaper', () => {
		const raw = {
			id: 'theme',
			name: 'Theme',
			variants: { light: { colors: {} }, dark: { colors: {} } }
		};
		expect(() => parseColorThemeJson({ ...raw, wallpaper: { url: './a.png' } })).toThrow(/SHA-256/);
		const parsed = parseColorThemeJson({
			...raw,
			wallpaper: { url: './a.png', sha256: 'a'.repeat(64) }
		});
		expect(parsed.wallpaper?.url).toBe('./a.png');
		expect(createThemeFromColorJson(parsed).wallpaper).toBeUndefined();
	});
});
