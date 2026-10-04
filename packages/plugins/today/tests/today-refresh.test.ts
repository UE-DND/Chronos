import { afterEach, describe, expect, it, vi } from 'vite-plus/test';
import { writable } from 'svelte/store';
import {
	ChronosEngine,
	createCourse,
	createTimetable,
	type CoursePaletteEntry,
	type CourseQueryHit
} from '@chronos/core';
import { createMockEnv } from '@chronos/core/test-utils';
import type { ChronosUiController, ChronosUiSnapshot } from '@chronos/ui-kit';
import { createTodayPlugin } from '../src/index';
import { createTodayScreenController } from '../src/today-screen.svelte';
import * as todayCourses from '../src/today-courses';
afterEach(() => vi.restoreAllMocks());
async function harness() {
	const paints = vi.fn(
		async () =>
			new Map<string, CoursePaletteEntry>([['A', { background: '#111111', foreground: '#ffffff' }]])
	);
	const { env, timetables } = createMockEnv({
		coursePresentation: {
			getCoursePalette: () => [],
			resolveCoursePaintsForTimetable: paints,
			resolveCoursePaint: async () => ({ background: '#111111', foreground: '#ffffff' })
		}
	});
	const engine = new ChronosEngine({ env });
	await engine.init();
	await engine.loadPlugin(createTodayPlugin());
	const course = createCourse({ id: 'a', name: 'A', dayOfWeek: 1, startPeriod: 1, endPeriod: 1 });
	const timetable = createTimetable({ id: 't', name: 'T', courses: [course] });
	timetable.academicConfig.termStartDate = '2026-03-02';
	timetable.academicConfig.periodTimes = [{ index: 1, startTime: '08:00', endTime: '08:45' }];
	timetables.set(timetable.id, timetable);
	await engine.switchTimetable(timetable.id);
	const ctx = engine.getPluginContext('tool-today');
	await ctx.actions.updatePreferences({ prepareReminderMinutes: 10 });
	const query = vi.spyOn(todayCourses, 'queryTodayCourses');
	const snapshot = writable({
		currentTimetable: timetable,
		userPreferences: engine.state.userPreferences,
		timetables: [],
		now: new Date('2026-03-02T07:49:00'),
		todayIso: '2026-03-02',
		coursePaletteRevision: 0
	} as unknown as ChronosUiSnapshot);
	engine.on('preferences:updated', ({ preferences }) => {
		snapshot.update((s) => ({ ...s, userPreferences: preferences }));
	});
	const screen = createTodayScreenController();
	await screen.init(
		{ snapshot, getPluginContext: () => ctx } as unknown as ChronosUiController,
		'tool-today'
	);
	return { engine, screen, snapshot, query, course, paints, ctx, timetables };
}
async function settle() {
	for (let i = 0; i < 20; i++) await Promise.resolve();
}
describe('Today relevant input refresh', () => {
	it('refreshes holiday additions and removal without remounting the active screen', async () => {
		const { engine, screen, snapshot, query } = await harness();
		expect(screen.courseEntries).toHaveLength(1);
		snapshot.update((s) => {
			s.currentTimetable!.academicConfig.holidayCalendar = {
				holidays: [{ date: '2026-03-02', label: '休息日' }]
			};
			return { ...s };
		});
		await settle();
		expect(screen.courseEntries).toEqual([]);
		expect(query).toHaveBeenCalledTimes(2);
		snapshot.update((s) => {
			delete s.currentTimetable!.academicConfig.holidayCalendar;
			return { ...s };
		});
		await settle();
		expect(screen.courseEntries).toHaveLength(1);
		expect(query).toHaveBeenCalledTimes(3);
		screen.dispose();
		engine.dispose();
	});
	it('refreshes all scope when an inactive timetable holiday calendar changes', async () => {
		const { engine, screen, snapshot, course, timetables } = await harness();
		const other = createTimetable({
			id: 'other',
			name: 'Other',
			courses: [course],
			academicConfig: { ...engine.state.currentTimetable!.academicConfig }
		});
		timetables.set(other.id, other);
		await screen.persistScope('all');
		expect(screen.courseEntries.map((entry) => entry.hit.timetableId).sort()).toEqual([
			'other',
			't'
		]);
		other.academicConfig.holidayCalendar = { holidays: [{ date: '2026-03-02', label: '休息日' }] };
		snapshot.update((s) => ({
			...s,
			timetables: [{ id: other.id, name: other.name, updatedAt: other.updatedAt + 1 }]
		}));
		await settle();
		expect(screen.courseEntries.map((entry) => entry.hit.timetableId)).toEqual(['t']);
		screen.dispose();
		engine.dispose();
	});
	it('keeps all-scope courses visible according to their own timetable periods', async () => {
		const { engine, screen, course, timetables } = await harness();
		const other = createTimetable({
			id: 'other',
			name: 'Other',
			academicConfig: {
				...engine.state.currentTimetable!.academicConfig,
				periodTimes: [
					{ index: 1, startTime: '08:00', endTime: '08:45' },
					{ index: 2, startTime: '09:00', endTime: '09:45' }
				]
			},
			courses: [{ ...course, id: 'second', startPeriod: 2, endPeriod: 2 }]
		});
		timetables.set(other.id, other);
		await screen.persistScope('all');
		expect(screen.courseEntries.map((entry) => entry.hit.course.id)).toEqual(['a', 'second']);
		screen.dispose();
		engine.dispose();
	});
	it('07:50 updates the ten-minute reminder without rereading courses; unrelated and palette updates do not query', async () => {
		const { engine, screen, snapshot, query } = await harness();
		expect(screen.courseEntries[0].status).toBe('upcoming');
		snapshot.update((s) => ({ ...s, now: new Date('2026-03-02T07:50:00') }));
		await settle();
		expect(screen.courseEntries[0].status).toBe('preparing');
		expect(query).toHaveBeenCalledTimes(1);
		snapshot.update((s) => ({
			...s,
			locale: 'en',
			courseBadges: {},
			coursePaletteRevision: 1
		}));
		await settle();
		expect(query).toHaveBeenCalledTimes(1);
		screen.dispose();
		engine.dispose();
	});
	it('host preference changes refresh statuses immediately without querying or recoloring courses', async () => {
		const { engine, screen, query, paints, ctx } = await harness();
		expect(screen.prepareReminderMinutes).toBe(10);
		expect(screen.courseEntries[0].status).toBe('upcoming');
		await ctx.actions.updatePreferences({ prepareReminderMinutes: 15 });
		await settle();
		expect(screen.prepareReminderMinutes).toBe(15);
		expect(screen.courseEntries[0].status).toBe('preparing');
		await ctx.actions.updatePreferences({ prepareReminderMinutes: 5 });
		await settle();
		expect(screen.courseEntries[0].status).toBe('upcoming');
		expect(query).toHaveBeenCalledTimes(1);
		expect(paints).toHaveBeenCalledTimes(1);
		screen.dispose();
		engine.dispose();
	});
	it('locale changes re-sort same-period courses without querying again', async () => {
		const { engine, screen, snapshot, query, course } = await harness();
		query.mockResolvedValue(
			['张', '李'].map((name) => ({
				timetableId: 't',
				timetableName: 'T',
				course: { ...course, id: name, name }
			}))
		);
		snapshot.update((s) => ({ ...s, todayIso: '2026-03-03', locale: 'zh-cn' }));
		await settle();
		expect(screen.courseEntries.map((entry) => entry.hit.course.name)).toEqual(['李', '张']);
		expect(query).toHaveBeenCalledTimes(2);

		snapshot.update((s) => ({ ...s, locale: 'en' }));
		await settle();
		expect(screen.courseEntries.map((entry) => entry.hit.course.name)).toEqual(['张', '李']);
		expect(query).toHaveBeenCalledTimes(2);
		screen.dispose();
		engine.dispose();
	});
	it('newer date result wins even when an older query completes last, and disposal invalidates pending work', async () => {
		const { engine, screen, snapshot, query, course } = await harness();
		let release!: (hits: CourseQueryHit[]) => void;
		query.mockImplementationOnce(
			() =>
				new Promise((resolve) => {
					release = resolve;
				})
		);
		snapshot.update((s) => ({ ...s, todayIso: '2026-03-03' }));
		await settle();
		query.mockResolvedValue([
			{ timetableId: 't', timetableName: 'T', course: { ...course, name: 'Newest' } }
		]);
		snapshot.update((s) => ({ ...s, todayIso: '2026-03-04' }));
		await settle();
		release([{ timetableId: 't', timetableName: 'T', course: { ...course, name: 'Stale' } }]);
		await settle();
		expect(screen.courseEntries[0].hit.course.name).toBe('Newest');
		query.mockImplementationOnce(
			() =>
				new Promise((resolve) => {
					release = resolve;
				})
		);
		snapshot.update((s) => ({ ...s, todayIso: '2026-03-05' }));
		await settle();
		screen.dispose();
		release([]);
		await settle();
		expect(screen.courseEntries).toEqual([]);
		engine.dispose();
	});
	it('only the newest palette request can paint the current courses', async () => {
		const { engine, screen, snapshot, query, paints, ctx } = await harness();
		let release!: (value: Map<string, CoursePaletteEntry>) => void;
		paints.mockImplementationOnce(
			() =>
				new Promise((resolve) => {
					release = resolve;
				})
		);
		snapshot.update((s) => ({ ...s, coursePaletteRevision: 1 }));
		await settle();
		const newest = new Map([['A', { background: '#abcdef', foreground: '#000000' }]]);
		paints.mockResolvedValue(newest);
		snapshot.update((s) => ({ ...s, coursePaletteRevision: 2 }));
		await settle();
		release(new Map([['A', { background: '#stale', foreground: '#ffffff' }]]));
		await settle();
		expect(screen.paintByCourseKey.get('t\0A')).toEqual(newest.get('A'));
		expect(query).toHaveBeenCalledTimes(1);
		await ctx.actions.updatePreferences({ prepareReminderMinutes: 30 });
		await settle();
		expect(screen.courseEntries[0].status).toBe('preparing');
		expect(query).toHaveBeenCalledTimes(1);
		screen.dispose();
		engine.dispose();
	});
});
