import { createGestureVelocity, createScalarSpring, rubberband } from '../motion/gesture-motion';
import { shouldDismissSheet } from './bottom-sheet-drag';

export function createBottomSheetMotion(options: {
	height: () => number;
	reduced: () => boolean;
	onClosed: () => void;
	onComplete: (open: boolean) => void;
}) {
	let present = $state(false);
	let offset = $state(0);
	let phase = $state<'hidden' | 'entering' | 'open' | 'dragging' | 'closing' | 'returning'>(
		'hidden'
	);
	let startY = 0;
	let startOffset = 0;
	let dragDimension = 1;
	let opened = false;
	const samples = createGestureVelocity();
	const spring = createScalarSpring((value) => {
		offset = value;
	});
	function animate(target: number, velocity: number, complete: () => void) {
		if (options.reduced()) {
			spring.jump(target);
			complete();
		} else spring.animate(target, velocity, complete);
	}
	function returnHome(velocity = 0) {
		phase = opened ? 'returning' : 'entering';
		animate(0, velocity, () => {
			phase = 'open';
			if (!opened) {
				opened = true;
				options.onComplete(true);
			}
		});
	}
	function close(velocity = 0) {
		if (!present || phase === 'closing') return;
		phase = 'closing';
		animate(Math.max(options.height(), 1), velocity, () => {
			present = false;
			phase = 'hidden';
			opened = false;
			options.onClosed();
			options.onComplete(false);
		});
	}
	return {
		get state() {
			return { present, offset, phase };
		},
		setOpen(next: boolean) {
			if (!next) {
				close();
				return;
			}
			if (!present) {
				present = true;
				phase = 'entering';
				opened = false;
			} else if (phase === 'closing') returnHome(spring.velocity);
		},
		mount() {
			if (phase !== 'entering') return;
			spring.jump(options.height());
			returnHome();
		},
		start(y: number) {
			if (!present) return;
			spring.cancel();
			// Recover the unresisted coordinate so grabbing above the top keeps its visible offset.
			const visible = spring.value;
			dragDimension = Math.max(options.height(), -visible * 2, 1);
			startOffset =
				visible < 0 ? (visible * dragDimension) / (0.55 * (dragDimension + visible)) : visible;
			startY = y;
			samples.reset(y);
			phase = 'dragging';
		},
		move(y: number) {
			if (phase !== 'dragging') return;
			samples.add(y);
			const next = startOffset + y - startY;
			spring.jump(next >= 0 ? next : rubberband(next, dragDimension));
		},
		release(y: number, canceled = false) {
			if (phase !== 'dragging') return;
			samples.add(y);
			const velocity = canceled ? 0 : samples.velocity();
			if (!canceled && shouldDismissSheet(offset, options.height(), 0.25, velocity))
				close(velocity);
			else returnHome(velocity);
		},
		destroy() {
			spring.cancel();
		}
	};
}
