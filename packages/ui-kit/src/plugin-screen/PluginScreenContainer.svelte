<script lang="ts">
	import type { ChronosUiController } from '../reactivity/chronos-ui-controller';
	import SchemaForm from '../schema-form/SchemaForm.svelte';
	import { resolvePluginScreenSlot } from './resolve-plugin-screen-slot';
	import MountableSlotOutlet from './MountableSlotOutlet.svelte';
	import { getEdgeBarActions } from './edge-bar-actions.svelte';
	import { appShellScroll } from '../actions/app-scroll';
	import { createPluginUiProps } from './plugin-ui-props';

	interface Props {
		controller: ChronosUiController;
		pluginId: string;
		viewId?: string;
		active?: boolean;
	}

	let { controller, pluginId, viewId = 'index', active = true }: Props = $props();
	const edgeActions = getEdgeBarActions();

	const hostT = (key: string, params?: Record<string, unknown>) =>
		controller.translatePlugin('host-ui', key, params);

	const screenSlot = $derived(
		resolvePluginScreenSlot(controller.getSlots('shell.route.screen'), pluginId, viewId, (slotId) =>
			controller.resolveSlotOwner('shell.route.screen', slotId)
		)
	);
	const pluginProps = $derived(
		screenSlot
			? createPluginUiProps(controller, pluginId, {
					active,
					viewId,
					edgeActions
				})
			: undefined
	);

	let formValues = $derived<Record<string, unknown>>(
		screenSlot?.schema && !screenSlot.component && pluginProps
			? { ...pluginProps.context.config }
			: {}
	);
	let saving = $state(false);
	let saveError = $state<string | null>(null);

	async function saveSchemaConfig() {
		if (!screenSlot?.schema) return;
		saving = true;
		saveError = null;
		try {
			const ctx = controller.getPluginContext(pluginId);
			await ctx.updateConfig(formValues);
		} catch (err: unknown) {
			console.error('[PluginScreenContainer] config save failed', err);
			saveError = hostT('plugins.config.saveUnavailable');
		} finally {
			saving = false;
		}
	}
</script>

<div
	class="plugin-screen-container flex h-full min-h-0 w-full min-w-0 flex-1 flex-col overflow-hidden"
>
	{#if screenSlot?.component && pluginProps}
		<MountableSlotOutlet
			component={screenSlot.component}
			props={pluginProps}
			class="flex h-full min-h-0 w-full flex-1 flex-col overflow-hidden"
		/>
	{:else if screenSlot?.schema && pluginProps}
		<div use:appShellScroll class="secondary-scroll min-h-0 w-full flex-1 overflow-y-auto p-4">
			<div class="ui-section-surface ui-section-surface--comfortable">
				<div class="ui-section-stack">
					<SchemaForm schema={screenSlot.schema} bind:value={formValues} {controller} />
					{#if saveError}
						<p class="text-body-small text-error">{saveError}</p>
					{/if}
					<button
						type="button"
						class="ui-btn ui-btn-filled ui-btn-block"
						disabled={saving}
						onclick={saveSchemaConfig}
					>
						{saving ? hostT('plugins.config.saving') : hostT('plugins.config.save')}
					</button>
				</div>
			</div>
		</div>
	{:else}
		<div use:appShellScroll class="secondary-scroll min-h-0 w-full flex-1 overflow-y-auto p-4">
			<div
				class="flex flex-col items-center justify-center py-16 text-center text-on-surface-variant"
			>
				<p class="text-body-large font-medium">{hostT('pluginScreen.notFound')}</p>
				<p class="text-body-small mt-1 opacity-75">
					{hostT('pluginScreen.notFoundDetail', { pluginId, viewId })}
				</p>
			</div>
		</div>
	{/if}
</div>

<style>
	.plugin-screen-container {
		/* The shell tab or secondary toolbar has already consumed the top safe area. */
		--topbar-safe: 0px;
		--top-bar-height: var(--spacing-topbar);
	}
</style>
