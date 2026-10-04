import { afterEach, describe, expect, it, vi } from 'vite-plus/test';
import {
	ChronosEngine,
	DEFAULT_USER_PREFERENCES,
	createTimetable,
	COURSE_PALETTE_ENTRIES,
	type ChronosEvents,
	type TodayWidgetSnapshot
} from '@chronos/core';
import { createTodayWidgetSyncService } from './today-widget-sync';
import type { HostPlatformAdapter } from './host-platform';

function makeEngine() {
	const handlers = new Map<keyof ChronosEvents, Array<(payload: never) => void>>();
	const timetable = createTimetable({
		id: 'active',
		name: 'Main',
		academicConfig: {
			termStartDate: '2026-03-02',
			startWeek: 1,
			endWeek: 20,
			periodTimes: [{ index: 1, startTime: '08:00', endTime: '08:45' }]
		},
		courses: [
			{
				id: 'course',
				name: 'Course',
				teacher: '',
				location: 'R1',
				dayOfWeek: 1,
				startPeriod: 1,
				endPeriod: 1,
				weeks: []
			}
		]
	});
	const engine = {
		state: { currentTimetable: timetable, userPreferences: { ...DEFAULT_USER_PREFERENCES } },
		coursePresentation: {
			resolveCoursePaintsForTimetable: vi
				.fn()
				.mockResolvedValue(new Map([['Course', COURSE_PALETTE_ENTRIES[2]!]]))
		},
		events: {
			on: vi.fn((event: keyof ChronosEvents, handler: (payload: never) => void) => {
				const listeners = handlers.get(event) ?? [];
				listeners.push(handler);
				handlers.set(event, listeners);
				return {
					dispose: () =>
						handlers.set(
							event,
							listeners.filter((listener) => listener !== handler)
						)
				};
			})
		}
	} as unknown as ChronosEngine;
	return {
		engine,
		timetable,
		emit(event: keyof ChronosEvents, payload: never) {
			for (const handler of handlers.get(event) ?? []) handler(payload);
		},
		handlerCount(event: keyof ChronosEvents) {
			return handlers.get(event)?.length ?? 0;
		}
	};
}

describe('today widget sync service', () => {
	afterEach(() => vi.restoreAllMocks());

	it('publishes a colored 14-day snapshot on startup and timetable changes', async () => {
		const fake = makeEngine();
		let today = '2026-03-02';
		const updateTodayWidgetSnapshot = vi.fn().mockResolvedValue(undefined);
		const service = createTodayWidgetSyncService(
			fake.engine,
			{ updateTodayWidgetSnapshot } as unknown as HostPlatformAdapter,
			{ todayIso: () => today, now: () => 42 }
		);

		service.start();
		await vi.waitFor(() => expect(updateTodayWidgetSnapshot).toHaveBeenCalledTimes(1));
		const initial = updateTodayWidgetSnapshot.mock.calls[0]?.[0] as TodayWidgetSnapshot;
		expect(initial.days['2026-03-02']?.courses[0]?.colorHex).toBe(
			COURSE_PALETTE_ENTRIES[2]?.background
		);
		expect(initial.validUntilIso).toBe('2026-03-15');
		expect(initial.prepareReminderMinutes).toBe(30);

		fake.timetable.academicConfig.holidayCalendar = {
			holidays: [{ date: today, label: '休息日' }]
		};
		fake.emit('timetable:updated', { timetable: fake.timetable } as never);
		await vi.waitFor(() => expect(updateTodayWidgetSnapshot).toHaveBeenCalledTimes(2));
		expect(updateTodayWidgetSnapshot.mock.calls[1]?.[0].days[today].courses).toEqual([]);

		today = '2026-03-03';
		fake.emit('time:tick', { todayIso: '2026-03-03' } as never);
		await vi.waitFor(() => expect(updateTodayWidgetSnapshot).toHaveBeenCalledTimes(3));
		expect(updateTodayWidgetSnapshot.mock.calls[2]?.[0].validFromIso).toBe('2026-03-03');

		service.dispose();
		expect(fake.handlerCount('timetable:updated')).toBe(0);
	});

	it('syncs changed preparation preferences even without an active timetable', async () => {
		const fake = makeEngine();
		const updateTodayWidgetSnapshot = vi.fn().mockResolvedValue(undefined);
		const service = createTodayWidgetSyncService(
			fake.engine,
			{ updateTodayWidgetSnapshot },
			{
				todayIso: () => '2026-03-02'
			}
		);
		service.start();
		await vi.waitFor(() => expect(updateTodayWidgetSnapshot).toHaveBeenCalledTimes(1));
		Object.assign(fake.engine.state.userPreferences, { prepareReminderMinutes: 5 });
		fake.emit('preferences:updated', { preferences: fake.engine.state.userPreferences } as never);
		await vi.waitFor(() => expect(updateTodayWidgetSnapshot).toHaveBeenCalledTimes(2));
		expect(updateTodayWidgetSnapshot.mock.calls[1]?.[0].prepareReminderMinutes).toBe(5);
		Object.assign(fake.engine.state, { currentTimetable: null });
		Object.assign(fake.engine.state.userPreferences, { prepareReminderMinutes: 60 });
		fake.emit('preferences:updated', { preferences: fake.engine.state.userPreferences } as never);
		await vi.waitFor(() => expect(updateTodayWidgetSnapshot).toHaveBeenCalledTimes(3));
		expect(updateTodayWidgetSnapshot.mock.calls[2]?.[0]).toMatchObject({
			activeTimetable: null,
			prepareReminderMinutes: 60
		});
		service.dispose();
	});

	it('keeps platform failures from rejecting event handlers or preventing later syncs', async () => {
		const fake = makeEngine();
		const updateTodayWidgetSnapshot = vi
			.fn()
			.mockRejectedValueOnce(new Error('bridge failed'))
			.mockResolvedValue(undefined);
		const error = vi.spyOn(console, 'error').mockImplementation(() => {});
		const service = createTodayWidgetSyncService(
			fake.engine,
			{ updateTodayWidgetSnapshot } as unknown as HostPlatformAdapter,
			{ todayIso: () => '2026-03-02', now: () => 42 }
		);

		service.start();
		await vi.waitFor(() => expect(error).toHaveBeenCalled());
		fake.emit('timetable:updated', { timetable: fake.timetable } as never);
		await vi.waitFor(() => expect(updateTodayWidgetSnapshot).toHaveBeenCalledTimes(2));
		service.dispose();
	});

	it('does not call a missing widget capability', async () => {
		const fake = makeEngine();
		const service = createTodayWidgetSyncService(fake.engine, {} as HostPlatformAdapter, {
			todayIso: () => '2026-03-02'
		});
		service.start();
		await service.sync();
		service.dispose();
		expect(fake.handlerCount('timetable:updated')).toBe(0);
	});
});
