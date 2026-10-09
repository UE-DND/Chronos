import { isPluginBinaryValue } from '@chronos/core';
import type { ChronosDB } from '#lib/storage/db.ts';
import {
	PluginBinaryRepository,
	preparePluginBinaryRow
} from '#lib/storage/plugin-binary-repository.ts';
import { PluginDataRepository } from '#lib/storage/plugin-data-repository.ts';

/**
 * Unified plugin KV: JSON in `pluginData`, raw bytes in `pluginBinary`.
 * Binary writes accept `Blob | Uint8Array`; reads always return `Blob`.
 */
export class PluginKvRepository {
	private readonly json: PluginDataRepository;
	private readonly binary: PluginBinaryRepository;

	constructor(private database: ChronosDB) {
		this.json = new PluginDataRepository(database);
		this.binary = new PluginBinaryRepository(database);
	}

	async get<T>(pluginId: string, key: string): Promise<T | null> {
		return this.database.transaction(
			'r',
			[this.database.pluginData, this.database.pluginBinary],
			async () => {
				const blob = await this.binary.get(pluginId, key);
				if (blob) return blob as T;
				return this.json.get<T>(pluginId, key);
			}
		);
	}

	async set<T>(pluginId: string, key: string, value: T): Promise<void> {
		const row = isPluginBinaryValue(value)
			? await preparePluginBinaryRow(pluginId, key, value)
			: null;
		await this.database.transaction(
			'rw',
			[this.database.pluginData, this.database.pluginBinary],
			async () => {
				if (row) {
					await this.json.delete(pluginId, key);
					await this.database.pluginBinary.put(row);
				} else {
					await this.binary.delete(pluginId, key);
					await this.json.set(pluginId, key, value);
				}
			}
		);
	}

	async delete(pluginId: string, key: string): Promise<void> {
		await this.database.transaction(
			'rw',
			[this.database.pluginData, this.database.pluginBinary],
			() => Promise.all([this.json.delete(pluginId, key), this.binary.delete(pluginId, key)])
		);
	}

	async clear(pluginId: string): Promise<void> {
		await this.database.transaction(
			'rw',
			[this.database.pluginData, this.database.pluginBinary],
			() => Promise.all([this.json.clear(pluginId), this.binary.clear(pluginId)])
		);
	}

	async clearAll(): Promise<void> {
		await this.database.transaction(
			'rw',
			[this.database.pluginData, this.database.pluginBinary],
			() => Promise.all([this.json.clearAll(), this.binary.clearAll()])
		);
	}

	async estimateBytes(): Promise<number> {
		const [jsonBytes, binaryBytes] = await Promise.all([
			this.json.estimateBytes(),
			this.binary.estimateBytes()
		]);
		return jsonBytes + binaryBytes;
	}
}
