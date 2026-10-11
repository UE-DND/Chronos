import {
	createHorizontalGesture,
	createGestureVelocity,
	createScalarSpring,
	projectMomentum
} from '@chronos/ui-kit';
import { isReducedMotionActive } from './route-motion-controller.svelte';
import { requestSuppressNextTransition } from './page-view-transition.svelte';

export interface EdgeSwipeBackOptions {
	getSecondaryElement?: () => HTMLElement | null;
	getShellElement?: () => HTMLElement | null;
	canSwipeBack: () => boolean;
	onBack: () => void | Promise<void>;
	revealsShell?: () => boolean;
	onGestureStart?: () => void;
	onGestureEnd?: () => void;
	maxEdgeX?: number;
}

export function isElementSwipeDisabled(target: EventTarget | null): boolean {
	if (!target || typeof (target as { closest?: unknown }).closest !== 'function') return false;
	return Boolean(
		(target as Element).closest('[data-disable-edge-swipe="true"], [data-disable-edge-swipe]')
	);
}

export function createEdgeSwipeBack(options: EdgeSwipeBackOptions) {
	const maxEdgeX = options.maxEdgeX ?? 28;
	const axis = createHorizontalGesture();
	const velocity = createGestureVelocity();
	let startX = 0;
	let startY = 0;
	let startOffset = 0;
	let isTracking = false;
	let isSwiping = false;
	let gestureActive = false;
	let navigating = false;
	let activeTouchId: number | null = null;
	let gestureRevealsShell = true;
	let generation = 0;
	let cleanupTimeout: ReturnType<typeof setTimeout> | null = null;
	const resolveSecondary = () =>
		options.getSecondaryElement?.() ?? document.querySelector<HTMLElement>('.secondary-root');
	const resolveShell = () =>
		options.getShellElement?.() ?? document.querySelector<HTMLElement>('.shell-root');
	const width = () => window.innerWidth || 360;
	const spring = createScalarSpring(paint);

	function paint(offset: number) {
		const x = Math.max(0, Math.min(width(), offset));
		const secondary = resolveSecondary();
		const shell = resolveShell();
		if (secondary) {
			secondary.style.transition = 'none';
			secondary.style.transform = `translate3d(${x}px, 0, 0)`;
		}
		if (shell && gestureRevealsShell) {
			const progress = x / width();
			shell.style.transition = 'none';
			shell.style.transform = `translate3d(${-25 * (1 - progress)}%, 0, 0)`;
			shell.style.opacity = `${0.55 + 0.45 * progress}`;
		}
	}
	function clearStyles(secondary = resolveSecondary(), shell = resolveShell()) {
		for (const el of [secondary, shell]) {
			el?.style.removeProperty('transform');
			el?.style.removeProperty('transition');
		}
		secondary?.style.removeProperty('box-shadow');
		shell?.style.removeProperty('opacity');
	}
	function resetState() {
		isTracking = false;
		axis.reset();
		isSwiping = false;
		activeTouchId = null;
	}
	function finish() {
		if (cleanupTimeout) clearTimeout(cleanupTimeout);
		cleanupTimeout = null;
		navigating = false;
		clearStyles();
		if (gestureActive) {
			gestureActive = false;
			options.onGestureEnd?.();
		}
	}
	function handleTouchStart(event: TouchEvent) {
		if (isReducedMotionActive() || !options.canSwipeBack() || navigating) return;
		if (event.touches.length !== 1) {
			if (isSwiping) cancelGesture();
			else resetState();
			return;
		}
		if (isTracking) return;
		const touch = event.touches[0]!;
		if (touch.clientX > maxEdgeX || isElementSwipeDisabled(event.target)) return;
		generation++;
		startOffset = spring.running ? Math.max(0, Math.min(width(), spring.value)) : 0;
		spring.cancel();
		startX = touch.clientX;
		startY = touch.clientY;
		velocity.reset(touch.clientX);
		activeTouchId = touch.identifier;
		if (!gestureActive) gestureRevealsShell = options.revealsShell?.() ?? true;
		isTracking = true;
		axis.reset();
		isSwiping = false;
	}
	function handleTouchMove(event: TouchEvent) {
		if (!isTracking) return;
		if (event.touches.length !== 1) {
			if (isSwiping || gestureActive) cancelGesture();
			else resetState();
			return;
		}
		const touch = Array.from(event.touches).find((item) => item.identifier === activeTouchId);
		if (!touch) return;
		velocity.add(touch.clientX);
		const dx = touch.clientX - startX;
		const direction = axis.update(dx, touch.clientY - startY);
		if (direction === 'vertical' || (direction === 'horizontal' && dx <= 0 && startOffset === 0)) {
			if (isSwiping || gestureActive) cancelGesture();
			else resetState();
			return;
		}
		if (direction !== 'horizontal') return;
		if (!gestureActive) {
			gestureActive = true;
			options.onGestureStart?.();
		}
		isSwiping = true;
		if (event.cancelable) event.preventDefault();
		spring.jump(Math.max(0, Math.min(width(), startOffset + dx)));
	}
	function handleTouchEnd(event: TouchEvent) {
		if (!isSwiping) {
			if (gestureActive) cancelGesture();
			else resetState();
			return;
		}
		const touch = Array.from(event.changedTouches).find(
			(item) => item.identifier === activeTouchId
		);
		if (!touch || event.type !== 'touchend') {
			cancelGesture();
			return;
		}
		velocity.add(touch.clientX);
		const releaseVelocity = velocity.velocity();
		const offset = Math.max(0, startOffset + touch.clientX - startX);
		const shouldCommit =
			axis.update(touch.clientX - startX, touch.clientY - startY) === 'horizontal' &&
			releaseVelocity > -0.1 &&
			(offset / width() > 0.35 ||
				(releaseVelocity > 0.35 &&
					offset > 30 &&
					(offset + projectMomentum(releaseVelocity)) / width() > 0.35));
		if (shouldCommit) commitGesture(releaseVelocity);
		else cancelGesture(releaseVelocity);
	}
	function commitGesture(releaseVelocity = 0) {
		resetState();
		const task = ++generation;
		spring.animate(width(), releaseVelocity, () => {
			if (task !== generation) return;
			navigating = true;
			requestSuppressNextTransition();
			// Keep the preview until the router commits; a teardown invalidates this completion.
			const settle = () => {
				if (task === generation) finish();
			};
			cleanupTimeout = setTimeout(settle, 1500);
			try {
				void Promise.resolve(options.onBack()).then(settle, settle);
			} catch {
				settle();
			}
		});
	}
	function cancelGesture(releaseVelocity = 0) {
		resetState();
		const task = ++generation;
		spring.animate(0, releaseVelocity, () => {
			if (task === generation) finish();
		});
	}
	function attach(target: EventTarget = window): () => void {
		target.addEventListener('touchstart', handleTouchStart as EventListener, { passive: true });
		target.addEventListener('touchmove', handleTouchMove as EventListener, { passive: false });
		target.addEventListener('touchend', handleTouchEnd as EventListener, { passive: true });
		target.addEventListener('touchcancel', handleTouchEnd as EventListener, { passive: true });
		return () => {
			generation++;
			spring.cancel();
			finish();
			resetState();
			target.removeEventListener('touchstart', handleTouchStart as EventListener);
			target.removeEventListener('touchmove', handleTouchMove as EventListener);
			target.removeEventListener('touchend', handleTouchEnd as EventListener);
			target.removeEventListener('touchcancel', handleTouchEnd as EventListener);
		};
	}
	return {
		attach,
		get isSwiping() {
			return isSwiping;
		},
		handleTouchStart,
		handleTouchMove,
		handleTouchEnd,
		commitGesture,
		cancelGesture,
		clearStyles
	};
}

export function edgeSwipeBackAction(node: HTMLElement, options: EdgeSwipeBackOptions) {
	const controller = createEdgeSwipeBack(options);
	const cleanup = controller.attach(node);

	return {
		destroy() {
			cleanup();
		}
	};
}
