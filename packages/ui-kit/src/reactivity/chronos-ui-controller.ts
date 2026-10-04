import type {
	ChronosContext,
	ChronosEngine,
	CourseBadge,
	Disposable,
	StandardSlotMap,
	ChronosActions,
	ChronosState,
	TimetableSummary
} from '@chronos/core';
import type { Readable } from 'svelte/store';
import type { OverlayHistoryPort } from '../overlay/history-overlay';

export type ChronosUiSnapshot = ChronosState & {
	timetables: TimetableSummary[];
	slotVersion: number;
	courseBadges: Record<string, CourseBadge[]>;
	coursePaletteRevision: number;
};

export interface ChronosUiController
	extends
		Disposable,
		Readonly<ChronosUiSnapshot>,
		Pick<
			ChronosActions,
			| 'createTimetable'
			| 'switchTimetable'
			| 'deleteTimetable'
			| 'updateTimetableDetails'
			| 'saveCourse'
			| 'updateCourse'
			| 'deleteCourse'
			| 'setTheme'
			| 'updatePreferences'
			| 'notify'
		> {
	readonly snapshot: Readable<ChronosUiSnapshot>;
	readonly overlayHistoryPort?: OverlayHistoryPort;
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
	translatePlugin(pluginId: string, key: string, params?: Record<string, unknown>): string;
}

export type ChronosUiControllerEngine = ChronosEngine;
