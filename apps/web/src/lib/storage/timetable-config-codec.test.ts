import { describe, expect, it } from 'vite-plus/test';
import { encodeTimetableConfig, decodeTimetableConfig } from './timetable-config-codec';

const academicConfig = {
	termStartDate: '2026-02-23',
	startWeek: 2,
	endWeek: 18,
	periodTimes: [{ index: 1, startTime: '08:00', endTime: '08:45' }]
};
const importMetadata = { source: 'FILE_HTML' };
const viewPrefs = {
	showSaturday: false,
	showSunday: true,
	showNonCurrentWeekCourses: true
};

describe('TimetableConfigJsonCodec', () => {
	it('decodes current config shape', () => {
		const encoded = encodeTimetableConfig(academicConfig, importMetadata, viewPrefs);
		const decoded = decodeTimetableConfig(encoded);

		expect(decoded.academicConfig).toEqual(academicConfig);
		expect(decoded.importMetadata).toEqual(importMetadata);
		expect(decoded.viewPrefs).toEqual(viewPrefs);
		expect(decoded.schemaVersion).toBe(1);
	});

	it('rejects missing fields and non-current schemas instead of migrating them', () => {
		const current = JSON.parse(encodeTimetableConfig(academicConfig, importMetadata, viewPrefs));
		for (const schemaVersion of [undefined, 2, 3, '1']) {
			expect(() => decodeTimetableConfig(JSON.stringify({ ...current, schemaVersion }))).toThrow();
		}
		for (const key of ['academicConfig', 'importMetadata', 'viewPrefs']) {
			const incomplete = { ...current };
			delete incomplete[key];
			expect(() => decodeTimetableConfig(JSON.stringify(incomplete))).toThrow();
		}
		expect(() => decodeTimetableConfig('{}')).toThrow();
	});

	it('strips unknown keys and keeps empty periodTimes', () => {
		const decoded = decodeTimetableConfig(
			JSON.stringify({
				schemaVersion: 1,
				extra: true,
				academicConfig: { ...academicConfig, leftover: 'x' },
				importMetadata,
				viewPrefs
			})
		);
		expect(decoded).toEqual({
			schemaVersion: 1,
			academicConfig,
			importMetadata,
			viewPrefs
		});
		expect(decoded).not.toHaveProperty('extra');

		const emptyPeriods = decodeTimetableConfig(
			encodeTimetableConfig({ ...academicConfig, periodTimes: [] }, importMetadata, viewPrefs)
		);
		expect(emptyPeriods.academicConfig.periodTimes).toEqual([]);
	});

	it('decodes holiday calendar and custom metadata', () => {
		const decoded = decodeTimetableConfig(
			JSON.stringify({
				schemaVersion: 1,
				viewPrefs,
				academicConfig: {
					...academicConfig,
					holidayCalendar: {
						holidays: [{ date: '2026-10-01', label: '国庆' }],
						syncedAt: 1,
						syncedYears: [2026]
					}
				},
				importMetadata: { source: '  FILE_HTML  ', campusId: '  a  ' },
				customMetadata: { plugin: { on: true } }
			})
		);
		expect(decoded.academicConfig.holidayCalendar).toEqual({
			holidays: [{ date: '2026-10-01', label: '国庆' }],
			syncedAt: 1,
			syncedYears: [2026]
		});
		expect(decoded.importMetadata).toEqual({ source: 'FILE_HTML', campusId: 'a' });
		expect(decoded.customMetadata).toEqual({ plugin: { on: true } });
	});

	it('rejects invalid JSON and wrong field types', () => {
		expect(() => decodeTimetableConfig('not-json')).toThrow();
		expect(() =>
			decodeTimetableConfig(
				encodeTimetableConfig(academicConfig, importMetadata, {
					...viewPrefs,
					showSaturday: 1 as unknown as boolean
				})
			)
		).toThrow();
	});
});
