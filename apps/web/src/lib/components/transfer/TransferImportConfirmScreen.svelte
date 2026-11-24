<script lang="ts">
	import { getContext } from 'svelte';
	import { fromStore } from 'svelte/store';
	import { hostT } from '#lib/i18n/host-i18n.svelte.ts';
	import { trackEvent } from '#lib/client/analytics.ts';
	import { ImportMode } from '#lib/domain/import-mode.ts';
	import {
		resolveSlotTitle,
		type TransferStateController
	} from '#lib/transfer/transfer-state.svelte.ts';
	import FormScreenLayout from '#lib/components/ui/FormScreenLayout.svelte';
	import Radio from '#lib/components/ui/Radio.svelte';
	import { snackbar, snackbarKey } from '#lib/components/ui/snackbar-state.svelte.ts';
	import { getAppController } from '#lib/services/app-engine.ts';
	import { Add, DownloadFill, InfoFill, Refresh } from '#lib/icons/index.ts';
	import { formatFullDate, listDistinctCourses } from '@chronos/core';
	import { createHostDateFieldLabels } from '#lib/components/ui/host-form-labels.ts';
	import {
		ImportCourseList,
		MountableSlotOutlet,
		SchemaForm,
		findInvalidSchemaFields,
		isValidIsoDateString,
		TIMETABLE_PRESENTATION_CONTEXT,
		resolveCoursePalette,
		createPluginUiProps,
		createImportConfirmTransfer,
		type EdgeBarAction,
		type TimetablePresentationSource
	} from '@chronos/ui-kit';

	let {
		transfer,
		currentTimetableName,
		onConfirm
	}: {
		transfer: TransferStateController;
		currentTimetableName: string | null;
		onConfirm: () => void;
	} = $props();

	const instanceId = $props.id();
	const controller = getAppController();
	const presentationSource = getContext<TimetablePresentationSource | undefined>(
		TIMETABLE_PRESENTATION_CONTEXT
	);
	const presentationView = $derived(presentationSource ? fromStore(presentationSource) : null);
	const coursePalette = $derived(resolveCoursePalette(presentationView?.current));
	const transferState = $derived(transfer.state);
	const preview = $derived(transferState.preview);
	const activeSlot = $derived(
		transferState.previewSlotId
			? controller.getSlotItem('import.source.tab', transferState.previewSlotId)
			: undefined
	);
	const hasConfirmPhase = $derived(
		Boolean(activeSlot?.confirmComponent || activeSlot?.confirmSchema)
	);
	const pluginProps = $derived.by(() => {
		if (!activeSlot) return undefined;
		const owner = controller.resolveSlotOwner('import.source.tab', activeSlot.id);
		const ui = owner && createPluginUiProps(controller, owner);
		if (!ui) return undefined;
		return {
			...ui,
			transfer: createImportConfirmTransfer(transfer, ui.context)
		};
	});
	const confirmValidationError = $derived.by(() => {
		if (!activeSlot?.validateConfirmInputs) return null;
		return activeSlot.validateConfirmInputs(transferState.confirmInputs);
	});
	const hasInvalidConfirmInputs = $derived(
		activeSlot?.confirmSchema
			? findInvalidSchemaFields(activeSlot.confirmSchema, transferState.confirmInputs).length > 0
			: false
	);
	const canOverwrite = $derived(Boolean(currentTimetableName));
	const isOverwriteMode = $derived(transferState.importMode === ImportMode.OVERWRITE_CURRENT);
	const displayedCourseCount = $derived(preview ? listDistinctCourses(preview.courses).length : 0);
	const startWeek = $derived(preview?.academicConfig?.startWeek ?? 1);
	const endWeek = $derived(preview?.academicConfig?.endWeek ?? 20);
	const weekRangeLabel = $derived(
		startWeek === endWeek
			? hostT('transfer.confirm.stats.weekSingle', { week: startWeek })
			: hostT('transfer.confirm.stats.weekRange', { start: startWeek, end: endWeek })
	);
	const termStartLabel = $derived.by(() => {
		const raw = preview?.academicConfig?.termStartDate?.trim() ?? '';
		return isValidIsoDateString(raw) ? formatFullDate(raw) : null;
	});
	let loading = $state(false);
	const actions = $derived<EdgeBarAction[]>([
		{
			id: 'confirm-import',
			label: loading
				? hostT('transfer.confirm.importing')
				: isOverwriteMode
					? hostT('transfer.confirm.overwrite')
					: hostT('transfer.confirm.asNew'),
			icon: DownloadFill,
			variant: isOverwriteMode ? 'danger' : 'filled',
			showIconInPortrait: true,
			loading,
			disabled:
				loading ||
				hasInvalidConfirmInputs ||
				(!canOverwrite && isOverwriteMode) ||
				Boolean(confirmValidationError),
			onClick: handleConfirm
		}
	]);

	const dateFieldLabels = $derived(createHostDateFieldLabels());

	function analyticsImportMode(mode: ImportMode) {
		return mode === ImportMode.AS_NEW ? 'as_new' : 'overwrite';
	}

	function handleImportModeChange(mode: ImportMode, event: Event) {
		if (!transfer.setImportMode(mode)) {
			(event.currentTarget as HTMLInputElement).checked = false;
			snackbarKey('transfer.confirm.noOverwrite');
			return;
		}
		trackEvent('import_mode_select', { mode: analyticsImportMode(mode) });
	}

	async function handleConfirm() {
		if (hasInvalidConfirmInputs) return;
		if (isOverwriteMode && !canOverwrite) {
			snackbarKey('transfer.confirm.noOverwrite');
			return;
		}
		loading = true;
		const mode = analyticsImportMode(transferState.importMode);
		try {
			const ok = await transfer.confirmImport();
			trackEvent('import_confirm', { mode, success: ok });
			if (ok) {
				snackbarKey('transfer.confirm.success');
				onConfirm();
				return;
			}
			const message = transfer.state.errorMessage;
			if (message) snackbar(message);
		} finally {
			loading = false;
		}
	}
</script>

{#snippet validationHint(message: string)}
	<div
		role="status"
		class="text-body-small flex items-center gap-2 rounded-inset bg-surface-container-high/70 px-3 py-2 text-on-surface-variant"
	>
		<InfoFill class="size-4 shrink-0 text-brand" aria-hidden="true" />
		<span class="min-w-0 flex-1 break-words">{message}</span>
	</div>
{/snippet}

{#if preview}
	<FormScreenLayout {actions}>
		<section class="ui-section-surface ui-section-surface--comfortable">
			<div class="flex flex-col gap-3.5">
				<div class="flex items-start justify-between gap-3">
					<h2
						class="confirm-timetable-title text-title-large min-w-0 flex-1 break-words text-on-surface"
					>
						{preview.name}
					</h2>
					<span
						class="text-label-small mt-0.5 inline-flex shrink-0 items-center rounded-control bg-secondary-container px-2.5 py-1 text-on-secondary-container"
					>
						{resolveSlotTitle(transferState.previewSlotId)}
					</span>
				</div>

				<dl
					class="grid grid-cols-[repeat(auto-fit,minmax(5.5rem,1fr))] gap-3 rounded-inset bg-surface-variant/75 px-3.5 py-2.5 dark:bg-surface-container-high/60"
				>
					<div class="flex min-w-0 flex-col gap-0.5">
						<dt class="text-body-small text-supporting text-on-surface-variant">
							{hostT('transfer.confirm.stats.courses')}
						</dt>
						<dd class="text-body-large font-sans font-semibold text-on-surface tabular-nums">
							{hostT('transfer.confirm.stats.courseCountValue', { count: displayedCourseCount })}
						</dd>
					</div>
					<div class="flex min-w-0 flex-col gap-0.5">
						<dt class="text-body-small text-supporting text-on-surface-variant">
							{hostT('transfer.confirm.stats.weeks')}
						</dt>
						<dd class="text-body-large font-sans font-semibold text-on-surface tabular-nums">
							{weekRangeLabel}
						</dd>
					</div>
					{#if termStartLabel}
						<div class="flex min-w-0 flex-col gap-0.5">
							<dt class="text-body-small text-supporting text-on-surface-variant">
								{hostT('transfer.confirm.stats.termStart')}
							</dt>
							<dd class="text-body-large font-sans font-semibold text-on-surface tabular-nums">
								{termStartLabel}
							</dd>
						</div>
					{/if}
				</dl>

				{#if preview.courses.length > 0}
					<div class="border-t border-outline-variant/60 pt-3.5">
						<ImportCourseList
							courses={preview.courses}
							{coursePalette}
							initialVisibleCount={hasConfirmPhase ? 6 : 8}
							expandLabel={(count) => hostT('transfer.confirm.courses.expand', { count })}
							collapseLabel={hostT('transfer.confirm.courses.collapse')}
						/>
					</div>
				{/if}
			</div>
		</section>

		{#if hasConfirmPhase}
			<section class="ui-section">
				{#if activeSlot?.confirmComponent && pluginProps}
					<MountableSlotOutlet
						component={activeSlot.confirmComponent}
						props={pluginProps}
						class="w-full"
					/>
					{#if confirmValidationError}
						{@render validationHint(confirmValidationError)}
					{/if}
				{:else if activeSlot?.confirmSchema}
					<h3 class="ui-section-title">
						{hostT('transfer.confirm.options.heading')}
					</h3>
					<div class="ui-section-surface ui-section-surface--comfortable">
						<div class="ui-section-stack">
							<SchemaForm
								schema={activeSlot.confirmSchema}
								value={transferState.confirmInputs}
								onValueChange={(next) => transfer.setConfirmInputs(next)}
								{dateFieldLabels}
								{controller}
							/>
							{#if confirmValidationError}
								{@render validationHint(confirmValidationError)}
							{/if}
						</div>
					</div>
				{/if}
			</section>
		{/if}

		<section class="ui-section">
			<h3 id="{instanceId}-mode-heading" class="ui-section-title">
				{hostT('transfer.confirm.mode.heading')}
			</h3>

			<div class="ui-section-surface" role="radiogroup" aria-labelledby="{instanceId}-mode-heading">
				<label
					class="ui-row-state relative flex min-h-16 w-full cursor-pointer items-center gap-3.5 px-4 py-3 transition-colors has-[:focus-visible]:outline-2 has-[:focus-visible]:-outline-offset-2 has-[:focus-visible]:outline-brand"
				>
					<span
						class={['ui-leading-icon', !isOverwriteMode ? 'tone-primary' : 'tone-neutral']}
						aria-hidden="true"
					>
						<Add />
					</span>
					<span class="flex min-w-0 flex-1 flex-col justify-center text-left">
						<span
							id="{instanceId}-mode-new-label"
							class="confirm-mode-title text-body-large break-words text-on-surface"
						>
							{hostT('transfer.confirm.mode.asNew')}
						</span>
						<span
							id="{instanceId}-mode-new-desc"
							class="text-body-small text-supporting mt-0.5 break-words text-on-surface-variant"
						>
							{hostT('transfer.confirm.mode.asNewDesc')}
						</span>
					</span>
					<Radio
						name="import-mode"
						checked={!isOverwriteMode}
						aria-labelledby="{instanceId}-mode-new-label"
						aria-describedby="{instanceId}-mode-new-desc"
						onchange={(event) => handleImportModeChange(ImportMode.AS_NEW, event)}
					/>
				</label>

				<label
					aria-disabled={!canOverwrite || undefined}
					class={[
						'relative flex min-h-16 w-full items-center gap-3.5 px-4 py-3 transition-colors has-[:focus-visible]:outline-2 has-[:focus-visible]:-outline-offset-2 has-[:focus-visible]:outline-brand',
						canOverwrite ? 'ui-row-state cursor-pointer' : 'cursor-not-allowed opacity-45'
					]}
				>
					<span
						class={[
							'ui-leading-icon',
							isOverwriteMode
								? 'bg-error-container-subtle text-on-error-container-subtle'
								: 'tone-neutral'
						]}
						aria-hidden="true"
					>
						<Refresh />
					</span>
					<span class="flex min-w-0 flex-1 flex-col justify-center text-left">
						<span
							id="{instanceId}-mode-overwrite-label"
							class="confirm-mode-title text-body-large break-words text-on-surface"
						>
							{hostT('transfer.confirm.mode.overwrite')}
						</span>
						<span
							id="{instanceId}-mode-overwrite-desc"
							class="text-body-small text-supporting mt-0.5 break-words text-on-surface-variant"
						>
							{currentTimetableName
								? hostT('transfer.confirm.mode.currentDesc', {
										name: currentTimetableName
									})
								: hostT('transfer.confirm.noOverwrite')}
						</span>
					</span>
					<Radio
						name="import-mode"
						checked={isOverwriteMode}
						disabled={!canOverwrite}
						aria-labelledby="{instanceId}-mode-overwrite-label"
						aria-describedby="{instanceId}-mode-overwrite-desc"
						onchange={(event) => handleImportModeChange(ImportMode.OVERWRITE_CURRENT, event)}
					/>
				</label>
			</div>

			{#if isOverwriteMode && currentTimetableName}
				<div
					role="note"
					class="text-body-small flex items-start gap-2 rounded-inset bg-error-container-subtle px-3.5 py-2.5 text-on-error-container-subtle"
				>
					<InfoFill class="mt-0.5 size-4 shrink-0" aria-hidden="true" />
					<p class="min-w-0 flex-1 break-words">
						{hostT('transfer.confirm.mode.overwriteWarning', { name: currentTimetableName })}
					</p>
				</div>
			{/if}
		</section>
	</FormScreenLayout>
{/if}

<style>
	.confirm-timetable-title {
		font-weight: max(600, var(--font-weight-title-large));
	}

	.confirm-mode-title {
		font-weight: var(--font-weight-label-medium);
	}
</style>
