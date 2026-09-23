import type { AppShellController } from '$lib/app/app-shell.svelte';
import { trackEvent } from '$lib/client/analytics';
import type { CourseDraft } from '$lib/models/drafts';
import { courseToDraft } from '$lib/timetable/timetable-mappers';
import { getAppController } from '$lib/services/app-engine';
import { snackbarKey } from '$lib/components/ui/snackbar-state.svelte';
import {
	createCourse,
	findCourseScheduleConflicts,
	type Course,
	type Timetable
} from '@chronos/core';
import {
	buildCourseSchedule,
	createCourseScheduleDraft,
	type CourseRecurrenceMode
} from './course-schedule';

function emptyDraft(): CourseDraft {
	return {
		name: '',
		teacher: '',
		location: '',
		...createCourseScheduleDraft(),
		remark: ''
	};
}

function createCourseId(): string {
	if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
		return `c_${crypto.randomUUID()}`;
	}
	return `c_${Date.now()}_${Math.random().toString(36).slice(2, 10)}`;
}

function draftCourse(draft: CourseDraft, timetable: Timetable, newCourseId: string): Course | null {
	const schedule = buildCourseSchedule(draft, timetable.academicConfig);
	if (!schedule) return null;
	return createCourse({
		id: draft.id || newCourseId,
		name: draft.name,
		teacher: draft.teacher,
		location: draft.location,
		...schedule,
		remark: draft.remark
	});
}

export function createCourseEditor(
	shell: AppShellController,
	getCourseId: () => string | null,
	onDone: () => void | Promise<void>
) {
	let draft = $state<CourseDraft | null>(null);
	let syncedCourseKey = $state<string | null>(null);
	let isSaving = $state(false);
	let newCourseId = '';
	const controller = getAppController();

	const timetable = $derived(shell.controller.currentTimetable);
	const candidate = $derived(
		draft && timetable ? draftCourse(draft, timetable, newCourseId) : null
	);
	const conflicts = $derived.by(() => {
		if (!candidate || !timetable) return [];
		return findCourseScheduleConflicts(candidate, timetable.courses, {
			startWeek: timetable.academicConfig.startWeek,
			endWeek: timetable.academicConfig.endWeek
		});
	});
	const canSave = $derived(Boolean(candidate && draft?.name.trim()) && !isSaving);

	function syncFromRoute() {
		const courseId = getCourseId();
		const key = courseId ?? '__new__';
		if (syncedCourseKey === key) return;
		syncedCourseKey = key;
		if (!courseId) {
			newCourseId = createCourseId();
			draft = emptyDraft();
			return;
		}
		const course = shell.controller.currentTimetable?.courses.find(
			(entry) => entry.id === courseId
		);
		draft = course && timetable ? courseToDraft(course) : null;
	}

	async function save() {
		if (!timetable || !draft || !candidate || !canSave) return;
		const course = candidate;
		const courseIndex = timetable.courses.findIndex((entry) => entry.id === course.id);
		const courses = [...timetable.courses];
		if (courseIndex === -1) courses.push(course);
		else courses[courseIndex] = course;

		const viewPrefs = {
			...timetable.viewPrefs,
			showSaturday: timetable.viewPrefs.showSaturday || course.dayOfWeek === 6,
			showSunday: timetable.viewPrefs.showSunday || course.dayOfWeek === 7
		};

		isSaving = true;
		try {
			await controller.saveCurrentTimetableDetails({ courses, viewPrefs });
			trackEvent('course_save');
			void onDone();
		} catch {
			snackbarKey('course.editor.saveFailed', undefined, undefined, 4000, 'assertive');
		} finally {
			isSaving = false;
		}
	}

	async function deleteCourse() {
		if (!draft?.id) return;
		await controller.deleteCourse(draft.id);
		trackEvent('course_delete');
		await onDone();
	}

	function setRecurrenceMode(mode: CourseRecurrenceMode) {
		if (!draft || draft.recurrenceMode === mode) return;
		draft.recurrenceMode = mode;
	}

	function setStartPeriod(period: number | null) {
		if (!draft) return;
		draft.startPeriod = period;
		if (period !== null && draft.endPeriod !== null && draft.endPeriod < period) {
			draft.endPeriod = null;
		}
	}

	return {
		get draft() {
			return draft;
		},
		get canSave() {
			return canSave;
		},
		get timetable() {
			return timetable;
		},
		get candidate() {
			return candidate;
		},
		get conflicts() {
			return conflicts;
		},
		setRecurrenceMode,
		setStartPeriod,
		save,
		deleteCourse,
		syncFromRoute
	};
}

export type CourseEditorController = ReturnType<typeof createCourseEditor>;
