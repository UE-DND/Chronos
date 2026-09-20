import type { CoursePaletteEntry } from '../algorithms/palette';
import type { LocalizedText } from './slots';

export type { CoursePaint, CourseBadgeSlotContribution } from './slots';

export interface ThemeWorkbenchColors {
	light: Record<string, string>;
	dark: Record<string, string>;
}

export interface WallpaperColors {
	workbenchColors: Record<string, string>;
	coursePalette?: readonly CoursePaletteEntry[];
}

export interface ThemeContribution {
	readonly resolveWallpaperColors?: (input: {
		pixels: Uint8ClampedArray;
		mode: 'light' | 'dark';
		signal: AbortSignal;
	}) => WallpaperColors | Promise<WallpaperColors>;

	readonly id: string;
	readonly name: LocalizedText;
	readonly description?: LocalizedText;
	readonly disabled?: boolean | (() => boolean);
	/** Optional decoded image asset; the host owns its display and object URL. */
	readonly wallpaper?: Blob;
	readonly className?: string;
	readonly workbenchColors: ThemeWorkbenchColors;
	readonly recommendedIconTheme?: string;
	readonly paletteEntries?:
		| readonly CoursePaletteEntry[]
		| ((mode: 'light' | 'dark') => readonly CoursePaletteEntry[]);
}
