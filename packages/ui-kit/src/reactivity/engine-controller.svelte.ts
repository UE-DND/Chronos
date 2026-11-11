/// <reference types="svelte" />
import type {
	ChronosEngine,
	Timetable,
	UserPreferences,
	Disposable,
	StandardSlotMap,
	ReadonlyCourseBadges,
	Course,
	AcademicConfig,
	ChronosContext,
	TimetableDetailsPatch,
	TimetableSummary,
	ReadonlyTimetable,
	ReadonlyUserPreferences,
	DeepReadonly,
	CourseRearrangement
} from '@chronos/core';
import { todayIsoDate, DEFAULT_USER_PREFERENCES } from '@chronos/core';
import { writable, type Readable, type Writable } from 'svelte/store';
import type { ChronosUiController, ChronosUiSnapshot } from './chronos-ui-controller';
import type { OverlayHistoryPort } from '../overlay/history-overlay';

export type ReactiveChronosControllerOptions = {
	overlayHistoryPort?: OverlayHistoryPort;
};

/**
 * ReactiveChronosController serves as the Svelte 5 Runes reactive bridge
 * connecting the headless ChronosEngine to UI components.
 */
export class ReactiveChronosController implements ChronosUiController {
	readonly overlayHistoryPort?: OverlayHistoryPort;
	readonly snapshot: Readable<ChronosUiSnapshot>;
	private readonly snapshotStore: Writable<ChronosUiSnapshot>;
	private engine: ChronosEngine;
	private disposables: Disposable[] = [];

	// Svelte 5 Runes reactive core state
	private _currentTimetable = $state.raw<ReadonlyTimetable | null>(null);
	private _timetables = $state.raw<readonly DeepReadonly<TimetableSummary>[]>([]);
	activeWeek = $state<number>(1);
	currentPeriodIndex = $state<number | null>(null);
	activeThemeId = $state<string | null>(null);
	activeIconThemeId = $state<string>('host-default');
	private _userPreferences = $state.raw<ReadonlyUserPreferences>({ ...DEFAULT_USER_PREFERENCES });
	locale = $state<string>('zh-cn');
	now = $state<Date>(new Date());
	todayIso = $state<string>(todayIsoDate());
	clockFrozen = $state(false);

	// Slot reactivity version signal (increments on slot changes or locale switches)
	slotVersion = $state<number>(0);
	private _courseBadges = $state.raw<ReadonlyCourseBadges>(Object.freeze({}));
	coursePaletteRevision = $state<number>(0);

	get currentTimetable(): ReadonlyTimetable | null {
		return this._currentTimetable;
	}

	get timetables(): readonly DeepReadonly<TimetableSummary>[] {
		return this._timetables;
	}

	get userPreferences(): ReadonlyUserPreferences {
		return this._userPreferences;
	}

	get courseBadges(): ReadonlyCourseBadges {
		return this._courseBadges;
	}

	constructor(engine: ChronosEngine, options: ReactiveChronosControllerOptions = {}) {
		this.overlayHistoryPort = options.overlayHistoryPort;
		this.engine = engine;
		this.snapshotStore = writable(this.readSnapshot());
		this.snapshot = Object.freeze({ subscribe: this.snapshotStore.subscribe });
		this.syncAllState();

		// Subscribe to engine lifecycle events
		this.disposables.push(
			this.engine.on('timetable:loaded', () => {
				this._currentTimetable = this.engine.state.currentTimetable;
				this.pushSnapshot();
			}),
			this.engine.on('timetable:switched', () => {
				this._currentTimetable = this.engine.state.currentTimetable;
				this.pushSnapshot();
			}),
			this.engine.on('timetable:updated', () => {
				this._currentTimetable = this.engine.state.currentTimetable;
				this.pushSnapshot();
			}),
			this.engine.on('timetable:followUpFailed', ({ operation, timetableId, cause }) => {
				console.error(
					'[timetable] Write committed but follow-up failed:',
					{ operation, timetableId },
					cause
				);
				this.notify(this.translatePlugin('host-ui', 'timetable.savedFollowUpFailed'), 'warn');
			}),
			this.engine.on('timetables:updated', () => {
				this._timetables = this.engine.state.timetables;
				this.pushSnapshot();
			}),
			this.engine.on('preferences:updated', () => {
				this._userPreferences = this.engine.state.userPreferences;
				this.pushSnapshot();
			}),
			this.engine.on(
				'time:tick',
				({
					currentWeek,
					currentPeriod,
					now,
					todayIso,
					frozen
				}: {
					currentWeek: number;
					currentPeriod: number | null;
					now: Date;
					todayIso: string;
					frozen: boolean;
				}) => {
					this.activeWeek = currentWeek;
					this.currentPeriodIndex = currentPeriod;
					this.now = now;
					this.todayIso = todayIso;
					this.clockFrozen = frozen;
					this.pushSnapshot();
				}
			),
			this.engine.on('theme:changed', ({ themeId }) => {
				this.activeThemeId = themeId;
				this.pushSnapshot();
			}),
			this.engine.on('iconTheme:changed', ({ iconThemeId }: { iconThemeId: string }) => {
				this.activeIconThemeId = iconThemeId;
				this.pushSnapshot();
			}),
			this.engine.on('i18n:localeChanged', ({ locale }: { locale: string }) => {
				this.locale = locale;
				this.slotVersion++;
				this.pushSnapshot();
			}),
			this.engine.on('slots:updated', () => {
				this.slotVersion++;
				this.pushSnapshot();
			}),
			this.engine.on('badges:updated', () => {
				this._courseBadges = this.engine.badges.getAll();
				this.pushSnapshot();
			}),
			this.engine.on('plugin:loaded', () => {
				this.slotVersion++;
				this.pushSnapshot();
			}),
			this.engine.on('plugin:unloaded', () => {
				this.slotVersion++;
				this.pushSnapshot();
			}),
			this.engine.on('coursePalette:changed', () => {
				this.coursePaletteRevision++;
				this.pushSnapshot();
			})
		);
	}

	getPluginContext(pluginId: string): ChronosContext {
		return this.engine.getPluginContext(pluginId);
	}

	getPluginContextForSlot<K extends keyof StandardSlotMap>(
		slotName: K,
		slotId: string
	): ChronosContext {
		return this.engine.getPluginContextForSlot(slotName, slotId);
	}

	/**
	 * Reactively gets all registered contributions for a standard hierarchical slot.
	 */
	getSlots<K extends keyof StandardSlotMap>(slotName: K): Array<StandardSlotMap[K]> {
		// Read slotVersion to establish Svelte 5 reactivity dependency
		void this.slotVersion;
		return this.engine.slots.get(slotName);
	}

	/**
	 * Reactively gets a specific contribution item by slot name and unique contribution ID.
	 */
	getSlotItem<K extends keyof StandardSlotMap>(
		slotName: K,
		id: string
	): StandardSlotMap[K] | undefined {
		void this.slotVersion;
		return this.engine.slots.getSlotItem(slotName, id);
	}

	resolveSlotOwner<K extends keyof StandardSlotMap>(
		slotName: K,
		slotId: string
	): string | undefined {
		void this.slotVersion;
		return this.engine.slots.resolveOwner(slotName, slotId);
	}

	private pushSnapshot(): void {
		this.snapshotStore.set(this.readSnapshot());
	}

	private readSnapshot(): ChronosUiSnapshot {
		return Object.freeze({
			currentTimetable: this.currentTimetable,
			timetables: this.timetables,
			activeWeek: this.activeWeek,
			currentPeriodIndex: this.currentPeriodIndex,
			activeThemeId: this.activeThemeId,
			activeIconThemeId: this.activeIconThemeId,
			userPreferences: this.userPreferences,
			locale: this.locale,
			now: this.now,
			todayIso: this.todayIso,
			clockFrozen: this.clockFrozen,
			slotVersion: this.slotVersion,
			courseBadges: this.courseBadges,
			coursePaletteRevision: this.coursePaletteRevision
		});
	}

	private syncAllState(): void {
		this._currentTimetable = this.engine.state.currentTimetable;
		this._timetables = this.engine.state.timetables ?? [];
		this.activeWeek = this.engine.state.activeWeek;
		this.currentPeriodIndex = this.engine.state.currentPeriodIndex;
		this.activeThemeId = this.engine.state.activeThemeId;
		this.activeIconThemeId = this.engine.state.activeIconThemeId;
		this._userPreferences = this.engine.state.userPreferences;
		this.locale = this.engine.locale;
		this.now = this.engine.now();
		this.todayIso = todayIsoDate(this.now);
		this.clockFrozen = this.engine.state.clockFrozen;
		this._courseBadges = this.engine.badges.getAll();
		this.slotVersion++;
		this.pushSnapshot();
	}

	// Action proxies
	async createTimetable(name: string, config?: Partial<AcademicConfig>): Promise<Timetable> {
		return this.engine.createTimetable(name, config);
	}

	async switchTimetable(timetableId: string): Promise<void> {
		return this.engine.switchTimetable(timetableId);
	}

	async deleteTimetable(
		timetableId: string
	): Promise<import('@chronos/core').DeleteTimetableResult> {
		return this.engine.deleteTimetable(timetableId);
	}

	async updateTimetableDetails(timetableId: string, patch: TimetableDetailsPatch): Promise<void> {
		return this.engine.updateTimetableDetails(timetableId, patch);
	}

	async saveCourse(course: Course, timetableId?: string): Promise<void> {
		return this.engine.saveCourse(course, timetableId);
	}

	async updateCourse(
		courseId: string,
		patch: Partial<Course>,
		timetableId?: string
	): Promise<void> {
		return this.engine.updateCourse(courseId, patch, timetableId);
	}

	async deleteCourse(courseId: string, timetableId?: string): Promise<void> {
		return this.engine.deleteCourse(courseId, timetableId);
	}

	async deleteCourseForWeek(courseId: string, week: number, timetableId?: string): Promise<void> {
		return this.engine.deleteCourseForWeek(courseId, week, timetableId);
	}

	async rearrangeCourse(
		courseId: string,
		options: CourseRearrangement,
		timetableId?: string
	): Promise<Course | null> {
		return this.engine.rearrangeCourse(courseId, options, timetableId);
	}

	setTheme(themeId: string): void {
		this.engine.setTheme(themeId);
	}

	async updatePreferences(patch: Partial<UserPreferences>): Promise<void> {
		return this.engine.updatePreferences(patch);
	}

	async clearAllData(): Promise<void> {
		await this.engine.clearAllData();
		this.syncAllState();
	}

	notify(message: string, type: 'info' | 'warn' | 'error' = 'info'): void {
		this.engine.notify(message, type);
	}

	/** Resolve a plugin message catalog key for the current locale (reactive via slotVersion). */
	translatePlugin(pluginId: string, key: string, params?: Record<string, unknown>): string {
		void this.slotVersion;
		return this.engine.translateForPlugin(pluginId, key, params);
	}

	dispose(): void {
		for (const d of this.disposables) {
			d.dispose();
		}
		this.disposables = [];
	}
}
