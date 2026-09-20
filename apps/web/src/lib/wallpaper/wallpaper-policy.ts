import { type WallpaperSource } from '@chronos/core';

export function resolveWallpaper(
	source: WallpaperSource,
	custom: Blob | null,
	theme?: Blob
): Blob | null {
	return source === 'custom' ? custom : source === 'theme' ? (theme ?? null) : null;
}
