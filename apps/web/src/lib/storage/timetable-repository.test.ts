import { describe, expect, it, vi } from 'vite-plus/test';
import { ChronosEngine, createCourse, createTimetable } from '@chronos/core';
import { createMockEnv } from '@chronos/core/test-utils';
import type { ChronosDB, CourseRow, TimetableRow } from '#lib/storage/db.ts';
import { TimetableRepository } from './timetable-repository';

function createMockDb(): ChronosDB {
	const timetablesMap = new Map<string, TimetableRow>();
	const coursesMap = new Map<string, CourseRow>();
	let transactions: Promise<unknown> = Promise.resolve();

	return {
		timetables: {
			get: vi.fn(async (id: string) => timetablesMap.get(id) ?? undefined),
			put: vi.fn(async (row: TimetableRow) => {
				timetablesMap.set(row.id, row);
				return row.id;
			}),
			delete: vi.fn(async (id: string) => {
				timetablesMap.delete(id);
			}),
			orderBy: vi.fn(() => ({
				reverse: () => ({
					toArray: async () =>
						Array.from(timetablesMap.values()).sort((a, b) => b.updatedAt - a.updatedAt)
				})
			})),
			toArray: async () => Array.from(timetablesMap.values()),
			clear: vi.fn(async () => timetablesMap.clear())
		},
		courses: {
			where: vi.fn(() => ({
				equals: (val: unknown) => ({
					toArray: async () => Array.from(coursesMap.values()).filter((c) => c.timetableId === val),
					primaryKeys: async () =>
						Array.from(coursesMap.values())
							.filter((c) => c.timetableId === val)
							.map((c) => c.id),
					delete: vi.fn(async () => {})
				}),
				anyOf: vi.fn(() => ({ toArray: async () => [] }))
			})),
			toArray: async () => Array.from(coursesMap.values()),
			bulkPut: vi.fn(async (rows: CourseRow[]) => {
				for (const row of rows) coursesMap.set(row.id, row);
			}),
			bulkDelete: vi.fn(async (ids: string[]) => {
				for (const id of ids) coursesMap.delete(id);
			}),
			clear: vi.fn(async () => coursesMap.clear())
		},
		transaction: vi.fn((_mode: string, ...args: unknown[]) => {
			const fn = args[args.length - 1] as () => Promise<void>;
			const transaction = transactions.catch(() => {}).then(fn);
			transactions = transaction;
			return transaction;
		})
	} as unknown as ChronosDB;
}

describe('TimetableRepository', () => {
	it('merges simultaneous changes from separate repositories inside their write transactions', async () => {
		const database = createMockDb();
		const repositories = [new TimetableRepository(database), new TimetableRepository(database)];
		await repositories[0].saveTimetable(createTimetable({ id: 'a', name: 'A' }));
		await Promise.all(
			repositories.map((repository, index) =>
				repository.mutateTimetable('a', (current) => ({
					...current,
					courses: [
						...current.courses,
						createCourse({
							id: `course-${index}`,
							name: 'Math',
							dayOfWeek: 1,
							startPeriod: 1,
							endPeriod: 1
						})
					]
				}))
			)
		);
		expect((await repositories[0].getTimetable('a'))?.courses.map((course) => course.id)).toEqual([
			'course-0',
			'course-1'
		]);
	});

	it('checks overwrite existence inside the write transaction', async () => {
		const database = createMockDb();
		const repo = new TimetableRepository(database);
		const original = createTimetable({ id: 'a', name: 'Original' });
		await repo.saveTimetable(original);
		vi.spyOn(database, 'transaction').mockImplementationOnce((async (
			_mode: string,
			...args: unknown[]
		) => {
			await database.timetables.delete('a');
			return (args.at(-1) as () => Promise<void>)();
		}) as typeof database.transaction);
		await expect(
			repo.saveTimetable({ ...original, name: 'Replacement' }, { requireExisting: true })
		).rejects.toThrow('Timetable not found: a');
		expect(await repo.getTimetable('a')).toBeNull();
	});
	it('keeps other timetables and courses intact during new and overwrite imports', async () => {
		const repo = new TimetableRepository(createMockDb());
		const { env } = createMockEnv();
		env.storage.saveTimetable = (timetable, options) => repo.saveTimetable(timetable, options);
		env.storage.getTimetable = (id) => repo.getTimetable(id);
		env.storage.listTimetables = () => repo.listTimetables();
		const engine = new ChronosEngine({ env });
		await engine.init();
		const preview = createTimetable({
			id: 'share-import',
			name: '课表 A',
			importMetadata: { source: 'share-link' },
			courses: [1, 2].map((index) =>
				createCourse({
					id: `share-course-${index}`,
					name: `课程 A${index}`,
					dayOfWeek: 1,
					startPeriod: index,
					endPeriod: index,
					weeks: [1]
				})
			)
		});
		const first = await engine.importTimetable(preview, { overwriteActive: false });
		const second = await engine.importTimetable(
			{
				...preview,
				name: '课表 B',
				courses: [{ ...preview.courses[0]!, name: '课程 B' }]
			},
			{ overwriteActive: false }
		);
		expect(await repo.listTimetables()).toHaveLength(2);
		expect(await repo.getTimetable(first.id)).toEqual(first);
		expect(await repo.getTimetable(second.id)).toEqual(second);
		await engine.switchTimetable(first.id);
		const replacement = await engine.importTimetable(
			{
				...preview,
				name: '课表 C',
				courses: [{ ...preview.courses[0]!, name: '课程 C' }]
			},
			{ overwriteActive: true }
		);
		expect(replacement.id).toBe(first.id);
		expect(await repo.listTimetables()).toHaveLength(2);
		expect(await repo.getTimetable(second.id)).toEqual(second);
		expect((await repo.getTimetable(first.id))?.courses.map((c) => c.name)).toEqual(['课程 C']);
		expect(engine.state.currentTimetable?.name).toBe('课表 C');
		engine.dispose();
	});

	it('propagates getTimetable read failures', async () => {
		const database = createMockDb();
		const error = new Error('idb unavailable');
		vi.spyOn(database.timetables, 'get').mockRejectedValueOnce(error);
		const repo = new TimetableRepository(database);

		await expect(repo.getTimetable('missing')).rejects.toBe(error);
	});

	it('propagates listTimetables read failures', async () => {
		const database = createMockDb();
		const error = new Error('idb unavailable');
		vi.spyOn(database.timetables, 'orderBy').mockImplementationOnce(() => {
			throw error;
		});
		const repo = new TimetableRepository(database);

		await expect(repo.listTimetables()).rejects.toBe(error);
	});

	it('keeps missing records and empty searches distinct from read failures', async () => {
		const repo = new TimetableRepository(createMockDb());
		await expect(repo.getTimetable('missing')).resolves.toBeNull();
		await expect(repo.listTimetables()).resolves.toEqual([]);
		await expect(repo.queryCourses()).resolves.toEqual([]);
		await expect(repo.estimateBytes()).resolves.toBe(0);
	});

	it('propagates invalid persisted timetable configuration', async () => {
		const database = createMockDb();
		const repo = new TimetableRepository(database);
		await repo.saveTimetable(createTimetable({ id: 'invalid', name: 'Invalid' }));
		const row = (await database.timetables.get('invalid'))!;
		await database.timetables.put({ ...row, configJson: '{broken' });

		await expect(repo.getTimetable('invalid')).rejects.toBeInstanceOf(SyntaxError);
	});

	it.each(['getTimetable', 'listTimetables', 'queryCourses'] as const)(
		'propagates malformed course weeks from %s',
		async (method) => {
			const database = createMockDb();
			const repo = new TimetableRepository(database);
			await repo.saveTimetable(
				createTimetable({
					id: 'invalid',
					name: 'Invalid',
					courses: [
						createCourse({ id: 'course', name: 'Math', dayOfWeek: 1, startPeriod: 1, endPeriod: 1 })
					]
				})
			);
			const [course] = await database.courses.toArray();
			await database.courses.bulkPut([{ ...course!, weeksCsv: '1,2junk' }]);

			const reading = method === 'getTimetable' ? repo.getTimetable('invalid') : repo[method]();
			await expect(reading).rejects.toThrow('Invalid stored course weeks');
		}
	);

	it.each(['queryCourses', 'estimateBytes'] as const)(
		'propagates %s read failures',
		async (method) => {
			const database = createMockDb();
			const error = new Error('idb unavailable');
			vi.spyOn(database.timetables, 'toArray').mockRejectedValueOnce(error);
			const repo = new TimetableRepository(database);

			await expect(repo[method]()).rejects.toBe(error);
		}
	);

	it('propagates saveTimetable write failures', async () => {
		const database = createMockDb();
		vi.spyOn(database, 'transaction').mockRejectedValueOnce(new Error('write failed'));
		const repo = new TimetableRepository(database);
		const timetable = createTimetable({
			id: 'tt-1',
			name: 'Main',
			courses: [
				createCourse({ id: 'c-1', name: 'Math', dayOfWeek: 1, startPeriod: 1, endPeriod: 1 })
			]
		});

		await expect(repo.saveTimetable(timetable)).rejects.toThrow('write failed');
	});
});
