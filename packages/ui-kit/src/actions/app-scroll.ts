import { scrollRevealScrollbar } from './scroll-reveal-scrollbar';

/** Scrollbar reveal for general in-app scroll regions. */
export function appScroll(node: HTMLElement) {
	return scrollRevealScrollbar(node);
}

/** Primary screen scroll with native boundary feedback and a revealed scrollbar. */
export function appShellScroll(node: HTMLElement) {
	return scrollRevealScrollbar(node);
}
