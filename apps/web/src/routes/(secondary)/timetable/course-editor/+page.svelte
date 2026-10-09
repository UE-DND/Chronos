<script lang="ts">
	import { hostT } from '#lib/i18n/host-i18n.svelte.ts';
	import { navigateForward } from '#lib/navigation/index.ts';
	import { page } from '$app/state';
	import { getContext } from 'svelte';
	import type { AppShellController } from '#lib/app/app-shell.svelte.ts';
	import SecondaryPageShell from '#lib/components/SecondaryPageShell.svelte';
	import CourseEditorScreen from '#lib/components/timetable/CourseEditorScreen.svelte';
	import { createCourseEditor } from '#lib/timetable/course-editor.svelte.ts';
	import { getAppController } from '#lib/services/app-engine.ts';

	const shell = getContext<AppShellController>('appShell');
	const controller = getAppController();
	const courseId = $derived(page.url.searchParams.get('courseId'));
	const pageTitle = $derived(hostT(courseId ? 'route.courseEdit' : 'route.courseAdd'));

	const editor = createCourseEditor(
		shell,
		() => courseId,
		() => navigateForward('/', { replace: true })
	);

	$effect(() => {
		void courseId;
		editor.syncFromRoute();
	});
</script>

<SecondaryPageShell title={pageTitle} backFallback={{ kind: 'shell' }} flush>
	<CourseEditorScreen {editor} />
</SecondaryPageShell>
