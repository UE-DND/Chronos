import { createAdaptiveTextToneSelector, type AdaptiveTextTone } from '@chronos/core';
import type { DecodedWallpaperBitmap } from './wallpaper-theme';

interface WallpaperTextGeometry {
	/** Local background viewport; defaults to the shell wallpaper. */
	wallpaper?: HTMLElement;
	/** A positioned, proportionally scaled crop image, rather than a cover background. */
	image?: HTMLImageElement;
}

/** Keep text colors aligned with the wallpaper as the grid scrolls and changes size. */
export function observeAdaptiveWallpaperText(
	container: HTMLElement,
	bitmap: DecodedWallpaperBitmap,
	isDark: boolean,
	geometry: WallpaperTextGeometry = {}
): () => void {
	const wallpaper =
		geometry.wallpaper ??
		container.closest('.shell-page')?.querySelector<HTMLElement>('[data-shell-wallpaper]');
	if (!wallpaper) return () => {};

	const selectTone = createAdaptiveTextToneSelector(
		bitmap.pixels,
		bitmap.width,
		bitmap.height,
		isDark
	);
	const styled = new Set<HTMLElement>();
	let targets: HTMLElement[] = [];
	let targetsDirty = true;
	let frame = 0;
	const clearTone = (element: HTMLElement) => {
		if (element.dataset.adaptiveTone !== undefined) delete element.dataset.adaptiveTone;
		styled.delete(element);
	};
	const update = () => {
		frame = 0;
		const viewport = wallpaper.getBoundingClientRect();
		if (viewport.width <= 0 || viewport.height <= 0) return;
		if (targetsDirty) {
			targets = Array.from(container.querySelectorAll<HTMLElement>('[data-adaptive-text]'));
			targetsDirty = false;
		}
		const imageRect = geometry.image?.getBoundingClientRect();
		if (imageRect && (imageRect.width <= 0 || imageRect.height <= 0)) return;
		const samplingRect = imageRect ?? viewport;
		const nextTones: Array<[HTMLElement, AdaptiveTextTone]> = [];
		const nextStyled = new Set<HTMLElement>();
		for (const element of targets) {
			const rect = element.getBoundingClientRect();
			if (
				rect.width <= 0 ||
				rect.height <= 0 ||
				rect.right <= viewport.left ||
				rect.left >= viewport.right ||
				rect.bottom <= viewport.top ||
				rect.top >= viewport.bottom
			) {
				continue;
			}
			const tone = selectTone(
				{
					x: (rect.left - samplingRect.left) / samplingRect.width,
					y: (rect.top - samplingRect.top) / samplingRect.height,
					width: rect.width / samplingRect.width,
					height: rect.height / samplingRect.height
				},
				imageRect ? bitmap.width : viewport.width,
				imageRect ? bitmap.height : viewport.height
			);
			nextTones.push([element, tone]);
			nextStyled.add(element);
		}
		for (const element of styled) {
			if (!nextStyled.has(element)) clearTone(element);
		}
		for (const [element, tone] of nextTones) {
			if (element.dataset.adaptiveTone !== tone) element.dataset.adaptiveTone = tone;
			styled.add(element);
		}
	};
	const schedule = () => {
		if (!frame) frame = requestAnimationFrame(update);
	};
	const mutations = new MutationObserver((records) => {
		if (
			records.some(
				(record) => record.type === 'childList' || record.attributeName === 'data-adaptive-text'
			)
		) {
			targetsDirty = true;
		}
		schedule();
	});
	mutations.observe(container, {
		subtree: true,
		childList: true,
		characterData: true,
		attributes: true,
		attributeFilter: ['class', 'data-adaptive-text']
	});
	if (geometry.image)
		mutations.observe(geometry.image, { attributes: true, attributeFilter: ['style'] });
	const sizes = new ResizeObserver(schedule);
	sizes.observe(container);
	sizes.observe(wallpaper);
	if (geometry.image) sizes.observe(geometry.image);
	container.addEventListener('scroll', schedule, true);
	window.addEventListener('resize', schedule);
	schedule();

	return () => {
		cancelAnimationFrame(frame);
		mutations.disconnect();
		sizes.disconnect();
		container.removeEventListener('scroll', schedule, true);
		window.removeEventListener('resize', schedule);
		for (const element of styled) clearTone(element);
	};
}
