import type { ChronosActions } from './actions';
import type {
	ChronosState,
	TimetableSummary,
	ReadonlyTimetable,
	ReadonlyUserPreferences
} from './state';
import type { DeepReadonly } from './readonly';
import type { Disposable, ServiceIdentifier, PluginStorageScope } from './services';
import type { CalendarHoliday } from '../domain/timetable';
import type { CourseQueryFilter, CourseQueryHit } from './course-query';
import type {
	ChronosSlotMap,
	LocalizedText,
	ReadonlyCourseBadges,
	ImportTabSlotContribution
} from './slots';
import type { ConfigSchema } from '../schema/schema';
import type { ToolGroup } from './official-plugins';

/** Plugin category classification */
export type PluginCategory = 'source' | 'parser' | 'codec' | 'theme' | 'tool';

export interface ChronosPlugin<Config extends object = Record<string, unknown>> {
	readonly id: string;
	readonly name: LocalizedText;
	readonly version: string;
	/** Concise one-sentence description (<= 60 chars) */
	readonly description?: LocalizedText;
	/** Domain category of the plugin */
	readonly category?: PluginCategory;
	/** Required when category is tool — catalog subgroup in plugin center. */
	readonly toolGroup?: ToolGroup;
	/** Display and initialization priority (built-in sources: 10-90, user extensions: 100+) */
	readonly order?: number;
	/** Author or maintainer information */
	readonly author?: string;
	/** Homepage or repository URL */
	readonly homepage?: string;
	/** Rich documentation or usage guide (supports Markdown & multi-lingual text) */
	readonly readme?: LocalizedText;
	readonly configSchema?: ConfigSchema<Config>;
	readonly defaultConfig?: Config;
	/** Allowed domain whitelist for network requests */
	readonly allowedDomains?: string[];

	/** Plugin activation lifecycle hook */
	apply(ctx: ChronosContext<Config>): void | Promise<void>;
	/** Plugin deactivation cleanup hook */
	dispose?(): void | Promise<void>;
}

export interface ChronosContext<Config extends object = Record<string, unknown>> {
	readonly pluginId: string;
	readonly instanceToken: symbol;
	readonly signal: AbortSignal;

	/** Access an injected capability service (Capability Seam) */
	service<T>(identifier: ServiceIdentifier<T>): T;

	/** Access an optional injected capability service */
	tryService<T>(identifier: ServiceIdentifier<T>): T | undefined;

	/** Type-safe private plugin configuration (synchronized with persistent storage) */
	readonly config: Readonly<Config>;
	updateConfig(patch: Partial<Config>): Promise<void>;

	/** Plugin-private isolated storage (namespaced automatically by pluginId) */
	readonly storage: PluginStorageScope;
	readonly query: {
		listTimetables(): Promise<readonly DeepReadonly<TimetableSummary>[]>;
		getTimetable(id: string): Promise<ReadonlyTimetable | null>;
		queryCourses(filter?: CourseQueryFilter): Promise<readonly DeepReadonly<CourseQueryHit>[]>;
	};
	readonly calendar: { getHolidays(timetable: ReadonlyTimetable): readonly CalendarHoliday[] };
	/** This activation owns its override; null releases only its own lease. */
	readonly clock: { set(now: Date | null): void };

	/** Internationalization runtime */
	readonly i18n: {
		readonly locale: string;
		t(key: string, params?: Record<string, unknown>): string;
		registerMessages(messages: Record<string, Record<string, string>>): Disposable;
	};

	/** Read-only core state snapshot */
	readonly state: ChronosState;

	/** Domain action dispatcher */
	readonly actions: Omit<ChronosActions, 'setVirtualNow'>;

	/** Declarative hierarchical slot registration (auto-tracked and revoked on unload) */
	registerSlot<K extends Exclude<keyof ChronosSlotMap, 'import.source.tab'>>(
		slotName: K,
		contribution: ChronosSlotMap[K] & { id: string }
	): Disposable;
	registerSlot<FormState extends object>(
		slotName: 'import.source.tab',
		contribution: ImportTabSlotContribution<FormState> & { id: string }
	): Disposable;

	/** Event bus listener (auto-tracked and revoked on unload) */
	on<E extends keyof ChronosEvents>(
		event: E,
		handler: (payload: ChronosEvents[E]) => void | Promise<void>
	): Disposable;

	/** Manually register disposable resources to be cleaned up on unload */
	addDisposable(disposable: Disposable): void;
}

export interface ChronosEvents {
	'timetable:loaded': { timetable: ReadonlyTimetable };
	'timetable:switched': {
		previousId: string | null;
		currentId: string;
		timetable: ReadonlyTimetable;
	};
	'timetable:updated': { timetable: ReadonlyTimetable | null };
	'timetable:followUpFailed': {
		operation: 'create' | 'import' | 'update';
		timetableId: string;
		cause: unknown;
	};
	'timetables:updated': {
		timetables: readonly DeepReadonly<TimetableSummary>[];
	};
	'preferences:updated': { preferences: ReadonlyUserPreferences };
	'time:tick': {
		currentWeek: number;
		/** First period from midnight, then active or next period during breaks; null after the last end. */
		currentPeriod: number | null;
		now: Date;
		todayIso: string;
		frozen: boolean;
	};
	'theme:changed': { themeId: string | null };
	'iconTheme:changed': { iconThemeId: string };
	'i18n:localeChanged': { locale: string };
	'config:changed': { pluginId: string; config: Record<string, unknown> };
	'slots:updated': void;
	'badges:updated': { badges: ReadonlyCourseBadges };
	'plugin:loaded': { pluginId: string };
	'plugin:unloaded': { pluginId: string };
	'calendar:changed': { revision: number };
	'coursePalette:changed': void;
}
