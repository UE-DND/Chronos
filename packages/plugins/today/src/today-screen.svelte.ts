import type { ChronosUiController, ChronosUiSnapshot } from '@chronos/ui-kit';
import { appLocaleToBcp47, haptic } from '@chronos/ui-kit';
import {
	currentTimeMinutes,
	DEFAULT_USER_PREFERENCES,
	ICoursePresentationService,
	IStorageService,
	normalizedCourseName,
	todayIsoDate,
	type CoursePaletteEntry
} from '@chronos/core';
import type { TodayScope } from './constants';
import {
	attachCourseStatuses,
	queryTodayCourses,
	type TodayCourseEntry,
	type TodayCourseHit
} from './today-courses';

export function coursePaintKey(timetableId: string, courseName: string): string {
	return `${timetableId}\0${normalizedCourseName(courseName)}`;
}
export interface TodayScreenController {
	readonly today: string;
	readonly now: Date;
	readonly scope: TodayScope;
	readonly prepareReminderMinutes: number;
	readonly courseEntries: TodayCourseEntry[];
	readonly paintByCourseKey: ReadonlyMap<string, CoursePaletteEntry>;
	init(controller: ChronosUiController, pluginId: string): Promise<void>;
	dispose(): void;
	persistScope(nextScope: TodayScope): Promise<void>;
}
export function createTodayScreenController(): TodayScreenController {
	let controller: ChronosUiController | undefined;
	let pluginId = '';
	let snapshot = $state.raw<ChronosUiSnapshot | null>(null);
	let scope = $state<TodayScope>('active');
	let courseEntries = $state.raw<TodayCourseEntry[]>([]);
	let paintByCourseKey = $state.raw<Map<string, CoursePaletteEntry>>(new Map());
	let hits: TodayCourseHit[] = [];
	let disposed = false;
	let unsubscribeSnapshot: (() => void) | undefined;
	let unsubscribeConfig: (() => void) | undefined;
	let courseRequest = 0;
	let paintRequest = 0;
	let queryKey = '';
	let paletteRevision: number | undefined;
	let queryDirty = false;
	let paintsDirty = false;
	let queued: Promise<void> | undefined;
	function now() {
		return snapshot?.now ?? new Date();
	}
	function today() {
		return snapshot?.todayIso || todayIsoDate();
	}
	function prepareReminderMinutes() {
		return (
			snapshot?.userPreferences?.prepareReminderMinutes ??
			DEFAULT_USER_PREFERENCES.prepareReminderMinutes
		);
	}
	function updateStatuses() {
		courseEntries = attachCourseStatuses(
			hits,
			currentTimeMinutes(now()),
			prepareReminderMinutes(),
			appLocaleToBcp47(snapshot?.locale)
		);
	}
	async function refreshPaints() {
		const request = ++paintRequest;
		const ctx = controller?.getPluginContext(pluginId);
		const presentation = ctx?.tryService(ICoursePresentationService);
		const entries = courseEntries;
		try {
			const paints = new Map<string, CoursePaletteEntry>();
			if (presentation)
				await Promise.all(
					[...new Set(entries.map((entry) => entry.hit.timetableId))].map(async (id) => {
						const lookup = await presentation.resolveCoursePaintsForTimetable(id);
						for (const [name, paint] of lookup) paints.set(coursePaintKey(id, name), paint);
					})
				);
			if (!disposed && request === paintRequest) paintByCourseKey = paints;
		} catch {
			if (!disposed && request === paintRequest) paintByCourseKey = new Map();
		}
	}
	async function queryCourses() {
		const request = ++courseRequest;
		const timetable = snapshot?.currentTimetable;
		if (!controller || !timetable) {
			hits = [];
			updateStatuses();
			await refreshPaints();
			return;
		}
		try {
			const result = await queryTodayCourses(
				controller.getPluginContext(pluginId).service(IStorageService),
				{ todayIso: today(), scope, timetable }
			);
			if (disposed || request !== courseRequest) return;
			hits = result;
			updateStatuses();
			await refreshPaints();
		} catch {
			if (disposed || request !== courseRequest) return;
			hits = [];
			courseEntries = [];
			paintByCourseKey = new Map();
			++paintRequest;
		}
	}
	function schedule(): Promise<void> {
		if (disposed || !snapshot) return Promise.resolve();
		const timetable = snapshot.currentTimetable;
		// Value comparison ignores unrelated snapshot notifications and tolerates mutable host entities.
		const key = JSON.stringify([
			today(),
			scope,
			timetable?.id,
			timetable?.academicConfig,
			timetable?.courses,
			scope === 'all' ? snapshot.timetables?.map((t) => [t.id, t.updatedAt]) : null
		]);
		if (key !== queryKey) {
			queryKey = key;
			queryDirty = true;
			++courseRequest;
			++paintRequest;
		}
		if (paletteRevision !== snapshot.coursePaletteRevision) {
			paletteRevision = snapshot.coursePaletteRevision;
			paintsDirty = true;
			++paintRequest;
		}
		queued ??= Promise.resolve().then(async () => {
			queued = undefined;
			if (disposed) return;
			const query = queryDirty;
			const paint = paintsDirty;
			queryDirty = false;
			paintsDirty = false;
			if (query) await queryCourses();
			else {
				updateStatuses();
				if (paint) await refreshPaints();
			}
		});
		return queued;
	}
	function readConfig(config: Record<string, unknown>) {
		scope = config.scope === 'all' ? 'all' : 'active';
	}
	async function init(next: ChronosUiController, id: string) {
		if (disposed || controller) return;
		controller = next;
		pluginId = id;
		const ctx = next.getPluginContext(id);
		readConfig(ctx.config);
		// Let immediate teardown win before creating subscriptions.
		await Promise.resolve();
		if (disposed) return;
		const subscription = ctx.on('config:changed', (event) => {
			if (disposed || event.pluginId !== pluginId) return;
			readConfig(event.config);
			void schedule();
		});
		unsubscribeConfig = () => subscription.dispose();
		unsubscribeSnapshot = next.snapshot.subscribe((value) => {
			snapshot = value;
			void schedule();
		});
		await queued;
	}
	async function persistScope(next: TodayScope) {
		if (disposed || !controller) return;
		if (scope !== next) haptic.medium();
		scope = next;
		const refresh = schedule();
		try {
			await controller.getPluginContext(pluginId).updateConfig({ scope: next });
		} catch {
			/* Preserve local selection. */
		}
		await refresh;
	}
	function dispose() {
		if (disposed) return;
		disposed = true;
		++courseRequest;
		++paintRequest;
		unsubscribeSnapshot?.();
		unsubscribeConfig?.();
		controller = undefined;
		snapshot = null;
		hits = [];
		courseEntries = [];
		paintByCourseKey = new Map();
	}
	return {
		get today() {
			return today();
		},
		get now() {
			return now();
		},
		get scope() {
			return scope;
		},
		get prepareReminderMinutes() {
			return prepareReminderMinutes();
		},
		get courseEntries() {
			return courseEntries;
		},
		get paintByCourseKey() {
			return paintByCourseKey;
		},
		init,
		dispose,
		persistScope
	};
}
