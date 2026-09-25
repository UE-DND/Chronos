import type { CalendarHoliday, HolidayDataSource, IHttpService } from '@chronos/core';
import { HOLIDAY_CN_CDN_BASE } from './constants';
import fallback2025 from '../static/data/2025.json';
import fallback2026 from '../static/data/2026.json';
import fallback2027 from '../static/data/2027.json';

interface HolidayCnDay {
	name: string;
	date: string;
	isOffDay: boolean;
}

export interface HolidayCnYearPayload {
	year: number;
	papers: string[];
	days: HolidayCnDay[];
}

const FALLBACK_BY_YEAR: Record<number, HolidayCnYearPayload> = {
	2025: fallback2025 as HolidayCnYearPayload,
	2026: fallback2026 as HolidayCnYearPayload,
	2027: fallback2027 as HolidayCnYearPayload
};

export function parseHolidayCnOffDays(payload: HolidayCnYearPayload): CalendarHoliday[] {
	return payload.days
		.filter((day) => day.isOffDay)
		.map((day) => ({ date: day.date, label: day.name }));
}

async function fetchHolidayCnYear(
	http: IHttpService,
	year: number
): Promise<{ holidays: CalendarHoliday[]; source: Exclude<HolidayDataSource, 'cached'> }> {
	const url = `${HOLIDAY_CN_CDN_BASE}/${year}.json`;
	try {
		const response = await http.request(url, { method: 'GET', timeoutMs: 15_000 });
		if (!response.ok) {
			throw new Error(`HTTP ${response.status}`);
		}
		const payload = await response.json<HolidayCnYearPayload>();
		return { holidays: parseHolidayCnOffDays(payload), source: 'remote' };
	} catch (error) {
		const fallback = FALLBACK_BY_YEAR[year];
		if (fallback) {
			return { holidays: parseHolidayCnOffDays(fallback), source: 'bundled' };
		}
		console.warn(`[calendar-holidays] No holiday-cn data for ${year}`, error);
		return { holidays: [], source: 'unavailable' };
	}
}

export interface HolidayCnFetchResult {
	byYear: Record<number, CalendarHoliday[]>;
	sourceByYear: Record<number, Exclude<HolidayDataSource, 'cached'>>;
}

export async function fetchHolidayCnYears(
	http: IHttpService,
	years: readonly number[]
): Promise<HolidayCnFetchResult> {
	const results = await Promise.all(years.map((year) => fetchHolidayCnYear(http, year)));
	const byYear: Record<number, CalendarHoliday[]> = {};
	const sourceByYear: HolidayCnFetchResult['sourceByYear'] = {};
	years.forEach((year, index) => {
		const result = results[index]!;
		byYear[year] = result.holidays;
		sourceByYear[year] = result.source;
	});
	return {
		byYear,
		sourceByYear
	};
}
