import type { Course } from '../domain/course';
import type { AcademicConfig, Timetable, TimetableViewPrefs } from '../domain/timetable';
import type { UserPreferences } from '../domain/preferences';
import type { RearrangeCourseOptions } from '../domain/course-reorder';

export type CourseRearrangement = Omit<
	RearrangeCourseOptions,
	'currentCourses' | 'draggedCourseId' | 'totalWeeks'
>;

/** Deletion has committed; follow-up refresh or selection may need retrying. */
export type DeleteTimetableResult =
	| { followUpFailed: false }
	| { followUpFailed: true; cause: unknown };

/** Editable details; timetable identity and persistence timestamps belong to the host. */
export type TimetableDetailsPatch = Partial<
	Pick<Timetable, 'name' | 'courses' | 'importMetadata' | 'customMetadata'>
> & {
	academicConfig?: Partial<AcademicConfig>;
	viewPrefs?: Partial<TimetableViewPrefs>;
};

/** Shared domain operations used by the engine, plugin contexts and UI adapters. */
export interface ChronosActions {
	createTimetable(name: string, config?: Partial<AcademicConfig>): Promise<Timetable>;
	/** Assigns fresh local IDs; overwriteActive retains only the active timetable ID. */
	importTimetable(
		timetable: Timetable,
		options?: { overwriteActive?: boolean }
	): Promise<Timetable>;
	switchTimetable(timetableId: string): Promise<void>;
	deleteTimetable(timetableId: string): Promise<DeleteTimetableResult>;
	updateTimetableDetails(timetableId: string, patch: TimetableDetailsPatch): Promise<void>;
	saveCourse(course: Course, timetableId?: string): Promise<void>;
	updateCourse(courseId: string, patch: Partial<Course>, timetableId?: string): Promise<void>;
	deleteCourse(courseId: string, timetableId?: string): Promise<void>;
	deleteCourseForWeek(courseId: string, week: number, timetableId?: string): Promise<void>;
	rearrangeCourse(
		courseId: string,
		options: CourseRearrangement,
		timetableId?: string
	): Promise<Course | null>;
	setTheme(themeId: string): void;
	updatePreferences(patch: Partial<UserPreferences>): Promise<void>;
	revertToDefaultThemes(): Promise<void>;
	notify(message: string, type?: 'info' | 'warn' | 'error'): void;
	setVirtualNow(now: Date | null): void;
}
