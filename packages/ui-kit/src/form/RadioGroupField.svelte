<script lang="ts">
	import SelectableOption from './SelectableOption.svelte';

	interface Option {
		label: string;
		value: string | number;
		description?: string;
	}

	let {
		id,
		name,
		label,
		description,
		options = [],
		value,
		disabled = false,
		required = false,
		onValueChange
	}: {
		id?: string;
		name?: string;
		label: string;
		description?: string;
		options?: Option[];
		value?: string | number;
		disabled?: boolean;
		required?: boolean;
		onValueChange?: (value: string | number) => void;
	} = $props();

	const instanceId = $props.id();
	const fieldName = $derived(name ?? id ?? instanceId);
</script>

<fieldset class="flex min-w-0 flex-col gap-3" {disabled}>
	<legend class="text-title-medium px-1 text-on-surface">
		{label}
		{#if required}
			<span class="ml-0.5 text-error">*</span>
		{/if}
	</legend>
	<div class="px-1">
		{#if description}
			<p class="text-body-small text-supporting mt-1 text-on-surface-variant">{description}</p>
		{/if}
	</div>

	<div class="flex flex-col gap-2.5">
		{#each options as option (option.value)}
			<SelectableOption
				name={fieldName}
				label={option.label}
				description={option.description}
				selected={value === option.value}
				{disabled}
				onclick={() => onValueChange?.(option.value)}
			/>
		{/each}
	</div>
</fieldset>
