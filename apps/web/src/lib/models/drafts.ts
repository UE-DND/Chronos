import type { AcademicConfig, ImportMetadata, PeriodTime } from '@chronos/core';

export type PeriodTimeDraft = PeriodTime;

export interface TimetableSettingsDraft {
	name: string;
	academicConfig: AcademicConfig;
	importMetadata: ImportMetadata;
}

export interface CourseDraft {
	id?: string | null;
	name: string;
	teacher: string;
	location: string;
	recurrenceMode: 'all' | 'weeks';
	dayOfWeek: number | null;
	startPeriod: number | null;
	endPeriod: number | null;
	selectedWeeks: number[];
	remark: string;
}
