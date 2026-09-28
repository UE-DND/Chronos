import { afterEach, describe, expect, it, vi } from 'vite-plus/test';
import { createWeekPagerTouch } from './week-pager-touch';

function createHarness() {
	let now = 0;
	let nextFrame = 1;
	const frames = new Map<number, FrameRequestCallback>();
	vi.spyOn(performance, 'now').mockImplementation(() => now);
	vi.stubGlobal('window', { matchMedia: () => ({ matches: false }) });
	vi.stubGlobal('requestAnimationFrame', (callback: FrameRequestCallback) => {
		const id = nextFrame++;
		frames.set(id, callback);
		return id;
	});
	vi.stubGlobal('cancelAnimationFrame', (id: number) => frames.delete(id));
	const node = Object.assign(new EventTarget(), {
		clientWidth: 1000,
		scrollWidth: 20000,
		scrollLeft: 9000,
		style: { scrollSnapType: '' },
		ownerDocument: new EventTarget()
	});
	const suspendSnap = vi.fn();
	const onSettled = vi.fn();
	const touch = createWeekPagerTouch(node as unknown as HTMLElement, {
		enabled: () => true,
		suspendSnap,
		onSettled
	});

	function pointer(type: 'pointerdown' | 'pointermove' | 'pointerup', x: number, y: number) {
		const event = Object.assign(new Event(type), {
			pointerId: 1,
			pointerType: 'touch',
			isPrimary: true,
			clientX: x,
			clientY: y
		});
		(type === 'pointerdown' ? node : node.ownerDocument).dispatchEvent(event);
	}

	function advance(ms: number) {
		const end = now + ms;
		while (frames.size && now < end) {
			now = Math.min(end, now + 16);
			const pending = [...frames.values()];
			frames.clear();
			for (const callback of pending) callback(now);
		}
		now = end;
	}

	return { node, touch, suspendSnap, onSettled, pointer, advance };
}

afterEach(() => {
	vi.restoreAllMocks();
	vi.unstubAllGlobals();
});

describe('week pager touch', () => {
	it('leaves a diagonal vertical gesture on the current week', () => {
		const h = createHarness();
		h.pointer('pointerdown', 500, 500);
		h.pointer('pointermove', 478, 450);
		h.pointer('pointerup', 450, 400);
		h.advance(200);
		expect(h.node.scrollLeft).toBe(9000);
		expect(h.node.style.scrollSnapType).toBe('');
		h.touch.destroy();
	});

	it('limits a long drag to one adjacent week', () => {
		const h = createHarness();
		h.pointer('pointerdown', 500, 500);
		h.pointer('pointermove', -2000, 480);
		expect(h.node.scrollLeft).toBe(10000);
		h.pointer('pointerup', -2000, 480);
		h.advance(200);
		expect(h.node.scrollLeft).toBe(10000);
		expect(h.onSettled).toHaveBeenCalledTimes(1);
		expect(h.suspendSnap).toHaveBeenLastCalledWith(false);
		h.touch.destroy();
	});

	it('rejects a short slow drag but accepts a deliberate quick flick', () => {
		const h = createHarness();
		h.pointer('pointerdown', 500, 500);
		h.pointer('pointermove', 460, 500);
		h.advance(200);
		h.pointer('pointerup', 460, 500);
		h.advance(200);
		expect(h.node.scrollLeft).toBe(9000);

		h.pointer('pointerdown', 500, 500);
		h.pointer('pointermove', 460, 500);
		h.pointer('pointerup', 460, 500);
		h.advance(200);
		expect(h.node.scrollLeft).toBe(10000);
		h.touch.destroy();
	});

	it('settles a short return sooner than a nearly full-page flick', () => {
		const h = createHarness();
		h.pointer('pointerdown', 500, 500);
		h.pointer('pointermove', 460, 500);
		h.advance(200);
		h.pointer('pointerup', 460, 500);
		h.advance(96);
		expect(h.node.scrollLeft).toBe(9000);
		expect(h.onSettled).toHaveBeenCalledTimes(1);

		h.pointer('pointerdown', 500, 500);
		h.pointer('pointermove', 460, 500);
		h.pointer('pointerup', 460, 500);
		h.advance(64);
		expect(h.node.scrollLeft).toBeGreaterThan(9900);
		expect(h.onSettled).toHaveBeenCalledTimes(1);
		h.advance(48);
		expect(h.node.scrollLeft).toBe(10000);
		expect(h.onSettled).toHaveBeenCalledTimes(2);
		h.touch.destroy();
	});

	it('restores native snapping after a new touch interrupts settling', () => {
		const h = createHarness();
		h.pointer('pointerdown', 500, 500);
		h.pointer('pointermove', 200, 500);
		h.pointer('pointerup', 200, 500);
		h.advance(64);
		h.pointer('pointerdown', 500, 500);
		h.pointer('pointerup', 500, 500);
		h.advance(200);
		expect(h.node.style.scrollSnapType).toBe('');
		expect(h.suspendSnap).toHaveBeenLastCalledWith(false);
		expect(h.touch.isActive).toBe(false);
		h.touch.destroy();
	});
});
