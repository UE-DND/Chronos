import { afterEach, expect, it, vi } from 'vite-plus/test';
import type { ThemeContribution } from '@chronos/core';
import { createAppearance } from './appearance.svelte';
import { applyActiveTheme } from './apply-active-theme';

const runtime = vi.hoisted(() => ({ theme: undefined as ThemeContribution | undefined }));
vi.mock('$lib/services/app-engine', () => ({
	getAppEngine: () => ({ themes: { getTheme: () => runtime.theme } })
}));
vi.mock('$lib/wallpaper/wallpaper-theme', () => ({
	createWallpaperPixelReader: () => async () => new Uint8ClampedArray([255, 0, 0, 255])
}));
vi.mock('./apply-active-theme', () => ({ applyActiveTheme: vi.fn() }));
afterEach(() => {
	vi.unstubAllGlobals();
	vi.clearAllMocks();
});

it('retains rendered colors and course palette across an absent and then pending theme instance', async () => {
	const values = new Map<string, string>();
	vi.stubGlobal('document', {
		documentElement: {
			classList: { toggle: vi.fn() },
			style: { setProperty: (key: string, value: string) => values.set(key, value) }
		},
		querySelector: () => null
	});
	vi.stubGlobal('getComputedStyle', () => ({ getPropertyValue: () => '' }));
	const palette = [{ background: '#123456', foreground: '#ffffff' }];
	const nextPalette = [{ background: '#abcdef', foreground: '#000000' }];
	const ref = { current: palette };
	const appearance = createAppearance(ref);
	const state = {
		activeThemeId: 'default',
		isDark: false,
		wallpaperColorEnabled: true,
		wallpaperUri: 'blob:custom'
	};
	runtime.theme = {
		id: 'default',
		name: 'Default',
		workbenchColors: { light: {}, dark: {} },
		resolveWallpaperColors: () => ({
			workbenchColors: { 'color.primary': '#123456' },
			coursePalette: palette
		})
	};
	await appearance.apply({ ...state, theme: runtime.theme });
	vi.mocked(applyActiveTheme).mockClear();
	runtime.theme = undefined;
	await appearance.apply(state);
	expect(ref.current).toEqual(palette);
	expect(values.get('--color-primary')).toBe('#123456');
	expect(applyActiveTheme).not.toHaveBeenCalled();
	const pending = Promise.withResolvers<{
		workbenchColors: Record<string, string>;
		coursePalette: typeof palette;
	}>();
	const started = Promise.withResolvers<void>();
	runtime.theme = {
		id: 'default',
		name: 'Replacement',
		workbenchColors: { light: {}, dark: {} },
		resolveWallpaperColors: () => {
			started.resolve();
			return pending.promise;
		}
	};
	const task = appearance.apply({ ...state, theme: runtime.theme });
	await started.promise;
	expect(ref.current).toEqual(palette);
	expect(applyActiveTheme).not.toHaveBeenCalled();
	pending.resolve({ workbenchColors: { 'color.primary': '#abcdef' }, coursePalette: nextPalette });
	await task;
	expect(applyActiveTheme).toHaveBeenCalledTimes(1);
	expect(values.get('--color-primary')).toBe('#abcdef');
	expect(ref.current).toEqual(nextPalette);
	appearance.destroy();
});
