<script lang="ts">
	import { haptic } from '../haptic/haptic';
	import type { Segment } from './segmented-control';

	let {
		segments,
		value,
		onValueChange,
		class: className = '',
		animateThumb = true
	}: {
		segments: Segment[];
		value: string;
		onValueChange: (value: string) => void;
		class?: string;
		animateThumb?: boolean;
	} = $props();

	const selectedIndex = $derived(segments.findIndex((segment) => segment.value === value));
	const segmentCount = $derived(segments.length);
	const safeIndex = $derived(selectedIndex < 0 ? 0 : selectedIndex);
	const trackPadding = 'var(--ui-segmented-track-padding, 0.25rem)';

	function attachThumb(node: HTMLDivElement) {
		let previousIndex: number | undefined;
		$effect.pre(() => {
			const index = safeIndex;
			const movingRight = previousIndex === undefined || index > previousIndex;
			node.style.setProperty('--left-delay', movingRight ? '80ms' : '0ms');
			node.style.setProperty('--right-delay', movingRight ? '0ms' : '80ms');
			previousIndex = index;
		});
	}

	function handleSegmentClick(segmentValue: string) {
		if (segmentValue !== value) {
			haptic.medium();
		}
		onValueChange(segmentValue);
	}

	function handleSegmentKeydown(event: KeyboardEvent, index: number) {
		if (segmentCount <= 1) return;
		if (event.key !== 'ArrowLeft' && event.key !== 'ArrowRight') return;
		event.preventDefault();
		const direction = event.key === 'ArrowRight' ? 1 : -1;
		const nextIndex = (index + direction + segmentCount) % segmentCount;
		const nextValue = segments[nextIndex]?.value;
		if (nextValue) handleSegmentClick(nextValue);
	}
</script>

<div class="ui-segmented-track {className}" role="tablist">
	{#if segmentCount > 0 && selectedIndex >= 0}
		<div
			class="ui-segmented-thumb"
			style:left="calc({trackPadding} + {safeIndex} * ((100% - {trackPadding} * 2) / {segmentCount}))"
			style:right="calc({trackPadding} + {segmentCount - safeIndex - 1} * ((100% - {trackPadding} * 2)
			/ {segmentCount}))"
			style:transition={animateThumb ? undefined : 'none'}
			{@attach attachThumb}
			aria-hidden="true"
		></div>
	{/if}

	{#each segments as segment, index (segment.value)}
		<button
			type="button"
			role="tab"
			aria-selected={value === segment.value}
			tabindex={value === segment.value || (selectedIndex < 0 && index === 0) ? 0 : -1}
			class="ui-segmented-tab text-label-large relative z-10 flex-1 cursor-pointer rounded-control py-2 text-center transition-[color] duration-150 outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-1 {value ===
			segment.value
				? 'text-on-secondary-container'
				: 'text-on-surface-variant hover:text-on-surface'}"
			onclick={() => handleSegmentClick(segment.value)}
			onkeydown={(event) => handleSegmentKeydown(event, index)}
		>
			{segment.label}
		</button>
	{/each}
</div>

<style>
	.ui-segmented-thumb {
		/* The leading edge extends first; the trailing edge then catches up. */
		transition:
			left 260ms cubic-bezier(0.2, 0, 0, 1) var(--left-delay, 0ms),
			right 260ms cubic-bezier(0.2, 0, 0, 1) var(--right-delay, 0ms);
	}

	@media (prefers-reduced-motion: reduce) {
		.ui-segmented-thumb {
			transition: none;
		}
	}
</style>
