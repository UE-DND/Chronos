/** Keep app chrome inside the visible area on browsers whose keyboard only resizes VisualViewport. */
export function installWebViewportLayout(): () => void {
	const viewport = window.visualViewport;
	if (!viewport) return () => {};
	const style = document.documentElement.style;
	const properties = [
		'--app-viewport-height',
		'--app-viewport-top',
		'--app-viewport-bottom'
	] as const;
	const sync = () => {
		// Zoom must magnify the existing layout rather than reflow it into the zoomed viewport.
		if (viewport.scale !== 1 || viewport.height <= 0) return;
		const height = Math.min(viewport.height, window.innerHeight);
		const top = Math.max(0, viewport.offsetTop);
		style.setProperty(properties[0], `${height}px`);
		style.setProperty(properties[1], `${top}px`);
		style.setProperty(properties[2], `${Math.max(0, window.innerHeight - height - top)}px`);
	};
	sync();
	viewport.addEventListener('resize', sync);
	viewport.addEventListener('scroll', sync);
	window.addEventListener('resize', sync);
	return () => {
		viewport.removeEventListener('resize', sync);
		viewport.removeEventListener('scroll', sync);
		window.removeEventListener('resize', sync);
		for (const property of properties) style.removeProperty(property);
	};
}
