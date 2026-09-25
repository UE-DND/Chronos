import {
	type CalendarHoliday,
	inferYearsFromAcademicConfig,
	clearHolidayCalendarFromStorage,
	type ChronosContext,
	type HolidayCalendarConfig,
	IHttpService,
	IStorageService,
	type Timetable
} from '@chronos/core';
import { fetchHolidayCnYears } from './holiday-cn-client';

const syncInFlightByTimetableId = new Map<string, Promise<boolean>>();
const AUTO_RETRY_INTERVAL_MS = 6 * 60 * 60 * 1000;

export async function clearHolidayCalendarFromAllTimetables(ctx: ChronosContext): Promise<number> {
	return clearHolidayCalendarFromStorage(ctx.service(IStorageService));
}

export function needsHolidaySync(
	existing: HolidayCalendarConfig | undefined,
	requiredYears: readonly number[],
	now = Date.now()
): boolean {
	if (!existing) return true;
	const syncedYears = new Set(existing.syncedYears ?? []);
	const hasUnsyncedYear = requiredYears.some((year) => {
		const source = existing.sourceByYear?.[year];
		return source ? source !== 'remote' || !syncedYears.has(year) : !syncedYears.has(year);
	});
	if (!hasUnsyncedYear) return false;
	return !existing.lastAttemptedAt || now - existing.lastAttemptedAt >= AUTO_RETRY_INTERVAL_MS;
}

export interface SyncHolidayCalendarOptions {
	force?: boolean;
}

export async function syncHolidayCalendarFromHolidayCn(
	ctx: ChronosContext,
	options: SyncHolidayCalendarOptions = {}
): Promise<boolean> {
	const timetable = ctx.state.currentTimetable;
	if (!timetable) {
		throw new Error('No active timetable');
	}

	const timetableId = timetable.id;
	const inflight = syncInFlightByTimetableId.get(timetableId);
	if (inflight) {
		return inflight;
	}

	const promise = performHolidaySync(ctx, timetableId, timetable.academicConfig, options).finally(
		() => {
			syncInFlightByTimetableId.delete(timetableId);
		}
	);
	syncInFlightByTimetableId.set(timetableId, promise);
	return promise;
}

export async function ensureHolidayCalendarSynced(
	ctx: ChronosContext,
	options: SyncHolidayCalendarOptions = {}
): Promise<boolean> {
	if (!ctx.state.currentTimetable) return false;
	return syncHolidayCalendarFromHolidayCn(ctx, options);
}

async function performHolidaySync(
	ctx: ChronosContext,
	timetableId: string,
	academicConfig: Timetable['academicConfig'],
	options: SyncHolidayCalendarOptions
): Promise<boolean> {
	const requiredYears = inferYearsFromAcademicConfig(academicConfig);
	const storage = ctx.service(IStorageService);
	const latest = await storage.getTimetable(timetableId);
	if (!latest) {
		throw new Error(`Timetable not found: ${timetableId}`);
	}

	if (!options.force && !needsHolidaySync(latest.academicConfig.holidayCalendar, requiredYears)) {
		return false;
	}

	const http = ctx.service(IHttpService);
	const fetched = await fetchHolidayCnYears(http, requiredYears);
	const existing = latest.academicConfig.holidayCalendar;
	const existingYears = new Set<number>([
		...Object.keys(existing?.sourceByYear ?? {}).map(Number),
		...(existing?.holidays ?? []).map((holiday) => Number(holiday.date.slice(0, 4)))
	]);
	const sourceByYear: NonNullable<HolidayCalendarConfig['sourceByYear']> = {
		...existing?.sourceByYear
	};
	const holidayByYear = new Map<number, CalendarHoliday[]>();
	for (const holiday of existing?.holidays ?? []) {
		const year = Number(holiday.date.slice(0, 4));
		const bucket = holidayByYear.get(year) ?? [];
		bucket.push(holiday);
		holidayByYear.set(year, bucket);
	}

	const remoteYears = new Set<number>();
	for (const year of requiredYears) {
		const source = fetched.sourceByYear[year]!;
		if (source === 'unavailable') {
			if (existingYears.has(year)) {
				sourceByYear[year] = 'cached';
			} else {
				sourceByYear[year] = 'unavailable';
			}
			continue;
		}
		sourceByYear[year] = source;
		holidayByYear.set(year, fetched.byYear[year]!);
		if (source === 'remote') remoteYears.add(year);
	}

	const holidays = [...holidayByYear.values()]
		.flat()
		.sort((left, right) => left.date.localeCompare(right.date));
	const hasRequiredYearData = requiredYears.some((year) => sourceByYear[year] !== 'unavailable');
	const syncedYears = Object.entries(sourceByYear)
		.filter(([, source]) => source === 'remote')
		.map(([year]) => Number(year))
		.sort((left, right) => left - right);

	const holidayCalendar: HolidayCalendarConfig = {
		holidays,
		syncedAt: remoteYears.size > 0 ? Date.now() : existing?.syncedAt,
		syncedYears,
		sourceByYear,
		lastAttemptedAt: Date.now()
	};

	const updatedAcademicConfig = {
		...latest.academicConfig,
		holidayCalendar
	};

	if (ctx.state.currentTimetable?.id === timetableId) {
		await ctx.actions.saveCurrentTimetableDetails({
			academicConfig: updatedAcademicConfig
		});
	} else {
		const updated: Timetable = {
			...latest,
			academicConfig: updatedAcademicConfig,
			updatedAt: Date.now()
		};
		await storage.saveTimetable(updated);
	}

	if (!hasRequiredYearData) {
		const missingYears = requiredYears.filter((year) => sourceByYear[year] === 'unavailable');
		throw new Error(`No holiday data available for years: ${missingYears.join(', ')}`);
	}
	return true;
}
