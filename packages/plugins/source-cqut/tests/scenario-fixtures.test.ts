import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vite-plus/test';
import { parseHTML } from 'linkedom';
import { parseHtmlTimetable } from '../src/html-parser';
import expected from '../../../core/tests/fixtures/timetable.expected.json';
import { SOURCE_CQUT_MESSAGES } from '../src/messages';
const options = {
	customDocParser: (html: string) => parseHTML(html).document as unknown as Document,
	t: (key: string) =>
		SOURCE_CQUT_MESSAGES['zh-cn'][key as keyof (typeof SOURCE_CQUT_MESSAGES)['zh-cn']]
};
describe('CQUT shared scenario', () => {
	it('parses the same courses used by domain and browser verification', () => {
		const result = parseHtmlTimetable(
			readFileSync(new URL('./fixtures/timetable.html', import.meta.url), 'utf8'),
			options
		);
		expect(
			result.courses
				.sort((a, b) => a.dayOfWeek - b.dayOfWeek || a.startPeriod - b.startPeriod)
				.map(({ name, teacher, location, dayOfWeek, startPeriod, endPeriod, weeks }) => ({
					name,
					teacher,
					location,
					dayOfWeek,
					startPeriod,
					endPeriod,
					weeks
				}))
		).toEqual(expected.courses);
		expect(result.viewPrefs).toMatchObject(expected.weekend);
	});
	it('rejects the malformed fixture', () => {
		expect(() =>
			parseHtmlTimetable(
				readFileSync(new URL('./fixtures/invalid.html', import.meta.url), 'utf8'),
				options
			)
		).toThrow();
	});
});
