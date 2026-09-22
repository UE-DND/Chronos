<script lang="ts">
	import { onDestroy, untrack } from 'svelte';
	import { haptic } from '../haptic/haptic';
	import { snapTimeWheelIndex, TIME_WHEEL_ROW_HEIGHT } from './time-wheel-utils';
	import type { PickerWheelOption } from './picker-wheel';

	let {
		value = $bindable(''),
		options,
		label,
		idPrefix,
		disabled = false,
		onValueChange
	}: {
		value?: string;
		options: PickerWheelOption[];
		label: string;
		idPrefix: string;
		disabled?: boolean;
		onValueChange?: (value: string) => void;
	} = $props();

	const ROW_HEIGHT = TIME_WHEEL_ROW_HEIGHT;
	let wheelNode: HTMLElement | null = null;
	let suppressTickUntil = 0;
	let lastTickAt = 0;
	let settleTimer = 0;
	let liveIndex = 0;
	const optionValues = $derived(options.map((option) => option.value).join('\u0000'));

	function selectedIndex(): number {
		return Math.max(
			0,
			options.findIndex((option) => option.value === value)
		);
	}

	function scrollToIndex(index: number, smooth: boolean) {
		wheelNode?.scrollTo({
			top: index * ROW_HEIGHT,
			behavior: (smooth ? 'smooth' : 'instant') as ScrollBehavior
		});
	}

	export function scrollToValue() {
		suppressTickUntil = Date.now() + 150;
		liveIndex = selectedIndex();
		scrollToIndex(liveIndex, false);
	}

	$effect(() => {
		void optionValues;
		untrack(scrollToValue);
	});

	function fireTick() {
		const now = Date.now();
		if (now < suppressTickUntil || now - lastTickAt < 40) return;
		lastTickAt = now;
		haptic.medium();
	}

	function updateValue(index: number) {
		const next = options[index]?.value;
		if (next === undefined || next === value) return;
		value = next;
		onValueChange?.(next);
	}

	function settleDraft() {
		settleTimer = 0;
		if (disabled) return;
		updateValue(liveIndex);
	}

	function handleScroll(node: HTMLElement) {
		if (disabled) return;
		const next = snapTimeWheelIndex(node.scrollTop, Math.max(0, options.length - 1), ROW_HEIGHT);
		if (liveIndex !== next) {
			liveIndex = next;
			fireTick();
		}
		window.clearTimeout(settleTimer);
		settleTimer = window.setTimeout(settleDraft, 90);
	}

	export function commitDraft(): string {
		if (disabled) return value;
		window.clearTimeout(settleTimer);
		if (wheelNode) {
			liveIndex = snapTimeWheelIndex(
				wheelNode.scrollTop,
				Math.max(0, options.length - 1),
				ROW_HEIGHT
			);
		}
		settleDraft();
		return options[liveIndex]?.value ?? '';
	}

	function pick(index: number) {
		if (disabled) return;
		const clamped = Math.min(Math.max(index, 0), Math.max(0, options.length - 1));
		liveIndex = clamped;
		updateValue(clamped);
		scrollToIndex(clamped, true);
	}

	function handleKeydown(event: KeyboardEvent) {
		if (disabled) return;
		if (event.key === 'ArrowDown' || event.key === 'ArrowRight') {
			event.preventDefault();
			pick(liveIndex + 1);
		} else if (event.key === 'ArrowUp' || event.key === 'ArrowLeft') {
			event.preventDefault();
			pick(liveIndex - 1);
		} else if (event.key === 'Home') {
			event.preventDefault();
			pick(0);
		} else if (event.key === 'End') {
			event.preventDefault();
			pick(options.length - 1);
		}
	}

	function wheelAttach(node: HTMLElement) {
		wheelNode = node;
		liveIndex = selectedIndex();
		node.scrollTo({ top: liveIndex * ROW_HEIGHT });
		return () => {
			if (wheelNode === node) wheelNode = null;
		};
	}

	onDestroy(() => clearTimeout(settleTimer));
</script>

<div class="picker-wheel-column relative w-full">
	<div
		role="listbox"
		aria-label={label}
		aria-disabled={disabled}
		tabindex={disabled ? -1 : 0}
		class={[
			'picker-wheel overflow-y-auto rounded-xl outline-none focus-visible:ring-2 focus-visible:ring-brand',
			disabled && 'pointer-events-none opacity-60'
		]}
		{@attach wheelAttach}
		onscroll={(event) => handleScroll(event.currentTarget)}
		onscrollend={() => {
			window.clearTimeout(settleTimer);
			settleDraft();
		}}
		onkeydown={handleKeydown}
	>
		{#each options as option, index (option.value)}
			<!-- svelte-ignore a11y_click_events_have_key_events -->
			<div
				role="option"
				tabindex="-1"
				id="{idPrefix}-{option.value}"
				aria-selected={option.value === value}
				class="picker-wheel-row text-body-large flex cursor-pointer items-center justify-center text-center tabular-nums transition-colors {option.value ===
				value
					? 'font-medium text-on-surface'
					: 'text-on-surface-variant/60'}"
				style:height="{ROW_HEIGHT}px"
				onclick={() => pick(index)}
			>
				{option.label}
			</div>
		{/each}
	</div>
	<div
		aria-hidden="true"
		class="picker-wheel-fade-top pointer-events-none absolute inset-x-0 top-0 bg-gradient-to-b from-surface-container-high to-transparent"
	></div>
	<div
		aria-hidden="true"
		class="picker-wheel-fade-bottom pointer-events-none absolute inset-x-0 bottom-0 bg-gradient-to-t from-surface-container-high to-transparent"
	></div>
	<div
		aria-hidden="true"
		class="pointer-events-none absolute inset-x-2 top-1/2 h-10 -translate-y-1/2 rounded-lg border-y border-outline-variant/40 bg-brand/5"
	></div>
</div>

<style>
	.picker-wheel-column {
		--picker-wheel-height: 200px;
		--picker-wheel-fade: 80px;
	}
	.picker-wheel {
		height: var(--picker-wheel-height);
		padding-block: var(--picker-wheel-fade);
		scroll-snap-type: y mandatory;
		scrollbar-width: none;
		touch-action: pan-y;
		overscroll-behavior-y: contain;
		-webkit-overflow-scrolling: touch;
	}
	.picker-wheel-fade-top,
	.picker-wheel-fade-bottom {
		height: var(--picker-wheel-fade);
	}
	.picker-wheel::-webkit-scrollbar {
		display: none;
	}
	.picker-wheel-row {
		scroll-snap-align: center;
	}
	@media (orientation: landscape) and (max-height: 500px) {
		.picker-wheel-column {
			--picker-wheel-height: 140px;
			--picker-wheel-fade: 50px;
		}
	}
</style>
