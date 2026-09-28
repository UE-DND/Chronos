import { describe, expect, it } from 'vite-plus/test';
import {
	buildTodayWidgetSnapshot,
	projectTimetableCoursesForDate
} from '../src/algorithms/today-widget';
import { createTimetable } from '../src/domain/timetable';

function timetable() {
	return createTimetable({
		id: 'active',
		name: 'Spring',
		academicConfig: {
			termStartDate: '2026-03-02',
			startWeek: 1,
			endWeek: 20,
			periodTimes: [
				{ index: 1, startTime: '08:00', endTime: '08:45' },
				{ index: 2, startTime: '08:55', endTime: '09:40' },
				{ index: 3, startTime: '10:00', endTime: '10:45' }
			]
		},
		courses: [
			{
				id: 'monday',
				name: 'Monday',
				teacher: 'A',
				location: 'R1',
				dayOfWeek: 1,
				startPeriod: 1,
				endPeriod: 1,
				weeks: [1, 3]
			},
			{
				id: 'tuesday',
				name: 'Tuesday',
				teacher: 'B',
				location: 'R2',
				dayOfWeek: 2,
				startPeriod: 2,
				endPeriod: 3,
				weeks: []
			},
			{
				id: 'future',
				name: 'Future',
				teacher: '',
				location: '',
				dayOfWeek: 1,
				startPeriod: 2,
				endPeriod: 2,
				weeks: [4]
			},
			{
				id: 'monday-late',
				name: 'Later Monday',
				teacher: '',
				location: '',
				dayOfWeek: 1,
				startPeriod: 3,
				endPeriod: 3,
				weeks: [1, 3]
			},
			{
				id: 'hidden',
				name: 'Hidden',
				teacher: '',
				location: '',
				dayOfWeek: 1,
				startPeriod: 4,
				endPeriod: 4,
				weeks: []
			}
		]
	});
}

describe('today widget projection', () => {
	it('projects the active timetable using Today scope day, week, visibility, and sort rules', () => {
		const active = timetable();
		expect(
			projectTimetableCoursesForDate(active, '2026-03-02').map(({ course }) => course.id)
		).toEqual(['monday', 'monday-late']);
		expect(
			projectTimetableCoursesForDate(active, '2026-03-03').map(({ course }) => course.id)
		).toEqual(['tuesday']);
		expect(
			projectTimetableCoursesForDate(active, '2026-03-09').map(({ course }) => course.id)
		).toEqual([]);
		expect(
			projectTimetableCoursesForDate(active, '2026-03-16').map(({ course }) => course.id)
		).toEqual(['monday', 'monday-late']);
		expect(
			projectTimetableCoursesForDate(active, '2026-03-23').map(({ course }) => course.id)
		).toEqual(['future']);
	});

	it('builds an inclusive 14-day date-indexed snapshot with per-day academic weeks and times', () => {
		const snapshot = buildTodayWidgetSnapshot({
			timetable: timetable(),
			startDateIso: '2026-03-02',
			generatedAt: 1234
		});

		expect(snapshot.version).toBe(1);
		expect(snapshot.generatedAt).toBe(1234);
		expect(snapshot.validFromIso).toBe('2026-03-02');
		expect(snapshot.validUntilIso).toBe('2026-03-15');
		expect(snapshot.activeTimetable).toEqual({ id: 'active', name: 'Spring' });
		expect(Object.keys(snapshot.days)).toHaveLength(14);
		expect(snapshot.days['2026-03-02']?.academicWeek).toBe(1);
		expect(snapshot.days['2026-03-09']?.academicWeek).toBe(2);
		expect(snapshot.days['2026-03-02']?.courses[0]).toMatchObject({
			id: 'monday',
			startTime: '08:00',
			endTime: '08:45',
			startMinutes: 480,
			endMinutes: 525
		});
	});

	it('keeps a valid date range and empty days when there is no active timetable', () => {
		const snapshot = buildTodayWidgetSnapshot({ timetable: null, startDateIso: '2026-12-28' });

		expect(snapshot.activeTimetable).toBeNull();
		expect(snapshot.validUntilIso).toBe('2027-01-10');
		expect(Object.keys(snapshot.days)).toHaveLength(14);
		expect(snapshot.days['2026-12-28']).toEqual({ academicWeek: null, courses: [] });
	});

	it('keeps the 14-day window inclusive across a month boundary', () => {
		const snapshot = buildTodayWidgetSnapshot({ timetable: null, startDateIso: '2026-01-28' });

		expect(snapshot.validUntilIso).toBe('2026-02-10');
		expect(snapshot.days['2026-02-01']).toEqual({ academicWeek: null, courses: [] });
	});

	it('sorts projected entries by periods and carries resolved colors when supplied', () => {
		const active = timetable();
		const snapshot = buildTodayWidgetSnapshot({
			timetable: active,
			startDateIso: '2026-03-02',
			colorsByCourseName: new Map([['Monday', '#123456']])
		});
		expect(snapshot.days['2026-03-02']?.courses[0]?.colorHex).toBe('#123456');
	});
});
