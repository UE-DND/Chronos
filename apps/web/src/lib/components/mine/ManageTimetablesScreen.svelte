<script lang="ts">
	import { hostT } from '#lib/i18n/host-i18n.svelte.ts';
	import { resolve } from '$app/paths';
	import type { AppShellController } from '#lib/app/app-shell.svelte.ts';
	import { trackEvent } from '#lib/client/analytics.ts';
	import Button from '#lib/components/ui/Button.svelte';
	import BottomSheet from '#lib/components/ui/BottomSheet.svelte';
	import FormScreenLayout from '#lib/components/ui/FormScreenLayout.svelte';
	import type { EdgeBarAction } from '@chronos/ui-kit';
	import SelectableOption from '#lib/components/ui/SelectableOption.svelte';
	import { DeleteFill } from '#lib/icons/index.ts';
	import { snackbarKey } from '#lib/components/ui/snackbar-state.svelte.ts';

	let {
		shell
	}: {
		shell: AppShellController;
	} = $props();

	const timetables = $derived(shell.controller.timetables);
	const currentTimetableId = $derived(shell.controller.currentTimetable?.id ?? null);
	const selectedTimetable = $derived(
		timetables.find((timetable) => timetable.id === currentTimetableId) ?? null
	);

	let deleteDialogOpen = $state(false);
	let deleteTarget = $state<{ id: string; name: string } | null>(null);
	let switchingId = $state<string | null>(null);
	let isDeleting = $state(false);
	const busy = $derived(switchingId !== null || isDeleting);
	const actions = $derived.by((): EdgeBarAction[] =>
		timetables.length > 0
			? [
					{
						id: 'delete',
						label: hostT('timetable.manage.delete'),
						icon: DeleteFill,
						variant: 'danger',
						disabled: !currentTimetableId || busy,
						onClick: () => {
							if (!selectedTimetable) return;
							deleteTarget = { id: selectedTimetable.id, name: selectedTimetable.name };
							deleteDialogOpen = true;
						}
					}
				]
			: []
	);

	async function handleSwitch(id: string) {
		if (busy || id === currentTimetableId) return;
		switchingId = id;
		try {
			await shell.switchTimetable(id);
			trackEvent('timetable_switch');
		} catch {
			snackbarKey('timetable.manage.switchFailed', undefined, undefined, 4000, 'assertive');
		} finally {
			switchingId = null;
		}
	}

	async function confirmDelete() {
		if (!deleteTarget || busy) return;
		const target = deleteTarget;
		if (!timetables.some((t) => t.id === target.id)) {
			deleteDialogOpen = false;
			snackbarKey('timetable.manage.deleteMissing', undefined, undefined, 4000, 'assertive');
			return;
		}
		isDeleting = true;
		try {
			const result = await shell.deleteTimetable(target.id);
			trackEvent('timetable_delete');
			deleteDialogOpen = false;
			if (result.followUpFailed)
				snackbarKey(
					'timetable.manage.deleteFollowUpFailed',
					undefined,
					undefined,
					4000,
					'assertive'
				);
		} catch {
			snackbarKey('timetable.manage.deleteFailed', undefined, undefined, 4000, 'assertive');
		} finally {
			isDeleting = false;
		}
	}

	function handleImportClick() {
		trackEvent('empty_import_click');
	}
</script>

<FormScreenLayout {actions}>
	<div class="flex flex-col gap-3">
		<h3 class="text-title-medium px-1 text-on-surface">
			{hostT('timetable.manage.heading')}
		</h3>

		{#if timetables.length === 0}
			<div
				class="flex flex-col items-center justify-center rounded-2xl border border-dashed border-border/60 bg-surface/40 px-4 py-12 text-center"
			>
				<p class="text-body-medium text-on-surface">
					{hostT('timetable.manage.empty.title')}
				</p>
				<p class="text-body-small mt-1 text-on-surface-variant">
					{hostT('timetable.manage.empty.desc')}
				</p>
				<Button
					variant="outlined"
					class="mt-4"
					href={resolve('transfer/import')}
					onclick={handleImportClick}
				>
					{hostT('timetable.empty.import')}
				</Button>
			</div>
		{:else}
			<div class="flex flex-col gap-2.5" aria-busy={busy}>
				{#if switchingId}
					<p class="sr-only" role="status">
						{hostT('common.switching')}
					</p>
				{/if}
				{#each timetables as timetable (timetable.id)}
					{@const isActive = currentTimetableId === timetable.id}
					<SelectableOption
						name="current-timetable"
						label={timetable.name}
						description={switchingId === timetable.id
							? hostT('common.switching')
							: hostT('timetable.manage.courseCount', { count: timetable.courseCount })}
						selected={isActive}
						disabled={busy}
						onclick={() => handleSwitch(timetable.id)}
					/>
				{/each}
			</div>
		{/if}
	</div>
</FormScreenLayout>

<BottomSheet
	bind:open={deleteDialogOpen}
	showHandle={false}
	title={hostT('timetable.manage.delete.title')}
	description={deleteTarget
		? hostT('timetable.manage.delete.descNamed', {
				name: deleteTarget.name
			})
		: hostT('timetable.manage.delete.descGeneric')}
>
	{#snippet footer()}
		<Button variant="text" disabled={busy} onclick={() => (deleteDialogOpen = false)}>
			{hostT('common.cancel')}
		</Button>
		<Button variant="filled" disabled={busy} aria-busy={isDeleting} onclick={confirmDelete}>
			{hostT(isDeleting ? 'common.deleting' : 'common.delete')}
		</Button>
	{/snippet}
</BottomSheet>
