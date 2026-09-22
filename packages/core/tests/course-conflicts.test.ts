import { describe, expect, it } from 'vite-plus/test';
import { findCourseScheduleConflicts, type Course } from '../src';

const bounds = { startWeek: 1, endWeek: 20 };

function course(patch: Partial<Course> = {}): Course {
	return {
		id: 'candidate',
		name: '高等数学',
		teacher: '',
		location: '',
		dayOfWeek: 1,
		startPeriod: 1,
		endPeriod: 2,
		weeks: [],
		remark: '',
		...patch
	};
}

describe('findCourseScheduleConflicts', () => {
	it('finds courses whose day, periods and teaching weeks overlap', () => {
		const candidate = course({ weeks: [3, 4, 5] });
		const conflicts = findCourseScheduleConflicts(
			candidate,
			[
				course({ id: 'same-slot', name: '物理', startPeriod: 2, endPeriod: 3, weeks: [5] }),
				course({ id: 'adjacent', name: '英语', startPeriod: 3, endPeriod: 4, weeks: [5] }),
				course({ id: 'other-week', name: '化学', weeks: [6] }),
				course({ id: 'other-day', name: '体育', dayOfWeek: 2, weeks: [5] })
			],
			bounds
		);

		expect(conflicts.map((entry) => entry.id)).toEqual(['same-slot']);
	});

	it('treats an empty week list as every week in the academic bounds', () => {
		const candidate = course({ weeks: [] });
		const conflicts = findCourseScheduleConflicts(
			candidate,
			[course({ id: 'single', weeks: [20] }), course({ id: 'outside', weeks: [21] })],
			bounds
		);

		expect(conflicts.map((entry) => entry.id)).toEqual(['single']);
	});

	it('excludes the candidate itself while returning every other conflict', () => {
		const candidate = course({ id: 'same-id', weeks: [2] });
		const conflicts = findCourseScheduleConflicts(
			candidate,
			[candidate, course({ id: 'first', weeks: [] }), course({ id: 'second', weeks: [2, 3] })],
			bounds
		);

		expect(conflicts.map((entry) => entry.id)).toEqual(['first', 'second']);
	});
});
