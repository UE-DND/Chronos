<script lang="ts">
	import { fromStore } from 'svelte/store';
	import type { ChronosUiView } from '../reactivity/chronos-ui-controller';
	import {
		AcademicCalendarService,
		computeTimetableWeekLayout,
		COURSE_PALETTE_ENTRIES,
		type CoursePaletteEntry
	} from '@chronos/core';
	import TimetablePreviewGrid from './TimetablePreviewGrid.svelte';
	import TimetableWallpaperLayer from './TimetableWallpaperLayer.svelte';
	import type { TimetableWallpaperFit } from './timetable-wallpaper-layer';

	interface Props {
		controller: ChronosUiView;
		displayedWeek?: number;
		coursePalette?: readonly CoursePaletteEntry[];
		hasDynamicBackground?: boolean;
		wallpaperUri?: string | null;
		interactive?: boolean;
		fit?: TimetableWallpaperFit;
	}

	let {
		controller,
		displayedWeek: propDisplayedWeek,
		coursePalette: propCoursePalette,
		hasDynamicBackground = false,
		wallpaperUri = null,
		interactive = false,
		fit = 'cover'
	}: Props = $props();

	const calendarService = new AcademicCalendarService();
	const ui = $derived(fromStore(controller.snapshot));
	const hostTranslate = (key: string) => controller.translatePlugin('host-ui', key);

	const timetable = $derived(ui.current.currentTimetable);
	const today = $derived(ui.current.todayIso);
	const academicWeek = $derived(
		timetable ? calendarService.calculateAcademicWeek(today, timetable.academicConfig) : null
	);
	const displayedWeek = $derived(propDisplayedWeek ?? ui.current.activeWeek ?? academicWeek ?? 1);
	const isCurrentWeek = $derived(displayedWeek === (academicWeek ?? ui.current.activeWeek ?? 1));
	const periodHighlightEnabled = $derived(
		ui.current.userPreferences?.currentPeriodHighlightEnabled ?? false
	);
	const currentPeriodIndex = $derived(ui.current.currentPeriodIndex);
	const layoutMode = $derived(ui.current.userPreferences?.timetableLayoutMode ?? 'compact');
	const capsuleCornerStyle = $derived(ui.current.userPreferences?.capsuleCornerStyle ?? 'sharp');
	const resolvedPalette = $derived(
		propCoursePalette && propCoursePalette.length > 0 ? propCoursePalette : COURSE_PALETTE_ENTRIES
	);
	const paletteCourses = $derived(timetable?.courses ?? []);
	const courseBadges = $derived(ui.current.courseBadges ?? {});

	const holidays = $derived.by(() => {
		void ui.current.calendarRevision;
		return timetable ? controller.resolveHolidays(timetable) : [];
	});

	const preview = $derived(
		timetable
			? computeTimetableWeekLayout({
					timetable,
					holidays,
					displayedWeek,
					todayIso: today,
					academicCalendarService: calendarService,
					coursePalette: resolvedPalette,
					paletteCourses,
					layoutMode,
					capsuleCornerStyle
				})
			: null
	);
	const gridModel = $derived(preview?.gridModel ?? null);
	const courseDisplayModels = $derived(preview?.courseDisplayModels ?? []);
</script>

{#if timetable && gridModel}
	<TimetableWallpaperLayer
		wallpaperUri={hasDynamicBackground && wallpaperUri ? wallpaperUri : null}
		{fit}
	>
		<TimetablePreviewGrid
			{displayedWeek}
			{gridModel}
			{courseDisplayModels}
			coursePalette={resolvedPalette}
			{paletteCourses}
			hasDynamicBackground={hasDynamicBackground && Boolean(wallpaperUri)}
			{layoutMode}
			{capsuleCornerStyle}
			{interactive}
			{isCurrentWeek}
			{currentPeriodIndex}
			{periodHighlightEnabled}
			{courseBadges}
			{hostTranslate}
		/>
	</TimetableWallpaperLayer>
{:else}
	<div class="flex min-h-[12rem] items-center justify-center p-8">
		<p class="text-body-medium text-center text-on-surface-variant">暂无课表，导入后可预览效果</p>
	</div>
{/if}
