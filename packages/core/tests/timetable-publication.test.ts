import { describe, expect, it, vi } from 'vite-plus/test';
import {
	ChronosEngine,
	createCourse,
	createTimetable,
	type IStorageService,
	type Timetable
} from '../src';
import { createMockEnv } from '../src/test-utils';

type Operation = 'create' | 'import' | 'overwrite-import' | 'update' | 'transactional-update';

function deferred<T>() {
	let resolve!: (value: T) => void;
	let reject!: (reason?: unknown) => void;
	const promise = new Promise<T>((accept, decline) => {
		resolve = accept;
		reject = decline;
	});
	return { promise, resolve, reject };
}

async function harness(operation: Operation) {
	const { env, timetables } = createMockEnv();
	const storage: typeof env.storage & Pick<IStorageService, 'clearAllData'> = env.storage;
	env.storage = storage;
	storage.clearAllData = async () => {
		timetables.clear();
		await storage.setActiveTimetableId('');
	};
	if (operation.endsWith('update') || operation === 'overwrite-import') {
		await storage.saveTimetable(createTimetable({ id: 'existing', name: 'Existing' }));
		await storage.setActiveTimetableId('existing');
	}
	if (operation === 'transactional-update') {
		storage.mutateTimetable = async (id, change) => {
			const current = await storage.getTimetable(id);
			if (!current) throw new Error(`Timetable not found: ${id}`);
			const updated = change(current);
			await storage.saveTimetable(updated, { requireExisting: true });
			return updated;
		};
	}
	const engine = new ChronosEngine({ env });
	await engine.init();
	const write = () => {
		if (operation === 'create') return engine.createTimetable('Committed');
		if (operation === 'import')
			return engine.importTimetable(createTimetable({ id: 'preview', name: 'Committed' }));
		if (operation === 'overwrite-import')
			return engine.importTimetable(createTimetable({ id: 'preview', name: 'Committed' }), {
				overwriteActive: true
			});
		return engine.updateTimetableDetails('existing', { name: 'Committed' });
	};
	return { storage, timetables, engine, write };
}

describe('timetable publication after data clearing', () => {
	it.each(['create', 'import', 'update', 'transactional-update'] as const)(
		'drops a committed %s whose persistence response arrives after clearing',
		async (operation) => {
			const { storage, timetables, engine, write } = await harness(operation);
			const saved = deferred<void>();
			const response = deferred<void>();
			const save = storage.saveTimetable.bind(storage);
			vi.spyOn(storage, 'saveTimetable').mockImplementationOnce(async (...args) => {
				await save(...args);
				saved.resolve();
				await response.promise;
			});
			try {
				const writing = write();
				await saved.promise;
				expect([...timetables.values()].some((timetable) => timetable.name === 'Committed')).toBe(
					true
				);
				await engine.clearAllData();
				const list = vi
					.spyOn(storage, 'listTimetables')
					.mockRejectedValueOnce(new Error('Read failed'));
				const published = vi.fn();
				const failed = vi.fn();
				engine.on('timetables:updated', published);
				engine.on('timetable:followUpFailed', failed);
				const switched = vi.spyOn(engine, 'switchTimetable');
				const selected = vi.spyOn(storage, 'setActiveTimetableId');
				response.resolve();
				await writing;
				expect(list).not.toHaveBeenCalled();
				expect(published).not.toHaveBeenCalled();
				expect(failed).not.toHaveBeenCalled();
				expect(switched).not.toHaveBeenCalled();
				expect(selected).not.toHaveBeenCalled();
				expect(engine.state.currentTimetable).toBeNull();
				expect(engine.state.timetables).toEqual([]);
				expect(timetables.size).toBe(0);
			} finally {
				response.resolve();
				engine.dispose();
			}
		}
	);

	it.each([
		['create', 'success'],
		['create', 'failure'],
		['import', 'success'],
		['import', 'failure'],
		['update', 'success'],
		['update', 'failure'],
		['transactional-update', 'success'],
		['transactional-update', 'failure']
	] as const)(
		'drops the %s follow-up when clearing overtakes its %s refresh',
		async (operation, outcome) => {
			const { storage, engine, write } = await harness(operation);
			const started = deferred<void>();
			const refreshed = deferred<Awaited<ReturnType<typeof storage.listTimetables>>>();
			const list = storage.listTimetables.bind(storage);
			let snapshot: Awaited<ReturnType<typeof list>> = [];
			vi.spyOn(storage, 'listTimetables').mockImplementationOnce(async () => {
				snapshot = await list();
				started.resolve();
				return refreshed.promise;
			});
			try {
				const writing = write();
				await started.promise;
				await engine.clearAllData();
				const selected = vi.spyOn(storage, 'setActiveTimetableId');
				const reading = vi.spyOn(storage, 'getTimetable');
				const published = vi.fn();
				const failed = vi.fn();
				engine.on('timetables:updated', published);
				engine.on('timetable:followUpFailed', failed);
				if (outcome === 'success') refreshed.resolve(snapshot);
				else refreshed.reject(new Error('Refresh failed'));
				await writing;
				expect(reading).not.toHaveBeenCalled();
				expect(selected).not.toHaveBeenCalled();
				expect(published).not.toHaveBeenCalled();
				expect(failed).not.toHaveBeenCalled();
				expect(engine.state.currentTimetable).toBeNull();
				expect(engine.state.timetables).toEqual([]);
			} finally {
				refreshed.resolve(snapshot);
				engine.dispose();
			}
		}
	);

	it('invalidates a creation that starts during clearing before its response arrives', async () => {
		const { storage, engine, write } = await harness('create');
		const clearingStarted = deferred<void>();
		const finishClearing = deferred<void>();
		const clear = storage.clearAllData!.bind(storage);
		vi.spyOn(storage, 'clearAllData').mockImplementationOnce(async () => {
			clearingStarted.resolve();
			await finishClearing.promise;
			await clear();
		});
		const saved = deferred<void>();
		const response = deferred<void>();
		const save = storage.saveTimetable.bind(storage);
		vi.spyOn(storage, 'saveTimetable').mockImplementationOnce(async (timetable: Timetable) => {
			await save(timetable);
			saved.resolve();
			await response.promise;
		});
		try {
			const clearing = engine.clearAllData();
			await clearingStarted.promise;
			const writing = write();
			await saved.promise;
			finishClearing.resolve();
			await clearing;
			const published = vi.fn();
			engine.on('timetables:updated', published);
			response.resolve();
			await writing;
			expect(published).not.toHaveBeenCalled();
			expect(engine.state.timetables).toEqual([]);
			expect(engine.state.currentTimetable).toBeNull();
		} finally {
			response.resolve();
			finishClearing.resolve();
			engine.dispose();
		}
	});
});

describe('timetable publication after deletion', () => {
	it.each(['update', 'transactional-update', 'overwrite-import'] as const)(
		'drops a committed %s whose persistence response arrives after deletion',
		async (operation) => {
			const { storage, timetables, engine, write } = await harness(operation);
			const saved = deferred<void>();
			const response = deferred<void>();
			const save = storage.saveTimetable.bind(storage);
			vi.spyOn(storage, 'saveTimetable').mockImplementationOnce(async (...args) => {
				await save(...args);
				saved.resolve();
				await response.promise;
			});
			try {
				const writing = write();
				await saved.promise;
				await engine.deleteTimetable('existing');
				const list = vi
					.spyOn(storage, 'listTimetables')
					.mockRejectedValueOnce(new Error('Read failed'));
				const published = vi.fn();
				const failed = vi.fn();
				engine.on('timetables:updated', published);
				engine.on('timetable:followUpFailed', failed);
				const selected = vi.spyOn(storage, 'setActiveTimetableId');
				response.resolve();
				await writing;
				expect(list).not.toHaveBeenCalled();
				expect(published).not.toHaveBeenCalled();
				expect(failed).not.toHaveBeenCalled();
				expect(selected).not.toHaveBeenCalled();
				expect(engine.state.currentTimetable).toBeNull();
				expect(engine.state.timetables).toEqual([]);
				expect(timetables.has('existing')).toBe(false);
			} finally {
				response.resolve();
				engine.dispose();
			}
		}
	);

	it.each(['success', 'failure'] as const)(
		'drops an overwrite import follow-up when deletion overtakes its %s refresh',
		async (outcome) => {
			const { storage, engine, write } = await harness('overwrite-import');
			const started = deferred<void>();
			const refreshed = deferred<Awaited<ReturnType<typeof storage.listTimetables>>>();
			const list = storage.listTimetables.bind(storage);
			let snapshot: Awaited<ReturnType<typeof list>> = [];
			vi.spyOn(storage, 'listTimetables').mockImplementationOnce(async () => {
				snapshot = await list();
				started.resolve();
				return refreshed.promise;
			});
			try {
				const writing = write();
				await started.promise;
				await engine.deleteTimetable('existing');
				const selected = vi.spyOn(storage, 'setActiveTimetableId');
				const reading = vi.spyOn(storage, 'getTimetable');
				const published = vi.fn();
				const failed = vi.fn();
				engine.on('timetables:updated', published);
				engine.on('timetable:followUpFailed', failed);
				if (outcome === 'success') refreshed.resolve(snapshot);
				else refreshed.reject(new Error('Refresh failed'));
				await writing;
				expect(reading).not.toHaveBeenCalled();
				expect(selected).not.toHaveBeenCalled();
				expect(published).not.toHaveBeenCalled();
				expect(failed).not.toHaveBeenCalled();
				expect(engine.state.currentTimetable).toBeNull();
				expect(engine.state.timetables).toEqual([]);
			} finally {
				refreshed.resolve(snapshot);
				engine.dispose();
			}
		}
	);

	it('keeps a deleted timetable absent when badge cleanup fails before its list refresh', async () => {
		const { storage, engine, write } = await harness('update');
		const started = deferred<void>();
		const refreshed = deferred<Awaited<ReturnType<typeof storage.listTimetables>>>();
		const list = storage.listTimetables.bind(storage);
		let snapshot: Awaited<ReturnType<typeof list>> = [];
		vi.spyOn(storage, 'listTimetables').mockImplementationOnce(async () => {
			snapshot = await list();
			started.resolve();
			return refreshed.promise;
		});
		try {
			const writing = write();
			await started.promise;
			vi.spyOn(engine.badges, 'recalculate').mockRejectedValueOnce(new Error('Badge failed'));
			expect(await engine.deleteTimetable('existing')).toMatchObject({ followUpFailed: true });
			refreshed.resolve(snapshot);
			await writing;
			expect(engine.state.currentTimetable).toBeNull();
			expect(engine.state.timetables).toEqual([]);
		} finally {
			refreshed.resolve(snapshot);
			engine.dispose();
		}
	});

	it('publishes another timetable mutation after deleting the selected timetable', async () => {
		const { storage, engine } = await harness('update');
		await storage.saveTimetable(createTimetable({ id: 'other', name: 'Other' }));
		const saved = deferred<void>();
		const response = deferred<void>();
		const save = storage.saveTimetable.bind(storage);
		vi.spyOn(storage, 'saveTimetable').mockImplementationOnce(async (...args) => {
			await save(...args);
			saved.resolve();
			await response.promise;
		});
		try {
			const writing = engine.updateTimetableDetails('other', { name: 'Committed' });
			await saved.promise;
			await engine.deleteTimetable('existing');
			const failed = vi.fn();
			engine.on('timetable:followUpFailed', failed);
			const failure = new Error('Read failed');
			vi.spyOn(storage, 'listTimetables').mockRejectedValueOnce(failure);
			response.resolve();
			await writing;
			expect(engine.state.timetables).toEqual([
				expect.objectContaining({ id: 'other', name: 'Committed' })
			]);
			expect(engine.state.currentTimetable?.name).toBe('Committed');
			expect(failed).toHaveBeenCalledWith({
				operation: 'update',
				timetableId: 'other',
				cause: failure
			});
		} finally {
			response.resolve();
			engine.dispose();
		}
	});

	it('still publishes a committed mutation when deletion fails before commit', async () => {
		const { storage, engine, write } = await harness('update');
		const saved = deferred<void>();
		const response = deferred<void>();
		const save = storage.saveTimetable.bind(storage);
		vi.spyOn(storage, 'saveTimetable').mockImplementationOnce(async (...args) => {
			await save(...args);
			saved.resolve();
			await response.promise;
		});
		try {
			const writing = write();
			await saved.promise;
			vi.spyOn(storage, 'deleteTimetable').mockRejectedValueOnce(new Error('Delete failed'));
			await expect(engine.deleteTimetable('existing')).rejects.toThrow('Delete failed');
			response.resolve();
			await writing;
			expect(engine.state.currentTimetable?.name).toBe('Committed');
			expect(engine.state.timetables).toEqual([
				expect.objectContaining({ id: 'existing', name: 'Committed' })
			]);
		} finally {
			response.resolve();
			engine.dispose();
		}
	});

	it('publishes a recreated timetable with the same id while discarding its old mutation response', async () => {
		const { storage, engine, write } = await harness('transactional-update');
		const saved = deferred<void>();
		const response = deferred<void>();
		const save = storage.saveTimetable.bind(storage);
		vi.spyOn(storage, 'saveTimetable').mockImplementationOnce(async (...args) => {
			await save(...args);
			saved.resolve();
			await response.promise;
		});
		try {
			const writing = write();
			await saved.promise;
			await engine.deleteTimetable('existing');
			await storage.saveTimetable(createTimetable({ id: 'existing', name: 'Recreated' }));
			await engine.switchTimetable('existing');
			await engine.updateTimetableDetails('existing', { name: 'Recreated and updated' });
			const published = vi.fn();
			engine.on('timetables:updated', published);
			response.resolve();
			await writing;
			expect(published).not.toHaveBeenCalled();
			expect(engine.state.currentTimetable?.name).toBe('Recreated and updated');
			expect(engine.state.timetables).toEqual([
				expect.objectContaining({ id: 'existing', name: 'Recreated and updated' })
			]);
		} finally {
			response.resolve();
			engine.dispose();
		}
	});
});

describe('timetable mutation publication order', () => {
	const course = (id: string) =>
		createCourse({ id, name: id, dayOfWeek: 1, startPeriod: 1, endPeriod: 1, weeks: [1] });

	it('uses the latest committed courses when an earlier mutation response arrives last', async () => {
		const { storage, engine } = await harness('transactional-update');
		const saved = deferred<void>();
		const response = deferred<void>();
		const save = storage.saveTimetable.bind(storage);
		vi.spyOn(storage, 'saveTimetable').mockImplementationOnce(async (...args) => {
			await save(...args);
			saved.resolve();
			await response.promise;
		});
		try {
			const first = engine.saveCourse(course('a'));
			await saved.promise;
			await engine.saveCourse(course('b'));
			const published: string[][] = [];
			engine.on('timetable:updated', ({ timetable }) => {
				published.push(timetable?.courses.map((entry) => entry.id) ?? []);
			});
			const badges = vi.spyOn(engine.badges, 'recalculate');
			response.resolve();
			await first;
			expect(engine.state.currentTimetable?.courses.map((entry) => entry.id)).toEqual(['a', 'b']);
			expect(published).toEqual([['a', 'b']]);
			expect(badges).toHaveBeenLastCalledWith([
				expect.objectContaining({ id: 'a' }),
				expect.objectContaining({ id: 'b' })
			]);
		} finally {
			response.resolve();
			engine.dispose();
		}
	});

	it('publishes a later commit even when its mutation was requested first', async () => {
		const { storage, engine } = await harness('transactional-update');
		const started = deferred<void>();
		const commit = deferred<void>();
		const mutate = storage.mutateTimetable!.bind(storage);
		vi.spyOn(storage, 'mutateTimetable').mockImplementationOnce(async (...args) => {
			started.resolve();
			await commit.promise;
			return mutate(...args);
		});
		try {
			const first = engine.saveCourse(course('a'));
			await started.promise;
			await engine.saveCourse(course('b'));
			commit.resolve();
			await first;
			expect(engine.state.currentTimetable?.courses.map((entry) => entry.id)).toEqual(['b', 'a']);
		} finally {
			commit.resolve();
			engine.dispose();
		}
	});

	it('retains a newer published snapshot when an earlier response has a failed canonical read', async () => {
		const { storage, engine } = await harness('transactional-update');
		const saved = deferred<void>();
		const response = deferred<void>();
		const save = storage.saveTimetable.bind(storage);
		vi.spyOn(storage, 'saveTimetable').mockImplementationOnce(async (...args) => {
			await save(...args);
			saved.resolve();
			await response.promise;
		});
		try {
			const first = engine.saveCourse(course('a'));
			await saved.promise;
			await engine.saveCourse(course('b'));
			const before = engine.state;
			const published = vi.fn();
			const failed = vi.fn();
			engine.on('timetable:updated', published);
			engine.on('timetable:followUpFailed', failed);
			const badges = vi.spyOn(engine.badges, 'recalculate');
			const failure = new Error('Canonical read failed');
			vi.spyOn(storage, 'getTimetable').mockRejectedValueOnce(failure);
			response.resolve();
			await expect(first).resolves.toBeUndefined();
			expect(engine.state.currentTimetable).toEqual(before.currentTimetable);
			expect(engine.state.timetables).toEqual(before.timetables);
			expect(published).not.toHaveBeenCalled();
			expect(badges).not.toHaveBeenCalled();
			expect(failed).toHaveBeenCalledWith({
				operation: 'update',
				timetableId: 'existing',
				cause: failure
			});
		} finally {
			response.resolve();
			engine.dispose();
		}
	});

	it('uses the current canonical courses for badges after a newer mutation overtakes its refresh', async () => {
		const { storage, engine } = await harness('transactional-update');
		const started = deferred<void>();
		const refreshed = deferred<Awaited<ReturnType<typeof storage.listTimetables>>>();
		const list = storage.listTimetables.bind(storage);
		let snapshot: Awaited<ReturnType<typeof list>> = [];
		vi.spyOn(storage, 'listTimetables').mockImplementationOnce(async () => {
			snapshot = await list();
			started.resolve();
			return refreshed.promise;
		});
		try {
			const first = engine.saveCourse(course('a'));
			await started.promise;
			await engine.saveCourse(course('b'));
			const badges = vi.spyOn(engine.badges, 'recalculate');
			refreshed.resolve(snapshot);
			await first;
			expect(engine.state.currentTimetable?.courses.map((entry) => entry.id)).toEqual(['a', 'b']);
			expect(badges).toHaveBeenLastCalledWith([
				expect.objectContaining({ id: 'a' }),
				expect.objectContaining({ id: 'b' })
			]);
		} finally {
			refreshed.resolve(snapshot);
			engine.dispose();
		}
	});

	it('publishes the committed snapshot and reports a failed canonical read without rejecting', async () => {
		const { storage, timetables, engine, write } = await harness('transactional-update');
		const failure = new Error('Canonical read failed');
		const save = storage.saveTimetable.bind(storage);
		vi.spyOn(storage, 'saveTimetable').mockImplementationOnce(async (...args) => {
			await save(...args);
			vi.spyOn(storage, 'getTimetable').mockRejectedValueOnce(failure);
		});
		const failed = vi.fn();
		engine.on('timetable:followUpFailed', failed);
		try {
			await expect(write()).resolves.toBeUndefined();
			expect(timetables.get('existing')?.name).toBe('Committed');
			expect(engine.state.currentTimetable?.name).toBe('Committed');
			expect(failed).toHaveBeenCalledWith({
				operation: 'update',
				timetableId: 'existing',
				cause: failure
			});
		} finally {
			engine.dispose();
		}
	});
});
