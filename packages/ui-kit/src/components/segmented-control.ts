export type Segment = {
	value: string;
	label: string;
	id?: string;
	controls?: string;
};

/** Shared by the segmented track and the scrollable import tab list. */
export function focusSegmentByKey(
	event: KeyboardEvent,
	index: number,
	includeVerticalArrows = false
): number | null {
	const button = event.currentTarget;
	if (!(button instanceof HTMLButtonElement)) return null;
	const buttons = button.parentElement?.querySelectorAll<HTMLButtonElement>(':scope > button');
	if (!buttons?.length) return null;
	let next: number;
	switch (event.key) {
		case 'ArrowRight':
		case 'ArrowDown':
			if (event.key === 'ArrowDown' && !includeVerticalArrows) return null;
			next = (index + 1) % buttons.length;
			break;
		case 'ArrowLeft':
		case 'ArrowUp':
			if (event.key === 'ArrowUp' && !includeVerticalArrows) return null;
			next = (index - 1 + buttons.length) % buttons.length;
			break;
		case 'Home':
			next = 0;
			break;
		case 'End':
			next = buttons.length - 1;
			break;
		default:
			return null;
	}
	event.preventDefault();
	buttons[next]?.focus();
	return next;
}
