<script lang="ts">
	import { hostT } from '#lib/i18n/host-i18n.svelte.ts';
	import Dialog from '#lib/components/ui/Dialog.svelte';
	import Button from '#lib/components/ui/Button.svelte';
	import { SchemaForm, findInvalidSchemaFields } from '@chronos/ui-kit';
	import type { ConfigSchema } from '@chronos/core';
	import {
		getAppEngine,
		getAppController,
		getOfficialPluginService
	} from '#lib/services/app-engine.ts';
	import { snackbarKey } from '#lib/components/ui/snackbar-state.svelte.ts';

	let {
		open = $bindable(false),
		pluginId = '',
		pluginName = '',
		schema = {}
	}: {
		open?: boolean;
		pluginId: string;
		pluginName: string;
		schema: ConfigSchema<Record<string, unknown>>;
	} = $props();

	const engine = getAppEngine();
	const appController = getAppController();
	const officialPlugins = getOfficialPluginService();

	let formValues = $state<Record<string, unknown>>({});
	let loading = $state(true);
	let saving = $state(false);
	let loadFailed = $state(false);
	let loadRequest = 0;

	const invalidFields = $derived(findInvalidSchemaFields(schema, formValues));

	$effect(() => {
		const id = pluginId;
		++loadRequest;
		let active = true;
		loading = true;
		loadFailed = false;
		if (open && id) {
			void loadConfig(id, () => active && open && pluginId === id);
		}
		return () => {
			active = false;
		};
	});

	async function loadConfig(id: string, isCurrent: () => boolean) {
		const request = ++loadRequest;
		const current = () => request === loadRequest && isCurrent();
		loading = true;
		loadFailed = false;
		try {
			const saved = await officialPlugins.getPluginConfig(id);
			if (!current()) return;
			if (saved) {
				formValues = { ...saved };
			} else {
				const ctx = engine.getPluginContext(id);
				formValues = { ...ctx.config };
			}
		} catch (error) {
			console.error('[PluginConfigModal] config load failed', error);
			if (current()) loadFailed = true;
		} finally {
			if (current()) loading = false;
		}
	}

	async function handleSave() {
		if (
			loading ||
			loadFailed ||
			saving ||
			!open ||
			findInvalidSchemaFields(schema, formValues).length > 0
		)
			return;
		saving = true;
		try {
			const ctx = engine.getPluginContext(pluginId);
			await ctx.updateConfig(formValues);
			snackbarKey('plugins.config.saved', { name: pluginName || pluginId });
			open = false;
		} catch (err: unknown) {
			console.error('[PluginConfigModal] config save failed', err);
			snackbarKey('plugins.config.saveUnavailable');
		} finally {
			saving = false;
		}
	}
</script>

<Dialog bind:open title={hostT('plugins.config.title', { name: pluginName || pluginId })}>
	<div class="py-2">
		{#if loadFailed}
			<p class="text-body-medium text-error" role="alert">{hostT('plugins.config.loadFailed')}</p>
			<Button
				variant="outlined"
				onclick={() => {
					const id = pluginId;
					void loadConfig(id, () => open && pluginId === id);
				}}>{hostT('common.retry')}</Button
			>
		{:else if Object.keys(schema).length > 0}
			<SchemaForm
				{schema}
				bind:value={formValues}
				controller={appController}
				disabled={loading || saving}
			/>
		{:else}
			<p class="text-body-medium text-on-surface-variant">
				{hostT('plugins.config.empty')}
			</p>
		{/if}
	</div>

	{#snippet footer()}
		<Button variant="text" disabled={saving} onclick={() => (open = false)}>
			{hostT('common.cancel')}
		</Button>
		<Button
			variant="filled"
			disabled={loading || loadFailed || saving || invalidFields.length > 0}
			onclick={handleSave}
		>
			{saving ? hostT('plugins.config.saving') : hostT('plugins.config.save')}
		</Button>
	{/snippet}
</Dialog>
