<script lang="ts">
	import type { TimetableLayoutMode } from '@chronos/core';
	import { hostT } from '$lib/i18n/host-i18n.svelte';

	let { mode }: { mode: TimetableLayoutMode } = $props();

	const days = [
		'timetable.dayShort.mon',
		'timetable.dayShort.tue',
		'timetable.dayShort.wed'
	] as const;
</script>

<div class="preview mode-{mode} bg-surface text-on-surface" aria-hidden="true">
	<div class="week-label">{hostT('timetable.week.label', { week: 1, today: '' })}</div>
	<div class="day-row text-on-surface-variant">
		<span></span>
		{#each days as day (day)}
			<span>{hostT(day)}</span>
		{/each}
	</div>
	<div class="viewport">
		<div class="grid">
			<div class="periods text-on-surface-variant">
				<span>1</span><span>2</span><span>3</span><span>4</span><span>5</span>
			</div>
			<div class="cells">
				<div class="course course-one bg-primary-container"><span></span><span></span></div>
				<div class="course course-two bg-secondary-container"><span></span><span></span></div>
				<div class="course course-three bg-tertiary-container"><span></span><span></span></div>
			</div>
		</div>
	</div>
	<div class="bottom-bar border-outline-variant">
		<span class="bg-primary"></span><span class="bg-outline-variant"></span>
	</div>
</div>

<style>
	.preview {
		display: flex;
		height: clamp(9.5rem, 29dvh, 12rem);
		flex-direction: column;
		overflow: hidden;
		border-radius: 0.75rem;
		font-size: 0.6rem;
		line-height: 1.1;
	}

	.week-label {
		padding: 0.55rem 0.55rem 0.3rem;
		font-weight: 600;
	}

	.day-row {
		display: grid;
		grid-template-columns: 1.2rem repeat(3, minmax(0, 1fr));
		padding-right: 0.25rem;
		text-align: center;
	}

	.day-row span {
		overflow: hidden;
		white-space: nowrap;
	}

	.viewport {
		min-height: 0;
		flex: 1;
		overflow: hidden;
		padding: 0.2rem 0.25rem 0 0;
	}

	.grid {
		display: flex;
		height: 100%;
	}

	.mode-fixed .grid {
		height: 165%;
		animation: scroll-preview 5.2s ease-in-out infinite;
	}

	.periods {
		display: grid;
		width: 1.2rem;
		grid-template-rows: repeat(5, 1fr);
		place-items: center;
	}

	.cells {
		--cell-inset: 0.22rem;
		display: grid;
		min-width: 0;
		flex: 1;
		grid-template-columns: repeat(3, minmax(0, 1fr));
		grid-template-rows: repeat(5, minmax(0, 1fr));
		background-image:
			linear-gradient(to right, var(--color-outline-variant) 1px, transparent 1px),
			linear-gradient(to bottom, var(--color-outline-variant) 1px, transparent 1px);
		background-size:
			33.333% 100%,
			100% 20%;
		border-right: 1px solid var(--color-outline-variant);
		border-bottom: 1px solid var(--color-outline-variant);
	}

	.course {
		display: flex;
		min-width: 0;
		min-height: 0;
		flex-direction: column;
		gap: 0.2rem;
		margin: var(--cell-inset);
		padding: 0.25rem;
		border-radius: 0.3rem;
		animation: course-highlight 5.2s ease-in-out infinite;
	}

	.course span {
		width: 90%;
		height: 0.18rem;
		border-radius: 999px;
		background: currentColor;
		opacity: 0.38;
	}

	.course span:last-child {
		width: 55%;
		opacity: 0.25;
	}

	.course-one {
		grid-column: 1;
		grid-row: 1 / 3;
		color: var(--color-on-primary-container);
	}

	.course-two {
		grid-column: 2;
		grid-row: 2 / 4;
		color: var(--color-on-secondary-container);
		animation-delay: -1.7s;
	}

	.course-three {
		grid-column: 3;
		grid-row: 4 / 6;
		color: var(--color-on-tertiary-container);
		animation-delay: -3.4s;
	}

	.bottom-bar {
		display: flex;
		height: 1rem;
		flex: none;
		align-items: center;
		justify-content: space-around;
		border-top-width: 1px;
	}

	.bottom-bar span {
		width: 1rem;
		height: 0.2rem;
		border-radius: 999px;
	}

	@keyframes scroll-preview {
		0%,
		15%,
		85%,
		100% {
			transform: translateY(0);
		}
		45%,
		60% {
			transform: translateY(-39%);
		}
	}

	@keyframes course-highlight {
		0%,
		100% {
			filter: brightness(1);
		}
		50% {
			filter: brightness(1.14);
		}
	}

	@media (prefers-reduced-motion: reduce) {
		.mode-fixed .grid,
		.course {
			animation: none;
		}
	}

	:global(:root.reduce-motion) .mode-fixed .grid,
	:global(:root.reduce-motion) .course {
		animation: none;
	}
</style>
