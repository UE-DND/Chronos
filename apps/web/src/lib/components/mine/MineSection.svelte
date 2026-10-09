<script lang="ts">
	let {
		title,
		comfortable = false,
		children
	}: {
		title?: string;
		comfortable?: boolean;
		children?: import('svelte').Snippet;
	} = $props();
</script>

<section class="ui-section">
	{#if title}
		<h2 class="ui-section-title">{title}</h2>
	{/if}
	<div class={['ui-section-surface', comfortable && 'ui-section-surface--comfortable']}>
		{@render children?.()}
	</div>
</section>
