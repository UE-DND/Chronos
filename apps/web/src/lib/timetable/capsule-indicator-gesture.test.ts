import { describe, expect, it, vi } from 'vite-plus/test';
import { createCapsuleIndicatorGesture } from './capsule-indicator-gesture.svelte';

describe('createCapsuleIndicatorGesture', () => {
	it.each([100, 250])(
		'keeps the first pointer in control when a second pointer joins after %s ms',
		(elapsed) => {
			vi.useFakeTimers();
			const onTap = vi.fn();
			const gesture = createCapsuleIndicatorGesture({
				getStartWeek: () => 1,
				getEndWeek: () => 16,
				getDisplayedWeek: () => 5,
				onWeekChange: vi.fn(),
				onTap,
				onScrubStartFeedback: vi.fn()
			});
			gesture.onPointerDown({
				button: 0,
				isPrimary: true,
				pointerId: 1,
				clientX: 100,
				clientY: 100
			} as PointerEvent);
			vi.advanceTimersByTime(elapsed);
			gesture.onPointerDown({
				button: 0,
				isPrimary: false,
				pointerId: 2,
				clientX: 120,
				clientY: 100
			} as PointerEvent);
			gesture.onPointerUp({ pointerId: 2 } as PointerEvent);
			expect(gesture.isActive).toBe(true);
			gesture.onPointerUp({ pointerId: 1 } as PointerEvent);
			expect(gesture.isActive).toBe(false);
			expect(onTap).toHaveBeenCalledTimes(elapsed < 220 ? 1 : 0);
			gesture.destroy();
			vi.useRealTimers();
		}
	);

	it('destroy releases capture and clears active scrubbing without committing', () => {
		vi.useFakeTimers();
		const onScrubCommit = vi.fn();
		const releasePointerCapture = vi.fn();
		const gesture = createCapsuleIndicatorGesture({
			getStartWeek: () => 1,
			getEndWeek: () => 16,
			getDisplayedWeek: () => 5,
			onWeekChange: vi.fn(),
			onScrubCommit,
			onScrubStartFeedback: vi.fn()
		});
		gesture.containerEl = {
			getBoundingClientRect: () => ({ width: 240 }),
			setPointerCapture: vi.fn(),
			hasPointerCapture: () => true,
			releasePointerCapture
		} as unknown as HTMLElement;
		gesture.onPointerDown({
			button: 0,
			isPrimary: true,
			pointerId: 1,
			clientX: 100,
			clientY: 100
		} as PointerEvent);
		vi.advanceTimersByTime(250);
		gesture.destroy();
		expect(releasePointerCapture).toHaveBeenCalledWith(1);
		expect(gesture.isActive).toBe(false);
		expect(gesture.isScrubbing).toBe(false);
		expect(onScrubCommit).not.toHaveBeenCalled();
		vi.useRealTimers();
	});
	it('activates scrubbing on long press and fires feedback', () => {
		vi.useFakeTimers();
		const onScrubStartFeedback = vi.fn();
		const onWeekChange = vi.fn();
		const gesture = createCapsuleIndicatorGesture({
			getStartWeek: () => 1,
			getEndWeek: () => 20,
			getDisplayedWeek: () => 3,
			onWeekChange,
			onScrubStartFeedback
		});

		gesture.onPointerDown({
			button: 0,
			isPrimary: true,
			pointerId: 1,
			clientX: 50,
			clientY: 50
		} as unknown as PointerEvent);

		expect(gesture.isScrubbing).toBe(false);
		vi.advanceTimersByTime(220);

		expect(gesture.isScrubbing).toBe(true);
		expect(onScrubStartFeedback).toHaveBeenCalledOnce();
		expect(gesture.scrubWeek).toBe(3);
		expect(onWeekChange).not.toHaveBeenCalled();

		vi.useRealTimers();
	});

	it('preserves current week on long-press activation regardless of touch coordinates', () => {
		vi.useFakeTimers();
		const onWeekChange = vi.fn();
		const gesture = createCapsuleIndicatorGesture({
			getStartWeek: () => 1,
			getEndWeek: () => 20,
			getDisplayedWeek: () => 7,
			onWeekChange
		});

		// Touch at far right of screen
		gesture.onPointerDown({
			button: 0,
			isPrimary: true,
			pointerId: 1,
			clientX: 350,
			clientY: 50
		} as unknown as PointerEvent);

		vi.advanceTimersByTime(220);

		// Must remain on week 7 upon activation
		expect(gesture.isScrubbing).toBe(true);
		expect(gesture.scrubWeek).toBe(7);
		expect(onWeekChange).not.toHaveBeenCalled();

		vi.useRealTimers();
	});

	it('does not change week on quick tap', () => {
		vi.useFakeTimers();
		const onWeekChange = vi.fn();
		const onTap = vi.fn();
		const gesture = createCapsuleIndicatorGesture({
			getStartWeek: () => 1,
			getEndWeek: () => 20,
			getDisplayedWeek: () => 1,
			onWeekChange,
			onTap
		});

		gesture.onPointerDown({
			button: 0,
			isPrimary: true,
			pointerId: 1,
			clientX: 50,
			clientY: 50
		} as unknown as PointerEvent);

		vi.advanceTimersByTime(100);

		gesture.onPointerUp({
			pointerId: 1
		} as unknown as PointerEvent);

		expect(gesture.isScrubbing).toBe(false);
		expect(onWeekChange).not.toHaveBeenCalled();
		expect(onTap).toHaveBeenCalledOnce();

		vi.useRealTimers();
	});

	it('cancels long-press when pointer moves before timer expires', () => {
		vi.useFakeTimers();
		const onScrubStartFeedback = vi.fn();
		const onTap = vi.fn();
		const gesture = createCapsuleIndicatorGesture({
			getStartWeek: () => 1,
			getEndWeek: () => 20,
			getDisplayedWeek: () => 1,
			onWeekChange: vi.fn(),
			onScrubStartFeedback,
			onTap
		});

		gesture.onPointerDown({
			button: 0,
			isPrimary: true,
			pointerId: 1,
			clientX: 50,
			clientY: 50
		} as unknown as PointerEvent);

		// Move 15px horizontally before timer
		gesture.onPointerMove({
			pointerId: 1,
			clientX: 65,
			clientY: 50
		} as unknown as PointerEvent);

		vi.advanceTimersByTime(250);
		expect(gesture.isScrubbing).toBe(false);
		expect(onScrubStartFeedback).not.toHaveBeenCalled();
		expect(onTap).not.toHaveBeenCalled();

		vi.useRealTimers();
	});

	it('flushes target week change on pointer up after scrubbing', () => {
		vi.useFakeTimers();
		const onWeekChange = vi.fn();
		const gesture = createCapsuleIndicatorGesture({
			getStartWeek: () => 1,
			getEndWeek: () => 20,
			getDisplayedWeek: () => 1,
			onWeekChange
		});

		gesture.containerEl = {
			getBoundingClientRect: () =>
				({
					left: 0,
					top: 0,
					width: 200,
					height: 32,
					right: 200,
					bottom: 32
				}) as DOMRect,
			setPointerCapture: vi.fn(),
			releasePointerCapture: vi.fn(),
			hasPointerCapture: vi.fn().mockReturnValue(true)
		} as unknown as HTMLElement;

		gesture.onPointerDown({
			button: 0,
			isPrimary: true,
			pointerId: 1,
			clientX: 10,
			clientY: 16
		} as unknown as PointerEvent);

		vi.advanceTimersByTime(220);
		expect(gesture.isScrubbing).toBe(true);

		// Move to right edge
		gesture.onPointerMove({
			pointerId: 1,
			clientX: 195,
			clientY: 16,
			preventDefault: vi.fn()
		} as unknown as PointerEvent);

		expect(gesture.scrubWeek).toBe(20);

		gesture.onPointerUp({
			pointerId: 1
		} as unknown as PointerEvent);

		expect(gesture.isScrubbing).toBe(false);
		expect(onWeekChange).toHaveBeenCalledWith(20);

		vi.useRealTimers();
	});

	it('fires onScrubCommit when scrubbing ends on a different week', () => {
		vi.useFakeTimers();
		const onScrubCommit = vi.fn();
		const gesture = createCapsuleIndicatorGesture({
			getStartWeek: () => 1,
			getEndWeek: () => 20,
			getDisplayedWeek: () => 1,
			onWeekChange: vi.fn(),
			onScrubCommit
		});

		gesture.containerEl = {
			getBoundingClientRect: () =>
				({
					left: 0,
					top: 0,
					width: 200,
					height: 32,
					right: 200,
					bottom: 32
				}) as DOMRect,
			setPointerCapture: vi.fn(),
			releasePointerCapture: vi.fn(),
			hasPointerCapture: vi.fn().mockReturnValue(true)
		} as unknown as HTMLElement;

		gesture.onPointerDown({
			button: 0,
			isPrimary: true,
			pointerId: 1,
			clientX: 10,
			clientY: 16
		} as unknown as PointerEvent);
		vi.advanceTimersByTime(220);

		gesture.onPointerMove({
			pointerId: 1,
			clientX: 195,
			clientY: 16,
			preventDefault: vi.fn()
		} as unknown as PointerEvent);

		gesture.onPointerUp({
			pointerId: 1
		} as unknown as PointerEvent);

		expect(onScrubCommit).toHaveBeenCalledWith(20, 1);

		vi.useRealTimers();
	});

	it('does not fire onScrubCommit when scrubbing ends on the same week', () => {
		vi.useFakeTimers();
		const onScrubCommit = vi.fn();
		const onTap = vi.fn();
		const gesture = createCapsuleIndicatorGesture({
			getStartWeek: () => 1,
			getEndWeek: () => 20,
			getDisplayedWeek: () => 5,
			onWeekChange: vi.fn(),
			onScrubCommit,
			onTap
		});

		gesture.containerEl = {
			getBoundingClientRect: () =>
				({
					left: 0,
					top: 0,
					width: 200,
					height: 32,
					right: 200,
					bottom: 32
				}) as DOMRect,
			setPointerCapture: vi.fn(),
			releasePointerCapture: vi.fn(),
			hasPointerCapture: vi.fn().mockReturnValue(true)
		} as unknown as HTMLElement;

		gesture.onPointerDown({
			button: 0,
			isPrimary: true,
			pointerId: 1,
			clientX: 100,
			clientY: 16
		} as unknown as PointerEvent);
		vi.advanceTimersByTime(220);
		gesture.onPointerUp({
			pointerId: 1
		} as unknown as PointerEvent);

		expect(onScrubCommit).not.toHaveBeenCalled();
		expect(onTap).not.toHaveBeenCalled();

		vi.useRealTimers();
	});
});
