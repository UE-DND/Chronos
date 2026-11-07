<script lang="ts">
	interface SelectOption {
		label: string;
		value: string | number;
	}

	interface Props {
		id?: string;
		label: string;
		options?: SelectOption[];
		value?: string | number;
		disabled?: boolean;
		required?: boolean;
		description?: string;
		onValueChange?: (value: string | number | undefined) => void;
	}

	let {
		id,
		label,
		options = [],
		value = $bindable(),
		disabled = false,
		required = false,
		description = '',
		onValueChange
	}: Props = $props();

	const instanceId = $props.id();
	const inputId = $derived(id || instanceId);
</script>

<div class="ui-form-field">
	<label class="ui-field-label" for={inputId}>
		{label}
		{#if required}
			<span class="text-error">*</span>
		{/if}
	</label>

	<select
		id={inputId}
		{disabled}
		{required}
		bind:value={
			() => value ?? options[0]?.value ?? '',
			(nextValue) => {
				value = nextValue;
				onValueChange?.(nextValue);
			}
		}
		class="ui-form-field-input"
	>
		{#each options as opt (opt.value)}
			<option value={opt.value}>{opt.label}</option>
		{/each}
	</select>

	{#if description}
		<span class="text-body-small text-supporting text-on-surface-variant">{description}</span>
	{/if}
</div>
