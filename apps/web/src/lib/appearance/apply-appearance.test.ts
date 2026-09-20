import { describe, expect, it, vi, afterEach } from 'vite-plus/test';
import type { ThemeContribution } from '@chronos/core';
import { applyAppearance, type ApplyAppearanceInput } from './apply-appearance';

function target() {
	const values = new Map<string, string>();
	const el = {
		classList: { toggle: vi.fn() },
		style: { colorScheme: '', setProperty: (key: string, value: string) => values.set(key, value) }
	} as unknown as HTMLElement;
	return { el, values };
}
const palette = [{ background: '#123456', foreground: '#ffffff' }];
function input(
	resolveWallpaperColors?: ThemeContribution['resolveWallpaperColors']
): ApplyAppearanceInput {
	return {
		wallpaperColorEnabled: true,
		isDark: false,
		wallpaperUri: 'blob:wallpaper',
		activeThemeId: 'non-m3',
		themePaletteEntries: palette,
		theme: {
			id: 'non-m3',
			name: 'Custom',
			workbenchColors: { light: {}, dark: {} },
			resolveWallpaperColors
		}
	};
}
const readPixels = async () => new Uint8ClampedArray([255, 0, 0, 255]);
afterEach(() => vi.unstubAllGlobals());
describe('theme-owned wallpaper colors', () => {
	it.each(['success', 'failure', 'cancel'])(
		'retains rendered colors until replacement settles: %s',
		async (outcome) => {
			const { el, values } = target();
			values.set('--color-primary', '#112233');
			const pending = Promise.withResolvers<{ workbenchColors: Record<string, string> }>();
			const started = Promise.withResolvers<void>();
			const ac = new AbortController();
			const applyBaseTheme = vi.fn(() => values.set('--color-primary', '#445566'));
			const task = applyAppearance(
				input(() => {
					started.resolve();
					return pending.promise;
				}),
				{ target: el, readPixels, signal: ac.signal, applyBaseTheme }
			);
			await started.promise;
			expect(values.get('--color-primary')).toBe('#112233');
			expect(applyBaseTheme).not.toHaveBeenCalled();
			if (outcome === 'cancel') ac.abort();
			if (outcome === 'failure') pending.reject(new Error('failed'));
			else pending.resolve({ workbenchColors: { 'color.primary': '#778899' } });
			if (outcome === 'cancel') {
				await expect(task).rejects.toMatchObject({ name: 'AbortError' });
				expect(applyBaseTheme).not.toHaveBeenCalled();
				expect(values.get('--color-primary')).toBe('#112233');
			} else {
				await task;
				expect(applyBaseTheme).toHaveBeenCalledTimes(1);
				expect(values.get('--color-primary')).toBe(outcome === 'success' ? '#778899' : '#445566');
			}
		}
	);

	it('uses a non-M3 theme and preserves its palette when no dynamic palette is returned', async () => {
		const { el, values } = target();
		const resolver = vi.fn(() => ({ workbenchColors: { 'color.primary': '#abcdef' } }));
		const result = await applyAppearance(input(resolver), { target: el, readPixels });
		expect(values.get('--color-primary')).toBe('#abcdef');
		expect(result.coursePalette).toEqual(palette);
		expect(resolver).toHaveBeenCalledWith(
			expect.objectContaining({ mode: 'light', pixels: await readPixels() })
		);
	});
	it.each([
		'missing-image',
		'disabled',
		'no-capability',
		'decode-failure',
		'plugin-failure',
		'invalid-result'
	])('keeps the selected theme base for %s', async (kind) => {
		const { el, values } = target();
		const resolver = vi.fn(() => {
			if (kind === 'plugin-failure') throw new Error('plugin failed');
			return { workbenchColors: { 'unknown.color': 'red' } };
		});
		const state = input(kind === 'no-capability' ? undefined : resolver);
		if (kind === 'missing-image') state.wallpaperUri = null;
		if (kind === 'disabled') state.wallpaperColorEnabled = false;
		const result = await applyAppearance(state, {
			target: el,
			readPixels:
				kind === 'decode-failure'
					? async () => {
							throw new Error('decode failed');
						}
					: readPixels
		});
		expect(result.coursePalette).toEqual(palette);
		expect(values.size).toBe(0);
	});
	it.each(['cancel', 'replace'])('does not commit a late result after %s', async (kind) => {
		const { el, values } = target();
		const pending = Promise.withResolvers<{ workbenchColors: Record<string, string> }>();
		const started = Promise.withResolvers<void>();
		const ac = new AbortController();
		let current = true;
		const task = applyAppearance(
			input(() => {
				started.resolve();
				return pending.promise;
			}),
			{ target: el, readPixels, signal: ac.signal, isCurrent: () => current }
		);
		await started.promise;
		if (kind === 'cancel') ac.abort();
		else current = false;
		pending.resolve({ workbenchColors: { 'color.primary': '#ff0000' } });
		await expect(task).rejects.toMatchObject({ name: 'AbortError' });
		expect(values.size).toBe(0);
	});
	it('applies a dynamic course palette and derives browser chrome from theme colors', async () => {
		const { el } = target();
		const meta = { setAttribute: vi.fn() };
		vi.stubGlobal('document', { documentElement: el, querySelector: () => meta });
		vi.stubGlobal('getComputedStyle', () => ({ getPropertyValue: () => '#abcdef' }));
		const dynamic = [{ background: '#abc', foreground: '#123' }];
		const result = await applyAppearance(
			input(() => ({ workbenchColors: { 'color.surface': '#abcdef' }, coursePalette: dynamic })),
			{ target: el, readPixels }
		);
		expect(result.coursePalette).toEqual(dynamic);
		expect(meta.setAttribute).toHaveBeenCalledWith('content', '#abcdef');
	});
});
