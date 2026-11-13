import type {
	ChronosContext,
	ChronosEngine,
	ReadonlyCourseBadges,
	Disposable,
	StandardSlotMap,
	ChronosActions,
	ChronosState,
	TimetableSummary,
	DeepReadonly,
	ReadonlyTimetable,
	CalendarHoliday
} from '@chronos/core';
import type { Readable } from 'svelte/store';
import type { OverlayHistoryPort } from '../overlay/history-overlay';

export type ChronosUiSnapshot = ChronosState & {
	readonly timetables: readonly DeepReadonly<TimetableSummary>[];
	readonly slotVersion: number;
	readonly courseBadges: ReadonlyCourseBadges;
	readonly coursePaletteRevision: number;
};

/** Public presentation data shared with plugin UIs. Domain writes belong to their context. */
export interface ChronosUiView extends Readonly<ChronosUiSnapshot> {
	readonly snapshot: Readable<ChronosUiSnapshot>;
	readonly overlayHistoryPort?: OverlayHistoryPort;
	translatePlugin(pluginId: string, key: string, params?: Record<string, unknown>): string;
	resolveHolidays(timetable: ReadonlyTimetable): readonly CalendarHoliday[];
}

export interface ChronosUiController
	extends
		Disposable,
		ChronosUiView,
		Pick<
			ChronosActions,
			| 'createTimetable'
			| 'switchTimetable'
			| 'deleteTimetable'
			| 'updateTimetableDetails'
			| 'saveCourse'
			| 'updateCourse'
			| 'deleteCourse'
			| 'deleteCourseForWeek'
			| 'rearrangeCourse'
			| 'setTheme'
			| 'updatePreferences'
			| 'notify'
		> {
	getPluginContext(pluginId: string): ChronosContext;
	getPluginContextForSlot<K extends keyof StandardSlotMap>(
		slotName: K,
		slotId: string
	): ChronosContext;
	getSlots<K extends keyof StandardSlotMap>(slotName: K): Array<StandardSlotMap[K]>;
	getSlotItem<K extends keyof StandardSlotMap>(
		slotName: K,
		id: string
	): StandardSlotMap[K] | undefined;
	resolveSlotOwner<K extends keyof StandardSlotMap>(
		slotName: K,
		slotId: string
	): string | undefined;
	clearAllData(): Promise<void>;
}

export type ChronosUiControllerEngine = ChronosEngine;
