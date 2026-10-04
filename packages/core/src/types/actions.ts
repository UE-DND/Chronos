import type { Course } from '../domain/course';
import type { AcademicConfig, Timetable, TimetableViewPrefs } from '../domain/timetable';
import type { UserPreferences } from '../domain/preferences';

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
	importTimetable(
		timetable: Timetable,
		options?: { overwriteActive?: boolean }
	): Promise<Timetable>;
	switchTimetable(timetableId: string): Promise<void>;
	deleteTimetable(timetableId: string): Promise<void>;
	updateTimetableDetails(timetableId: string, patch: TimetableDetailsPatch): Promise<void>;
	saveCourse(course: Course): Promise<void>;
	updateCourse(courseId: string, patch: Partial<Course>): Promise<void>;
	deleteCourse(courseId: string): Promise<void>;
	setTheme(themeId: string): void;
	updatePreferences(patch: Partial<UserPreferences>): Promise<void>;
	revertToDefaultThemes(): Promise<void>;
	notify(message: string, type?: 'info' | 'warn' | 'error'): void;
	setVirtualNow(now: Date | null): void;
}
