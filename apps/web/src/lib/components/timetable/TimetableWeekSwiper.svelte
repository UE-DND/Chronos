<script lang="ts">
	import { getContext, untrack } from 'svelte';
	import type { Attachment } from 'svelte/attachments';
	import type { AppShellController } from '#lib/app/app-shell.svelte.ts';
	import { trackEvent } from '#lib/client/analytics.ts';
	import type { CapsuleCornerStyle, TimetableLayoutMode } from '@chronos/core';
	import type { CoursePaletteEntry } from '@chronos/core';
	import type { TimetableScreenController } from '#lib/timetable/timetable-screen.svelte.ts';
	import { shouldPaintPagerWeek } from '#lib/timetable/week-navigation.ts';
	import { createWeekPagerController } from '#lib/timetable/week-pager-controller.svelte.ts';
	import type { CapsulePagerPreview } from '#lib/timetable/capsule-pager-preview.ts';
	import TimetableGrid from './TimetableGrid.svelte';

	let {
		screen,
		hasDynamicBackground,
		coursePalette,
		layoutMode,
		capsuleCornerStyle = 'sharp',
		active = true,
		onCourseClick,
		pagerPreview
	}: {
		screen: TimetableScreenController;
		hasDynamicBackground: boolean;
		coursePalette: readonly CoursePaletteEntry[];
		layoutMode: TimetableLayoutMode;
		capsuleCornerStyle?: CapsuleCornerStyle;
		active?: boolean;
		onCourseClick: (courseId: string) => void;
		pagerPreview?: CapsulePagerPreview;
	} = $props();

	const shell = getContext<AppShellController>('appShell');
	const screenState = $derived(screen.state);
	const weeks = $derived(screenState.weeks);
	const periodHighlightEnabled = $derived(
		shell.controller.userPreferences?.currentPeriodHighlightEnabled ?? false
	);
	const allowPagerTouch = $derived(!screenState.isEditing);

	const pager = createWeekPagerController({
		setPreview: (week) => pagerPreview?.setPreview(week),
		clearPreview: () => pagerPreview?.clearPreview(),
		setDisplayedWeek: (week) => screen.setDisplayedWeek(week),
		onFirstMove: () => screen.interaction.notePagerFirstMove(),
		onCompleted: () => trackEvent('timetable_week_swipe')
	});
	$effect(() => {
		const context = {
			timetableId: screenState.currentTimetable?.id ?? null,
			startWeek: screenState.startWeek,
			endWeek: screenState.endWeek,
			displayedWeek: screenState.displayedWeek,
			active,
			allowTouch: allowPagerTouch
		};
		untrack(() => {
			pager.sync(context);
			screen.drop.sync({
				timetableId: context.timetableId,
				week: context.displayedWeek,
				active: context.active
			});
		});
	});
	const pagerAttach: Attachment<HTMLDivElement> = (node) =>
		untrack(() => {
			pager.sync({
				timetableId: screen.state.currentTimetable?.id ?? null,
				startWeek: screen.state.startWeek,
				endWeek: screen.state.endWeek,
				displayedWeek: screen.state.displayedWeek,
				active,
				allowTouch: allowPagerTouch
			});
			return pager.attach(node);
		});
</script>

<!-- svelte-ignore a11y_no_static_element_interactions -->
<div
	class="timetable-week-pager"
	class:timetable-week-pager-locked={!allowPagerTouch}
	class:timetable-week-pager-pending={!pager.state.ready}
	{@attach pagerAttach}
>
	{#each weeks as week (week)}
		<div class="timetable-week-page">
			{#if shouldPaintPagerWeek(week, pager.state.paintWeek || screenState.displayedWeek, pager.state.paintAdjacent, pager.state.paintRadius)}
				{@const gridModel = screenState.weekGridModels.get(week)}
				{@const courseModels = screenState.weekCourseDisplayModels.get(week) ?? []}
				{#if gridModel}
					<TimetableGrid
						displayedWeek={week}
						isCurrentWeek={week === screenState.academicWeek}
						currentPeriodIndex={screenState.currentPeriodIndex}
						scrollPeriodIndex={screenState.scrollPeriodIndex}
						{periodHighlightEnabled}
						expandedSlots={screenState.expandedSlots}
						onExpandSlot={(slotKey) => screen.expandSlot(slotKey)}
						interaction={screen.interaction}
						drop={screen.drop}
						{active}
						{gridModel}
						courseDisplayModels={courseModels}
						courseBadges={shell.controller.courseBadges}
						{hasDynamicBackground}
						{coursePalette}
						paletteCourses={screenState.currentTimetable?.courses}
						{layoutMode}
						{capsuleCornerStyle}
						onCourseClick={(course) => onCourseClick(course.id)}
						onRequestWeekDelete={(course, week) => screen.requestWeekDelete(course, week)}
					/>
				{/if}
			{/if}
		</div>
	{/each}
</div>

<style>
	.timetable-week-pager {
		display: grid;
		grid-auto-flow: column;
		grid-auto-columns: 100%;
		flex: 1;
		min-height: 0;
		height: 100%;
		width: 100%;
		overflow-x: auto;
		overflow-y: hidden;
		scroll-snap-type: x mandatory;
		overscroll-behavior: contain;
		-webkit-overflow-scrolling: touch;
		touch-action: pan-y;
	}

	.timetable-week-pager-locked {
		overflow-x: hidden;
		touch-action: pan-y;
	}

	.timetable-week-pager-pending {
		visibility: hidden;
	}

	.timetable-week-page {
		height: 100%;
		overflow: hidden;
		scroll-snap-align: start;
		scroll-snap-stop: always;
	}
</style>
