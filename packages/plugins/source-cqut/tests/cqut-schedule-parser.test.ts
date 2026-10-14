import { describe, expect, it } from 'vite-plus/test';
import { parseCqutScheduleData, type CqutOnlineEventItem } from '../src/cqut-schedule-parser';

const event: CqutOnlineEventItem = {
	weekDay: '2',
	sessionStart: '3',
	sessionLast: '2',
	eventName: ' 数据库★☆ ',
	weekList: ['23', '2', 'invalid', '2', '1']
};

function parse(events: CqutOnlineEventItem[]) {
	return parseCqutScheduleData({ payload: { termStartDate: '2026-09-07', eventList: events } });
}

describe('CQUT online course normalization', () => {
	it('skips invalid events while keeping source indices in generated IDs', () => {
		const events = [
			{ ...event, weekDay: '0' },
			{ ...event, sessionStart: 'invalid' },
			{ ...event, eventName: '   ' },
			event,
			{ ...event, eventID: ' provided-id ', eventName: '操作系统' }
		];
		const before = structuredClone(events);
		const timetable = parse(events);
		expect(timetable.courses.map((course) => course.id)).toEqual(['cqut-2-3-4-3', 'provided-id']);
		expect(timetable.courses[0]).toMatchObject({ name: '数据库', weeks: [1, 2, 23] });
		expect(timetable.academicConfig).toMatchObject({ endWeek: 23, termStartDate: '2026-09-07' });
		expect(events).toEqual(before);
	});

	it.each([
		{ sessionList: ['3', 'invalid', '5'], endPeriod: 5 },
		{ sessionList: ['invalid'], endPeriod: 4 },
		{ sessionList: ['Infinity', '5'], endPeriod: 4 },
		{ sessionList: ['1'], endPeriod: 3 },
		{ sessionList: [], endPeriod: 4 }
	])('resolves explicit sessions and duration fallback: %j', ({ sessionList, endPeriod }) => {
		expect(parse([{ ...event, sessionList }]).courses[0]?.endPeriod).toBe(endPeriod);
	});

	it('keeps empty weeks unrestricted and a minimum semester length of twenty weeks', () => {
		const timetable = parse([{ ...event, weekList: ['invalid'] }]);
		expect(timetable.courses[0]?.weeks).toEqual([]);
		expect(timetable.academicConfig.endWeek).toBe(20);
		expect(parse([]).academicConfig.endWeek).toBe(20);
	});
	it.each([{ sessionList: '34' }, { weekList: '12' }])(
		'rejects strings where numeric lists are required: %j',
		(patch) => {
			const malformed = { ...event, ...patch } as unknown as CqutOnlineEventItem;
			expect(() => parse([malformed])).toThrow(TypeError);
		}
	);
});
