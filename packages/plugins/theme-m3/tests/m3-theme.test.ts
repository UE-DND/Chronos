import { describe, it, expect } from 'vite-plus/test';
import { createWorkbenchColorsFromTokens } from '@chronos/core/theme/workbench-colors';
import { m3DefaultTheme } from '../src/index';
const m3DefaultWorkbenchColors = m3DefaultTheme.workbenchColors;
import { buildM3Tokens, M3_BASE_COLORS } from '../src/m3-theme';

describe('M3DefaultTheme', () => {
	it('generates light and dark workbench colors', () => {
		const light = m3DefaultWorkbenchColors.light;
		expect(light['color.surface']).toBeDefined();
		expect(light['color.primary']).toBeDefined();

		const dark = m3DefaultWorkbenchColors.dark;
		expect(dark['color.surface']).toBeDefined();
		expect(dark['color.primary']).toBeDefined();
		expect(dark['color.surface']).not.toEqual(light['color.surface']);
	});

	it('supports seedColor dynamic color token generation', () => {
		const defaultTokens = buildM3Tokens('light');
		const customTokens = buildM3Tokens('light', '#ff5722');
		expect(customTokens.primary).not.toEqual(defaultTokens.primary);
	});

	it('m3-default workbench colors match host surface overrides', () => {
		const light = m3DefaultWorkbenchColors.light;
		expect(light['color.surface']).toBe(M3_BASE_COLORS.light.surface);
		expect(light['color.canvas']).toBe(M3_BASE_COLORS.light.canvas);
		expect(light['color.danger']).toBe(M3_BASE_COLORS.light.danger);
	});

	it('generated workbench snapshot matches live buildM3Tokens', () => {
		expect(m3DefaultWorkbenchColors).toEqual(
			createWorkbenchColorsFromTokens(buildM3Tokens('light'), buildM3Tokens('dark'))
		);
	});
});
