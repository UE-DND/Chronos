import { describe, it, expect } from 'vite-plus/test';
import { mapViewportRectToCoverImageRect, selectAdaptiveTextTone } from '../src/index';

describe('wallpaper cover mapping', () => {
	it('maps the visible center crop of a landscape image', () => {
		const mapped = mapViewportRectToCoverImageRect(
			{ x: 0, y: 0, width: 1, height: 1 },
			500,
			1000,
			2000,
			1000
		);
		expect(mapped).toEqual({ x: 0.375, y: 0, width: 0.25, height: 1 });
	});
});

describe('adaptive text over wallpaper', () => {
	function pixels(values: number[]): Uint8ClampedArray {
		return new Uint8ClampedArray(values.flatMap((value) => [value, value, value, 255]));
	}

	it('selects opaque dark text on a light local background and light text on a dark one', () => {
		const image = pixels([255, 0]);
		expect(selectAdaptiveTextTone(image, 2, 1, { x: 0, y: 0, width: 0.5, height: 1 }, 2, 1)).toBe(
			'dark'
		);
		expect(selectAdaptiveTextTone(image, 2, 1, { x: 0.5, y: 0, width: 0.5, height: 1 }, 2, 1)).toBe(
			'light'
		);
	});

	it('adds a glyph outline when a single label crosses light and dark image details', () => {
		expect(
			selectAdaptiveTextTone(pixels([255, 0]), 2, 1, { x: 0, y: 0, width: 1, height: 1 }, 2, 1)
		).toBe('dark-outline');
		expect(
			selectAdaptiveTextTone(
				pixels([0, 0, 0, 0, 0, 255]),
				6,
				1,
				{ x: 0, y: 0, width: 1, height: 1 },
				6,
				1
			)
		).toBe('light-outline');
	});

	it('samples the visible cover crop rather than the hidden image edge', () => {
		const image = pixels([255, 0, 0, 255]);
		expect(selectAdaptiveTextTone(image, 4, 1, { x: 0, y: 0, width: 1, height: 1 }, 2, 1)).toBe(
			'light'
		);
	});

	it('composites transparent pixels over the active surface', () => {
		const transparent = new Uint8ClampedArray([0, 0, 0, 0]);
		const rect = { x: 0, y: 0, width: 1, height: 1 };
		expect(selectAdaptiveTextTone(transparent, 1, 1, rect, 1, 1, false)).toBe('dark');
		expect(selectAdaptiveTextTone(transparent, 1, 1, rect, 1, 1, true)).toBe('light');
	});
});
