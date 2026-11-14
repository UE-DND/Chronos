import { describe, expect, it } from 'vite-plus/test';
import type { liveQuery } from 'dexie';
import type { ChronosDB, ImageRow } from './db';
import { ImageRepository } from './image-repository';

function database() {
	const rows = new Map<string, ImageRow>();
	let emit: (row: ImageRow | undefined) => void = () => {};
	const observe = ((querier: () => Promise<ImageRow | undefined>) => {
		void querier();
		return {
			subscribe(observer: {
				next: (row: ImageRow | undefined) => void;
				error: (error: unknown) => void;
			}) {
				emit = observer.next;
				return { unsubscribe() {} };
			}
		};
	}) as typeof liveQuery;
	const db = {
		images: {
			get: async (id: string) => rows.get(id),
			put: async (row: ImageRow) => rows.set(row.id, row),
			delete: async (id: string) => rows.delete(id),
			clear: async () => rows.clear(),
			toArray: async () => [...rows.values()]
		}
	} as unknown as ChronosDB;
	return {
		rows,
		repository: new ImageRepository(db, observe),
		emit: (row: ImageRow | undefined) => emit(row)
	};
}

describe('ImageRepository custom wallpaper', () => {
	it('publishes one read of a save and still publishes the next save', () => {
		const { repository, emit } = database();
		const seen: Array<Blob | null> = [];
		repository.watchCustom(
			(blob) => seen.push(blob),
			() => {}
		);
		const stored = new Blob(['one']);
		emit({ id: 'custom-wallpaper', blob: stored, revision: 'a' });
		emit({ id: 'custom-wallpaper', blob: new Blob(['one']), revision: 'a' });
		expect(seen).toEqual([stored]);
		const replaced = new Blob(['one']);
		emit({ id: 'custom-wallpaper', blob: replaced, revision: 'b' });
		expect(seen).toEqual([stored, replaced]);
		emit(undefined);
		expect(seen).toEqual([stored, replaced, null]);
		const legacy = new Blob(['old']);
		emit({ id: 'custom-wallpaper', blob: legacy });
		emit({ id: 'custom-wallpaper', blob: new Blob(['old']) });
		expect(seen).toEqual([stored, replaced, null, legacy]);
	});

	it('gives every write its own revision', async () => {
		const { repository, rows } = database();
		const blob = new Blob(['saved']);
		await repository.put('custom-wallpaper', blob);
		const first = rows.get('custom-wallpaper')?.revision;
		await repository.put('custom-wallpaper', blob);
		const second = rows.get('custom-wallpaper')?.revision;
		expect(first).toEqual(expect.any(String));
		expect(second).toEqual(expect.any(String));
		expect(first).not.toBe(second);
	});
});
