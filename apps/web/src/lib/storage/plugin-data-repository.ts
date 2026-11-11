import type { ChronosDB } from '#lib/storage/db.ts';

/** Dexie-backed plugin key-value storage. */
export class PluginDataRepository {
	constructor(private database: ChronosDB) {}

	async get<T>(pluginId: string, key: string): Promise<T | null> {
		const id = `${pluginId}:${key}`;
		const row = await this.database.pluginData.get(id);
		if (!row) return null;
		if (typeof row.valueJson !== 'string') throw new TypeError('Invalid stored plugin JSON');
		return JSON.parse(row.valueJson) as T;
	}

	async set<T>(pluginId: string, key: string, value: T): Promise<void> {
		const id = `${pluginId}:${key}`;
		await this.database.pluginData.put({
			id,
			pluginId,
			key,
			valueJson: JSON.stringify(value),
			updatedAt: Date.now()
		});
	}

	async delete(pluginId: string, key: string): Promise<void> {
		const id = `${pluginId}:${key}`;
		await this.database.pluginData.delete(id);
	}

	async clear(pluginId: string): Promise<void> {
		await this.database.pluginData.where('pluginId').equals(pluginId).delete();
	}

	async clearAll(): Promise<void> {
		await this.database.pluginData.clear();
	}

	async estimateBytes(): Promise<number> {
		const pluginData = await this.database.pluginData.toArray();
		const encoder = new TextEncoder();
		let total = 0;
		for (const row of pluginData) {
			total += encoder.encode(JSON.stringify(row)).length;
		}
		return total;
	}
}
