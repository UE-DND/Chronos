import { describe, expect, it } from 'vite-plus/test';
import { createCourse } from '@chronos/core';
import { courseFromRow, courseToRow } from './mappers';

describe('storage mappers', () => {
	it('round-trips course weeks through weeksCsv', () => {
		const course = {
			id: 'c1',
			name: '编译原理',
			teacher: '张老师',
			location: 'B201',
			dayOfWeek: 1,
			startPeriod: 1,
			endPeriod: 2,
			weeks: [1, 3, 5],
			remark: 'note'
		};

		const row = courseToRow(course, 't1');
		expect(row.weeksCsv).toBe('1,3,5');

		const restored = courseFromRow(row);
		expect(restored.weeks).toEqual([1, 3, 5]);
		expect(restored.remark).toBe('note');
	});

	it('preserves empty weeks as every academic week', () => {
		const course = createCourse({
			id: 'course',
			name: 'Math',
			dayOfWeek: 1,
			startPeriod: 1,
			endPeriod: 1
		});
		expect(courseFromRow(courseToRow(course, 'timetable')).weeks).toEqual([]);
	});

	it.each(['1,2junk', '1,NaN', '1,,2', '1,', '1,2.5', '1,Infinity', '1,9007199254740993', '1, 2'])(
		'rejects malformed stored weeks %j',
		(weeksCsv) => {
			const row = courseToRow(
				createCourse({ id: 'course', name: 'Math', dayOfWeek: 1, startPeriod: 1, endPeriod: 1 }),
				'timetable'
			);
			expect(() => courseFromRow({ ...row, weeksCsv })).toThrow('Invalid stored course weeks');
		}
	);
});
