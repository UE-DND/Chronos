import { describe, expect, it } from 'vite-plus/test';
import {
	calculateTimetableGrid,
	buildTimetableCourseDisplayModels,
	deriveWeekendViewPrefs,
	findCourseScheduleConflicts
} from '../src';
import timetable from './fixtures/timetable.json';
import expected from './fixtures/timetable.expected.json';

describe('shared timetable scenario', () => {
	it('shows odd weeks, the early segment and Saturday at the fixed date', () => {
		const grid = calculateTimetableGrid(expected.date, expected.week, timetable);
		expect(grid.visibleDays.length).toBe(6);
		const models = buildTimetableCourseDisplayModels(
			timetable,
			new Set([1, 2, 3, 4, 5, 6, 7]),
			expected.week
		);
		expect(models.filter((item) => item.isInDisplayedWeek).map((item) => item.course.name)).toEqual(
			expected.weekOneCourseNames
		);
		expect(deriveWeekendViewPrefs(timetable.courses)).toEqual(expected.weekend);
	});
	it('retains split segments and detects the intentional overlap', () => {
		expect(timetable.courses.filter((course) => course.name === '数据库原理')).toHaveLength(2);
		expect(
			findCourseScheduleConflicts(
				timetable.courses[0]!,
				timetable.courses,
				timetable.academicConfig
			).map((course) => course.name)
		).toEqual(['课程设计']);
	});
});
