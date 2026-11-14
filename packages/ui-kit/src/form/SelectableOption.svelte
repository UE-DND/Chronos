<script lang="ts">
	import { onDestroy } from 'svelte';
	import Radio from './Radio.svelte';

	let {
		name,
		selected,
		disabled = false,
		onclick,
		label,
		description
	}: {
		name: string;
		selected: boolean;
		disabled?: boolean;
		onclick: () => void;
		label: string;
		description?: string;
	} = $props();

	const instanceId = $props.id();
	let pendingSelection: ReturnType<typeof setTimeout> | undefined;

	function select(event: MouseEvent) {
		event.preventDefault();
		if (disabled) return;
		clearTimeout(pendingSelection);
		// Wait for canceled activation to restore the group before Svelte applies the parent's value.
		pendingSelection = setTimeout(() => {
			pendingSelection = undefined;
			if (!disabled) onclick();
		}, 0);
	}

	onDestroy(() => clearTimeout(pendingSelection));
</script>

<label
	class="flex min-h-[56px] w-full items-center gap-3.5 rounded-2xl border-2 p-4 text-left transition-colors duration-200 has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-brand {disabled
		? 'cursor-not-allowed border-outline-variant/40 bg-surface/50 opacity-40'
		: selected
			? 'cursor-pointer border-brand bg-primary-container/30'
			: 'ui-row-state cursor-pointer border-outline-variant/60 bg-surface'}"
>
	<Radio
		{name}
		checked={selected}
		{disabled}
		onclick={select}
		aria-labelledby="{instanceId}-label"
		aria-describedby={description ? `${instanceId}-description` : undefined}
	/>
	<span class="flex flex-col justify-center">
		<span id="{instanceId}-label" class="text-body-large font-semibold text-on-surface"
			>{label}</span
		>
		{#if description}
			<span
				id="{instanceId}-description"
				class="text-body-small text-supporting mt-0.5 text-on-surface-variant">{description}</span
			>
		{/if}
	</span>
</label>
