<script lang="ts">
	import type { Component } from 'svelte';
	import type { Readable } from 'svelte/store';
	import { fromStore } from 'svelte/store';
	import type { ChronosUiController } from '../reactivity/chronos-ui-controller';
	import PluginScreenFailure from './PluginScreenFailure.svelte';

	interface Props {
		component: Component<Record<string, unknown>>;
		propsStore: Readable<Record<string, unknown>>;
	}

	let { component, propsStore }: Props = $props();
	const ResolvedComponent = $derived(component);
	const resolvedProps = $derived.by(() => fromStore(propsStore).current);
</script>

<div class="flex h-full min-h-0 w-full flex-1 flex-col overflow-hidden">
	<svelte:boundary
		onerror={(error) => console.error('[MountableSvelteHost] render failed:', error)}
	>
		<ResolvedComponent {...resolvedProps} />
		{#snippet failed(_error, reset)}
			<PluginScreenFailure
				controller={resolvedProps.controller as ChronosUiController | undefined}
				retry={reset}
			/>
		{/snippet}
	</svelte:boundary>
</div>
