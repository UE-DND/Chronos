import { describe, expect, it, vi } from 'vite-plus/test';
import {
	attachWallpaperImageDecode,
	shouldOverscanWallpaperImage,
	timetableWallpaperBackdropClass,
	timetableWallpaperPreblurredClass
} from '../src/timetable-preview/timetable-wallpaper-layer';

describe('timetable-wallpaper-layer', () => {
	it('only overscans blurred cover images', () => {
		expect(shouldOverscanWallpaperImage('cover', false)).toBe(false);
		expect(shouldOverscanWallpaperImage('cover', true)).toBe(true);
		expect(shouldOverscanWallpaperImage('fill', true)).toBe(false);
	});

	it('switches backdrop blur without scaling the image', () => {
		const clear = timetableWallpaperBackdropClass(false);
		const blurred = timetableWallpaperBackdropClass(true);
		expect(clear).toContain('blur-none');
		expect(clear).not.toContain('blur-lg');
		expect(blurred).toContain('blur-lg');
		expect(blurred).not.toContain('blur-none');
		expect(clear).not.toContain('scale-');
		expect(blurred).not.toContain('scale-');
	});

	it('prewarms a fixed blur and only transitions its opacity', () => {
		const beforeEdit = timetableWallpaperPreblurredClass(false);
		const duringEdit = timetableWallpaperPreblurredClass(true);

		expect(beforeEdit).toContain('blur-lg');
		expect(beforeEdit).toContain('opacity-[0.001]');
		expect(duringEdit).toContain('opacity-100');
		expect(duringEdit).toContain('motion-reduce:transition-none');
		expect(duringEdit).toContain('transition-opacity');
		expect(duringEdit).not.toContain('transition-[filter]');
	});
});

describe('attachWallpaperImageDecode', () => {
	it('decodes the bound image without resetting an unchanged source', () => {
		const uri = 'blob:http://localhost/wallpaper';
		const img = {
			getAttribute: vi.fn().mockReturnValue(uri),
			decode: vi.fn().mockResolvedValue(undefined)
		};

		attachWallpaperImageDecode(uri)(img as unknown as HTMLImageElement);

		expect(img).not.toHaveProperty('src');
		expect(img.decode).toHaveBeenCalledOnce();
	});
});
