import { describe, expect, it, vi } from 'vite-plus/test';
import { ChronosEngine, createTimetable } from '@chronos/core';
import { createMockEnv } from '@chronos/core/test-utils';
import { createHolidayPlugin, HOLIDAY_PLUGIN_ID } from '../src/index';

describe('calendar cache restoration', () => {
	it('restores persisted cache offline without networking, and rejects corrupt cache', async () => {
		const request = vi.fn().mockRejectedValue(new Error('offline'));
		const { env, timetables } = createMockEnv({ http: { request } });
		const timetable = createTimetable({ id: 't1', name: 'T' });
		timetables.set(timetable.id, timetable);
		await env.storage.setPluginData(
			HOLIDAY_PLUGIN_ID,
			'calendars',
			JSON.parse(
				JSON.stringify({
					t1: {
						years: {
							2026: {
								source: 'remote',
								holidays: [{ date: '2026-03-02', label: '缓存' }],
								syncedAt: 1
							}
						}
					}
				})
			)
		);
		const first = new ChronosEngine({ env });
		await first.init();
		await first.loadPlugin(createHolidayPlugin());
		expect(first.resolveHolidays(timetable)[0]?.label).toBe('缓存');
		first.dispose();
		const second = new ChronosEngine({ env });
		await second.init();
		await second.loadPlugin(createHolidayPlugin());
		expect(second.resolveHolidays(timetable)[0]?.label).toBe('缓存');
		expect(request).not.toHaveBeenCalled();
		second.dispose();
		await env.storage.setPluginData(HOLIDAY_PLUGIN_ID, 'calendars', {
			t1: { years: { 2026: { source: 'unknown', holidays: [] } } }
		});
		const third = new ChronosEngine({ env });
		await third.init();
		await expect(third.loadPlugin(createHolidayPlugin())).rejects.toThrow('Invalid holiday year');
		expect(third.resolveHolidays(timetable)).toEqual([]);
		third.dispose();
	});
});
