import type { ChronosActions } from '../../types/actions';
import type { TimetableSummary } from '../../types/state';
import type { Timetable } from '../../domain/timetable';
import type { UserPreferences } from '../../domain/preferences';
import type { ChronosEvents } from '../../types/context';
import type { IStorageService } from '../../types/services';
import type { BadgeManager } from '../badge-manager';
import type { EventPipeline } from '../event-pipeline';
import type { ThemeRegistry } from '../theme-registry';

/** Narrow host surface for extracted engine action modules. */
export interface EngineActionHost extends Pick<
	ChronosActions,
	'switchTimetable' | 'updateTimetableDetails' | 'updatePreferences'
> {
	readonly storage: IStorageService;
	readonly events: EventPipeline;
	readonly badges: BadgeManager;
	readonly themes: ThemeRegistry;

	getCurrentTimetable(): Timetable | null;
	setCurrentTimetable(timetable: Timetable | null): void;
	getTimetables(): TimetableSummary[];
	setTimetables(timetables: TimetableSummary[]): void;
	getUserPreferences(): UserPreferences;
	setUserPreferences(preferences: UserPreferences): void;
	getActiveThemeId(): string | null;
	setActiveThemeId(themeId: string | null): void;
	getLocale(): string;
	setLocale(locale: string): void;

	refreshTimetables(): Promise<void>;
	updateTime(now?: Date): void;
	rescheduleDayClock(): void;
	emitIconThemeChanged(): void;

	emit<E extends keyof ChronosEvents>(event: E, payload: ChronosEvents[E]): void;
}
