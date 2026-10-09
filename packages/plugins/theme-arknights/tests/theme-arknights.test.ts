import { createHash } from 'node:crypto';
import { readFileSync } from 'node:fs';
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
		expect(themeContribution.workbenchColors.light['color.canvas']).toBe('#E9E9E5');
		expect(themeContribution.workbenchColors.dark['color.canvas']).toBe('#171B1E');
		expect(themeContribution.workbenchColors.dark['color.primary']).toBe('#4AABEA');
		expect(themeContribution.workbenchColors.dark['color.warning']).toBe('#F1C644');
		expect(themeContribution.workbenchColors.light['shell.bottomTab.activeBackground']).toBe(
			'#24282B'
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

	it('keeps text readable on navigation, actions, surfaces and courses', () => {
		const luminance = (hex: string) => {
			const channels = hex
				.slice(1)
				.match(/../g)!
				.map((channel) => {
					const value = parseInt(channel, 16) / 255;
					return value <= 0.04045 ? value / 12.92 : ((value + 0.055) / 1.055) ** 2.4;
				});
			return channels[0]! * 0.2126 + channels[1]! * 0.7152 + channels[2]! * 0.0722;
		};
		const contrast = (foreground: string, background: string) => {
			const values = [luminance(foreground), luminance(background)].sort((a, b) => a - b);
			return (values[1]! + 0.05) / (values[0]! + 0.05);
		};
		for (const mode of ['light', 'dark'] as const) {
			const colors = colorsJson.variants[mode].colors;
			for (const [foreground, background] of [
				[colors['color.on-surface'], colors['color.surface']],
				[colors['color.on-surface-variant'], colors['color.surface-container-low']],
				[colors['color.on-primary'], colors['color.primary']],
				[colors['color.on-tertiary'], colors['color.tertiary']],
				[colors['color.on-tertiary'], colors['color.tertiary-dim']],
				[colors['color.inverse-on-surface'], colors['color.inverse-surface']],
				[colors['shell.bottomTab.activeForeground'], colors['shell.bottomTab.activeBackground']],
				...colorsJson.coursePalette[mode].map(({ foreground, background }) => [
					foreground,
					background
				])
			]) {
				expect(
					contrast(foreground!, background!),
					`${mode}: ${foreground} on ${background}`
				).toBeGreaterThanOrEqual(4.5);
			}
		}
	});

	it('recommends the matching icon theme', () => {
		expect(themeContribution.id).toBe(THEME_ID);
		expect(themeContribution.className).toBe('chronos-theme-arknights');
		expect(themeContribution.recommendedIconTheme).toBe(THEME_ID);
		expect(iconThemeContribution.id).toBe(THEME_ID);
	});

	it('preserves the original theme wallpaper', () => {
		expect(colorsJson.wallpaper).toEqual({
			url: './wallpaper.jpg',
			sha256: '2aeb0c4ae37521c3d242a1bda8c930f7551d3c5f13185d1bbd3e0173d6c37ecc'
		});
		expect(
			createHash('sha256')
				.update(readFileSync(new URL('../wallpaper.jpg', import.meta.url)))
				.digest('hex')
		).toBe(colorsJson.wallpaper.sha256);
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
