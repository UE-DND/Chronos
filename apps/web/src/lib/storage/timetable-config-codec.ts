import type { AcademicConfig, ImportMetadata, PeriodTime, TimetableViewPrefs } from '@chronos/core';
import type { TimetableConfig, TimetableImportMetadata } from '#lib/models/timetable.ts';

const SCHEMA_VERSION = 1;

export function encodeTimetableConfig(
	academicConfig: AcademicConfig,
	importMetadata: TimetableImportMetadata,
	viewPrefs: TimetableViewPrefs,
	customMetadata?: Record<string, unknown>
): string {
	const config = {
		schemaVersion: SCHEMA_VERSION,
		academicConfig,
		importMetadata,
		viewPrefs,
		...(customMetadata ? { customMetadata } : {})
	};
	return JSON.stringify(config);
}

export function decodeTimetableConfig(configJson: string): TimetableConfig {
	return decodeParsedConfig(JSON.parse(configJson));
}

function decodeParsedConfig(raw: unknown): TimetableConfig {
	const record = asRecord(raw);
	if (record.schemaVersion !== SCHEMA_VERSION) throw new Error('unsupported timetable schema');
	const importMetadata = slimImportMetadata(decodeImportMetadata(record.importMetadata));
	const customMetadata = decodeCustomMetadata(record.customMetadata);
	return {
		schemaVersion: SCHEMA_VERSION,
		academicConfig: decodeAcademicConfig(record.academicConfig),
		importMetadata,
		viewPrefs: decodeViewPrefs(record.viewPrefs),
		...(customMetadata ? { customMetadata } : {})
	};
}

function decodeAcademicConfig(raw: unknown): AcademicConfig {
	const record = asRecord(raw);
	return {
		termStartDate: asString(record.termStartDate),
		startWeek: asInt(record.startWeek),
		endWeek: asInt(record.endWeek),
		periodTimes: asArray(record.periodTimes).map(decodePeriodTime)
	};
}

function decodePeriodTime(raw: unknown): PeriodTime {
	const record = asRecord(raw);
	return {
		index: asInt(record.index),
		startTime: asString(record.startTime),
		endTime: asString(record.endTime)
	};
}

function decodeViewPrefs(raw: unknown): TimetableViewPrefs {
	const record = asRecord(raw);
	return {
		showSaturday: asBoolean(record.showSaturday),
		showSunday: asBoolean(record.showSunday),
		showNonCurrentWeekCourses: asBoolean(record.showNonCurrentWeekCourses)
	};
}

function decodeImportMetadata(raw: unknown): { source: string; campusId?: string } {
	const record = asRecord(raw);
	const campusId = optionalString(record.campusId);
	return {
		source: asString(record.source),
		...(campusId === undefined ? {} : { campusId })
	};
}

function decodeCustomMetadata(raw: unknown): Record<string, unknown> | undefined {
	if (raw === undefined) return undefined;
	return asRecord(raw);
}

function slimImportMetadata(raw: { source: string; campusId?: string }): ImportMetadata {
	const source = raw.source.trim() || 'UNKNOWN';
	const campusId = raw.campusId?.trim();
	return campusId ? { source, campusId } : { source };
}

function asRecord(value: unknown): Record<string, unknown> {
	if (typeof value !== 'object' || value === null || Array.isArray(value)) {
		throw new Error('expected object');
	}
	return value as Record<string, unknown>;
}

function asArray(value: unknown): unknown[] {
	if (!Array.isArray(value)) throw new Error('expected array');
	return value;
}

function asInt(value: unknown): number {
	if (typeof value === 'number' && Number.isInteger(value)) return value;
	throw new Error('expected integer');
}

function asString(value: unknown): string {
	if (typeof value === 'string') return value;
	throw new Error('expected string');
}

function asBoolean(value: unknown): boolean {
	if (typeof value === 'boolean') return value;
	throw new Error('expected boolean');
}

function optionalString(value: unknown): string | undefined {
	if (value === undefined) return undefined;
	if (typeof value === 'string') return value;
	throw new Error('expected string');
}
