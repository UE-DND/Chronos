<script lang="ts">
	import { getAppEngine } from '$lib/services/app-engine';
	import { formatBytes } from '$lib/utils/format-bytes';
	import { hostT } from '$lib/i18n/host-i18n.svelte';
	import { onMount } from 'svelte';
	import {
		getOfficialPluginService,
		getAppController,
		ensureEngineFullyReady
	} from '$lib/services/app-engine';
	import type { InstalledOfficialPluginRecord } from '$lib/services/official-plugins/official-plugin-service';
	import type { PluginManifest, ConfigSchema } from '@chronos/core';
	import { resolveLocaleMapText } from '@chronos/core';
	import SegmentedControl from '$lib/components/ui/SegmentedControl.svelte';
	import Button from '$lib/components/ui/Button.svelte';
	import Switch from '$lib/components/ui/Switch.svelte';
	import Dialog from '$lib/components/ui/Dialog.svelte';
	import BottomSheet from '$lib/components/ui/BottomSheet.svelte';
	import LoadingIndicator from '$lib/components/ui/LoadingIndicator.svelte';
	import FormScreenLayout from '$lib/components/ui/FormScreenLayout.svelte';
	import type { EdgeBarAction } from '@chronos/ui-kit';
	import PluginConfigModal from './PluginConfigModal.svelte';
	import { snackbarKey } from '$lib/components/ui/snackbar-state.svelte';
	import { groupCatalogManifestsByCategory } from '$lib/services/official-plugins/catalog-sort';
	import {
		getPluginCategoryMeta,
		resolvePluginCatalogCategory
	} from '$lib/services/official-plugins/plugin-tags';
	import {
		assertValidManifestInstallUrl,
		describeInstallSource
	} from '$lib/services/official-plugins/manifest-url';
	import type { PluginInstallTask } from '$lib/services/official-plugins/install-queue';
	import PluginInstallAction from './PluginInstallAction.svelte';
	import { CheckCircleFill, DownloadFill, TuneFill } from '$lib/icons';

	const officialPlugins = getOfficialPluginService();
	const appController = getAppController();

	let activeTab = $state<'installed' | 'official'>('installed');
	const edgeActions = $derived.by((): EdgeBarAction[] =>
		activeTab === 'official'
			? [
					{
						id: 'install-link',
						label: hostT('plugins.link.open'),
						icon: DownloadFill,
						variant: 'outlined',
						onClick: promptLinkInstall
					}
				]
			: []
	);

	let updateStatuses = $state.raw<
		Record<string, ReturnType<typeof officialPlugins.getUpdateStatus>>
	>({});
	let preinstallFailures = $state.raw<[string, string][]>([]);
	let installedRecords = $state.raw<InstalledOfficialPluginRecord[]>([]);
	let catalogManifests = $state.raw<Array<{ url: string; manifest: PluginManifest }>>([]);
	let queueTasks = $state.raw<ReadonlyArray<PluginInstallTask>>([]);
	let loadingCatalog = $state(false);
	let catalogError = $state<string | null>(null);
	let operatingPluginId = $state<string | null>(null);

	const taskMap = $derived.by(() => {
		const map = new Map<string, PluginInstallTask>();
		for (const task of queueTasks) {
			map.set(task.pluginId, task);
		}
		return map;
	});

	const activeInstallTasks = $derived.by(() =>
		queueTasks.filter((task) => task.status !== 'completed' && task.status !== 'canceled')
	);

	let configModalOpen = $state(false);
	let configModalData = $state<{
		id: string;
		name: string;
		schema: ConfigSchema<Record<string, unknown>>;
	}>({
		id: '',
		name: '',
		schema: {}
	});

	let uninstallDialogOpen = $state(false);
	let uninstallTarget = $state<{ id: string; name: string }>({ id: '', name: '' });

	let linkInstallDialogOpen = $state(false);
	let linkInstallInProgress = $state(false);
	let manifestUrlInput = $state('');
	const linkInstallSource = $derived(describeInstallSource(manifestUrlInput.trim()));

	function refreshInstalled() {
		installedRecords = [...officialPlugins.listInstalled()];
		updateStatuses = Object.fromEntries(
			installedRecords.map((record) => [
				record.manifest.id,
				officialPlugins.getUpdateStatus(record.manifest.id)
			])
		);
		preinstallFailures = [...officialPlugins.listFailures()];
	}

	function refreshQueue() {
		queueTasks = officialPlugins.installQueue.getTasks();
	}

	onMount(() => {
		void ensureEngineFullyReady().then(async () => {
			refreshInstalled();
			refreshQueue();
			await loadOfficialCatalog();
		});

		const subInstalled = officialPlugins.onChanged(() => {
			refreshInstalled();
		});

		const subQueue = officialPlugins.installQueue.onChanged(({ kind }) => {
			refreshQueue();
			if (kind === 'state') {
				refreshInstalled();
			}
		});

		return () => {
			subInstalled.dispose();
			subQueue.dispose();
		};
	});

	async function loadOfficialCatalog() {
		loadingCatalog = true;
		catalogError = null;
		try {
			const catalog = await officialPlugins.fetchCatalog();
			const entries = await Promise.all(
				catalog.manifests.map(async (url) => {
					try {
						const manifest = await officialPlugins.fetchManifest(url);
						return { url, manifest };
					} catch (err) {
						console.error(`[PluginsScreen] Failed to fetch manifest ${url}:`, err);
						return null;
					}
				})
			);
			catalogManifests = entries.filter((entry) => entry !== null);
		} catch (err: unknown) {
			const msg = err instanceof Error ? err.message : String(err);
			catalogError = msg;
		} finally {
			loadingCatalog = false;
		}
	}

	const activeLocale = $derived(appController.currentLocale);

	const groupedCatalogManifests = $derived.by(() => {
		const locale = activeLocale;
		return groupCatalogManifestsByCategory(catalogManifests, locale);
	});

	const tabSegments = $derived.by(() => {
		void appController.currentLocale;
		void appController.slotVersion;
		return [
			{
				value: 'installed',
				label: hostT('plugins.tab.installed', {
					count: installedRecords.length
				})
			},
			{ value: 'official', label: hostT('plugins.tab.market') }
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

	function isInstalled(pluginId: string): boolean {
		return installedRecords.some((r) => r.manifest.id === pluginId);
	}

	function handleInstall(manifest: PluginManifest, manifestUrl?: string) {
		officialPlugins.installQueue.enqueue(manifest, manifestUrl);
	}

	function handleCancel(pluginId: string) {
		officialPlugins.installQueue.cancel(pluginId);
	}

	function handleRetry(pluginId: string) {
		officialPlugins.installQueue.retry(pluginId);
	}

	function promptLinkInstall() {
		manifestUrlInput = '';
		linkInstallDialogOpen = true;
	}

	async function confirmLinkInstall() {
		const url = manifestUrlInput.trim();
		if (!url) {
			snackbarKey('snackbar.manifestRequired');
			return;
		}

		try {
			assertValidManifestInstallUrl(url);
		} catch {
			snackbarKey('snackbar.manifestInvalid');
			return;
		}

		linkInstallInProgress = true;
		try {
			const manifest = await officialPlugins.fetchManifest(url);
			officialPlugins.installQueue.enqueue(manifest, url);
			activeTab = 'installed';
			linkInstallDialogOpen = false;
			manifestUrlInput = '';
		} catch (err: unknown) {
			const msg = err instanceof Error ? err.message : String(err);
			snackbarKey('snackbar.install.failed', { message: msg });
		} finally {
			linkInstallInProgress = false;
		}
	}

	function promptUninstall(pluginId: string, pluginName: string) {
		uninstallTarget = { id: pluginId, name: pluginName };
		uninstallDialogOpen = true;
	}

	async function confirmUninstall() {
		const targetId = uninstallTarget.id;
		if (!targetId) return;
		uninstallDialogOpen = false;
		operatingPluginId = targetId;
		try {
			await officialPlugins.uninstall(targetId);
		} catch (err: unknown) {
			const msg = err instanceof Error ? err.message : String(err);
			snackbarKey('snackbar.uninstall.failed', { message: msg });
		} finally {
			operatingPluginId = null;
		}
	}

	async function handleToggleEnabled(pluginId: string, enabled: boolean) {
		operatingPluginId = pluginId;
		try {
			if (enabled) {
				await officialPlugins.enable(pluginId);
			} else {
				await officialPlugins.disable(pluginId);
			}
		} catch (err: unknown) {
			const msg = err instanceof Error ? err.message : String(err);
			snackbarKey('snackbar.toggle.failed', { message: msg });
		} finally {
			operatingPluginId = null;
		}
	}

	function handleOpenConfig(
		id: string,
		name: string,
		schema?: ConfigSchema<Record<string, unknown>>
	) {
		if (!schema) return;
		configModalData = {
			id,
			name,
			schema
		};
		configModalOpen = true;
	}
</script>

{#snippet tabHeader()}
	<div class="mx-auto w-full max-w-lg">
		<SegmentedControl
			segments={tabSegments}
			value={activeTab}
			onValueChange={(val) => (activeTab = val as 'installed' | 'official')}
		/>
	</div>
{/snippet}

<FormScreenLayout class="text-on-surface" header={tabHeader} actions={edgeActions}>
	{#if activeTab === 'installed'}
		{#if preinstallFailures.length}
			<section class="ui-section">
				{#each preinstallFailures as [id, error] (id)}<p>{id}: {error}</p>{/each}
				<Button onclick={() => officialPlugins.retryPreinstall()}
					>{hostT('plugins.preinstall.retry')}</Button
				>
			</section>
		{/if}
		{#if activeInstallTasks.length > 0}
			<section class="ui-section">
				<div class="flex items-center justify-between px-1">
					<h3 class="text-label-large font-medium text-on-surface">
						{hostT('plugins.installing.heading')}
					</h3>
					<span class="text-label-small text-on-surface-variant">
						{hostT('plugins.builtin.count', { count: activeInstallTasks.length })}
					</span>
				</div>
				<div class="ui-section-surface [&>*+*]:border-t [&>*+*]:border-border/40">
					{#each activeInstallTasks as task (task.pluginId)}
						{@const manifest = task.manifest}
						{@const name = resolveManifestText(manifest.name)}
						{@const desc = resolveManifestText(manifest.description)}
						<div
							class="flex items-center justify-between gap-3 p-3 transition-colors hover:bg-surface-variant/30"
						>
							<div class="flex min-w-0 flex-1 flex-col justify-center">
								<span class="text-body-medium line-clamp-1 font-medium text-on-surface">
									{name}
								</span>
								{#if desc}
									<p class="text-body-small mt-0.5 line-clamp-1 text-on-surface-variant">
										{desc}
									</p>
								{/if}
							</div>
							<PluginInstallAction
								{manifest}
								installed={isInstalled(manifest.id)}
								{task}
								onInstall={() => handleInstall(manifest, task.manifestUrl)}
								onCancel={() => handleCancel(manifest.id)}
								onRetry={() => handleRetry(manifest.id)}
							/>
						</div>
					{/each}
				</div>
			</section>
		{/if}

		<section class="ui-section">
			<div class="flex items-center justify-between px-1">
				<h3 class="text-label-large font-medium text-on-surface">
					{hostT('plugins.installed.heading')}
				</h3>
				<span class="text-label-small text-on-surface-variant"
					>{hostT('plugins.builtin.count', {
						count: installedRecords.length
					})}</span
				>
			</div>

			{#if installedRecords.length === 0}
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
					{#each installedRecords as record (record.manifest.id)}
						{@const name = resolveManifestText(record.manifest.name)}
						{@const desc = resolveManifestText(record.manifest.description)}
						{@const meta = getPluginCategoryMeta(resolvePluginCatalogCategory(record.manifest))}
						{@const isBusy = operatingPluginId === record.manifest.id}
						{@const update = updateStatuses[record.manifest.id]}
						<div
							class={[
								'flex flex-col gap-2 p-3 transition-colors hover:bg-surface-variant/30',
								!record.enabled && 'opacity-60'
							]}
						>
							<div class="flex items-start justify-between gap-3">
								<div class="min-w-0 flex-1">
									<div class="flex flex-wrap items-center gap-1.5">
										<span class="text-body-medium line-clamp-1 font-medium text-on-surface">
											{name}
										</span>
										<span
											class="text-label-small py-0.2 text-caption rounded-full px-1.5 font-medium {meta.badgeClass}"
										>
											{meta.label}
										</span>
									</div>
									{#if desc}
										<p class="text-body-small mt-0.5 line-clamp-1 text-on-surface-variant">
											{desc}
										</p>
									{/if}
									{#if record.manifest.author}
										<p class="text-caption mt-1 text-on-surface-variant/70">
											by {record.manifest.author}
										</p>
									{/if}
								</div>
								{#if officialPlugins.isPreinstalledPlugin(record.manifest.id)}
									<span
										class="text-label-small shrink-0 rounded-full bg-surface-variant px-2 py-0.5 text-on-surface-variant"
										>{hostT('plugins.preinstall.label')}</span
									>
								{/if}
							</div>

							{#if update && update.status !== 'ready'}
								<p class="text-body-small text-on-surface-variant" title={update.error}>
									{hostT(`plugins.update.${update.status}`)}
								</p>
								{#if update.status === 'confirmation-required'}
									<Button
										variant="outlined"
										disabled={isBusy}
										onclick={() => handleToggleEnabled(record.manifest.id, true)}
										>{hostT('plugins.action.enable')}</Button
									>
								{:else if update.status !== 'downloading'}
									<Button variant="outlined" onclick={() => officialPlugins.retryPendingUpdates()}
										>{hostT('plugins.action.retry')}</Button
									>
								{/if}
							{/if}
							<div class="flex items-center justify-between gap-2">
								{#if !officialPlugins.isPreinstalledPlugin(record.manifest.id)}
									<Button
										variant="text"
										tone="danger"
										class="text-caption h-6 shrink-0 px-1.5"
										disabled={isBusy}
										onclick={() => promptUninstall(record.manifest.id, name)}
									>
										{hostT('common.uninstall')}
									</Button>
								{/if}

								<div class="flex shrink-0 items-center gap-1.5">
									{#if record.manifest.configSchema}
										<Button
											variant="outlined"
											class="text-label-small h-7 px-2.5 font-normal"
											disabled={isBusy || !record.enabled}
											onclick={() =>
												handleOpenConfig(record.manifest.id, name, record.manifest.configSchema)}
										>
											<TuneFill class="mr-0.5 size-3" />
											{hostT('plugins.action.settings')}
										</Button>
									{/if}
									{#if !officialPlugins.isPreinstalledPlugin(record.manifest.id)}
										<span class="text-label-small text-on-surface-variant">
											{hostT('plugins.action.enable')}
										</span>
										<Switch
											size="sm"
											checked={record.enabled && update?.status !== 'confirmation-required'}
											disabled={isBusy}
											onCheckedChange={(checked) =>
												handleToggleEnabled(record.manifest.id, checked === true)}
										/>
									{/if}
								</div>
							</div>
						</div>
					{/each}
				</div>
			{/if}
		</section>
	{:else}
		<section class="ui-section">
			{#if loadingCatalog}
				<div class="flex flex-col items-center justify-center py-12">
					<LoadingIndicator size="large" />
					<p class="text-body-small mt-2 text-on-surface-variant">
						{hostT('plugins.catalog.loading')}
					</p>
				</div>
			{:else if catalogError}
				<div
					class="flex flex-col items-center justify-center rounded-2xl border border-error/30 bg-error-container/20 p-6 text-center"
				>
					<p class="text-body-medium font-medium text-error">
						{hostT('plugins.catalog.error.title')}
					</p>
					<p class="text-body-small mt-1 text-on-surface-variant">{catalogError}</p>
					<Button variant="outlined" class="mt-3 h-8 px-4 text-xs" onclick={loadOfficialCatalog}>
						{hostT('plugins.catalog.retry')}
					</Button>
				</div>
			{:else if catalogManifests.length === 0}
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
							<div class="flex items-center justify-between px-1">
								<h3 class="text-label-large font-medium text-on-surface">
									{groupMeta.label}
								</h3>
								<span class="text-label-small text-on-surface-variant">
									{hostT('plugins.builtin.count', {
										count: group.entries.length
									})}
								</span>
							</div>
							<div class="ui-section-surface [&>*+*]:border-t [&>*+*]:border-border/40">
								{#each group.entries as entry (entry.manifest.id)}
									{@const manifest = entry.manifest}
									{@const name = resolveManifestText(manifest.name)}
									{@const desc = resolveManifestText(manifest.description)}
									{@const installed = isInstalled(manifest.id)}
									<div
										class="flex items-center justify-between gap-3 p-3 transition-colors hover:bg-surface-variant/30"
									>
										<div class="flex min-w-0 flex-1 flex-col justify-center">
											<div class="flex flex-wrap items-center gap-1.5">
												<span class="text-body-medium line-clamp-1 font-medium text-on-surface">
													{name}
												</span>
											</div>
											{#if desc}
												<p class="text-body-small mt-0.5 line-clamp-1 text-on-surface-variant">
													{desc}
												</p>
											{/if}
											{#if manifest.optionalServerCapabilities?.some((cap) => !getAppEngine().http.supportsPluginServer?.(cap.pluginId, cap.action))}
												<p class="text-body-small mt-1 text-on-surface-variant">
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
														<span class="text-caption text-on-surface-variant/70">
															{hostT('plugins.size', {
																size: formatBytes(manifest.downloadSizeBytes)
															})}
														</span>
													{/if}
												</div>
											{/if}
										</div>

										<div class="flex shrink-0 flex-col items-end gap-1">
											<PluginInstallAction
												{manifest}
												{installed}
												needsUpdate={installedRecords.some(
													(record) =>
														record.manifest.id === manifest.id &&
														record.manifest.version !== manifest.version
												)}
												task={taskMap.get(manifest.id)}
												onInstall={() => handleInstall(manifest, entry.url)}
												onCancel={() => handleCancel(manifest.id)}
												onRetry={() => handleRetry(manifest.id)}
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
				disabled={linkInstallInProgress}
			/>
		</div>
		{#if linkInstallSource}
			<p class="text-body-small text-on-surface-variant">
				{hostT('plugins.link.source', { origin: linkInstallSource })}
			</p>
		{/if}
		{#if linkInstallInProgress}
			<div class="flex items-center gap-2 text-on-surface-variant">
				<LoadingIndicator size="small" />
				<span class="text-body-small">{hostT('plugins.link.installing')}</span>
			</div>
		{/if}
	</div>
	{#snippet footer()}
		<Button
			variant="text"
			disabled={linkInstallInProgress}
			onclick={() => (linkInstallDialogOpen = false)}
		>
			{hostT('common.cancel')}
		</Button>
		<Button variant="filled" disabled={linkInstallInProgress} onclick={confirmLinkInstall}>
			{linkInstallInProgress ? hostT('plugins.action.installing') : hostT('plugins.link.confirm')}
		</Button>
	{/snippet}
</Dialog>
