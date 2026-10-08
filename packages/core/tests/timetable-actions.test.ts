import { describe, expect, it, vi } from 'vite-plus/test';
import { ChronosEngine, createTimetable, type Timetable } from '../src/index';
import { createMockEnv } from '../src/test-utils';

async function harness() {
	const { env, timetables } = createMockEnv();
	const a = createTimetable({ id: 'a', name: 'A', updatedAt: 1 });
	const b = createTimetable({ id: 'b', name: 'B', updatedAt: 1 });
	timetables.set(a.id, a);
	timetables.set(b.id, b);
	const engine = new ChronosEngine({ env });
	await engine.init();
	await engine.switchTimetable(a.id);
	return { engine, env, timetables, a, b };
}

describe('overwrite import', () => {
	it('does not recreate a target deleted by another tab', async () => {
		const { engine, timetables } = await harness();
		try {
			timetables.delete('a');
			await expect(
				engine.importTimetable(createTimetable({ id: 'preview', name: 'Imported' }), {
					overwriteActive: true
				})
			).rejects.toThrow('Timetable not found: a');
			expect(timetables.has('a')).toBe(false);
			expect(timetables.get('b')?.name).toBe('B');
		} finally {
			engine.dispose();
		}
	});
	it('uses the engine selection when another tab changed the stored active id', async () => {
		const { engine, env, timetables } = await harness();
		try {
			await env.storage.setActiveTimetableId('b');
			await engine.importTimetable(createTimetable({ id: 'preview', name: 'Imported' }), {
				overwriteActive: true
			});
			expect(timetables.get('a')?.name).toBe('Imported');
			expect(timetables.get('b')?.name).toBe('B');
		} finally {
			engine.dispose();
		}
	});
});

describe('updateTimetableDetails', () => {
	it('updates an inactive timetable and refreshes its summary without changing selection', async () => {
		const { engine, timetables } = await harness();
		const list = vi.fn();
		const active = vi.fn();
		engine.on('timetables:updated', list);
		engine.on('timetable:updated', active);
		try {
			await engine.actions.updateTimetableDetails('b', {
				name: 'Updated B',
				academicConfig: { holidayCalendar: { holidays: [{ date: '2026-10-01', label: '国庆' }] } }
			});
			expect(timetables.get('b')?.name).toBe('Updated B');
			expect(timetables.get('b')?.updatedAt).toBeGreaterThan(1);
			expect(engine.state.currentTimetable?.id).toBe('a');
			expect(list).toHaveBeenLastCalledWith({
				timetables: expect.arrayContaining([
					expect.objectContaining({ id: 'b', name: 'Updated B' })
				])
			});
			expect(active).not.toHaveBeenCalled();
		} finally {
			engine.dispose();
		}
	});
	it('merges academic and view configuration and publishes the active timetable', async () => {
		const { engine, a } = await harness();
		const update = vi.fn();
		engine.on('timetable:updated', update);
		try {
			await engine.updateTimetableDetails(a.id, {
				academicConfig: { startWeek: 2 },
				viewPrefs: { showSunday: false }
			});
			expect(engine.state.currentTimetable?.academicConfig).toEqual({
				...a.academicConfig,
				startWeek: 2
			});
			expect(engine.state.currentTimetable?.viewPrefs).toEqual({
				...a.viewPrefs,
				showSunday: false
			});
			expect(update).toHaveBeenLastCalledWith({ timetable: engine.state.currentTimetable });
		} finally {
			engine.dispose();
		}
	});
	it('rejects missing targets and failed writes without changing state', async () => {
		const { engine, env, a } = await harness();
		try {
			await expect(engine.updateTimetableDetails('missing', { name: 'Missing' })).rejects.toThrow(
				'Timetable not found'
			);
			vi.spyOn(env.storage, 'saveTimetable').mockRejectedValueOnce(new Error('write failed'));
			await expect(engine.updateTimetableDetails(a.id, { name: 'Lost' })).rejects.toThrow(
				'write failed'
			);
			expect(engine.state.currentTimetable?.name).toBe('A');
		} finally {
			engine.dispose();
		}
	});
	it('keeps the explicit target when selection changes while reading it', async () => {
		const { engine, env, a, b, timetables } = await harness();
		let release!: (timetable: Timetable) => void;
		vi.spyOn(env.storage, 'getTimetable').mockImplementationOnce(
			() =>
				new Promise((resolve) => {
					release = resolve;
				})
		);
		try {
			const pending = engine.updateTimetableDetails(a.id, { name: 'Updated A' });
			await engine.switchTimetable(b.id);
			release(a);
			await pending;
			expect(timetables.get(a.id)?.name).toBe('Updated A');
			expect(engine.state.currentTimetable?.id).toBe(b.id);
		} finally {
			engine.dispose();
		}
	});
});

describe('delete commit boundary', () => {
	it('clears the deleted selection and reports a committed deletion when successor persistence fails', async () => {
		const { engine, env, timetables } = await harness();
		try {
			vi.spyOn(env.storage, 'setActiveTimetableId').mockRejectedValue(new Error('write failed'));
			await expect(engine.deleteTimetable('a')).resolves.toEqual({ followUpFailed: true });
			expect(timetables.has('a')).toBe(false);
			expect(engine.state.currentTimetable).toBeNull();
			expect(engine.state.timetables.map((t) => t.id)).toEqual(['b']);
		} finally {
			engine.dispose();
		}
	});
	it('keeps the selection and list when deletion fails before commit', async () => {
		const { engine, env } = await harness();
		try {
			vi.spyOn(env.storage, 'deleteTimetable').mockRejectedValue(new Error('delete failed'));
			await expect(engine.deleteTimetable('a')).rejects.toThrow('delete failed');
			expect(engine.state.currentTimetable?.id).toBe('a');
			expect(engine.state.timetables).toHaveLength(2);
		} finally {
			engine.dispose();
		}
	});
	it('removes the last timetable even if clearing the stored selection fails', async () => {
		const { engine, env, timetables } = await harness();
		try {
			timetables.delete('b');
			vi.spyOn(env.storage, 'setActiveTimetableId').mockRejectedValue(new Error('write failed'));
			await expect(engine.deleteTimetable('a')).resolves.toEqual({ followUpFailed: true });
			expect(engine.state.currentTimetable).toBeNull();
			expect(engine.state.timetables).toEqual([]);
		} finally {
			engine.dispose();
		}
	});
});

it('keeps committed deletion state when refreshing the list fails', async () => {
	const { engine, env, timetables } = await harness();
	try {
		vi.spyOn(env.storage, 'listTimetables').mockRejectedValueOnce(new Error('read failed'));
		await expect(engine.deleteTimetable('a')).resolves.toEqual({ followUpFailed: true });
		expect(timetables.has('a')).toBe(false);
		expect(engine.state.currentTimetable).toBeNull();
		expect(engine.state.timetables.map((t) => t.id)).toEqual(['b']);
	} finally {
		engine.dispose();
	}
});

it('rejects a missing deletion target without deleting the current timetable', async () => {
	const { engine, timetables } = await harness();
	try {
		timetables.delete('b');
		await expect(engine.deleteTimetable('b')).rejects.toThrow('Timetable not found: b');
		expect(engine.state.currentTimetable?.id).toBe('a');
		expect(timetables.has('a')).toBe(true);
	} finally {
		engine.dispose();
	}
});

it('serializes overlapping selection writes and recovers after a failed selection', async () => {
	const { engine, env } = await harness();
	let release!: () => void;
	let started!: () => void;
	const reading = new Promise<void>((resolve) => {
		started = resolve;
	});
	const original = env.storage.setActiveTimetableId.bind(env.storage);
	vi.spyOn(env.storage, 'setActiveTimetableId')
		.mockImplementationOnce(async () => {
			started();
			await new Promise<void>((resolve) => {
				release = resolve;
			});
			throw new Error('write failed');
		})
		.mockImplementationOnce(original);
	try {
		const first = expect(engine.switchTimetable('b')).rejects.toThrow('write failed');
		await reading;
		const second = engine.switchTimetable('a');
		release();
		await first;
		await second;
		expect(engine.state.currentTimetable?.id).toBe('a');
		expect(await env.storage.getActiveTimetableId()).toBe('a');
	} finally {
		engine.dispose();
	}
});

it('clears the persisted deleted id before trying to save its successor', async () => {
	const { engine, env } = await harness();
	const original = env.storage.setActiveTimetableId.bind(env.storage);
	vi.spyOn(env.storage, 'setActiveTimetableId').mockImplementation(async (id) => {
		if (id) throw new Error('write failed');
		await original(id);
	});
	try {
		await expect(engine.deleteTimetable('a')).resolves.toEqual({ followUpFailed: true });
		expect(await env.storage.getActiveTimetableId()).toBeNull();
		expect(engine.state.currentTimetable).toBeNull();
	} finally {
		engine.dispose();
	}
});
