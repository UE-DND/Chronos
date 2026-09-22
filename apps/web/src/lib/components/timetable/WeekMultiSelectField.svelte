<script lang="ts">
	import { hostT } from '$lib/i18n/host-i18n.svelte';
	import { haptic } from '$lib/haptic/haptic';
	import {
		applyWeekDragSelection,
		resolveWeekDragSelectionMode,
		type WeekDragSelectionMode
	} from '$lib/timetable/week-drag-selection';
	import BottomSheet from '$lib/components/ui/BottomSheet.svelte';

	interface WeekDragSession {
		pointerId: number;
		mode: WeekDragSelectionMode;
		visitedWeeks: Set<number>;
	}

	let {
		label,
		weeks,
		value = [],
		required = false,
		onValueChange
	}: {
		label: string;
		weeks: number[];
		value?: number[];
		required?: boolean;
		onValueChange?: (weeks: number[]) => void;
	} = $props();

	const instanceId = $props.id();
	const fieldId = `week-multi-select-${instanceId}`;
	const availableWeeks = $derived(
		[...new Set([...weeks, ...value])].sort((left, right) => left - right)
	);
	const displayValue = $derived(
		value.length > 0
			? hostT('course.form.weekSelection', {
					weeks: [...value]
						.sort((left, right) => left - right)
						.join(hostT('course.form.weekListSeparator'))
				})
			: hostT('course.form.select')
	);

	let open = $state(false);
	let draftWeeks = $state<number[]>([]);
	let weekGrid: HTMLElement | null = null;
	let dragSession: WeekDragSession | null = null;

	function openPicker() {
		dragSession = null;
		draftWeeks = [...value];
		open = true;
	}

	function toggleWeek(week: number) {
		haptic.selection();
		const mode = resolveWeekDragSelectionMode(draftWeeks, week);
		draftWeeks = applyWeekDragSelection(draftWeeks, week, mode);
	}

	function applyDraggedWeek(week: number) {
		const session = dragSession;
		if (!session || session.visitedWeeks.has(week)) return;
		session.visitedWeeks.add(week);
		const next = applyWeekDragSelection(draftWeeks, week, session.mode);
		if (next === draftWeeks) return;
		haptic.selection();
		draftWeeks = next;
	}

	function startWeekDrag(event: PointerEvent, week: number) {
		if (event.button !== 0 || !event.isPrimary) return;
		event.preventDefault();
		dragSession = {
			pointerId: event.pointerId,
			mode: resolveWeekDragSelectionMode(draftWeeks, week),
			visitedWeeks: new Set()
		};
		applyDraggedWeek(week);
	}

	function weekAtPoint(clientX: number, clientY: number): number | null {
		const target = document.elementFromPoint(clientX, clientY)?.closest<HTMLElement>('[data-week]');
		if (!target || !weekGrid?.contains(target)) return null;
		const week = Number(target.dataset.week);
		return Number.isInteger(week) ? week : null;
	}

	function weekGridAttach(node: HTMLElement) {
		weekGrid = node;
		return () => {
			if (weekGrid === node) weekGrid = null;
		};
	}

	function continueWeekDrag(event: PointerEvent) {
		if (!dragSession || event.pointerId !== dragSession.pointerId) return;
		event.preventDefault();
		const samples = event.getCoalescedEvents?.() ?? [];
		for (const pointer of [...samples, event]) {
			const week = weekAtPoint(pointer.clientX, pointer.clientY);
			if (week !== null) applyDraggedWeek(week);
		}
	}

	function finishWeekDrag(event: PointerEvent) {
		if (event.pointerId === dragSession?.pointerId) dragSession = null;
	}

	function confirmSelection() {
		dragSession = null;
		onValueChange?.([...draftWeeks].sort((left, right) => left - right));
		open = false;
	}
</script>

<svelte:window
	onpointermove={continueWeekDrag}
	onpointerup={finishWeekDrag}
	onpointercancel={finishWeekDrag}
/>

<div class="ui-form-field">
	<button
		type="button"
		id="{fieldId}-label"
		class="ui-field-label cursor-pointer border-0 bg-transparent p-0 text-left"
		onclick={openPicker}
	>
		{label}
		{#if required}<span class="ml-0.5 text-error">*</span>{/if}
	</button>
	<button
		type="button"
		id={fieldId}
		class="ui-form-field-input ui-date-field-input"
		aria-labelledby="{fieldId}-label"
		aria-haspopup="dialog"
		aria-expanded={open}
		onclick={openPicker}
	>
		<span
			class="ui-date-field-value text-body-large truncate text-left {value.length > 0
				? 'text-on-surface'
				: 'text-on-surface-variant'}"
		>
			{displayValue}
		</span>
		<span class="ui-date-field-trigger" aria-hidden="true">
			<svg class="size-5" viewBox="0 0 24 24" fill="currentColor">
				<path d="m7 10 5 5 5-5z" />
			</svg>
		</span>
	</button>
</div>

<BottomSheet bind:open title={label}>
	<div
		{@attach weekGridAttach}
		class="grid touch-none grid-cols-5 gap-2.5 px-4 pt-2 pb-3 select-none"
		role="group"
		aria-label={label}
		oncontextmenu={(event) => event.preventDefault()}
	>
		{#each availableWeeks as week (week)}
			{@const selected = draftWeeks.includes(week)}
			<button
				type="button"
				role="checkbox"
				aria-checked={selected}
				aria-label={hostT('course.form.week', { week })}
				data-week={week}
				class={[
					'text-title-medium flex aspect-square min-h-12 items-center justify-center rounded-2xl transition-colors',
					selected
						? 'bg-brand font-medium text-on-primary active:opacity-90'
						: 'bg-surface-container text-on-surface hover:bg-surface-container-high active:bg-surface-container-high'
				]}
				onpointerdown={(event) => startWeekDrag(event, week)}
				onclick={(event) => {
					if (event.detail === 0) toggleWeek(week);
				}}
			>
				{week}
			</button>
		{/each}
	</div>

	{#snippet footer()}
		<button
			type="button"
			class="text-label-large h-11 rounded-full px-5 text-on-surface-variant hover:bg-on-surface/5 active:bg-on-surface/10"
			onclick={() => (open = false)}
		>
			{hostT('common.cancel')}
		</button>
		<button
			type="button"
			class="text-label-large h-11 rounded-full bg-brand px-6 text-on-primary active:opacity-90"
			onclick={confirmSelection}
		>
			{hostT('common.confirm')}
		</button>
	{/snippet}
</BottomSheet>
