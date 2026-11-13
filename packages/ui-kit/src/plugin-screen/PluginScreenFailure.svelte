<script lang="ts">
	import type { ChronosUiView } from '../reactivity/chronos-ui-controller';
	let {
		controller,
		retry
	}: {
		controller?: Pick<ChronosUiView, 'translatePlugin'>;
		retry: () => void;
	} = $props();
	const hostT = (key: string, fallback: string) =>
		controller?.translatePlugin('host-ui', key) ?? fallback;
</script>

<div class="flex flex-col items-center gap-3 p-4 text-center">
	<p class="text-body-medium text-error" role="alert">
		{hostT('pluginScreen.failed', 'Plugin screen failed to load')}
	</p>
	<button type="button" class="ui-btn ui-btn-outlined" onclick={retry}>
		{hostT('pluginScreen.retry', 'Reload')}
	</button>
</div>
