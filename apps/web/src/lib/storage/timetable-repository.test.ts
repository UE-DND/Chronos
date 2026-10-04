import { describe, expect, it, vi } from 'vite-plus/test';
import { ChronosEngine, createCourse, createTimetable } from '@chronos/core';
import { createMockEnv } from '@chronos/core/test-utils';
import type { ChronosDB, CourseRow, TimetableRow } from '$lib/storage/db';
import { TimetableRepository } from './timetable-repository';

function createMockDb(): ChronosDB {
	const timetablesMap = new Map<string, TimetableRow>();
	const coursesMap = new Map<string, CourseRow>();

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
		transaction: vi.fn(async (_mode: string, ...args: unknown[]) => {
			const fn = args[args.length - 1] as () => Promise<void>;
			return fn();
		})
	} as unknown as ChronosDB;
}

describe('TimetableRepository', () => {
	it('keeps other timetables and courses intact during new and overwrite imports', async () => {
		const repo = new TimetableRepository(createMockDb());
		const { env } = createMockEnv();
		env.storage.saveTimetable = (timetable) => repo.saveTimetable(timetable);
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

	it('returns null when getTimetable read fails', async () => {
		const database = createMockDb();
		vi.spyOn(database.timetables, 'get').mockRejectedValueOnce(new Error('idb unavailable'));
		const repo = new TimetableRepository(database);

		await expect(repo.getTimetable('missing')).resolves.toBeNull();
	});

	it('returns empty list when listTimetables read fails', async () => {
		const database = createMockDb();
		vi.spyOn(database.timetables, 'orderBy').mockImplementationOnce(() => {
			throw new Error('idb unavailable');
		});
		const repo = new TimetableRepository(database);

		await expect(repo.listTimetables()).resolves.toEqual([]);
	});

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
