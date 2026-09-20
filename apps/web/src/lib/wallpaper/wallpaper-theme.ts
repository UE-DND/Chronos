import type { CoursePaletteEntry } from '@chronos/core';
import {
	colorsFromImageBytes,
	coursePaletteFromSources,
	schemeAccentCssVars
} from '@chronos/ui-kit/theme/m3-theme';

export interface WallpaperColorAdapter {
	extractWallpaperSeed(
		uri: string
	): Promise<{ seed: number; coursePalette: readonly CoursePaletteEntry[] }>;
	paintWallpaperTheme(seed: number, isDark: boolean, target: HTMLElement): void;
	clearWallpaperTheme(target?: HTMLElement): void;
}

const MAX_EDGE = 128;

export { colorsFromImageBytes } from '@chronos/ui-kit/theme/m3-theme';
/** Host-owned extraction cache and dynamic CSS overlay. */
export function createWallpaperThemeAdapter(): WallpaperColorAdapter {
	let appliedKeys: string[] = [];
	let cachedUri: string | null = null;
	let cachedSeed: number | null = null;
	let cachedRanked: number[] | null = null;

	function resolveTarget(target?: HTMLElement): HTMLElement | undefined {
		return target ?? (typeof document !== 'undefined' ? document.documentElement : undefined);
	}

	function clear(target?: HTMLElement): void {
		const el = resolveTarget(target);
		if (!el) return;
		for (const key of appliedKeys) {
			el.style.removeProperty(key);
		}
		appliedKeys = [];
	}

	async function extractSeed(
		uri: string
	): Promise<{ seed: number; coursePalette: readonly CoursePaletteEntry[] }> {
		if (uri !== cachedUri || cachedSeed == null || cachedRanked == null) {
			const { seed, ranked } = colorsFromImageBytes(await downsampleImageBytes(uri));
			cachedUri = uri;
			cachedSeed = seed;
			cachedRanked = ranked;
		}
		return { seed: cachedSeed, coursePalette: coursePaletteFromSources(cachedRanked) };
	}

	function paint(seed: number, isDark: boolean, target?: HTMLElement): void {
		const el = resolveTarget(target);
		if (!el) return;
		const vars = schemeAccentCssVars(seed, isDark);
		clear(el);
		appliedKeys = Object.keys(vars);
		for (const [key, value] of Object.entries(vars)) {
			el.style.setProperty(key, value);
		}
	}

	return {
		extractWallpaperSeed: extractSeed,
		paintWallpaperTheme: paint,
		clearWallpaperTheme: clear
	};
}

async function downsampleImageBytes(uri: string): Promise<Uint8ClampedArray> {
	const image = new Image();
	image.src = uri;
	await image.decode();
	const naturalWidth = image.naturalWidth || image.width;
	const naturalHeight = image.naturalHeight || image.height;
	const scale = Math.min(1, MAX_EDGE / Math.max(naturalWidth, naturalHeight, 1));
	const width = Math.max(1, Math.round(naturalWidth * scale));
	const height = Math.max(1, Math.round(naturalHeight * scale));
	const canvas = document.createElement('canvas');
	canvas.width = width;
	canvas.height = height;
	const context = canvas.getContext('2d');
	if (!context) throw new Error('Could not get canvas context');
	context.drawImage(image, 0, 0, width, height);
	return context.getImageData(0, 0, width, height).data;
}
