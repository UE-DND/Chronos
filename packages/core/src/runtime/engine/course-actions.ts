import type { Course } from '../../domain/course';
import { deleteCourseForWeek } from '../../domain/course-delete-week';
import { rearrangeCourseSchedule } from '../../domain/course-reorder';
import type { CourseRearrangement } from '../../types/actions';
import { immutableSnapshot } from '../immutable-snapshot';
import { cloneDomainValue } from '../../domain/clone-domain-value';
import type { EngineActionHost } from './engine-action-host';
import type { TimetableActions } from './timetable-actions';

/** Semantic course changes are applied to the latest persisted timetable. */
export class CourseActions {
	constructor(
		private readonly host: EngineActionHost,
		private readonly timetables: TimetableActions
	) {}

	private target(timetableId?: string): string {
		const id = timetableId ?? this.host.getCurrentTimetable()?.id;
		if (!id) throw new Error('No active timetable to change course');
		return id;
	}

	async saveCourse(course: Course, timetableId?: string): Promise<void> {
		const owned = immutableSnapshot(course);
		return this.timetables.mutateTimetable(this.target(timetableId), (current) => {
			const courses = [...current.courses];
			const index = courses.findIndex((entry) => entry.id === owned.id);
			if (index >= 0) courses[index] = owned;
			else courses.push(owned);
			return {
				...current,
				courses,
				viewPrefs: {
					...current.viewPrefs,
					showSaturday: current.viewPrefs.showSaturday || owned.dayOfWeek === 6,
					showSunday: current.viewPrefs.showSunday || owned.dayOfWeek === 7
				}
			};
		});
	}

	async updateCourse(
		courseId: string,
		patch: Partial<Course>,
		timetableId?: string
	): Promise<void> {
		const owned = immutableSnapshot(patch);
		return this.timetables.mutateTimetable(this.target(timetableId), (current) => ({
			...current,
			courses: current.courses.map((course) =>
				course.id === courseId ? { ...course, ...owned, id: course.id } : course
			)
		}));
	}

	async deleteCourse(courseId: string, timetableId?: string): Promise<void> {
		return this.timetables.mutateTimetable(this.target(timetableId), (current) => ({
			...current,
			courses: current.courses.filter((course) => course.id !== courseId)
		}));
	}

	async deleteCourseForWeek(courseId: string, week: number, timetableId?: string): Promise<void> {
		return this.timetables.mutateTimetable(this.target(timetableId), (current) => ({
			...current,
			courses:
				deleteCourseForWeek({
					currentCourses: current.courses,
					courseId,
					currentWeek: week,
					totalWeeks: current.academicConfig
				}) ?? current.courses
		}));
	}

	async rearrangeCourse(
		courseId: string,
		options: CourseRearrangement,
		timetableId?: string
	): Promise<Course | null> {
		let movedCourse: Course | null = null;
		await this.timetables.mutateTimetable(this.target(timetableId), (current) => {
			const result = rearrangeCourseSchedule({
				...options,
				currentCourses: current.courses,
				draggedCourseId: courseId,
				totalWeeks: current.academicConfig
			});
			movedCourse = result?.movedCourse ?? null;
			return { ...current, courses: result?.courses ?? current.courses };
		});
		return cloneDomainValue(movedCourse);
	}
}
