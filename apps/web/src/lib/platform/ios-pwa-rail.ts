/** iOS reports symmetric landscape insets even when the sensor housing is on the left. */
export function installIosPwaRailLayout(): () => void {
	const root = document.documentElement;
	const attribute = 'data-ios-pwa-left-cutout';
	const orientation = window.screen.orientation;
	function sync() {
		// Safari's signed angle keeps the physical notch side unambiguous on iPhone.
		const angle = window.orientation;
		root.toggleAttribute(attribute, angle === 90);
	}
	sync();
	window.addEventListener('orientationchange', sync);
	orientation?.addEventListener('change', sync);
	return () => {
		window.removeEventListener('orientationchange', sync);
		orientation?.removeEventListener('change', sync);
		root.removeAttribute(attribute);
	};
}
