import type { ChronosEngine, UserPreferences, ThemeContribution } from '@chronos/core';
import type { createWallpaperController } from '#lib/wallpaper/wallpaper-controller.svelte.ts';

export function canUseWallpaperColors(
	engine: ChronosEngine,
	themeId: string | null,
	source: UserPreferences['wallpaperSource'] | undefined
): boolean | undefined {
	if (!themeId || !engine.defaultThemeId) return undefined;
	if (themeId !== engine.defaultThemeId || source !== 'custom') return false;
	const theme = engine.themes.getTheme(themeId);
	return theme ? Boolean(theme.resolveWallpaperColors) : undefined;
}

export interface AppearanceSelection {
	activeThemeId: string | null;
	theme: ThemeContribution | undefined;
	wallpaperColorEnabled: boolean;
}

/** Select the theme, its wallpaper and valid preferences before applying one cancellable appearance update. */
export function coordinateAppearance(options: {
	engine: ChronosEngine;
	wallpaper: Pick<ReturnType<typeof createWallpaperController>, 'select'>;
	updatePreferences(patch: Partial<UserPreferences>): Promise<void>;
	apply(selection: AppearanceSelection, signal: AbortSignal): Promise<void>;
	onPreferenceError(error: unknown): void;
}) {
	const { engine, wallpaper } = options;
	let disposed = false;
	let queued = false;
	let resolvePreferredTheme = false;
	let applying: AbortController | undefined;

	function schedule(resolvePreferred: boolean) {
		resolvePreferredTheme ||= resolvePreferred;
		if (queued || disposed) return;
		queued = true;
		queueMicrotask(() => {
			if (disposed) return;
			if (resolvePreferredTheme) {
				resolvePreferredTheme = false;
				const themeId = engine.resolveThemeId(engine.state.userPreferences.visualThemeId);
				if (engine.state.activeThemeId !== themeId) engine.setTheme(themeId);
			}
			// A theme change emitted by this selection is already part of this update.
			queued = false;
			const { activeThemeId, userPreferences } = engine.state;
			const theme = engine.themes.getTheme(activeThemeId);
			wallpaper.select(userPreferences.wallpaperSource, theme?.wallpaper);
			const colorsAvailable = canUseWallpaperColors(
				engine,
				activeThemeId,
				userPreferences.wallpaperSource
			);
			if (
				theme &&
				engine.defaultThemeId &&
				userPreferences.wallpaperColorEnabled &&
				colorsAvailable === false
			) {
				void options
					.updatePreferences({ wallpaperColorEnabled: false })
					.catch((error) => options.onPreferenceError(error));
			}
			applying?.abort();
			applying = new AbortController();
			void options.apply(
				{
					activeThemeId,
					theme,
					wallpaperColorEnabled: colorsAvailable === true && userPreferences.wallpaperColorEnabled
				},
				applying.signal
			);
		});
	}

	const subscriptions = [
		engine.on('slots:updated', () => schedule(true)),
		engine.on('preferences:updated', () => schedule(true)),
		engine.on('theme:changed', () => schedule(false))
	];
	schedule(true);
	return {
		refresh: () => schedule(false),
		dispose() {
			disposed = true;
			applying?.abort();
			for (const subscription of subscriptions) subscription.dispose();
		}
	};
}
