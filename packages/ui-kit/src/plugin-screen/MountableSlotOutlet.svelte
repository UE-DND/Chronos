<script lang="ts">
	import { getAllContexts, untrack } from 'svelte';
	import { isChronosMountable, isChronosMountHandle, type ChronosMountHandle } from '@chronos/core';

	interface Props {
		/** A contribution whose `component` may be a CHRONOS_MOUNTABLE bundle UI. */
		component: unknown;
		/** Props forwarded to `mount(target, props)`. */
		props?: Record<string, unknown>;
		class?: string;
	}

	let { component, props = {}, class: className = undefined }: Props = $props();

	let containerEl = $state<HTMLDivElement>();
	const parentContext = getAllContexts();

	const mountable = $derived(isChronosMountable(component));

	let mountHandle = $state.raw<ChronosMountHandle | undefined>();

	$effect(() => {
		if (!containerEl || !isChronosMountable(component)) {
			mountHandle = undefined;
			return;
		}

		const targetComponent = component;
		const initialProps = untrack(() => props);
		let handle: ChronosMountHandle;
		try {
			handle = targetComponent.mount(containerEl, initialProps, parentContext);
			if (!isChronosMountHandle(handle))
				throw new Error(
					'Invalid mount handle: expected an object with unmount() and optional update()'
				);
			mountHandle = handle;
		} catch (error) {
			console.error('[MountableSlotOutlet] mount failed:', error);
			mountHandle = undefined;
			return;
		}

		return () => {
			try {
				handle.unmount();
			} catch (error) {
				console.error('[MountableSlotOutlet] unmount failed:', error);
			} finally {
				if (mountHandle === handle) mountHandle = undefined;
			}
		};
	});

	$effect(() => {
		if (!mountHandle?.update) return;
		mountHandle.update(props);
	});
</script>

{#if mountable}
	<div bind:this={containerEl} class={className}></div>
{/if}
