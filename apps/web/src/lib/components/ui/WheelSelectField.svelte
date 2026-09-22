<script lang="ts">
	import { tick } from 'svelte';
	import { PickerWheel, type PickerWheelOption } from '@chronos/ui-kit';
	import { hostT } from '$lib/i18n/host-i18n.svelte';
	import BottomSheet from './BottomSheet.svelte';

	let {
		label,
		value = '',
		options,
		placeholder,
		disabled = false,
		required = false,
		onValueChange,
		id
	}: {
		label: string;
		value?: string;
		options: PickerWheelOption[];
		placeholder: string;
		disabled?: boolean;
		required?: boolean;
		onValueChange?: (value: string) => void;
		id?: string;
	} = $props();

	const instanceId = $props.id();
	const fieldId = $derived(id ?? instanceId);
	const selectedLabel = $derived(options.find((option) => option.value === value)?.label ?? '');
	let open = $state(false);
	let draftValue = $state('');
	let wheel: PickerWheel | null = $state(null);

	function openPicker() {
		if (disabled || options.length === 0) return;
		draftValue = options.some((option) => option.value === value)
			? value
			: (options[0]?.value ?? '');
		open = true;
		void tick().then(() => wheel?.scrollToValue());
	}

	function confirmSelection() {
		const next = wheel?.commitDraft() ?? draftValue;
		if (next && next !== value) onValueChange?.(next);
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
			class="ui-date-field-value text-body-large truncate text-left {selectedLabel
				? 'text-on-surface'
				: 'text-on-surface-variant'}"
		>
			{selectedLabel || placeholder}
		</span>
		<span class="ui-date-field-trigger" aria-hidden="true">
			<svg class="size-5" viewBox="0 0 24 24" fill="currentColor">
				<path d="m7 10 5 5 5-5z" />
			</svg>
		</span>
	</button>
</div>

<BottomSheet bind:open title={label}>
	<div class="px-4 pt-1 pb-2">
		<PickerWheel
			bind:this={wheel}
			bind:value={draftValue}
			{options}
			{label}
			idPrefix={`wheel-select-${fieldId}`}
		/>
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
