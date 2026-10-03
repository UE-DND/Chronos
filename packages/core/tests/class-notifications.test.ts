import { describe, expect, it } from 'vite-plus/test';
import { buildClassNotificationPlan, createCourse, createTimetable } from '../src/index';

function timetable() {
	return createTimetable({
		id: 'main',
		name: 'Main',
		academicConfig: {
			termStartDate: '2026-03-02',
			startWeek: 1,
			endWeek: 2,
			periodTimes: [
				{ index: 1, startTime: '00:20', endTime: '01:00' },
				{ index: 2, startTime: '01:10', endTime: '01:55' }
			]
		},
		courses: [
			createCourse({
				id: 'a',
				name: 'Math',
				location: 'Room 1',
				dayOfWeek: 1,
				startPeriod: 1,
				endPeriod: 2,
				weeks: [1, 2]
			})
		]
	});
}
const now = new Date('2026-03-01T00:00:00');
describe('class notification plan', () => {
	it('expands actual semester dates, reminds a continuous class once, and crosses midnight', () => {
		const plan = buildClassNotificationPlan({
			timetable: timetable(),
			prepareReminderMinutes: 30,
			now
		});
		expect(plan).toHaveLength(2);
		expect(plan[0]?.dateIso).toBe('2026-03-02');
		expect(new Date(plan[0]!.notifyAt).getDate()).toBe(1);
		expect(new Date(plan[0]!.notifyAt).getHours()).toBe(23);
		expect(new Date(plan[0]!.notifyAt).getMinutes()).toBe(50);
		expect(plan[0]?.courses[0]?.endPeriod).toBe(2);
		expect(plan[0]?.courses[0]?.endTime).toBe('01:55');
		expect(plan[1]?.dateIso).toBe('2026-03-09');
	});
	it('groups simultaneous courses and keeps occurrence keys independent of lead time', () => {
		const t = timetable();
		t.courses.push(createCourse({ ...t.courses[0]!, id: 'b', name: 'Physics', weeks: [2] }));
		const early = buildClassNotificationPlan({ timetable: t, prepareReminderMinutes: 30, now });
		const late = buildClassNotificationPlan({ timetable: t, prepareReminderMinutes: 5, now });
		expect(early[1]?.courses).toHaveLength(2);
		expect(early[1]?.courses.map((c) => c.key)).toEqual(late[1]?.courses.map((c) => c.key));
	});
	it('does not extend clamped weeks beyond semester or include expired reminders', () => {
		expect(
			buildClassNotificationPlan({
				timetable: timetable(),
				prepareReminderMinutes: 30,
				now: new Date('2026-03-16T00:00:00')
			})
		).toEqual([]);
		expect(
			buildClassNotificationPlan({
				timetable: timetable(),
				prepareReminderMinutes: 30,
				now: new Date('2026-03-02T00:00:00')
			})
		).toHaveLength(1);
	});
	it('skips invalid or hidden period references and missing academic dates', () => {
		const t = timetable();
		t.courses[0]!.startPeriod = 3;
		expect(buildClassNotificationPlan({ timetable: t, prepareReminderMinutes: 30, now })).toEqual(
			[]
		);
		t.courses[0]!.startPeriod = 2;
		t.courses[0]!.endPeriod = 1;
		expect(buildClassNotificationPlan({ timetable: t, prepareReminderMinutes: 30, now })).toEqual(
			[]
		);
		t.courses[0]!.endPeriod = 2;
		t.courses[0]!.startPeriod = 1;
		t.academicConfig.periodTimes[0]!.startTime = '25:30';
		expect(buildClassNotificationPlan({ timetable: t, prepareReminderMinutes: 30, now })).toEqual(
			[]
		);
		t.academicConfig.termStartDate = '';
		expect(buildClassNotificationPlan({ timetable: t, prepareReminderMinutes: 30, now })).toEqual(
			[]
		);
	});
	it('expands empty weeks only inside the semester and validates lead time', () => {
		const t = timetable();
		t.courses[0]!.weeks = [];
		expect(
			buildClassNotificationPlan({ timetable: t, prepareReminderMinutes: 30, now })
		).toHaveLength(2);
		expect(() =>
			buildClassNotificationPlan({ timetable: t, prepareReminderMinutes: 6, now })
		).toThrow(RangeError);
		expect(
			buildClassNotificationPlan({ timetable: null, prepareReminderMinutes: 30, now })
		).toEqual([]);
	});
});
