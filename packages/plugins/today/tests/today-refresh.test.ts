import { afterEach, describe, expect, it, vi } from 'vite-plus/test';
import { writable } from 'svelte/store';
import {
	ChronosEngine,
	createCourse,
	createTimetable,
	type CoursePaletteEntry
} from '@chronos/core';
import { createMockEnv } from '@chronos/core/test-utils';
import type { ChronosUiController, ChronosUiSnapshot } from '@chronos/ui-kit';
import { createTodayPlugin } from '../src/index';
import { createTodayScreenController } from '../src/today-screen.svelte';
import * as todayCourses from '../src/today-courses';
import type { TodayCourseHit } from '../src/today-courses';
afterEach(() => vi.restoreAllMocks());
async function harness(initialQueryError?: Error) {
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
	if (initialQueryError) query.mockRejectedValueOnce(initialQueryError);
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
	return {
		engine,
		screen,
		snapshot,
		query,
		course,
		paints,
		ctx,
		timetables,
		academicConfig: timetable.academicConfig,
		periodTimes: timetable.academicConfig.periodTimes
	};
}
async function settle() {
	for (let i = 0; i < 20; i++) await Promise.resolve();
}
describe('Today relevant input refresh', () => {
	it('distinguishes an initial query failure from a successful empty day and retries explicitly', async () => {
		const error = new Error('IndexedDB unavailable');
		const report = vi.spyOn(console, 'error').mockImplementation(() => {});
		const { engine, screen, query } = await harness(error);
		expect(screen.state).toMatchObject({ phase: 'failed', error, hasResult: false });
		expect(screen.courseEntries).toEqual([]);
		expect(report).toHaveBeenCalledWith('[today] course query failed', error);
		query.mockResolvedValueOnce([]);
		await screen.retry();
		expect(screen.state).toEqual({ phase: 'ready', error: null, hasResult: true, saveError: null });
		expect(screen.courseEntries).toEqual([]);
		screen.dispose();
		engine.dispose();
	});
	it('retains the last successful courses while loading and after failure until retry succeeds', async () => {
		vi.spyOn(console, 'error').mockImplementation(() => {});
		const { engine, screen, query, snapshot } = await harness();
		const previous = screen.courseEntries;
		const error = new TypeError('Invalid internal course state');
		let reject!: (reason: unknown) => void;
		query.mockImplementationOnce(() => new Promise((_resolve, fail) => (reject = fail)));
		snapshot.update((s) => ({ ...s, todayIso: '2026-03-03' }));
		await settle();
		expect(screen.state).toMatchObject({ phase: 'loading', hasResult: true });
		expect(screen.courseEntries).toBe(previous);
		reject(error);
		await settle();
		expect(screen.state).toMatchObject({ phase: 'failed', error, hasResult: true });
		expect(screen.courseEntries).toBe(previous);
		query.mockResolvedValueOnce([]);
		await screen.retry();
		expect(screen.state.phase).toBe('ready');
		expect(screen.courseEntries).toEqual([]);
		screen.dispose();
		engine.dispose();
	});
	it('keeps successful courses when coloring fails and reports the original error', async () => {
		const report = vi.spyOn(console, 'error').mockImplementation(() => {});
		const { engine, screen, snapshot, paints } = await harness();
		const error = new Error('Palette failure');
		paints.mockRejectedValueOnce(error);
		snapshot.update((s) => ({ ...s, coursePaletteRevision: 1 }));
		await settle();
		expect(screen.state.phase).toBe('ready');
		expect(screen.courseEntries).toHaveLength(1);
		expect(screen.paintByCourseKey.size).toBe(0);
		expect(report).toHaveBeenCalledWith('[today] course colors failed', error);
		screen.dispose();
		engine.dispose();
	});
	it('reports scope persistence failure while preserving the local selection', async () => {
		const report = vi.spyOn(console, 'error').mockImplementation(() => {});
		const { engine, screen, ctx } = await harness();
		const error = new Error('Config write failed');
		vi.spyOn(ctx, 'updateConfig').mockRejectedValueOnce(error);
		await screen.persistScope('all');
		expect(screen.scope).toBe('all');
		expect(screen.state.saveError).toBe(error);
		expect(report).toHaveBeenCalledWith('[today] scope save failed', error);
		screen.dispose();
		engine.dispose();
	});
	it('refreshes holiday additions and removal without remounting the active screen', async () => {
		const { engine, screen, snapshot, query } = await harness();
		expect(screen.courseEntries).toHaveLength(1);
		snapshot.update((s) => ({
			...s,
			currentTimetable: {
				...s.currentTimetable!,
				academicConfig: {
					...s.currentTimetable!.academicConfig,
					holidayCalendar: { holidays: [{ date: '2026-03-02', label: '休息日' }] }
				}
			}
		}));
		await settle();
		expect(screen.courseEntries).toEqual([]);
		expect(query).toHaveBeenCalledTimes(2);
		snapshot.update((s) => ({
			...s,
			currentTimetable: {
				...s.currentTimetable!,
				academicConfig: { ...s.currentTimetable!.academicConfig, holidayCalendar: undefined }
			}
		}));
		await settle();
		expect(screen.courseEntries).toHaveLength(1);
		expect(query).toHaveBeenCalledTimes(3);
		screen.dispose();
		engine.dispose();
	});
	it('refreshes all scope when an inactive timetable holiday calendar changes', async () => {
		const { engine, screen, snapshot, course, timetables, academicConfig } = await harness();
		const other = createTimetable({
			id: 'other',
			name: 'Other',
			courses: [course],
			academicConfig: { ...academicConfig }
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
	it.each([1, 2])('uses each timetable clock for all-scope period %i', async (startPeriod) => {
		const { engine, screen, snapshot, query, course, timetables, academicConfig } = await harness();
		const other = createTimetable({
			id: 'other',
			name: 'Other',
			academicConfig: {
				...academicConfig,
				periodTimes: [
					...(startPeriod === 2 ? [{ index: 1, startTime: '08:00', endTime: '08:45' }] : []),
					{ index: startPeriod, startTime: '09:00', endTime: '09:45' }
				]
			},
			courses: [{ ...course, id: 'other-course', startPeriod, endPeriod: startPeriod }]
		});
		timetables.set(other.id, other);
		await screen.persistScope('all');
		expect(screen.courseEntries.map((entry) => entry.hit.course.id)).toEqual(['a', 'other-course']);
		for (const [time, status, minutesUntilStart] of [
			['08:50', 'preparing', 10],
			['09:10', 'current', null],
			['10:00', 'past', null]
		] as const) {
			snapshot.update((s) => ({ ...s, now: new Date(`2026-03-02T${time}:00`) }));
			await settle();
			expect(screen.courseEntries.find((entry) => entry.hit.timetableId === 'other')).toMatchObject(
				{
					status,
					minutesUntilStart,
					timeRange: { startTime: '09:00', endTime: '09:45' }
				}
			);
		}
		expect(query).toHaveBeenCalledTimes(2);
		other.academicConfig.periodTimes = other.academicConfig.periodTimes.map((period) =>
			period.index === startPeriod ? { ...period, startTime: '11:00', endTime: '11:45' } : period
		);
		snapshot.update((s) => ({
			...s,
			timetables: [{ id: other.id, name: other.name, updatedAt: other.updatedAt + 1 }]
		}));
		await settle();
		expect(screen.courseEntries.find((entry) => entry.hit.timetableId === 'other')).toMatchObject({
			status: 'upcoming',
			minutesUntilStart: 60,
			timeRange: { startTime: '11:00', endTime: '11:45' }
		});
		await screen.persistScope('active');
		expect(screen.courseEntries).toMatchObject([
			{
				hit: { timetableId: 't' },
				status: 'past',
				timeRange: { startTime: '08:00', endTime: '08:45' }
			}
		]);
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
		const { engine, screen, snapshot, query, course, periodTimes } = await harness();
		query.mockResolvedValue(
			['张', '李'].map((name) => ({
				timetableId: 't',
				timetableName: 'T',
				periodTimes,
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
		const { engine, screen, snapshot, query, course, periodTimes } = await harness();
		let release!: (hits: TodayCourseHit[]) => void;
		query.mockImplementationOnce(
			() =>
				new Promise((resolve) => {
					release = resolve;
				})
		);
		snapshot.update((s) => ({ ...s, todayIso: '2026-03-03' }));
		await settle();
		query.mockResolvedValue([
			{ timetableId: 't', timetableName: 'T', periodTimes, course: { ...course, name: 'Newest' } }
		]);
		snapshot.update((s) => ({ ...s, todayIso: '2026-03-04' }));
		await settle();
		release([
			{ timetableId: 't', timetableName: 'T', periodTimes, course: { ...course, name: 'Stale' } }
		]);
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
