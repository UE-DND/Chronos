import { createHorizontalGesture, isReducedMotionActive } from '@chronos/ui-kit';
import { weekPagerPageWidth } from './week-pager-metrics';

const COMMIT_DISTANCE_RATIO = 0.23;
const FLING_DISTANCE_PX = 24;
const FLING_VELOCITY_PX_MS = 0.5;
const MIN_SETTLE_MS = 180;
const MAX_SETTLE_MS = 300;

/** Keep touch paging independent of the browser's fling distance and axis heuristic. */
export function createWeekPagerTouch(
	node: HTMLElement,
	{
		enabled,
		suspendSnap,
		onSettled
	}: { enabled: () => boolean; suspendSnap: (value: boolean) => void; onSettled: () => void }
) {
	const listeners = new AbortController();
	const options = { signal: listeners.signal };
	let pointerId: number | null = null;
	const axis = createHorizontalGesture();
	let direction: 'pending' | 'horizontal' | 'vertical' = 'pending';
	let startX = 0;
	let startY = 0;
	let startTime = 0;
	let startOffset = 0;
	let startPage = 0;
	let pageWidth = 0;
	let maxPage = 0;
	let needsSettle = false;
	let savedSnapType = '';
	let frame = 0;
	let animationGeneration = 0;

	function stopAnimation() {
		animationGeneration++;
		if (frame) cancelAnimationFrame(frame);
		frame = 0;
	}

	function restoreSnap() {
		node.style.scrollSnapType = savedSnapType;
		suspendSnap(false);
	}

	function cancel() {
		const wasActive = pointerId !== null || frame !== 0;
		stopAnimation();
		pointerId = null;
		axis.reset();
		direction = 'pending';
		if (wasActive) restoreSnap();
	}

	function settle(target: number) {
		stopAnimation();
		const from = node.scrollLeft;
		const distance = target - from;
		const duration = isReducedMotionActive()
			? 0
			: MIN_SETTLE_MS +
				Math.min(1, Math.abs(distance) / pageWidth) * (MAX_SETTLE_MS - MIN_SETTLE_MS);
		if (duration === 0 || Math.abs(target - from) < 1) {
			node.scrollLeft = target;
			restoreSnap();
			onSettled();
			return;
		}
		const task = animationGeneration;
		const started = performance.now();
		function step(now: number) {
			if (task !== animationGeneration) return;
			const t = Math.min(1, Math.max(0, (now - started) / duration));
			node.scrollLeft = from + distance * (1 - (1 - t) ** 2.25);
			if (t < 1) {
				frame = requestAnimationFrame(step);
			} else {
				node.scrollLeft = target;
				// Let the final scroll event update the week and indicator before clearing preview.
				frame = requestAnimationFrame(() => {
					if (task !== animationGeneration) return;
					frame = 0;
					restoreSnap();
					onSettled();
				});
			}
		}
		frame = requestAnimationFrame(step);
	}

	node.addEventListener(
		'pointerdown',
		(event) => {
			if (
				event.pointerType !== 'touch' ||
				!event.isPrimary ||
				pointerId !== null ||
				!enabled() ||
				node.clientWidth <= 0
			)
				return;
			pageWidth = weekPagerPageWidth(node);
			if (pageWidth <= 0) return;
			maxPage = Math.max(0, node.childElementCount - 1);
			const wasSettling = frame !== 0;
			stopAnimation();
			pointerId = event.pointerId;
			axis.reset();
			direction = 'pending';
			startX = event.clientX;
			startY = event.clientY;
			startTime = performance.now();
			startOffset = node.scrollLeft;
			startPage = Math.round(startOffset / pageWidth);
			needsSettle = wasSettling || Math.abs(startOffset - startPage * pageWidth) >= 1;
			if (!wasSettling) savedSnapType = node.style.scrollSnapType;
			suspendSnap(true);
			node.style.scrollSnapType = 'none';
		},
		options
	);

	node.ownerDocument.addEventListener(
		'pointermove',
		(event) => {
			if (event.pointerId !== pointerId) return;
			// A long press can hand this pointer to course dragging after pointerdown.
			if (!enabled()) {
				cancel();
				return;
			}
			const dx = event.clientX - startX;
			const dy = event.clientY - startY;
			if (direction === 'pending') direction = axis.update(dx, dy);
			if (direction !== 'horizontal') return;
			const width = pageWidth;
			const minOffset = Math.max(0, (startPage - 1) * width);
			const maxOffset = Math.min(maxPage * width, (startPage + 1) * width);
			node.scrollLeft = Math.max(minOffset, Math.min(maxOffset, startOffset - dx));
		},
		options
	);

	// touch-action: pan-y keeps native vertical scrolling available before axis selection.
	// Changing touch-action mid-gesture cannot stop that scroll; cancel touchmove instead.
	node.addEventListener(
		'touchmove',
		(event) => {
			if (pointerId === null) return;
			if (!enabled()) {
				cancel();
				return;
			}
			if (event.touches.length !== 1) return;
			const touch = event.touches[0]!;
			if (direction === 'pending')
				direction = axis.update(touch.clientX - startX, touch.clientY - startY);
			if (direction === 'horizontal' && event.cancelable) event.preventDefault();
		},
		{ ...options, passive: false }
	);

	function release(event: PointerEvent, canceled: boolean) {
		if (event.pointerId !== pointerId) return;
		if (!enabled()) {
			cancel();
			return;
		}
		pointerId = null;
		if (direction !== 'horizontal') {
			// Native vertical scrolling cancels pointers even when the pager never moved.
			if (needsSettle) settle(startPage * pageWidth);
			else {
				restoreSnap();
				onSettled();
			}
			return;
		}
		const dx = event.clientX - startX;
		const width = pageWidth;
		const elapsed = Math.max(1, performance.now() - startTime);
		const advance =
			!canceled &&
			(Math.abs(dx) >= width * COMMIT_DISTANCE_RATIO ||
				(Math.abs(dx) >= FLING_DISTANCE_PX && Math.abs(dx) / elapsed >= FLING_VELOCITY_PX_MS));
		const page = Math.max(0, Math.min(maxPage, startPage + (advance ? -Math.sign(dx) : 0)));
		settle(page * width);
	}

	node.ownerDocument.addEventListener('pointerup', (event) => release(event, false), options);
	node.ownerDocument.addEventListener('pointercancel', (event) => release(event, true), options);

	return {
		get isActive() {
			return pointerId !== null || frame !== 0;
		},
		cancel,
		destroy() {
			listeners.abort();
			cancel();
		}
	};
}
