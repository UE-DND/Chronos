<script lang="ts">
	import { untrack } from 'svelte';
	import { COURSE_PALETTE_ENTRIES } from '@chronos/core';
	import { hostT } from '$lib/i18n/host-i18n.svelte';
	import { CalendarMonthFill, Person } from '$lib/icons';
	import TimetableGrid from '$lib/components/timetable/TimetableGrid.svelte';
	import TimetableEditBar from '$lib/components/timetable/TimetableEditBar.svelte';
	import WeekDeleteConfirmation from '$lib/components/timetable/WeekDeleteConfirmation.svelte';
	import { attachDemoMotion, createLongPressTimeline } from './demo-motion';
	import { createLongPressDemo } from './long-press-demo.svelte';

	let { active = true }: { active?: boolean } = $props();
	const demo = createLongPressDemo(() => ({
		primary: hostT('onboarding.longPress.coursePrimary'),
		secondary: hostT('onboarding.longPress.courseSecondary')
	}));
	const state = $derived(demo.state);
	function animateDemo(node: HTMLElement) {
		if (!active) return;
		return untrack(() => {
			const stop = attachDemoMotion(
				node,
				(root) => createLongPressTimeline(root, demo),
				(reduced) => {
					demo.reset();
					if (reduced) demo.interaction.enterEdit();
				}
			);
			return () => {
				stop();
				demo.destroy();
			};
		});
	}
	function ignoreAction() {}
</script>

<p class="text-body-small max-w-sm text-center text-on-surface-variant">
	{hostT('onboarding.longPress.description')}
</p>
<div
	{@attach animateDemo}
	class="demo rounded-3xl border border-outline-variant bg-surface text-on-surface shadow-raised"
	aria-hidden="true"
	inert
>
	<div class="text-label-large px-4 pt-3 pb-1 font-semibold">
		{hostT('timetable.week.label', { week: 1, today: '' })}
	</div>
	<div class="grid-area min-h-0 flex-1">
		<TimetableGrid
			displayedWeek={1}
			isCurrentWeek={false}
			currentPeriodIndex={null}
			gridModel={state.layout.gridModel}
			courseDisplayModels={state.layout.courseDisplayModels}
			hasDynamicBackground={false}
			coursePalette={COURSE_PALETTE_ENTRIES}
			paletteCourses={state.timetable.courses}
			layoutMode="compact"
			interaction={demo.interaction}
			drop={demo.drop}
			interactive={false}
			{active}
		/>
	</div>
	<div class="demo-toolbar border-t border-outline-variant bg-surface-container px-2">
		{#if demo.interaction.isEditing}
			<TimetableEditBar
				isDragging={demo.interaction.isDragging}
				isDragOverDeleteZone={demo.interaction.drag?.overDeleteZone ?? false}
				hasTimetable={true}
				onEdit={ignoreAction}
				onAdd={ignoreAction}
				onLayout={ignoreAction}
			/>
		{:else}
			<div class="toolbar-view flex h-full items-center justify-around">
				<span class="rounded-full bg-primary-container px-5 py-1 text-on-primary-container"
					><CalendarMonthFill class="size-6" /></span
				>
				<Person class="size-6 text-on-surface-variant" />
			</div>
		{/if}
	</div>
	<div class="confirm-overlay" class:open={state.pendingDelete !== null}>
		<div class="confirm-sheet">
			<WeekDeleteConfirmation
				courseName={state.pendingDelete?.name ?? hostT('onboarding.longPress.coursePrimary')}
				week={1}
				onCancel={ignoreAction}
				onConfirm={ignoreAction}
			/>
		</div>
	</div>
	<div class="touch-indicator"><span></span></div>
</div>

<style>
	.demo {
		position: relative;
		display: flex;
		flex-direction: column;
		width: min(100%, 23rem);
		height: clamp(18rem, 51dvh, 23rem);
		min-height: 18rem;
		flex-shrink: 0;
		overflow: hidden;
		isolation: isolate;
	}
	.demo-toolbar {
		height: 3.5rem;
		flex: none;
	}
	.touch-indicator {
		position: absolute;
		z-index: 6;
		top: 0;
		left: 0;
		width: 2.2rem;
		height: 2.2rem;
		margin: -1.1rem;
		border: 2px solid var(--color-primary);
		box-shadow: 0 0 0 2px var(--color-surface);
		border-radius: 50%;
		background: color-mix(in srgb, var(--color-primary) 14%, transparent);
		opacity: 0;
		pointer-events: none;
	}
	.touch-indicator span {
		position: absolute;
		inset: 0.7rem;
		border-radius: 50%;
		background: var(--color-primary);
	}
	.confirm-overlay {
		position: absolute;
		z-index: 5;
		inset: 0;
		opacity: 0;
		visibility: hidden;
		pointer-events: none;
		background: color-mix(in srgb, var(--color-on-surface) 32%, transparent);
		transition:
			opacity 200ms,
			visibility 200ms;
	}
	.confirm-overlay.open {
		opacity: 1;
		visibility: visible;
	}
	.confirm-overlay.open .confirm-sheet {
		transform: translateY(0);
	}
	.confirm-sheet {
		transform: translateY(100%);
		transition: transform 300ms cubic-bezier(0.2, 0, 0, 1);
		position: absolute;
		inset-inline: 0;
		bottom: 0;
	}
	.demo:global(.demo-reduced) .confirm-overlay {
		display: none;
	}
</style>
