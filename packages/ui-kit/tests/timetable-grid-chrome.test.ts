import { describe, expect, it } from 'vite-plus/test';
import { findCurrentPeriodIndex, parsePeriodRanges } from '@chronos/core';
import {
	timetableDayColumnDateClass,
	isCurrentCourseCapsule
} from '../src/timetable-preview/timetable-grid-chrome';

describe('timetable-grid-chrome', () => {
	it('returns day column date classes with holiday taking priority over today', () => {
		expect(timetableDayColumnDateClass({})).toBe('timetable-chrome-top-date');
		expect(timetableDayColumnDateClass({ isToday: true })).toBe(
			'bg-[var(--timetable-today-date-bg)] text-[var(--timetable-today-date-fg)]'
		);
		expect(timetableDayColumnDateClass({ holiday: { label: '国庆节' } })).toBe(
			'bg-[var(--timetable-holiday-date-bg)] text-[var(--timetable-holiday-date-fg)]'
		);
		expect(timetableDayColumnDateClass({ isToday: true, holiday: { label: '国庆节' } })).toBe(
			'bg-[var(--timetable-holiday-date-bg)] text-[var(--timetable-holiday-date-fg)]'
		);
	});
});

const currentCourse = {
	displayModel: {
		course: {
			id: 'course',
			name: '跨节课程',
			teacher: '',
			location: '',
			dayOfWeek: 1,
			startPeriod: 2,
			endPeriod: 4,
			weeks: [1]
		},
		isInDisplayedWeek: true,
		isHolidayMuted: false
	},
	isCurrentWeek: true,
	todayDayOfWeek: 1,
	currentPeriodIndex: 3
};

describe('isCurrentCourseCapsule', () => {
	it('highlights the next course during a break and leaves an empty period without a match', () => {
		const ranges = parsePeriodRanges([
			{ index: 1, startTime: '08:00', endTime: '08:45' },
			{ index: 2, startTime: '09:00', endTime: '09:45' },
			{ index: 5, startTime: '14:00', endTime: '14:45' }
		]);
		expect(
			isCurrentCourseCapsule({
				...currentCourse,
				currentPeriodIndex: findCurrentPeriodIndex(ranges, 8 * 60 + 50, 'withinDay')
			})
		).toBe(true);
		expect(
			isCurrentCourseCapsule({
				...currentCourse,
				currentPeriodIndex: findCurrentPeriodIndex(ranges, 12 * 60, 'withinDay')
			})
		).toBe(false);
	});

	it.each([2, 3, 4])('matches the start, middle and end of a course: period %s', (period) => {
		expect(isCurrentCourseCapsule({ ...currentCourse, currentPeriodIndex: period })).toBe(true);
	});

	it.each([1, 5, null])(
		'does not match outside the course or without a current period: %s',
		(period) => {
			expect(isCurrentCourseCapsule({ ...currentCourse, currentPeriodIndex: period })).toBe(false);
		}
	);

	it('requires today to be visible in the current academic week', () => {
		expect(isCurrentCourseCapsule({ ...currentCourse, todayDayOfWeek: 2 })).toBe(false);
		expect(isCurrentCourseCapsule({ ...currentCourse, todayDayOfWeek: null })).toBe(false);
		expect(isCurrentCourseCapsule({ ...currentCourse, isCurrentWeek: false })).toBe(false);
	});

	it('excludes future-week and holiday-muted courses', () => {
		expect(
			isCurrentCourseCapsule({
				...currentCourse,
				displayModel: { ...currentCourse.displayModel, isInDisplayedWeek: false }
			})
		).toBe(false);
		expect(
			isCurrentCourseCapsule({
				...currentCourse,
				displayModel: { ...currentCourse.displayModel, isHolidayMuted: true }
			})
		).toBe(false);
	});
});
