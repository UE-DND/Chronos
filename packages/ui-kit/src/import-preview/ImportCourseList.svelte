<script lang="ts">
	import type { Course, CoursePaletteEntry } from '@chronos/core';
	import {
		assignCourseDisplayColors,
		COURSE_PALETTE_ENTRIES,
		listDistinctCourses,
		lookupCoursePaint
	} from '@chronos/core';

	let {
		courses,
		coursePalette = COURSE_PALETTE_ENTRIES,
		initialVisibleCount = 8,
		expandLabel = (remaining: number) => `Show ${remaining} more`,
		collapseLabel = 'Show less'
	}: {
		courses: Course[];
		coursePalette?: readonly CoursePaletteEntry[];
		initialVisibleCount?: number;
		expandLabel?: (remaining: number) => string;
		collapseLabel?: string;
	} = $props();

	let expanded = $state(false);
	const distinctCourses = $derived(listDistinctCourses(courses));
	const paintsByName = $derived(assignCourseDisplayColors(courses, coursePalette));
	const canCollapse = $derived(
		initialVisibleCount > 0 && distinctCourses.length > initialVisibleCount
	);
	const visibleCourses = $derived(
		canCollapse && !expanded ? distinctCourses.slice(0, initialVisibleCount) : distinctCourses
	);
	const remainingCount = $derived(Math.max(0, distinctCourses.length - visibleCourses.length));
</script>

{#if distinctCourses.length > 0}
	<div>
		<ul class="flex flex-wrap gap-2" role="list">
			{#each visibleCourses as course (course.name)}
				{@const paint = lookupCoursePaint(paintsByName, { name: course.name }, coursePalette)}
				<li
					class="course-capsule text-body-small inline-flex max-w-full items-center rounded-capsule border px-2.5 py-1"
					style:--capsule={paint.background}
					style:--capsule-fg={paint.foreground}
					title={course.name}
				>
					<span class="truncate">{course.name}</span>
				</li>
			{/each}
		</ul>

		{#if canCollapse}
			<button
				type="button"
				class="text-label-large -ms-2.5 mt-2.5 inline-flex min-h-9 cursor-pointer items-center gap-1 rounded-control px-2.5 py-1 text-brand transition-colors hover:bg-brand/10 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand active:bg-brand/15"
				aria-expanded={expanded}
				onclick={() => (expanded = !expanded)}
			>
				<span>{expanded ? collapseLabel : expandLabel(remainingCount)}</span>
				<svg
					class={[
						'import-course-chevron size-4 shrink-0 transition-transform duration-150 motion-reduce:transition-none',
						expanded && 'rotate-180'
					]}
					viewBox="0 0 24 24"
					fill="currentColor"
					aria-hidden="true"
				>
					<path d="M7.41 8.59 12 13.17l4.59-4.58L18 10l-6 6-6-6z" />
				</svg>
			</button>
		{/if}
	</div>
{/if}

<style>
	:global(:root.reduce-motion) .import-course-chevron {
		transition: none;
	}
</style>
