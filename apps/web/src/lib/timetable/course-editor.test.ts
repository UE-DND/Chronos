import { beforeEach, describe, expect, it, vi } from 'vite-plus/test';
import { createTimetable, type Timetable } from '@chronos/core';
import { createCourseEditor } from './course-editor.svelte';

const mocks = vi.hoisted(() => ({
	saveCurrentTimetableDetails: vi.fn(),
	deleteCourse: vi.fn(),
	snackbarKey: vi.fn(),
	trackEvent: vi.fn()
}));

vi.mock('$lib/services/app-engine', () => ({
	getAppController: () => ({
		saveCurrentTimetableDetails: mocks.saveCurrentTimetableDetails,
		deleteCourse: mocks.deleteCourse
	})
}));

vi.mock('$lib/components/ui/snackbar-state.svelte', () => ({
	snackbarKey: mocks.snackbarKey
}));

vi.mock('$lib/client/analytics', () => ({
	trackEvent: mocks.trackEvent
}));

function timetable(patch: Partial<Timetable> = {}): Timetable {
	return createTimetable({
		id: 'timetable-1',
		name: '课表',
		courses: [],
		academicConfig: {
			termStartDate: '2026-03-02',
			startWeek: 1,
			endWeek: 20,
			periodTimes: [
				{ index: 1, startTime: '08:00', endTime: '08:45' },
				{ index: 2, startTime: '08:55', endTime: '09:40' }
			]
		},
		viewPrefs: {
			showSaturday: false,
			showSunday: false,
			showNonCurrentWeekCourses: true
		},
		...patch
	});
}

function shellWith(currentTimetable: Timetable) {
	return {
		controller: {
			currentTimetable,
			clockTodayIso: '2026-03-16'
		}
	} as never;
}

describe('createCourseEditor', () => {
	beforeEach(() => {
		mocks.saveCurrentTimetableDetails.mockReset().mockResolvedValue(undefined);
		mocks.deleteCourse.mockReset().mockResolvedValue(undefined);
		mocks.snackbarKey.mockReset();
		mocks.trackEvent.mockReset();
		vi.stubGlobal('crypto', { randomUUID: () => 'test-uuid' });
	});

	it('starts a new draft without guessed schedule values', () => {
		const editor = createCourseEditor(shellWith(timetable()), () => null, vi.fn());
		editor.syncFromRoute();

		expect(editor.draft).toMatchObject({
			recurrenceMode: 'all',
			selectedWeeks: [],
			dayOfWeek: null,
			startPeriod: null,
			endPeriod: null
		});
		expect(editor.canSave).toBe(false);
	});

	it('requires at least one week in selected-week mode', () => {
		const editor = createCourseEditor(shellWith(timetable()), () => null, vi.fn());
		editor.syncFromRoute();
		Object.assign(editor.draft!, {
			name: '高等数学',
			dayOfWeek: 1,
			startPeriod: 1,
			endPeriod: 1
		});

		editor.setRecurrenceMode('weeks');
		expect(editor.canSave).toBe(false);
		editor.draft!.selectedWeeks = [3, 1];
		expect(editor.canSave).toBe(true);
		expect(editor.candidate?.weeks).toEqual([1, 3]);
	});

	it('saves a globally unique new weekend course and reveals that day', async () => {
		const onDone = vi.fn();
		const editor = createCourseEditor(shellWith(timetable()), () => null, onDone);
		editor.syncFromRoute();
		Object.assign(editor.draft!, {
			name: '临时课程',
			dayOfWeek: 6,
			startPeriod: 1,
			endPeriod: 2
		});

		expect(editor.canSave).toBe(true);
		const candidateId = editor.candidate?.id;
		await editor.save();

		expect(mocks.saveCurrentTimetableDetails).toHaveBeenCalledWith({
			courses: [
				expect.objectContaining({
					id: 'c_test-uuid',
					name: '临时课程',
					dayOfWeek: 6,
					weeks: []
				})
			],
			viewPrefs: {
				showSaturday: true,
				showSunday: false,
				showNonCurrentWeekCourses: true
			}
		});
		expect(candidateId).toBe('c_test-uuid');
		expect(mocks.trackEvent).toHaveBeenCalledWith('course_save');
		expect(onDone).toHaveBeenCalledOnce();
	});

	it('keeps the draft open and reports a failed save', async () => {
		mocks.saveCurrentTimetableDetails.mockRejectedValueOnce(new Error('storage failed'));
		const onDone = vi.fn();
		const editor = createCourseEditor(shellWith(timetable()), () => null, onDone);
		editor.syncFromRoute();
		Object.assign(editor.draft!, {
			name: '高等数学',
			dayOfWeek: 1,
			startPeriod: 1,
			endPeriod: 1
		});

		await editor.save();

		expect(onDone).not.toHaveBeenCalled();
		expect(editor.draft?.name).toBe('高等数学');
		expect(mocks.snackbarKey).toHaveBeenCalledWith(
			'course.editor.saveFailed',
			undefined,
			undefined,
			4000,
			'assertive'
		);
	});

	it('updates an existing course without changing its id', async () => {
		const existing = {
			id: 'existing-id',
			name: '高等数学',
			teacher: '',
			location: '',
			dayOfWeek: 2,
			startPeriod: 1,
			endPeriod: 2,
			weeks: [1, 2, 3],
			remark: ''
		};
		const editor = createCourseEditor(
			shellWith(timetable({ courses: [existing] })),
			() => existing.id,
			vi.fn()
		);
		editor.syncFromRoute();
		editor.draft!.name = '高等数学 A';

		await editor.save();

		expect(mocks.saveCurrentTimetableDetails).toHaveBeenCalledWith(
			expect.objectContaining({
				courses: [expect.objectContaining({ id: 'existing-id', name: '高等数学 A' })]
			})
		);
	});

	it('reports conflicts without preventing save', () => {
		const existing = {
			id: 'existing',
			name: '物理',
			teacher: '',
			location: '',
			dayOfWeek: 1,
			startPeriod: 2,
			endPeriod: 3,
			weeks: [],
			remark: ''
		};
		const editor = createCourseEditor(
			shellWith(timetable({ courses: [existing] })),
			() => null,
			vi.fn()
		);
		editor.syncFromRoute();
		Object.assign(editor.draft!, {
			name: '高等数学',
			dayOfWeek: 1,
			startPeriod: 1,
			endPeriod: 2
		});

		expect(editor.conflicts.map((course) => course.id)).toEqual(['existing']);
		expect(editor.canSave).toBe(true);
	});

	it('deletes an existing course and tracks course_delete', async () => {
		const existing = {
			id: 'existing-to-delete',
			name: '大学物理',
			teacher: '',
			location: '',
			dayOfWeek: 3,
			startPeriod: 1,
			endPeriod: 2,
			weeks: [1],
			remark: ''
		};
		const onDone = vi.fn();
		const editor = createCourseEditor(
			shellWith(timetable({ courses: [existing] })),
			() => existing.id,
			onDone
		);
		editor.syncFromRoute();

		await editor.deleteCourse();

		expect(mocks.deleteCourse).toHaveBeenCalledWith('existing-to-delete');
		expect(mocks.trackEvent).toHaveBeenCalledWith('course_delete');
		expect(onDone).toHaveBeenCalledOnce();
	});

	it('waits for navigation after deleting a course', async () => {
		const existing = {
			id: 'course-to-delete',
			name: '大学物理',
			teacher: '',
			location: '',
			dayOfWeek: 3,
			startPeriod: 1,
			endPeriod: 2,
			weeks: [1],
			remark: ''
		};
		let finishNavigation!: () => void;
		const navigation = new Promise<void>((resolve) => {
			finishNavigation = resolve;
		});
		const onDone = vi.fn(() => navigation);
		const editor = createCourseEditor(
			shellWith(timetable({ courses: [existing] })),
			() => existing.id,
			onDone
		);
		editor.syncFromRoute();

		let deletionFinished = false;
		const deletion = editor.deleteCourse().then(() => {
			deletionFinished = true;
		});
		await vi.waitFor(() => expect(onDone).toHaveBeenCalledOnce());
		expect(deletionFinished).toBe(false);

		finishNavigation();
		await deletion;
		expect(deletionFinished).toBe(true);
	});
});
