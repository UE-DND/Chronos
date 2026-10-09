import { beforeEach, describe, expect, it, vi } from 'vite-plus/test';
import { createTimetable } from '@chronos/core';
import type { AppShellController } from '#lib/app/app-shell.svelte.ts';
import { createTimetableDetailsEditor } from './timetable-details.svelte';

const mocks = vi.hoisted(() => ({ updateTimetableDetails: vi.fn(), snackbarKey: vi.fn() }));
vi.mock('#lib/services/app-engine.ts', () => ({ getAppController: () => mocks }));
vi.mock('#lib/components/ui/snackbar-state.svelte.ts', () => ({ snackbarKey: mocks.snackbarKey }));

function createEditor(onDone = vi.fn()) {
	const timetable = createTimetable({
		id: 'feedback-timetable',
		name: '课表',
		academicConfig: {
			termStartDate: '2026-03-02',
			startWeek: 1,
			endWeek: 20,
			periodTimes: [{ index: 1, startTime: '08:00', endTime: '08:45' }]
		}
	});
	const shell = { controller: { currentTimetable: timetable } } as unknown as AppShellController;
	const editor = createTimetableDetailsEditor(shell, onDone);
	editor.loadFromTimetable(timetable);
	return editor;
}

describe('timetable details operation feedback', () => {
	beforeEach(() => {
		mocks.updateTimetableDetails.mockReset().mockResolvedValue(undefined);
		mocks.snackbarKey.mockReset();
	});

	it('stays busy through persistence and navigation and accepts only one save', async () => {
		const write = Promise.withResolvers<void>();
		const navigation = Promise.withResolvers<void>();
		mocks.updateTimetableDetails.mockReturnValueOnce(write.promise);
		const onDone = vi.fn(() => navigation.promise);
		const editor = createEditor(onDone);
		const save = editor.save();
		expect(editor.isSaving).toBe(true);
		expect(editor.canSave).toBe(false);
		await editor.save();
		expect(mocks.updateTimetableDetails).toHaveBeenCalledOnce();
		write.resolve();
		await vi.waitFor(() => expect(onDone).toHaveBeenCalledOnce());
		expect(editor.isSaving).toBe(true);
		navigation.resolve();
		await save;
		expect(editor.isSaving).toBe(false);
	});

	it('retains the draft and allows retry after a failed write', async () => {
		mocks.updateTimetableDetails.mockRejectedValueOnce(new Error('quota exceeded'));
		const onDone = vi.fn();
		const editor = createEditor(onDone);
		editor.draft!.name = '修改后的课表';
		await editor.save();
		expect(onDone).not.toHaveBeenCalled();
		expect(editor.isSaving).toBe(false);
		expect(editor.canSave).toBe(true);
		expect(editor.draft!.name).toBe('修改后的课表');
		expect(mocks.snackbarKey).toHaveBeenCalledWith(
			'transfer.error.saveFailed',
			undefined,
			undefined,
			4000,
			'assertive'
		);
		await editor.save();
		expect(onDone).toHaveBeenCalledOnce();
	});
});
