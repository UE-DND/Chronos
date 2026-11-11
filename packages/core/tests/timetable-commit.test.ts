import { describe, expect, it, vi } from 'vite-plus/test';
import { ChronosEngine, createTimetable } from '../src';
import { createMockEnv } from '../src/test-utils';

describe('timetable writes after commit', () => {
	it.each(['create', 'import', 'update'] as const)(
		'reports a failed follow-up without rejecting the committed %s',
		async (operation) => {
			const { env, timetables } = createMockEnv();
			const engine = new ChronosEngine({ env });
			const existing = createTimetable({ id: 'existing', name: 'Existing' });
			timetables.set(existing.id, existing);
			await engine.init();
			const failed = vi.fn();
			engine.on('timetable:followUpFailed', failed);
			const failure = new Error('Refresh failed');
			vi.spyOn(env.storage, 'listTimetables').mockRejectedValueOnce(failure);
			try {
				if (operation === 'create') await engine.createTimetable('Committed');
				else if (operation === 'import')
					await engine.importTimetable(createTimetable({ id: 'preview', name: 'Committed' }));
				else await engine.updateTimetableDetails(existing.id, { name: 'Committed' });
				expect([...timetables.values()].some((timetable) => timetable.name === 'Committed')).toBe(
					true
				);
				expect(engine.state.timetables.some((timetable) => timetable.name === 'Committed')).toBe(
					true
				);
				expect(failed).toHaveBeenCalledWith({
					operation,
					timetableId: expect.any(String),
					cause: failure
				});
				if (operation === 'update') expect(engine.state.currentTimetable?.name).toBe('Committed');
			} finally {
				engine.dispose();
			}
		}
	);
});
