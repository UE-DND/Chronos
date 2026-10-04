import { describe, expect, it } from 'vite-plus/test';
import {
	createCourse,
	createTimetable,
	queryTimetableCoursesForDate,
	queryTimetableCourseOccurrences
} from '../src/index';

function timetable() {
	return createTimetable({
		id: 't',
		name: 'T',
		academicConfig: {
			termStartDate: '2026-09-30',
			startWeek: 3,
			endWeek: 4,
			periodTimes: [{ index: 1, startTime: '08:00', endTime: '08:45' }],
			holidayCalendar: { holidays: [{ date: '2026-10-01', label: '国庆' }] }
		},
		courses: [
			createCourse({
				id: 'monday',
				name: 'Monday',
				dayOfWeek: 1,
				startPeriod: 1,
				endPeriod: 1,
				weeks: [3]
			}),
			createCourse({
				id: 'thursday',
				name: 'Thursday',
				dayOfWeek: 4,
				startPeriod: 1,
				endPeriod: 1,
				weeks: []
			})
		]
	});
}

describe('actual course schedule', () => {
	it('uses real semester weeks and skips holidays without extending boundary weeks', () => {
		const t = timetable();
		expect(
			queryTimetableCourseOccurrences(t).map(({ dateIso, academicWeek, course }) => [
				dateIso,
				academicWeek,
				course.id
			])
		).toEqual([
			['2026-09-28', 3, 'monday'],
			['2026-10-08', 4, 'thursday']
		]);
		expect(queryTimetableCoursesForDate(t, '2026-09-21')).toEqual([]);
		expect(queryTimetableCoursesForDate(t, '2026-10-15')).toEqual([]);
		expect(queryTimetableCoursesForDate(t, '2026-10-01')).toEqual([]);
		expect(queryTimetableCoursesForDate(t, '2026-10-08').map((hit) => hit.course.id)).toEqual([
			'thursday'
		]);
	});
	it('queries inclusive ranges, clips them to the semester and agrees with a single day', () => {
		const t = timetable();
		const range = { startDateIso: '2026-10-08', endDateIso: '2026-10-08' };
		const occurrences = queryTimetableCourseOccurrences(t, range);
		expect(occurrences).toHaveLength(1);
		expect(
			occurrences.map(({ timetableId, timetableName, course }) => ({
				timetableId,
				timetableName,
				course
			}))
		).toEqual(queryTimetableCoursesForDate(t, range.startDateIso));
		expect(
			queryTimetableCourseOccurrences(t, { startDateIso: '2026-01-01', endDateIso: '2026-12-31' })
		).toEqual(queryTimetableCourseOccurrences(t));
	});
	it('includes Sunday endpoints across a year boundary and stops after the last semester day', () => {
		const t = timetable();
		t.academicConfig.termStartDate = '2026-12-28';
		t.academicConfig.startWeek = 1;
		t.academicConfig.endWeek = 2;
		t.courses = [
			createCourse({ id: 'sunday', name: 'Sunday', dayOfWeek: 7, startPeriod: 1, endPeriod: 1 })
		];
		expect(
			queryTimetableCourseOccurrences(t, {
				startDateIso: '2027-01-03',
				endDateIso: '2027-01-10'
			}).map((hit) => hit.dateIso)
		).toEqual(['2027-01-03', '2027-01-10']);
		expect(queryTimetableCoursesForDate(t, '2027-01-17')).toEqual([]);
	});
	it('has no schedule without valid academic dates or weeks and rejects invalid query dates', () => {
		const t = timetable();
		for (const termStartDate of ['', '2026-02-30', 'unknown']) {
			t.academicConfig.termStartDate = termStartDate;
			expect(queryTimetableCoursesForDate(t, '2026-10-01')).toEqual([]);
		}
		t.academicConfig.termStartDate = '2026-09-28';
		t.academicConfig.endWeek = 2;
		expect(queryTimetableCourseOccurrences(t)).toEqual([]);
		expect(() => queryTimetableCoursesForDate(t, '2026-02-30')).toThrow(RangeError);
		expect(() =>
			queryTimetableCourseOccurrences(t, { startDateIso: '2026-10-02', endDateIso: '2026-10-01' })
		).toThrow(RangeError);
	});
	it('excludes invalid and hidden periods but leaves missing clock times to the consumer', () => {
		const t = timetable();
		delete t.academicConfig.holidayCalendar;
		t.courses.push(
			createCourse({ ...t.courses[0]!, id: 'hidden', startPeriod: 2, endPeriod: 2 }),
			createCourse({ ...t.courses[0]!, id: 'invalid', dayOfWeek: 8 })
		);
		t.academicConfig.periodTimes[0]!.startTime = '';
		expect(queryTimetableCoursesForDate(t, '2026-09-28').map((hit) => hit.course.id)).toEqual([
			'monday'
		]);
	});
});
