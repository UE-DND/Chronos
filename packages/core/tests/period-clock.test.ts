import { describe, expect, it, vi, afterEach } from 'vite-plus/test';
import {
	createDayClock,
	findCurrentPeriodIndex,
	parsePeriodRanges
} from '../src/algorithms/period-clock';

describe('period-clock', () => {
	const periods = parsePeriodRanges([
		{ index: 1, startTime: '08:00', endTime: '08:45' },
		{ index: 2, startTime: '09:00', endTime: '09:45' },
		{ index: 3, startTime: '10:00', endTime: '10:45' }
	]);

	it('none fallback only returns an in-progress period', () => {
		expect(findCurrentPeriodIndex(periods, 9 * 60 + 15, 'none')).toBe(2);
		expect(findCurrentPeriodIndex(periods, 9 * 60 + 50, 'none')).toBeNull();
		expect(findCurrentPeriodIndex(periods, 11 * 60 + 10, 'none')).toBeNull();
	});

	it('upcomingOrLast prefers active then next then last', () => {
		expect(findCurrentPeriodIndex(periods, 7 * 60)).toBe(1);
		expect(findCurrentPeriodIndex(periods, 9 * 60 + 15, 'upcomingOrLast')).toBe(2);
		expect(findCurrentPeriodIndex(periods, 9 * 60 + 50, 'upcomingOrLast')).toBe(3);
		expect(findCurrentPeriodIndex(periods, 11 * 60 + 10, 'upcomingOrLast')).toBe(3);
	});

	it.each([
		[0, 1],
		[7 * 60 + 59, 1],
		[8 * 60, 1],
		[8 * 60 + 30, 1],
		[8 * 60 + 45, 1],
		[8 * 60 + 46, 2],
		[9 * 60, 2],
		[10 * 60 + 45, 3],
		[10 * 60 + 46, null]
	] as const)('withinDay maps minute %s to period %s', (minutes, expected) => {
		expect(findCurrentPeriodIndex(periods, minutes, 'withinDay')).toBe(expected);
	});

	it('withinDay maps long breaks to the next configured period, even with skipped indices', () => {
		const ranges = parsePeriodRanges([
			{ index: 5, startTime: '14:00', endTime: '14:45' },
			{ index: 1, startTime: '08:00', endTime: '08:45' }
		]);
		expect(findCurrentPeriodIndex(ranges, 12 * 60, 'withinDay')).toBe(5);
	});

	it('withinDay handles an empty timetable and a single period', () => {
		expect(findCurrentPeriodIndex([], 8 * 60, 'withinDay')).toBeNull();
		const single = periods.slice(0, 1);
		expect(findCurrentPeriodIndex(single, 8 * 60 - 1, 'withinDay')).toBe(1);
		expect(findCurrentPeriodIndex(single, 8 * 60, 'withinDay')).toBe(1);
		expect(findCurrentPeriodIndex(single, 8 * 60 + 45, 'withinDay')).toBe(1);
		expect(findCurrentPeriodIndex(single, 8 * 60 + 46, 'withinDay')).toBeNull();
	});
});

describe('createDayClock', () => {
	afterEach(() => {
		vi.useRealTimers();
	});

	it('realigns after a suspended page resumes and leaves only one timer', () => {
		vi.useFakeTimers();
		vi.setSystemTime(new Date('2026-03-02T07:49:40'));
		const onTick = vi.fn();
		const clock = createDayClock({ onTick });
		vi.setSystemTime(new Date('2026-03-02T08:07:30'));
		clock.reschedule();
		expect(vi.getTimerCount()).toBe(1);
		vi.advanceTimersByTime(30_000);
		expect(onTick).toHaveBeenCalledExactlyOnceWith(new Date('2026-03-02T08:08:00'));
		clock.dispose();
		expect(vi.getTimerCount()).toBe(0);
	});
});
