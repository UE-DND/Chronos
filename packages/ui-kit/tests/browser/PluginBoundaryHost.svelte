<script lang="ts">
	import { setContext, untrack } from 'svelte';
	import PluginScreenContainer from '../../src/plugin-screen/PluginScreenContainer.svelte';
	import {
		createEdgeBarActions,
		setEdgeBarActions
	} from '../../src/plugin-screen/edge-bar-actions.svelte';
	import type { ChronosUiController } from '../../src/reactivity/chronos-ui-controller';
	import {
		OVERLAY_LIFECYCLE_CONTEXT,
		type HistoryOverlaySync
	} from '../../src/overlay/history-overlay';
	let {
		controller,
		pluginId,
		parent
	}: {
		controller: ChronosUiController;
		pluginId: string;
		parent: HistoryOverlaySync;
	} = $props();
	const edgeActions = createEdgeBarActions();
	setEdgeBarActions(edgeActions);
	setContext('chronos.test.private', { privateHostController: true });
	setContext(
		OVERLAY_LIFECYCLE_CONTEXT,
		untrack(() => parent)
	);
</script>

<p data-testid="edge-count">{edgeActions.get(pluginId).length}</p>
<PluginScreenContainer {controller} {pluginId} />
