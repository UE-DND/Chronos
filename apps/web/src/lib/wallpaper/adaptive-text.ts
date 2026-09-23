import { selectAdaptiveTextTone } from '@chronos/core';
import type { DecodedWallpaperBitmap } from './wallpaper-theme';

/** Keep text colors aligned with the wallpaper as the grid scrolls and changes size. */
export function observeAdaptiveWallpaperText(
	container: HTMLElement,
	bitmap: DecodedWallpaperBitmap,
	isDark: boolean
): () => void {
	const wallpaper = container
		.closest('.shell-page')
		?.querySelector<HTMLElement>('[data-shell-wallpaper]');
	if (!wallpaper) return () => {};

	const styled = new Set<HTMLElement>();
	let frame = 0;
	const clearTone = (element: HTMLElement) => {
		delete element.dataset.adaptiveTone;
		styled.delete(element);
	};
	const update = () => {
		frame = 0;
		const viewport = wallpaper.getBoundingClientRect();
		if (viewport.width <= 0 || viewport.height <= 0) return;
		const targets = new Set(container.querySelectorAll<HTMLElement>('[data-adaptive-text]'));
		for (const element of styled) {
			if (!targets.has(element)) clearTone(element);
		}
		for (const element of targets) {
			const rect = element.getBoundingClientRect();
			if (
				element.closest('.period-active') ||
				rect.width <= 0 ||
				rect.height <= 0 ||
				rect.right <= viewport.left ||
				rect.left >= viewport.right ||
				rect.bottom <= viewport.top ||
				rect.top >= viewport.bottom
			) {
				clearTone(element);
				continue;
			}
			element.dataset.adaptiveTone = selectAdaptiveTextTone(
				bitmap.pixels,
				bitmap.width,
				bitmap.height,
				{
					x: (rect.left - viewport.left) / viewport.width,
					y: (rect.top - viewport.top) / viewport.height,
					width: rect.width / viewport.width,
					height: rect.height / viewport.height
				},
				viewport.width,
				viewport.height,
				isDark
			);
			styled.add(element);
		}
	};
	const schedule = () => {
		if (!frame) frame = requestAnimationFrame(update);
	};
	const mutations = new MutationObserver(schedule);
	mutations.observe(container, {
		subtree: true,
		childList: true,
		characterData: true,
		attributes: true,
		attributeFilter: ['class']
	});
	const sizes = new ResizeObserver(schedule);
	sizes.observe(container);
	sizes.observe(wallpaper);
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
