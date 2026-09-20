import { COURSE_PALETTE_ENTRIES, type CoursePaletteEntry } from '@chronos/core';
import type { CoursePaletteRef } from '$lib/services/course-presentation-port';
import { getAppEngine } from '$lib/services/app-engine';
import { createWallpaperThemeAdapter } from '$lib/wallpaper/wallpaper-theme';
import { applyAppearance, type ApplyAppearanceInput } from './apply-appearance';
import { applyActiveTheme } from './apply-active-theme';

export function createAppearance(paletteRef: CoursePaletteRef, onPaletteChanged?: () => void) {
	let coursePalette = $state.raw<readonly CoursePaletteEntry[]>(COURSE_PALETTE_ENTRIES);
	const adapter = createWallpaperThemeAdapter();
	let pending: AbortController | undefined;
	async function apply(input: ApplyAppearanceInput, signal?: AbortSignal) {
		if (typeof document === 'undefined') return;
		pending?.abort();
		const task = new AbortController();
		pending = task;
		const combined = signal ? AbortSignal.any([signal, task.signal]) : task.signal;
		combined.throwIfAborted();
		adapter.clearWallpaperTheme(document.documentElement);
		applyActiveTheme(getAppEngine(), input.activeThemeId, input.isDark);
		// Restore course colors with the base theme while the new image decodes.
		const basePalette = input.themePaletteEntries?.length
			? input.themePaletteEntries
			: COURSE_PALETTE_ENTRIES;
		coursePalette = basePalette;
		paletteRef.current = basePalette;
		onPaletteChanged?.();
		try {
			const result = await applyAppearance(input, {
				target: document.documentElement,
				dynamicColorAdapter: adapter,
				signal: combined
			});
			if (combined.aborted) return;
			coursePalette = result.coursePalette;
			paletteRef.current = result.coursePalette;
			onPaletteChanged?.();
		} catch (error) {
			if (!combined.aborted) throw error;
		}
	}
	function destroy() {
		pending?.abort();
		adapter.clearWallpaperTheme();
	}
	return {
		get coursePalette() {
			return coursePalette;
		},
		apply,
		destroy
	};
}
