<script lang="ts">
	import { hostT } from '#lib/i18n/host-i18n.svelte.ts';
	import type { CourseEditorController } from '#lib/timetable/course-editor.svelte.ts';
	import Button from '#lib/components/ui/Button.svelte';
	import BottomSheet from '#lib/components/ui/BottomSheet.svelte';
	import CourseEditorForm from '#lib/components/timetable/CourseEditorForm.svelte';
	import FormScreenLayout from '#lib/components/ui/FormScreenLayout.svelte';
	import LoadingIndicator from '#lib/components/ui/LoadingIndicator.svelte';
	import type { EdgeBarAction } from '@chronos/ui-kit';
	import { Check, DeleteFill } from '#lib/icons/index.ts';

	let { editor }: { editor: CourseEditorController } = $props();

	const draft = $derived(editor.draft);

	let deleteDialogOpen = $state(false);
	const actions = $derived.by((): EdgeBarAction[] => [
		...(draft?.id
			? [
					{
						id: 'delete',
						label: hostT('course.editor.delete'),
						icon: DeleteFill,
						variant: 'danger' as const,
						disabled: editor.isSaving || editor.isDeleting,
						onClick: () => {
							deleteDialogOpen = true;
						}
					}
				]
			: []),
		{
			id: 'save',
			label: hostT(editor.isSaving ? 'common.saving' : 'course.editor.save'),
			icon: Check,
			loading: editor.isSaving,
			disabled: !editor.canSave,
			onClick: () => void editor.save()
		}
	]);

	async function confirmDelete() {
		await editor.deleteCourse();
	}
</script>

{#if draft}
	<FormScreenLayout {actions}>
		<CourseEditorForm {editor} />
	</FormScreenLayout>

	{#if draft.id}
		<BottomSheet
			bind:open={deleteDialogOpen}
			showHandle={false}
			title={hostT('course.editor.delete.title')}
			description={hostT('course.editor.delete.desc', { name: draft.name })}
		>
			{#snippet footer()}
				<Button
					variant="text"
					disabled={editor.isDeleting}
					onclick={() => (deleteDialogOpen = false)}
				>
					{hostT('common.cancel')}
				</Button>
				<Button
					variant="filled"
					disabled={editor.isSaving || editor.isDeleting}
					aria-busy={editor.isDeleting}
					onclick={confirmDelete}
				>
					{hostT(editor.isDeleting ? 'common.deleting' : 'common.delete')}
				</Button>
			{/snippet}
		</BottomSheet>
	{/if}
{:else if editor.isLoading}
	<LoadingIndicator class="p-4" />
{:else}
	<p class="text-body-medium p-4 text-on-surface-variant">
		{hostT('course.editor.notFound')}
	</p>
{/if}
