import { beforeEach, describe, expect, it, vi } from 'vite-plus/test';
import { createTimetable, type Timetable } from '@chronos/core';
import { createCourseEditor } from './course-editor.svelte';
import type { AppShellController } from '$lib/app/app-shell.svelte';

const mocks = vi.hoisted(() => ({
	updateTimetableDetails: vi.fn(),
	deleteCourse: vi.fn(),
	snackbarKey: vi.fn()
}));

vi.mock('$lib/services/app-engine', () => ({
	getAppController: () => ({
		updateTimetableDetails: mocks.updateTimetableDetails,
		deleteCourse: mocks.deleteCourse
	})
}));

vi.mock('$lib/components/ui/snackbar-state.svelte', () => ({
	snackbarKey: mocks.snackbarKey
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

function shellWith(currentTimetable: Timetable | null) {
	return {
		state: { initialized: currentTimetable !== null },
		controller: {
			currentTimetable,
			todayIso: '2026-03-16'
		}
	} as unknown as AppShellController;
}

describe('createCourseEditor', () => {
	beforeEach(() => {
		mocks.updateTimetableDetails.mockReset().mockResolvedValue(undefined);
		mocks.deleteCourse.mockReset().mockResolvedValue(undefined);
		mocks.snackbarKey.mockReset();
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

	it('loads an existing course after startup and preserves subsequent draft edits', () => {
		const existing = {
			id: 'delayed-course',
			name: '高等数学',
			teacher: '',
			location: '',
			dayOfWeek: 1,
			startPeriod: 1,
			endPeriod: 2,
			weeks: [1],
			remark: ''
		};
		const shell = shellWith(null);
		const editor = createCourseEditor(shell, () => existing.id, vi.fn());
		editor.syncFromRoute();
		expect(editor.isLoading).toBe(true);
		expect(editor.draft).toBeNull();
		shell.controller.currentTimetable = timetable({ courses: [existing] });
		shell.state.initialized = true;
		editor.syncFromRoute();
		expect(editor.isLoading).toBe(false);
		expect(editor.draft?.name).toBe('高等数学');
		editor.draft!.name = '未保存的名称';
		editor.syncFromRoute();
		expect(editor.draft?.name).toBe('未保存的名称');
	});

	it('keeps a missing course empty after the timetable loads', () => {
		const shell = shellWith(null);
		const editor = createCourseEditor(shell, () => 'missing-course', vi.fn());
		editor.syncFromRoute();
		shell.controller.currentTimetable = timetable();
		shell.state.initialized = true;
		editor.syncFromRoute();
		expect(editor.draft).toBeNull();
		expect(editor.canSave).toBe(false);
	});

	it('preserves a new course draft when the timetable finishes loading', () => {
		const shell = shellWith(null);
		const editor = createCourseEditor(shell, () => null, vi.fn());
		editor.syncFromRoute();
		editor.draft!.name = '新课程';
		shell.controller.currentTimetable = timetable();
		shell.state.initialized = true;
		editor.syncFromRoute();
		expect(editor.draft?.name).toBe('新课程');
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

	it('allows remarks at the limit and blocks remarks over the limit', () => {
		const editor = createCourseEditor(shellWith(timetable()), () => null, vi.fn());
		editor.syncFromRoute();
		Object.assign(editor.draft!, {
			name: '高等数学',
			dayOfWeek: 1,
			startPeriod: 1,
			endPeriod: 2,
			remark: 'x'.repeat(200)
		});

		expect(editor.canSave).toBe(true);
		editor.draft!.remark += 'x';
		expect(editor.canSave).toBe(false);
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

		expect(mocks.updateTimetableDetails).toHaveBeenCalledWith('timetable-1', {
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
		expect(onDone).toHaveBeenCalledOnce();
	});

	it('keeps the draft open and reports a failed save', async () => {
		mocks.updateTimetableDetails.mockRejectedValueOnce(new Error('storage failed'));
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

		expect(mocks.updateTimetableDetails).toHaveBeenCalledWith(
			'timetable-1',
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

	it('deletes an existing course', async () => {
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
	it('exposes pending save state and blocks duplicate saves and deletion', async () => {
		const pending = Promise.withResolvers<void>();
		mocks.updateTimetableDetails.mockReturnValueOnce(pending.promise);
		const onDone = vi.fn();
		const editor = createCourseEditor(shellWith(timetable()), () => null, onDone);
		editor.syncFromRoute();
		Object.assign(editor.draft!, { name: '高等数学', dayOfWeek: 1, startPeriod: 1, endPeriod: 1 });
		const save = editor.save();
		expect(editor.isSaving).toBe(true);
		expect(editor.canSave).toBe(false);
		await editor.save();
		await editor.deleteCourse();
		expect(mocks.updateTimetableDetails).toHaveBeenCalledOnce();
		expect(mocks.deleteCourse).not.toHaveBeenCalled();
		pending.resolve();
		await save;
		expect(editor.isSaving).toBe(false);
		expect(onDone).toHaveBeenCalledOnce();
	});

	it('keeps a failed deletion retryable and blocks overlapping actions', async () => {
		const existing = {
			id: 'delete-id',
			name: '大学物理',
			teacher: '',
			location: '',
			dayOfWeek: 1,
			startPeriod: 1,
			endPeriod: 1,
			weeks: [],
			remark: ''
		};
		const pending = Promise.withResolvers<void>();
		mocks.deleteCourse.mockReturnValueOnce(pending.promise);
		const onDone = vi.fn();
		const editor = createCourseEditor(
			shellWith(timetable({ courses: [existing] })),
			() => existing.id,
			onDone
		);
		editor.syncFromRoute();
		const deletion = editor.deleteCourse();
		expect(editor.isDeleting).toBe(true);
		expect(editor.canSave).toBe(false);
		await editor.deleteCourse();
		await editor.save();
		expect(mocks.deleteCourse).toHaveBeenCalledOnce();
		expect(mocks.updateTimetableDetails).not.toHaveBeenCalled();
		pending.reject(new Error('storage failed'));
		await deletion;
		expect(editor.isDeleting).toBe(false);
		expect(editor.canSave).toBe(true);
		expect(onDone).not.toHaveBeenCalled();
		expect(mocks.snackbarKey).toHaveBeenCalledWith(
			'course.editor.deleteFailed',
			undefined,
			undefined,
			4000,
			'assertive'
		);
		await editor.deleteCourse();
		expect(onDone).toHaveBeenCalledOnce();
	});
});
