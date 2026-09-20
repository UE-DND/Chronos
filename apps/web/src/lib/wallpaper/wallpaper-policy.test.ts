import { describe, expect, it } from 'vite-plus/test';
import { DEFAULT_VISUAL_THEME_ID } from '@chronos/core';
import { resolveWallpaper, canUseWallpaperColors } from './wallpaper-policy';

describe('host wallpaper policy', () => {
	it('keeps custom, theme and none independent across theme switches', () => {
		const custom = new Blob(['custom']);
		const first = new Blob(['first']);
		const second = new Blob(['second']);
		expect(resolveWallpaper('custom', custom, first)).toBe(custom);
		expect(resolveWallpaper('custom', custom, second)).toBe(custom);
		expect(resolveWallpaper('theme', custom, second)).toBe(second);
		expect(resolveWallpaper('theme', custom, undefined)).toBeNull();
		expect(resolveWallpaper('none', custom, second)).toBeNull();
	});
	it('suspends colors for plugin themes without changing the saved switch', () => {
		expect(canUseWallpaperColors(DEFAULT_VISUAL_THEME_ID, true)).toBe(true);
		expect(canUseWallpaperColors('miami', true)).toBe(false);
		expect(canUseWallpaperColors(DEFAULT_VISUAL_THEME_ID, false)).toBe(false);
	});
});
