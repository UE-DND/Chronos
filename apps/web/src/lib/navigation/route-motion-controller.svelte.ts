export const NATIVE_SLIDE_ENTER_CLASS = 'native-slide-enter';
export const NATIVE_SLIDE_EXIT_CLASS = 'native-slide-exit';
export const NATIVE_SHELL_MOTION_CLASS = 'native-shell-motion';

export interface RouteMotionElements {
	secondaryRoot?: HTMLElement | null;
	shellRoot?: HTMLElement | null;
}

export function isReducedMotionActive(): boolean {
	if (typeof window === 'undefined') return true;
	if (document.documentElement.classList.contains('reduce-motion')) return true;
	return window.matchMedia?.('(prefers-reduced-motion: reduce)')?.matches ?? false;
}

export function createRouteMotionController(
	resolveElements: () => RouteMotionElements = () => {
		if (typeof document === 'undefined') return {};
		return {
			secondaryRoot: document.querySelector<HTMLElement>('.secondary-root'),
			shellRoot: document.querySelector<HTMLElement>('.shell-root')
		};
	}
) {
	let activeGeneration = 0;
	let activeTimeout: ReturnType<typeof setTimeout> | null = null;

	function nextGeneration(): number {
		if (activeTimeout) {
			clearTimeout(activeTimeout);
			activeTimeout = null;
		}
		return ++activeGeneration;
	}

	function clearClasses(elements = resolveElements()): void {
		if (elements.secondaryRoot) {
			elements.secondaryRoot.classList.remove(NATIVE_SLIDE_ENTER_CLASS, NATIVE_SLIDE_EXIT_CLASS);
		}
		if (elements.shellRoot) {
			elements.shellRoot.classList.remove(NATIVE_SHELL_MOTION_CLASS);
			elements.shellRoot.style.removeProperty('--native-shell-duration');
		}
	}

	function cancelMotion(generation?: number): void {
		if (generation != null && generation !== activeGeneration) return;
		if (activeTimeout) {
			clearTimeout(activeTimeout);
			activeTimeout = null;
		}
		clearClasses();
	}

	async function animateBackExit(
		onStartOrDuration?: (() => void) | number,
		maybeDuration?: number
	): Promise<void> {
		const onStart = typeof onStartOrDuration === 'function' ? onStartOrDuration : undefined;
		const durationMs =
			typeof onStartOrDuration === 'number' ? onStartOrDuration : (maybeDuration ?? 220);

		if (isReducedMotionActive()) {
			onStart?.();
			return;
		}
		const generation = nextGeneration();
		const elements = resolveElements();
		clearClasses(elements);

		if (!elements.secondaryRoot) {
			onStart?.();
			return;
		}

		elements.secondaryRoot.classList.add(NATIVE_SLIDE_EXIT_CLASS);
		if (elements.shellRoot) {
			elements.shellRoot.style.setProperty('--native-shell-duration', `${durationMs}ms`);
			elements.shellRoot.classList.add(NATIVE_SHELL_MOTION_CLASS);
		}

		onStart?.();

		await new Promise<void>((resolve) => {
			activeTimeout = setTimeout(() => {
				activeTimeout = null;
				if (generation === activeGeneration) {
					clearClasses(elements);
				}
				resolve();
			}, durationMs);
		});
	}

	async function animateForwardEnter(
		onStartOrDuration?: (() => void) | number,
		maybeDuration?: number
	): Promise<void> {
		const onStart = typeof onStartOrDuration === 'function' ? onStartOrDuration : undefined;
		const durationMs =
			typeof onStartOrDuration === 'number' ? onStartOrDuration : (maybeDuration ?? 260);

		if (isReducedMotionActive()) {
			onStart?.();
			return;
		}
		const generation = nextGeneration();
		const elements = resolveElements();
		clearClasses(elements);

		if (!elements.secondaryRoot) {
			onStart?.();
			return;
		}

		elements.secondaryRoot.classList.add(NATIVE_SLIDE_ENTER_CLASS);
		if (elements.shellRoot) {
			elements.shellRoot.style.setProperty('--native-shell-duration', `${durationMs}ms`);
			elements.shellRoot.classList.add(NATIVE_SHELL_MOTION_CLASS);
		}

		onStart?.();

		await new Promise<void>((resolve) => {
			activeTimeout = setTimeout(() => {
				activeTimeout = null;
				if (generation === activeGeneration) {
					clearClasses(elements);
				}
				resolve();
			}, durationMs);
		});
	}

	return {
		get activeGeneration(): number {
			return activeGeneration;
		},
		animateBackExit,
		animateForwardEnter,
		cancelMotion,
		clearClasses
	};
}

export type RouteMotionController = ReturnType<typeof createRouteMotionController>;
export const routeMotionController = createRouteMotionController();
