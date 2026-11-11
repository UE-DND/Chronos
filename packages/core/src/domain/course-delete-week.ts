import type { Course } from './course';
import { cloneDomainValue } from './clone-domain-value';
import type { DeepReadonly } from '../types/readonly';

export interface DeleteCourseForWeekOptions {
	currentCourses: readonly DeepReadonly<Course>[];
	courseId: string;
	currentWeek: number;
	totalWeeks?: { startWeek: number; endWeek: number };
}

/** Removes one offering week; an empty week list means the whole academic range. */
export function deleteCourseForWeek(options: DeleteCourseForWeekOptions): Course[] | null {
	const { courseId, currentWeek, totalWeeks } = options;
	const currentCourses = options.currentCourses.map((course) =>
		cloneDomainValue({ ...course, weeks: [...course.weeks] })
	);
	const course = currentCourses.find((entry) => entry.id === courseId);
	if (!course) return null;
	const start = totalWeeks?.startWeek ?? 1;
	const end = totalWeeks?.endWeek ?? 20;
	const weeks =
		course.weeks.length > 0
			? course.weeks
			: Array.from({ length: Math.max(1, end - start + 1) }, (_, index) => start + index);
	if (!weeks.includes(currentWeek)) return null;
	const remaining = weeks
		.filter((week) => week !== currentWeek)
		.sort((left, right) => left - right);
	return remaining.length === 0
		? currentCourses.filter((entry) => entry.id !== courseId)
		: currentCourses.map((entry) =>
				entry.id === courseId ? { ...entry, weeks: remaining } : entry
			);
}
