import { createTimetable, type AcademicConfig, type Timetable } from '../../domain/timetable';
import type {
	ChronosActions,
	DeleteTimetableResult,
	TimetableDetailsPatch
} from '../../types/actions';
import type { TimetableSelection } from './timetable-selection';
import type { EngineActionHost } from './engine-action-host';

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
	constructor(
		private readonly host: EngineActionHost,
		private readonly selection: TimetableSelection
	) {}

	async createTimetable(name: string, config?: Partial<AcademicConfig>): Promise<Timetable> {
		const id = createTimetableId();
		const timetable = createTimetable({
			id,
			name,
			academicConfig: {
				termStartDate: config?.termStartDate ?? '',
				startWeek: config?.startWeek ?? 1,
				endWeek: config?.endWeek ?? 20,
				periodTimes: config?.periodTimes ?? []
			}
		});

		await this.host.storage.saveTimetable(timetable);
		await this.host.refreshTimetables();

		if (!this.host.getCurrentTimetable()) {
			await this.host.switchTimetable(timetable.id);
		}

		return timetable;
	}

	async importTimetable(
		timetable: Timetable,
		options: { overwriteActive?: boolean } = {}
	): Promise<Timetable> {
		const importId = createTimetableId();
		const overwriteId = options.overwriteActive ? this.host.getCurrentTimetable()?.id : undefined;
		const id = overwriteId ?? importId;

		// Codec IDs belong to the preview; persisted courses need globally unique IDs.
		const toSave = {
			...timetable,
			id,
			courses: timetable.courses.map((course, index) => ({
				...course,
				id: `${importId}_c_${index + 1}`
			}))
		};

		if (overwriteId) await this.host.storage.saveTimetable(toSave, { requireExisting: true });
		else await this.host.storage.saveTimetable(toSave);
		await this.host.refreshTimetables();
		await this.host.switchTimetable(toSave.id);
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
			// The deletion is committed. Remove stale state before any fallible follow-up.
			const wasCurrent = this.host.getCurrentTimetable()?.id === timetableId;
			const remaining = this.host.getTimetables().filter((t) => t.id !== timetableId);
			this.host.setTimetables(remaining);
			this.host.emit('timetables:updated', { timetables: remaining });
			if (wasCurrent) {
				this.host.setCurrentTimetable(null);
				this.host.updateTime();
				this.host.rescheduleDayClock();
				this.host.emit('timetable:updated', { timetable: null as unknown as Timetable });
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
			} catch {
				return { followUpFailed: true };
			}
		});
	}

	async updateTimetableDetails(timetableId: string, patch: TimetableDetailsPatch): Promise<void> {
		const current = await this.host.storage.getTimetable(timetableId);
		if (!current) throw new Error(`Timetable not found: ${timetableId}`);
		const updated: Timetable = {
			...current,
			...patch,
			id: current.id,
			schemaVersion: current.schemaVersion,
			createdAt: current.createdAt,
			academicConfig: { ...current.academicConfig, ...patch.academicConfig },
			viewPrefs: { ...current.viewPrefs, ...patch.viewPrefs },
			updatedAt: Date.now()
		};
		await this.host.storage.saveTimetable(updated);
		await this.host.refreshTimetables();
		if (this.host.getCurrentTimetable()?.id !== timetableId) return;
		this.host.setCurrentTimetable(updated);
		this.host.updateTime();
		this.host.rescheduleDayClock();
		await this.host.badges.recalculate(updated.courses);
		this.host.emit('timetable:updated', { timetable: updated });
	}
}
