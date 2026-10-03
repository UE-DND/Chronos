import type { Course } from '../domain/course';
import { isPrepareReminderMinutes } from '../domain/preferences';
import type { PeriodTime, Timetable } from '../domain/timetable';
import { matchesCourseQuery } from '../domain/course-query';
import type { CourseQueryHit } from '../types/course-query';
import { AcademicCalendarService } from './calendar';
import { addDays, dayOfWeekFromIso, formatIsoDate, parseIsoDate } from './date';
import { isCoursePeriodVisible } from './display-models';
import { normalizedCourseName } from './palette';

export const TODAY_WIDGET_SNAPSHOT_VERSION = 1 as const;
export const TODAY_WIDGET_SNAPSHOT_DAYS = 14;

export interface TodayWidgetCourse {
	id: string;
	name: string;
	location: string;
	startPeriod: number;
	endPeriod: number;
	startTime: string | null;
	endTime: string | null;
	startMinutes: number | null;
	endMinutes: number | null;
	colorHex?: string;
}

export interface TodayWidgetDay {
	academicWeek: number | null;
	courses: TodayWidgetCourse[];
}

export interface TodayWidgetSnapshot {
	version: typeof TODAY_WIDGET_SNAPSHOT_VERSION;
	generatedAt: number;
	prepareReminderMinutes: number;
	validFromIso: string;
	validUntilIso: string;
	activeTimetable: { id: string; name: string } | null;
	periodTimes: PeriodTime[];
	days: Record<string, TodayWidgetDay>;
}

function parseClockMinutes(value: string | null): number | null {
	if (!value) return null;
	const match = /^(\d{2}):(\d{2})$/.exec(value);
	if (!match) return null;
	const hours = Number(match[1]);
	const minutes = Number(match[2]);
	if (hours > 23 || minutes > 59) return null;
	return hours * 60 + minutes;
}

function periodTime(periods: readonly PeriodTime[], index: number): PeriodTime | undefined {
	return periods.find((period) => period.index === index);
}

function sortCourseHits(hits: CourseQueryHit[], locale: string): CourseQueryHit[] {
	return [...hits].sort((left, right) => {
		const startDiff = left.course.startPeriod - right.course.startPeriod;
		if (startDiff !== 0) return startDiff;
		const endDiff = left.course.endPeriod - right.course.endPeriod;
		if (endDiff !== 0) return endDiff;
		return left.course.name.localeCompare(right.course.name, locale);
	});
}

/** Applies the Today plugin's shared visibility and ordering rules to query results. */
export function projectTodayCourseHits(
	hits: CourseQueryHit[],
	periodCount: number,
	locale = 'zh-CN'
): CourseQueryHit[] {
	return sortCourseHits(
		hits.filter(({ course }) => isCoursePeriodVisible(course, periodCount)),
		locale
	);
}

/** Courses visible in the Today plugin's active-timetable scope for one date. */
export function projectTimetableCoursesForDate(
	timetable: Timetable,
	dateIso: string,
	locale = 'zh-CN'
): CourseQueryHit[] {
	const calendar = new AcademicCalendarService();
	const week = calendar.calculateAcademicWeek(dateIso, timetable.academicConfig);
	const dayOfWeek = dayOfWeekFromIso(dateIso);
	const hits = timetable.courses
		.filter(
			(course) =>
				matchesCourseQuery(course, { dayOfWeek, week }) &&
				isCoursePeriodVisible(course, timetable.academicConfig.periodTimes.length)
		)
		.map((course) => ({ timetableId: timetable.id, timetableName: timetable.name, course }));
	return projectTodayCourseHits(hits, timetable.academicConfig.periodTimes.length, locale);
}

function projectCourse(
	course: Course,
	periodTimes: readonly PeriodTime[],
	colorsByCourseName?: ReadonlyMap<string, string>
): TodayWidgetCourse {
	const startTime = periodTime(periodTimes, course.startPeriod)?.startTime ?? null;
	const endTime = periodTime(periodTimes, course.endPeriod)?.endTime ?? null;
	const colorHex = colorsByCourseName?.get(normalizedCourseName(course.name));
	return {
		id: course.id,
		name: course.name,
		location: course.location,
		startPeriod: course.startPeriod,
		endPeriod: course.endPeriod,
		startTime,
		endTime,
		startMinutes: parseClockMinutes(startTime),
		endMinutes: parseClockMinutes(endTime),
		...(colorHex ? { colorHex } : {})
	};
}

export function buildTodayWidgetSnapshot(options: {
	prepareReminderMinutes: number;
	timetable: Timetable | null;
	startDateIso: string;
	generatedAt?: number;
	locale?: string;
	colorsByCourseName?: ReadonlyMap<string, string>;
}): TodayWidgetSnapshot {
	const {
		timetable,
		startDateIso,
		generatedAt = Date.now(),
		prepareReminderMinutes,
		locale = 'zh-CN',
		colorsByCourseName
	} = options;
	if (!isPrepareReminderMinutes(prepareReminderMinutes)) {
		throw new RangeError('prepareReminderMinutes must be 5–60 in steps of 5');
	}
	const calendar = new AcademicCalendarService();
	const startDate = parseIsoDate(startDateIso);
	const days: Record<string, TodayWidgetDay> = {};
	for (let offset = 0; offset < TODAY_WIDGET_SNAPSHOT_DAYS; offset += 1) {
		const dateIso = formatIsoDate(addDays(startDate, offset));
		days[dateIso] = timetable
			? {
					academicWeek: calendar.calculateAcademicWeek(dateIso, timetable.academicConfig),
					courses: projectTimetableCoursesForDate(timetable, dateIso, locale).map(({ course }) =>
						projectCourse(course, timetable.academicConfig.periodTimes, colorsByCourseName)
					)
				}
			: { academicWeek: null, courses: [] };
	}
	const validUntilIso = formatIsoDate(addDays(startDate, TODAY_WIDGET_SNAPSHOT_DAYS - 1));
	return {
		version: TODAY_WIDGET_SNAPSHOT_VERSION,
		generatedAt,
		prepareReminderMinutes,
		validFromIso: startDateIso,
		validUntilIso,
		activeTimetable: timetable ? { id: timetable.id, name: timetable.name } : null,
		periodTimes: timetable?.academicConfig.periodTimes.map((period) => ({ ...period })) ?? [],
		days
	};
}
