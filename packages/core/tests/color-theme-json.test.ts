import { describe, expect, it } from 'vite-plus/test';
import { resolveLocaleMapText } from '../src/i18n/i18n-catalog';
import { createThemeFromColorJson, parseColorThemeJson } from '../src/theme/color-theme-json';
import { resolveLocalizedText } from '../src/types/slots';

describe('resolveLocalizedText locale maps', () => {
	const name = { 'zh-CN': '示例主题', en: 'Example theme' };

	it('resolves manifest-style maps for the requested locale', () => {
		expect(resolveLocalizedText(name, '', 'en')).toBe('Example theme');
		expect(resolveLocalizedText(name, '', 'zh-cn')).toBe('示例主题');
	});

	it('falls back through resolveLocaleMapText when locale is missing', () => {
		expect(resolveLocaleMapText({ 'zh-CN': '示例主题' }, 'en')).toBe('示例主题');
	});
});

describe('createThemeFromColorJson localized metadata', () => {
	const theme = createThemeFromColorJson(
		parseColorThemeJson({
			id: 'example-theme',
			name: { 'zh-CN': '示例主题', en: 'Example theme' },
			variants: {
				light: { colors: { 'color.primary': '#006D6F' } },
				dark: { colors: { 'color.primary': '#3DBCA8' } }
			}
		})
	);

	it('keeps locale maps on the contribution for runtime resolution', () => {
		expect(theme.name).toEqual({ 'zh-CN': '示例主题', en: 'Example theme' });
		expect(resolveLocalizedText(theme.name, 'example-theme', 'en')).toBe('Example theme');
		expect(resolveLocalizedText(theme.name, 'example-theme', 'zh-cn')).toBe('示例主题');
	});
});
