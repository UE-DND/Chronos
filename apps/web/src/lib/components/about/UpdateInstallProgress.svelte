<script lang="ts">
	import { hostT } from '$lib/i18n/host-i18n.svelte';
	import type { InstallPhase } from '$lib/content/releases/update-state.svelte';

	let {
		phase,
		percent
	}: {
		phase: InstallPhase;
		percent: number | null;
	} = $props();

	const clampedPercent = $derived(percent === null ? null : Math.max(0, Math.min(100, percent)));

	const phaseLabel = $derived.by(() => {
		switch (phase) {
			case 'downloading':
				return hostT('about.update.phase.downloading');
			case 'installing':
				return hostT('about.update.phase.installing');
			case 'restarting':
				return hostT('about.update.phase.restarting');
			default:
				return hostT('about.update.installing');
		}
	});
</script>

<div class="flex flex-col gap-3 rounded-2xl bg-surface-container px-4 py-5">
	<div class="flex items-center justify-between gap-3">
		<p class="text-body-medium text-on-surface">{phaseLabel}</p>
		{#if clampedPercent !== null}
			<span class="text-caption font-mono text-primary">{clampedPercent}%</span>
		{/if}
	</div>
	<div
		class="h-1.5 overflow-hidden rounded-full bg-surface-variant/80"
		role="progressbar"
		aria-valuemin={0}
		aria-valuemax={100}
		aria-label={phaseLabel}
		aria-valuenow={clampedPercent ?? undefined}
	>
		{#if clampedPercent === null}
			<div class="progress-indeterminate h-full rounded-full bg-primary"></div>
		{:else}
			<div
				class="h-full rounded-full bg-primary transition-[width] duration-200"
				style:width="{clampedPercent}%"
			></div>
		{/if}
	</div>
</div>

<style>
	.progress-indeterminate {
		width: 35%;
		animation: update-progress 1.4s ease-in-out infinite;
	}

	@keyframes update-progress {
		from {
			transform: translateX(-100%);
		}
		to {
			transform: translateX(285%);
		}
	}

	@media (prefers-reduced-motion: reduce) {
		.progress-indeterminate {
			animation: none;
			transform: translateX(90%);
		}
	}
</style>
