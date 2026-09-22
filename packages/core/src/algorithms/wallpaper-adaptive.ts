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

export interface AdaptiveChromeTone {
	isDarkBg: boolean;
	luminance: number;
	fg: string;
	fgSub: string;
	textShadow: string;
}

export interface AdaptiveChromeResult {
	topBar: AdaptiveChromeTone;
	sidebar: AdaptiveChromeTone;
}

export const DEFAULT_TOP_BAR_REGION: NormalizedRect = {
	x: 0,
	y: 0,
	width: 1.0,
	height: 0.1
};

export const DEFAULT_SIDEBAR_REGION: NormalizedRect = {
	x: 0,
	y: 0.1,
	width: 0.15,
	height: 0.9
};

export interface CalculateRegionLuminanceOptions {
	/**
	 * Base background luminance for transparent / semi-transparent pixels in [0, 1].
	 * Defaults to 1.0 (light theme surface) if isDark is false, or 0.0 (dark theme surface) if isDark is true.
	 */
	baseLuminance?: number;
	isDark?: boolean;
}

export interface ExtractAdaptiveChromeOptions {
	topRegion?: NormalizedRect;
	sideRegion?: NormalizedRect;
	viewportWidth?: number;
	viewportHeight?: number;
	baseLuminance?: number;
	isDark?: boolean;
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

/**
 * Calculates perceived relative luminance of a normalized sub-region from raw RGBA pixel buffer.
 * Supports alpha compositing against base background luminance for transparent/semi-transparent pixels.
 * Uses standard ITU-R BT.709 / sRGB coefficients: 0.2126 R + 0.7152 G + 0.0722 B.
 * Returns a value in [0, 1].
 */
export function calculateRegionLuminance(
	pixels: Uint8ClampedArray | Uint8Array,
	imageWidth: number,
	imageHeight: number,
	region: NormalizedRect,
	options?: CalculateRegionLuminanceOptions
): number {
	if (imageWidth <= 0 || imageHeight <= 0 || pixels.length < imageWidth * imageHeight * 4) {
		return 0.5;
	}

	const baseLuminance = options?.baseLuminance ?? (options?.isDark ? 0.0 : 1.0);

	const startX = Math.max(0, Math.min(imageWidth - 1, Math.floor(region.x * imageWidth)));
	const endX = Math.max(
		startX + 1,
		Math.min(imageWidth, Math.ceil((region.x + region.width) * imageWidth))
	);
	const startY = Math.max(0, Math.min(imageHeight - 1, Math.floor(region.y * imageHeight)));
	const endY = Math.max(
		startY + 1,
		Math.min(imageHeight, Math.ceil((region.y + region.height) * imageHeight))
	);

	let totalLuminance = 0;
	let count = 0;

	for (let y = startY; y < endY; y += 1) {
		const rowOffset = y * imageWidth * 4;
		for (let x = startX; x < endX; x += 1) {
			const index = rowOffset + x * 4;
			const r = pixels[index] ?? 0;
			const g = pixels[index + 1] ?? 0;
			const b = pixels[index + 2] ?? 0;
			const a = (pixels[index + 3] ?? 255) / 255;

			const pixelLum = (0.2126 * r + 0.7152 * g + 0.0722 * b) / 255;
			const effectiveLum = pixelLum * a + baseLuminance * (1 - a);

			totalLuminance += effectiveLum;
			count += 1;
		}
	}

	if (count === 0) return 0.5;
	return totalLuminance / count;
}

/**
 * Derives high-contrast foreground color, secondary color, and text-shadow based on background luminance.
 */
export function deriveAdaptiveChromeTone(luminance: number): AdaptiveChromeTone {
	const isDarkBg = luminance < 0.5;
	if (isDarkBg) {
		return {
			isDarkBg: true,
			luminance,
			fg: 'rgba(255, 255, 255, 0.98)',
			fgSub: 'rgba(255, 255, 255, 0.72)',
			textShadow: '0 1px 2px rgba(0, 0, 0, 0.7)'
		};
	}
	return {
		isDarkBg: false,
		luminance,
		fg: 'rgba(15, 23, 42, 0.95)',
		fgSub: 'rgba(51, 65, 85, 0.8)',
		textShadow: '0 1px 2px rgba(255, 255, 255, 0.7)'
	};
}

/**
 * Extracts adaptive chrome styling parameters for top date bar and left period sidebar.
 * Automatically accounts for viewport cover cropping and transparent pixel blending.
 */
export function extractAdaptiveChromeColors(
	pixels: Uint8ClampedArray | Uint8Array,
	imageWidth: number,
	imageHeight: number,
	options?: ExtractAdaptiveChromeOptions
): AdaptiveChromeResult {
	let topRegion = options?.topRegion ?? DEFAULT_TOP_BAR_REGION;
	let sideRegion = options?.sideRegion ?? DEFAULT_SIDEBAR_REGION;

	if (options?.viewportWidth && options?.viewportHeight) {
		topRegion = mapViewportRectToCoverImageRect(
			topRegion,
			options.viewportWidth,
			options.viewportHeight,
			imageWidth,
			imageHeight
		);
		sideRegion = mapViewportRectToCoverImageRect(
			sideRegion,
			options.viewportWidth,
			options.viewportHeight,
			imageWidth,
			imageHeight
		);
	}

	const topLum = calculateRegionLuminance(pixels, imageWidth, imageHeight, topRegion, {
		baseLuminance: options?.baseLuminance,
		isDark: options?.isDark
	});
	const sideLum = calculateRegionLuminance(pixels, imageWidth, imageHeight, sideRegion, {
		baseLuminance: options?.baseLuminance,
		isDark: options?.isDark
	});

	return {
		topBar: deriveAdaptiveChromeTone(topLum),
		sidebar: deriveAdaptiveChromeTone(sideLum)
	};
}
