import { createHorizontalGesture } from '@chronos/ui-kit';
import { haptic } from '#lib/haptic/haptic.ts';

const SCROLL_SURFACE_SELECTOR = '.native-overscroll-y, .secondary-scroll';
const MAX_PULL_PX = 56;
const MIN_HAPTIC_PULL_PX = 12;
const INDICATOR_HEIGHT_PX = 32;
const MAX_OPACITY = 0.36;
const HIDE_DELAY_MS = 180;

type ActivePull = {
	node: HTMLElement;
	identifier: number;
	startX: number;
	startY: number;
	lastY: number;
	strength: number;
};

function findScrollSurface(target: EventTarget | null): HTMLElement | null {
	if (!(target instanceof Element)) return null;
	return target.closest<HTMLElement>(SCROLL_SURFACE_SELECTOR);
}

/** Shows a brief edge glow without moving or intercepting the scroll surface. */
export function installScrollBoundaryFeedback(doc: Document = document): () => void {
	const indicator = doc.createElement('div');
	indicator.className = 'scroll-boundary-feedback';
	indicator.setAttribute('aria-hidden', 'true');
	doc.body.append(indicator);

	let activePull: ActivePull | null = null;
	const axis = createHorizontalGesture();
	let hideTimer: ReturnType<typeof setTimeout> | undefined;

	function hideIndicator() {
		indicator.style.opacity = '0';
		if (hideTimer !== undefined) clearTimeout(hideTimer);
		hideTimer = setTimeout(() => {
			indicator.removeAttribute('data-edge');
			hideTimer = undefined;
		}, HIDE_DELAY_MS);
	}

	function hide() {
		activePull = null;
		hideIndicator();
	}

	function show(node: HTMLElement, edge: 'top' | 'bottom', strength: number) {
		const rect = node.getBoundingClientRect();
		indicator.dataset.edge = edge;
		indicator.style.left = `${rect.left}px`;
		indicator.style.top = `${edge === 'top' ? rect.top : rect.bottom - INDICATOR_HEIGHT_PX}px`;
		indicator.style.width = `${rect.width}px`;
		indicator.style.opacity = String(Math.min(1, strength / MAX_PULL_PX) * MAX_OPACITY);
		if (hideTimer !== undefined) {
			clearTimeout(hideTimer);
			hideTimer = undefined;
		}
	}

	function onTouchStart(event: TouchEvent) {
		if (event.touches.length !== 1) {
			hide();
			return;
		}

		const touch = event.touches[0];
		const node = findScrollSurface(event.target);
		if (!touch || !node) {
			hide();
			return;
		}

		if (hideTimer !== undefined) {
			clearTimeout(hideTimer);
			hideTimer = undefined;
		}
		axis.reset();
		activePull = {
			node,
			identifier: touch.identifier,
			startX: touch.clientX,
			startY: touch.clientY,
			lastY: touch.clientY,
			strength: 0
		};
	}

	function onTouchMove(event: TouchEvent) {
		if (!activePull) return;
		if (event.defaultPrevented) {
			hide();
			return;
		}
		if (event.touches.length !== 1) {
			hide();
			return;
		}

		const touch = Array.from(event.touches).find(
			(candidate) => candidate.identifier === activePull?.identifier
		);
		if (!touch) {
			hide();
			return;
		}

		const deltaY = touch.clientY - activePull.lastY;
		activePull.lastY = touch.clientY;
		if (
			axis.update(touch.clientX - activePull.startX, touch.clientY - activePull.startY) !==
				'vertical' ||
			Math.abs(deltaY) < 1
		)
			return;

		const maxScrollTop = Math.max(0, activePull.node.scrollHeight - activePull.node.clientHeight);
		const atTop = activePull.node.scrollTop <= 0.5;
		const atBottom = activePull.node.scrollTop >= maxScrollTop - 0.5;
		const edge = atTop && deltaY > 0 ? 'top' : atBottom && deltaY < 0 ? 'bottom' : null;

		if (!edge) {
			activePull.strength = 0;
			hideIndicator();
			return;
		}

		activePull.strength = Math.min(MAX_PULL_PX, activePull.strength + Math.abs(deltaY));
		show(activePull.node, edge, activePull.strength);
	}

	function onTouchEnd(event: TouchEvent) {
		if (!activePull) return;
		const ended = Array.from(event.changedTouches).some(
			(touch) => touch.identifier === activePull?.identifier
		);
		if (ended || event.touches.length === 0) {
			if (activePull.strength >= MIN_HAPTIC_PULL_PX) haptic.light();
			hide();
		}
	}

	function onWheel(event: WheelEvent) {
		const node = findScrollSurface(event.target);
		if (!node || Math.abs(event.deltaY) < 1 || Math.abs(event.deltaX) >= Math.abs(event.deltaY))
			return;

		const maxScrollTop = Math.max(0, node.scrollHeight - node.clientHeight);
		const atTop = node.scrollTop <= 0.5;
		const atBottom = node.scrollTop >= maxScrollTop - 0.5;
		const edge = atTop && event.deltaY < 0 ? 'top' : atBottom && event.deltaY > 0 ? 'bottom' : null;
		if (!edge) return;

		show(node, edge, Math.min(MAX_PULL_PX, Math.abs(event.deltaY)));
		if (hideTimer !== undefined) clearTimeout(hideTimer);
		hideTimer = setTimeout(hideIndicator, 220);
	}

	doc.addEventListener('touchstart', onTouchStart, { passive: true, capture: true });
	// Observe after the target has had a chance to claim paging or dragging.
	doc.addEventListener('touchmove', onTouchMove, { passive: true });
	doc.addEventListener('touchend', onTouchEnd, { passive: true, capture: true });
	doc.addEventListener('touchcancel', hide, { passive: true, capture: true });
	doc.addEventListener('wheel', onWheel, { passive: true, capture: true });

	return () => {
		doc.removeEventListener('touchstart', onTouchStart, true);
		doc.removeEventListener('touchmove', onTouchMove);
		doc.removeEventListener('touchend', onTouchEnd, true);
		doc.removeEventListener('touchcancel', hide, true);
		doc.removeEventListener('wheel', onWheel, true);
		if (hideTimer !== undefined) clearTimeout(hideTimer);
		indicator.remove();
	};
}
