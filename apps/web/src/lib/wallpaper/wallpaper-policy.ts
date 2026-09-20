import { DEFAULT_VISUAL_THEME_ID, type WallpaperSource } from '@chronos/core';

export function resolveWallpaper(
	source: WallpaperSource,
	custom: Blob | null,
	theme?: Blob
): Blob | null {
	return source === 'custom' ? custom : source === 'theme' ? (theme ?? null) : null;
}

export function canUseWallpaperColors(themeId: string, enabled: boolean): boolean {
	return themeId === DEFAULT_VISUAL_THEME_ID && enabled;
}
