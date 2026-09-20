import type { CoursePaletteEntry } from '@chronos/core';
import { COURSE_PALETTE_ENTRIES } from '@chronos/core';
import type { WallpaperColorAdapter } from '$lib/wallpaper/wallpaper-theme';

/** Keep in sync with app.html boot IIFE theme-color literals. */
export const THEME_COLOR_LIGHT = '#0068B7';
export const THEME_COLOR_DARK = '#1a1c1e';

export type ApplyAppearanceInput = {
	wallpaperColorEnabled: boolean;
	isDark: boolean;
	wallpaperUri: string | null;
	activeThemeId: string | null;
	themePaletteEntries?: readonly CoursePaletteEntry[] | null;
};

function abortIfNeeded(signal: AbortSignal | undefined) {
	if (signal?.aborted) throw new DOMException('Aborted', 'AbortError');
}

function syncThemeColorMeta(isDark: boolean) {
	if (typeof document === 'undefined') return;
	const meta = document.querySelector('meta[name="theme-color"]');
	if (meta) {
		meta.setAttribute('content', isDark ? THEME_COLOR_DARK : THEME_COLOR_LIGHT);
	}
}

/** Keep in sync with app.html boot IIFE status-bar-style literals. */
function syncAppleStatusBarStyle(isDark: boolean) {
	if (typeof document === 'undefined') return;
	const meta = document.querySelector('meta[name="apple-mobile-web-app-status-bar-style"]');
	if (meta) {
		// Dark: black-translucent (light icons + content under status bar; --topbar-safe
		// already pads chrome). Light: default (dark icons on light top bar). Android no-op.
		meta.setAttribute('content', isDark ? 'black-translucent' : 'default');
	}
}

export async function applyAppearance(
	input: ApplyAppearanceInput,
	options: {
		target?: HTMLElement;
		dynamicColorAdapter?: WallpaperColorAdapter;
		signal?: AbortSignal;
	} = {}
): Promise<{ coursePalette: readonly CoursePaletteEntry[] }> {
	const target =
		options.target ?? (typeof document !== 'undefined' ? document.documentElement : undefined);
	const { wallpaperColorEnabled, isDark, wallpaperUri, themePaletteEntries } = input;
	const basePalette =
		!wallpaperColorEnabled && themePaletteEntries?.length
			? themePaletteEntries
			: COURSE_PALETTE_ENTRIES;
	const { dynamicColorAdapter, signal } = options;

	if (target) {
		target.classList.toggle('dark', isDark);
		target.style.colorScheme = isDark ? 'dark' : 'light';
		if (typeof document !== 'undefined' && target === document.documentElement) {
			syncThemeColorMeta(isDark);
			syncAppleStatusBarStyle(isDark);
		}
	}

	abortIfNeeded(signal);

	if (wallpaperColorEnabled && wallpaperUri && dynamicColorAdapter) {
		try {
			const { seed, coursePalette: wallpaperPalette } =
				await dynamicColorAdapter.extractWallpaperSeed(wallpaperUri);
			abortIfNeeded(signal);
			dynamicColorAdapter.paintWallpaperTheme(seed, isDark, target ?? document.documentElement);
			abortIfNeeded(signal);
			return { coursePalette: wallpaperPalette.length ? wallpaperPalette : basePalette };
		} catch (error) {
			if (signal?.aborted) throw error;
			dynamicColorAdapter.clearWallpaperTheme(target);
			return { coursePalette: basePalette };
		}
	}

	if (!wallpaperColorEnabled && themePaletteEntries && themePaletteEntries.length > 0) {
		dynamicColorAdapter?.clearWallpaperTheme(target);
		return { coursePalette: themePaletteEntries };
	}

	dynamicColorAdapter?.clearWallpaperTheme(target);
	return { coursePalette: basePalette };
}
