import { describe, expect, it } from 'vite-plus/test';
import type { AcademicConfig, Course } from '@chronos/core';
import {
	buildCourseSchedule,
	createCourseScheduleDraft,
	courseScheduleFromCourse
} from './course-schedule';

const academicConfig: AcademicConfig = {
	termStartDate: '2026-03-02',
	startWeek: 1,
	endWeek: 20,
	periodTimes: [
		{ index: 1, startTime: '08:00', endTime: '08:45' },
		{ index: 2, startTime: '08:55', endTime: '09:40' }
	]
};

function course(patch: Partial<Course> = {}): Course {
	return {
		id: 'course-1',
		name: '高等数学',
		teacher: '',
		location: '',
		dayOfWeek: 2,
		startPeriod: 1,
		endPeriod: 2,
		weeks: [],
		remark: '',
		...patch
	};
}

describe('course schedule draft', () => {
	it('creates a new all-term draft without guessing day or periods', () => {
		expect(createCourseScheduleDraft()).toEqual({
			recurrenceMode: 'all',
			dayOfWeek: null,
			startPeriod: null,
			endPeriod: null,
			selectedWeeks: []
		});
	});

	it('builds all-term and arbitrary selected-week schedules', () => {
		expect(
			buildCourseSchedule(
				{
					...createCourseScheduleDraft(),
					dayOfWeek: 1,
					startPeriod: 1,
					endPeriod: 2
				},
				academicConfig
			)
		).toEqual({ dayOfWeek: 1, startPeriod: 1, endPeriod: 2, weeks: [] });

		expect(
			buildCourseSchedule(
				{
					...createCourseScheduleDraft(),
					recurrenceMode: 'weeks',
					dayOfWeek: 3,
					startPeriod: 1,
					endPeriod: 1,
					selectedWeeks: [5, 3, 5]
				},
				academicConfig
			)
		).toEqual({ dayOfWeek: 3, startPeriod: 1, endPeriod: 1, weeks: [3, 5] });
	});

	it('rejects incomplete schedules and an empty selected-week mode', () => {
		expect(buildCourseSchedule(createCourseScheduleDraft(), academicConfig)).toBeNull();
		expect(
			buildCourseSchedule(
				{
					...createCourseScheduleDraft(),
					recurrenceMode: 'weeks',
					dayOfWeek: 1,
					startPeriod: 1,
					endPeriod: 1
				},
				academicConfig
			)
		).toBeNull();
	});

	it('maps every non-empty imported week set to editable selected weeks', () => {
		const singleWeekDraft = courseScheduleFromCourse(course({ weeks: [4] }));
		expect(singleWeekDraft.recurrenceMode).toBe('weeks');
		expect(singleWeekDraft.selectedWeeks).toEqual([4]);

		const draft = courseScheduleFromCourse(course({ weeks: [1, 3, 21] }));
		expect(draft.recurrenceMode).toBe('weeks');
		expect(draft.selectedWeeks).toEqual([1, 3, 21]);
		expect(buildCourseSchedule(draft, academicConfig)?.weeks).toEqual([1, 3, 21]);
	});
});
