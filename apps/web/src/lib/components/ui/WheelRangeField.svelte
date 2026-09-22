<script lang="ts">
	import { tick } from 'svelte';
	import { PickerWheel, type PickerWheelOption } from '@chronos/ui-kit';
	import { hostT } from '$lib/i18n/host-i18n.svelte';
	import BottomSheet from './BottomSheet.svelte';

	let {
		label,
		startLabel,
		endLabel,
		startValue = '',
		endValue = '',
		options,
		placeholder,
		disabled = false,
		required = false,
		onValueChange,
		id
	}: {
		label: string;
		startLabel: string;
		endLabel: string;
		startValue?: string;
		endValue?: string;
		options: PickerWheelOption[];
		placeholder: string;
		disabled?: boolean;
		required?: boolean;
		onValueChange?: (startValue: string, endValue: string) => void;
		id?: string;
	} = $props();

	const instanceId = $props.id();
	const fieldId = $derived(id ?? instanceId);
	const startDisplay = $derived(options.find((option) => option.value === startValue)?.label ?? '');
	const endDisplay = $derived(options.find((option) => option.value === endValue)?.label ?? '');
	const displayValue = $derived(
		startDisplay && endDisplay ? `${startDisplay} – ${endDisplay}` : placeholder
	);
	const availableEndOptions = $derived(
		options.filter((option) => Number(option.value) >= Number(draftStart))
	);
	let open = $state(false);
	let draftStart = $state('');
	let draftEnd = $state('');
	let startWheel: PickerWheel | null = $state(null);
	let endWheel: PickerWheel | null = $state(null);

	function validOption(value: string): boolean {
		return options.some((option) => option.value === value);
	}

	function openPicker() {
		if (disabled || options.length === 0) return;
		draftStart = validOption(startValue) ? startValue : (options[0]?.value ?? '');
		draftEnd =
			validOption(endValue) && Number(endValue) >= Number(draftStart) ? endValue : draftStart;
		open = true;
		void tick().then(() => {
			startWheel?.scrollToValue();
			endWheel?.scrollToValue();
		});
	}

	function handleStartChange(next: string) {
		if (Number(draftEnd) >= Number(next)) return;
		draftEnd = next;
		void tick().then(() => endWheel?.scrollToValue());
	}

	function confirmSelection() {
		const nextStart = startWheel?.commitDraft() ?? draftStart;
		let nextEnd = endWheel?.commitDraft() ?? draftEnd;
		if (Number(nextEnd) < Number(nextStart)) nextEnd = nextStart;
		if (nextStart && nextEnd) onValueChange?.(nextStart, nextEnd);
		open = false;
	}
</script>

<div class="ui-form-field">
	<button
		type="button"
		id="{fieldId}-label"
		class="ui-field-label cursor-pointer border-0 bg-transparent p-0 text-left"
		{disabled}
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
		disabled={disabled || options.length === 0}
		onclick={openPicker}
	>
		<span
			class="ui-date-field-value text-body-large truncate text-left {startDisplay && endDisplay
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
	<div class="grid grid-cols-2 gap-3 px-4 pt-1 pb-2">
		<div class="flex min-w-0 flex-col gap-1">
			<span class="text-label-small px-1 text-center text-on-surface-variant">{startLabel}</span>
			<PickerWheel
				bind:this={startWheel}
				bind:value={draftStart}
				{options}
				label={`${label}·${startLabel}`}
				idPrefix={`wheel-range-start-${fieldId}`}
				onValueChange={handleStartChange}
			/>
		</div>
		<div class="flex min-w-0 flex-col gap-1">
			<span class="text-label-small px-1 text-center text-on-surface-variant">{endLabel}</span>
			<PickerWheel
				bind:this={endWheel}
				bind:value={draftEnd}
				options={availableEndOptions}
				label={`${label}·${endLabel}`}
				idPrefix={`wheel-range-end-${fieldId}`}
			/>
		</div>
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
