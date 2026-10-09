<script lang="ts">
	import { hostT } from '#lib/i18n/host-i18n.svelte.ts';
	import { navigateForward } from '#lib/navigation/index.ts';
	import { getContext } from 'svelte';
	import type { AppShellController } from '#lib/app/app-shell.svelte.ts';
	import { trackEvent } from '#lib/client/analytics.ts';
	import CourseDetailScreen from '#lib/components/timetable/CourseDetailScreen.svelte';
	import BottomSheet from '#lib/components/ui/BottomSheet.svelte';
	import IconButton from '#lib/components/ui/IconButton.svelte';
	import { Edit } from '#lib/icons/index.ts';

	let {
		open = $bindable(false),
		courseId = $bindable<string | null>(null)
	}: {
		open?: boolean;
		courseId?: string | null;
	} = $props();

	const shell = getContext<AppShellController>('appShell');

	const course = $derived(
		courseId
			? (shell.controller.currentTimetable?.courses.find((entry) => entry.id === courseId) ?? null)
			: null
	);

	function handleOpenChangeComplete(isOpen: boolean) {
		if (!isOpen && !open) {
			courseId = null;
		}
	}

	function editCourse() {
		if (!course) return;
		trackEvent('course_editor_open', { trigger: 'detail_page' });
		void navigateForward(`/timetable/course-editor?courseId=${encodeURIComponent(course.id)}`);
	}
</script>

{#snippet editAction()}
	{#if course}
		<IconButton variant="standard" ariaLabel={hostT('route.courseEditAria')} onclick={editCourse}>
			<Edit class="size-[22px]" />
		</IconButton>
	{/if}
{/snippet}

<BottomSheet
	bind:open
	title={hostT('route.courseDetail')}
	actions={editAction}
	onOpenChangeComplete={handleOpenChangeComplete}
>
	<div class="p-4">
		{#key courseId}
			<CourseDetailScreen {shell} {courseId} />
		{/key}
	</div>
</BottomSheet>
