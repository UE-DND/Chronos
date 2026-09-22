import { createAppearance } from '$lib/appearance/appearance.svelte';
import { createWallpaperController } from '$lib/wallpaper/wallpaper-controller.svelte';
import { hostT } from '$lib/i18n/host-i18n.svelte';
import { pwaInstallController } from '$lib/client/pwa-install.svelte';
import {
	getAppController,
	getAppEngine,
	getSharedCoursePaletteRef,
	notifyCoursePaletteChanged,
	resetAppToInitialState
} from '$lib/services/app-engine';
import {
	DEFAULT_USER_PREFERENCES,
	type CapsuleCornerStyle,
	type ThemeMode,
	type TimetableLayoutMode,
	type UserPreferences
} from '@chronos/core';
import { applyReduceMotionClass } from '@chronos/ui-kit';
import { untrack } from 'svelte';

function resolveDark(themeMode: ThemeMode, systemPrefersDark: boolean): boolean {
	if (themeMode === 'dark') return true;
	if (themeMode === 'light') return false;
	return systemPrefersDark;
}

export function createAppShell() {
	let systemPrefersDark = $state(false);
	let compactLandscape = $state(false);
	let mediaQueryCleanup: (() => void) | null = null;
	let landscapeQueryCleanup: (() => void) | null = null;
	let disposeAppearanceEffects: (() => void) | null = null;
	const wallpaper = createWallpaperController();
	const wallpaperUri = $derived(wallpaper.state.uri);
	const appearance = createAppearance(getSharedCoursePaletteRef(), notifyCoursePaletteChanged);
	const controller = getAppController();
	const engine = getAppEngine();

	const themeMode = $derived(controller.userPreferences?.themeMode ?? 'auto');
	const isDark = $derived(resolveDark(themeMode, systemPrefersDark));
	const effectiveTimetableLayoutMode = $derived<TimetableLayoutMode>(
		compactLandscape ? 'fixed' : (controller.userPreferences?.timetableLayoutMode ?? 'compact')
	);

	const initialized = $derived(
		Boolean(
			controller.userPreferences !== null ||
			controller.currentTimetable !== null ||
			controller.timetables.length > 0
		)
	);
	const hasWallpaper = $derived(Boolean(wallpaperUri));
	const wallpaperMaskEnabled = $derived(
		controller.userPreferences?.wallpaperMaskEnabled ??
			DEFAULT_USER_PREFERENCES.wallpaperMaskEnabled
	);
	function canUseWallpaperColors(
		themeId: string | null,
		source: UserPreferences['wallpaperSource'] | undefined
	): boolean | undefined {
		if (!themeId || !engine.defaultThemeId) return undefined;
		if (themeId !== engine.defaultThemeId || source !== 'custom') return false;
		const theme = engine.themes.getTheme(themeId);
		return theme ? Boolean(theme.resolveWallpaperColors) : undefined;
	}

	const wallpaperColorsAvailable = $derived.by(() => {
		void controller.slotVersion;
		return (
			canUseWallpaperColors(
				controller.activeThemeId,
				controller.userPreferences?.wallpaperSource
			) === true
		);
	});

	function init() {
		if (typeof window !== 'undefined' && !mediaQueryCleanup) {
			const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
			systemPrefersDark = mediaQuery.matches;
			const onChange = (event: MediaQueryListEvent) => {
				systemPrefersDark = event.matches;
			};
			mediaQuery.addEventListener('change', onChange);
			mediaQueryCleanup = () => mediaQuery.removeEventListener('change', onChange);
		}
		if (typeof window !== 'undefined' && !landscapeQueryCleanup) {
			const mediaQuery = window.matchMedia('(orientation: landscape) and (max-height: 500px)');
			compactLandscape = mediaQuery.matches;
			const onChange = (event: MediaQueryListEvent) => {
				compactLandscape = event.matches;
			};
			mediaQuery.addEventListener('change', onChange);
			landscapeQueryCleanup = () => mediaQuery.removeEventListener('change', onChange);
		}

		wallpaper.init(() => engine.notify(hostT('wallpaper.screen.error.importFailed'), 'error'));

		// The appearance pipeline lives here (not in platform-bootstrap): this
		// controller already owns engine/theme/preference reactivity, so the
		// effects read their inputs locally instead of being relayed across
		// controllers.
		disposeAppearanceEffects?.();
		disposeAppearanceEffects = $effect.root(() => {
			$effect(() => {
				void controller.slotVersion;
				const themeId = engine.resolveThemeId(controller.userPreferences?.visualThemeId);
				untrack(() => {
					if (engine.state.activeThemeId !== themeId) engine.setTheme(themeId);
				});
			});
			$effect(() => {
				void controller.slotVersion;
				const theme = engine.themes.getTheme(controller.activeThemeId);
				const source =
					controller.userPreferences?.wallpaperSource ?? DEFAULT_USER_PREFERENCES.wallpaperSource;
				untrack(() => wallpaper.select(source, theme?.wallpaper));
			});
			$effect(() => {
				const available = wallpaperColorsAvailable;
				const enabled = controller.userPreferences?.wallpaperColorEnabled;
				// Wait for profile assembly before correcting restored preferences.
				if (
					controller.activeThemeId &&
					engine.themes.getTheme(controller.activeThemeId) &&
					engine.defaultThemeId &&
					enabled &&
					!available
				) {
					untrack(
						() =>
							void updatePreferences({ wallpaperColorEnabled: false }).catch(() => {
								controller.notify(hostT('wallpaper.settings.saveFailed'), 'error');
							})
					);
				}
			});
			$effect(() => {
				const dark = isDark;
				void controller.slotVersion;
				const wallpaperColorEnabled =
					wallpaperColorsAvailable && (controller.userPreferences?.wallpaperColorEnabled ?? false);
				const activeThemeId = controller.activeThemeId;

				const theme = engine.themes.getTheme(activeThemeId);
				const mode = dark ? 'dark' : 'light';
				const themePaletteEntries =
					typeof theme?.paletteEntries === 'function'
						? theme.paletteEntries(mode)
						: (theme?.paletteEntries ?? null);

				const ac = new AbortController();
				const input = {
					isDark: dark,
					wallpaperColorEnabled,
					wallpaperUri,
					activeThemeId,
					themePaletteEntries,
					theme
				};
				untrack(() => void appearance.apply(input, ac.signal));
				return () => ac.abort();
			});

			$effect(() => {
				const reduceMotionEnabled = controller.userPreferences?.reduceMotionEnabled ?? false;
				applyReduceMotionClass(reduceMotionEnabled);
			});

			$effect(() => {
				const mask = wallpaperMaskEnabled;
				if (typeof document !== 'undefined') {
					document.documentElement.dataset.wallpaperMask = mask ? 'true' : 'false';
				}
			});
		});
	}

	function destroy() {
		mediaQueryCleanup?.();
		mediaQueryCleanup = null;
		landscapeQueryCleanup?.();
		landscapeQueryCleanup = null;
		wallpaper.destroy();
		appearance.destroy();
		disposeAppearanceEffects?.();
		disposeAppearanceEffects = null;
		if (typeof document !== 'undefined') {
			delete document.documentElement.dataset.wallpaperMask;
		}
	}

	async function updatePreferences(patch: Partial<UserPreferences>) {
		const themeId = patch.visualThemeId ?? controller.activeThemeId;
		const source = patch.wallpaperSource ?? controller.userPreferences?.wallpaperSource;
		const enabled =
			patch.wallpaperColorEnabled ?? controller.userPreferences?.wallpaperColorEnabled;
		await controller.updatePreferences(
			enabled && canUseWallpaperColors(themeId, source) === false
				? { ...patch, wallpaperColorEnabled: false }
				: patch
		);
	}

	async function setVisualTheme(themeId: string) {
		if (!engine.themes.isSelectable(themeId)) return;
		controller.setTheme(themeId);
		const theme = engine.themes.getTheme(themeId);
		const wallpaperSource =
			themeId !== engine.defaultThemeId && theme?.wallpaper ? 'theme' : 'none';
		await updatePreferences({ visualThemeId: themeId, wallpaperSource });
	}

	async function setWallpaperMaskEnabled(enabled: boolean) {
		await updatePreferences({ wallpaperMaskEnabled: enabled });
	}

	async function setThemeMode(mode: ThemeMode) {
		await updatePreferences({ themeMode: mode });
	}

	async function setTimetableLayoutMode(mode: TimetableLayoutMode) {
		if (compactLandscape && mode === 'compact') return;
		await updatePreferences({ timetableLayoutMode: mode });
	}

	async function setCapsuleCornerStyle(style: CapsuleCornerStyle) {
		await updatePreferences({ capsuleCornerStyle: style });
	}

	async function setHapticFeedbackEnabled(enabled: boolean) {
		await updatePreferences({ hapticFeedbackEnabled: enabled });
	}

	async function setReduceMotionEnabled(enabled: boolean) {
		await updatePreferences({ reduceMotionEnabled: enabled });
	}

	async function setCurrentPeriodHighlightEnabled(enabled: boolean) {
		await updatePreferences({ currentPeriodHighlightEnabled: enabled });
	}

	async function switchTimetable(id: string) {
		await controller.switchTimetable(id);
	}

	async function deleteTimetable(id: string) {
		await controller.deleteTimetable(id);
	}

	async function clearAllData() {
		await resetAppToInitialState();
		await wallpaper.clear();
		// localStorage chronos:* keys are wiped by storage; drop in-memory PWA flags too.
		pwaInstallController.resetInstalledFlag();
		pwaInstallController.dismiss({ track: false });
	}

	return {
		get state() {
			return {
				initialized,
				isDark,
				compactLandscape,
				effectiveTimetableLayoutMode,
				hasWallpaper,
				wallpaperColorsAvailable,
				wallpaperMaskEnabled,
				wallpaperUri
			};
		},
		get appearance() {
			return appearance;
		},
		get controller() {
			return controller;
		},
		wallpaper,
		init,
		destroy,
		updatePreferences,
		setThemeMode,
		setVisualTheme,
		setWallpaperMaskEnabled,
		setTimetableLayoutMode,
		setCapsuleCornerStyle,
		setHapticFeedbackEnabled,
		setReduceMotionEnabled,
		setCurrentPeriodHighlightEnabled,
		switchTimetable,
		deleteTimetable,
		clearAllData
	};
}

export type AppShellController = ReturnType<typeof createAppShell>;
