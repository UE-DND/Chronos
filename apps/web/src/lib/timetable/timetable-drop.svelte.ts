import { tick } from 'svelte';
import {
	rearrangeCourseSchedule,
	type Course,
	type CourseRearrangement,
	type ReadonlyTimetable
} from '@chronos/core';
import type { TimetableDragSession } from './timetable-interaction-types';

export function createTimetableDropController(options: {
	getTimetable(): ReadonlyTimetable | null;
	save(timetableId: string, courseId: string, change: CourseRearrangement): Promise<Course | null>;
	onError(): void;
	onSaved(): void;
	rendered?: () => Promise<void>;
}) {
	let busy = $state(false);
	let preview = $state.raw<
		(TimetableDragSession & { concealedCourseId: string; timetableId: string }) | null
	>(null);
	let context = { timetableId: null as string | null, week: 1, active: false };
	let generation = 0;
	function sync(next: typeof context) {
		if (
			next.timetableId !== context.timetableId ||
			next.week !== context.week ||
			next.active !== context.active
		) {
			generation++;
			preview = null;
		}
		context = next;
	}
	async function submit(
		session: TimetableDragSession,
		displayedPeriodCount: number
	): Promise<void> {
		const timetable = options.getTimetable();
		if (
			busy ||
			!context.active ||
			!timetable ||
			timetable.id !== context.timetableId ||
			session.week !== context.week
		)
			return;
		const config = timetable.academicConfig;
		const result = rearrangeCourseSchedule({
			currentCourses: timetable.courses,
			draggedCourseId: session.course.id,
			targetDayOfWeek: session.targetDayOfWeek,
			targetStartPeriod: session.targetStartPeriod,
			currentWeek: session.week,
			totalWeeks: { startWeek: config.startWeek ?? 1, endWeek: config.endWeek ?? 20 },
			displayedPeriodCount
		});
		if (!result) return;
		const task = ++generation;
		busy = true;
		preview = {
			...session,
			timetableId: timetable.id,
			concealedCourseId: session.course.id,
			course: result.movedCourse,
			targetStartPeriod: result.movedCourse.startPeriod
		};
		try {
			const moved = await options.save(timetable.id, session.course.id, {
				targetDayOfWeek: session.targetDayOfWeek,
				targetStartPeriod: session.targetStartPeriod,
				currentWeek: session.week,
				displayedPeriodCount
			});
			if (task === generation && preview && moved) {
				preview = { ...preview, course: moved, targetStartPeriod: moved.startPeriod };
			}
			options.onSaved();
			await (options.rendered ?? tick)();
		} catch {
			if (task === generation) options.onError();
		} finally {
			if (task === generation) preview = null;
			busy = false;
		}
	}
	return {
		get state() {
			return { busy, preview };
		},
		sync,
		submit,
		destroy() {
			sync({ ...context, active: false });
		}
	};
}
export type TimetableDropController = ReturnType<typeof createTimetableDropController>;
