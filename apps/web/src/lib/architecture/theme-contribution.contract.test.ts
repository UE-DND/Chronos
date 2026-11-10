import { describe, expect, it } from 'vite-plus/test';
import { createThemeFromColorJson, parseColorThemeJson } from '@chronos/core';

describe('ThemeContribution', () => {
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
