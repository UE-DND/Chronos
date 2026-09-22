import type { AcademicConfig, Course } from '@chronos/core';
import type { CourseDraft } from '$lib/models/drafts';

export type CourseRecurrenceMode = CourseDraft['recurrenceMode'];
export type CourseScheduleDraft = Pick<
	CourseDraft,
	'recurrenceMode' | 'dayOfWeek' | 'startPeriod' | 'endPeriod' | 'selectedWeeks'
>;

export interface ResolvedCourseSchedule {
	dayOfWeek: number;
	startPeriod: number;
	endPeriod: number;
	weeks: number[];
}

function sortedUniqueWeeks(weeks: readonly number[]): number[] {
	return [...new Set(weeks)].sort((left, right) => left - right);
}

export function createCourseScheduleDraft(): CourseScheduleDraft {
	return {
		recurrenceMode: 'all',
		dayOfWeek: null,
		startPeriod: null,
		endPeriod: null,
		selectedWeeks: []
	};
}

export function courseScheduleFromCourse(course: Course): CourseScheduleDraft {
	const weeks = sortedUniqueWeeks(course.weeks);
	const base = {
		dayOfWeek: course.dayOfWeek,
		startPeriod: course.startPeriod,
		endPeriod: course.endPeriod,
		selectedWeeks: []
	};
	if (weeks.length === 0) return { ...base, recurrenceMode: 'all' };
	return { ...base, recurrenceMode: 'weeks', selectedWeeks: weeks };
}

export function buildCourseSchedule(
	draft: CourseScheduleDraft,
	academicConfig: AcademicConfig
): ResolvedCourseSchedule | null {
	const { startPeriod, endPeriod } = draft;
	const periodIndexes = new Set(academicConfig.periodTimes.map((period) => period.index));
	if (
		startPeriod === null ||
		endPeriod === null ||
		!periodIndexes.has(startPeriod) ||
		!periodIndexes.has(endPeriod) ||
		endPeriod < startPeriod
	) {
		return null;
	}

	const dayOfWeek = draft.dayOfWeek;
	if (dayOfWeek === null || dayOfWeek < 1 || dayOfWeek > 7) return null;

	if (draft.recurrenceMode === 'all') {
		return { dayOfWeek, startPeriod, endPeriod, weeks: [] };
	}

	const weeks = sortedUniqueWeeks(draft.selectedWeeks);
	return weeks.length > 0 ? { dayOfWeek, startPeriod, endPeriod, weeks } : null;
}
