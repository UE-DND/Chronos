import { afterEach, describe, expect, it, vi } from 'vite-plus/test';
import { createWeekPagerController } from './week-pager-controller.svelte';

function harness(pageWidth = 1000) {
	vi.useFakeTimers();
	vi.spyOn(performance, 'now').mockImplementation(() => Date.now());
	vi.stubGlobal('window', globalThis);
	vi.stubGlobal('requestAnimationFrame', (fn: FrameRequestCallback) =>
		setTimeout(() => fn(performance.now()), 16)
	);
	vi.stubGlobal('cancelAnimationFrame', clearTimeout);
	let resize = () => {};
	vi.stubGlobal(
		'ResizeObserver',
		class {
			constructor(fn: () => void) {
				resize = fn;
			}
			observe() {}
			disconnect() {}
		}
	);
	const node = Object.assign(new EventTarget(), {
		clientWidth: Math.round(pageWidth),
		scrollWidth: Math.round(pageWidth * 20),
		childElementCount: 20,
		scrollLeft: 0,
		style: { scrollSnapType: '', overflowX: '' },
		ownerDocument: new EventTarget(),
		scrollTo({ left }: { left: number }) {
			this.scrollLeft = left;
		}
	});
	vi.stubGlobal('getComputedStyle', () => ({ width: `${pageWidth}px` }));
	const calls: string[] = [];
	let context = {
		timetableId: 'a',
		startWeek: 1,
		endWeek: 20,
		displayedWeek: 1,
		active: true,
		allowTouch: true
	};
	const preview = {
		setPreview: (week: number) => calls.push(`preview:${week}`),
		clearPreview: () => calls.push('clear')
	};
	const complete = vi.fn();
	const pager = createWeekPagerController({
		setPreview: preview.setPreview,
		clearPreview: preview.clearPreview,
		setDisplayedWeek: (week) => {
			calls.push(`week:${week}`);
			context = { ...context, displayedWeek: week };
			pager.sync(context);
		},
		onFirstMove: vi.fn(),
		onCompleted: complete
	});
	pager.sync(context);
	const detach = pager.attach(node as unknown as HTMLElement);
	vi.advanceTimersByTime(160);
	calls.length = 0;
	return {
		node,
		pager,
		calls,
		complete,
		resize: () => resize(),
		detach,
		sync: (patch: Partial<typeof context>) => {
			context = { ...context, ...patch };
			pager.sync(context);
		},
		scroll: (left: number) => {
			node.scrollLeft = left;
			node.dispatchEvent(new Event('scroll'));
		},
		pointer: (type: string, x = 500) => {
			(type === 'pointerdown' ? node : node.ownerDocument).dispatchEvent(
				Object.assign(new Event(type), {
					pointerId: 1,
					pointerType: 'touch',
					isPrimary: true,
					clientX: x,
					clientY: 500
				})
			);
		}
	};
}
afterEach(() => {
	vi.useRealTimers();
	vi.restoreAllMocks();
	vi.unstubAllGlobals();
});
describe('week pager lifecycle', () => {
	it('ignores native resize snapping even when the browser already aligned the page', () => {
		const width = 412.19049;
		const h = harness(width);
		h.sync({ displayedWeek: 16 });
		vi.advanceTimersByTime(160);
		h.resize();
		h.calls.length = 0;
		h.scroll(15 * width);
		vi.advanceTimersByTime(160);
		expect(h.calls).toEqual([]);
		h.scroll(14.5 * width);
		expect(h.calls[0]).toMatch(/^preview:/);
		expect(Number(h.calls[0]?.split(':')[1])).toBeCloseTo(15.5, 6);
		h.detach();
	});

	it('uses fractional page width for week jumps and the live indicator preview', () => {
		const width = 412.19049;
		const h = harness(width);
		h.sync({ displayedWeek: 16 });
		expect(h.node.scrollLeft).toBeCloseTo(15 * width, 6);
		vi.advanceTimersByTime(160);
		h.scroll(15 * width);
		expect(h.calls).toContain('preview:16');
		h.detach();
	});
	it('publishes preview before the integer week and keeps it through quiet time', () => {
		const h = harness();
		h.scroll(600);
		expect(h.calls.slice(0, 2)).toEqual(['preview:1.6', 'week:2']);
		vi.advanceTimersByTime(100);
		expect(h.calls).not.toContain('clear');
		h.node.dispatchEvent(new Event('scrollend'));
		expect(h.calls.at(-1)).toBe('clear');
		expect(h.complete).toHaveBeenCalledTimes(1);
		h.node.dispatchEvent(new Event('scrollend'));
		expect(h.complete).toHaveBeenCalledTimes(1);
		h.detach();
	});
	it('ignores early scrollend while touch owns the pointer and reads the final offset on completion', () => {
		const h = harness();
		h.pointer('pointerdown');
		h.scroll(600);
		h.node.dispatchEvent(new Event('scrollend'));
		expect(h.calls).not.toContain('clear');
		h.sync({ allowTouch: false });
		expect(h.calls.at(-1)).toBe('clear');
		expect(h.node.scrollLeft).toBe(1000);
		h.pointer('pointerup');
		h.detach();
		expect(h.complete).not.toHaveBeenCalled();
	});
	it('finishes from the final touch offset even when its scroll event is delayed', () => {
		const h = harness();
		h.pointer('pointerdown');
		h.pointer('pointermove', 200);
		h.scroll(h.node.scrollLeft);
		h.node.dispatchEvent(new Event('scrollend'));
		expect(h.calls).not.toContain('clear');
		h.pointer('pointerup', 200);
		vi.advanceTimersByTime(400);
		expect(h.node.scrollLeft).toBe(1000);
		expect(h.calls).toContain('week:2');
		expect(h.calls.at(-1)).toBe('clear');
		expect(h.complete).toHaveBeenCalledOnce();
		h.detach();
	});
	it('honors an external week jump while the touch animation is settling', () => {
		const h = harness();
		h.pointer('pointerdown');
		h.pointer('pointermove', -100);
		h.scroll(h.node.scrollLeft);
		h.pointer('pointerup', -100);
		h.sync({ displayedWeek: 1 });
		expect(h.node.scrollLeft).toBe(0);
		const calls = [...h.calls];
		vi.advanceTimersByTime(500);
		h.node.dispatchEvent(new Event('scrollend'));
		expect(h.node.scrollLeft).toBe(0);
		expect(h.calls).toEqual(calls);
		expect(h.complete).not.toHaveBeenCalled();
		h.detach();
	});
	it('keeps the latest preview when direction reverses and does not count a return to the starting week', () => {
		const h = harness();
		h.scroll(700);
		h.scroll(300);
		h.node.dispatchEvent(new Event('scrollend'));
		expect(h.calls).toContain('preview:1.3');
		expect(h.complete).not.toHaveBeenCalled();
		h.detach();
	});
	it.each(['resize', 'inactive', 'timetable'] as const)(
		'interrupts %s and invalidates old timers',
		(cause) => {
			const h = harness();
			h.scroll(600);
			if (cause === 'resize') h.resize();
			else
				h.sync(cause === 'inactive' ? { active: false } : { timetableId: 'b', displayedWeek: 4 });
			const calls = [...h.calls];
			vi.advanceTimersByTime(300);
			expect(h.calls).toEqual(calls);
			expect(h.complete).not.toHaveBeenCalled();
			h.detach();
		}
	);
});
