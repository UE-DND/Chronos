import { createRouteMotionController } from './route-motion-controller.svelte';

/** Draw the native transition under a web startup cover, without changing route state. */
export function warmupRouteMotion(
	secondaryRoot: HTMLElement,
	shellRoot: HTMLElement | null,
	onReady: () => void
): () => void {
	const motion = createRouteMotionController(() => ({ secondaryRoot, shellRoot }));
	let settled = false;
	const roots = [secondaryRoot, shellRoot].filter((root) => root !== null);
	const previousHints = roots.map((root) => root.style.willChange);
	for (const root of roots) root.style.willChange = 'transform, opacity';
	performance.mark('chronos-route-warmup-start');

	function settle(notify: boolean) {
		if (settled) return;
		settled = true;
		cancelAnimationFrame(frame);
		clearTimeout(deadline);
		motion.cancelMotion();
		for (const [index, root] of roots.entries()) root.style.willChange = previousHints[index];
		performance.mark('chronos-route-warmup-end');
		if (notify) onReady();
	}

	// A stalled/hidden WebView must never keep the native splash waiting for an animation.
	const deadline = setTimeout(() => settle(true), 1000);
	const frame = requestAnimationFrame(() => {
		void motion.animateForwardEnter().then(
			() => settle(true),
			() => settle(true)
		);
	});
	return () => settle(false);
}
