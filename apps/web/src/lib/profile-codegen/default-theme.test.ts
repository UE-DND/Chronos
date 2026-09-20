import { describe, expect, it } from 'vite-plus/test';
import { WORKBENCH_COLOR_REGISTRY } from '@chronos/core';
import { buildDefaultThemeCss } from '../../../../../scripts/generate-default-theme';

function theme() {
	const colors = Object.fromEntries(
		Object.keys(WORKBENCH_COLOR_REGISTRY)
			.filter((key) => key.startsWith('color.'))
			.map((key) => [key, '#123456'])
	);
	return {
		id: 'independent-theme',
		variants: { light: { colors }, dark: { colors: { ...colors, 'color.surface': '#abcdef' } } }
	};
}
describe('default theme boot styles', () => {
	it('generates both modes from any complete theme, without M3 fallback', () => {
		const css = buildDefaultThemeCss(theme(), 'independent-theme');
		expect(css).toContain('--color-surface: #123456');
		expect(css).toContain('--color-surface: #abcdef');
		expect(css).toContain(':root.dark:not(.chronos-theme-active)');
		expect(css).not.toContain('m3');
	});
	it('rejects a missing, mismatched or incomplete default', () => {
		expect(() => buildDefaultThemeCss(null, 'missing')).toThrow();
		expect(() => buildDefaultThemeCss(theme(), 'wrong')).toThrow();
		const missing = theme();
		delete missing.variants.light.colors['color.primary'];
		expect(() => buildDefaultThemeCss(missing, missing.id)).toThrow('Incomplete');
	});
});
