import type { Course } from './course';

export interface AcademicWeekBounds {
	startWeek: number;
	endWeek: number;
}

function effectiveWeeks(course: Course, bounds: AcademicWeekBounds): number[] {
	if (course.weeks.length > 0) {
		return course.weeks.filter((week) => week >= bounds.startWeek && week <= bounds.endWeek);
	}
	return Array.from(
		{ length: Math.max(0, bounds.endWeek - bounds.startWeek + 1) },
		(_, index) => bounds.startWeek + index
	);
}

function periodsOverlap(left: Course, right: Course): boolean {
	return left.startPeriod <= right.endPeriod && right.startPeriod <= left.endPeriod;
}

function weeksOverlap(left: Course, right: Course, bounds: AcademicWeekBounds): boolean {
	const rightWeeks = new Set(effectiveWeeks(right, bounds));
	return effectiveWeeks(left, bounds).some((week) => rightWeeks.has(week));
}

export function findCourseScheduleConflicts(
	candidate: Course,
	courses: readonly Course[],
	bounds: AcademicWeekBounds
): Course[] {
	return courses.filter(
		(course) =>
			course.id !== candidate.id &&
			course.dayOfWeek === candidate.dayOfWeek &&
			periodsOverlap(course, candidate) &&
			weeksOverlap(course, candidate, bounds)
	);
}
