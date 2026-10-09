import type { AppShellController } from '#lib/app/app-shell.svelte.ts';
import type { TimetableSettingsDraft } from '#lib/models/drafts.ts';
import type { Timetable } from '@chronos/core';
import { trackEvent } from '#lib/client/analytics.ts';
import { toSettingsDraft } from '#lib/timetable/timetable-mappers.ts';
import { validatePeriodTimes } from '@chronos/core';
import { getAppController } from '#lib/services/app-engine.ts';
import { currentWeekMonday, todayIsoDate } from '@chronos/core';
import { defaultPeriodTimes } from '#lib/models/defaults.ts';
import { snackbarKey } from '#lib/components/ui/snackbar-state.svelte.ts';

export class TimetableDetailsEditor {
	draft = $state<TimetableSettingsDraft | null>(null);
	isSaving = $state(false);
	private loadedTimetableId = $state<string | null>(null);

	constructor(
		private shell: AppShellController,
		private onDone: () => void | Promise<void>
	) {}

	loadFromTimetable(timetable: Timetable | null) {
		if (!timetable) {
			this.draft = null;
			this.loadedTimetableId = null;
			return;
		}
		if (this.loadedTimetableId === timetable.id) return;
		this.loadedTimetableId = timetable.id;
		this.draft = toSettingsDraft(timetable);
	}

	get canSave() {
		return (
			!this.isSaving &&
			Boolean(this.draft) &&
			validatePeriodTimes(this.draft?.academicConfig.periodTimes ?? []).length === 0
		);
	}

	save = async () => {
		const timetable = this.shell.controller.currentTimetable;
		if (!timetable || !this.draft || !this.canSave) return;
		const controller = getAppController();
		this.isSaving = true;
		try {
			await controller.updateTimetableDetails(timetable.id, {
				name: this.draft.name,
				academicConfig: this.draft.academicConfig,
				importMetadata: this.draft.importMetadata?.source
					? {
							source: this.draft.importMetadata.source,
							campusId: this.draft.importMetadata.campusId
						}
					: undefined
			});
			trackEvent('timetable_details_save');
			await this.onDone();
		} catch {
			snackbarKey('transfer.error.saveFailed', undefined, undefined, 4000, 'assertive');
		} finally {
			this.isSaving = false;
		}
	};

	private resetAcademicConfigToDefaults(today: string) {
		if (!this.draft) return;
		this.draft.academicConfig = {
			...this.draft.academicConfig,
			termStartDate: currentWeekMonday(today),
			periodTimes: defaultPeriodTimes().map((period) => ({ ...period }))
		};
	}

	resetToDefaultSettings = () => {
		if (!this.draft) return;
		trackEvent('timetable_details_reset');
		this.resetAcademicConfigToDefaults(todayIsoDate());
	};
}

export function createTimetableDetailsEditor(
	shell: AppShellController,
	onDone: () => void | Promise<void>
): TimetableDetailsEditor {
	return new TimetableDetailsEditor(shell, onDone);
}

export type TimetableDetailsController = TimetableDetailsEditor;
