import { describe, expect, it } from 'vite-plus/test';
import { isShellWallpaperRevealed } from './shell-wallpaper';

describe('isShellWallpaperRevealed', () => {
	it('reveals only on the timetable tab with a wallpaper and a timetable', () => {
		expect(
			isShellWallpaperRevealed({
				wallpaperUri: 'blob:wallpaper',
				timetableSelected: true,
				hasTimetable: true
			})
		).toBe(true);
	});

	it('stays mounted but unrevealed on other tabs', () => {
		expect(
			isShellWallpaperRevealed({
				wallpaperUri: 'blob:wallpaper',
				timetableSelected: false,
				hasTimetable: true
			})
		).toBe(false);
	});

	it('stays unrevealed without a timetable', () => {
		expect(
			isShellWallpaperRevealed({
				wallpaperUri: 'blob:wallpaper',
				timetableSelected: true,
				hasTimetable: false
			})
		).toBe(false);
	});

	it('is unrevealed without a wallpaper uri', () => {
		expect(
			isShellWallpaperRevealed({
				wallpaperUri: null,
				timetableSelected: true,
				hasTimetable: true
			})
		).toBe(false);
	});
});
