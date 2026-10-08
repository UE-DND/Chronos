export type GestureDirection = 'pending' | 'horizontal' | 'vertical';

const VERTICAL_THRESHOLD_PX = 8;
const HORIZONTAL_THRESHOLD_PX = 24;
const HORIZONTAL_RATIO = 1.35;

/** Give native vertical scrolling priority over sideways jitter, including after activation. */
export function createHorizontalGesture() {
	let direction: GestureDirection = 'pending';
	return {
		get direction() {
			return direction;
		},
		reset() {
			direction = 'pending';
		},
		update(dx: number, dy: number): GestureDirection {
			if (direction === 'vertical') return direction;
			const horizontal = Math.abs(dx) > Math.abs(dy) * HORIZONTAL_RATIO;
			if (Math.abs(dy) >= VERTICAL_THRESHOLD_PX && !horizontal) direction = 'vertical';
			else if (Math.abs(dx) >= HORIZONTAL_THRESHOLD_PX && horizontal) direction = 'horizontal';
			return direction;
		}
	};
}
