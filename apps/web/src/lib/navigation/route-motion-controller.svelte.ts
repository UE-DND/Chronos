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
	let activeAnimations: Animation[] = [];

	function cancelMotion(): void {
		++activeGeneration;
		for (const animation of activeAnimations) animation.cancel();
		activeAnimations = [];
	}

	async function animate(
		direction: 'forward' | 'back',
		onStart?: () => void,
		animateShell = true
	): Promise<boolean> {
		cancelMotion();
		const generation = activeGeneration;
		const { secondaryRoot, shellRoot } = resolveElements();
		if (isReducedMotionActive() || !secondaryRoot) {
			onStart?.();
			return true;
		}

		const forward = direction === 'forward';
		const duration = forward ? 260 : 220;
		const secondaryFrames = forward
			? [
					{ transform: 'translateX(100%)', opacity: 0.95 },
					{ transform: 'translateX(0)', opacity: 1 }
				]
			: [
					{ transform: 'translateX(0)', opacity: 1 },
					{ transform: 'translateX(100%)', opacity: 0.95 }
				];
		activeAnimations.push(
			secondaryRoot.animate(secondaryFrames, {
				duration,
				easing: forward ? 'cubic-bezier(0.05, 0.7, 0.1, 1)' : 'cubic-bezier(0.3, 0, 0.8, 0.15)',
				fill: 'both'
			})
		);
		if (animateShell && shellRoot) {
			const shellFrames = [
				{ transform: 'translateX(0)', opacity: 1 },
				{ transform: 'translateX(-25%)', opacity: 0.55 }
			];
			activeAnimations.push(
				shellRoot.animate(forward ? shellFrames : shellFrames.toReversed(), {
					duration,
					easing: 'cubic-bezier(0.05, 0.7, 0.1, 1)',
					fill: 'both'
				})
			);
		}

		// Register rejection handlers before onStart can trigger cancellation.
		const finished = Promise.all(activeAnimations.map((animation) => animation.finished)).then(
			() => generation === activeGeneration,
			() => false
		);
		onStart?.();
		// Keep the final frame until the router commits and releases the motion.
		return finished;
	}

	return {
		animateBackExit: (onStart?: () => void, animateShell = true) =>
			animate('back', onStart, animateShell),
		animateForwardEnter: (onStart?: () => void, animateShell = true) =>
			animate('forward', onStart, animateShell),
		cancelMotion
	};
}

export type RouteMotionController = ReturnType<typeof createRouteMotionController>;
export const routeMotionController = createRouteMotionController();
