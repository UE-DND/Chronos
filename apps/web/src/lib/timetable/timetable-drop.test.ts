import { describe, expect, it, vi } from 'vite-plus/test';
import {
	createCourse,
	createTimetable,
	type Timetable,
	type PlacedCourseCapsule
} from '@chronos/core';
import { createTimetableDropController } from './timetable-drop.svelte';
function harness() {
	let timetable: Timetable | null = createTimetable({
		id: 'a',
		name: 'A',
		courses: [
			createCourse({ id: 'c', name: 'A', dayOfWeek: 1, startPeriod: 1, endPeriod: 2, weeks: [2] })
		]
	});
	let resolve!: () => void;
	let reject!: (error: Error) => void;
	const save = vi.fn(
		(_id: string, _courses: import('@chronos/core').Course[]) =>
			new Promise<void>((yes, no) => {
				resolve = yes;
				reject = no;
			})
	);
	const onError = vi.fn();
	const controller = createTimetableDropController({
		getTimetable: () => timetable,
		save,
		onError,
		onSaved: vi.fn(),
		rendered: async () => {}
	});
	controller.sync({ timetableId: 'a', week: 2, active: true });
	const session = {
		course: timetable.courses[0]!,
		placed: {} as PlacedCourseCapsule,
		pointerId: 1,
		week: 2,
		targetColIndex: 1,
		targetDayOfWeek: 2,
		targetStartPeriod: 3,
		persistAfterDrop: true,
		overDeleteZone: false
	};
	return {
		controller,
		session,
		save,
		onError,
		resolve: () => resolve(),
		reject: () => reject(new Error('disk')),
		switch: () => {
			timetable = createTimetable({ id: 'b', name: 'B' });
			controller.sync({ timetableId: 'b', week: 2, active: true });
		}
	};
}
describe('timetable drop submission', () => {
	it('retains canonical preview during slow save and rejects another drop', async () => {
		const h = harness();
		const pending = h.controller.submit(h.session, 10);
		expect(h.controller.state.busy).toBe(true);
		expect(h.controller.state.preview?.course.startPeriod).toBe(3);
		await h.controller.submit(h.session, 10);
		expect(h.save).toHaveBeenCalledTimes(1);
		h.resolve();
		await pending;
		expect(h.controller.state.preview).toBeNull();
		expect(h.controller.state.busy).toBe(false);
	});
	it('removes failed preview and reports the save error', async () => {
		const h = harness();
		const pending = h.controller.submit(h.session, 10);
		h.reject();
		await pending;
		expect(h.controller.state.preview).toBeNull();
		expect(h.onError).toHaveBeenCalledOnce();
	});
	it('keeps saving the captured timetable after context changes without restoring old preview', async () => {
		const h = harness();
		const pending = h.controller.submit(h.session, 10);
		h.switch();
		expect(h.controller.state.preview).toBeNull();
		expect(h.controller.state.busy).toBe(true);
		h.resolve();
		await pending;
		expect(h.save.mock.calls[0]?.[0]).toBe('a');
		expect(h.controller.state.preview).toBeNull();
	});
});
