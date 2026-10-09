import { ImageRepository } from '#lib/storage/image-repository.ts';
import { PREFERENCE_STORAGE_KEYS } from '@chronos/core';
import type {
	Disposable,
	IStorageService,
	StorageChangeEvent,
	Timetable,
	UserPreferences,
	CourseQueryFilter,
	CourseQueryHit
} from '@chronos/core';
import { db, type ChronosDB } from '#lib/storage/db.ts';
import { clearAppCaches } from '#lib/storage/cache-storage.ts';
import { PreferencesStore } from '#lib/storage/preferences-store.ts';
import { TimetableRepository } from '#lib/storage/timetable-repository.ts';
import { PluginKvRepository } from '#lib/storage/plugin-kv-repository.ts';
import { clearKeysWithPrefix } from '#lib/storage/storage-key-utils.ts';

/**
 * DexieStorageProvider implements the core IStorageService contract
 * using Dexie (IndexedDB) for structured records and localStorage for user preferences.
 */
export class DexieStorageProvider implements IStorageService {
	private listeners = new Set<(event: StorageChangeEvent) => void>();
	private changeChannel?: BroadcastChannel;
	private storageListener?: (e: StorageEvent) => void;
	private readonly preferences: PreferencesStore;
	private readonly timetables: TimetableRepository;
	private readonly pluginKv: PluginKvRepository;
	private readonly images: ImageRepository;

	constructor(
		database: ChronosDB = db,
		localStore: Storage | null = typeof localStorage !== 'undefined' ? localStorage : null,
		private cacheStore: CacheStorage | null = typeof caches !== 'undefined' ? caches : null
	) {
		this.preferences = new PreferencesStore(localStore);
		this.timetables = new TimetableRepository(database);
		this.pluginKv = new PluginKvRepository(database);
		this.images = new ImageRepository(database);

		if (typeof window !== 'undefined') {
			if (typeof BroadcastChannel !== 'undefined') {
				this.changeChannel = new BroadcastChannel('chronos:timetable-changes');
				this.changeChannel.onmessage = (event: MessageEvent<unknown>) => {
					const data = event.data;
					if (
						data &&
						typeof data === 'object' &&
						'type' in data &&
						data.type === 'timetable' &&
						'key' in data &&
						typeof data.key === 'string'
					) {
						this.notifyChange({ type: 'timetable', key: data.key });
					}
				};
			}
			this.storageListener = (e: StorageEvent) => {
				if (e.key === PREFERENCE_STORAGE_KEYS.currentTimetableId) {
					this.notifyChange({ type: 'timetable', key: e.key });
				} else if (e.key?.startsWith('chronos_preferences:')) {
					this.notifyChange({ type: 'preferences', key: e.key });
				}
			};
			window.addEventListener('storage', this.storageListener);
		}
	}

	private notifyChange(event: StorageChangeEvent): void {
		for (const listener of this.listeners) {
			try {
				listener(event);
			} catch (err) {
				console.error('[DexieStorageProvider] Error in onChanged listener:', err);
			}
		}
	}

	private async withStorageNotify<T>(
		event: StorageChangeEvent,
		action: string,
		fn: () => Promise<T>
	): Promise<T> {
		try {
			const result = await fn();
			this.notifyChange(event);
			if (event.type === 'timetable') this.broadcastChange(event);
			return result;
		} catch (err) {
			console.warn(`[DexieStorageProvider] Failed to ${action}:`, err);
			throw err;
		}
	}

	private broadcastChange(event: StorageChangeEvent): void {
		try {
			this.changeChannel?.postMessage(event);
		} catch (error) {
			console.warn('[DexieStorageProvider] Failed to broadcast committed change:', error);
		}
	}

	onChanged(listener: (event: StorageChangeEvent) => void): Disposable {
		this.listeners.add(listener);
		return {
			dispose: () => {
				this.listeners.delete(listener);
			}
		};
	}

	async getTimetable(id: string): Promise<Timetable | null> {
		return this.timetables.getTimetable(id);
	}

	async listTimetables(): Promise<
		Array<{ id: string; name: string; courseCount: number; updatedAt: number }>
	> {
		return this.timetables.listTimetables();
	}

	async queryCourses(filter: CourseQueryFilter = {}): Promise<CourseQueryHit[]> {
		return this.timetables.queryCourses(filter);
	}

	async saveTimetable(
		timetable: Timetable,
		options?: { requireExisting?: boolean }
	): Promise<void> {
		await this.withStorageNotify({ type: 'timetable', key: timetable.id }, 'save timetable', () =>
			this.timetables.saveTimetable(timetable, options)
		);
	}

	async deleteTimetable(id: string): Promise<void> {
		await this.withStorageNotify({ type: 'timetable', key: id }, 'delete timetable', () =>
			this.timetables.deleteTimetable(id)
		);
	}

	async getActiveTimetableId(): Promise<string | null> {
		return this.preferences.getActiveTimetableId();
	}

	async setActiveTimetableId(id: string): Promise<void> {
		await this.preferences.setActiveTimetableId(id);
		this.notifyChange({ type: 'preferences', key: 'currentTimetableId' });
	}

	async getPreferences(): Promise<UserPreferences> {
		return this.preferences.getPreferences();
	}

	async savePreferences(patch: Partial<UserPreferences>): Promise<void> {
		await this.preferences.savePreferences(patch);
		this.notifyChange({ type: 'preferences', key: 'preferences' });
	}

	async getPluginData<T>(pluginId: string, key: string): Promise<T | null> {
		return this.pluginKv.get<T>(pluginId, key);
	}

	async setPluginData<T>(pluginId: string, key: string, value: T): Promise<void> {
		const id = `${pluginId}:${key}`;
		await this.withStorageNotify({ type: 'pluginData', key: id }, `set plugin data for ${id}`, () =>
			this.pluginKv.set(pluginId, key, value)
		);
	}

	async deletePluginData(pluginId: string, key: string): Promise<void> {
		const id = `${pluginId}:${key}`;
		await this.withStorageNotify(
			{ type: 'pluginData', key: id },
			`delete plugin data for ${id}`,
			() => this.pluginKv.delete(pluginId, key)
		);
	}

	async clearPluginData(pluginId: string): Promise<void> {
		await this.withStorageNotify(
			{ type: 'pluginData', key: pluginId },
			`clear plugin data for ${pluginId}`,
			() => this.pluginKv.clear(pluginId)
		);
	}

	async clearAllData(): Promise<void> {
		try {
			await this.timetables.clearTimetables();
			await this.pluginKv.clearAll();
			await this.images.clear();
			if (typeof localStorage !== 'undefined') {
				clearKeysWithPrefix(localStorage, 'chronos');
			}
			if (typeof sessionStorage !== 'undefined') {
				clearKeysWithPrefix(sessionStorage, 'chronos');
			}
			// Installed PWA code and bundled required plugins play the same role as APK assets.
			await clearAppCaches(this.cacheStore, { keepHostAssets: true });
			this.notifyChange({ type: 'preferences', key: 'clearAllData' });
			this.notifyChange({ type: 'timetable', key: 'clearAllData' });
			this.broadcastChange({ type: 'timetable', key: 'clearAllData' });
		} catch (err) {
			console.warn('[DexieStorageProvider] Failed to clear all data:', err);
			throw err;
		}
	}

	async estimateStorageBytes(): Promise<number> {
		const [timetableBytes, pluginBytes, imageBytes] = await Promise.all([
			this.timetables.estimateBytes(),
			this.pluginKv.estimateBytes(),
			this.images.estimateBytes()
		]);
		return timetableBytes + pluginBytes + imageBytes;
	}

	dispose(): void {
		this.changeChannel?.close();
		this.changeChannel = undefined;
		if (typeof window !== 'undefined' && this.storageListener) {
			window.removeEventListener('storage', this.storageListener);
			this.storageListener = undefined;
		}
		this.listeners.clear();
	}
}
