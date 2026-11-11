import type { Course, CourseQueryFilter, CourseQueryHit, Timetable } from '@chronos/core';
import { countDistinctCourseNames, matchesCourseQuery } from '@chronos/core';
import type { ChronosDB } from '#lib/storage/db.ts';
import {
	courseFromRow,
	courseToRow,
	timetableFromRow,
	timetableToRow
} from '#lib/storage/mappers.ts';

function groupCoursesByTimetable(
	courseRows: Array<{ timetableId: string } & Parameters<typeof courseFromRow>[0]>
): Map<string, Course[]> {
	const coursesByTimetable = new Map<string, Course[]>();
	for (const row of courseRows) {
		const course = courseFromRow(row);
		const bucket = coursesByTimetable.get(row.timetableId);
		if (bucket) {
			bucket.push(course);
		} else {
			coursesByTimetable.set(row.timetableId, [course]);
		}
	}
	return coursesByTimetable;
}

/** Dexie-backed timetable and course persistence. */
export class TimetableRepository {
	constructor(private database: ChronosDB) {}

	async getTimetable(id: string): Promise<Timetable | null> {
		const row = await this.database.timetables.get(id);
		if (!row) return null;
		const courses = await this.database.courses.where('timetableId').equals(id).toArray();
		return timetableFromRow(row, courses);
	}

	async listTimetables(): Promise<
		Array<{ id: string; name: string; courseCount: number; updatedAt: number }>
	> {
		const [rows, courseRows] = await Promise.all([
			this.database.timetables.orderBy('updatedAt').reverse().toArray(),
			this.database.courses.toArray()
		]);
		const coursesByTimetable = groupCoursesByTimetable(courseRows);
		return rows.map((r) => ({
			id: r.id,
			name: r.name,
			courseCount: countDistinctCourseNames(coursesByTimetable.get(r.id) ?? []),
			updatedAt: r.updatedAt
		}));
	}

	async queryCourses(filter: CourseQueryFilter = {}): Promise<CourseQueryHit[]> {
		const timetableRows = await this.database.timetables.toArray();
		const timetableNameById = new Map(timetableRows.map((row) => [row.id, row.name]));
		const allowedTimetableIds =
			filter.timetableIds !== undefined
				? new Set(filter.timetableIds)
				: new Set(timetableRows.map((row) => row.id));

		let courseRows;
		const ids = filter.timetableIds;
		if (ids?.length === 1) {
			courseRows = await this.database.courses.where('timetableId').equals(ids[0]!).toArray();
		} else if (ids && ids.length > 1) {
			courseRows = await this.database.courses.where('timetableId').anyOf(ids).toArray();
		} else {
			courseRows = await this.database.courses.toArray();
		}

		const hits: CourseQueryHit[] = [];
		for (const row of courseRows) {
			if (!allowedTimetableIds.has(row.timetableId)) continue;
			const course = courseFromRow(row);
			if (!matchesCourseQuery(course, filter)) continue;
			hits.push({
				timetableId: row.timetableId,
				timetableName: timetableNameById.get(row.timetableId) ?? '',
				course
			});
		}
		return hits;
	}

	async saveTimetable(
		timetable: Timetable,
		options?: { requireExisting?: boolean }
	): Promise<void> {
		await this.database.transaction('rw', this.database.timetables, this.database.courses, () =>
			this.writeTimetable(timetable, options)
		);
	}

	private async writeTimetable(
		timetable: Timetable,
		options?: { requireExisting?: boolean }
	): Promise<void> {
		const row = timetableToRow(timetable);
		const courseRows = timetable.courses.map((course) => courseToRow(course, timetable.id));
		if (options?.requireExisting && !(await this.database.timetables.get(timetable.id))) {
			throw new Error(`Timetable not found: ${timetable.id}`);
		}
		await this.database.timetables.put(row);
		const persistedIds = new Set(
			await this.database.courses.where('timetableId').equals(timetable.id).primaryKeys()
		);
		const incomingIds = new Set(courseRows.map((course) => course.id));
		const removedIds = [...persistedIds].filter((id) => !incomingIds.has(String(id)));
		if (removedIds.length > 0) await this.database.courses.bulkDelete(removedIds);
		if (courseRows.length > 0) await this.database.courses.bulkPut(courseRows);
	}

	async mutateTimetable(id: string, change: (current: Timetable) => Timetable): Promise<Timetable> {
		return this.database.transaction(
			'rw',
			this.database.timetables,
			this.database.courses,
			async () => {
				const current = await this.getTimetable(id);
				if (!current) throw new Error(`Timetable not found: ${id}`);
				const updated = change(current);
				if (updated.id !== id) throw new Error('Timetable mutation cannot change its identity');
				await this.writeTimetable(updated, { requireExisting: true });
				return updated;
			}
		);
	}

	async deleteTimetable(id: string): Promise<void> {
		await this.database.transaction(
			'rw',
			this.database.timetables,
			this.database.courses,
			async () => {
				await this.database.courses.where('timetableId').equals(id).delete();
				await this.database.timetables.delete(id);
			}
		);
	}

	async clearTimetables(): Promise<void> {
		await this.database.transaction(
			'rw',
			this.database.timetables,
			this.database.courses,
			async () => {
				await this.database.timetables.clear();
				await this.database.courses.clear();
			}
		);
	}

	async estimateBytes(): Promise<number> {
		const [timetables, courses] = await Promise.all([
			this.database.timetables.toArray(),
			this.database.courses.toArray()
		]);

		const encoder = new TextEncoder();
		let total = 0;
		for (const row of timetables) {
			total += encoder.encode(JSON.stringify(row)).length;
		}
		for (const row of courses) {
			total += encoder.encode(JSON.stringify(row)).length;
		}
		return total;
	}
}
