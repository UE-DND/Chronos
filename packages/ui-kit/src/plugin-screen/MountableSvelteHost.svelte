<script lang="ts">
	import { setContext, untrack, type Component } from 'svelte';
	import type { Readable } from 'svelte/store';
	import { fromStore, get } from 'svelte/store';
	import type { ChronosUiView } from '../reactivity/chronos-ui-controller';
	import { OVERLAY_LIFECYCLE_CONTEXT, type OverlayParent } from '../overlay/history-overlay';
	import PluginScreenFailure from './PluginScreenFailure.svelte';

	interface Props {
		component: Component<Record<string, unknown>>;
		propsStore: Readable<Record<string, unknown>>;
		onFailure?: (error: unknown) => void;
	}

	let { component, propsStore, onFailure }: Props = $props();
	// Recreate only the documented overlay ancestry in this plugin's Svelte runtime.
	const initialProps = untrack(() => get(propsStore));
	setContext(OVERLAY_LIFECYCLE_CONTEXT, initialProps.overlayParent as OverlayParent | undefined);
	const ResolvedComponent = $derived(component);
	const resolvedProps = $derived.by(() => fromStore(propsStore).current);
</script>

<div class="flex h-full min-h-0 w-full flex-1 flex-col overflow-hidden">
	<svelte:boundary
		onerror={(error) => {
			console.error('[MountableSvelteHost] render failed:', error);
			onFailure?.(error);
		}}
	>
		<ResolvedComponent {...resolvedProps} />
		{#snippet failed(_error, reset)}
			<PluginScreenFailure
				controller={resolvedProps.controller as ChronosUiView | undefined}
				retry={reset}
			/>
		{/snippet}
	</svelte:boundary>
</div>
