import type { Course } from './course';
import type { DeepReadonly } from '../types/readonly';

export interface AcademicWeekBounds {
	startWeek: number;
	endWeek: number;
}

function effectiveWeeks(course: DeepReadonly<Course>, bounds: AcademicWeekBounds): number[] {
	if (course.weeks.length > 0) {
		return course.weeks.filter((week) => week >= bounds.startWeek && week <= bounds.endWeek);
	}
	return Array.from(
		{ length: Math.max(0, bounds.endWeek - bounds.startWeek + 1) },
		(_, index) => bounds.startWeek + index
	);
}

function periodsOverlap(left: DeepReadonly<Course>, right: DeepReadonly<Course>): boolean {
	return left.startPeriod <= right.endPeriod && right.startPeriod <= left.endPeriod;
}

function weeksOverlap(
	left: DeepReadonly<Course>,
	right: DeepReadonly<Course>,
	bounds: AcademicWeekBounds
): boolean {
	const rightWeeks = new Set(effectiveWeeks(right, bounds));
	return effectiveWeeks(left, bounds).some((week) => rightWeeks.has(week));
}

export function findCourseScheduleConflicts(
	candidate: DeepReadonly<Course>,
	courses: readonly DeepReadonly<Course>[],
	bounds: AcademicWeekBounds
): DeepReadonly<Course>[] {
	return courses.filter(
		(course) =>
			course.id !== candidate.id &&
			course.dayOfWeek === candidate.dayOfWeek &&
			periodsOverlap(course, candidate) &&
			weeksOverlap(course, candidate, bounds)
	);
}
