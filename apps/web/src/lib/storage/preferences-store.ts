/** Dexie-backed user preference keys and read/write helpers for the web app. */
import type {
	AppLocale,
	CapsuleCornerStyle,
	WallpaperSource,
	ThemeMode,
	TimetableLayoutMode,
	UserPreferences
} from '@chronos/core';
import {
	CURRENT_PREFERENCES_SCHEMA_VERSION,
	DEFAULT_USER_PREFERENCES,
	PREFERENCE_STORAGE_KEYS
} from '@chronos/core';

export const SETTINGS_KEYS = PREFERENCE_STORAGE_KEYS;

function normalizeThemeMode(raw: string | null): ThemeMode {
	const value = raw?.trim().toLowerCase();
	if (value === 'light' || value === 'dark') return value;
	return 'auto';
}

function normalizeLayoutMode(raw: string | null): TimetableLayoutMode {
	const value = raw?.trim().toLowerCase();
	if (value === 'compact') return 'compact';
	if (value === 'fixed') return 'fixed';
	return DEFAULT_USER_PREFERENCES.timetableLayoutMode;
}

function normalizeWallpaperSource(raw: string | null): WallpaperSource {
	if (raw === 'custom' || raw === 'none' || raw === 'theme') return raw;
	return DEFAULT_USER_PREFERENCES.wallpaperSource;
}

function normalizeCornerStyle(raw: string | null): CapsuleCornerStyle {
	const value = raw?.trim().toLowerCase();
	if (value === 'rounded') return 'rounded';
	if (value === 'sharp') return 'sharp';
	if (value === 'pill') return 'pill';
	return DEFAULT_USER_PREFERENCES.capsuleCornerStyle;
}

function normalizeLocale(raw: string | null): AppLocale | undefined {
	if (raw?.toLowerCase() === 'en') return 'en';
	if (raw?.toLowerCase() === 'zh-cn') return 'zh-cn';
	return undefined;
}

/** Reads and normalizes user preferences from localStorage. */
export class PreferencesStore {
	constructor(private localStore: Storage | null) {}

	async getActiveTimetableId(): Promise<string | null> {
		if (!this.localStore) return null;
		return this.localStore.getItem(SETTINGS_KEYS.currentTimetableId);
	}

	async setActiveTimetableId(id: string): Promise<void> {
		if (!this.localStore) return;
		if (id) {
			this.localStore.setItem(SETTINGS_KEYS.currentTimetableId, id);
		} else {
			this.localStore.removeItem(SETTINGS_KEYS.currentTimetableId);
		}
	}

	async getPreferences(): Promise<UserPreferences> {
		if (!this.localStore) return { ...DEFAULT_USER_PREFERENCES };

		const themeMode = normalizeThemeMode(this.localStore.getItem(SETTINGS_KEYS.themeMode));
		const timetableLayoutMode = normalizeLayoutMode(
			this.localStore.getItem(SETTINGS_KEYS.timetableLayoutMode)
		);
		const wallpaperSource = normalizeWallpaperSource(
			this.localStore.getItem(SETTINGS_KEYS.wallpaperSource)
		);
		const wallpaperColorEnabled =
			this.localStore.getItem(SETTINGS_KEYS.wallpaperColorEnabled) === 'true';
		const wallpaperMaskRaw = this.localStore.getItem(SETTINGS_KEYS.wallpaperMaskEnabled);
		const wallpaperMaskEnabled =
			wallpaperMaskRaw === null
				? DEFAULT_USER_PREFERENCES.wallpaperMaskEnabled
				: wallpaperMaskRaw === 'true';
		const capsuleCornerStyle = normalizeCornerStyle(
			this.localStore.getItem(SETTINGS_KEYS.capsuleCornerStyle)
		);
		const hapticRaw = this.localStore.getItem(SETTINGS_KEYS.hapticFeedbackEnabled);
		const hapticFeedbackEnabled =
			hapticRaw === null ? DEFAULT_USER_PREFERENCES.hapticFeedbackEnabled : hapticRaw === '1';
		const reduceMotionRaw = this.localStore.getItem(SETTINGS_KEYS.reduceMotionEnabled);
		const reduceMotionEnabled = reduceMotionRaw === '1';
		const periodHighlightRaw = this.localStore.getItem(SETTINGS_KEYS.currentPeriodHighlightEnabled);
		const currentPeriodHighlightEnabled = periodHighlightRaw === '1';
		const visualThemeId = this.localStore.getItem(SETTINGS_KEYS.visualThemeId)?.trim() || undefined;
		const locale = normalizeLocale(this.localStore.getItem(SETTINGS_KEYS.locale));

		return {
			schemaVersion: CURRENT_PREFERENCES_SCHEMA_VERSION,
			themeMode,
			wallpaperSource,
			wallpaperColorEnabled,
			wallpaperMaskEnabled,
			timetableLayoutMode,
			capsuleCornerStyle,
			hapticFeedbackEnabled,
			reduceMotionEnabled,
			currentPeriodHighlightEnabled,
			visualThemeId,
			...(locale ? { locale } : {})
		};
	}

	async savePreferences(patch: Partial<UserPreferences>): Promise<void> {
		if (!this.localStore) return;

		if (patch.themeMode !== undefined) {
			this.localStore.setItem(SETTINGS_KEYS.themeMode, patch.themeMode);
		}
		if (patch.timetableLayoutMode !== undefined) {
			this.localStore.setItem(SETTINGS_KEYS.timetableLayoutMode, patch.timetableLayoutMode);
		}
		if (patch.wallpaperSource !== undefined) {
			this.localStore.setItem(SETTINGS_KEYS.wallpaperSource, patch.wallpaperSource);
		}
		if (patch.wallpaperColorEnabled !== undefined) {
			this.localStore.setItem(
				SETTINGS_KEYS.wallpaperColorEnabled,
				String(patch.wallpaperColorEnabled)
			);
		}
		if (patch.wallpaperMaskEnabled !== undefined) {
			this.localStore.setItem(
				SETTINGS_KEYS.wallpaperMaskEnabled,
				String(patch.wallpaperMaskEnabled)
			);
		}
		if (patch.capsuleCornerStyle !== undefined) {
			this.localStore.setItem(SETTINGS_KEYS.capsuleCornerStyle, patch.capsuleCornerStyle);
		}
		if (patch.hapticFeedbackEnabled !== undefined) {
			this.localStore.setItem(
				SETTINGS_KEYS.hapticFeedbackEnabled,
				patch.hapticFeedbackEnabled ? '1' : '0'
			);
		}
		if (patch.reduceMotionEnabled !== undefined) {
			this.localStore.setItem(
				SETTINGS_KEYS.reduceMotionEnabled,
				patch.reduceMotionEnabled ? '1' : '0'
			);
		}
		if (patch.currentPeriodHighlightEnabled !== undefined) {
			this.localStore.setItem(
				SETTINGS_KEYS.currentPeriodHighlightEnabled,
				patch.currentPeriodHighlightEnabled ? '1' : '0'
			);
		}
		if (patch.visualThemeId !== undefined) {
			this.localStore.setItem(SETTINGS_KEYS.visualThemeId, patch.visualThemeId);
		}
		if (patch.locale !== undefined) {
			this.localStore.setItem(SETTINGS_KEYS.locale, patch.locale);
		}
	}
}
