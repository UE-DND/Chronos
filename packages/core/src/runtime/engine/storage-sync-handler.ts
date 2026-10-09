import { StorageClearError } from '../../types/services';
import type { TimetableSelection } from './timetable-selection';
import { DEFAULT_USER_PREFERENCES } from '../../domain/preferences';
import type { Timetable } from '../../domain/timetable';
import type { StorageChangeEvent } from '../../types/env';
import type { Disposable } from '../../types/services';
import type { EngineActionHost } from './engine-action-host';
import type { TimetableSummary } from '../../types/state';
import type { EngineTimeKeeper } from './engine-time-keeper';

/** Hydrates engine state from storage and handles cross-tab sync events. */
export class StorageSyncHandler {
	private listGeneration = 0;
	private disposed = false;

	constructor(
		private readonly host: EngineActionHost,
		private readonly timeKeeper: EngineTimeKeeper,
		private readonly selection: TimetableSelection
	) {}

	dispose(): void {
		this.disposed = true;
		this.selection.invalidate();
		this.listGeneration += 1;
	}

	async hydrate(): Promise<Disposable | undefined> {
		const storage = this.host.storage;
		const generation = ++this.listGeneration;
		const revision = this.selection.snapshot();

		const [prefs, storedActiveId] = await Promise.all([
			storage.getPreferences(),
			storage.getActiveTimetableId()
		]);
		this.host.setUserPreferences(prefs);

		const listPromise = storage.listTimetables();
		void listPromise.then(
			(list) => {
				this.applyTimetableList(list, generation);
			},
			() => {}
		);

		let activeId = storedActiveId;
		let current = activeId ? await storage.getTimetable(activeId) : null;

		if (!this.selection.isCurrent(revision) || this.disposed)
			return this.subscribeIfActive(storage);

		if (!current) {
			const list = await listPromise;
			if (!this.applyTimetableList(list, generation)) {
				return this.subscribeIfActive(storage);
			}
			if (!this.selection.isCurrent(revision) || this.disposed)
				return this.subscribeIfActive(storage);
			if (list.length > 0 && list[0]) {
				activeId = list[0].id;
				await storage.setActiveTimetableId(activeId);
				current = await storage.getTimetable(activeId);
			}
		}

		if (!this.selection.isCurrent(revision) || this.disposed)
			return this.subscribeIfActive(storage);

		if (current) {
			this.host.setCurrentTimetable(current);
		}

		this.timeKeeper.updateTime();
		this.timeKeeper.start();

		if (current) {
			await this.host.badges.recalculate(current.courses);
			this.host.emit('timetable:loaded', { timetable: current });
		}
		this.host.emit('preferences:updated', { preferences: this.host.getUserPreferences() });

		return this.subscribeIfActive(storage);
	}

	async handleChange(event: StorageChangeEvent): Promise<void> {
		const storage = this.host.storage;
		if (event.type === 'preferences') {
			this.host.setUserPreferences(await storage.getPreferences());
			this.host.emit('preferences:updated', { preferences: this.host.getUserPreferences() });
		} else if (event.type === 'timetable') {
			await this.selection.whenSettled();
			if (this.disposed) return;
			const revision = this.selection.snapshot();
			this.listGeneration += 1;
			await this.host.refreshTimetables();
			const activeId = await storage.getActiveTimetableId();
			const updated = activeId ? await storage.getTimetable(activeId) : null;
			if (this.disposed || !this.selection.isCurrent(revision)) return;
			this.host.setCurrentTimetable(updated);
			this.timeKeeper.updateTime();
			this.timeKeeper.reschedule();
			await this.host.badges.recalculate(updated?.courses ?? []);
			if (this.disposed || !this.selection.isCurrent(revision)) return;
			this.host.emit('timetable:updated', { timetable: updated as Timetable });
		}
	}

	async clearAllData(): Promise<void> {
		this.selection.invalidate();
		this.listGeneration += 1;
		const storage = this.host.storage;
		let cleanupError: StorageClearError | undefined;
		if (storage.clearAllData) {
			try {
				await storage.clearAllData();
			} catch (error) {
				if (!(error instanceof StorageClearError)) throw error;
				cleanupError = error;
			}
		} else {
			const list = await storage.listTimetables();
			for (const t of list) {
				await storage.deleteTimetable(t.id);
			}
			await storage.setActiveTimetableId('');
		}
		this.host.setCurrentTimetable(null);
		this.host.setTimetables([]);
		this.host.setUserPreferences({ ...DEFAULT_USER_PREFERENCES });
		this.host.emit('timetables:updated', { timetables: [] });
		this.host.emit('timetable:updated', { timetable: null as unknown as Timetable });
		this.host.emit('preferences:updated', { preferences: this.host.getUserPreferences() });
		if (cleanupError) throw cleanupError;
	}

	private applyTimetableList(list: TimetableSummary[], generation: number): boolean {
		if (this.disposed || generation !== this.listGeneration) return false;
		this.host.setTimetables(list);
		this.host.emit('timetables:updated', { timetables: list });
		return true;
	}

	private subscribeIfActive(storage: EngineActionHost['storage']): Disposable | undefined {
		if (this.disposed) return undefined;
		if (storage.onChanged) {
			return storage.onChanged((event) => this.handleChange(event));
		}
		return undefined;
	}
}
