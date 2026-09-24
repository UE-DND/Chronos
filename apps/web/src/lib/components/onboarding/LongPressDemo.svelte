<script lang="ts">
	import { hostT } from '$lib/i18n/host-i18n.svelte';
	import { Add, CalendarMonthFill, DeleteFill, EditNote, Person, TuneFill } from '$lib/icons';

	const days = [
		'timetable.dayShort.mon',
		'timetable.dayShort.tue',
		'timetable.dayShort.wed'
	] as const;
</script>

<p class="sr-only">{hostT('onboarding.longPress.description')}</p>

<div
	class="demo rounded-3xl border border-outline-variant bg-surface text-on-surface shadow-raised"
	aria-hidden="true"
>
	<div class="week-label text-label-large font-semibold">
		{hostT('timetable.week.label', { week: 1, today: '' })}
	</div>
	<div class="day-row text-label-small text-on-surface-variant">
		<span></span>
		{#each days as day (day)}
			<span>{hostT(day)}</span>
		{/each}
	</div>
	<div class="grid-area">
		<div class="periods text-label-small text-on-surface-variant">
			<span>1</span><span>2</span><span>3</span>
		</div>
		<div class="cells">
			<div class="target border-2 border-dashed border-primary/60 bg-primary/10"></div>
			<div
				class="course course-secondary text-label-small border border-outline-variant bg-surface-container-high p-2 font-medium"
			>
				{hostT('onboarding.longPress.courseSecondary')}
			</div>
			<div class="moving-group">
				<div
					class="course course-primary text-label-small border border-primary/20 bg-primary-container p-2 font-semibold text-on-primary-container shadow-sm"
				>
					{hostT('onboarding.longPress.coursePrimary')}
				</div>
				<div class="touch-indicator"><span></span></div>
			</div>
		</div>
	</div>
	<div class="toolbar text-label-small">
		<div class="toolbar-view toolbar-layer">
			<span class="view-tab text-primary">
				<span class="view-tab-icon bg-primary-container"><CalendarMonthFill class="size-5" /></span>
				<span class="tab-pill bg-current opacity-40"></span>
			</span>
			<span class="view-tab text-on-surface-variant">
				<span class="view-tab-icon"><Person class="size-5" /></span>
				<span class="tab-pill bg-current opacity-30"></span>
			</span>
		</div>
		<div class="toolbar-actions toolbar-layer">
			<span class="action-btn border border-outline-variant text-on-surface-variant">
				<EditNote class="size-5" />
			</span>
			<span class="add-action bg-primary text-on-primary"><Add class="size-5" /></span>
			<span class="action-btn border border-outline-variant text-on-surface-variant">
				<TuneFill class="size-5" />
			</span>
		</div>
		<div class="delete-zone toolbar-layer font-medium text-error">
			<span class="delete-icon"><DeleteFill class="size-6" /></span>
			<span class="delete-labels">
				<span class="drag-hint delete-hint-pill"></span>
				<span class="drop-hint delete-hint-pill delete-hint-pill--active"></span>
			</span>
		</div>
	</div>
	<div class="confirm-overlay">
		<div
			class="confirm-sheet rounded-t-3xl bg-surface-container-high px-5 pt-5 pb-4 shadow-overlay"
		>
			<div class="confirm-title-pill mx-auto"></div>
			<div class="confirm-desc-pill mx-auto mt-2.5"></div>
			<div class="confirm-desc-pill confirm-desc-pill--short mx-auto mt-1.5"></div>
			<div class="mt-4 flex gap-3 border-t border-outline-variant/40 pt-3">
				<div class="confirm-btn-pill bg-outline-variant/50"></div>
				<div class="confirm-btn-pill bg-error"></div>
			</div>
		</div>
	</div>
</div>

<style>
	.demo {
		--cycle: 6s;
		--start-delay: 0.6s;
		position: relative;
		display: flex;
		flex-direction: column;
		width: min(100%, 23rem);
		height: clamp(16rem, 51dvh, 22rem);
		min-height: 0;
		overflow: hidden;
		isolation: isolate;
	}

	.week-label {
		padding: 0.7rem 1rem 0.45rem;
	}

	.day-row {
		display: grid;
		grid-template-columns: 2rem repeat(3, minmax(0, 1fr));
		padding-right: 0.5rem;
		text-align: center;
	}

	.grid-area {
		display: flex;
		min-height: 0;
		flex: 1;
		padding: 0.35rem 0.5rem 0.25rem 0;
	}

	.periods {
		display: grid;
		width: 2rem;
		grid-template-rows: repeat(3, 1fr);
		place-items: center;
	}

	.cells {
		--cell-inset: 0.32rem;
		display: grid;
		flex: 1;
		grid-template-columns: repeat(3, minmax(0, 1fr));
		grid-template-rows: repeat(3, minmax(0, 1fr));
		background-image:
			linear-gradient(to right, var(--color-outline-variant) 1px, transparent 1px),
			linear-gradient(to bottom, var(--color-outline-variant) 1px, transparent 1px);
		background-size:
			33.333% 100%,
			100% 33.333%;
		border-right: 1px solid var(--color-outline-variant);
		border-bottom: 1px solid var(--color-outline-variant);
	}

	.course {
		box-sizing: border-box;
		overflow: hidden;
		line-height: 1.15;
		border-radius: 0;
	}

	.course-secondary {
		grid-column: 2;
		grid-row: 2;
		min-width: 0;
		min-height: 0;
		margin: var(--cell-inset);
		animation: secondary-state var(--cycle) linear infinite;
	}

	.moving-group {
		position: relative;
		z-index: 2;
		grid-column: 1;
		grid-row: 1;
		min-width: 0;
		min-height: 0;
		animation: course-path var(--cycle) linear infinite;
	}

	.course-primary {
		width: calc(100% - var(--cell-inset) - var(--cell-inset));
		height: calc(100% - var(--cell-inset) - var(--cell-inset));
		margin: var(--cell-inset);
		transform-origin: center;
		animation: primary-state var(--cycle) linear infinite;
	}

	.target {
		grid-column: 2;
		grid-row: 1;
		min-width: 0;
		min-height: 0;
		margin: var(--cell-inset);
		opacity: 0;
		animation: target-state var(--cycle) linear infinite;
	}

	.touch-indicator {
		position: absolute;
		z-index: 4;
		top: 30%;
		left: 30%;
		width: 2.2rem;
		height: 2.2rem;
		border: 2px solid var(--color-primary);
		border-radius: 50%;
		background: color-mix(in srgb, var(--color-primary) 14%, transparent);
		opacity: 0;
		animation: touch-state var(--cycle) linear infinite;
	}

	.touch-indicator span {
		position: absolute;
		inset: 0.7rem;
		border-radius: 50%;
		background: var(--color-primary);
	}

	.toolbar {
		position: relative;
		height: 3.4rem;
		flex: none;
		overflow: hidden;
		border-top: 1px solid var(--color-outline-variant);
		background: var(--color-surface-container);
	}

	.toolbar-layer {
		position: absolute;
		inset: 0;
		display: flex;
		align-items: center;
	}

	.toolbar-view {
		justify-content: space-around;
		animation: view-bar-state var(--cycle) linear infinite;
	}

	.view-tab {
		display: flex;
		width: 50%;
		align-items: center;
		flex-direction: column;
		justify-content: center;
		font-size: 0.7rem;
		line-height: 1.1;
	}

	.view-tab-icon {
		display: grid;
		width: 2.6rem;
		height: 1.7rem;
		place-items: center;
		border-radius: 999px;
	}

	.tab-pill {
		width: 1.4rem;
		height: 0.22rem;
		border-radius: 999px;
		margin-top: 0.2rem;
	}

	.toolbar-actions {
		justify-content: center;
		gap: 1rem;
		opacity: 0;
		animation: actions-bar-state var(--cycle) linear infinite;
	}

	.action-btn {
		display: grid;
		width: 3rem;
		height: 2rem;
		place-items: center;
		border-radius: 999px;
	}

	.add-action {
		display: grid;
		width: 2rem;
		height: 2rem;
		place-items: center;
		border-radius: 999px;
	}

	.delete-zone {
		justify-content: center;
		gap: 0.45rem;
		padding: 0 0.5rem;
		opacity: 0;
		animation:
			delete-bar-state var(--cycle) linear infinite,
			delete-bar-color var(--cycle) linear infinite;
	}

	.delete-icon {
		flex: none;
		animation: delete-icon-state var(--cycle) linear infinite;
	}

	.delete-labels {
		position: relative;
		display: grid;
		min-width: 0;
		place-items: center;
		white-space: nowrap;
	}

	.delete-labels > span {
		grid-area: 1 / 1;
	}

	.delete-hint-pill {
		display: block;
		width: 5.5rem;
		height: 0.35rem;
		border-radius: 999px;
		background: currentColor;
		opacity: 0.45;
	}

	.delete-hint-pill--active {
		width: 4rem;
		opacity: 0.75;
	}

	.drag-hint {
		animation: drag-hint-state var(--cycle) linear infinite;
	}

	.drop-hint {
		opacity: 0;
		animation: drop-hint-state var(--cycle) linear infinite;
	}

	.confirm-overlay {
		position: absolute;
		z-index: 5;
		inset: 0;
		opacity: 0;
		visibility: hidden;
		pointer-events: none;
		background: color-mix(in srgb, var(--color-on-surface) 32%, transparent);
		animation: confirm-backdrop var(--cycle) linear infinite both;
	}

	.confirm-sheet {
		position: absolute;
		inset-inline: 0;
		bottom: 0;
		display: flex;
		flex-direction: column;
		transform: translateY(100%);
		animation: confirm-sheet var(--cycle) cubic-bezier(0.05, 0.7, 0.1, 1) infinite both;
	}

	.confirm-title-pill {
		width: 5.5rem;
		height: 0.75rem;
		border-radius: 999px;
		background: var(--color-on-surface);
		opacity: 0.75;
	}

	.confirm-desc-pill {
		width: 13rem;
		max-width: 90%;
		height: 0.45rem;
		border-radius: 999px;
		background: var(--color-on-surface-variant);
		opacity: 0.35;
	}

	.confirm-desc-pill--short {
		width: 8rem;
	}

	.confirm-btn-pill {
		flex: 1;
		height: 1.8rem;
		border-radius: 999px;
		opacity: 0.85;
	}

	.moving-group,
	.course-primary,
	.course-secondary,
	.target,
	.touch-indicator,
	.toolbar-view,
	.toolbar-actions,
	.delete-zone,
	.delete-icon,
	.drag-hint,
	.drop-hint,
	.confirm-overlay,
	.confirm-sheet {
		animation-delay: var(--start-delay);
	}

	@keyframes course-path {
		0%,
		37% {
			transform: translate(0, 0);
		}
		53%,
		64% {
			transform: translateX(100%);
		}
		79%,
		94% {
			transform: translate(100%, calc(300% + 0.5rem));
		}
		100% {
			transform: translate(0, 0);
		}
	}

	@keyframes primary-state {
		0%,
		6% {
			transform: scale(1);
			border-radius: 0;
			opacity: 1;
		}
		12%,
		17% {
			transform: scale(0.92);
			border-radius: 0;
			opacity: 1;
		}
		20%,
		71% {
			transform: scale(0.92);
			border-radius: 0.7rem;
			opacity: 1;
		}
		76%,
		100% {
			transform: scale(0.92);
			border-radius: 0.7rem;
			opacity: 0;
		}
	}

	@keyframes secondary-state {
		0%,
		17%,
		100% {
			border-radius: 0;
		}
		21%,
		94% {
			border-radius: 0.7rem;
		}
	}

	@keyframes target-state {
		0%,
		37%,
		56%,
		100% {
			opacity: 0;
		}
		43%,
		52% {
			opacity: 1;
		}
	}

	@keyframes touch-state {
		0%,
		5%,
		56%,
		62%,
		83%,
		100% {
			opacity: 0;
			transform: scale(1.2);
		}
		9%,
		52%,
		66%,
		79% {
			opacity: 1;
			transform: scale(0.82);
		}
	}

	@keyframes view-bar-state {
		0%,
		15%,
		100% {
			opacity: 1;
			transform: scale(1);
		}
		21%,
		95% {
			opacity: 0;
			transform: scale(0.96);
		}
	}

	@keyframes actions-bar-state {
		0%,
		16%,
		43%,
		53%,
		68%,
		100% {
			opacity: 0;
			transform: scale(0.96);
			filter: blur(2px);
		}
		21%,
		37%,
		58%,
		62% {
			opacity: 1;
			transform: scale(1);
			filter: blur(0);
		}
	}

	@keyframes delete-bar-state {
		0%,
		38%,
		59%,
		63%,
		86%,
		100% {
			opacity: 0;
			transform: scale(0.96);
		}
		45%,
		53%,
		70%,
		82% {
			opacity: 1;
			transform: scale(1);
		}
	}

	@keyframes delete-bar-color {
		0%,
		71%,
		85%,
		100% {
			background-color: transparent;
		}
		76%,
		82% {
			background-color: color-mix(in srgb, var(--color-error) 13%, transparent);
		}
	}

	@keyframes delete-icon-state {
		0%,
		39%,
		66%,
		100% {
			transform: scale(0.75) translateY(4px);
		}
		46%,
		54%,
		71% {
			transform: scale(1);
		}
		76%,
		82% {
			transform: scale(1.15);
		}
	}

	@keyframes drag-hint-state {
		0%,
		71%,
		100% {
			opacity: 1;
			transform: translateY(0);
		}
		76%,
		84% {
			opacity: 0;
			transform: translateY(-5px);
		}
	}

	@keyframes drop-hint-state {
		0%,
		71%,
		87%,
		100% {
			opacity: 0;
			transform: translateY(5px);
		}
		76%,
		82% {
			opacity: 1;
			transform: translateY(0);
		}
	}

	@keyframes confirm-backdrop {
		0%,
		79%,
		96%,
		100% {
			opacity: 0;
			pointer-events: none;
			visibility: hidden;
		}
		83%,
		92% {
			opacity: 1;
			pointer-events: auto;
			visibility: visible;
		}
	}

	@keyframes confirm-sheet {
		0%,
		79% {
			transform: translateY(100%);
		}
		83%,
		92% {
			transform: translateY(0);
		}
		96%,
		100% {
			transform: translateY(100%);
		}
	}

	@media (prefers-reduced-motion: reduce) {
		.moving-group,
		.course-primary,
		.course-secondary,
		.target,
		.touch-indicator,
		.toolbar-view,
		.toolbar-actions,
		.delete-zone,
		.delete-icon,
		.drag-hint,
		.drop-hint,
		.confirm-overlay,
		.confirm-sheet {
			animation: none;
		}
		.confirm-overlay {
			display: none;
		}
		.course-primary {
			transform: scale(0.92);
			border-radius: 0.7rem;
			opacity: 1;
		}
		.course-secondary {
			border-radius: 0.7rem;
		}
		.touch-indicator {
			opacity: 1;
			transform: scale(0.82);
		}
		.toolbar {
			height: 4.7rem;
		}
		.toolbar-view {
			opacity: 0;
		}
		.toolbar-actions {
			bottom: 1.5rem;
			opacity: 1;
			filter: none;
		}
		.delete-zone {
			top: auto;
			height: 1.5rem;
			border-top: 1px solid var(--color-outline-variant);
			opacity: 1;
		}
		.drag-hint {
			opacity: 1;
		}
		.drop-hint {
			opacity: 0;
		}
	}

	:global(:root.reduce-motion) .moving-group,
	:global(:root.reduce-motion) .course-primary,
	:global(:root.reduce-motion) .course-secondary,
	:global(:root.reduce-motion) .target,
	:global(:root.reduce-motion) .touch-indicator,
	:global(:root.reduce-motion) .toolbar-view,
	:global(:root.reduce-motion) .toolbar-actions,
	:global(:root.reduce-motion) .delete-zone,
	:global(:root.reduce-motion) .delete-icon,
	:global(:root.reduce-motion) .drag-hint,
	:global(:root.reduce-motion) .drop-hint,
	:global(:root.reduce-motion) .confirm-overlay,
	:global(:root.reduce-motion) .confirm-sheet {
		animation: none;
	}

	:global(:root.reduce-motion) .confirm-overlay {
		display: none;
	}

	:global(:root.reduce-motion) .course-primary {
		transform: scale(0.92);
		border-radius: 0.7rem;
		opacity: 1;
	}
	:global(:root.reduce-motion) .course-secondary {
		border-radius: 0.7rem;
	}
	:global(:root.reduce-motion) .touch-indicator {
		opacity: 1;
		transform: scale(0.82);
	}
	:global(:root.reduce-motion) .toolbar {
		height: 4.7rem;
	}
	:global(:root.reduce-motion) .toolbar-view {
		opacity: 0;
	}
	:global(:root.reduce-motion) .toolbar-actions {
		bottom: 1.5rem;
		opacity: 1;
		filter: none;
	}
	:global(:root.reduce-motion) .delete-zone {
		top: auto;
		height: 1.5rem;
		border-top: 1px solid var(--color-outline-variant);
		opacity: 1;
	}
	:global(:root.reduce-motion) .drag-hint {
		opacity: 1;
	}
	:global(:root.reduce-motion) .drop-hint {
		opacity: 0;
	}
</style>
