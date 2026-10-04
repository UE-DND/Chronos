import type { Timetable } from '../domain/timetable';
import type { CourseQueryHit } from '../types/course-query';
import { AcademicCalendarService } from './calendar';
import { formatIsoDate, parseIsoDate, weeksBetween } from './date';
import { isCoursePeriodVisible } from './display-models';
import { buildHolidayLookup } from './holiday-calendar';

export interface CourseDateRange {
	startDateIso: string;
	endDateIso: string;
}

export interface CourseOccurrence extends CourseQueryHit {
	dateIso: string;
	academicWeek: number;
}

function validDate(value: string): boolean {
	try {
		return formatIsoDate(parseIsoDate(value)) === value;
	} catch {
		return false;
	}
}

/**
 * Actual course occurrences, in date order. Range endpoints are inclusive; omitting
 * the range queries the whole semester. Invalid academic configuration has no
 * schedule. Invalid query ranges throw RangeError. Display-week clamping is not used.
 * Holiday and period rules belong here; clock times, locale sorting and reminders
 * belong to consumers. Course objects are borrowed from the supplied timetable.
 */
export function queryTimetableCourseOccurrences(
	timetable: Timetable,
	range?: CourseDateRange
): CourseOccurrence[] {
	if (
		range &&
		(!validDate(range.startDateIso) ||
			!validDate(range.endDateIso) ||
			range.startDateIso > range.endDateIso)
	) {
		throw new RangeError('Expected an inclusive ISO date range');
	}
	const config = timetable.academicConfig;
	if (
		!validDate(config.termStartDate) ||
		!Number.isInteger(config.startWeek) ||
		!Number.isInteger(config.endWeek) ||
		config.startWeek < 1 ||
		config.endWeek < config.startWeek
	)
		return [];
	const calendar = new AcademicCalendarService();
	const termStart = parseIsoDate(
		calendar.resolveWeekStart(config, config.startWeek, config.termStartDate)
	);
	const startWeek = range
		? Math.max(
				config.startWeek,
				config.startWeek + weeksBetween(termStart, parseIsoDate(range.startDateIso))
			)
		: config.startWeek;
	const endWeek = range
		? Math.min(
				config.endWeek,
				config.startWeek + weeksBetween(termStart, parseIsoDate(range.endDateIso))
			)
		: config.endWeek;
	const holidays = buildHolidayLookup(config.holidayCalendar);
	const courses = timetable.courses.filter(
		(course) =>
			Number.isInteger(course.dayOfWeek) &&
			course.dayOfWeek >= 1 &&
			course.dayOfWeek <= 7 &&
			Number.isInteger(course.startPeriod) &&
			Number.isInteger(course.endPeriod) &&
			course.startPeriod >= 1 &&
			course.endPeriod >= course.startPeriod &&
			isCoursePeriodVisible(course, config.periodTimes.length)
	);
	const occurrences: CourseOccurrence[] = [];
	for (let week = startWeek; week <= endWeek; week++) {
		for (const course of courses) {
			if (course.weeks.length && !course.weeks.includes(week)) continue;
			const dateIso = calendar.resolveCourseDate(
				config,
				week,
				course.dayOfWeek,
				config.termStartDate
			);
			if (range && (dateIso < range.startDateIso || dateIso > range.endDateIso)) continue;
			if (holidays.has(dateIso)) continue;
			occurrences.push({
				timetableId: timetable.id,
				timetableName: timetable.name,
				course,
				dateIso,
				academicWeek: week
			});
		}
	}
	return occurrences.sort((a, b) => a.dateIso.localeCompare(b.dateIso));
}

/** Actual courses on one date, without UI sorting or notification timing. */
export function queryTimetableCoursesForDate(
	timetable: Timetable,
	dateIso: string
): CourseQueryHit[] {
	return queryTimetableCourseOccurrences(timetable, {
		startDateIso: dateIso,
		endDateIso: dateIso
	}).map(({ timetableId, timetableName, course }) => ({ timetableId, timetableName, course }));
}
