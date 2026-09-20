import { liveQuery } from 'dexie';
import { db, type ChronosDB } from './db';

export const CUSTOM_WALLPAPER_KEY = 'custom-wallpaper';

/** Host-owned binary assets, separate from plugin-private KV. Errors propagate to callers. */
export class ImageRepository {
	constructor(private database: ChronosDB = db) {}
	async get(id: string): Promise<Blob | null> {
		return (await this.database.images.get(id))?.blob ?? null;
	}
	async put(id: string, blob: Blob): Promise<void> {
		await this.database.images.put({ id, blob });
	}
	async delete(id: string): Promise<void> {
		await this.database.images.delete(id);
	}
	watchCustom(next: (blob: Blob | null) => void, error: (error: unknown) => void) {
		return liveQuery(() => this.get(CUSTOM_WALLPAPER_KEY)).subscribe({ next, error });
	}
	async clear(): Promise<void> {
		await this.database.images.clear();
	}
	async estimateBytes(): Promise<number> {
		return (await this.database.images.toArray()).reduce((sum, row) => sum + row.blob.size, 0);
	}
}
