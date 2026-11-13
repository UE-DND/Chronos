import type { Timetable } from '../domain/timetable';
import type { UserPreferences } from '../domain/preferences';
import type { DeepReadonly } from './readonly';

export type ReadonlyTimetable = DeepReadonly<Timetable>;
export type ReadonlyUserPreferences = DeepReadonly<UserPreferences>;

export interface TimetableSummary {
	id: string;
	name: string;
	courseCount?: number;
	updatedAt: number;
}

/** Shared read-only state; reactive subscription belongs to the UI adapter. */
export interface ChronosState {
	readonly calendarRevision: number;
	readonly currentTimetable: ReadonlyTimetable | null;
	readonly activeWeek: number;
	/** First period from midnight, then active or next period during breaks; null after the last end. */
	readonly currentPeriodIndex: number | null;
	readonly activeThemeId: string | null;
	readonly activeIconThemeId: string;
	readonly userPreferences: ReadonlyUserPreferences;
	readonly now: Date;
	readonly todayIso: string;
	readonly clockFrozen: boolean;
	readonly locale: string;
}

export interface ChronosEngineState extends ChronosState {
	readonly timetables: readonly DeepReadonly<TimetableSummary>[];
}
