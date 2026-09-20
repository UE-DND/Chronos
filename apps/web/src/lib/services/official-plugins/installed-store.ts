import type { ChronosEngine, Disposable } from '@chronos/core';
import {
	INSTALLED_STORAGE_KEY,
	OFFICIAL_PLUGINS_PLUGIN_ID,
	type InstalledOfficialPluginRecord
} from './official-plugin-types';

export class OfficialPluginInstalledStore {
	private removed: string[] = [];
	private seeded = false;
	private cache: InstalledOfficialPluginRecord[] = [];
	private changeListeners = new Set<() => void>();
	private writeChain: Promise<void> = Promise.resolve();

	constructor(private readonly engine: ChronosEngine) {}

	onChanged(listener: () => void): Disposable {
		this.changeListeners.add(listener);
		return {
			dispose: () => {
				this.changeListeners.delete(listener);
			}
		};
	}

	notify(): void {
		for (const listener of this.changeListeners) {
			try {
				listener();
			} catch (err) {
				console.error('[OfficialPluginInstalledStore] Error in change listener:', err);
			}
		}
	}

	async load(): Promise<InstalledOfficialPluginRecord[]> {
		const data = await this.engine.storage.getPluginData<{
			records: InstalledOfficialPluginRecord[];
			removed: string[];
			seeded: boolean;
		}>(OFFICIAL_PLUGINS_PLUGIN_ID, INSTALLED_STORAGE_KEY);
		if (
			data !== null &&
			data !== undefined &&
			(!Array.isArray(data.records) ||
				!Array.isArray(data.removed) ||
				typeof data.seeded !== 'boolean' ||
				data.removed.some((id) => typeof id !== 'string') ||
				data.records.some(
					(record) =>
						!record?.manifest?.id ||
						typeof record.enabled !== 'boolean' ||
						!(
							record.origin?.kind === 'user' ||
							(record.origin?.kind === 'profile' && typeof record.origin.profileId === 'string')
						)
				) ||
				new Set(data.records.map((record) => record.manifest.id)).size !== data.records.length)
		)
			throw new Error('Invalid plugin installation state; reset development data manually');
		this.cache = data?.records ?? [];
		this.removed = data?.removed ?? [];
		this.seeded = data?.seeded ?? false;
		return this.cache;
	}

	getCache(): ReadonlyArray<InstalledOfficialPluginRecord> {
		return this.cache;
	}

	find(pluginId: string): InstalledOfficialPluginRecord | undefined {
		return this.cache.find((p) => p.manifest.id === pluginId);
	}

	has(pluginId: string): boolean {
		return this.cache.some((p) => p.manifest.id === pluginId);
	}

	getRemoved(): readonly string[] {
		return this.removed;
	}
	get isSeeded(): boolean {
		return this.seeded;
	}
	async markSeeded(): Promise<void> {
		await this.enqueueWrite(async () => {
			await this.engine.storage.setPluginData(OFFICIAL_PLUGINS_PLUGIN_ID, INSTALLED_STORAGE_KEY, {
				records: this.cache,
				removed: this.removed,
				seeded: true
			});
			this.seeded = true;
		});
	}

	async upsert(record: InstalledOfficialPluginRecord): Promise<void> {
		await this.enqueueWrite(async () => {
			const nextCache = this.cache.slice();
			const existingIndex = nextCache.findIndex((p) => p.manifest.id === record.manifest.id);
			if (existingIndex >= 0) {
				nextCache[existingIndex] = record;
			} else {
				nextCache.push(record);
			}
			await this.engine.storage.setPluginData(OFFICIAL_PLUGINS_PLUGIN_ID, INSTALLED_STORAGE_KEY, {
				records: nextCache,
				removed: this.removed.filter((id) => id !== record.manifest.id),
				seeded: this.seeded
			});
			this.removed = this.removed.filter((id) => id !== record.manifest.id);
			this.cache = nextCache;
			this.notify();
		});
	}

	async remove(pluginId: string): Promise<void> {
		await this.enqueueWrite(async () => {
			const nextCache = this.cache.filter((p) => p.manifest.id !== pluginId);
			await this.engine.storage.setPluginData(OFFICIAL_PLUGINS_PLUGIN_ID, INSTALLED_STORAGE_KEY, {
				records: nextCache,
				removed: [...new Set([...this.removed, pluginId])],
				seeded: this.seeded
			});
			this.removed = [...new Set([...this.removed, pluginId])];
			this.cache = nextCache;
			this.notify();
		});
	}

	async setEnabled(pluginId: string, enabled: boolean): Promise<void> {
		const record = this.find(pluginId);
		if (!record) {
			throw new Error(`Plugin not installed: ${pluginId}`);
		}
		await this.upsert({ ...record, enabled });
	}

	async persist(): Promise<void> {
		await this.enqueueWrite(async () => {
			await this.engine.storage.setPluginData(OFFICIAL_PLUGINS_PLUGIN_ID, INSTALLED_STORAGE_KEY, {
				records: this.cache,
				removed: this.removed,
				seeded: this.seeded
			});
			this.notify();
		});
	}

	clear(): void {
		this.cache = [];
		this.removed = [];
		this.seeded = false;
		this.notify();
	}

	private enqueueWrite(task: () => Promise<void>): Promise<void> {
		const next = this.writeChain.then(task);
		this.writeChain = next.catch(() => {});
		return next;
	}
}
