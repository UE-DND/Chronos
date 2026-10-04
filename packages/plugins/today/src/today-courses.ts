import {
	type Course,
	type CourseQueryHit,
	type IStorageService,
	type PeriodTime,
	type Timetable,
	findCurrentPeriodIndex,
	parsePeriodRanges,
	queryTimetableCoursesForDate
} from '@chronos/core';
import type { TodayScope } from './constants';

export type { TodayScope };

export type CourseTimeStatus = 'past' | 'current' | 'preparing' | 'upcoming';

export interface TodayCourseHit extends CourseQueryHit {
	periodTimes: PeriodTime[];
}

export interface TodayCourseEntry {
	hit: CourseQueryHit;
	timeRange: ReturnType<typeof resolvePeriodTimeRange>;
	status: CourseTimeStatus;
	minutesUntilStart: number | null;
}

export function resolvePeriodTimeRange(
	periodTimes: PeriodTime[],
	startPeriod: number,
	endPeriod: number
): { startTime: string; endTime: string } | null {
	const start = periodTimes.find((period) => period.index === startPeriod);
	const end = periodTimes.find((period) => period.index === endPeriod);
	if (!start || !end) return null;
	return { startTime: start.startTime, endTime: end.endTime };
}

export function sortCourseHits<T extends CourseQueryHit>(hits: T[], locale: string): T[] {
	return [...hits].sort((left, right) => {
		const startDiff = left.course.startPeriod - right.course.startPeriod;
		if (startDiff !== 0) return startDiff;
		const endDiff = left.course.endPeriod - right.course.endPeriod;
		if (endDiff !== 0) return endDiff;
		return left.course.name.localeCompare(right.course.name, locale);
	});
}

export function resolveMinutesUntilCourseStart(
	course: Course,
	periodTimes: PeriodTime[],
	nowMinutes: number
): number | null {
	const ranges = parsePeriodRanges(periodTimes);
	const start = ranges.find((period) => period.index === course.startPeriod);
	if (!start || nowMinutes >= start.startMinutes) return null;
	return start.startMinutes - nowMinutes;
}

export function resolveCourseTimeStatus(
	course: Course,
	periodTimes: PeriodTime[],
	nowMinutes: number,
	currentPeriodIndex: number | null,
	prepareReminderMinutes = 0
): CourseTimeStatus {
	const ranges = parsePeriodRanges(periodTimes);
	const start = ranges.find((period) => period.index === course.startPeriod);
	const end = ranges.find((period) => period.index === course.endPeriod);

	if (start && end) {
		if (nowMinutes > end.endMinutes) return 'past';
		if (nowMinutes >= start.startMinutes && nowMinutes <= end.endMinutes) return 'current';
		if (nowMinutes < start.startMinutes) {
			const minutesUntilStart = start.startMinutes - nowMinutes;
			if (prepareReminderMinutes > 0 && minutesUntilStart <= prepareReminderMinutes) {
				return 'preparing';
			}
			return 'upcoming';
		}
	}

	if (currentPeriodIndex == null) return 'upcoming';
	if (course.endPeriod < currentPeriodIndex) return 'past';
	if (course.startPeriod <= currentPeriodIndex && course.endPeriod >= currentPeriodIndex) {
		return 'current';
	}
	return 'upcoming';
}

export function attachCourseStatuses(
	hits: TodayCourseHit[],
	nowMinutes: number,
	prepareReminderMinutes: number,
	locale: string
): TodayCourseEntry[] {
	return sortCourseHits(hits, locale).map((hit) => ({
		hit,
		timeRange: resolvePeriodTimeRange(
			hit.periodTimes,
			hit.course.startPeriod,
			hit.course.endPeriod
		),
		status: resolveCourseTimeStatus(
			hit.course,
			hit.periodTimes,
			nowMinutes,
			findCurrentPeriodIndex(parsePeriodRanges(hit.periodTimes), nowMinutes),
			prepareReminderMinutes
		),
		minutesUntilStart: resolveMinutesUntilCourseStart(hit.course, hit.periodTimes, nowMinutes)
	}));
}

export async function queryTodayCourses(
	storage: IStorageService,
	options: {
		todayIso: string;
		scope: TodayScope;
		timetable: Timetable | null;
	}
): Promise<TodayCourseHit[]> {
	const { todayIso, scope, timetable } = options;
	if (!timetable) return [];

	const query = (entry: Timetable): TodayCourseHit[] =>
		queryTimetableCoursesForDate(entry, todayIso).map((hit) => ({
			...hit,
			periodTimes: entry.academicConfig.periodTimes
		}));
	if (scope === 'active') return query(timetable);
	const summaries = await storage.listTimetables();
	const entries = await Promise.all(summaries.map((summary) => storage.getTimetable(summary.id)));
	return entries.flatMap((entry) => (entry ? query(entry) : []));
}
