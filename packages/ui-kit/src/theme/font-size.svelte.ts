import { createSubscriber } from 'svelte/reactivity';
import { isFontSizeScale, type FontSizeScale } from '@chronos/core';

export function applyFontSizeScale(scale: FontSizeScale) {
	if (typeof document === 'undefined') return;
	const value = String(isFontSizeScale(scale) ? scale : 1);
	if (document.documentElement.style.getPropertyValue('--font-size-scale') !== value) {
		document.documentElement.style.setProperty('--font-size-scale', value);
	}
}

const subscribe = createSubscriber((update) => {
	const probe = document.createElement('span');
	probe.setAttribute('aria-hidden', 'true');
	probe.style.cssText =
		'position:fixed;visibility:hidden;pointer-events:none;width:1rem;height:1rem;inset:0;';
	document.body.append(probe);
	const resize = new ResizeObserver(update);
	resize.observe(probe);
	const mutation = new MutationObserver(update);
	mutation.observe(document.documentElement, {
		attributes: true,
		attributeFilter: ['style', 'class']
	});
	window.addEventListener('resize', update);
	return () => {
		resize.disconnect();
		mutation.disconnect();
		probe.remove();
		window.removeEventListener('resize', update);
	};
});

/** Includes browser default text size as well as the app's selected scale. */
export const rootFontMetrics = {
	get pixels() {
		if (typeof document === 'undefined') return 16;
		subscribe();
		return Number.parseFloat(getComputedStyle(document.documentElement).fontSize) || 16;
	},
	get scale() {
		if (typeof window === 'undefined') return 1;
		const baseline = window.innerWidth >= 1366 ? 17 : window.innerWidth >= 768 ? 16 : 15;
		return this.pixels / baseline;
	}
};
