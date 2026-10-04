import type { Timetable } from '../domain/timetable';
import { isPrepareReminderMinutes } from '../domain/preferences';
import { queryTimetableCourseOccurrences } from './course-schedule';

export interface ClassNotificationCourse {
	/** Occurrence identity stays unchanged when the preparation time changes. */
	key: string;
	name: string;
	teacher: string;
	location: string;
	endTime: string;
	startPeriod: number;
	endPeriod: number;
}
export interface ClassNotificationBatch {
	dateIso: string;
	startTime: string;
	startAt: number;
	notifyAt: number;
	prepareReminderMinutes: number;
	courses: ClassNotificationCourse[];
}

/** Actual occurrences within the semester; display-clock clamping is intentionally not used. */
export function buildClassNotificationPlan(options: {
	timetable: Timetable | null;
	prepareReminderMinutes: number;
	now?: Date;
	graceMs?: number;
}): ClassNotificationBatch[] {
	const { timetable, prepareReminderMinutes, now = new Date(), graceMs = 0 } = options;
	if (!isPrepareReminderMinutes(prepareReminderMinutes))
		throw new RangeError('Invalid preparation time');
	if (!timetable) return [];
	const config = timetable.academicConfig;
	const groups = new Map<number, ClassNotificationBatch>();
	for (const { course, dateIso } of queryTimetableCourseOccurrences(timetable)) {
		const startTime = config.periodTimes.find((p) => p.index === course.startPeriod)?.startTime;
		const endTime = config.periodTimes.find((p) => p.index === course.endPeriod)?.endTime;
		if (
			!startTime ||
			!endTime ||
			[startTime, endTime].some((time) => !/^([01]\d|2[0-3]):[0-5]\d$/.test(time))
		)
			continue;
		const [year, month, day] = dateIso.split('-').map(Number);
		const [hour, minute] = startTime.split(':').map(Number);
		const startAt = new Date(year!, month! - 1, day!, hour!, minute!).getTime();
		const notifyAt = startAt - prepareReminderMinutes * 60_000;
		if (notifyAt < now.getTime() - graceMs || startAt <= now.getTime()) continue;
		let group = groups.get(startAt);
		if (!group) {
			group = { dateIso, startTime, startAt, notifyAt, prepareReminderMinutes, courses: [] };
			groups.set(startAt, group);
		}
		const key = JSON.stringify([timetable.id, course.id, dateIso]);
		if (!group.courses.some((c) => c.key === key))
			group.courses.push({
				key,
				name: course.name,
				teacher: course.teacher,
				endTime,
				location: course.location,
				startPeriod: course.startPeriod,
				endPeriod: course.endPeriod
			});
	}
	return [...groups.values()].sort((a, b) => a.notifyAt - b.notifyAt);
}
