<script lang="ts">
	import { getContext, setContext, onDestroy, untrack } from 'svelte';
	import { Dialog } from 'bits-ui';
	import { createSinglePointerSession } from '../gesture/single-pointer-session.svelte';
	import type { Snippet } from 'svelte';
	import { isReducedMotionActive } from '../motion/motion';
	import { overlayOpacityFromDrag } from './bottom-sheet-drag';
	import { createBottomSheetMotion } from './bottom-sheet-motion.svelte';
	import {
		createHistoryOverlaySync,
		OVERLAY_LIFECYCLE_CONTEXT,
		type HistoryOverlaySync,
		type OverlayHistoryPort
	} from './history-overlay';

	let {
		open = $bindable(false),
		title = '',
		description = '',
		showHandle = true,
		dragDismissAria = 'Drag down to close',
		manageHistory = true,
		overlayId = 'bottom-sheet',
		historyPort,
		actions,
		children,
		footer,
		onOpenChange,
		onOpenChangeComplete
	}: {
		open?: boolean;
		title?: string;
		description?: string;
		showHandle?: boolean;
		dragDismissAria?: string;
		manageHistory?: boolean;
		overlayId?: string;
		historyPort?: OverlayHistoryPort;
		actions?: Snippet;
		children?: Snippet;
		footer?: Snippet;
		onOpenChange?: (open: boolean) => void;
		onOpenChangeComplete?: (open: boolean) => void;
	} = $props();

	let titleRef = $state<HTMLElement | null>(null);
	let contentRef = $state<HTMLElement | null>(null);
	let overlayRef = $state<HTMLElement | null>(null);
	let dragHandleRef = $state<HTMLElement | null>(null);

	const pointer = createSinglePointerSession();
	const motion = createBottomSheetMotion({
		height: () => contentRef?.getBoundingClientRect().height ?? 0,
		reduced: isReducedMotionActive,
		onClosed: () => {
			pointer.end();
			open = false;
			onOpenChange?.(false);
		},
		onComplete: (next) => onOpenChangeComplete?.(next)
	});
	const sheetOpen = $derived(motion.state.present);
	const isDragging = $derived(motion.state.phase === 'dragging');
	const contentTransformStyle = $derived(`transform: translateY(${motion.state.offset}px)`);
	const overlayStyle = $derived(
		`opacity: ${overlayOpacityFromDrag(motion.state.offset, contentRef?.getBoundingClientRect().height ?? 0)}`
	);
	function onHandlePointerDown(event: PointerEvent) {
		if (!showHandle || !pointer.start(event, dragHandleRef)) return;
		motion.start(event.clientY);
		open = true;
		historySync.syncOpenState(true);
	}
	function onWindowPointerMove(event: PointerEvent) {
		if (pointer.owns(event)) motion.move(event.clientY);
	}
	function onWindowPointerUp(event: PointerEvent) {
		if (!pointer.owns(event)) return;
		pointer.end();
		motion.release(event.clientY);
	}
	function onWindowPointerCancel(event: PointerEvent) {
		if (!pointer.owns(event)) return;
		pointer.end();
		motion.release(event.clientY, true);
	}

	function handleOpenAutoFocus(event: Event) {
		event.preventDefault();
		requestAnimationFrame(() => {
			if (sheetOpen) (titleRef ?? contentRef)?.focus();
		});
	}

	const historySync = createHistoryOverlaySync({
		get overlayId() {
			return overlayId;
		},
		get port() {
			return manageHistory ? historyPort : undefined;
		},
		parent: getContext<HistoryOverlaySync | undefined>(OVERLAY_LIFECYCLE_CONTEXT),
		setOpen: (next) => {
			open = next;
		}
	});
	setContext(OVERLAY_LIFECYCLE_CONTEXT, historySync);
	$effect(() => historySync.syncOpenState(sheetOpen));
	onDestroy(() => {
		pointer.end();
		motion.destroy();
		historySync.dispose();
	});

	function handleDialogOpenChange(next: boolean) {
		if (next) {
			open = true;
			onOpenChange?.(true);
		} else motion.setOpen(false);
	}
	$effect(() => {
		const next = open;
		untrack(() => motion.setOpen(next));
	});
	$effect(() => {
		if (contentRef) untrack(() => motion.mount());
	});
</script>

<svelte:window
	onpointermove={showHandle ? onWindowPointerMove : undefined}
	onpointerup={showHandle ? onWindowPointerUp : undefined}
	onpointercancel={showHandle ? onWindowPointerCancel : undefined}
/>

<Dialog.Root bind:open={() => sheetOpen, handleDialogOpenChange}>
	<Dialog.Portal>
		<Dialog.Overlay
			bind:ref={overlayRef}
			class="bottom-sheet-overlay fixed inset-0 z-[var(--z-overlay)] bg-black/50"
			aria-hidden="true"
			style={overlayStyle}
			onclick={() => handleDialogOpenChange(false)}
		/>
		<Dialog.Content
			bind:ref={contentRef}
			class="bottom-sheet-content rounded-t-sheet fixed inset-x-0 bottom-0 z-[var(--z-overlay)] flex max-h-[85dvh] min-h-0 flex-col overflow-hidden bg-surface-container-high text-on-surface shadow-overlay outline-none"
			style={contentTransformStyle}
			data-dragging={isDragging ? '' : undefined}
			data-snapping-back={motion.state.phase === 'returning' ? '' : undefined}
			data-closing={motion.state.phase === 'closing' ? '' : undefined}
			restoreScrollDelay={0}
			onOpenAutoFocus={handleOpenAutoFocus}
			onInteractOutside={(event) => {
				event.preventDefault();
				handleDialogOpenChange(false);
			}}
			onEscapeKeydown={(event) => {
				event.preventDefault();
				handleDialogOpenChange(false);
			}}
		>
			<!-- Keep the dialog and its body lock mounted until spring completion. -->
			{#snippet child({ props })}
				<div {...props}>
					{#if showHandle}
						<!-- svelte-ignore a11y_no_static_element_interactions -->
						<div
							bind:this={dragHandleRef}
							class="relative flex shrink-0 touch-none justify-center py-3 before:absolute before:inset-x-0 before:-top-4 before:-bottom-4 before:content-['']"
							aria-label={dragDismissAria}
							onpointerdown={onHandlePointerDown}
							onlostpointercapture={onWindowPointerCancel}
						>
							<div class="h-1 w-10 rounded-full bg-on-surface-variant/40"></div>
						</div>
					{/if}

					{#if title || actions}
						<div
							class={[
								'flex shrink-0 items-center gap-3',
								showHandle ? 'px-4 pb-3' : 'px-6 pt-6 pb-2'
							]}
						>
							{#if title}
								<Dialog.Title
									bind:ref={titleRef}
									tabindex={-1}
									class={[
										'text-title-large min-w-0 flex-1 font-medium text-on-surface outline-none',
										showHandle ? 'truncate' : 'text-center'
									]}
								>
									{title}
								</Dialog.Title>
							{/if}
							{#if actions}
								<div class="shrink-0">
									{@render actions()}
								</div>
							{/if}
						</div>
					{/if}

					{#if description || children}
						<div
							class={[
								showHandle
									? [
											'app-scroll-y min-h-0 flex-1 overflow-y-auto',
											!footer &&
												'pb-[calc(1rem+var(--safe-area-inset-bottom,env(safe-area-inset-bottom,0px)))]'
										]
									: [
											'shrink-0 px-6',
											footer
												? 'pb-5'
												: 'pb-[calc(1.25rem+var(--safe-area-inset-bottom,env(safe-area-inset-bottom,0px)))]'
										]
							]}
						>
							{#if description}
								<Dialog.Description
									class={[
										'text-body-medium leading-relaxed text-on-surface-variant',
										!showHandle && 'text-center'
									]}
								>
									{description}
								</Dialog.Description>
							{/if}
							{#if children}
								{@render children()}
							{/if}
						</div>
					{/if}

					{#if footer}
						<div
							class={[
								'flex shrink-0 items-center gap-2',
								showHandle
									? 'mt-2 justify-end ps-4 pe-[calc(1rem+var(--tabbar-inline-safe,0px))] pb-[calc(var(--safe-area-inset-bottom,env(safe-area-inset-bottom,0px))+0.75rem)]'
									: 'w-full justify-stretch gap-3 border-t border-outline-variant/40 ps-6 pe-[calc(1.5rem+var(--tabbar-inline-safe,0px))] pt-4 pb-[calc(var(--safe-area-inset-bottom,env(safe-area-inset-bottom,0px))+0.75rem)] [&>button]:flex-1'
							]}
						>
							{@render footer()}
						</div>
					{/if}
				</div>
			{/snippet}
		</Dialog.Content>
	</Dialog.Portal>
</Dialog.Root>

<style>
	@media (orientation: landscape) and (max-height: 500px) {
		:global(.bottom-sheet-content[data-dialog-content]) {
			inset-inline-end: var(--shell-tab-bar-inline-size, 0px);
			max-width: min(32rem, calc(100vw - var(--shell-tab-bar-inline-size, 0px)));
			max-height: calc(100dvh - var(--safe-area-inset-top, env(safe-area-inset-top, 0px)) - 0.5rem);
			margin-inline: auto;
		}
	}

	:global(.bottom-sheet-content[data-dialog-content]),
	:global(.bottom-sheet-overlay[data-dialog-overlay]) {
		transition: none;
	}
</style>
