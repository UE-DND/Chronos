import { describe, expect, it } from 'vite-plus/test';
import { ChronosEngine, createTimetable } from '../src/index';
import { createMockEnv } from '../src/test-utils';

describe('calendar contribution resolution', () => {
	it('merges in slot order, retains the first label and revokes replaced contributions', async () => {
		const { env } = createMockEnv();
		const engine = new ChronosEngine({ env });
		await engine.init();
		const timetable = createTimetable({ id: 't', name: 'T' });
		const revisions: number[] = [];
		engine.on('calendar:changed', ({ revision }) => {
			revisions.push(revision);
		});
		const late = engine.slots.register('calendar.holidays', {
			id: 'late',
			order: 90,
			getHolidays: () => [
				{ date: '2026-03-02', label: 'late' },
				{ date: '2026-03-03', label: 'next' }
			]
		});
		const first = engine.slots.register('calendar.holidays', {
			id: 'first',
			order: 10,
			getHolidays: () => [{ date: '2026-03-02', label: 'first' }]
		});
		expect(engine.resolveHolidays(timetable)).toEqual([
			{ date: '2026-03-02', label: 'first' },
			{ date: '2026-03-03', label: 'next' }
		]);
		const replacement = engine.slots.register('calendar.holidays', {
			id: 'first',
			order: 10,
			getHolidays: () => []
		});
		first.dispose();
		expect(engine.resolveHolidays(timetable)[0]?.label).toBe('late');
		late.dispose();
		replacement.dispose();
		expect(engine.resolveHolidays(timetable)).toEqual([]);
		expect(revisions).toEqual([1, 2, 3, 4, 5]);
		engine.dispose();
	});
	it('publishes immutable holidays and propagates provider errors', async () => {
		const { env } = createMockEnv();
		const engine = new ChronosEngine({ env });
		await engine.init();
		const timetable = createTimetable({ id: 't', name: 'T' });
		const holiday = { date: '2026-03-02', label: 'original' };
		engine.slots.register('calendar.holidays', { id: 'calendar', getHolidays: () => [holiday] });
		const holidays = engine.resolveHolidays(timetable);
		expect(Object.isFrozen(holidays)).toBe(true);
		expect(Object.isFrozen(holidays[0])).toBe(true);
		holiday.label = 'next';
		expect(holidays[0]?.label).toBe('original');
		const error = new Error('broken provider');
		engine.slots.register('calendar.holidays', {
			id: 'broken',
			getHolidays: () => {
				throw error;
			}
		});
		expect(() => engine.resolveHolidays(timetable)).toThrow(error);
		engine.dispose();
	});
});
