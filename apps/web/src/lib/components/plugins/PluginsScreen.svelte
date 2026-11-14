<script lang="ts">
	import { formatBytes } from '#lib/utils/format-bytes.ts';
	import { hostT } from '#lib/i18n/host-i18n.svelte.ts';
	import { onMount } from 'svelte';
	import { getAppController } from '#lib/services/app-engine.ts';
	import type { ConfigSchema } from '@chronos/core';
	import { resolveLocaleMapText } from '@chronos/core';
	import SegmentedControl from '#lib/components/ui/SegmentedControl.svelte';
	import Button from '#lib/components/ui/Button.svelte';
	import Dialog from '#lib/components/ui/Dialog.svelte';
	import BottomSheet from '#lib/components/ui/BottomSheet.svelte';
	import LoadingIndicator from '#lib/components/ui/LoadingIndicator.svelte';
	import FormScreenLayout from '#lib/components/ui/FormScreenLayout.svelte';
	import type { EdgeBarAction } from '@chronos/ui-kit';
	import PluginConfigModal from './PluginConfigModal.svelte';
	import { groupCatalogManifestsByCategory } from '#lib/services/official-plugins/catalog-sort.ts';
	import {
		getPluginCategoryMeta,
		resolvePluginCatalogCategory
	} from '#lib/services/official-plugins/plugin-tags.ts';
	import { describeInstallSource } from '#lib/services/official-plugins/manifest-url.ts';
	import PluginInstallAction from './PluginInstallAction.svelte';
	import { CheckCircleFill, DownloadFill, TuneFill } from '#lib/icons/index.ts';
	import { createPluginsScreen } from './plugins-screen.svelte';

	const screen = createPluginsScreen();
	const appController = getAppController();
	onMount(screen.start);
	let activeTab = $state<'installed' | 'official'>('installed');
	const instanceId = $props.id();
	const panelId = `${instanceId}-plugin-panel`;
	const edgeActions = $derived.by((): EdgeBarAction[] =>
		activeTab === 'official'
			? [
					{
						id: 'install-link',
						label: hostT('plugins.link.open'),
						icon: DownloadFill,
						variant: 'outlined',
						disabled: screen.state.installationFrozen,
						onClick: promptLinkInstall
					}
				]
			: []
	);
	let configModalOpen = $state(false);
	let configModalData = $state<{
		id: string;
		name: string;
		schema: ConfigSchema<Record<string, unknown>>;
	}>({ id: '', name: '', schema: {} });
	let uninstallDialogOpen = $state(false);
	let uninstallTarget = $state({ id: '', name: '' });
	let linkInstallDialogOpen = $state(false);
	let manifestUrlInput = $state('');
	const linkInstallSource = $derived(describeInstallSource(manifestUrlInput.trim()));
	const activeLocale = $derived(appController.locale);
	const groupedCatalogManifests = $derived(
		groupCatalogManifestsByCategory(screen.state.catalogManifests, activeLocale)
	);
	const tabSegments = $derived.by(() => {
		void appController.locale;
		void appController.slotVersion;
		return [
			{
				value: 'installed',
				label: hostT('plugins.tab.installed', { count: screen.state.installedRecords.length }),
				id: `${instanceId}-installed`,
				controls: panelId
			},
			{
				value: 'official',
				label: hostT('plugins.tab.market'),
				id: `${instanceId}-official`,
				controls: panelId
			}
		];
	});
	function resolveManifestText(
		value: string | Record<string, string> | (() => string) | undefined
	): string {
		if (!value) return '';
		if (typeof value === 'function') return value();
		if (typeof value === 'string') return value;
		return resolveLocaleMapText(value, activeLocale);
	}
	function promptLinkInstall() {
		manifestUrlInput = '';
		linkInstallDialogOpen = true;
	}
	async function confirmLinkInstall() {
		if (await screen.installLink(manifestUrlInput)) {
			activeTab = 'installed';
			linkInstallDialogOpen = false;
			manifestUrlInput = '';
		}
	}
	function promptUninstall(id: string, name: string) {
		uninstallTarget = { id, name };
		uninstallDialogOpen = true;
	}
	async function confirmUninstall() {
		if (screen.state.installationFrozen || !uninstallTarget.id) return;
		uninstallDialogOpen = false;
		await screen.uninstall(uninstallTarget.id);
	}
	function handleOpenConfig(
		id: string,
		name: string,
		schema?: ConfigSchema<Record<string, unknown>>
	) {
		if (!schema) return;
		configModalData = { id, name, schema };
		configModalOpen = true;
	}
</script>

{#snippet tabHeader()}
	<div class="mx-auto w-full max-w-lg">
		<SegmentedControl
			segments={tabSegments}
			value={activeTab}
			ariaLabel={hostT('plugins.tabsAria')}
			onValueChange={(val) => (activeTab = val as 'installed' | 'official')}
		/>
	</div>
{/snippet}

<FormScreenLayout class="text-on-surface" header={tabHeader} actions={edgeActions}>
	<div
		id={panelId}
		role="tabpanel"
		aria-labelledby="{instanceId}-{activeTab}"
		class="flex flex-col gap-5"
	>
		{#if screen.state.installationFrozen}<p
				role="status"
				class="text-body-medium px-4 text-on-surface-variant"
			>
				{hostT('plugins.update.locked')}
			</p>{/if}
		{#if activeTab === 'installed'}
			{#if screen.state.preinstallFailures.length}
				<section class="ui-section">
					{#each screen.state.preinstallFailures as [id, error] (id)}<p>{id}: {error}</p>{/each}
					<Button onclick={() => screen.retryPreinstall()}
						>{hostT('plugins.preinstall.retry')}</Button
					>
				</section>
			{/if}
			{#if screen.state.activeInstallTasks.length > 0}
				<section class="ui-section">
					<div class="flex items-center justify-between px-1">
						<h3 class="text-label-large font-command font-medium text-on-surface">
							{hostT('plugins.installing.heading')}
						</h3>
						<span class="text-label-small text-supporting text-on-surface-variant">
							{hostT('plugins.builtin.count', { count: screen.state.activeInstallTasks.length })}
						</span>
					</div>
					<div class="ui-section-surface [&>*+*]:border-t [&>*+*]:border-border/40">
						{#each screen.state.activeInstallTasks as task (task.pluginId)}
							{@const manifest = task.manifest}
							{@const name = resolveManifestText(manifest.name)}
							{@const desc = resolveManifestText(manifest.description)}
							<div
								class="ui-row-state flex items-center justify-between gap-3 p-3 transition-colors"
							>
								<div class="flex min-w-0 flex-1 flex-col justify-center">
									<span class="text-body-medium line-clamp-1 font-semibold text-on-surface">
										{name}
									</span>
									{#if desc}
										<p
											class="text-body-small text-supporting mt-0.5 line-clamp-1 text-on-surface-variant"
										>
											{desc}
										</p>
									{/if}
								</div>
								<PluginInstallAction
									pluginName={name}
									disabled={screen.state.installationFrozen}
									{manifest}
									installed={screen.isInstalled(manifest.id)}
									{task}
									onInstall={() => screen.install(manifest, task.manifestUrl)}
									onCancel={() => screen.cancel(manifest.id)}
									onRetry={() => screen.retry(manifest.id)}
								/>
							</div>
						{/each}
					</div>
				</section>
			{/if}

			<section class="ui-section">
				<div class="flex items-center justify-between px-1">
					<h3 class="text-label-large font-command font-medium text-on-surface">
						{hostT('plugins.installed.heading')}
					</h3>
					<span class="text-label-small text-supporting text-on-surface-variant"
						>{hostT('plugins.builtin.count', {
							count: screen.state.installedRecords.length
						})}</span
					>
				</div>

				{#if screen.state.installedRecords.length === 0}
					<div
						class="flex flex-col items-center justify-center rounded-2xl border border-dashed border-border/60 bg-surface/40 px-4 py-8 text-center text-on-surface-variant"
					>
						<p class="text-body-medium">{hostT('plugins.empty.installed')}</p>
						<div class="mt-2 flex flex-wrap items-center justify-center gap-2">
							<Button variant="text" class="text-xs" onclick={() => (activeTab = 'official')}>
								{hostT('plugins.empty.browse')}
							</Button>
							<Button variant="outlined" class="text-xs" onclick={promptLinkInstall}>
								{hostT('plugins.link.open')}
							</Button>
						</div>
					</div>
				{:else}
					<div class="ui-section-surface [&>*+*]:border-t [&>*+*]:border-border/40">
						{#each screen.state.installedRecords as record (record.manifest.id)}
							{@const name = resolveManifestText(record.manifest.name)}
							{@const desc = resolveManifestText(record.manifest.description)}
							{@const meta = getPluginCategoryMeta(resolvePluginCatalogCategory(record.manifest))}
							{@const isBusy = screen.state.operatingPluginId === record.manifest.id}
							{@const update = screen.state.updateStatuses[record.manifest.id]}
							<div
								class="ui-row-state flex items-center justify-between gap-3 p-3 transition-colors"
							>
								<div class="flex min-w-0 flex-1 flex-col gap-2">
									<div>
										<div class="flex flex-wrap items-center gap-1.5">
											<span class="text-body-medium line-clamp-1 font-semibold text-on-surface">
												{name}
											</span>
											<span
												class="text-label-small py-0.2 text-caption rounded-full px-1.5 {meta.badgeClass}"
											>
												{meta.label}
											</span>
										</div>
										{#if desc}
											<p
												class="text-body-small text-supporting mt-0.5 line-clamp-1 text-on-surface-variant"
											>
												{desc}
											</p>
										{/if}
										{#if record.manifest.author}
											<p class="text-caption mt-1 text-on-surface-variant/70">
												by {record.manifest.author}
											</p>
										{/if}
									</div>

									{#if update && update.status !== 'ready'}
										<p
											class="text-body-small text-supporting text-on-surface-variant"
											title={update.error}
										>
											{hostT(`plugins.update.${update.status}`)}
										</p>
										{#if update.status === 'confirmation-required'}
											<Button
												variant="outlined"
												disabled={isBusy || screen.state.installationFrozen}
												onclick={() => screen.confirmCompatibility(record.manifest.id)}
												>{hostT('plugins.action.confirmCompatibility')}</Button
											>
										{:else if update.status !== 'downloading'}
											<Button
												variant="outlined"
												disabled={screen.state.installationFrozen}
												onclick={() => screen.retryPendingUpdates()}
												>{hostT('plugins.action.retry')}</Button
											>
										{/if}
									{/if}
									{#if record.manifest.configSchema}
										<div class="flex items-center gap-1.5">
											<Button
												variant="outlined"
												class="text-label-small h-7 px-2.5"
												disabled={isBusy || update?.status === 'confirmation-required'}
												onclick={() =>
													handleOpenConfig(record.manifest.id, name, record.manifest.configSchema)}
											>
												<TuneFill class="mr-0.5 size-3" />
												{hostT('plugins.action.settings')}
											</Button>
										</div>
									{/if}
								</div>
								<div class="flex shrink-0 items-center justify-end">
									{#if screen.isPreinstalled(record.manifest.id)}
										<span
											class="text-label-large inline-flex h-7 min-h-7 min-w-24 shrink-0 items-center justify-center gap-1 rounded-full border border-transparent bg-surface-variant px-2.5 text-on-surface-variant"
										>
											<CheckCircleFill class="size-3.5" />
											{hostT('plugins.preinstall.label')}
										</span>
									{:else}
										<Button
											variant="text"
											tone="danger"
											class="text-caption h-6 shrink-0 px-1.5"
											disabled={isBusy || screen.state.installationFrozen}
											onclick={() => promptUninstall(record.manifest.id, name)}
										>
											{hostT('common.uninstall')}
										</Button>
									{/if}
								</div>
							</div>
						{/each}
					</div>
				{/if}
			</section>
		{:else}
			<section class="ui-section">
				{#if screen.state.loadingCatalog}
					<div class="flex flex-col items-center justify-center py-12">
						<LoadingIndicator size="large" />
						<p class="text-body-small text-supporting mt-2 text-on-surface-variant">
							{hostT('plugins.catalog.loading')}
						</p>
					</div>
				{:else if screen.state.catalogError}
					<div
						class="flex flex-col items-center justify-center rounded-2xl border border-error/30 bg-error-container/20 p-6 text-center"
					>
						<p class="text-body-medium font-medium text-error">
							{hostT('plugins.catalog.error.title')}
						</p>
						<p class="text-body-small text-supporting mt-1 text-on-surface-variant">
							{screen.state.catalogError}
						</p>
						<Button variant="outlined" class="mt-3 h-8 px-4 text-xs" onclick={screen.loadCatalog}>
							{hostT('plugins.catalog.retry')}
						</Button>
					</div>
				{:else if screen.state.catalogManifests.length === 0}
					<div
						class="flex flex-col items-center justify-center rounded-2xl border border-dashed border-border/60 bg-surface/40 px-4 py-12 text-center text-on-surface-variant"
					>
						<p class="text-body-medium">{hostT('plugins.catalog.empty')}</p>
					</div>
				{:else}
					<div class="flex flex-col gap-5">
						{#each groupedCatalogManifests as group (group.category)}
							{@const groupMeta = getPluginCategoryMeta(group.category)}
							<div class="flex flex-col gap-2">
								<div class="px-1">
									<h3 class="text-label-large font-command font-medium text-on-surface">
										{groupMeta.label}
									</h3>
								</div>
								<div class="ui-section-surface [&>*+*]:border-t [&>*+*]:border-border/40">
									{#each group.entries as entry (entry.manifest.id)}
										{@const manifest = entry.manifest}
										{@const name = resolveManifestText(manifest.name)}
										{@const desc = resolveManifestText(manifest.description)}
										{@const installed = screen.isInstalled(manifest.id)}
										<div
											class="ui-row-state flex items-center justify-between gap-3 p-3 transition-colors"
										>
											<div class="flex min-w-0 flex-1 flex-col justify-center">
												<div class="flex flex-wrap items-center gap-1.5">
													<span class="text-body-medium line-clamp-1 font-semibold text-on-surface">
														{name}
													</span>
												</div>
												{#if desc}
													<p
														class="text-body-small text-supporting mt-0.5 line-clamp-1 text-on-surface-variant"
													>
														{desc}
													</p>
												{/if}
												{#if screen.hasUnavailableServerCapability(manifest)}
													<p class="text-body-small text-supporting mt-1 text-on-surface-variant">
														{hostT('plugins.online.unavailable')}
													</p>
												{/if}
												{#if manifest.author || manifest.downloadSizeBytes !== undefined}
													<div class="mt-1 flex flex-wrap items-center gap-1">
														{#if manifest.author}
															<span class="text-caption text-on-surface-variant/70"
																>by {manifest.author}</span
															>
														{/if}
														{#if manifest.downloadSizeBytes !== undefined}
															<span
																class="text-caption inline-flex items-center gap-1 text-on-surface-variant/70"
															>
																<span aria-hidden="true">｜</span>
																{formatBytes(manifest.downloadSizeBytes, 0)}
															</span>
														{/if}
													</div>
												{/if}
											</div>

											<div class="flex shrink-0 flex-col items-end gap-1">
												<PluginInstallAction
													pluginName={name}
													disabled={screen.state.installationFrozen}
													{manifest}
													{installed}
													needsUpdate={screen.needsUpdate(manifest)}
													task={screen.state.taskMap.get(manifest.id)}
													onInstall={() => screen.install(manifest, entry.url)}
													onCancel={() => screen.cancel(manifest.id)}
													onRetry={() => screen.retry(manifest.id)}
												/>
											</div>
										</div>
									{/each}
								</div>
							</div>
						{/each}
					</div>
				{/if}
			</section>
		{/if}
	</div>
</FormScreenLayout>

<PluginConfigModal
	bind:open={configModalOpen}
	pluginId={configModalData.id}
	pluginName={configModalData.name}
	schema={configModalData.schema}
/>

<BottomSheet
	bind:open={uninstallDialogOpen}
	showHandle={false}
	title={hostT('plugins.uninstall.title')}
	description={hostT('plugins.uninstall.desc', {
		name: uninstallTarget.name || uninstallTarget.id
	})}
>
	{#snippet footer()}
		<Button variant="text" onclick={() => (uninstallDialogOpen = false)}>
			{hostT('common.cancel')}
		</Button>
		<Button variant="danger" onclick={confirmUninstall}>
			{hostT('common.uninstall')}
		</Button>
	{/snippet}
</BottomSheet>

<Dialog bind:open={linkInstallDialogOpen} title={hostT('plugins.link.title')}>
	<div class="flex flex-col gap-3 py-2">
		<div class="ui-form-field">
			<label class="ui-field-label" for="plugin-manifest-url">
				{hostT('plugins.link.placeholder')}
			</label>
			<input
				id="plugin-manifest-url"
				class="ui-form-field-input"
				type="url"
				placeholder={hostT('plugins.link.placeholder')}
				bind:value={manifestUrlInput}
				disabled={screen.state.linkInstallInProgress}
			/>
		</div>
		{#if linkInstallSource}
			<p class="text-body-small text-supporting text-on-surface-variant">
				{hostT('plugins.link.source', { origin: linkInstallSource })}
			</p>
		{/if}
		{#if screen.state.linkInstallInProgress}
			<div class="flex items-center gap-2 text-on-surface-variant">
				<LoadingIndicator size="small" />
				<span class="text-body-small">{hostT('plugins.link.installing')}</span>
			</div>
		{/if}
	</div>
	{#snippet footer()}
		<Button
			variant="text"
			disabled={screen.state.linkInstallInProgress}
			onclick={() => (linkInstallDialogOpen = false)}
		>
			{hostT('common.cancel')}
		</Button>
		<Button
			variant="filled"
			disabled={screen.state.linkInstallInProgress || screen.state.installationFrozen}
			onclick={confirmLinkInstall}
		>
			{screen.state.linkInstallInProgress
				? hostT('plugins.action.installing')
				: hostT('plugins.link.confirm')}
		</Button>
	{/snippet}
</Dialog>
