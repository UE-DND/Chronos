import { createTimetable, type AcademicConfig, type Timetable } from '../../domain/timetable';
import { countDistinctCourseNames } from '../../domain/course';
import type {
	ChronosActions,
	DeleteTimetableResult,
	TimetableDetailsPatch
} from '../../types/actions';
import type { TimetableSelection } from './timetable-selection';
import type { EngineActionHost } from './engine-action-host';
import { immutableSnapshot } from '../immutable-snapshot';
import { cloneDomainValue } from '../../domain/clone-domain-value';

// Ports without transactional mutation (tests and non-browser hosts) share one write queue.
const mutations = new WeakMap<object, Promise<unknown>>();

function createTimetableId(): string {
	if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
		return `tt_${crypto.randomUUID()}`;
	}
	return `tt_${Date.now()}_${Math.random().toString(36).slice(2, 10)}`;
}

/** Timetable CRUD for ChronosEngine. */
export class TimetableActions implements Pick<
	ChronosActions,
	| 'createTimetable'
	| 'importTimetable'
	| 'switchTimetable'
	| 'deleteTimetable'
	| 'updateTimetableDetails'
> {
	private publicationGeneration = 0;
	private readonly timetablePublicationGenerations = new Map<string, number>();

	constructor(
		private readonly host: EngineActionHost,
		private readonly selection: TimetableSelection
	) {}

	invalidatePublications(timetableId?: string): void {
		if (timetableId !== undefined) {
			this.timetablePublicationGenerations.set(
				timetableId,
				(this.timetablePublicationGenerations.get(timetableId) ?? 0) + 1
			);
			return;
		}
		this.publicationGeneration += 1;
		this.timetablePublicationGenerations.clear();
	}

	private capturePublication(timetableId: string): () => boolean {
		const generation = this.publicationGeneration;
		const timetableGeneration = this.timetablePublicationGenerations.get(timetableId) ?? 0;
		return () =>
			generation === this.publicationGeneration &&
			timetableGeneration === (this.timetablePublicationGenerations.get(timetableId) ?? 0);
	}

	private publishSavedTimetable(timetable: Timetable): void {
		const list = [
			{
				id: timetable.id,
				name: timetable.name,
				updatedAt: timetable.updatedAt,
				courseCount: countDistinctCourseNames(timetable.courses)
			},
			...this.host.getTimetables().filter((summary) => summary.id !== timetable.id)
		].sort((a, b) => b.updatedAt - a.updatedAt);
		this.host.setTimetables(list);
		this.host.emit('timetables:updated', { timetables: this.host.getTimetables() });
		if (this.host.getCurrentTimetable()?.id === timetable.id) {
			this.host.setCurrentTimetable(timetable);
			this.host.emit('timetable:updated', { timetable: this.host.getCurrentTimetable() });
		}
	}

	async createTimetable(name: string, config?: Partial<AcademicConfig>): Promise<Timetable> {
		const input = cloneDomainValue(config);
		const id = createTimetableId();
		const canPublish = this.capturePublication(id);
		const timetable = createTimetable({
			id,
			name,
			academicConfig: {
				termStartDate: input?.termStartDate ?? '',
				startWeek: input?.startWeek ?? 1,
				endWeek: input?.endWeek ?? 20,
				periodTimes: input?.periodTimes ?? []
			}
		});

		await this.host.storage.saveTimetable(immutableSnapshot(timetable));
		if (!canPublish()) return timetable;
		try {
			this.publishSavedTimetable(timetable);
			await this.host.refreshTimetables();
			if (!canPublish()) return timetable;
			if (!this.host.getCurrentTimetable()) await this.host.switchTimetable(timetable.id);
		} catch (cause) {
			if (!canPublish()) return timetable;
			this.host.emit('timetable:followUpFailed', { operation: 'create', timetableId: id, cause });
		}

		return timetable;
	}

	async importTimetable(
		timetable: Timetable,
		options: { overwriteActive?: boolean } = {}
	): Promise<Timetable> {
		const input = cloneDomainValue(timetable);
		const importId = createTimetableId();
		const overwriteId = options.overwriteActive ? this.host.getCurrentTimetable()?.id : undefined;
		const id = overwriteId ?? importId;
		const canPublish = this.capturePublication(id);

		// Codec IDs belong to the preview; persisted courses need globally unique IDs.
		const toSave = {
			...input,
			id,
			courses: input.courses.map((course, index) => ({
				...course,
				id: `${importId}_c_${index + 1}`
			}))
		};

		if (overwriteId)
			await this.host.storage.saveTimetable(immutableSnapshot(toSave), { requireExisting: true });
		else await this.host.storage.saveTimetable(immutableSnapshot(toSave));
		if (!canPublish()) return toSave;
		try {
			this.publishSavedTimetable(toSave);
			await this.host.refreshTimetables();
			if (!canPublish()) return toSave;
			await this.host.switchTimetable(toSave.id);
		} catch (cause) {
			if (!canPublish()) return toSave;
			this.host.emit('timetable:followUpFailed', { operation: 'import', timetableId: id, cause });
		}
		return toSave;
	}

	async switchTimetable(timetableId: string): Promise<void> {
		return this.selection.change(() => this.switchSelection(timetableId));
	}

	private async switchSelection(timetableId: string): Promise<void> {
		const previousId = this.host.getCurrentTimetable()?.id ?? null;
		const timetable = await this.host.storage.getTimetable(timetableId);
		if (!timetable) {
			throw new Error(`Timetable not found: ${timetableId}`);
		}

		await this.host.storage.setActiveTimetableId(timetableId);
		this.host.setCurrentTimetable(timetable);
		this.host.updateTime();
		this.host.rescheduleDayClock();
		await this.host.badges.recalculate(timetable.courses);

		this.host.emit('timetable:switched', {
			previousId,
			currentId: timetableId,
			timetable
		});
	}

	async deleteTimetable(timetableId: string): Promise<DeleteTimetableResult> {
		return this.selection.change(async () => {
			if (!(await this.host.storage.getTimetable(timetableId))) {
				throw new Error(`Timetable not found: ${timetableId}`);
			}
			await this.host.storage.deleteTimetable(timetableId);
			this.invalidatePublications(timetableId);
			// The deletion is committed. Remove stale state before any fallible follow-up.
			const wasCurrent = this.host.getCurrentTimetable()?.id === timetableId;
			const remaining = this.host.getTimetables().filter((t) => t.id !== timetableId);
			this.host.setTimetables(remaining);
			this.host.emit('timetables:updated', { timetables: remaining });
			if (wasCurrent) {
				this.host.setCurrentTimetable(null);
				this.host.updateTime();
				this.host.rescheduleDayClock();
				this.host.emit('timetable:updated', { timetable: null });
			}
			try {
				if (wasCurrent) await this.host.badges.recalculate([]);
				await this.host.refreshTimetables();
				if (wasCurrent) {
					await this.host.storage.setActiveTimetableId('');
					const next = this.host.getTimetables()[0];
					if (next) await this.switchSelection(next.id);
				}
				return { followUpFailed: false };
			} catch (cause) {
				return { followUpFailed: true, cause };
			}
		});
	}

	async updateTimetableDetails(timetableId: string, patch: TimetableDetailsPatch): Promise<void> {
		const ownedPatch = immutableSnapshot(patch);
		return this.mutateTimetable(timetableId, (current) => ({
			...current,
			...ownedPatch,
			academicConfig: { ...current.academicConfig, ...ownedPatch.academicConfig },
			viewPrefs: { ...current.viewPrefs, ...ownedPatch.viewPrefs }
		}));
	}

	async mutateTimetable(
		timetableId: string,
		change: (current: Timetable) => Timetable
	): Promise<void> {
		const canPublish = this.capturePublication(timetableId);
		const currentBefore = this.host.getCurrentTimetable();
		const listBefore = this.host.getTimetables();
		const storage = this.host.storage;
		const apply = (current: Timetable): Timetable =>
			immutableSnapshot({
				...change(current),
				id: current.id,
				schemaVersion: current.schemaVersion,
				createdAt: current.createdAt,
				updatedAt: Date.now()
			});
		let updated: Timetable;
		if (storage.mutateTimetable) {
			updated = await storage.mutateTimetable(timetableId, apply);
		} else {
			const operation = (mutations.get(storage) ?? Promise.resolve())
				.catch(() => {})
				.then(async () => {
					const current = await storage.getTimetable(timetableId);
					if (!current) throw new Error(`Timetable not found: ${timetableId}`);
					const next = apply(current);
					await storage.saveTimetable(next, { requireExisting: true });
					return next;
				});
			mutations.set(storage, operation);
			updated = await operation;
		}
		if (!canPublish()) return;
		let published = false;
		try {
			// Persistence responses can arrive out of commit order; publish the latest stored value.
			const canonical = await storage.getTimetable(timetableId);
			if (!canPublish() || !canonical) return;
			updated = canonical;
			this.publishSavedTimetable(updated);
			published = true;
			await this.host.refreshTimetables();
			if (!canPublish()) return;
			const current = this.host.getCurrentTimetable();
			if (current?.id !== timetableId) return;
			this.host.updateTime();
			this.host.rescheduleDayClock();
			await this.host.badges.recalculate(current.courses);
		} catch (cause) {
			if (!canPublish()) return;
			if (
				!published &&
				this.host.getCurrentTimetable() === currentBefore &&
				this.host.getTimetables() === listBefore
			)
				this.publishSavedTimetable(updated);
			this.host.emit('timetable:followUpFailed', { operation: 'update', timetableId, cause });
		}
	}
}
