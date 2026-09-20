import type { CoursePaletteEntry, ThemeContribution } from '@chronos/core';
import {
	COURSE_PALETTE_ENTRIES,
	validateWorkbenchColors,
	applyWorkbenchColors
} from '@chronos/core';

export type ApplyAppearanceInput = {
	wallpaperColorEnabled: boolean;
	isDark: boolean;
	wallpaperUri: string | null;
	activeThemeId: string | null;
	theme?: ThemeContribution;
	themePaletteEntries?: readonly CoursePaletteEntry[] | null;
};

export function syncThemeChrome(target: HTMLElement, isDark: boolean) {
	if (typeof document === 'undefined' || target !== document.documentElement) return;
	const color = getComputedStyle(target).getPropertyValue('--color-surface').trim();
	if (color) document.querySelector('meta[name="theme-color"]')?.setAttribute('content', color);
	document
		.querySelector('meta[name="apple-mobile-web-app-status-bar-style"]')
		?.setAttribute('content', isDark ? 'black-translucent' : 'default');
}

export async function applyAppearance(
	input: ApplyAppearanceInput,
	options: {
		target?: HTMLElement;
		readPixels?: (uri: string, signal: AbortSignal) => Promise<Uint8ClampedArray>;
		signal?: AbortSignal;
		isCurrent?: () => boolean;
	} = {}
): Promise<{ coursePalette: readonly CoursePaletteEntry[] }> {
	const target =
		options.target ?? (typeof document === 'undefined' ? undefined : document.documentElement);
	const signal = options.signal ?? new AbortController().signal;
	const basePalette = input.themePaletteEntries?.length
		? input.themePaletteEntries
		: COURSE_PALETTE_ENTRIES;
	const check = () => {
		signal.throwIfAborted();
		if (options.isCurrent && !options.isCurrent())
			throw new DOMException('Stale theme', 'AbortError');
	};
	check();
	if (target) {
		target.classList.toggle('dark', input.isDark);
		target.style.colorScheme = input.isDark ? 'dark' : 'light';
		syncThemeChrome(target, input.isDark);
	}
	if (
		!target ||
		!input.wallpaperColorEnabled ||
		!input.wallpaperUri ||
		!input.theme?.resolveWallpaperColors ||
		!options.readPixels
	)
		return { coursePalette: basePalette };
	try {
		const pixels = await options.readPixels(input.wallpaperUri, signal);
		check();
		const result = await input.theme.resolveWallpaperColors({
			pixels,
			mode: input.isDark ? 'dark' : 'light',
			signal
		});
		check();
		const validated = validateWorkbenchColors(result.workbenchColors);
		if (
			validated.errors.length ||
			validated.warnings.length ||
			!Object.keys(validated.colors).length
		)
			throw new Error('Invalid wallpaper colors');
		if (
			result.coursePalette?.some(
				(color) =>
					!color || typeof color.background !== 'string' || typeof color.foreground !== 'string'
			)
		)
			throw new Error('Invalid wallpaper course palette');
		applyWorkbenchColors(target, validated.colors);
		syncThemeChrome(target, input.isDark);
		return { coursePalette: result.coursePalette?.length ? result.coursePalette : basePalette };
	} catch (error) {
		check();
		console.warn('[appearance] Theme wallpaper colors failed', error);
		return { coursePalette: basePalette };
	}
}
