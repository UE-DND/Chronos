<script lang="ts">
	import { getContext, untrack } from 'svelte';
	import type { ChronosUiView } from '../reactivity/chronos-ui-controller';
	import type { ChronosContext } from '@chronos/core';
	import { OVERLAY_LIFECYCLE_CONTEXT, type OverlayParent } from '../overlay/history-overlay';
	import { createMountableController } from './mountable-controller.svelte';
	import PluginScreenFailure from './PluginScreenFailure.svelte';

	interface Props {
		/** A contribution whose `component` may be a CHRONOS_MOUNTABLE bundle UI. */
		component: unknown;
		/** Props forwarded to `mount(target, props)`. */
		props?: object & { controller?: ChronosUiView; context?: ChronosContext };
		class?: string;
	}

	let { component, props = {}, class: className = undefined }: Props = $props();

	let containerEl = $state<HTMLDivElement>();
	const parent = getContext<OverlayParent | undefined>(OVERLAY_LIFECYCLE_CONTEXT);
	const overlayParent = parent && Object.freeze({ attachChild: parent.attachChild.bind(parent) });
	const publicProps = $derived({ ...props, overlayParent });
	const instanceContext = $derived(props.context);
	const screen = createMountableController();
	const failed = $derived(screen.state.phase === 'failed');

	$effect(() => {
		if (!containerEl) return;
		const target = containerEl;
		const targetComponent = component;
		const context = instanceContext;
		void context?.instanceToken;
		untrack(() => screen.mount(targetComponent, target, publicProps));
		const stop = () => untrack(screen.dispose);
		context?.signal.addEventListener('abort', stop, { once: true });
		return () => {
			context?.signal.removeEventListener('abort', stop);
			stop();
		};
	});

	$effect(() => {
		const nextProps = publicProps;
		untrack(() => screen.update(nextProps));
	});
</script>

<div bind:this={containerEl} class={className} style:display={failed ? 'none' : undefined}></div>
{#if failed}
	<div class={className}>
		<PluginScreenFailure controller={props.controller} retry={() => screen.retry(publicProps)} />
	</div>
{/if}
