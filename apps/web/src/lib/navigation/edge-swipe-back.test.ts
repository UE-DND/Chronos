import { afterEach, beforeEach, describe, expect, it, vi } from 'vite-plus/test';
import {
	createEdgeSwipeBack,
	isElementSwipeDisabled,
	type EdgeSwipeBackOptions
} from './edge-swipe-back.svelte';

function createMockTouchElement() {
	const styles: Record<string, string> = {};
	return {
		style: {
			setProperty: (prop: string, val: string) => {
				styles[prop] = val;
			},
			removeProperty: (prop: string) => {
				delete styles[prop];
			},
			get transform() {
				return styles.transform ?? '';
			},
			set transform(v: string) {
				styles.transform = v;
			},
			get transition() {
				return styles.transition ?? '';
			},
			set transition(v: string) {
				styles.transition = v;
			},
			get opacity() {
				return styles.opacity ?? '';
			},
			set opacity(v: string) {
				styles.opacity = v;
			},
			get boxShadow() {
				return styles['box-shadow'] ?? '';
			},
			set boxShadow(v: string) {
				styles['box-shadow'] = v;
			}
		}
	} as unknown as HTMLElement;
}

function mockTouchEvent(
	type: 'touchstart' | 'touchmove' | 'touchend' | 'touchcancel',
	touches: Array<{ clientX: number; clientY: number; identifier: number }>,
	target?: EventTarget
): TouchEvent {
	return {
		type,
		touches: type === 'touchend' || type === 'touchcancel' ? [] : (touches as unknown as TouchList),
		changedTouches: touches as unknown as TouchList,
		target: target ?? null,
		cancelable: true,
		preventDefault: vi.fn()
	} as unknown as TouchEvent;
}

describe('edge-swipe-back', () => {
	let secondaryEl: HTMLElement;
	let shellEl: HTMLElement;
	let onBack: ReturnType<typeof vi.fn<() => void>>;
	let onGestureStart: ReturnType<typeof vi.fn<() => void>>;
	let onGestureEnd: ReturnType<typeof vi.fn<() => void>>;
	let canSwipeBack: boolean;
	let revealsShell: boolean;

	beforeEach(() => {
		vi.useFakeTimers();
		secondaryEl = createMockTouchElement();
		shellEl = createMockTouchElement();
		onBack = vi.fn<() => void>();
		onGestureStart = vi.fn<() => void>();
		onGestureEnd = vi.fn<() => void>();
		canSwipeBack = true;
		revealsShell = true;

		vi.stubGlobal('window', {
			innerWidth: 400,
			matchMedia: vi.fn().mockReturnValue({ matches: false })
		});
		vi.stubGlobal('document', {
			documentElement: {
				classList: {
					contains: () => false
				}
			}
		});
	});

	afterEach(() => {
		vi.useRealTimers();
		vi.unstubAllGlobals();
	});

	function makeController(overrides: Partial<EdgeSwipeBackOptions> = {}) {
		return createEdgeSwipeBack({
			getSecondaryElement: () => secondaryEl,
			getShellElement: () => shellEl,
			canSwipeBack: () => canSwipeBack,
			revealsShell: () => revealsShell,
			onBack,
			onGestureStart,
			onGestureEnd,
			...overrides
		});
	}

	it('ignores touchstart when clientX exceeds maxEdgeX', () => {
		const controller = makeController({ maxEdgeX: 28 });
		controller.handleTouchStart(
			mockTouchEvent('touchstart', [{ clientX: 50, clientY: 100, identifier: 1 }])
		);

		controller.handleTouchMove(
			mockTouchEvent('touchmove', [{ clientX: 150, clientY: 100, identifier: 1 }])
		);
		expect(controller.isSwiping).toBe(false);
		expect(onGestureStart).not.toHaveBeenCalled();
	});

	it('locks horizontal swipe and updates element transforms', () => {
		const controller = makeController({ maxEdgeX: 28 });
		controller.handleTouchStart(
			mockTouchEvent('touchstart', [{ clientX: 10, clientY: 100, identifier: 1 }])
		);

		// Small movement, not locked yet
		controller.handleTouchMove(
			mockTouchEvent('touchmove', [{ clientX: 14, clientY: 101, identifier: 1 }])
		);
		expect(controller.isSwiping).toBe(false);

		// Horizontal movement >= 24px
		controller.handleTouchMove(
			mockTouchEvent('touchmove', [{ clientX: 40, clientY: 102, identifier: 1 }])
		);
		expect(controller.isSwiping).toBe(true);
		expect(onGestureStart).toHaveBeenCalledTimes(1);

		expect(secondaryEl.style.transform).toContain('translate3d');
		expect(shellEl.style.transform).toContain('translate3d');
	});

	it('cancels tracking when vertical movement dominates', () => {
		const controller = makeController({ maxEdgeX: 28 });
		controller.handleTouchStart(
			mockTouchEvent('touchstart', [{ clientX: 10, clientY: 100, identifier: 1 }])
		);

		// Vertical movement > 8px
		controller.handleTouchMove(
			mockTouchEvent('touchmove', [{ clientX: 12, clientY: 130, identifier: 1 }])
		);
		expect(controller.isSwiping).toBe(false);
		expect(onGestureStart).not.toHaveBeenCalled();
	});

	it('commits gesture and calls onBack when progress exceeds 35%', async () => {
		const controller = makeController({ maxEdgeX: 28 });
		controller.handleTouchStart(
			mockTouchEvent('touchstart', [{ clientX: 10, clientY: 100, identifier: 1 }])
		);

		// Swipe right by 160px on 400px screen (40% > 35%)
		controller.handleTouchMove(
			mockTouchEvent('touchmove', [{ clientX: 170, clientY: 100, identifier: 1 }])
		);
		expect(controller.isSwiping).toBe(true);

		controller.handleTouchEnd(
			mockTouchEvent('touchend', [{ clientX: 170, clientY: 100, identifier: 1 }])
		);

		// In-flight commit transition
		expect(secondaryEl.style.transform).toBe('translate3d(100%, 0, 0)');
		expect(shellEl.style.transform).toBe('translate3d(0, 0, 0)');

		vi.advanceTimersByTime(200);
		expect(onBack).toHaveBeenCalledTimes(1);
		await Promise.resolve();
		expect(secondaryEl.style.transform).toBe('');
		expect(onGestureEnd).toHaveBeenCalledTimes(1);
	});

	it('keeps the completed shell preview until back navigation commits', async () => {
		let finishNavigation!: () => void;
		const onBackAsync = vi.fn(() => new Promise<void>((resolve) => (finishNavigation = resolve)));
		const controller = makeController({ maxEdgeX: 28, onBack: onBackAsync });
		controller.handleTouchStart(
			mockTouchEvent('touchstart', [{ clientX: 10, clientY: 100, identifier: 1 }])
		);
		controller.handleTouchMove(
			mockTouchEvent('touchmove', [{ clientX: 170, clientY: 100, identifier: 1 }])
		);
		controller.handleTouchEnd(
			mockTouchEvent('touchend', [{ clientX: 170, clientY: 100, identifier: 1 }])
		);

		vi.advanceTimersByTime(200);
		expect(onBackAsync).toHaveBeenCalledOnce();
		expect(shellEl.style.transform).toBe('translate3d(0, 0, 0)');
		expect(secondaryEl.style.transform).toBe('translate3d(100%, 0, 0)');
		expect(onGestureEnd).not.toHaveBeenCalled();

		finishNavigation();
		await Promise.resolve();
		expect(secondaryEl.style.transform).toBe('');
		expect(shellEl.style.transform).toBe('');
		expect(onGestureEnd).toHaveBeenCalledOnce();
	});

	it('keeps the shell receded when a nested secondary route is the back target', () => {
		revealsShell = false;
		const controller = makeController({ maxEdgeX: 28 });
		controller.handleTouchStart(
			mockTouchEvent('touchstart', [{ clientX: 10, clientY: 100, identifier: 1 }])
		);
		controller.handleTouchMove(
			mockTouchEvent('touchmove', [{ clientX: 100, clientY: 100, identifier: 1 }])
		);

		expect(secondaryEl.style.transform).toContain('translate3d');
		expect(shellEl.style.transform).toBe('');
		expect(shellEl.style.opacity).toBe('');
	});

	it('cancels gesture and springs back when progress is low', () => {
		const controller = makeController({ maxEdgeX: 28 });
		controller.handleTouchStart(
			mockTouchEvent('touchstart', [{ clientX: 10, clientY: 100, identifier: 1 }])
		);

		// Swipe right by only 30px (7.5%)
		controller.handleTouchMove(
			mockTouchEvent('touchmove', [{ clientX: 40, clientY: 100, identifier: 1 }])
		);
		expect(controller.isSwiping).toBe(true);

		controller.handleTouchEnd(
			mockTouchEvent('touchend', [{ clientX: 40, clientY: 100, identifier: 1 }])
		);

		expect(secondaryEl.style.transform).toBe('translate3d(0, 0, 0)');
		expect(shellEl.style.transform).toBe('translate3d(-25%, 0, 0)');

		vi.advanceTimersByTime(200);
		expect(onBack).not.toHaveBeenCalled();
		expect(onGestureEnd).toHaveBeenCalledTimes(1);
	});

	it('checks isElementSwipeDisabled correctly', () => {
		const disabledEl = {
			closest: (sel: string) => sel.includes('data-disable-edge-swipe')
		};
		expect(isElementSwipeDisabled(disabledEl as unknown as EventTarget)).toBe(true);

		const enabledEl = {
			closest: () => null
		};
		expect(isElementSwipeDisabled(enabledEl as unknown as EventTarget)).toBe(false);
	});

	it.each(['touchmove', 'touchend'] as const)(
		'rejects initial horizontal jitter followed by vertical motion on %s',
		(type) => {
			const controller = makeController();
			controller.handleTouchStart(
				mockTouchEvent('touchstart', [{ clientX: 10, clientY: 100, identifier: 1 }])
			);
			controller.handleTouchMove(
				mockTouchEvent('touchmove', [{ clientX: 19, clientY: 102, identifier: 1 }])
			);
			expect(controller.isSwiping).toBe(false);
			const points = [{ clientX: 170, clientY: 500, identifier: 1 }];
			if (type === 'touchmove') controller.handleTouchMove(mockTouchEvent(type, points));
			controller.handleTouchEnd(mockTouchEvent('touchend', points));
			vi.advanceTimersByTime(200);
			expect(onBack).not.toHaveBeenCalled();
		}
	);

	it('rolls back a horizontal swipe that becomes vertical', () => {
		const controller = makeController();
		controller.handleTouchStart(
			mockTouchEvent('touchstart', [{ clientX: 10, clientY: 100, identifier: 1 }])
		);
		controller.handleTouchMove(
			mockTouchEvent('touchmove', [{ clientX: 40, clientY: 102, identifier: 1 }])
		);
		expect(controller.isSwiping).toBe(true);
		const vertical = mockTouchEvent('touchmove', [{ clientX: 170, clientY: 500, identifier: 1 }]);
		const preventDefault = vi.spyOn(vertical, 'preventDefault');
		controller.handleTouchMove(vertical);
		expect(preventDefault).not.toHaveBeenCalled();
		expect(controller.isSwiping).toBe(false);
		controller.handleTouchEnd(
			mockTouchEvent('touchend', [{ clientX: 170, clientY: 500, identifier: 1 }])
		);
		vi.advanceTimersByTime(200);
		expect(onBack).not.toHaveBeenCalled();
		expect(secondaryEl.style.transform).toBe('');
	});

	it('does not commit a release before horizontal direction has been confirmed', () => {
		const controller = makeController();
		controller.handleTouchStart(
			mockTouchEvent('touchstart', [{ clientX: 10, clientY: 100, identifier: 1 }])
		);
		controller.handleTouchEnd(
			mockTouchEvent('touchend', [{ clientX: 170, clientY: 500, identifier: 1 }])
		);
		vi.advanceTimersByTime(200);
		expect(onBack).not.toHaveBeenCalled();
	});

	it('cancels an active swipe when a second finger joins', () => {
		const controller = makeController();
		controller.handleTouchStart(
			mockTouchEvent('touchstart', [{ clientX: 10, clientY: 100, identifier: 1 }])
		);
		controller.handleTouchMove(
			mockTouchEvent('touchmove', [{ clientX: 170, clientY: 100, identifier: 1 }])
		);
		controller.handleTouchStart(
			mockTouchEvent('touchstart', [
				{ clientX: 170, clientY: 100, identifier: 1 },
				{ clientX: 180, clientY: 100, identifier: 2 }
			])
		);
		expect(controller.isSwiping).toBe(false);
		controller.handleTouchEnd(
			mockTouchEvent('touchend', [{ clientX: 170, clientY: 100, identifier: 1 }])
		);
		vi.advanceTimersByTime(200);
		expect(onBack).not.toHaveBeenCalled();
	});

	it('does not mutate boxShadow during touchmove to keep transform/opacity on compositor thread', () => {
		const controller = makeController({ maxEdgeX: 28 });
		controller.handleTouchStart(
			mockTouchEvent('touchstart', [{ clientX: 10, clientY: 100, identifier: 1 }])
		);
		controller.handleTouchMove(
			mockTouchEvent('touchmove', [{ clientX: 60, clientY: 100, identifier: 1 }])
		);
		expect(controller.isSwiping).toBe(true);
		expect(secondaryEl.style.boxShadow).toBe('');
	});
});
