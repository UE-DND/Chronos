import {
	inferYearsFromAcademicConfig,
	parseIsoDate,
	type CalendarHoliday,
	type ChronosContext,
	type Disposable,
	type ReadonlyTimetable,
	IPluginHttpService
} from '@chronos/core';
import { fetchHolidayCnYears } from './holiday-cn-client';

export type HolidayDataSource = 'remote' | 'bundled' | 'cached' | 'unavailable';
export interface HolidayYearCache {
	holidays: CalendarHoliday[];
	source: HolidayDataSource;
	syncedAt?: number;
}
export interface HolidayCalendarCache {
	years: Record<string, HolidayYearCache>;
	requestId?: string;
	lastAttemptedAt?: number;
}
export type HolidayCalendars = Record<string, HolidayCalendarCache>;
export const HOLIDAY_CALENDARS_KEY = 'calendars';
const runtimes = new WeakMap<ChronosContext, HolidayRuntime>();
const AUTO_RETRY_INTERVAL_MS = 6 * 60 * 60 * 1000;

function freezeCache(value: HolidayCalendars): HolidayCalendars {
	for (const entry of Object.values(value)) {
		for (const year of Object.values(entry.years)) {
			for (const holiday of year.holidays) Object.freeze(holiday);
			Object.freeze(year.holidays);
			Object.freeze(year);
		}
		Object.freeze(entry.years);
		Object.freeze(entry);
	}
	return Object.freeze(value);
}
export function validateHolidayCalendars(value: unknown): HolidayCalendars {
	if (value === null) return {};
	if (typeof value !== 'object' || Array.isArray(value)) throw new Error('Invalid holiday cache');
	for (const entry of Object.values(value)) {
		if (
			!entry ||
			typeof entry !== 'object' ||
			!entry.years ||
			typeof entry.years !== 'object' ||
			Array.isArray(entry.years)
		)
			throw new Error('Invalid holiday cache');
		if (entry.requestId !== undefined && typeof entry.requestId !== 'string')
			throw new Error('Invalid holiday request');
		for (const [year, cache] of Object.entries(entry.years) as [string, HolidayYearCache][]) {
			if (
				!/^\d{4}$/.test(year) ||
				!cache ||
				!['remote', 'bundled', 'cached', 'unavailable'].includes(cache.source) ||
				!Array.isArray(cache.holidays)
			)
				throw new Error('Invalid holiday year');
			for (const holiday of cache.holidays) {
				if (
					typeof holiday.date !== 'string' ||
					!/^\d{4}-\d{2}-\d{2}$/.test(holiday.date) ||
					holiday.date.slice(0, 4) !== year ||
					typeof holiday.label !== 'string'
				)
					throw new Error('Invalid holiday');
				parseIsoDate(holiday.date);
			}
		}
	}
	return value as HolidayCalendars;
}
export function getHolidayCalendar(ctx: ChronosContext, timetableId: string) {
	const entry = runtimes.get(ctx)?.snapshot[timetableId];
	if (!entry) return undefined;
	const years = Object.values(entry.years);
	return {
		holidays: years.flatMap((year) => year.holidays).sort((a, b) => a.date.localeCompare(b.date)),
		syncedAt: Math.max(0, ...years.map((year) => year.syncedAt ?? 0)),
		sourceByYear: Object.fromEntries(
			Object.entries(entry.years).map(([year, cache]) => [year, cache.source])
		) as Record<number, HolidayDataSource>
	};
}
export function needsHolidaySync(
	existing: HolidayCalendarCache | undefined,
	requiredYears: readonly number[],
	now = Date.now()
): boolean {
	if (!existing) return true;
	if (requiredYears.every((year) => existing.years[year]?.source === 'remote')) return false;
	return !existing.lastAttemptedAt || now - existing.lastAttemptedAt >= AUTO_RETRY_INTERVAL_MS;
}
function aborted(): DOMException {
	return new DOMException('Holiday sync cancelled', 'AbortError');
}
export function isHolidaySyncCancelled(error: unknown): boolean {
	return error instanceof Error && error.name === 'AbortError';
}
class HolidayRuntime {
	snapshot: HolidayCalendars = freezeCache({});
	private readGeneration = 0;
	private reading: Promise<void> | undefined;
	private contribution?: Disposable;
	private pruneGeneration = 0;
	private tasks = new Map<
		string,
		{ controller: AbortController; requestId: string; claimed: boolean }
	>();
	constructor(private readonly ctx: ChronosContext) {}
	load(): Promise<void> {
		const generation = ++this.readGeneration;
		this.reading = this.ctx.storage.get(HOLIDAY_CALENDARS_KEY).then((stored) => {
			if (this.ctx.signal.aborted) return;
			if (generation !== this.readGeneration) return this.reading;
			const value = validateHolidayCalendars(stored);
			for (const [id, task] of this.tasks) {
				if (task.claimed && value[id]?.requestId !== task.requestId) task.controller.abort();
			}
			this.publish(value);
		});
		return this.reading;
	}
	private publish(value: HolidayCalendars): void {
		if (this.ctx.signal.aborted) return;
		this.snapshot = freezeCache(value);
		const snapshot = this.snapshot;
		const previous = this.contribution;
		this.contribution = this.ctx.registerSlot('calendar.holidays', {
			id: 'holiday-calendar',
			getHolidays: (timetable) =>
				Object.values(snapshot[timetable.id]?.years ?? {}).flatMap((year) => year.holidays)
		});
		previous?.dispose();
	}
	async prune(): Promise<void> {
		const generation = ++this.pruneGeneration;
		const summaries = await this.ctx.query.listTimetables();
		if (this.ctx.signal.aborted || generation !== this.pruneGeneration) return;
		const ids = new Set(summaries.map((entry) => entry.id));
		for (const [id, task] of this.tasks)
			if (!ids.has(id)) {
				task.controller.abort();
				this.tasks.delete(id);
			}
		if (Object.keys(this.snapshot).every((id) => ids.has(id))) return;
		await this.ctx.storage.updateJson<HolidayCalendars>(HOLIDAY_CALENDARS_KEY, (current) =>
			generation !== this.pruneGeneration
				? validateHolidayCalendars(current)
				: Object.fromEntries(
						Object.entries(validateHolidayCalendars(current)).filter(([id]) => ids.has(id))
					)
		);
		await this.load();
	}
	async sync(timetable: ReadonlyTimetable, force: boolean): Promise<boolean> {
		this.ctx.signal.throwIfAborted();
		const id = timetable.id;
		const years = inferYearsFromAcademicConfig(timetable.academicConfig);
		if (!force && !needsHolidaySync(this.snapshot[id], years)) return false;
		this.tasks.get(id)?.controller.abort();
		const task = new AbortController();
		const signal = AbortSignal.any([task.signal, this.ctx.signal]);
		const requestId = crypto.randomUUID();
		const activeTask = { controller: task, requestId, claimed: false };
		this.tasks.set(id, activeTask);
		try {
			await this.ctx.storage.updateJson<HolidayCalendars>(HOLIDAY_CALENDARS_KEY, (current) => {
				signal.throwIfAborted();
				const cache = validateHolidayCalendars(current);
				return { ...cache, [id]: { ...cache[id], years: { ...cache[id]?.years }, requestId } };
			});
			activeTask.claimed = true;
			signal.throwIfAborted();
			const fetched = await fetchHolidayCnYears(
				this.ctx.service(IPluginHttpService),
				years,
				signal
			);
			signal.throwIfAborted();
			if (!(await this.ctx.query.getTimetable(id))) throw aborted();
			let ownsCommit = false;
			await this.ctx.storage.updateJson<HolidayCalendars>(HOLIDAY_CALENDARS_KEY, (current) => {
				const cache = validateHolidayCalendars(current);
				signal.throwIfAborted();
				if (cache[id]?.requestId !== requestId) return cache;
				const merged = { ...cache[id]!.years };
				for (const year of years) {
					const source = fetched.sourceByYear[year]!;
					if (source === 'unavailable' && merged[year]) continue;
					merged[year] = {
						holidays: fetched.byYear[year]!,
						source,
						...(source === 'remote' ? { syncedAt: Date.now() } : {})
					};
				}
				if (!years.some((year) => merged[year]?.source !== 'unavailable'))
					throw new Error(`No holiday data available for years: ${years.join(', ')}`);
				ownsCommit = true;
				return validateHolidayCalendars({
					...cache,
					[id]: { ...cache[id]!, years: merged, lastAttemptedAt: Date.now() }
				});
			});
			signal.throwIfAborted();
			if (!ownsCommit) throw aborted();
			// Re-read after a concurrent window's commit rather than publishing a stale return value.
			await this.load();
			signal.throwIfAborted();
			if (this.snapshot[id]?.requestId !== requestId) throw aborted();
			return true;
		} finally {
			if (this.tasks.get(id)?.controller === task) this.tasks.delete(id);
		}
	}
}
export async function activateHolidayCalendar(ctx: ChronosContext): Promise<void> {
	const runtime = new HolidayRuntime(ctx);
	runtimes.set(ctx, runtime);
	ctx.storage.onKeyChanged(HOLIDAY_CALENDARS_KEY, () => runtime.load());
	ctx.on('plugin:loaded', ({ pluginId }) =>
		pluginId === ctx.pluginId ? runtime.prune() : undefined
	);
	ctx.on('timetables:updated', () => runtime.prune());
	ctx.addDisposable({
		dispose() {
			runtimes.delete(ctx);
		}
	});
	await runtime.load();
}
export interface SyncHolidayCalendarOptions {
	force?: boolean;
}
export async function syncHolidayCalendarFromHolidayCn(
	ctx: ChronosContext,
	options: SyncHolidayCalendarOptions = {}
): Promise<boolean> {
	const timetable = ctx.state.currentTimetable;
	if (!timetable) throw new Error('No active timetable');
	const runtime = runtimes.get(ctx);
	if (!runtime) throw new Error('Holiday plugin is not active');
	return runtime.sync(timetable, options.force ?? false);
}
