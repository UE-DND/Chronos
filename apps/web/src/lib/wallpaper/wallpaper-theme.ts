const MAX_EDGE = 128;

export interface DecodedWallpaperBitmap {
	pixels: Uint8ClampedArray;
	width: number;
	height: number;
}

export async function readWallpaperBitmap(
	uri: string,
	signal?: AbortSignal
): Promise<DecodedWallpaperBitmap> {
	signal?.throwIfAborted();
	const image = new Image();
	image.src = uri;
	await image.decode();
	signal?.throwIfAborted();
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
	signal?.throwIfAborted();
	return {
		pixels: context.getImageData(0, 0, width, height).data,
		width,
		height
	};
}

export function createWallpaperBitmapReader() {
	let cachedUri: string | null = null;
	let cachedBitmap: DecodedWallpaperBitmap | null = null;
	let inFlightUri: string | null = null;
	let inFlightPromise: Promise<DecodedWallpaperBitmap> | null = null;
	let generation = 0;

	return async (uri: string, signal?: AbortSignal): Promise<DecodedWallpaperBitmap> => {
		signal?.throwIfAborted();
		if (uri === cachedUri && cachedBitmap) {
			return {
				pixels: cachedBitmap.pixels.slice(),
				width: cachedBitmap.width,
				height: cachedBitmap.height
			};
		}

		if (uri === inFlightUri && inFlightPromise) {
			const res = await inFlightPromise;
			signal?.throwIfAborted();
			return {
				pixels: res.pixels.slice(),
				width: res.width,
				height: res.height
			};
		}

		const request = ++generation;
		inFlightUri = uri;
		// The decode is shared; each caller owns only its own cancellation.
		const promise = readWallpaperBitmap(uri);
		inFlightPromise = promise;

		try {
			const bitmap = await promise;
			signal?.throwIfAborted();
			if (request === generation) {
				cachedUri = uri;
				cachedBitmap = bitmap;
			}
			return {
				pixels: bitmap.pixels.slice(),
				width: bitmap.width,
				height: bitmap.height
			};
		} finally {
			if (inFlightPromise === promise) {
				inFlightUri = null;
				inFlightPromise = null;
			}
		}
	};
}

export const getWallpaperBitmap = createWallpaperBitmapReader();

/** Host-owned image decoding only. Color policy belongs to the active theme. */
export function createWallpaperPixelReader() {
	const bitmapReader = createWallpaperBitmapReader();
	return async (uri: string, signal: AbortSignal): Promise<Uint8ClampedArray> => {
		const bitmap = await bitmapReader(uri, signal);
		return bitmap.pixels;
	};
}
