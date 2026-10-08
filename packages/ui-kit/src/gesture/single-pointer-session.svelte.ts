import { untrack } from 'svelte';

/** Own one primary pointer and release its capture before another session can start. */
export function createSinglePointerSession() {
	let id = $state<number | null>(null);
	let capturedElement: HTMLElement | null = null;

	function end() {
		const previousId = untrack(() => id);
		const element = capturedElement;
		// Clear ownership before release, which can deliver lostpointercapture.
		id = null;
		capturedElement = null;
		if (previousId === null || !element) return;
		try {
			if (element.hasPointerCapture(previousId)) element.releasePointerCapture(previousId);
		} catch {
			// The element or native pointer may already have been removed.
		}
	}

	return {
		get id() {
			return id;
		},
		start(event: PointerEvent, element: HTMLElement | null = null): boolean {
			if (id !== null || event.button !== 0 || !event.isPrimary) return false;
			id = event.pointerId;
			capturedElement = element;
			try {
				element?.setPointerCapture(event.pointerId);
			} catch {
				// Document/window listeners can continue when capture is unavailable.
			}
			return true;
		},
		owns(event: PointerEvent): boolean {
			return id !== null && id === event.pointerId;
		},
		end
	};
}
