import { liveQuery } from 'dexie';
import { db, type ChronosDB, type ImageRow } from './db';

export const CUSTOM_WALLPAPER_KEY = 'custom-wallpaper';

/** Host-owned binary assets, separate from plugin-private KV. Errors propagate to callers. */
export class ImageRepository {
	constructor(
		private database: ChronosDB = db,
		private observe: typeof liveQuery = liveQuery
	) {}
	async get(id: string): Promise<Blob | null> {
		return (await this.database.images.get(id))?.blob ?? null;
	}
	async put(id: string, blob: Blob): Promise<void> {
		await this.database.images.put({ id, blob, revision: crypto.randomUUID() });
	}
	async delete(id: string): Promise<void> {
		await this.database.images.delete(id);
	}
	watchCustom(next: (blob: Blob | null) => void, error: (error: unknown) => void) {
		// liveQuery can emit one IndexedDB row twice, and each read is a new Blob.
		let revision: string | null | undefined;
		return this.observe(() => this.database.images.get(CUSTOM_WALLPAPER_KEY)).subscribe({
			next: (row) => {
				const stored = imageRevision(row);
				if (stored === revision) return;
				revision = stored;
				next(row?.blob ?? null);
			},
			error
		});
	}
	async clear(): Promise<void> {
		await this.database.images.clear();
	}
	async estimateBytes(): Promise<number> {
		return (await this.database.images.toArray()).reduce((sum, row) => sum + row.blob.size, 0);
	}
}

function imageRevision(row: Pick<ImageRow, 'revision'> | undefined): string | null {
	return row ? (row.revision ?? '') : null;
}
