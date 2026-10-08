import {
	computeTimetableWeekLayout,
	createCourse,
	createTimetable,
	type Course,
	type PlacedCourseCapsule
} from '@chronos/core';
import { deleteCourseForWeek } from '$lib/timetable/course-delete-week';
import { createTimetableInteraction } from '$lib/timetable/timetable-interaction.svelte';
import { createTimetableDropController } from '$lib/timetable/timetable-drop.svelte';

export function createLongPressDemo(names: () => { primary: string; secondary: string }) {
	function sampleTimetable() {
		const { primary, secondary } = names();
		return createTimetable({
			id: 'onboarding-demo',
			name: 'Onboarding',
			academicConfig: {
				termStartDate: '2026-09-07',
				startWeek: 1,
				endWeek: 2,
				periodTimes: [
					{ index: 1, startTime: '08:00', endTime: '08:45' },
					{ index: 2, startTime: '08:55', endTime: '09:40' },
					{ index: 3, startTime: '10:00', endTime: '10:45' }
				]
			},
			viewPrefs: { showSaturday: false, showSunday: false, showNonCurrentWeekCourses: false },
			courses: [
				createCourse({
					id: 'demo-primary',
					name: primary,
					dayOfWeek: 1,
					startPeriod: 1,
					endPeriod: 1,
					weeks: [1, 2]
				}),
				createCourse({
					id: 'demo-secondary',
					name: secondary,
					dayOfWeek: 3,
					startPeriod: 2,
					endPeriod: 2,
					weeks: [1, 2]
				})
			]
		});
	}
	let timetable = $state.raw(sampleTimetable());
	let pendingDelete = $state.raw<Course | null>(null);
	const interaction = createTimetableInteraction();
	const layout = $derived(
		computeTimetableWeekLayout({
			timetable,
			displayedWeek: 1,
			todayIso: '2026-09-07',
			columnWidthPx: 60,
			layoutMode: 'compact'
		})
	);
	const drop = createTimetableDropController({
		getTimetable: () => timetable,
		save: async (_id, courses) => {
			timetable = { ...timetable, courses };
		},
		onSaved() {},
		onError() {
			reset();
		}
	});
	function reset() {
		interaction.destroy();
		drop.destroy();
		pendingDelete = null;
		timetable = sampleTimetable();
		drop.sync({ timetableId: timetable.id, week: 1, active: true });
	}
	reset();

	function beginDrag(event: PointerEvent, fromLongPress = false) {
		const placed = layout.placements.find(
			(item): item is PlacedCourseCapsule =>
				item.kind === 'course' && item.course.name === names().primary
		);
		if (!placed) return;
		interaction.beginDrag({
			course: placed.course,
			placed,
			pointerId: event.pointerId,
			week: 1,
			targetColIndex: placed.course.dayOfWeek - 1,
			targetDayOfWeek: placed.course.dayOfWeek,
			targetStartPeriod: placed.course.startPeriod,
			persistAfterDrop: !fromLongPress,
			waitForMove: fromLongPress,
			originX: event.clientX,
			originY: event.clientY
		});
	}
	async function release() {
		const session = interaction.endDrag();
		if (!session) return;
		if (session.overDeleteZone) pendingDelete = session.course;
		else await drop.submit(session, layout.gridModel.displayedPeriodCount);
	}
	function confirmDelete() {
		if (!pendingDelete) return;
		const courses = deleteCourseForWeek({
			currentCourses: timetable.courses,
			courseId: pendingDelete.id,
			currentWeek: 1,
			totalWeeks: { startWeek: 1, endWeek: 2 }
		});
		if (courses) timetable = { ...timetable, courses };
		pendingDelete = null;
	}
	return {
		get state() {
			return { timetable, layout, pendingDelete };
		},
		interaction,
		drop,
		reset,
		hold(event: PointerEvent) {
			interaction.enterEditFromLongPress(event);
			beginDrag(event, true);
		},
		beginDrag,
		moveTo(dayOfWeek: number, startPeriod: number) {
			interaction.updateDragTarget({
				targetColIndex: dayOfWeek - 1,
				targetDayOfWeek: dayOfWeek,
				targetStartPeriod: startPeriod
			});
		},
		overDelete() {
			interaction.setDragOverDeleteZone(true);
		},
		release,
		confirmDelete,
		cancelDelete() {
			pendingDelete = null;
		},
		destroy() {
			interaction.destroy();
			drop.destroy();
		}
	};
}
export type LongPressDemoController = ReturnType<typeof createLongPressDemo>;
