import { DEFAULT_VISUAL_THEME_ID } from '../theme/theme-defaults';

export type ThemeMode = 'light' | 'dark' | 'auto';
export type AppLocale = 'zh-cn' | 'en';
export type WallpaperSource = 'custom' | 'theme' | 'none';

export type TimetableLayoutMode = 'fixed' | 'compact';
export type CapsuleCornerStyle = 'rounded' | 'sharp' | 'pill';

export const CURRENT_PREFERENCES_SCHEMA_VERSION = 1;

export const PREFERENCE_STORAGE_KEYS = {
	currentTimetableId: 'chronos_preferences:current_timetable_id',
	themeMode: 'chronos_preferences:theme_mode',
	timetableLayoutMode: 'chronos_preferences:timetable_layout_mode',
	wallpaperSource: 'chronos_preferences:wallpaper_source',
	wallpaperColorEnabled: 'chronos_preferences:wallpaper_color_enabled',
	capsuleCornerStyle: 'chronos_preferences:capsule_corner_style',
	hapticFeedbackEnabled: 'chronos_preferences:haptic_feedback_enabled',
	reduceMotionEnabled: 'chronos_preferences:reduce_motion_enabled',
	currentPeriodHighlightEnabled: 'chronos_preferences:current_period_highlight_enabled',
	visualThemeId: 'chronos_preferences:visual_theme_id',
	locale: 'chronos_preferences:locale'
} as const;

export interface UserPreferences {
	schemaVersion: number;
	themeMode: ThemeMode;
	wallpaperSource: WallpaperSource;
	wallpaperColorEnabled: boolean;
	timetableLayoutMode: TimetableLayoutMode;
	capsuleCornerStyle: CapsuleCornerStyle;
	hapticFeedbackEnabled: boolean;
	reduceMotionEnabled: boolean;
	currentPeriodHighlightEnabled: boolean;
	/** Active visual theme id (e.g. m3-default, yumemita). */
	visualThemeId?: string;
	/** UI locale (zh-cn | en). */
	locale?: AppLocale;
	customMetadata?: Record<string, unknown>;
}

export const DEFAULT_USER_PREFERENCES: UserPreferences = {
	schemaVersion: CURRENT_PREFERENCES_SCHEMA_VERSION,
	themeMode: 'auto',
	wallpaperSource: 'theme',
	wallpaperColorEnabled: false,
	timetableLayoutMode: 'compact',
	capsuleCornerStyle: 'sharp',
	hapticFeedbackEnabled: true,
	reduceMotionEnabled: false,
	currentPeriodHighlightEnabled: false,
	visualThemeId: DEFAULT_VISUAL_THEME_ID
};
