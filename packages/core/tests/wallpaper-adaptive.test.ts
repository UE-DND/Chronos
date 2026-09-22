import { describe, it, expect } from 'vite-plus/test';
import {
	calculateRegionLuminance,
	deriveAdaptiveChromeTone,
	extractAdaptiveChromeColors,
	mapViewportRectToCoverImageRect
} from '../src/index';

describe('Wallpaper Adaptive Chrome Algorithm in @chronos/core', () => {
	it('calculates luminance for pure white pixels correctly', () => {
		const pixels = new Uint8ClampedArray(10 * 10 * 4);
		pixels.fill(255);

		const lum = calculateRegionLuminance(pixels, 10, 10, { x: 0, y: 0, width: 1, height: 1 });
		expect(lum).toBeCloseTo(1.0, 2);

		const tone = deriveAdaptiveChromeTone(lum);
		expect(tone.isDarkBg).toBe(false);
		expect(tone.fg).toContain('15, 23, 42');
	});

	it('calculates luminance for pure black pixels correctly', () => {
		const pixels = new Uint8ClampedArray(10 * 10 * 4);
		for (let i = 3; i < pixels.length; i += 4) {
			pixels[i] = 255;
		}

		const lum = calculateRegionLuminance(pixels, 10, 10, { x: 0, y: 0, width: 1, height: 1 });
		expect(lum).toBeCloseTo(0.0, 2);

		const tone = deriveAdaptiveChromeTone(lum);
		expect(tone.isDarkBg).toBe(true);
		expect(tone.fg).toContain('255, 255, 255');
	});

	it('handles transparent and semi-transparent pixels with base background blending', () => {
		// Fully transparent image (all zeros including alpha = 0)
		const transparentPixels = new Uint8ClampedArray(10 * 10 * 4);

		// Against light theme base background (baseLuminance = 1.0)
		const lumLight = calculateRegionLuminance(
			transparentPixels,
			10,
			10,
			{ x: 0, y: 0, width: 1, height: 1 },
			{ isDark: false }
		);
		expect(lumLight).toBeCloseTo(1.0, 2);
		expect(deriveAdaptiveChromeTone(lumLight).isDarkBg).toBe(false);

		// Against dark theme base background (baseLuminance = 0.0)
		const lumDark = calculateRegionLuminance(
			transparentPixels,
			10,
			10,
			{ x: 0, y: 0, width: 1, height: 1 },
			{ isDark: true }
		);
		expect(lumDark).toBeCloseTo(0.0, 2);
		expect(deriveAdaptiveChromeTone(lumDark).isDarkBg).toBe(true);

		// Semi-transparent black on light theme: Alpha = 128 (~50%), Black pixel (0,0,0)
		// Expected: 0.0 * 0.5 + 1.0 * 0.5 = 0.5
		const semiPixels = new Uint8ClampedArray(10 * 10 * 4);
		for (let i = 3; i < semiPixels.length; i += 4) {
			semiPixels[i] = 128;
		}
		const lumSemi = calculateRegionLuminance(
			semiPixels,
			10,
			10,
			{ x: 0, y: 0, width: 1, height: 1 },
			{ isDark: false }
		);
		expect(lumSemi).toBeCloseTo(0.5, 1);
	});

	describe('mapViewportRectToCoverImageRect (CSS cover cropping)', () => {
		it('maps center-cropped landscape image into portrait viewport', () => {
			// Portrait viewport: 500w x 1000h (aspect = 0.5)
			// Landscape image: 2000w x 1000h (aspect = 2.0)
			// Scale factor = max(500/2000, 1000/1000) = 1.0
			// Scaled width = 2000, scaled height = 1000
			// Horizontal crop: offsetX = (2000 - 500) / 2 = 750
			// Visible X range in image: [750, 1250], which is [0.375, 0.625] in normalized coords
			const mapped = mapViewportRectToCoverImageRect(
				{ x: 0, y: 0, width: 1, height: 1 },
				500,
				1000,
				2000,
				1000
			);

			expect(mapped.x).toBeCloseTo(0.375, 3);
			expect(mapped.width).toBeCloseTo(0.25, 3);
			expect(mapped.y).toBeCloseTo(0.0, 3);
			expect(mapped.height).toBeCloseTo(1.0, 3);
		});

		it('maps center-cropped portrait image into landscape viewport', () => {
			// Landscape viewport: 1000w x 500h (aspect = 2.0)
			// Portrait image: 1000w x 2000h (aspect = 0.5)
			// Scale factor = max(1000/1000, 500/2000) = 1.0
			// Scaled width = 1000, scaled height = 2000
			// Vertical crop: offsetY = (2000 - 500) / 2 = 750
			// Visible Y range in image: [750, 1250], which is [0.375, 0.625] in normalized coords
			const mapped = mapViewportRectToCoverImageRect(
				{ x: 0, y: 0, width: 1, height: 1 },
				1000,
				500,
				1000,
				2000
			);

			expect(mapped.x).toBeCloseTo(0.0, 3);
			expect(mapped.width).toBeCloseTo(1.0, 3);
			expect(mapped.y).toBeCloseTo(0.375, 3);
			expect(mapped.height).toBeCloseTo(0.25, 3);
		});
	});

	it('extractAdaptiveChromeColors correctly samples visible viewport regions under cover crop', () => {
		// Image is 200w x 100h:
		// Left 25% (x < 50): white
		// Center 50% (50 <= x < 150): black
		// Right 25% (x >= 150): white
		const imgW = 200;
		const imgH = 100;
		const pixels = new Uint8ClampedArray(imgW * imgH * 4);
		for (let y = 0; y < imgH; y += 1) {
			for (let x = 0; x < imgW; x += 1) {
				const idx = (y * imgW + x) * 4;
				const isCenter = x >= 50 && x < 150;
				const val = isCenter ? 0 : 255;
				pixels[idx] = val;
				pixels[idx + 1] = val;
				pixels[idx + 2] = val;
				pixels[idx + 3] = 255;
			}
		}

		// When displayed in a 100w x 100h square viewport:
		// Image width (200) is cropped horizontally, visible portion is center [50, 150] (all black!).
		// Without cover mapping, left sidebar (x: 0~15%) would hit x: 0~30 in raw image which is white!
		// With cover mapping, left sidebar (x: 0~15%) maps to center crop x: 50~65 which is BLACK!
		const result = extractAdaptiveChromeColors(pixels, imgW, imgH, {
			viewportWidth: 100,
			viewportHeight: 100
		});

		// Both topBar and sidebar should sample the visible center region (black background -> white text!)
		expect(result.sidebar.isDarkBg).toBe(true);
		expect(result.sidebar.luminance).toBeLessThan(0.05);
		expect(result.sidebar.fg).toContain('255, 255, 255');
	});

	it('safely handles empty or invalid dimensions', () => {
		const emptyPixels = new Uint8ClampedArray(0);
		const lum = calculateRegionLuminance(emptyPixels, 0, 0, { x: 0, y: 0, width: 1, height: 1 });
		expect(lum).toBe(0.5);

		const tone = deriveAdaptiveChromeTone(lum);
		expect(tone.isDarkBg).toBe(false);

		const mapped = mapViewportRectToCoverImageRect({ x: 0, y: 0, width: 1, height: 1 }, 0, 0, 0, 0);
		expect(mapped).toEqual({ x: 0, y: 0, width: 1, height: 1 });
	});
});
