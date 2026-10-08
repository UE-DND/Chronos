<script lang="ts">
	import type { Snippet } from 'svelte';
	import { hostT } from '$lib/i18n/host-i18n.svelte';
	import Button from '$lib/components/ui/Button.svelte';

	let {
		courseName,
		week,
		onCancel,
		onConfirm,
		children
	}: {
		courseName: string;
		week: number;
		onCancel: () => void;
		onConfirm: () => void;
		children?: Snippet<[{ title: string; description: string; footer: Snippet }]>;
	} = $props();

	const title = $derived(hostT('timetable.deleteWeek.title'));
	const description = $derived(hostT('timetable.deleteWeek.desc', { name: courseName, week }));
</script>

{#snippet footer()}
	<Button variant="text" onclick={onCancel}>
		{hostT('common.cancel')}
	</Button>
	<Button variant="filled" onclick={onConfirm}>
		{hostT('common.delete')}
	</Button>
{/snippet}

{#if children}
	{@render children({ title, description, footer })}
{:else}
	<div
		class="rounded-t-sheet flex min-h-0 flex-col overflow-hidden bg-surface-container-high text-on-surface shadow-overlay"
	>
		<div class="flex shrink-0 items-center gap-3 px-6 pt-6 pb-2">
			<h2
				class="text-title-large min-w-0 flex-1 text-center font-medium text-on-surface outline-none"
			>
				{title}
			</h2>
		</div>
		<div class="shrink-0 px-6 pb-5">
			<p class="text-body-medium text-center leading-relaxed text-on-surface-variant">
				{description}
			</p>
		</div>
		<div
			class="flex w-full shrink-0 items-center justify-stretch gap-3 border-t border-outline-variant/40 ps-6 pe-[calc(1.5rem+var(--tabbar-inline-safe,0px))] pt-4 pb-[calc(var(--tabbar-block-safe,0px)+0.75rem)] [&>button]:flex-1"
		>
			{@render footer()}
		</div>
	</div>
{/if}
