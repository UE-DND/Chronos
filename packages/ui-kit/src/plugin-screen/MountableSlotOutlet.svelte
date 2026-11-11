<script lang="ts">
	import { getAllContexts, untrack } from 'svelte';
	import type { ChronosUiController } from '../reactivity/chronos-ui-controller';
	import { createMountableController } from './mountable-controller.svelte';
	import PluginScreenFailure from './PluginScreenFailure.svelte';

	interface Props {
		/** A contribution whose `component` may be a CHRONOS_MOUNTABLE bundle UI. */
		component: unknown;
		/** Props forwarded to `mount(target, props)`. */
		props?: Record<string, unknown> & { controller?: ChronosUiController };
		class?: string;
	}

	let { component, props = {}, class: className = undefined }: Props = $props();

	let containerEl = $state<HTMLDivElement>();
	const parentContext = getAllContexts();
	const screen = createMountableController();
	const failed = $derived(screen.state.phase === 'failed');

	$effect(() => {
		if (!containerEl) return;
		const target = containerEl;
		const targetComponent = component;
		untrack(() => screen.mount(targetComponent, target, props, parentContext));
		return () => untrack(screen.dispose);
	});

	$effect(() => {
		const nextProps = props;
		untrack(() => screen.update(nextProps));
	});
</script>

<div bind:this={containerEl} class={className} style:display={failed ? 'none' : undefined}></div>
{#if failed}
	<div class={className}>
		<PluginScreenFailure controller={props.controller} retry={() => screen.retry(props)} />
	</div>
{/if}
