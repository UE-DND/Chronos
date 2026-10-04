import type { Timetable } from '../domain/timetable';
import type { UserPreferences } from '../domain/preferences';

export interface TimetableSummary {
	id: string;
	name: string;
	courseCount?: number;
	updatedAt: number;
}

/** Shared read-only state; reactive subscription belongs to the UI adapter. */
export interface ChronosState {
	readonly currentTimetable: Readonly<Timetable> | null;
	readonly activeWeek: number;
	readonly currentPeriodIndex: number | null;
	readonly activeThemeId: string | null;
	readonly activeIconThemeId: string;
	readonly userPreferences: Readonly<UserPreferences>;
	readonly now: Date;
	readonly todayIso: string;
	readonly clockFrozen: boolean;
	readonly locale: string;
}

export interface ChronosEngineState extends ChronosState {
	readonly timetables: TimetableSummary[];
}
