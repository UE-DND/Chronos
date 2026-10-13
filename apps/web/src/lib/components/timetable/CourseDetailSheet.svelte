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
	import type { Timetable } from '@chronos/core';
	import { getAppEngine } from '#lib/services/app-engine.ts';
	import LoadingIndicator from '#lib/components/ui/LoadingIndicator.svelte';

	let {
		open = $bindable(false),
		courseId = $bindable<string | null>(null),
		timetableId = $bindable<string | null>(null)
	}: {
		open?: boolean;
		courseId?: string | null;
		timetableId?: string | null;
	} = $props();

	const shell = getContext<AppShellController>('appShell');
	let loadedTimetable = $state.raw<Timetable | null>(null);
	let loading = $state(false);
	let loadFailed = $state(false);
	const timetable = $derived(
		timetableId && timetableId !== shell.controller.currentTimetable?.id
			? loadedTimetable
			: shell.controller.currentTimetable
	);

	$effect(() => {
		const id = timetableId;
		const activeId = shell.controller.currentTimetable?.id;
		loadedTimetable = null;
		loading = false;
		loadFailed = false;
		if (!courseId || !id || id === activeId) return;
		loading = true;
		let cancelled = false;
		void getAppEngine()
			.storage.getTimetable(id)
			.then((result) => {
				if (cancelled) return;
				loadedTimetable = result;
				loading = false;
			})
			.catch(() => {
				if (cancelled) return;
				loadFailed = true;
				loading = false;
			});
		return () => {
			cancelled = true;
		};
	});

	const course = $derived(
		courseId ? (timetable?.courses.find((entry) => entry.id === courseId) ?? null) : null
	);

	function handleOpenChangeComplete(isOpen: boolean) {
		if (!isOpen && !open) {
			courseId = null;
			timetableId = null;
		}
	}

	async function editCourse() {
		if (!course || !timetable) return;
		const selectedCourseId = course.id;
		if (timetable.id !== shell.controller.currentTimetable?.id) {
			try {
				await shell.switchTimetable(timetable.id);
			} catch {
				shell.controller.notify(hostT('timetable.manage.switchFailed'), 'error');
				return;
			}
		}
		trackEvent('course_editor_open', { trigger: 'detail_page' });
		void navigateForward(
			`/timetable/course-editor?courseId=${encodeURIComponent(selectedCourseId)}`
		);
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
			{#if loading}
				<div class="flex justify-center py-8"><LoadingIndicator /></div>
			{:else if loadFailed}
				<p class="text-body-medium text-on-surface-variant">{hostT('common.loadFailed')}</p>
			{:else}
				<CourseDetailScreen {shell} {courseId} {timetable} />
			{/if}
		{/key}
	</div>
</BottomSheet>
