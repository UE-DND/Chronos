<script lang="ts">
	import { haptic } from '../haptic/haptic';
	import { focusSegmentByKey, type Segment } from './segmented-control';

	let {
		segments,
		value,
		onValueChange,
		class: className = '',
		animateThumb = true,
		semantics = 'tabs',
		ariaLabel
	}: {
		segments: Segment[];
		value: string;
		onValueChange: (value: string) => void;
		class?: string;
		animateThumb?: boolean;
		semantics?: 'tabs' | 'options';
		ariaLabel?: string;
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
		const nextIndex = focusSegmentByKey(event, index, semantics === 'options');
		if (nextIndex === null || nextIndex === index) return;
		const nextValue = segments[nextIndex]?.value;
		if (nextValue !== undefined) handleSegmentClick(nextValue);
	}
</script>

<div
	class="ui-segmented-track {className}"
	role={semantics === 'tabs' ? 'tablist' : 'radiogroup'}
	aria-label={ariaLabel}
>
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
			id={segment.id}
			role={semantics === 'tabs' ? 'tab' : 'radio'}
			aria-controls={semantics === 'tabs' ? segment.controls : undefined}
			aria-selected={semantics === 'tabs' ? value === segment.value : undefined}
			aria-checked={semantics === 'options' ? value === segment.value : undefined}
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
