<script lang="ts">
	import { onMount } from 'svelte';
	import TopAppBar from '#lib/components/TopAppBar.svelte';
	import { ArrowBack } from '#lib/icons/index.ts';
	import { hostT } from '#lib/i18n/host-i18n.svelte.ts';
	import { warmupRouteMotion } from '#lib/navigation/route-motion-warmup.ts';

	let { onready }: { onready: () => void } = $props();
	let root: HTMLDivElement;

	onMount(() =>
		warmupRouteMotion(root, document.querySelector<HTMLElement>('.shell-root'), onready)
	);
</script>

<!-- The native splash covers this real, painted surface. Hidden/offscreen content can be culled. -->
<div bind:this={root} class="pointer-events-none fixed inset-0 z-[9997]" inert aria-hidden="true">
	<div class="secondary-page relative flex h-dvh flex-col overflow-hidden bg-canvas text-ink">
		<TopAppBar title={hostT('route.displaySettings')}>
			{#snippet leading()}
				<span class="ui-icon-button inline-flex items-center justify-center rounded-control">
					<ArrowBack class="size-6 text-on-surface" />
				</span>
			{/snippet}
		</TopAppBar>
		<div class="mx-auto flex w-full max-w-lg flex-col gap-5 p-4">
			{#each [0, 1, 2, 3] as section (section)}
				<div class="ui-section-surface h-32"></div>
			{/each}
		</div>
	</div>
</div>
