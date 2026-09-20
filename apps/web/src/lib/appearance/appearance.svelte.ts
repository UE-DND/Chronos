import { COURSE_PALETTE_ENTRIES, type CoursePaletteEntry } from '@chronos/core';
import type { CoursePaletteRef } from '$lib/services/course-presentation-port';
import { getAppEngine } from '$lib/services/app-engine';
import { createWallpaperPixelReader } from '$lib/wallpaper/wallpaper-theme';
import { applyAppearance, type ApplyAppearanceInput } from './apply-appearance';
import { applyActiveTheme } from './apply-active-theme';

export function createAppearance(paletteRef: CoursePaletteRef, onPaletteChanged?: () => void) {
	let coursePalette = $state.raw<readonly CoursePaletteEntry[]>(COURSE_PALETTE_ENTRIES);
	const readPixels = createWallpaperPixelReader();
	let pending: AbortController | undefined;
	async function apply(input: ApplyAppearanceInput, signal?: AbortSignal) {
		if (typeof document === 'undefined') return;
		pending?.abort();
		const task = new AbortController();
		pending = task;
		const combined = signal ? AbortSignal.any([signal, task.signal]) : task.signal;
		combined.throwIfAborted();
		// A missing selected instance is a temporary replacement gap.
		if (input.activeThemeId && !input.theme) return;
		try {
			const result = await applyAppearance(input, {
				target: document.documentElement,
				readPixels,
				applyBaseTheme: () => applyActiveTheme(getAppEngine(), input.activeThemeId, input.isDark),
				isCurrent: () => getAppEngine().themes.getTheme(input.activeThemeId) === input.theme,
				signal: combined
			});
			if (combined.aborted) return;
			coursePalette = result.coursePalette;
			paletteRef.current = result.coursePalette;
			onPaletteChanged?.();
		} catch (error) {
			if (!combined.aborted && !(error instanceof DOMException && error.name === 'AbortError'))
				throw error;
		}
	}
	function destroy() {
		pending?.abort();
	}
	return {
		get coursePalette() {
			return coursePalette;
		},
		apply,
		destroy
	};
}
