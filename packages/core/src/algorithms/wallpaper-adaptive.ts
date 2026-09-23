export interface NormalizedRect {
	/** X start fraction [0, 1] */
	x: number;
	/** Y start fraction [0, 1] */
	y: number;
	/** Width fraction [0, 1] */
	width: number;
	/** Height fraction [0, 1] */
	height: number;
}

export type AdaptiveTextTone = 'dark' | 'light' | 'dark-outline' | 'light-outline';

const DARK_TEXT_LUMINANCE =
	0.2126 * linearChannel(15 / 255) +
	0.7152 * linearChannel(23 / 255) +
	0.0722 * linearChannel(42 / 255);
const MIN_TEXT_CONTRAST = 4.5;

function linearChannel(channel: number): number {
	return channel <= 0.04045 ? channel / 12.92 : ((channel + 0.055) / 1.055) ** 2.4;
}

function contrastRatio(first: number, second: number): number {
	return (Math.max(first, second) + 0.05) / (Math.min(first, second) + 0.05);
}

function pixelLuminance(
	pixels: Uint8ClampedArray | Uint8Array,
	index: number,
	base: number
): number {
	const alpha = (pixels[index + 3] ?? 255) / 255;
	const red = linearChannel(((pixels[index] ?? 0) * alpha + base * (1 - alpha)) / 255);
	const green = linearChannel(((pixels[index + 1] ?? 0) * alpha + base * (1 - alpha)) / 255);
	const blue = linearChannel(((pixels[index + 2] ?? 0) * alpha + base * (1 - alpha)) / 255);
	return 0.2126 * red + 0.7152 * green + 0.0722 * blue;
}

/** Decode luminance once for a wallpaper that will be sampled on every scroll frame. */
export function createAdaptiveTextToneSelector(
	pixels: Uint8ClampedArray | Uint8Array,
	imageWidth: number,
	imageHeight: number,
	isDark = false
): (
	viewportRect: NormalizedRect,
	viewportWidth: number,
	viewportHeight: number
) => AdaptiveTextTone {
	if (imageWidth <= 0 || imageHeight <= 0 || pixels.length < imageWidth * imageHeight * 4) {
		return (rect, width, height) =>
			selectAdaptiveTextTone(pixels, imageWidth, imageHeight, rect, width, height, isDark);
	}
	const luminances = new Float64Array(imageWidth * imageHeight);
	const base = isDark ? 0 : 255;
	for (let index = 0; index < luminances.length; index += 1) {
		luminances[index] = pixelLuminance(pixels, index * 4, base);
	}
	return (rect, width, height) =>
		selectAdaptiveTextToneFromPixels(
			pixels,
			imageWidth,
			imageHeight,
			rect,
			width,
			height,
			isDark,
			luminances
		);
}

/** Selects a foreground for the pixels directly behind one text element. */
export function selectAdaptiveTextTone(
	pixels: Uint8ClampedArray | Uint8Array,
	imageWidth: number,
	imageHeight: number,
	viewportRect: NormalizedRect,
	viewportWidth: number,
	viewportHeight: number,
	isDark = false
): AdaptiveTextTone {
	return selectAdaptiveTextToneFromPixels(
		pixels,
		imageWidth,
		imageHeight,
		viewportRect,
		viewportWidth,
		viewportHeight,
		isDark
	);
}

function selectAdaptiveTextToneFromPixels(
	pixels: Uint8ClampedArray | Uint8Array,
	imageWidth: number,
	imageHeight: number,
	viewportRect: NormalizedRect,
	viewportWidth: number,
	viewportHeight: number,
	isDark: boolean,
	luminances?: Float64Array
): AdaptiveTextTone {
	if (
		imageWidth <= 0 ||
		imageHeight <= 0 ||
		viewportWidth <= 0 ||
		viewportHeight <= 0 ||
		pixels.length < imageWidth * imageHeight * 4
	) {
		return isDark ? 'light-outline' : 'dark-outline';
	}

	const rect = mapViewportRectToCoverImageRect(
		viewportRect,
		viewportWidth,
		viewportHeight,
		imageWidth,
		imageHeight
	);
	const startX = Math.max(0, Math.min(imageWidth - 1, Math.floor(rect.x * imageWidth)));
	const endX = Math.max(
		startX + 1,
		Math.min(imageWidth, Math.ceil((rect.x + rect.width) * imageWidth))
	);
	const startY = Math.max(0, Math.min(imageHeight - 1, Math.floor(rect.y * imageHeight)));
	const endY = Math.max(
		startY + 1,
		Math.min(imageHeight, Math.ceil((rect.y + rect.height) * imageHeight))
	);
	const base = isDark ? 0 : 255;
	let darkContrast = Number.POSITIVE_INFINITY;
	let lightContrast = Number.POSITIVE_INFINITY;
	let totalLuminance = 0;
	let sampleCount = 0;

	for (let y = startY; y < endY; y += 1) {
		for (let x = startX; x < endX; x += 1) {
			const pixelIndex = y * imageWidth + x;
			const luminance = luminances?.[pixelIndex] ?? pixelLuminance(pixels, pixelIndex * 4, base);
			darkContrast = Math.min(darkContrast, contrastRatio(DARK_TEXT_LUMINANCE, luminance));
			lightContrast = Math.min(lightContrast, contrastRatio(1, luminance));
			totalLuminance += luminance;
			sampleCount += 1;
		}
	}

	if (darkContrast >= MIN_TEXT_CONTRAST && darkContrast >= lightContrast) return 'dark';
	if (lightContrast >= MIN_TEXT_CONTRAST) return 'light';
	return totalLuminance / sampleCount >= 0.2 ? 'dark-outline' : 'light-outline';
}

/**
 * Maps a normalized rectangle from viewport coordinate space ([0, 1] relative to viewport dimensions)
 * into normalized image coordinate space ([0, 1] relative to natural image dimensions),
 * simulating CSS `object-fit: cover; object-position: center;`.
 */
export function mapViewportRectToCoverImageRect(
	viewportRect: NormalizedRect,
	viewportWidth: number,
	viewportHeight: number,
	imageWidth: number,
	imageHeight: number
): NormalizedRect {
	if (viewportWidth <= 0 || viewportHeight <= 0 || imageWidth <= 0 || imageHeight <= 0) {
		return { ...viewportRect };
	}

	const scale = Math.max(viewportWidth / imageWidth, viewportHeight / imageHeight);
	const scaledWidth = imageWidth * scale;
	const scaledHeight = imageHeight * scale;

	const offsetX = (scaledWidth - viewportWidth) / 2;
	const offsetY = (scaledHeight - viewportHeight) / 2;

	const vxStart = viewportRect.x * viewportWidth;
	const vyStart = viewportRect.y * viewportHeight;
	const vxEnd = (viewportRect.x + viewportRect.width) * viewportWidth;
	const vyEnd = (viewportRect.y + viewportRect.height) * viewportHeight;

	const sxStart = vxStart + offsetX;
	const syStart = vyStart + offsetY;
	const sxEnd = vxEnd + offsetX;
	const syEnd = vyEnd + offsetY;

	const nxStart = Math.max(0, Math.min(1, sxStart / scaledWidth));
	const nyStart = Math.max(0, Math.min(1, syStart / scaledHeight));
	const nxEnd = Math.max(nxStart, Math.min(1, sxEnd / scaledWidth));
	const nyEnd = Math.max(nyStart, Math.min(1, syEnd / scaledHeight));

	return {
		x: nxStart,
		y: nyStart,
		width: nxEnd - nxStart,
		height: nyEnd - nyStart
	};
}
