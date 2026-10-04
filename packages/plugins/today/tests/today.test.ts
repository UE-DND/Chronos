import { describe, it, expect } from 'vite-plus/test';
import {
	ChronosEngine,
	createCourse,
	createTimetable,
	type CourseQueryHit,
	IStorageService,
	assignCourseDisplayColors,
	COURSE_PALETTE_ENTRIES
} from '@chronos/core';
import { createMockEnv } from '@chronos/core/test-utils';
import { createTodayPlugin } from '../src/index';
import { coursePaintKey, createTodayScreenController } from '../src/today-screen.svelte';
import {
	attachCourseStatuses,
	queryTodayCourses,
	resolveCourseTimeStatus,
	resolveMinutesUntilCourseStart,
	resolvePeriodTimeRange,
	sortCourseHits
} from '../src/today-courses';
import type { ReactiveChronosController } from '@chronos/ui-kit';

describe('today plugin', () => {
	it('uses host preparation preferences and only keeps private scope config', async () => {
		const { env } = createMockEnv();
		const engine = new ChronosEngine({ env });
		await engine.init();

		const handle = await engine.loadPlugin(createTodayPlugin());
		const ctx = engine.getPluginContext('tool-today');

		expect(ctx.config).toEqual({ scope: 'active' });
		expect(ctx.state.userPreferences.prepareReminderMinutes).toBe(30);
		await ctx.actions.updatePreferences({ prepareReminderMinutes: 15 });
		expect(ctx.state.userPreferences.prepareReminderMinutes).toBe(15);

		handle.dispose();
		engine.dispose();
	});

	it('registers bottom bar tab and screen slots when loaded', async () => {
		const { env } = createMockEnv();
		const engine = new ChronosEngine({ env });
		await engine.init();

		const handle = await engine.loadPlugin(createTodayPlugin());

		const tab = engine.slots.getSlotItem('shell.bottom-bar.tab', 'today');
		expect(tab).toBeDefined();
		expect(tab?.order).toBe(15);
		expect(tab?.defaultLaunch).toBe(true);

		const screen = engine.slots.getSlotItem('shell.route.screen', 'tool-today');
		expect(screen).toBeDefined();

		handle.dispose();
		expect(engine.slots.getSlotItem('shell.bottom-bar.tab', 'today')).toBeUndefined();
		engine.dispose();
	});

	it('exposes a valid today ISO date before init', () => {
		const screen = createTodayScreenController();
		expect(screen.today).toMatch(/^\d{4}-\d{2}-\d{2}$/);
	});

	it('does not leak event listeners when disposed during async initialization', async () => {
		const { env } = createMockEnv();
		const engine = new ChronosEngine({ env });
		await engine.init();
		await engine.loadPlugin(createTodayPlugin());

		const mockController = {
			currentTimetable: null,
			coursePalette: null,
			now: new Date(),
			todayIso: '2026-03-02',
			currentPeriodIndex: null,
			getPluginContext: (id: string) => engine.getPluginContext(id)
		} as unknown as ReactiveChronosController;

		const screen = createTodayScreenController();
		const initPromise = screen.init(mockController, 'tool-today');
		screen.dispose();
		await initPromise;

		engine.events.emit('time:tick', {
			todayIso: '2026-03-02',
			now: new Date('2026-03-02T10:00:00'),
			currentWeek: 1,
			currentPeriod: 1,
			frozen: false
		});

		expect(screen.courseEntries).toEqual([]);
		engine.dispose();
	});

	it('resolves course paints via ICoursePresentationService using full timetable scope', async () => {
		const courseA = createCourse({
			id: 'ca',
			name: 'Course A',
			dayOfWeek: 1,
			startPeriod: 1,
			endPeriod: 1
		});
		const courseB = createCourse({
			id: 'cb',
			name: 'Course B',
			dayOfWeek: 1,
			startPeriod: 2,
			endPeriod: 2
		});
		const timetable = createTimetable({
			id: 'main',
			name: 'Main',
			courses: [courseA, courseB],
			academicConfig: {
				termStartDate: '2026-03-02',
				startWeek: 1,
				endWeek: 20,
				periodTimes: [
					{ index: 1, startTime: '08:00', endTime: '08:45' },
					{ index: 2, startTime: '08:55', endTime: '09:40' }
				]
			}
		});
		const lookup = assignCourseDisplayColors(timetable.courses, COURSE_PALETTE_ENTRIES);

		const { env, timetables } = createMockEnv({
			coursePresentation: {
				getCoursePalette: () => COURSE_PALETTE_ENTRIES,
				resolveCoursePaintsForTimetable: async () => lookup,
				resolveCoursePaint: async ({ course }) =>
					lookup.get(course.name) ?? COURSE_PALETTE_ENTRIES[0]!
			}
		});
		const engine = new ChronosEngine({ env });
		await engine.init();
		timetables.set(timetable.id, timetable);
		await engine.switchTimetable(timetable.id);
		await engine.loadPlugin(createTodayPlugin());

		const mockController = {
			snapshot: {
				subscribe: (listener: (value: unknown) => void) => {
					listener({
						now: new Date('2026-03-02T10:00:00'),
						todayIso: '2026-03-02',
						currentTimetable: timetable,
						coursePaletteRevision: 0
					});
					return () => {};
				}
			},
			getPluginContext: (id: string) => engine.getPluginContext(id)
		} as unknown as ReactiveChronosController;

		const screen = createTodayScreenController();
		await screen.init(mockController, 'tool-today');

		expect(screen.paintByCourseKey.get(coursePaintKey(timetable.id, courseA.name))).toEqual(
			lookup.get('Course A')
		);
		engine.dispose();
	});
});

describe('today-courses', () => {
	it('excludes only holiday timetables in active and all scopes and restores cleared dates', async () => {
		const main = createTimetable({
			id: 'main',
			name: 'Main',
			academicConfig: {
				termStartDate: '2026-03-02',
				startWeek: 1,
				endWeek: 20,
				periodTimes: [{ index: 1, startTime: '08:00', endTime: '08:45' }],
				holidayCalendar: { holidays: [{ date: '2026-03-02', label: '休息日' }] }
			}
		});
		main.courses = [
			createCourse({ id: 'main', name: 'Main', dayOfWeek: 1, startPeriod: 1, endPeriod: 1 })
		];
		const other = createTimetable({ ...main, id: 'other' });
		delete other.academicConfig.holidayCalendar;
		const storage = {
			listTimetables: async () => [main, other],
			getTimetable: async (id: string) => (id === main.id ? main : other)
		} as unknown as IStorageService;
		const query = (scope: 'active' | 'all') =>
			queryTodayCourses(storage, { todayIso: '2026-03-02', scope, timetable: main });
		expect(await query('active')).toEqual([]);
		expect((await query('all')).map((hit) => hit.timetableId)).toEqual(['other']);
		other.academicConfig.holidayCalendar = main.academicConfig.holidayCalendar;
		expect(await query('all')).toEqual([]);
		main.academicConfig.holidayCalendar = { holidays: [] };
		expect((await query('active')).map((hit) => hit.timetableId)).toEqual(['main']);
	});
	const periodTimes = [
		{ index: 1, startTime: '08:00', endTime: '08:45' },
		{ index: 2, startTime: '08:55', endTime: '09:40' },
		{ index: 3, startTime: '10:00', endTime: '10:45' }
	];

	it('resolvePeriodTimeRange returns start and end times for a period span', () => {
		expect(resolvePeriodTimeRange(periodTimes, 1, 2)).toEqual({
			startTime: '08:00',
			endTime: '09:40'
		});
		expect(resolvePeriodTimeRange(periodTimes, 3, 3)).toEqual({
			startTime: '10:00',
			endTime: '10:45'
		});
		expect(resolvePeriodTimeRange(periodTimes, 9, 9)).toBeNull();
	});

	it('sortCourseHits orders by start period then end period', () => {
		const hits: CourseQueryHit[] = [
			{
				timetableId: 't1',
				timetableName: 'A',
				course: createCourse({
					id: 'c2',
					name: 'B',
					dayOfWeek: 1,
					startPeriod: 3,
					endPeriod: 3
				})
			},
			{
				timetableId: 't1',
				timetableName: 'A',
				course: createCourse({
					id: 'c1',
					name: 'A',
					dayOfWeek: 1,
					startPeriod: 1,
					endPeriod: 2
				})
			}
		];

		expect(sortCourseHits(hits, 'zh-cn').map((hit) => hit.course.id)).toEqual(['c1', 'c2']);
	});

	it('sortCourseHits collates same-period names using the active locale', () => {
		const hits: CourseQueryHit[] = ['张', '李'].map((name) => ({
			timetableId: 't1',
			timetableName: 'A',
			course: createCourse({ id: name, name, dayOfWeek: 1, startPeriod: 1, endPeriod: 1 })
		}));

		expect(sortCourseHits(hits, 'zh-cn').map((hit) => hit.course.name)).toEqual(['李', '张']);
		expect(sortCourseHits(hits, 'en').map((hit) => hit.course.name)).toEqual(['张', '李']);
	});

	it('resolveCourseTimeStatus marks preparing courses within reminder window', () => {
		const preparing = createCourse({
			id: 'prep',
			name: 'Preparing',
			dayOfWeek: 1,
			startPeriod: 3,
			endPeriod: 3
		});

		const nowMinutes = 9 * 60 + 30;
		expect(resolveCourseTimeStatus(preparing, periodTimes, nowMinutes, 2, 30)).toBe('preparing');
		expect(resolveCourseTimeStatus(preparing, periodTimes, nowMinutes, 2, 29)).toBe('upcoming');
		expect(resolveCourseTimeStatus(preparing, periodTimes, nowMinutes, 2, 0)).toBe('upcoming');
	});

	it('resolveMinutesUntilCourseStart returns minutes before class starts', () => {
		const course = createCourse({
			id: 'c1',
			name: 'Math',
			dayOfWeek: 1,
			startPeriod: 3,
			endPeriod: 3
		});

		expect(resolveMinutesUntilCourseStart(course, periodTimes, 9 * 60 + 30)).toBe(30);
		expect(resolveMinutesUntilCourseStart(course, periodTimes, 10 * 60)).toBeNull();
	});

	it('resolveCourseTimeStatus marks current, past, and upcoming courses', () => {
		const upcoming = createCourse({
			id: 'u',
			name: 'Upcoming',
			dayOfWeek: 1,
			startPeriod: 3,
			endPeriod: 3
		});
		const current = createCourse({
			id: 'c',
			name: 'Current',
			dayOfWeek: 1,
			startPeriod: 2,
			endPeriod: 2
		});
		const past = createCourse({
			id: 'p',
			name: 'Past',
			dayOfWeek: 1,
			startPeriod: 1,
			endPeriod: 1
		});

		const nowMinutes = 9 * 60;
		expect(resolveCourseTimeStatus(upcoming, periodTimes, nowMinutes, 2)).toBe('upcoming');
		expect(resolveCourseTimeStatus(current, periodTimes, nowMinutes, 2)).toBe('current');
		expect(resolveCourseTimeStatus(past, periodTimes, nowMinutes, 2)).toBe('past');
	});

	it('attachCourseStatuses returns sorted entries with status', () => {
		const hits: CourseQueryHit[] = [
			{
				timetableId: 't1',
				timetableName: 'A',
				course: createCourse({
					id: 'c2',
					name: 'Later',
					dayOfWeek: 1,
					startPeriod: 3,
					endPeriod: 3
				})
			},
			{
				timetableId: 't1',
				timetableName: 'A',
				course: createCourse({
					id: 'c1',
					name: 'Earlier',
					dayOfWeek: 1,
					startPeriod: 1,
					endPeriod: 1
				})
			}
		];

		const entries = attachCourseStatuses(
			hits.map((hit) => ({ ...hit, periodTimes })),
			9 * 60 + 30,
			30,
			'zh-cn'
		);
		expect(entries.map((entry) => entry.hit.course.id)).toEqual(['c1', 'c2']);
		expect(entries[0]?.status).toBe('past');
		expect(entries[1]?.status).toBe('preparing');
		expect(entries[1]?.minutesUntilStart).toBe(30);
	});

	it('queryTodayCourses projects the active timetable without reading raw storage', async () => {
		const timetable = createTimetable({
			id: 't1',
			name: 'Main',
			academicConfig: {
				termStartDate: '2026-03-02',
				startWeek: 1,
				endWeek: 20,
				periodTimes: [{ index: 1, startTime: '08:00', endTime: '08:45' }]
			},
			courses: [
				createCourse({
					id: 'today',
					name: 'Today course',
					dayOfWeek: 1,
					startPeriod: 1,
					endPeriod: 1,
					weeks: [1]
				})
			]
		});

		const storage = {} as IStorageService;

		const hits = await queryTodayCourses(storage, {
			todayIso: '2026-03-02',
			scope: 'active',
			timetable
		});

		expect(hits.map(({ course }) => course.id)).toEqual(['today']);
	});

	it('queryTodayCourses uses each timetable semester and period configuration in all scope', async () => {
		const make = (id: string, termStartDate: string, weeks: number[]) =>
			createTimetable({
				id,
				name: id,
				academicConfig: {
					termStartDate,
					startWeek: 1,
					endWeek: 20,
					periodTimes: [{ index: 1, startTime: '08:00', endTime: '08:45' }]
				},
				courses: [createCourse({ id, name: id, dayOfWeek: 1, startPeriod: 1, endPeriod: 1, weeks })]
			});
		const entries = [
			make('t1', '2026-03-02', [1]),
			make('t2', '2026-02-23', [2]),
			make('future', '2026-09-01', [1])
		];
		const storage = {
			listTimetables: async () => entries,
			getTimetable: async (id: string) => entries.find((entry) => entry.id === id) ?? null
		} as unknown as IStorageService;
		const hits = await queryTodayCourses(storage, {
			todayIso: '2026-03-02',
			scope: 'all',
			timetable: entries[0]!
		});
		expect(hits.map((hit) => hit.timetableId)).toEqual(['t1', 't2']);
	});

	it('queryTodayCourses returns empty array without timetable', async () => {
		const storage = {} as IStorageService;

		const hits = await queryTodayCourses(storage, {
			todayIso: '2026-03-02',
			scope: 'active',
			timetable: null
		});

		expect(hits).toEqual([]);
	});
});
