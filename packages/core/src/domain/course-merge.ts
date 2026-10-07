import type { Course } from './course';

export interface AcademicWeekRange {
	startWeek: number;
	endWeek: number;
}

function offeringMergeKey(course: Course): string {
	return JSON.stringify([
		course.name,
		course.teacher,
		course.location,
		course.dayOfWeek,
		course.startPeriod,
		course.endPeriod,
		course.remark ?? ''
	]);
}

function sortedWeeks(weeks: readonly number[]): number[] {
	return [...weeks].sort((left, right) => left - right);
}

function unionWeeks(left: readonly number[], right: readonly number[]): number[] {
	if (left.length === 0 || right.length === 0) return [];
	return sortedWeeks([...new Set([...left, ...right])]);
}

function cloneOffering(course: Course, weeks: number[]): Course {
	return {
		...course,
		weeks,
		...(course.customMetadata ? { customMetadata: { ...course.customMetadata } } : {})
	};
}

/**
 * Merges offerings that share name, teacher, location, slot, and remark.
 * Explicit weeks stay explicit, even when they cover the academic range.
 * Empty `weeks` means every academic week. The first row in each group keeps its id
 * and relative position; the timetable is not re-sorted.
 */
export function mergeOfferingsWithIdentity(
	courses: readonly Course[],
	_totalWeeks?: AcademicWeekRange
): { courses: Course[]; canonicalIds: Map<string, string> } {
	const canonicalIds = new Map<string, string>();
	const indexByKey = new Map<string, number>();
	const result: Course[] = [];

	for (const course of courses) {
		const key = offeringMergeKey(course);
		const existingIndex = indexByKey.get(key);
		if (existingIndex === undefined) {
			indexByKey.set(key, result.length);
			result.push(cloneOffering(course, sortedWeeks(course.weeks)));
			canonicalIds.set(course.id, course.id);
			continue;
		}

		const existing = result[existingIndex]!;
		canonicalIds.set(course.id, existing.id);
		result[existingIndex] = cloneOffering(existing, unionWeeks(existing.weeks, course.weeks));
	}

	return { courses: result, canonicalIds };
}

export function mergeCompatibleOfferings(
	courses: readonly Course[],
	totalWeeks?: AcademicWeekRange
): Course[] {
	return mergeOfferingsWithIdentity(courses, totalWeeks).courses;
}
