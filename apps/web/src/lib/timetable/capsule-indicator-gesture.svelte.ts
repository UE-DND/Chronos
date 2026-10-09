import { createSinglePointerSession } from '@chronos/ui-kit';
import { haptic } from '#lib/haptic/haptic.ts';
import { createRafCoalescer } from '#lib/utils/raf-coalescer.ts';
import { createThrottledCallback } from '#lib/utils/throttle.ts';

export interface CapsuleIndicatorGestureOptions {
	getStartWeek: () => number;
	getEndWeek: () => number;
	getDisplayedWeek: () => number;
	onWeekChange: (week: number) => void;
	onScrubCommit?: (week: number, fromWeek: number) => void;
	onTap?: () => void;
	onScrubStartFeedback?: () => void;
	onWeekStepFeedback?: () => void;
}

export function createCapsuleIndicatorGesture({
	getStartWeek,
	getEndWeek,
	getDisplayedWeek,
	onWeekChange,
	onScrubCommit,
	onTap,
	onScrubStartFeedback = () => haptic.heavy(),
	onWeekStepFeedback = () => haptic.medium()
}: CapsuleIndicatorGestureOptions) {
	let isScrubbing = $state(false);
	let scrubWeek = $state(1);
	const pointer = createSinglePointerSession();
	let containerEl = $state<HTMLElement | null>(null);

	let longPressTimer: ReturnType<typeof setTimeout> | null = null;
	let startX = 0;
	let startY = 0;
	let scrubStartX = 0;
	let scrubStartWeek = 1;
	let scrubStepPx = 14;

	const weekChangeRaf = createRafCoalescer(onWeekChange);
	const triggerStepFeedback = createThrottledCallback(onWeekStepFeedback, 35);

	function applyWeekStep(week: number): void {
		if (scrubWeek === week) return;
		scrubWeek = week;
		triggerStepFeedback();
		weekChangeRaf.schedule(week);
	}

	function startScrubbing(clientX: number): void {
		if (isScrubbing) return;
		isScrubbing = true;
		scrubStartWeek = getDisplayedWeek();
		scrubStartX = clientX;
		scrubWeek = scrubStartWeek;

		// Sample step metrics once on activation to eliminate layout thrashing during high-frequency pointermove
		const totalWeeks = Math.max(1, getEndWeek() - getStartWeek() + 1);
		const rect = containerEl?.getBoundingClientRect();
		const width = rect?.width || 240;
		scrubStepPx = Math.max(10, width / (totalWeeks + 1));

		onScrubStartFeedback();
	}

	function updateWeekFromDelta(clientX: number): void {
		const startWeek = getStartWeek();
		const endWeek = getEndWeek();

		const deltaX = clientX - scrubStartX;
		const deltaWeeks = Math.round(deltaX / scrubStepPx);
		const targetWeek = Math.max(startWeek, Math.min(endWeek, scrubStartWeek + deltaWeeks));

		applyWeekStep(targetWeek);
	}

	function onPointerDown(e: PointerEvent): void {
		const startWeek = getStartWeek();
		const endWeek = getEndWeek();
		if (startWeek >= endWeek) return;

		if (!pointer.start(e, containerEl)) return;
		startX = e.clientX;
		startY = e.clientY;

		if (longPressTimer) clearTimeout(longPressTimer);
		longPressTimer = setTimeout(() => {
			longPressTimer = null;
			startScrubbing(startX);
		}, 220);
	}

	function onPointerMove(e: PointerEvent): void {
		if (!pointer.owns(e)) return;

		if (isScrubbing) {
			e.preventDefault();
			updateWeekFromDelta(e.clientX);
			return;
		}

		const dx = Math.abs(e.clientX - startX);
		const dy = Math.abs(e.clientY - startY);

		if (dx > 8 || dy > 8) {
			if (longPressTimer) {
				clearTimeout(longPressTimer);
				longPressTimer = null;
			}
			pointer.end();
		}
	}

	function finishPointerInteraction(commit: boolean): void {
		pointer.end();

		if (longPressTimer) {
			clearTimeout(longPressTimer);
			longPressTimer = null;
			if (commit) onTap?.();
		} else if (isScrubbing) {
			const fromWeek = scrubStartWeek;
			const toWeek = scrubWeek;
			isScrubbing = false;
			if (commit) {
				weekChangeRaf.flush(scrubWeek);
				if (toWeek !== fromWeek) {
					onScrubCommit?.(toWeek, fromWeek);
				}
			} else {
				weekChangeRaf.cancel();
				onWeekChange(scrubStartWeek);
			}
		}
	}

	function onPointerUp(e: PointerEvent): void {
		if (!pointer.owns(e)) return;
		finishPointerInteraction(true);
	}

	function onPointerCancel(e: PointerEvent): void {
		if (!pointer.owns(e)) return;
		finishPointerInteraction(false);
	}

	function destroy(): void {
		pointer.end();
		isScrubbing = false;
		if (longPressTimer) {
			clearTimeout(longPressTimer);
			longPressTimer = null;
		}
		weekChangeRaf.cancel();
	}

	return {
		get isScrubbing() {
			return isScrubbing;
		},
		get scrubWeek() {
			return scrubWeek;
		},
		get isActive() {
			return pointer.id !== null || isScrubbing;
		},
		get containerEl() {
			return containerEl;
		},
		set containerEl(el: HTMLElement | null) {
			containerEl = el;
		},
		onPointerDown,
		onPointerMove,
		onPointerUp,
		onPointerCancel,
		destroy
	};
}

export type CapsuleIndicatorGesture = ReturnType<typeof createCapsuleIndicatorGesture>;
