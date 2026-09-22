<script lang="ts">
	import { hostT } from '$lib/i18n/host-i18n.svelte';
	import type { TimetableScreenController } from '$lib/timetable/timetable-screen.svelte';
	import { timetableDayLabel } from '$lib/timetable/day-labels';
	import type { AppShellController } from '$lib/app/app-shell.svelte';
	import { dayOfWeekFromIso } from '@chronos/core';
	import { getContext } from 'svelte';
	import TopAppBar from '$lib/components/TopAppBar.svelte';
	import { createCapsulePagerPreview } from '$lib/timetable/capsule-pager-preview';
	import TimetableWeekSwiper from './TimetableWeekSwiper.svelte';
	import TimetableCapsuleIndicator from './TimetableCapsuleIndicator.svelte';
	import Button from '$lib/components/ui/Button.svelte';
	import BottomSheet from '$lib/components/ui/BottomSheet.svelte';

	let {
		screen,
		active = true,
		onCourseClick
	}: {
		screen: TimetableScreenController;
		active?: boolean;
		onCourseClick: (courseId: string) => void;
	} = $props();

	const screenState = $derived(screen.state);
	const shell = getContext<AppShellController>('appShell');

	import { extractAdaptiveChromeColors, type AdaptiveChromeResult } from '@chronos/core';
	import { getWallpaperBitmap } from '$lib/wallpaper/wallpaper-theme';

	const coursePalette = $derived(shell.appearance.coursePalette);
	const hasWallpaper = $derived(shell.state.hasWallpaper);
	const wallpaperUri = $derived(shell.state.wallpaperUri);
	const isDark = $derived(shell.state.isDark);
	const wallpaperMaskEnabled = $derived(
		shell.controller.userPreferences?.wallpaperMaskEnabled ?? true
	);
	const layoutMode = $derived(shell.state.effectiveTimetableLayoutMode);
	const capsuleCornerStyle = $derived(
		shell.controller.userPreferences?.capsuleCornerStyle ?? 'sharp'
	);

	let containerEl = $state<HTMLDivElement | undefined>();
	let adaptiveColors = $state<AdaptiveChromeResult | null>(null);

	$effect(() => {
		if (!hasWallpaper || wallpaperMaskEnabled || !wallpaperUri) {
			adaptiveColors = null;
			return;
		}

		const currentUri = wallpaperUri;
		const ac = new AbortController();
		getWallpaperBitmap(currentUri, ac.signal)
			.then((bitmap) => {
				if (ac.signal.aborted) return;
				const viewportWidth =
					containerEl?.clientWidth || (typeof window !== 'undefined' ? window.innerWidth : 375);
				const viewportHeight =
					containerEl?.clientHeight || (typeof window !== 'undefined' ? window.innerHeight : 667);
				const result = extractAdaptiveChromeColors(bitmap.pixels, bitmap.width, bitmap.height, {
					viewportWidth,
					viewportHeight,
					isDark
				});
				if (!ac.signal.aborted && wallpaperUri === currentUri) {
					adaptiveColors = result;
				}
			})
			.catch(() => {
				if (!ac.signal.aborted && wallpaperUri === currentUri) {
					adaptiveColors = null;
				}
			});

		return () => ac.abort();
	});

	const adaptiveStyle = $derived.by(() => {
		if (!adaptiveColors) return '';
		const { topBar, sidebar } = adaptiveColors;
		return (
			`--adaptive-top-fg: ${topBar.fg}; ` +
			`--adaptive-top-fg-sub: ${topBar.fgSub}; ` +
			`--adaptive-top-shadow: ${topBar.textShadow}; ` +
			`--adaptive-side-fg: ${sidebar.fg}; ` +
			`--adaptive-side-fg-sub: ${sidebar.fgSub}; ` +
			`--adaptive-side-shadow: ${sidebar.textShadow};`
		);
	});

	const pendingWeekDelete = $derived(screen.pendingWeekDelete);
	let weekDeleteSheetOpen = $state(false);
	const pagerPreview = createCapsulePagerPreview();

	const displayedWeekNumber = $derived(screenState.displayedWeek);
	const headerTodayLabel = $derived(
		displayedWeekNumber === screenState.academicWeek
			? timetableDayLabel(dayOfWeekFromIso(screenState.today))
			: ''
	);
	const weekLabel = $derived(
		hostT('timetable.week.label', {
			week: displayedWeekNumber,
			today: headerTodayLabel ? ` ${headerTodayLabel}` : ''
		})
	);

	$effect(() => {
		if (pendingWeekDelete) weekDeleteSheetOpen = true;
	});

	function onWindowKeydown(event: KeyboardEvent) {
		if (event.key !== 'Escape' || !screenState.isEditing) return;
		if (event.defaultPrevented) return;
		const target = event.target;
		if (
			target instanceof Element &&
			target.closest('[data-dialog-content], [data-dialog-overlay]')
		) {
			return;
		}
		screen.setEditing(false);
	}

	$effect(() => {
		if (!active && screenState.isEditing) {
			screen.setEditing(false);
		}
	});
</script>

<svelte:window onkeydown={active ? onWindowKeydown : undefined} />

<div class="relative flex h-[calc(100dvh-var(--bottom-bar-height))] flex-col">
	<TopAppBar class="timetable-week-top-bar shrink-0">
		{#snippet titleSnippet()}
			<div class="flex min-h-0 flex-1 items-center py-0.5 text-left sm:py-1" aria-label={weekLabel}>
				<p class="text-title-large truncate leading-tight">
					{weekLabel}
				</p>
			</div>
		{/snippet}
	</TopAppBar>

	<div
		bind:this={containerEl}
		class="relative flex min-h-0 w-full flex-1 flex-col overflow-hidden"
		data-wallpaper-mask={wallpaperMaskEnabled ? 'true' : 'false'}
		data-has-wallpaper={hasWallpaper ? 'true' : 'false'}
		style={adaptiveStyle || undefined}
	>
		{#key screenState.currentTimetable?.id}
			<TimetableWeekSwiper
				{screen}
				{active}
				hasDynamicBackground={hasWallpaper}
				{coursePalette}
				{layoutMode}
				{capsuleCornerStyle}
				{onCourseClick}
				{pagerPreview}
			/>
		{/key}
	</div>

	{#if !screenState.isEditing && screenState.currentTimetable}
		<TimetableCapsuleIndicator {screen} {pagerPreview} />
	{/if}
</div>

{#if pendingWeekDelete}
	<BottomSheet
		bind:open={weekDeleteSheetOpen}
		showHandle={false}
		onOpenChangeComplete={(isOpen) => {
			if (!isOpen) screen.cancelWeekDelete();
		}}
		title={hostT('timetable.deleteWeek.title')}
		description={hostT('timetable.deleteWeek.desc', {
			name: pendingWeekDelete.course.name,
			week: pendingWeekDelete.week
		})}
	>
		{#snippet footer()}
			<Button variant="text" onclick={() => (weekDeleteSheetOpen = false)}>
				{hostT('common.cancel')}
			</Button>
			<Button variant="filled" onclick={() => void screen.confirmWeekDelete()}>
				{hostT('common.delete')}
			</Button>
		{/snippet}
	</BottomSheet>
{/if}
