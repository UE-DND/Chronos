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
function harness() {
	const onClosed = vi.fn();
	const onComplete = vi.fn();
	const sheet = createBottomSheetMotion({
		height: () => 400,
		reduced: () => false,
		onClosed,
		onComplete
	});
	sheet.setOpen(true);
	sheet.mount();
	vi.advanceTimersByTime(2000);
	return { sheet, onClosed, onComplete };
}
describe('bottom sheet motion', () => {
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
	it('keeps the visible grab offset during an upward resisted return', () => {
		const { sheet } = harness();
		sheet.start(100);
		sheet.move(0);
		sheet.release(0, true);
		vi.advanceTimersByTime(32);
		const visible = sheet.state.offset;
		expect(visible).toBeLessThan(0);
		sheet.start(50);
		sheet.move(50);
		expect(sheet.state.offset).toBeCloseTo(visible);
		sheet.release(50, true);
		vi.advanceTimersByTime(2000);
		expect(sheet.state.offset).toBe(0);
	});
	it('keeps a finite grab offset even after a very fast upward release', () => {
		const { sheet } = harness();
		sheet.start(100);
		vi.advanceTimersByTime(1);
		sheet.move(0);
		sheet.release(0);
		vi.advanceTimersByTime(100);
		const visible = sheet.state.offset;
		expect(visible).toBeLessThan(-400);
		sheet.start(50);
		sheet.move(50);
		expect(sheet.state.offset).toBeCloseTo(visible);
		sheet.release(50, true);
		vi.advanceTimersByTime(2000);
		expect(sheet.state.offset).toBe(0);
	});
	it('can grab a closing sheet without a jump or obsolete close callback', () => {
		const { sheet, onClosed } = harness();
		sheet.start(0);
		sheet.move(160);
		sheet.release(160);
		vi.advanceTimersByTime(64);
		const live = sheet.state.offset;
		sheet.start(300);
		expect(sheet.state.offset).toBe(live);
		sheet.move(300 - live);
		sheet.release(300 - live, true);
		vi.advanceTimersByTime(2000);
		expect(sheet.state).toMatchObject({ present: true, offset: 0, phase: 'open' });
		expect(onClosed).not.toHaveBeenCalled();
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
