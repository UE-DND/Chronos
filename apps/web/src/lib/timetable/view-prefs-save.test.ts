import { describe, expect, it, vi } from 'vite-plus/test';
import type { TimetableViewPrefs } from '@chronos/core';
import { createViewPrefsSaver } from './view-prefs-save';

const base: TimetableViewPrefs = {
	showSaturday: true,
	showSunday: true,
	showNonCurrentWeekCourses: false
};

describe('createViewPrefsSaver', () => {
	it('stops after a failed save and lets the next action start from persisted preferences', async () => {
		const failure = new Error('storage unavailable');
		let reject!: (error: Error) => void;
		const save = vi
			.fn()
			.mockImplementationOnce(
				() =>
					new Promise<void>((_resolve, rejectSave) => {
						reject = rejectSave;
					})
			)
			.mockResolvedValue(undefined);
		const saver = createViewPrefsSaver(save);

		saver.apply(base, { showSaturday: false });
		saver.apply(base, { showSunday: false });
		const failed = expect(saver.whenIdle()).rejects.toThrow('storage unavailable');
		reject(failure);
		await failed;
		expect(save).toHaveBeenCalledTimes(1);

		const next = saver.apply(base, { showNonCurrentWeekCourses: true });
		await saver.whenIdle();
		expect(next).toEqual({ ...base, showNonCurrentWeekCourses: true });
		expect(save).toHaveBeenLastCalledWith(next);
		expect(save).toHaveBeenCalledTimes(2);
	});

	it('does not let an in-flight save overwrite a later toggle', async () => {
		let release!: () => void;
		const gate = new Promise<void>((resolve) => {
			release = resolve;
		});
		const saved: TimetableViewPrefs[] = [];
		let calls = 0;

		const saver = createViewPrefsSaver(async (prefs) => {
			calls += 1;
			if (calls === 1) await gate;
			saved.push({ ...prefs });
		});

		saver.apply(base, { showSaturday: false });
		saver.apply(base, { showSunday: false });
		release();
		await saver.whenIdle();

		expect(saved.at(-1)).toEqual({
			showSaturday: false,
			showSunday: false,
			showNonCurrentWeekCourses: false
		});
	});
});
