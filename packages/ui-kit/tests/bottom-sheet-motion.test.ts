import { afterEach, beforeEach, describe, expect, it, vi } from 'vite-plus/test';
import { createBottomSheetMotion } from '../src/overlay/bottom-sheet-motion.svelte';

beforeEach(() => {
	vi.useFakeTimers({ toFake: ['performance', 'setTimeout', 'clearTimeout'] });
	vi.stubGlobal('requestAnimationFrame', (fn: FrameRequestCallback) =>
		setTimeout(() => fn(performance.now()), 16)
	);
	vi.stubGlobal('cancelAnimationFrame', clearTimeout);
});
afterEach(() => {
	vi.useRealTimers();
	vi.unstubAllGlobals();
});
function harness({ reduced = false } = {}) {
	const onClosed = vi.fn();
	const onComplete = vi.fn();
	const animate = vi.fn((_from: number, _target: number, complete: () => void) => {
		const timer = setTimeout(complete, 240);
		return () => clearTimeout(timer);
	});
	const sheet = createBottomSheetMotion({
		height: () => 400,
		reduced: () => reduced,
		animate,
		onClosed,
		onComplete
	});
	sheet.setOpen(true);
	sheet.mount();
	vi.advanceTimersByTime(2000);
	return { sheet, onClosed, onComplete, animate };
}
describe('bottom sheet motion', () => {
	it('retains the sheet until its compositor animation completes', () => {
		const { sheet, onClosed, animate } = harness();
		sheet.setOpen(false);
		sheet.setOpen(false);
		vi.advanceTimersByTime(239);
		expect(sheet.state.present).toBe(true);
		expect(onClosed).not.toHaveBeenCalled();
		vi.advanceTimersByTime(1);
		expect(sheet.state.present).toBe(false);
		expect(onClosed).toHaveBeenCalledOnce();
		expect(animate.mock.calls.map(([from, target]) => [from, target])).toEqual([
			[400, 0],
			[0, 400]
		]);
	});
	it('can reopen programmatically without running the obsolete close completion', () => {
		const { sheet, onClosed, onComplete } = harness();
		sheet.setOpen(false);
		vi.advanceTimersByTime(80);
		sheet.setOpen(true);
		sheet.start(100);
		expect(sheet.state.phase).toBe('returning');
		vi.advanceTimersByTime(240);
		expect(sheet.state).toMatchObject({ present: true, phase: 'open', offset: 0 });
		expect(onClosed).not.toHaveBeenCalled();
		expect(onComplete.mock.calls).toEqual([[true]]);
	});
	it('honors reduced motion and cancels completion on teardown', () => {
		const reduced = harness({ reduced: true });
		reduced.sheet.setOpen(false);
		expect(reduced.sheet.state.present).toBe(false);
		expect(reduced.animate).not.toHaveBeenCalled();
		expect(reduced.onComplete.mock.calls).toEqual([[true], [false]]);
		const normal = harness();
		normal.sheet.setOpen(false);
		normal.sheet.destroy();
		vi.advanceTimersByTime(2000);
		expect(normal.onClosed).not.toHaveBeenCalled();
	});
	it('does not dismiss a short flick after holding it still', () => {
		const { sheet, onClosed } = harness();
		sheet.start(0);
		vi.advanceTimersByTime(20);
		sheet.move(30);
		vi.advanceTimersByTime(100);
		sheet.release(30);
		vi.advanceTimersByTime(2000);
		expect(sheet.state).toMatchObject({ present: true, offset: 0 });
		expect(onClosed).not.toHaveBeenCalled();
	});
	it('ignores a new drag during a return animation', () => {
		const { sheet } = harness();
		sheet.start(100);
		sheet.move(0);
		sheet.release(0, true);
		vi.advanceTimersByTime(32);
		const visible = sheet.state.offset;
		sheet.start(50);
		sheet.move(50);
		expect(sheet.state.offset).toBeCloseTo(visible);
		expect(sheet.state.phase).toBe('returning');
		sheet.release(50, true);
		vi.advanceTimersByTime(2000);
		expect(sheet.state.offset).toBe(0);
	});
	it('ignores a new drag during closing and completes closing once', () => {
		const { sheet, onClosed, onComplete } = harness();
		sheet.start(0);
		sheet.move(160);
		sheet.release(160);
		vi.advanceTimersByTime(64);
		const live = sheet.state.offset;
		sheet.start(300);
		expect(sheet.state.offset).toBe(live);
		expect(sheet.state.phase).toBe('closing');
		sheet.move(300 - live);
		sheet.release(300 - live, true);
		vi.advanceTimersByTime(2000);
		expect(sheet.state).toMatchObject({ present: false, phase: 'hidden' });
		expect(onClosed).toHaveBeenCalledOnce();
		expect(onComplete.mock.calls).toEqual([[true], [false]]);
	});
	it('dismisses a short flick, but cancels a reversed or canceled drag', () => {
		const { sheet, onClosed } = harness();
		sheet.start(0);
		vi.advanceTimersByTime(20);
		sheet.move(30);
		sheet.release(30);
		vi.advanceTimersByTime(2000);
		expect(onClosed).toHaveBeenCalledOnce();
		for (const cancel of [false, true]) {
			sheet.setOpen(true);
			sheet.mount();
			vi.advanceTimersByTime(2000);
			sheet.start(0);
			vi.advanceTimersByTime(100);
			sheet.move(200);
			vi.advanceTimersByTime(20);
			sheet.move(180);
			sheet.release(180, cancel);
			vi.advanceTimersByTime(2000);
			expect(sheet.state.present).toBe(true);
			expect(sheet.state.offset).toBe(0);
		}
		expect(onClosed).toHaveBeenCalledOnce();
	});
});
