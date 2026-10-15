import { afterEach, beforeEach, describe, expect, it, vi } from 'vite-plus/test';
import { warmupRouteMotion } from './route-motion-warmup';

const motion = vi.hoisted(() => ({
	animateForwardEnter: vi.fn<() => Promise<boolean>>(),
	cancelMotion: vi.fn()
}));
vi.mock('./route-motion-controller.svelte', () => ({
	createRouteMotionController: () => motion
}));

describe('native startup motion warmup', () => {
	let finish: (completed: boolean) => void;
	beforeEach(() => {
		vi.useFakeTimers();
		vi.clearAllMocks();
		vi.stubGlobal('requestAnimationFrame', (callback: () => void) => setTimeout(callback, 16));
		vi.stubGlobal('cancelAnimationFrame', clearTimeout);
		motion.animateForwardEnter.mockImplementation(
			() => new Promise<boolean>((resolve) => (finish = resolve))
		);
	});
	afterEach(() => {
		vi.useRealTimers();
		vi.unstubAllGlobals();
	});

	function start() {
		const root = { style: { willChange: '' } } as HTMLElement;
		const shell = { style: { willChange: 'contents' } } as HTMLElement;
		const ready = vi.fn();
		const dispose = warmupRouteMotion(root, shell, ready);
		return { root, shell, ready, dispose };
	}

	it('keeps startup covered until motion finishes and restores the live shell', async () => {
		const { root, shell, ready, dispose } = start();
		await vi.advanceTimersByTimeAsync(500);
		expect(ready).not.toHaveBeenCalled();
		finish(true);
		await Promise.resolve();
		expect(motion.cancelMotion).toHaveBeenCalledOnce();
		expect(root.style.willChange).toBe('');
		expect(shell.style.willChange).toBe('contents');
		expect(ready).toHaveBeenCalledOnce();
		dispose();
		await vi.runAllTimersAsync();
		expect(ready).toHaveBeenCalledOnce();
	});

	it('releases a stalled WebView at the deadline and ignores late completion', async () => {
		const { root, ready } = start();
		await vi.advanceTimersByTimeAsync(1000);
		expect(motion.cancelMotion).toHaveBeenCalledOnce();
		expect(root.style.willChange).toBe('');
		expect(ready).toHaveBeenCalledOnce();
		finish(true);
		await Promise.resolve();
		expect(ready).toHaveBeenCalledOnce();
	});

	it('cancels an unmounted warmup without reporting startup readiness', async () => {
		const { shell, ready, dispose } = start();
		dispose();
		await vi.runAllTimersAsync();
		expect(motion.animateForwardEnter).not.toHaveBeenCalled();
		expect(shell.style.willChange).toBe('contents');
		expect(ready).not.toHaveBeenCalled();
	});
});
