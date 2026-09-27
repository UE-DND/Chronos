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

	let startX = 0;
	let startY = 0;
	let startTime = 0;
	let isTracking = false;
	let directionLocked = false;
	let isSwiping = false;
	let activeTouchId: number | null = null;
	let gestureRevealsShell = true;
	let cleanupTimeout: ReturnType<typeof setTimeout> | null = null;

	function resolveSecondary(): HTMLElement | null {
		return (
			options.getSecondaryElement?.() ??
			(typeof document !== 'undefined'
				? document.querySelector<HTMLElement>('.secondary-root')
				: null)
		);
	}

	function resolveShell(): HTMLElement | null {
		return (
			options.getShellElement?.() ??
			(typeof document !== 'undefined' ? document.querySelector<HTMLElement>('.shell-root') : null)
		);
	}

	function clearStyles(secondary = resolveSecondary(), shell = resolveShell()): void {
		if (secondary) {
			secondary.style.removeProperty('transform');
			secondary.style.removeProperty('transition');
			secondary.style.removeProperty('box-shadow');
		}
		if (shell) {
			shell.style.removeProperty('transform');
			shell.style.removeProperty('transition');
			shell.style.removeProperty('opacity');
		}
	}

	function resetState(): void {
		isTracking = false;
		directionLocked = false;
		isSwiping = false;
		activeTouchId = null;
	}

	function handleTouchStart(event: TouchEvent): void {
		if (isReducedMotionActive() || !options.canSwipeBack()) return;
		if (event.touches.length !== 1) return;

		const touch = event.touches[0];
		if (touch.clientX > maxEdgeX) return;
		if (isElementSwipeDisabled(event.target)) return;

		if (cleanupTimeout) {
			clearTimeout(cleanupTimeout);
			cleanupTimeout = null;
			clearStyles();
		}

		startX = touch.clientX;
		startY = touch.clientY;
		startTime = performance.now();
		activeTouchId = touch.identifier;
		gestureRevealsShell = options.revealsShell?.() ?? true;
		isTracking = true;
		directionLocked = false;
		isSwiping = false;
	}

	function handleTouchMove(event: TouchEvent): void {
		if (!isTracking) return;

		let touch: Touch | undefined;
		for (let i = 0; i < event.touches.length; i++) {
			if (event.touches[i].identifier === activeTouchId) {
				touch = event.touches[i];
				break;
			}
		}
		if (!touch) return;

		const dx = touch.clientX - startX;
		const dy = touch.clientY - startY;

		if (!directionLocked) {
			const dist = Math.hypot(dx, dy);
			if (dist > 8) {
				if (dx > 0 && Math.abs(dx) > Math.abs(dy) * 1.25) {
					directionLocked = true;
					isSwiping = true;
					options.onGestureStart?.();
				} else {
					resetState();
					return;
				}
			} else {
				return;
			}
		}

		if (isSwiping) {
			if (event.cancelable) event.preventDefault();

			const secondary = resolveSecondary();
			const shell = resolveShell();
			const width = (typeof window !== 'undefined' ? window.innerWidth : 360) || 360;
			const currentX = Math.max(0, dx);
			const progress = Math.min(1, currentX / width);

			if (secondary) {
				secondary.style.transition = 'none';
				secondary.style.transform = `translate3d(${currentX}px, 0, 0)`;
			}

			if (shell && gestureRevealsShell) {
				const shellX = -25 * (1 - progress);
				const shellOpacity = 0.55 + 0.45 * progress;
				shell.style.transition = 'none';
				shell.style.transform = `translate3d(${shellX}%, 0, 0)`;
				shell.style.opacity = `${shellOpacity}`;
			}
		}
	}

	function handleTouchEnd(event: TouchEvent): void {
		if (!isTracking && !isSwiping) return;

		let touch: Touch | undefined;
		for (let i = 0; i < event.changedTouches.length; i++) {
			if (event.changedTouches[i].identifier === activeTouchId) {
				touch = event.changedTouches[i];
				break;
			}
		}

		if (!touch) {
			if (isSwiping) {
				cancelGesture();
			} else {
				resetState();
			}
			return;
		}

		const dx = touch.clientX - startX;
		const elapsed = Math.max(1, performance.now() - startTime);
		const velocity = dx / elapsed;
		const width = (typeof window !== 'undefined' ? window.innerWidth : 360) || 360;
		const progress = Math.min(1, Math.max(0, dx) / width);

		const shouldCommit =
			event.type === 'touchend' && (progress > 0.35 || (velocity > 0.35 && dx > 30));

		if (shouldCommit) {
			commitGesture();
		} else {
			cancelGesture();
		}
	}

	function commitGesture(): void {
		const secondary = resolveSecondary();
		const shell = resolveShell();
		resetState();

		if (secondary) {
			secondary.style.transition = 'transform 200ms cubic-bezier(0.2, 0.9, 0.4, 1)';
			secondary.style.transform = 'translate3d(100%, 0, 0)';
		}
		if (shell && gestureRevealsShell) {
			shell.style.transition =
				'transform 200ms cubic-bezier(0.2, 0.9, 0.4, 1), opacity 200ms cubic-bezier(0.2, 0.9, 0.4, 1)';
			shell.style.transform = 'translate3d(0, 0, 0)';
			shell.style.opacity = '1';
		}

		cleanupTimeout = setTimeout(() => {
			cleanupTimeout = null;
			requestSuppressNextTransition();
			let settled = false;
			const settle = () => {
				if (settled) return;
				settled = true;
				if (cleanupTimeout) clearTimeout(cleanupTimeout);
				cleanupTimeout = null;
				clearStyles(secondary, shell);
				options.onGestureEnd?.();
			};
			// Keep the completed gesture frame in place until SvelteKit commits the back route.
			cleanupTimeout = setTimeout(settle, 1500);
			try {
				void Promise.resolve(options.onBack()).then(settle, settle);
			} catch {
				settle();
			}
		}, 200);
	}

	function cancelGesture(): void {
		const secondary = resolveSecondary();
		const shell = resolveShell();
		resetState();

		if (secondary) {
			secondary.style.transition = 'transform 200ms cubic-bezier(0.2, 0.9, 0.4, 1)';
			secondary.style.transform = 'translate3d(0, 0, 0)';
		}
		if (shell && gestureRevealsShell) {
			shell.style.transition =
				'transform 200ms cubic-bezier(0.2, 0.9, 0.4, 1), opacity 200ms cubic-bezier(0.2, 0.9, 0.4, 1)';
			shell.style.transform = 'translate3d(-25%, 0, 0)';
			shell.style.opacity = '0.55';
		}

		cleanupTimeout = setTimeout(() => {
			cleanupTimeout = null;
			clearStyles(secondary, shell);
			options.onGestureEnd?.();
		}, 200);
	}

	function attach(target: EventTarget = window): () => void {
		target.addEventListener('touchstart', handleTouchStart as EventListener, { passive: true });
		target.addEventListener('touchmove', handleTouchMove as EventListener, { passive: false });
		target.addEventListener('touchend', handleTouchEnd as EventListener, { passive: true });
		target.addEventListener('touchcancel', handleTouchEnd as EventListener, { passive: true });

		return () => {
			if (cleanupTimeout) {
				clearTimeout(cleanupTimeout);
				cleanupTimeout = null;
			}
			target.removeEventListener('touchstart', handleTouchStart as EventListener);
			target.removeEventListener('touchmove', handleTouchMove as EventListener);
			target.removeEventListener('touchend', handleTouchEnd as EventListener);
			target.removeEventListener('touchcancel', handleTouchEnd as EventListener);
			clearStyles();
			resetState();
		};
	}

	return {
		attach,
		get isSwiping(): boolean {
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
