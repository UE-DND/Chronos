<script lang="ts">
	import { staticPath } from '#lib/config/static-path.ts';

	let {
		title = '',
		subtitle = '',
		titleId
	}: {
		title?: string;
		subtitle?: string;
		titleId?: string;
	} = $props();
</script>

<div class="flex flex-col items-center gap-3 py-4 text-center">
	<img
		src={staticPath('/chronos-icon.svg')}
		alt="Chronos"
		class="h-20 w-20 rounded-2xl shadow-raised ring-1 ring-black/5 dark:ring-white/10"
	/>
	{#if title || subtitle}
		<div class="flex flex-col items-center gap-1">
			{#if title}
				<h1 id={titleId} class="text-headline-small font-semibold text-on-surface">{title}</h1>
			{/if}
			{#if subtitle}
				<p class="text-body-small text-on-surface-variant">{subtitle}</p>
			{/if}
		</div>
	{/if}
</div>
