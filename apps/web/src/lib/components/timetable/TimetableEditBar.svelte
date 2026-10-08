<script lang="ts">
	import { hostT } from '$lib/i18n/host-i18n.svelte';
	import Button from '$lib/components/ui/Button.svelte';
	import { Add, DeleteFill, EditNote, TuneFill } from '$lib/icons';

	let {
		isDragging,
		isDragOverDeleteZone,
		hasTimetable,
		compactLandscape = false,
		onEdit,
		onAdd,
		onLayout
	}: {
		isDragging: boolean;
		isDragOverDeleteZone: boolean;
		hasTimetable: boolean;
		compactLandscape?: boolean;
		onEdit: () => void;
		onAdd: () => void;
		onLayout: () => void;
	} = $props();

	const deleteHint = $derived(
		isDragOverDeleteZone
			? hostT('timetable.deleteWeek.dropHint')
			: hostT('timetable.deleteWeek.dragHint')
	);
</script>

<div
	class={[
		'edit-bottom-bar relative h-full w-full',
		{
			'edit-bottom-bar--compact': compactLandscape,
			'timetable-delete-zone': isDragging,
			'timetable-delete-zone--active': isDragging && isDragOverDeleteZone
		}
	]}
	aria-label={isDragging ? deleteHint : undefined}
>
	<div
		class="edit-bottom-bar-layer edit-bottom-bar-controls h-full w-full {isDragging
			? 'edit-bottom-bar-layer--hidden'
			: ''}"
		data-has-timetable={hasTimetable}
		aria-hidden={isDragging}
	>
		<Button
			variant={compactLandscape ? 'text' : 'outlined'}
			class="edit-bottom-bar-action min-w-0"
			aria-label={hostT('timetable.edit.aria')}
			title={hostT('timetable.edit.aria')}
			onclick={onEdit}
		>
			{#if compactLandscape}
				<EditNote class="size-6" aria-hidden="true" />
			{:else}
				{hostT('timetable.edit.aria')}
			{/if}
		</Button>
		{#if hasTimetable}
			<Button
				variant="filled"
				class="edit-bottom-bar-action edit-bottom-bar-add-action min-w-0"
				aria-label={hostT('course.add')}
				title={hostT('course.add')}
				onclick={onAdd}
			>
				<Add class="size-6" aria-hidden="true" />
			</Button>
		{/if}
		<Button
			variant={compactLandscape ? 'text' : 'outlined'}
			class="edit-bottom-bar-action min-w-0"
			aria-label={hostT('timetable.details.section.display')}
			title={hostT('timetable.details.section.display')}
			onclick={onLayout}
		>
			{#if compactLandscape}
				<TuneFill class="size-6" aria-hidden="true" />
			{:else}
				{hostT('timetable.details.section.display')}
			{/if}
		</Button>
	</div>
	<div
		class="edit-bottom-bar-layer edit-bottom-bar-delete-hint flex h-full w-full items-center justify-center gap-2 px-4 {isDragging
			? 'edit-bottom-bar-delete-hint--active'
			: ''}"
		role="status"
		aria-live="polite"
		aria-hidden={!isDragging}
		aria-label={deleteHint}
	>
		<span class="edit-bottom-bar-delete-icon inline-flex shrink-0" aria-hidden="true">
			<DeleteFill class="size-6 text-error" />
		</span>
		{#key deleteHint}
			<span class="edit-bottom-bar-delete-text text-label-large truncate font-medium text-error">
				{deleteHint}
			</span>
		{/key}
	</div>
</div>

<style>
	.edit-bottom-bar {
		display: grid;
	}

	.edit-bottom-bar-layer {
		grid-area: 1 / 1;
		transition:
			opacity 240ms cubic-bezier(0.2, 0, 0, 1),
			transform 240ms cubic-bezier(0.2, 0, 0, 1),
			filter 240ms cubic-bezier(0.2, 0, 0, 1);
		will-change: opacity, transform, filter;
	}

	.edit-bottom-bar-layer--hidden {
		opacity: 0;
		transform: scale(0.96);
		filter: blur(3px);
		pointer-events: none;
	}

	.edit-bottom-bar-controls {
		display: grid;
		align-items: center;
		column-gap: 0.5rem;
		grid-template-columns: repeat(3, minmax(0, 1fr));
	}

	.edit-bottom-bar-controls[data-has-timetable='false'] {
		grid-template-columns: repeat(2, minmax(0, 1fr));
	}

	.edit-bottom-bar-delete-hint {
		opacity: 0;
		transform: scale(0.96);
		pointer-events: none;
	}

	.edit-bottom-bar-delete-hint--active {
		opacity: 1;
		transform: scale(1);
		pointer-events: auto;
	}

	.edit-bottom-bar-delete-text {
		transform: translateY(6px);
		opacity: 0;
	}

	.edit-bottom-bar-delete-hint--active .edit-bottom-bar-delete-text {
		animation: edit-bottom-bar-delete-text-enter 280ms cubic-bezier(0.2, 0, 0, 1) 50ms both;
	}

	@keyframes edit-bottom-bar-delete-text-enter {
		from {
			transform: translateY(6px);
			opacity: 0;
		}
		to {
			transform: translateY(0);
			opacity: 1;
		}
	}

	.edit-bottom-bar-delete-icon {
		transform: scale(0.85);
		opacity: 0;
		transition:
			transform 320ms cubic-bezier(0.34, 1.35, 0.64, 1),
			opacity 200ms cubic-bezier(0.2, 0, 0, 1);
	}

	.edit-bottom-bar-delete-hint--active .edit-bottom-bar-delete-icon {
		transform: scale(1.1);
		opacity: 1;
		transition-delay: 20ms;
	}

	@media (prefers-reduced-motion: reduce) {
		.edit-bottom-bar-layer,
		.edit-bottom-bar-delete-text,
		.edit-bottom-bar-delete-icon {
			transition-duration: 1ms !important;
		}

		.edit-bottom-bar-delete-text {
			animation-duration: 1ms !important;
			animation-delay: 0ms !important;
		}

		.edit-bottom-bar-layer--hidden {
			filter: none;
		}
	}

	:root.reduce-motion .edit-bottom-bar-layer,
	:root.reduce-motion .edit-bottom-bar-delete-text,
	:root.reduce-motion .edit-bottom-bar-delete-icon {
		transition-duration: 1ms !important;
	}

	:root.reduce-motion .edit-bottom-bar-delete-text {
		animation-duration: 1ms !important;
		animation-delay: 0ms !important;
	}

	:root.reduce-motion .edit-bottom-bar-layer--hidden {
		filter: none;
	}

	:where(.edit-bottom-bar--compact) .edit-bottom-bar-controls {
		grid-template-columns: minmax(0, 1fr);
		grid-template-rows: auto auto auto;
		row-gap: 0.25rem;
		align-content: center;
		justify-items: center;
	}

	:where(.edit-bottom-bar--compact) .edit-bottom-bar-delete-hint {
		flex-direction: column;
		gap: 0.375rem;
		padding-inline: 0.375rem;
		text-align: center;
	}
</style>
