import { afterEach, beforeEach, describe, expect, it, vi } from 'vite-plus/test';
import { createRouteMotionController } from './route-motion-controller.svelte';

function createElement() {
	const animations: ReturnType<typeof createAnimation>[] = [];
	const animate = vi.fn(() => {
		const animation = createAnimation();
		animations.push(animation);
		return animation;
	});
	return { animations, animate, element: { animate } as unknown as HTMLElement };
}

function createAnimation() {
	let finish!: () => void;
	let reject!: (error: Error) => void;
	return {
		finished: new Promise<void>((resolve, fail) => {
			finish = resolve;
			reject = fail;
		}),
		finish: () => finish(),
		cancel: vi.fn(() => reject(new Error('Animation canceled')))
	};
}

describe('route motion lifecycle', () => {
	beforeEach(() => {
		vi.useFakeTimers();
		vi.stubGlobal('window', { matchMedia: () => ({ matches: false }) });
		vi.stubGlobal('document', {
			documentElement: { classList: { contains: () => false } }
		});
	});

	afterEach(() => {
		vi.useRealTimers();
		vi.unstubAllGlobals();
	});

	it('waits for actual animation completion even when rendering starts late', async () => {
		const secondary = createElement();
		const shell = createElement();
		const motion = createRouteMotionController(() => ({
			secondaryRoot: secondary.element,
			shellRoot: shell.element
		}));
		let settled = false;
		const pending = motion.animateForwardEnter().then((completed) => {
			settled = true;
			return completed;
		});
		await vi.advanceTimersByTimeAsync(1000);
		expect(settled).toBe(false);
		secondary.animations[0].finish();
		await Promise.resolve();
		expect(settled).toBe(false);
		shell.animations[0].finish();
		expect(await pending).toBe(true);
		// Hold the final frame until the route and gate have settled.
		expect(secondary.animations[0].cancel).not.toHaveBeenCalled();
		motion.cancelMotion();
		expect(secondary.animations[0].cancel).toHaveBeenCalledOnce();
	});

	it('settles a superseded motion without canceling its replacement', async () => {
		const secondary = createElement();
		const motion = createRouteMotionController(() => ({ secondaryRoot: secondary.element }));
		const entering = motion.animateForwardEnter();
		const exiting = motion.animateBackExit();
		expect(await entering).toBe(false);
		expect(secondary.animations[1].cancel).not.toHaveBeenCalled();
		secondary.animations[1].finish();
		expect(await exiting).toBe(true);
	});

	it('settles canceled exits so router callbacks can release navigation', async () => {
		const secondary = createElement();
		const motion = createRouteMotionController(() => ({ secondaryRoot: secondary.element }));
		const exiting = motion.animateBackExit();
		motion.cancelMotion();
		expect(await exiting).toBe(false);
	});

	it('installs independent animations before reactive route classes change', async () => {
		const secondary = createElement();
		const shell = createElement();
		const motion = createRouteMotionController(() => ({
			secondaryRoot: secondary.element,
			shellRoot: shell.element
		}));
		const pending = motion.animateBackExit(() => {
			expect(shell.animate).toHaveBeenCalledWith(
				[
					{ transform: 'translateX(-25%)', opacity: 0.55 },
					{ transform: 'translateX(0)', opacity: 1 }
				],
				expect.objectContaining({ duration: 220, fill: 'both' })
			);
		});
		secondary.animations[0].finish();
		shell.animations[0].finish();
		expect(await pending).toBe(true);
	});

	it('does not move the shell between two secondary pages', async () => {
		const secondary = createElement();
		const shell = createElement();
		const motion = createRouteMotionController(() => ({
			secondaryRoot: secondary.element,
			shellRoot: shell.element
		}));
		const pending = motion.animateForwardEnter(undefined, false);
		expect(shell.animate).not.toHaveBeenCalled();
		secondary.animations[0].finish();
		expect(await pending).toBe(true);
	});

	it('skips motion and invokes the route update when reduced motion is active', async () => {
		vi.stubGlobal('window', { matchMedia: () => ({ matches: true }) });
		const secondary = createElement();
		const onStart = vi.fn();
		const motion = createRouteMotionController(() => ({ secondaryRoot: secondary.element }));
		expect(await motion.animateForwardEnter(onStart)).toBe(true);
		expect(await motion.animateBackExit(onStart)).toBe(true);
		expect(onStart).toHaveBeenCalledTimes(2);
		expect(secondary.animate).not.toHaveBeenCalled();
	});

	it('also respects the application reduce-motion preference', async () => {
		vi.stubGlobal('document', {
			documentElement: { classList: { contains: (name: string) => name === 'reduce-motion' } }
		});
		const secondary = createElement();
		const motion = createRouteMotionController(() => ({ secondaryRoot: secondary.element }));
		expect(await motion.animateForwardEnter()).toBe(true);
		expect(secondary.animate).not.toHaveBeenCalled();
	});

	it('updates the route even if there is no secondary root', async () => {
		const onStart = vi.fn();
		const motion = createRouteMotionController(() => ({}));
		expect(await motion.animateBackExit(onStart)).toBe(true);
		expect(onStart).toHaveBeenCalledOnce();
	});
});
