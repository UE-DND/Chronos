import { describe, expect, it } from 'vite-plus/test';
import {
	resolveColorSchemeId,
	resolveColorSchemeThemeId,
	M3_DEFAULT_THEME_ID
} from './color-scheme';
describe('theme selection', () => {
	it('round trips independent plugin theme IDs and the default option', () => {
		for (const id of ['miami', 'yumemita', 'another-theme', M3_DEFAULT_THEME_ID]) {
			expect(resolveColorSchemeThemeId(resolveColorSchemeId(id))).toBe(id);
		}
		expect(resolveColorSchemeId(undefined)).toBe('vibrant');
	});
});
