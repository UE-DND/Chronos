const MAX_EDGE = 128;
/** Host-owned image decoding only. Color policy belongs to the active theme. */
export function createWallpaperPixelReader() {
	let cachedUri: string | null = null;
	let cachedPixels: Uint8ClampedArray | null = null;
	let generation = 0;
	return async (uri: string, signal: AbortSignal): Promise<Uint8ClampedArray> => {
		signal.throwIfAborted();
		if (uri === cachedUri && cachedPixels) return cachedPixels.slice();
		const request = ++generation;
		const pixels = await downsampleImageBytes(uri);
		signal.throwIfAborted();
		if (request === generation) {
			cachedUri = uri;
			cachedPixels = pixels;
		}
		return pixels.slice();
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
