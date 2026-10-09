import { afterEach, describe, expect, it, vi } from 'vite-plus/test';
import { createWeekPagerTouch } from './week-pager-touch';

function createHarness({
	initialOffset = 9000,
	pageWidth = 1000,
	reducedMotion = false,
	hz = 60,
	enabled = (): boolean => true
} = {}) {
	let now = 0;
	let nextFrame = 1;
	let nextFrameTime = 1000 / hz;
	const frameInterval = 1000 / hz;
	const frames = new Map<number, FrameRequestCallback>();
	const positions: number[] = [];
	vi.spyOn(performance, 'now').mockImplementation(() => now);
	vi.stubGlobal('window', { matchMedia: () => ({ matches: reducedMotion }) });
	vi.stubGlobal('requestAnimationFrame', (callback: FrameRequestCallback) => {
		const id = nextFrame++;
		frames.set(id, callback);
		return id;
	});
	vi.stubGlobal('cancelAnimationFrame', (id: number) => frames.delete(id));
	const node = Object.assign(new EventTarget(), {
		clientWidth: Math.round(pageWidth),
		scrollWidth: Math.round(pageWidth * 20),
		childElementCount: 20,
		scrollLeft: initialOffset,
		style: { scrollSnapType: '' },
		ownerDocument: new EventTarget()
	});
	vi.stubGlobal('getComputedStyle', () => ({ width: `${pageWidth}px` }));
	const suspendSnap = vi.fn();
	const onSettled = vi.fn();
	const touch = createWeekPagerTouch(node as unknown as HTMLElement, {
		enabled,
		suspendSnap,
		onSettled
	});

	function pointer(
		type: 'pointerdown' | 'pointermove' | 'pointerup' | 'pointercancel',
		x: number,
		y = 500
	) {
		const event = Object.assign(new Event(type, { cancelable: true }), {
			pointerId: 1,
			pointerType: 'touch',
			isPrimary: true,
			clientX: x,
			clientY: y
		});
		(type === 'pointerdown' ? node : node.ownerDocument).dispatchEvent(event);
	}

	function touchMove(x: number, y = 500) {
		const event = Object.assign(new Event('touchmove', { cancelable: true }), {
			touches: [{ clientX: x, clientY: y }]
		});
		node.dispatchEvent(event);
		return event;
	}

	function advance(ms: number) {
		const end = now + ms;
		while (nextFrameTime <= end + 1e-9) {
			now = nextFrameTime;
			nextFrameTime += frameInterval;
			const pending = [...frames.values()];
			frames.clear();
			for (const callback of pending) callback(now);
			if (pending.length) positions.push(node.scrollLeft);
		}
		now = end;
	}

	function drag(dx: number, elapsed = 100) {
		pointer('pointerdown', 500);
		advance(elapsed);
		pointer('pointermove', 500 + dx);
		pointer('pointerup', 500 + dx);
	}

	return { node, touch, suspendSnap, onSettled, positions, pointer, touchMove, advance, drag };
}

afterEach(() => {
	vi.restoreAllMocks();
	vi.unstubAllGlobals();
});

describe('week pager touch', () => {
	it.each(['vertical release', 'vertical cancel', 'pending cancel', 'tap'] as const)(
		'keeps a fractionally aligned page completely still during %s',
		(kind) => {
			const pageWidth = 412.19049;
			const initialOffset = pageWidth * 15;
			const h = createHarness({ pageWidth, initialOffset });
			let offset = initialOffset;
			const writes: number[] = [];
			Object.defineProperty(h.node, 'scrollLeft', {
				get: () => offset,
				set: (left: number) => {
					writes.push(left);
					offset = left;
				}
			});
			h.pointer('pointerdown', 200, 440);
			if (kind.startsWith('vertical')) h.pointer('pointermove', 203, 420);
			h.pointer(kind.endsWith('cancel') ? 'pointercancel' : 'pointerup', 205, 400);
			h.advance(500);
			expect(writes).toEqual([]);
			expect(h.node.scrollLeft).toBe(initialOffset);
			expect(h.node.style.scrollSnapType).toBe('');
			expect(h.touch.isActive).toBe(false);
			h.touch.destroy();
		}
	);

	it.each([1, -1])('lands on fractional page boundaries when swiping %s', (direction) => {
		const pageWidth = 412.19049;
		const h = createHarness({ pageWidth, initialOffset: 15 * pageWidth });
		h.drag(direction * 160);
		h.advance(500);
		expect(h.node.scrollLeft).toBeCloseTo((15 - direction) * pageWidth, 6);
		h.touch.destroy();
	});

	it('finishes an interrupted horizontal animation when the next gesture scrolls vertically', () => {
		const pageWidth = 412.19049;
		const h = createHarness({ pageWidth, initialOffset: 14 * pageWidth });
		h.drag(-160);
		h.advance(100);
		expect(h.node.scrollLeft).toBeGreaterThan(14.5 * pageWidth);
		expect(h.node.scrollLeft).toBeLessThan(15 * pageWidth);
		h.pointer('pointerdown', 200, 440);
		h.pointer('pointermove', 203, 410);
		h.pointer('pointercancel', 203, 410);
		h.advance(500);
		expect(h.node.scrollLeft).toBeCloseTo(15 * pageWidth, 6);
		expect(h.touch.isActive).toBe(false);
		expect(h.node.style.scrollSnapType).toBe('');
		h.touch.destroy();
	});

	it.each([-300, 300])('cancels paging when long press takes over before moving %s px', (dx) => {
		let enabled = true;
		const h = createHarness({ enabled: () => enabled });
		h.pointer('pointerdown', 500);
		h.advance(450);
		enabled = false;
		h.pointer('pointermove', 500 + dx);
		expect(h.node.scrollLeft).toBe(9000);
		expect(h.touch.isActive).toBe(false);
		expect(h.node.style.scrollSnapType).toBe('');
		expect(h.suspendSnap).toHaveBeenLastCalledWith(false);

		// Returning to view mode must not revive the pointer claimed by course dragging.
		enabled = true;
		h.pointer('pointermove', 500 + dx * 2);
		h.pointer('pointerup', 500 + dx * 2);
		h.advance(400);
		expect(h.node.scrollLeft).toBe(9000);
		expect(h.onSettled).not.toHaveBeenCalled();

		h.drag(dx);
		h.advance(400);
		expect(h.node.scrollLeft).toBe(dx < 0 ? 10000 : 8000);
		h.touch.destroy();
	});

	it('cancels a disabled gesture on release even without a pointermove', () => {
		let enabled = true;
		const h = createHarness({ enabled: () => enabled });
		h.pointer('pointerdown', 500);
		h.advance(450);
		enabled = false;
		h.pointer('pointerup', 200);
		h.advance(400);
		expect(h.node.scrollLeft).toBe(9000);
		expect(h.touch.isActive).toBe(false);
		expect(h.node.style.scrollSnapType).toBe('');
		expect(h.suspendSnap).toHaveBeenLastCalledWith(false);
		expect(h.onSettled).not.toHaveBeenCalled();
		h.touch.destroy();
	});

	it('leaves a diagonal vertical gesture on the current week', () => {
		const h = createHarness();
		h.pointer('pointerdown', 500, 500);
		h.pointer('pointermove', 478, 450);
		h.pointer('pointerup', 450, 400);
		h.advance(400);
		expect(h.node.scrollLeft).toBe(9000);
		expect(h.node.style.scrollSnapType).toBe('');
		h.touch.destroy();
	});

	it('confirms horizontal paging at the restored 8px threshold', () => {
		const h = createHarness();
		h.pointer('pointerdown', 500);
		h.pointer('pointermove', 493);
		expect(h.node.scrollLeft).toBe(9000);
		h.pointer('pointermove', 491);
		expect(h.node.scrollLeft).toBe(9009);
		expect(h.touchMove(491).defaultPrevented).toBe(true);
		h.touch.destroy();
	});

	it('locks horizontal paging and blocks vertical scrolling until release', () => {
		const h = createHarness();
		h.pointer('pointerdown', 500, 500);
		h.pointer('pointermove', 470, 502);
		expect(h.touchMove(470, 502).defaultPrevented).toBe(true);
		h.pointer('pointermove', 200, 620);
		expect(h.node.scrollLeft).toBe(9300);
		expect(h.touchMove(200, 620).defaultPrevented).toBe(true);
		h.pointer('pointerup', 200, 620);
		h.advance(400);
		expect(h.node.scrollLeft).toBe(10000);
		expect(h.touchMove(200, 620).defaultPrevented).toBe(false);
		h.touch.destroy();
	});

	it('locks vertical scrolling without taking over later horizontal movement', () => {
		const h = createHarness();
		h.pointer('pointerdown', 500, 500);
		h.pointer('pointermove', 498, 480);
		expect(h.touchMove(498, 480).defaultPrevented).toBe(false);
		h.pointer('pointermove', 200, 470);
		expect(h.touchMove(200, 470).defaultPrevented).toBe(false);
		expect(h.node.scrollLeft).toBe(9000);
		h.pointer('pointerup', 200, 470);
		h.advance(400);
		expect(h.node.scrollLeft).toBe(9000);
		h.touch.destroy();
	});

	it('leaves editing touches to course dragging and native scrolling', () => {
		let enabled = false;
		const h = createHarness({ enabled: () => enabled });
		h.pointer('pointerdown', 500);
		h.pointer('pointermove', 200, 620);
		expect(h.touchMove(200, 620).defaultPrevented).toBe(false);
		expect(h.node.scrollLeft).toBe(9000);
		enabled = true;
		h.pointer('pointerdown', 500);
		h.pointer('pointermove', 470);
		expect(h.touchMove(470).defaultPrevented).toBe(true);
		enabled = false;
		expect(h.touchMove(200, 620).defaultPrevented).toBe(false);
		expect(h.touch.isActive).toBe(false);
		h.touch.destroy();
	});

	it('limits a long drag to one adjacent week', () => {
		const h = createHarness();
		h.drag(-2500);
		h.advance(400);
		expect(h.node.scrollLeft).toBe(10000);
		expect(h.onSettled).toHaveBeenCalledTimes(1);
		expect(h.suspendSnap).toHaveBeenLastCalledWith(false);
		h.touch.destroy();
	});

	it('rejects a short slow drag but accepts a deliberate quick flick', () => {
		const h = createHarness();
		h.drag(-40, 200);
		h.advance(400);
		expect(h.node.scrollLeft).toBe(9000);

		h.drag(-40, 40);
		h.advance(100);
		expect(h.node.scrollLeft).toBeGreaterThan(9040);
		expect(h.node.scrollLeft).toBeLessThan(9900);
		expect(h.touch.isActive).toBe(true);
		h.advance(250);
		expect(h.node.scrollLeft).toBe(10000);
		h.touch.destroy();
	});

	it('settles a short return sooner than a nearly full-page flick', () => {
		const h = createHarness();
		h.drag(-40, 200);
		h.advance(150);
		expect(h.onSettled).not.toHaveBeenCalled();
		h.advance(70);
		expect(h.node.scrollLeft).toBe(9000);
		expect(h.onSettled).toHaveBeenCalledTimes(1);

		h.drag(-40, 40);
		h.advance(220);
		expect(h.node.scrollLeft).toBeLessThan(10000);
		expect(h.onSettled).toHaveBeenCalledTimes(1);
		h.advance(110);
		expect(h.node.scrollLeft).toBe(10000);
		expect(h.onSettled).toHaveBeenCalledTimes(2);
		h.touch.destroy();
	});

	it.each([60, 120, 144])('uses elapsed time and lands without overshoot at %s Hz', (hz) => {
		const h = createHarness({ hz });
		h.drag(-300);
		// 250 ms is a frame boundary shared by all three refresh rates.
		h.advance(150);
		const duration = 180 + 0.7 * 120;
		expect(h.node.scrollLeft).toBeCloseTo(9300 + 700 * (1 - (1 - 150 / duration) ** 2.25), 6);
		h.advance(duration - 150 - 1);
		expect(h.node.scrollLeft).toBeLessThan(10000);
		h.advance(1 + 1000 / hz);
		expect(h.node.scrollLeft).toBe(10000);
		expect(h.positions.every((left) => left >= 9300 && left <= 10000)).toBe(true);
		expect(h.positions.every((left, i) => i === 0 || left >= h.positions[i - 1])).toBe(true);
		h.advance(1000 / hz);
		expect(h.touch.isActive).toBe(false);
		expect(h.onSettled).toHaveBeenCalledTimes(1);
		h.touch.destroy();
	});

	it('keeps the final frame active until scroll observers can consume it', () => {
		const h = createHarness({ hz: 100 });
		h.drag(-500);
		h.advance(240);
		expect(h.node.scrollLeft).toBe(10000);
		expect(h.onSettled).not.toHaveBeenCalled();
		expect(h.touch.isActive).toBe(true);
		h.advance(10);
		expect(h.onSettled).toHaveBeenCalledTimes(1);
		expect(h.touch.isActive).toBe(false);
		h.touch.destroy();
	});

	it.each([-1, 1])(
		'lets a new gesture continue or reverse from the visible position (%s)',
		(direction) => {
			const h = createHarness();
			h.drag(-300);
			h.advance(120);
			const interruptedOffset = h.node.scrollLeft;
			expect(interruptedOffset).toBeGreaterThan(9500);
			h.pointer('pointerdown', 500);
			h.advance(40);
			expect(h.node.scrollLeft).toBe(interruptedOffset);
			h.pointer('pointermove', 500 + direction * 300);
			expect(h.node.scrollLeft).toBe(interruptedOffset - direction * 300);
			h.pointer('pointerup', 500 + direction * 300);
			h.advance(400);
			expect(h.node.scrollLeft).toBe(direction === -1 ? 11000 : 9000);
			expect(h.onSettled).toHaveBeenCalledTimes(1);
			expect(h.node.style.scrollSnapType).toBe('');
			expect(h.suspendSnap).toHaveBeenLastCalledWith(false);
			h.touch.destroy();
		}
	);

	it('restores native snapping after a new touch interrupts settling', () => {
		const h = createHarness();
		h.drag(-300);
		h.advance(120);
		h.pointer('pointerdown', 500);
		h.pointer('pointerup', 500);
		h.advance(400);
		expect(h.node.scrollLeft).toBe(10000);
		expect(h.node.style.scrollSnapType).toBe('');
		expect(h.suspendSnap).toHaveBeenLastCalledWith(false);
		expect(h.touch.isActive).toBe(false);
		h.touch.destroy();
	});

	it('returns a canceled horizontal gesture to its starting week', () => {
		const h = createHarness();
		h.pointer('pointerdown', 500);
		h.pointer('pointermove', 100);
		h.pointer('pointercancel', 100);
		h.advance(400);
		expect(h.node.scrollLeft).toBe(9000);
		expect(h.onSettled).toHaveBeenCalledTimes(1);
		h.touch.destroy();
	});

	it.each([
		{ initialOffset: 0, dx: 300 },
		{ initialOffset: 19000, dx: -300 }
	])('stays within the boundary at $initialOffset', ({ initialOffset, dx }) => {
		const h = createHarness({ initialOffset });
		h.drag(dx);
		h.advance(400);
		expect(h.node.scrollLeft).toBe(initialOffset);
		expect(h.positions.every((left) => left >= 0 && left <= 19000)).toBe(true);
		h.touch.destroy();
	});

	it('lands immediately when reduced motion is preferred', () => {
		const h = createHarness({ reducedMotion: true });
		h.drag(-300);
		expect(h.node.scrollLeft).toBe(10000);
		expect(h.touch.isActive).toBe(false);
		expect(h.onSettled).toHaveBeenCalledTimes(1);
		expect(h.node.style.scrollSnapType).toBe('');
		h.touch.destroy();
	});

	it.each(['cancel', 'destroy'] as const)(
		'restores snapping and stops pending frames on %s',
		(action) => {
			const h = createHarness();
			h.drag(-300);
			h.advance(80);
			const offset = h.node.scrollLeft;
			h.touch[action]();
			h.advance(400);
			expect(h.node.scrollLeft).toBe(offset);
			expect(h.touch.isActive).toBe(false);
			expect(h.node.style.scrollSnapType).toBe('');
			expect(h.suspendSnap).toHaveBeenLastCalledWith(false);
			expect(h.onSettled).not.toHaveBeenCalled();
			h.touch.destroy();
		}
	);
});
