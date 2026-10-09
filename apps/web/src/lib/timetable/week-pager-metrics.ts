/** The borderless pager's CSS width preserves subpixels and excludes ancestor transforms. */
export function weekPagerPageWidth(node: HTMLElement): number {
	return Number.parseFloat(getComputedStyle(node).width) || 0;
}
