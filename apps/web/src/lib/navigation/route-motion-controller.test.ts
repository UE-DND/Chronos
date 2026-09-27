import { afterEach, beforeEach, describe, expect, it, vi } from 'vite-plus/test';
import {
	createRouteMotionController,
	NATIVE_SHELL_MOTION_CLASS,
	NATIVE_SLIDE_ENTER_CLASS,
	NATIVE_SLIDE_EXIT_CLASS
} from './route-motion-controller.svelte';

function createMockElement() {
	const classes = new Set<string>();
	const styles: Record<string, string> = {};
	return {
		classList: {
			add: (c: string) => classes.add(c),
			remove: (...cs: string[]) => cs.forEach((c) => classes.delete(c)),
			contains: (c: string) => classes.has(c)
		},
		style: {
			setProperty: (prop: string, val: string) => {
				styles[prop] = val;
			},
			removeProperty: (prop: string) => {
				delete styles[prop];
			},
			getPropertyValue: (prop: string) => styles[prop] ?? ''
		}
	} as unknown as HTMLElement;
}

describe('createRouteMotionController', () => {
	let secondaryRoot: HTMLElement;
	let shellRoot: HTMLElement;
	let docClasses: Set<string>;

	beforeEach(() => {
		vi.useFakeTimers();
		secondaryRoot = createMockElement();
		shellRoot = createMockElement();
		docClasses = new Set<string>();

		vi.stubGlobal('window', {
			matchMedia: vi.fn().mockReturnValue({ matches: false })
		});
		vi.stubGlobal('document', {
			documentElement: {
				classList: {
					contains: (c: string) => docClasses.has(c)
				}
			}
		});
	});

	afterEach(() => {
		vi.useRealTimers();
		vi.unstubAllGlobals();
	});

	it('animates forward entrance and clears classes on completion', async () => {
		const controller = createRouteMotionController(() => ({ secondaryRoot, shellRoot }));

		let onStartInvoked = false;
		const animPromise = controller.animateForwardEnter(() => {
			onStartInvoked = true;
			expect(secondaryRoot.classList.contains(NATIVE_SLIDE_ENTER_CLASS)).toBe(true);
			expect(shellRoot.classList.contains(NATIVE_SHELL_MOTION_CLASS)).toBe(true);
		}, 200);

		expect(onStartInvoked).toBe(true);
		expect(secondaryRoot.classList.contains(NATIVE_SLIDE_ENTER_CLASS)).toBe(true);
		expect(shellRoot.classList.contains(NATIVE_SHELL_MOTION_CLASS)).toBe(true);

		vi.advanceTimersByTime(200);
		await animPromise;

		expect(secondaryRoot.classList.contains(NATIVE_SLIDE_ENTER_CLASS)).toBe(false);
		expect(shellRoot.classList.contains(NATIVE_SHELL_MOTION_CLASS)).toBe(false);
	});

	it('animates back exit and clears classes on completion', async () => {
		const controller = createRouteMotionController(() => ({ secondaryRoot, shellRoot }));

		let onStartInvoked = false;
		const animPromise = controller.animateBackExit(() => {
			onStartInvoked = true;
			expect(secondaryRoot.classList.contains(NATIVE_SLIDE_EXIT_CLASS)).toBe(true);
			expect(shellRoot.classList.contains(NATIVE_SHELL_MOTION_CLASS)).toBe(true);
		}, 180);

		expect(onStartInvoked).toBe(true);
		expect(secondaryRoot.classList.contains(NATIVE_SLIDE_EXIT_CLASS)).toBe(true);
		expect(shellRoot.classList.contains(NATIVE_SHELL_MOTION_CLASS)).toBe(true);

		vi.advanceTimersByTime(180);
		await animPromise;

		expect(secondaryRoot.classList.contains(NATIVE_SLIDE_EXIT_CLASS)).toBe(false);
		expect(shellRoot.classList.contains(NATIVE_SHELL_MOTION_CLASS)).toBe(false);
	});

	it('cancels motion when newer animation supersedes previous one', async () => {
		const controller = createRouteMotionController(() => ({ secondaryRoot, shellRoot }));

		void controller.animateBackExit(200);
		const gen1 = controller.activeGeneration;

		void controller.animateForwardEnter(200);
		const gen2 = controller.activeGeneration;
		expect(gen2).toBeGreaterThan(gen1);

		// Advancing time for gen1 should not clear classes set by gen2
		vi.advanceTimersByTime(100);
		expect(secondaryRoot.classList.contains(NATIVE_SLIDE_ENTER_CLASS)).toBe(true);

		vi.advanceTimersByTime(100);
		expect(secondaryRoot.classList.contains(NATIVE_SLIDE_ENTER_CLASS)).toBe(false);
	});

	it('skips animations when reduce-motion class is present', async () => {
		docClasses.add('reduce-motion');
		const controller = createRouteMotionController(() => ({ secondaryRoot, shellRoot }));

		await controller.animateForwardEnter(200);
		expect(secondaryRoot.classList.contains(NATIVE_SLIDE_ENTER_CLASS)).toBe(false);

		await controller.animateBackExit(200);
		expect(secondaryRoot.classList.contains(NATIVE_SLIDE_EXIT_CLASS)).toBe(false);
	});

	it('cancelMotion explicitly clears all active classes immediately', () => {
		const controller = createRouteMotionController(() => ({ secondaryRoot, shellRoot }));
		void controller.animateForwardEnter(200);

		expect(secondaryRoot.classList.contains(NATIVE_SLIDE_ENTER_CLASS)).toBe(true);
		controller.cancelMotion();
		expect(secondaryRoot.classList.contains(NATIVE_SLIDE_ENTER_CLASS)).toBe(false);
		expect(shellRoot.classList.contains(NATIVE_SHELL_MOTION_CLASS)).toBe(false);
	});

	it('sets --native-shell-duration matching animation duration and clears on finish', async () => {
		const controller = createRouteMotionController(() => ({ secondaryRoot, shellRoot }));

		const animPromise = controller.animateBackExit(180);
		expect(shellRoot.style.getPropertyValue('--native-shell-duration')).toBe('180ms');

		vi.advanceTimersByTime(180);
		await animPromise;

		expect(shellRoot.style.getPropertyValue('--native-shell-duration')).toBe('');
	});

	it('ensures native-shell-motion is applied before is-receded and maintained throughout motion', async () => {
		const controller = createRouteMotionController(() => ({ secondaryRoot, shellRoot }));

		let motionClassPresentWhenRecededAdded = false;
		const animPromise = controller.animateForwardEnter(() => {
			motionClassPresentWhenRecededAdded = shellRoot.classList.contains(NATIVE_SHELL_MOTION_CLASS);
			shellRoot.classList.add('is-receded');
		}, 260);

		expect(motionClassPresentWhenRecededAdded).toBe(true);
		expect(shellRoot.classList.contains('is-receded')).toBe(true);
		expect(shellRoot.classList.contains(NATIVE_SHELL_MOTION_CLASS)).toBe(true);

		// Halfway through animation (130ms), both classes are still active
		vi.advanceTimersByTime(130);
		expect(shellRoot.classList.contains('is-receded')).toBe(true);
		expect(shellRoot.classList.contains(NATIVE_SHELL_MOTION_CLASS)).toBe(true);

		// Animation completes (260ms)
		vi.advanceTimersByTime(130);
		await animPromise;

		// native-shell-motion cleared, but is-receded remains
		expect(shellRoot.classList.contains(NATIVE_SHELL_MOTION_CLASS)).toBe(false);
		expect(shellRoot.classList.contains('is-receded')).toBe(true);
	});
});
