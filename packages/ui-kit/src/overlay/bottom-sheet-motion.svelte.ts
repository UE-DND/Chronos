import { createGestureVelocity, rubberband } from '../motion/gesture-motion';
import { shouldDismissSheet } from './bottom-sheet-drag';

export function createBottomSheetMotion(options: {
	height: () => number;
	reduced: () => boolean;
	animate: (from: number, target: number, onComplete: () => void) => () => void;
	onClosed: () => void;
	onComplete: (open: boolean) => void;
}) {
	let present = $state(false);
	let offset = $state(0);
	let phase = $state<'hidden' | 'entering' | 'open' | 'dragging' | 'closing' | 'returning'>(
		'hidden'
	);
	let startY = 0;
	let dragDimension = 1;
	let opened = false;
	let generation = 0;
	let cancelAnimation = () => {};
	const samples = createGestureVelocity();
	function cancel() {
		generation++;
		cancelAnimation();
		cancelAnimation = () => {};
	}
	function animate(target: number, complete: () => void) {
		cancel();
		const task = generation;
		const from = offset;
		offset = target;
		if (options.reduced()) complete();
		else {
			cancelAnimation = options.animate(from, target, () => {
				if (task !== generation) return;
				cancelAnimation = () => {};
				complete();
			});
		}
	}
	function returnHome() {
		phase = opened ? 'returning' : 'entering';
		animate(0, () => {
			phase = 'open';
			if (!opened) {
				opened = true;
				options.onComplete(true);
			}
		});
	}
	function close() {
		if (!present || phase === 'closing') return;
		phase = 'closing';
		animate(Math.max(options.height(), 1), () => {
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
			} else if (phase === 'closing') returnHome();
		},
		mount() {
			if (phase !== 'entering') return;
			offset = options.height();
			returnHome();
		},
		start(y: number) {
			if (phase !== 'open') return;
			dragDimension = Math.max(options.height(), 1);
			startY = y;
			samples.reset(y);
			phase = 'dragging';
		},
		move(y: number) {
			if (phase !== 'dragging') return;
			samples.add(y);
			const next = y - startY;
			offset = next >= 0 ? next : rubberband(next, dragDimension);
		},
		release(y: number, canceled = false) {
			if (phase !== 'dragging') return;
			samples.add(y);
			const velocity = canceled ? 0 : samples.velocity();
			if (!canceled && shouldDismissSheet(offset, dragDimension, 0.25, velocity)) close();
			else returnHome();
		},
		destroy: cancel
	};
}
