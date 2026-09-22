import { describe, expect, it, vi, afterEach } from 'vite-plus/test';
import {
	createWallpaperBitmapReader,
	createWallpaperPixelReader,
	readWallpaperBitmap
} from './wallpaper-theme';

afterEach(() => vi.unstubAllGlobals());

describe('wallpaper-theme bitmap reader', () => {
	function mockCanvasAndImage(options?: {
		decodeDelayMs?: (src: string) => number;
		pixelsBySrc?: (src: string) => number[];
	}) {
		let currentDrawnSrc = '';
		const drawImage = vi.fn().mockImplementation((img: { src: string }) => {
			currentDrawnSrc = img.src;
		});

		vi.stubGlobal(
			'Image',
			class {
				src = '';
				naturalWidth = 200;
				naturalHeight = 100;
				width = 200;
				height = 100;
				async decode() {
					const delay = options?.decodeDelayMs ? options.decodeDelayMs(this.src) : 0;
					if (delay > 0) {
						await new Promise((resolve) => setTimeout(resolve, delay));
					}
					return Promise.resolve();
				}
			}
		);

		vi.stubGlobal('document', {
			createElement: (tag: string) => {
				if (tag === 'canvas') {
					return {
						width: 0,
						height: 0,
						getContext: vi.fn().mockImplementation(() => ({
							drawImage,
							getImageData: vi.fn().mockImplementation(() => {
								const vals = options?.pixelsBySrc
									? options.pixelsBySrc(currentDrawnSrc)
									: [100, 150, 200, 255];
								return { data: new Uint8ClampedArray(vals) };
							})
						}))
					};
				}
				return {};
			}
		});

		return { drawImage };
	}

	it('reads bitmap dimensions and pixel data correctly', async () => {
		mockCanvasAndImage();
		const result = await readWallpaperBitmap('blob:test');
		expect(result.width).toBe(128);
		expect(result.height).toBe(64);
		expect(result.pixels).toEqual(new Uint8ClampedArray([100, 150, 200, 255]));
	});

	it('caches bitmap and pixel reads across identical URIs without redundant decodes', async () => {
		const { drawImage } = mockCanvasAndImage();
		const reader = createWallpaperBitmapReader();

		const first = await reader('blob:test');
		const second = await reader('blob:test');

		expect(first.pixels).toEqual(second.pixels);
		expect(drawImage).toHaveBeenCalledTimes(1);
	});

	it('deduplicates parallel in-flight reads for the same URI', async () => {
		const { drawImage } = mockCanvasAndImage({
			decodeDelayMs: () => 15
		});
		const reader = createWallpaperBitmapReader();

		// Two concurrent calls for the same URI
		const [resA, resB] = await Promise.all([reader('blob:parallel'), reader('blob:parallel')]);

		expect(resA.pixels).toEqual(resB.pixels);
		// Should only trigger drawImage once
		expect(drawImage).toHaveBeenCalledTimes(1);
	});

	it('handles out-of-order race conditions safely', async () => {
		// URI 1 takes 30ms, URI 2 takes 5ms
		const { drawImage } = mockCanvasAndImage({
			decodeDelayMs: (src) => (src === 'blob:slow' ? 30 : 5),
			pixelsBySrc: (src) => (src === 'blob:slow' ? [1, 1, 1, 255] : [2, 2, 2, 255])
		});
		const reader = createWallpaperBitmapReader();

		// Start slow request
		const slowPromise = reader('blob:slow');
		// Start fast request slightly later
		await new Promise((r) => setTimeout(r, 2));
		const fastResult = await reader('blob:fast');

		expect(fastResult.pixels[0]).toBe(2);

		const slowResult = await slowPromise;
		expect(slowResult.pixels[0]).toBe(1);

		// Now querying the cache: since fast was requested later, the cache must not be poisoned by the older slow request
		// Wait, because generation for fast was 2, and slow was 1, slow completion should NOT overwrite fast in cache
		const latestCache = await reader('blob:fast');
		expect(latestCache.pixels[0]).toBe(2);
		// drawImage was called twice: once for slow, once for fast; cached fast did not trigger drawImage a third time
		expect(drawImage).toHaveBeenCalledTimes(2);
	});

	it('respects abort signals during decode without poisoning subsequent requests', async () => {
		mockCanvasAndImage({
			decodeDelayMs: () => 20
		});
		const reader = createWallpaperBitmapReader();
		const ac = new AbortController();

		const p = reader('blob:aborted', ac.signal);
		ac.abort();

		await expect(p).rejects.toThrow();

		// Subsequent call for the same or different URI succeeds cleanly
		const clean = await reader('blob:clean');
		expect(clean.pixels).toBeTruthy();
	});

	it('createWallpaperPixelReader preserves legacy compatibility', async () => {
		mockCanvasAndImage();
		const reader = createWallpaperPixelReader();
		const pixels = await reader('blob:test', new AbortController().signal);
		expect(pixels).toEqual(new Uint8ClampedArray([100, 150, 200, 255]));
	});
});
