import { afterEach, describe, expect, it, vi } from 'vite-plus/test';
import {
	createGestureVelocity,
	createScalarSpring,
	projectMomentum
} from '../src/motion/gesture-motion';

afterEach(() => {
	vi.useRealTimers();
	vi.unstubAllGlobals();
});

describe('gesture motion', () => {
	it('uses the last direction and forgets a held gesture', () => {
		const samples = createGestureVelocity();
		samples.reset(0, 0);
		samples.add(180, 100);
		samples.add(160, 120);
		expect(samples.velocity(120)).toBeLessThan(0);
		expect(samples.velocity(201)).toBe(0);
		expect(projectMomentum(0.5)).toBeCloseTo(249.5);
	});
	it('continues from the live position and cancels obsolete completion', () => {
		vi.useFakeTimers({ toFake: ['performance', 'setTimeout', 'clearTimeout'] });
		vi.stubGlobal('requestAnimationFrame', (fn: FrameRequestCallback) =>
			setTimeout(() => fn(performance.now()), 16)
		);
		vi.stubGlobal('cancelAnimationFrame', clearTimeout);
		const update = vi.fn();
		const obsolete = vi.fn();
		const finished = vi.fn();
		const spring = createScalarSpring(update);
		spring.jump(40);
		spring.animate(200, 0.5, obsolete);
		vi.advanceTimersByTime(64);
		const live = spring.value;
		expect(live).toBeGreaterThan(40);
		spring.animate(0, undefined, finished);
		expect(spring.value).toBe(live);
		vi.advanceTimersByTime(2000);
		expect(spring.value).toBe(0);
		expect(finished).toHaveBeenCalledOnce();
		expect(obsolete).not.toHaveBeenCalled();
		spring.cancel();
	});
});
