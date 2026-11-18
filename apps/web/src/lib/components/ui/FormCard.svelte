<script lang="ts">
	import type { Snippet } from 'svelte';
	import Card from '#lib/components/ui/Card.svelte';

	let {
		variant = 'outlined',
		dividers = false,
		children,
		class: className = ''
	}: {
		variant?: 'outlined' | 'plain';
		dividers?: boolean;
		children?: Snippet;
		class?: string;
	} = $props();

	const contentClass = $derived(
		dividers ? `divide-y divide-outline-variant/40 ${className}` : className
	);
</script>

{#if variant === 'plain'}
	<div class={contentClass}>
		{@render children?.()}
	</div>
{:else}
	<Card variant="outlined" flush class="overflow-hidden {contentClass}">
		{@render children?.()}
	</Card>
{/if}
