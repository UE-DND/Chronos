import { describe, expect, it, vi } from 'vite-plus/test';
import { ChronosEngine, createCourse, createTimetable } from '../src';
import { createMockEnv } from '../src/test-utils';

const course = (id: string) =>
	createCourse({ id, name: id, dayOfWeek: 1, startPeriod: 1, endPeriod: 1, weeks: [1, 2] });

describe('course mutation consistency', () => {
	it('preserves simultaneous additions and patches from separate engines sharing storage', async () => {
		const { env } = createMockEnv();
		const initial = createTimetable({ id: 't', name: 'Timetable', courses: [course('existing')] });
		await env.storage.saveTimetable(initial);
		await env.storage.setActiveTimetableId(initial.id);
		const engines = [new ChronosEngine({ env }), new ChronosEngine({ env })];
		await Promise.all(engines.map((engine) => engine.init()));
		try {
			await Promise.all([
				engines[0].saveCourse(course('a')),
				engines[1].saveCourse(course('b')),
				engines[0].updateCourse('existing', { teacher: 'Teacher' }),
				engines[1].updateCourse('existing', { location: 'Room' })
			]);
			const saved = await env.storage.getTimetable(initial.id);
			expect(saved?.courses.map((entry) => entry.id)).toEqual(['existing', 'a', 'b']);
			expect(saved?.courses[0]).toMatchObject({ teacher: 'Teacher', location: 'Room' });
		} finally {
			engines.forEach((engine) => engine.dispose());
		}
	});

	it('keeps a failed write from blocking subsequent mutations', async () => {
		const { env } = createMockEnv();
		const engine = new ChronosEngine({ env });
		const timetable = await engine.createTimetable('Timetable');
		const failure = new Error('Write failed');
		vi.spyOn(env.storage, 'saveTimetable').mockRejectedValueOnce(failure);
		try {
			await expect(engine.saveCourse(course('failed'))).rejects.toBe(failure);
			await engine.saveCourse(course('saved'));
			expect(
				(await env.storage.getTimetable(timetable.id))?.courses.map((entry) => entry.id)
			).toEqual(['saved']);
		} finally {
			engine.dispose();
		}
	});

	it('applies week deletion and rescheduling to the latest courses without replacing peers', async () => {
		const { env } = createMockEnv();
		const engine = new ChronosEngine({ env });
		const timetable = await engine.importTimetable(
			createTimetable({ id: 'preview', name: 'Timetable', courses: [course('a'), course('b')] })
		);
		const [a, b] = timetable.courses;
		try {
			await Promise.all([engine.deleteCourseForWeek(a.id, 1), engine.saveCourse(course('added'))]);
			await Promise.all([
				engine.rearrangeCourse(a.id, {
					targetDayOfWeek: 3,
					targetStartPeriod: 2,
					currentWeek: 2,
					displayedPeriodCount: 10
				}),
				engine.updateCourse(b.id, { teacher: 'Teacher' })
			]);
			const saved = await env.storage.getTimetable(timetable.id);
			expect(saved?.courses.find((entry) => entry.id === a.id)).toMatchObject({
				weeks: [2],
				dayOfWeek: 3,
				startPeriod: 2
			});
			expect(saved?.courses.find((entry) => entry.id === b.id)?.teacher).toBe('Teacher');
			expect(saved?.courses.some((entry) => entry.id === 'added')).toBe(true);
		} finally {
			engine.dispose();
		}
	});

	it('reveals a saved weekend course while retaining unrelated latest display preferences', async () => {
		const { env } = createMockEnv();
		const engine = new ChronosEngine({ env });
		const timetable = await engine.createTimetable('Timetable');
		try {
			await engine.updateTimetableDetails(timetable.id, {
				viewPrefs: { showSaturday: false, showSunday: false }
			});
			await Promise.all([
				engine.updateTimetableDetails(timetable.id, {
					viewPrefs: { showNonCurrentWeekCourses: true }
				}),
				engine.saveCourse({ ...course('sunday'), dayOfWeek: 7 })
			]);
			expect(engine.state.currentTimetable?.viewPrefs).toEqual({
				showSaturday: false,
				showSunday: true,
				showNonCurrentWeekCourses: true
			});
		} finally {
			engine.dispose();
		}
	});

	it('does not share mutable input, returned timetable or state references', async () => {
		const { env } = createMockEnv();
		const engine = new ChronosEngine({ env });
		const result = await engine.createTimetable('Timetable');
		const input = course('saved');
		try {
			await engine.saveCourse(input);
			input.weeks.push(9);
			result.academicConfig.endWeek = 99;
			const state = engine.state.currentTimetable!;
			expect(() => (state.courses as unknown as unknown[]).push(course('illegal'))).toThrow();
			expect(state.courses[0].weeks).toEqual([1, 2]);
			expect(state.academicConfig.endWeek).toBe(20);
			expect((await env.storage.getTimetable(result.id))?.courses[0].weeks).toEqual([1, 2]);
		} finally {
			engine.dispose();
		}
	});

	it('returns editable nested creation and import results isolated from inputs and persistence', async () => {
		const { env } = createMockEnv();
		const engine = new ChronosEngine({ env });
		const periods = [{ index: 1, startTime: '08:00', endTime: '08:45' }];
		const input = createTimetable({
			id: 'preview',
			name: 'Imported',
			courses: [{ ...course('imported'), customMetadata: { plugin: { values: [1] } } }],
			customMetadata: { plugin: { values: [2] } }
		});
		try {
			const created = await engine.createTimetable('Created', { periodTimes: periods });
			created.academicConfig.periodTimes[0].startTime = '09:00';
			expect(periods[0].startTime).toBe('08:00');
			expect(
				(await env.storage.getTimetable(created.id))?.academicConfig.periodTimes[0].startTime
			).toBe('08:00');
			const imported = await engine.importTimetable(input);
			imported.courses[0].weeks.push(3);
			(imported.courses[0].customMetadata!.plugin as { values: number[] }).values.push(4);
			(imported.customMetadata!.plugin as { values: number[] }).values.push(5);
			imported.academicConfig.endWeek = 99;
			expect(input.courses[0].weeks).toEqual([1, 2]);
			expect(input.courses[0].customMetadata).toEqual({ plugin: { values: [1] } });
			expect(input.customMetadata).toEqual({ plugin: { values: [2] } });
			const saved = await env.storage.getTimetable(imported.id);
			expect(saved?.courses[0].weeks).toEqual([1, 2]);
			expect(saved?.customMetadata).toEqual({ plugin: { values: [2] } });
			expect(engine.state.currentTimetable?.academicConfig.endWeek).toBe(20);
		} finally {
			engine.dispose();
		}
	});

	it('returns editable moved-course metadata without sharing state or persisted references', async () => {
		const { env } = createMockEnv();
		const engine = new ChronosEngine({ env });
		try {
			await engine.createTimetable('Timetable');
			await engine.saveCourse({ ...course('moved'), customMetadata: { plugin: { values: [1] } } });
			const moved = await engine.rearrangeCourse('moved', {
				targetDayOfWeek: 3,
				targetStartPeriod: 2,
				displayedPeriodCount: 10
			});
			(moved!.customMetadata!.plugin as { values: number[] }).values.push(2);
			expect(engine.state.currentTimetable?.courses[0].customMetadata).toEqual({
				plugin: { values: [1] }
			});
			expect(
				(await env.storage.getTimetable(engine.state.currentTimetable!.id))?.courses[0]
					.customMetadata
			).toEqual({ plugin: { values: [1] } });
		} finally {
			engine.dispose();
		}
	});
});
