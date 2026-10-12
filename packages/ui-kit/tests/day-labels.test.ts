import { describe, expect, it } from 'vite-plus/test';
import {
	timetableDayLabel,
	timetableDayShortLabel,
	timetableMonthLabel,
	type HostDayLabelTranslate
} from '../src/timetable-preview/day-labels';

const zhCnLabels: Record<string, string> = {
	'timetable.day.mon': '周一',
	'timetable.day.sun': '周日',
	'timetable.day.unknown': '未知',
	'timetable.dayShort.wed': '三'
};

const t: HostDayLabelTranslate = (key) => zhCnLabels[key] ?? key;

describe('day-labels', () => {
	it('localizes single and crossing months without changing their order', () => {
		const labels: Record<string, string> = {
			'timetable.monthShort.10': 'Oct',
			'timetable.monthShort.12': 'Dec',
			'timetable.monthShort.1': 'Jan',
			'timetable.grid.monthSuffix': ''
		};
		const en: HostDayLabelTranslate = (key) => labels[key] ?? key;
		expect(timetableMonthLabel('10', en)).toBe('Oct');
		expect(timetableMonthLabel('12/1', en)).toBe('Dec/Jan');
		expect(timetableMonthLabel('', en)).toBe('');
		expect(timetableMonthLabel('12/1', t)).toBe('12/1月');
	});

	it('maps day of week using host translate keys', () => {
		expect(timetableDayLabel(1, t)).toBe('周一');
		expect(timetableDayLabel(7, t)).toBe('周日');
		expect(timetableDayLabel(0, t)).toBe('');
		expect(timetableDayLabel(99, t)).toBe('未知');
		expect(timetableDayShortLabel(3, t)).toBe('三');
		expect(timetableDayShortLabel(99, t)).toBe('?');
	});
});
