export type ThemeMode = 'light' | 'dark' | 'auto';
export type AppLocale = 'zh-cn' | 'en';
export type WallpaperSource = 'custom' | 'theme' | 'none';

export type TimetableLayoutMode = 'fixed' | 'compact';
export type CapsuleCornerStyle = 'rounded' | 'sharp' | 'pill';
export const FONT_SIZE_SCALE_OPTIONS = [0.9, 1, 1.15, 1.3] as const;
export type FontSizeScale = (typeof FONT_SIZE_SCALE_OPTIONS)[number];
export function isFontSizeScale(value: unknown): value is FontSizeScale {
	return FONT_SIZE_SCALE_OPTIONS.some((scale) => scale === value);
}

export const CURRENT_PREFERENCES_SCHEMA_VERSION = 1;

export const PREPARE_REMINDER_MINUTES_OPTIONS = [
	5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55, 60
] as const;

export function isPrepareReminderMinutes(value: unknown): value is number {
	return PREPARE_REMINDER_MINUTES_OPTIONS.some((minutes) => minutes === value);
}

export const PREFERENCE_STORAGE_KEYS = {
	currentTimetableId: 'chronos_preferences:current_timetable_id',
	themeMode: 'chronos_preferences:theme_mode',
	fontSizeScale: 'chronos_preferences:font_size_scale',
	timetableLayoutMode: 'chronos_preferences:timetable_layout_mode',
	wallpaperSource: 'chronos_preferences:wallpaper_source',
	wallpaperColorEnabled: 'chronos_preferences:wallpaper_color_enabled',
	wallpaperMaskEnabled: 'chronos_preferences:wallpaper_mask_enabled',
	capsuleCornerStyle: 'chronos_preferences:capsule_corner_style',
	hapticFeedbackEnabled: 'chronos_preferences:haptic_feedback_enabled',
	reduceMotionEnabled: 'chronos_preferences:reduce_motion_enabled',
	prepareReminderMinutes: 'chronos_preferences:prepare_reminder_minutes',
	classNotificationsEnabled: 'chronos_preferences:class_notifications_enabled',
	currentPeriodHighlightEnabled: 'chronos_preferences:current_period_highlight_enabled',
	visualThemeId: 'chronos_preferences:visual_theme_id',
	locale: 'chronos_preferences:locale'
} as const;

export interface UserPreferences {
	schemaVersion: number;
	themeMode: ThemeMode;
	fontSizeScale: FontSizeScale;
	wallpaperSource: WallpaperSource;
	wallpaperColorEnabled: boolean;
	wallpaperMaskEnabled: boolean;
	timetableLayoutMode: TimetableLayoutMode;
	capsuleCornerStyle: CapsuleCornerStyle;
	hapticFeedbackEnabled: boolean;
	reduceMotionEnabled: boolean;
	/** Minutes before class to show the preparing status (5–60, in steps of 5). */
	prepareReminderMinutes: number;
	/** Whether the host should send system notifications before classes. */
	classNotificationsEnabled: boolean;
	currentPeriodHighlightEnabled: boolean;
	/** Selected theme id; retained as wallpaper source in wallpaper color mode (e.g. m3-default, yumemita). */
	visualThemeId?: string;
	/** UI locale (zh-cn | en). */
	locale?: AppLocale;
	customMetadata?: Record<string, unknown>;
}

export const DEFAULT_USER_PREFERENCES: UserPreferences = {
	schemaVersion: CURRENT_PREFERENCES_SCHEMA_VERSION,
	themeMode: 'auto',
	fontSizeScale: 1,
	wallpaperSource: 'none',
	wallpaperColorEnabled: false,
	wallpaperMaskEnabled: true,
	timetableLayoutMode: 'compact',
	capsuleCornerStyle: 'sharp',
	hapticFeedbackEnabled: true,
	reduceMotionEnabled: false,
	prepareReminderMinutes: 30,
	classNotificationsEnabled: false,
	currentPeriodHighlightEnabled: false
};
