import type { Timetable } from '../domain/timetable';
import { isPrepareReminderMinutes } from '../domain/preferences';
import { isCoursePeriodVisible } from './display-models';
import { AcademicCalendarService } from './calendar';
import { formatIsoDate, parseIsoDate } from './date';

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
	try {
		if (
			!config.termStartDate ||
			formatIsoDate(parseIsoDate(config.termStartDate)) !== config.termStartDate
		)
			return [];
	} catch {
		return [];
	}
	if (
		!Number.isInteger(config.startWeek) ||
		!Number.isInteger(config.endWeek) ||
		config.startWeek < 1 ||
		config.endWeek < config.startWeek
	)
		return [];
	const calendar = new AcademicCalendarService();
	const groups = new Map<number, ClassNotificationBatch>();
	for (let week = config.startWeek; week <= config.endWeek; week++) {
		for (const course of timetable.courses) {
			if (course.weeks.length && !course.weeks.includes(week)) continue;
			if (
				!Number.isInteger(course.startPeriod) ||
				!Number.isInteger(course.endPeriod) ||
				course.startPeriod < 1 ||
				course.endPeriod < course.startPeriod ||
				!Number.isInteger(course.dayOfWeek) ||
				course.dayOfWeek < 1 ||
				course.dayOfWeek > 7 ||
				!isCoursePeriodVisible(course, config.periodTimes.length)
			)
				continue;
			const startTime = config.periodTimes.find((p) => p.index === course.startPeriod)?.startTime;
			const endTime = config.periodTimes.find((p) => p.index === course.endPeriod)?.endTime;
			if (
				!startTime ||
				!endTime ||
				[startTime, endTime].some((time) => !/^([01]\d|2[0-3]):[0-5]\d$/.test(time))
			)
				continue;
			const dateIso = calendar.resolveCourseDate(
				config,
				week,
				course.dayOfWeek,
				config.termStartDate
			);
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
	}
	return [...groups.values()].sort((a, b) => a.notifyAt - b.notifyAt);
}
