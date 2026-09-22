import { describe, expect, it } from 'vite-plus/test';
import {
	WORKBENCH_COLOR_KEYS,
	createIconThemeFromJson,
	createThemeFromColorJson,
	parseColorThemeJson,
	parseIconThemeJson,
	resolveCoursePaint
} from '@chronos/core';
import colorsJson from '../theme-arknights.colors.json';
import iconsJson from '../theme-arknights.icons.json';

const THEME_ID = 'arknights';
const themeContribution = createThemeFromColorJson(parseColorThemeJson(colorsJson));
const iconThemeContribution = createIconThemeFromJson(parseIconThemeJson(iconsJson));

describe('@chronos/plugin-theme-arknights', () => {
	it('provides complete light and dark workbench color variants', () => {
		const expectedKeys = [...WORKBENCH_COLOR_KEYS].sort();
		expect(Object.keys(themeContribution.workbenchColors.light).sort()).toEqual(expectedKeys);
		expect(Object.keys(themeContribution.workbenchColors.dark).sort()).toEqual(expectedKeys);
		expect(themeContribution.workbenchColors.light['color.canvas']).toBe('#E9EDF2');
		expect(themeContribution.workbenchColors.dark['color.canvas']).toBe('#1A1C20');
		expect(themeContribution.workbenchColors.dark['color.primary']).toBe('#3F72AF');
		expect(themeContribution.workbenchColors.dark['color.warning']).toBe('#E08E45');
		expect(themeContribution.workbenchColors.light['shell.bottomTab.activeBackground']).toBe(
			'transparent'
		);
		expect(themeContribution.workbenchColors.dark['timetable.period.activeBackgroundImage']).toBe(
			'none'
		);
	});

	it('exposes six readable course colors in both modes', () => {
		for (const mode of ['light', 'dark'] as const) {
			const entries =
				typeof themeContribution.paletteEntries === 'function'
					? themeContribution.paletteEntries(mode)
					: themeContribution.paletteEntries;
			expect(entries).toHaveLength(6);
			expect(new Set(entries?.map((entry) => entry.background)).size).toBe(6);
			expect(entries).toContainEqual(resolveCoursePaint({ name: 'Originium Arts' }, entries));
			expect(entries).toEqual(colorsJson.coursePalette[mode]);
		}
	});

	it('recommends the matching icon theme', () => {
		expect(themeContribution.id).toBe(THEME_ID);
		expect(themeContribution.recommendedIconTheme).toBe(THEME_ID);
		expect(iconThemeContribution.id).toBe(THEME_ID);
	});

	it('ships safe original line icons for each supported bottom tab', () => {
		expect(Object.keys(iconThemeContribution.bottomTabIcons ?? {}).sort()).toEqual([
			'mine',
			'timetable',
			'today'
		]);

		for (const override of Object.values(iconThemeContribution.bottomTabIcons ?? {})) {
			expect(override.icon?.opacity).toBe(0.78);
			expect(override.iconFill?.opacity).toBe(1);
			for (const descriptor of [override.icon, override.iconFill]) {
				expect(descriptor?.type).toBe('svg');
				if (descriptor?.type !== 'svg') continue;
				expect(descriptor.markup).toContain('viewBox="0 0 24 24"');
				expect(descriptor.markup).toContain('fill="none"');
				expect(descriptor.markup).toContain('stroke="currentColor"');
				expect(descriptor.markup).toContain('stroke-width="1.5"');
				expect(descriptor.markup).not.toMatch(/<script|gradient|filter=|href=|url\(/i);
			}
		}
	});
});
