import {
	committedWeekFromScroll,
	pagerPreviewWeekFromScroll,
	scrollOffsetFromWeek,
	WEEK_PAGER_NEIGHBOR_RADIUS
} from './week-navigation';
import { createWeekPagerSnap } from './week-pager-snap';
import { createWeekPagerTouch } from './week-pager-touch';
import { weekPagerPageWidth } from './week-pager-metrics';

export interface WeekPagerContext {
	timetableId: string | null;
	startWeek: number;
	endWeek: number;
	displayedWeek: number;
	active: boolean;
	allowTouch: boolean;
}
export function createWeekPagerController(options: {
	setPreview(week: number): void;
	clearPreview(): void;
	setDisplayedWeek(week: number): void;
	onFirstMove(): void;
	onCompleted(): void;
}) {
	let context: WeekPagerContext | undefined;
	let node: HTMLElement | undefined;
	let dispose: (() => void) | undefined;
	let snap: ReturnType<typeof createWeekPagerSnap> | undefined;
	let touch: ReturnType<typeof createWeekPagerTouch> | undefined;
	let ready = $state(false);
	let paintWeek = $state(0);
	let adjacent = $state(false);
	let neighbors = $state(false);
	let active = $state(false);
	let held = false;
	let gestureStart: number | null = null;
	let generation = 0;
	let suppressUntil = 0;
	let settleTimer: ReturnType<typeof setTimeout> | undefined;
	let collapseTimer: ReturnType<typeof setTimeout> | undefined;
	let adjacentFrame = 0;

	function clearTimers() {
		clearTimeout(settleTimer);
		clearTimeout(collapseTimer);
		settleTimer = undefined;
		collapseTimer = undefined;
	}
	function position() {
		if (!node || !context || node.clientWidth <= 0) return;
		const left = scrollOffsetFromWeek(
			context.displayedWeek,
			weekPagerPageWidth(node),
			context.startWeek
		);
		if (Math.abs(node.scrollLeft - left) >= 2) {
			suppressUntil = Date.now() + 150;
			node.scrollTo({ left, behavior: 'instant' });
		}
		ready = true;
	}
	function interrupt() {
		generation++;
		clearTimers();
		touch?.cancel();
		snap?.cancel();
		gestureStart = null;
		neighbors = false;
		options.clearPreview();
		paintWeek = context?.displayedWeek ?? 0;
		position();
	}
	function expand() {
		clearTimeout(collapseTimer);
		neighbors = true;
	}
	function collapse() {
		clearTimeout(collapseTimer);
		if (held || gestureStart !== null) return;
		const task = generation;
		collapseTimer = setTimeout(() => {
			if (task === generation) neighbors = false;
		}, 120);
	}
	function publish() {
		if (!node || !context) return;
		const width = weekPagerPageWidth(node);
		const preview = pagerPreviewWeekFromScroll(
			node.scrollLeft,
			width,
			context.startWeek,
			context.endWeek
		);
		if (preview === null) return;
		options.setPreview(preview);
		paintWeek = Math.round(preview);
		const week = committedWeekFromScroll(
			node.scrollLeft,
			width,
			context.startWeek,
			context.endWeek
		);
		if (week !== null && week !== context.displayedWeek) {
			context = { ...context, displayedWeek: week };
			options.setDisplayedWeek(week);
		}
	}
	function finish() {
		if (!active || touch?.isActive || snap?.isAnimating || held || gestureStart === null) return;
		clearTimeout(settleTimer);
		const start = gestureStart;
		publish();
		gestureStart = null;
		options.clearPreview();
		if (context?.displayedWeek !== start) options.onCompleted();
		collapse();
	}
	function scroll() {
		if (!active || !node || !context || Date.now() < suppressUntil) return;
		if (node.clientWidth <= 0) return;
		expand();
		if (gestureStart === null) {
			generation++;
			gestureStart = context.displayedWeek;
			options.onFirstMove();
		}
		publish();
		clearTimeout(settleTimer);
		const task = generation;
		settleTimer = setTimeout(() => {
			if (task === generation && gestureStart !== null) publish();
		}, 90);
	}
	function sync(next: WeekPagerContext) {
		const previous = context;
		context = next;
		active = next.active;
		const changed =
			previous &&
			(previous.timetableId !== next.timetableId ||
				previous.startWeek !== next.startWeek ||
				previous.endWeek !== next.endWeek ||
				// publish() updates context before echoing a pager-driven week.
				previous.displayedWeek !== next.displayedWeek ||
				(previous.active && !next.active) ||
				(previous.allowTouch && !next.allowTouch));
		if (changed) interrupt();
		if (!next.active) {
			adjacent = false;
			cancelAnimationFrame(adjacentFrame);
		} else if (!previous?.active && node)
			adjacentFrame = requestAnimationFrame(() => {
				if (active) adjacent = true;
			});
		if (gestureStart === null) {
			paintWeek = next.displayedWeek;
			position();
		}
	}
	function attach(element: HTMLElement) {
		dispose?.();
		node = element;
		ready = false;
		held = false;
		generation++;
		const listeners = new AbortController();
		const eventOptions = { signal: listeners.signal, passive: true };
		const settled = () => {
			if (node === element) finish();
		};
		snap = createWeekPagerSnap(element, settled);
		touch = createWeekPagerTouch(element, {
			enabled: () => active && Boolean(context?.allowTouch),
			suspendSnap: (value) => snap?.setSuspended(value),
			onSettled: settled
		});
		element.addEventListener('scroll', scroll, eventOptions);
		element.addEventListener('scrollend', settled, eventOptions);
		element.addEventListener(
			'pointerdown',
			() => {
				held = true;
				if (active) expand();
			},
			eventOptions
		);
		const release = () => {
			held = false;
			collapse();
		};
		element.ownerDocument.addEventListener('pointerup', release, {
			...eventOptions,
			capture: true
		});
		element.ownerDocument.addEventListener('pointercancel', release, {
			...eventOptions,
			capture: true
		});
		for (const type of ['touchstart', 'wheel', 'keydown'])
			element.addEventListener(
				type,
				() => {
					if (active) {
						expand();
						collapse();
					}
				},
				eventOptions
			);
		const observer = new ResizeObserver(() => {
			if (node !== element) return;
			// Native snapping can align a resized page before delivering its scroll event.
			suppressUntil = Date.now() + 150;
			interrupt();
		});
		observer.observe(element);
		position();
		if (active)
			adjacentFrame = requestAnimationFrame(() => {
				if (node === element && active) adjacent = true;
			});
		let detached = false;
		dispose = () => {
			if (detached) return;
			detached = true;
			listeners.abort();
			observer.disconnect();
			interrupt();
			touch?.destroy();
			snap?.destroy();
			cancelAnimationFrame(adjacentFrame);
			touch = undefined;
			snap = undefined;
			node = undefined;
			adjacent = false;
			held = false;
			ready = false;
		};
		return dispose;
	}
	return {
		get state() {
			return {
				ready,
				paintWeek,
				paintAdjacent: adjacent,
				paintRadius: !active ? 0 : neighbors ? WEEK_PAGER_NEIGHBOR_RADIUS : 1
			};
		},
		attach,
		sync,
		destroy() {
			dispose?.();
			dispose = undefined;
		}
	};
}
