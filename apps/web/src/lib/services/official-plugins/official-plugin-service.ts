import { planPreinstall } from './preinstall-policy';
import { ImageRepository } from '$lib/storage/image-repository';
import { resolveManifestForDownload } from './manifest-url';
import { hostT } from '$lib/i18n/host-i18n.svelte';
import type { ChronosEngine, ChronosProfile, Disposable, PluginManifest } from '@chronos/core';
import { PLUGIN_CONFIG_STORAGE_KEY, validateProfile } from '@chronos/core';
import { db, type ChronosDB } from '$lib/storage/db';
import { createPluginInstallationRepository } from '$lib/storage/plugin-installation-repository';
import type { HostBuildIdentity, WebHostUpdate } from '@chronos/core';
import { APP_VERSION, HOST_BUILD } from '$lib/config/app-meta';
import { isAbortError } from './abort-utils';
import { mergeAbortSignals } from '$lib/utils/abort-signal';
import { PluginOperationCoordinator } from './plugin-operation-coordinator';
import { OfficialPluginAssetPipeline } from './asset-pipeline';
import { OfficialPluginCatalogClient } from './catalog-client';
import { OfficialPluginInstalledStore } from './installed-store';
import type { InstalledOfficialPluginRecord } from './official-plugin-types';
import { replacePluginAssets } from './plugin-asset-replacer';
import { OfficialPluginRuntimeActivator } from './runtime-activator';
import { assertValidManifestInstallUrl } from './manifest-url';
import { validatePluginManifest } from './plugin-bundle';
import {
	OfficialPluginInstallQueue,
	type InstallQueueChangeKind,
	type PluginInstallStage,
	type PluginInstallTask,
	type PluginInstallProgress
} from './install-queue';
import { syncInstalledPluginsWithHost } from './sync-installed-plugins';
import {
	RESERVED_OFFICIAL_PLUGIN_IDS,
	BUNDLED_CATALOG_URL,
	officialCatalogUrl,
	isOfficialCatalogManifestUrl,
	assertOfficialManifestVersion
} from './market-config';

export type { InstalledOfficialPluginRecord } from './official-plugin-types';
export type {
	InstallQueueChangeKind,
	PluginInstallStage,
	PluginInstallTask,
	PluginInstallProgress
};
export { OfficialPluginInstallQueue };

export interface OfficialPluginServiceDeps {
	catalogClient: OfficialPluginCatalogClient;
	assetPipeline: OfficialPluginAssetPipeline;
	installedStore: OfficialPluginInstalledStore;
	runtimeActivator: OfficialPluginRuntimeActivator;
	installQueue?: OfficialPluginInstallQueue;
	hostVersion?: string;
	hostBuild?: HostBuildIdentity;
	images?: ImageRepository;
}

function createOfficialPluginServiceDeps(
	engine: ChronosEngine,
	database: ChronosDB = db
): OfficialPluginServiceDeps {
	const installedStore = new OfficialPluginInstalledStore(
		engine,
		createPluginInstallationRepository(database)
	);
	const runtimeActivator = new OfficialPluginRuntimeActivator(
		engine,
		(pluginId) => installedStore.has(pluginId),
		new ImageRepository(database)
	);
	return {
		hostBuild: HOST_BUILD,
		images: new ImageRepository(database),
		catalogClient: new OfficialPluginCatalogClient(engine),
		assetPipeline: new OfficialPluginAssetPipeline(engine),
		installedStore,
		runtimeActivator
	};
}

export function createOfficialPluginService(engine: ChronosEngine, database?: ChronosDB) {
	return new OfficialPluginService(engine, createOfficialPluginServiceDeps(engine, database));
}

export class OfficialPluginService implements Disposable {
	private readonly images: ImageRepository;
	private profile?: ChronosProfile;
	private loaded = false;
	private failures = new Map<string, string>();
	private initialized = false;
	private initPromise?: Promise<void>;
	private lifecycle = new AbortController();
	private readonly operations = new PluginOperationCoordinator();
	private syncPromise?: Promise<void>;
	private hostBuild?: HostBuildIdentity;
	private updateStatuses = new Map<
		string,
		{
			status: 'pending' | 'downloading' | 'failed' | 'ready' | 'confirmation-required';
			error?: string;
		}
	>();
	private storeSubscription?: Disposable;
	private reconciling?: Promise<void>;

	isPreinstalledPlugin(id: string): boolean {
		return this.profile?.preinstall.some((entry) => entry.id === id) ?? false;
	}
	listFailures(): ReadonlyMap<string, string> {
		return this.failures;
	}
	private assertUserRemoval(id: string): void {
		if (this.isPreinstalledPlugin(id)) throw new Error(`Preinstalled plugin ${id} is required`);
		this.engine.assertPluginRemovable(id);
	}

	async prepareProfile(profile: ChronosProfile): Promise<void> {
		validateProfile(profile);
		this.profile = profile;
		await this.loadInstalledStore();
		if (!this.installedStore.isSeeded) {
			if (profile.preferences) await this.engine.updatePreferences(profile.preferences);
			await this.installedStore.markSeeded();
		}
		const id = profile.defaultTheme.pluginId;
		const cached = this.installedStore.find(id);
		if (cached && this.isCompatible(cached)) {
			try {
				await this.runtimeActivator.activate({ ...cached, enabled: true });
				this.engine.validateDefaultTheme(profile.defaultTheme);
				if (!cached.enabled || this.installedStore.getRemoved().includes(id))
					await this.installedStore.setEnabled(id, true);
			} catch (error) {
				console.error('[preinstall] Default cache could not activate', error);
				await this.installPreinstall(id);
			}
		} else await this.installPreinstall(id);
		this.engine.configureDefaultTheme(profile.defaultTheme);
	}

	private async installPreinstall(id: string): Promise<void> {
		const entry = this.profile?.preinstall.find((p) => p.id === id);
		if (!entry || !this.profile) throw new Error(`Unknown preinstall: ${id}`);
		const catalog = await this.fetchCatalog(BUNDLED_CATALOG_URL);
		const url = catalog.manifests.find((url) => url.endsWith(`/${id}.manifest.json`));
		if (!url) throw new Error(`Preinstall missing from official catalog: ${id}`);
		const manifest = await this.fetchManifest(url);
		if (manifest.id !== id) throw new Error(`Preinstall manifest ID mismatch: ${id}`);
		await this.install(manifest, url, {
			silent: true,
			system: true,
			preinstall: {
				profileId: this.profile.profileId,
				enabled: entry.enabled !== false,
				config: entry.config
			}
		});
	}

	async retryPreinstall(): Promise<void> {
		if (!this.profile) return;
		const pending = planPreinstall(
			this.profile,
			this.listInstalled().filter(
				(record) => this.isCompatible(record) && !this.failures.has(record.manifest.id)
			)
		);
		for (const entry of pending) {
			try {
				const cached = this.installedStore.find(entry.id);
				if (cached && this.isCompatible(cached)) {
					try {
						await this.runtimeActivator.activate({ ...cached, enabled: true });
						await this.installedStore.setEnabled(entry.id, true);
					} catch {
						await this.installPreinstall(entry.id);
					}
				} else await this.installPreinstall(entry.id);
				this.failures.delete(entry.id);
			} catch (error) {
				this.failures.set(entry.id, String(error));
			}
		}
		for (const id of this.installedStore.getRemoved()) {
			const record = this.installedStore.find(id);
			if (record?.enabled && this.isPreinstalledPlugin(id))
				await this.installedStore.upsert(record);
		}
		this.installedStore.notify();
	}
	private disposed = false;
	private readonly catalogClient: OfficialPluginCatalogClient;
	private readonly assetPipeline: OfficialPluginAssetPipeline;
	private readonly installedStore: OfficialPluginInstalledStore;
	private readonly runtimeActivator: OfficialPluginRuntimeActivator;
	private readonly hostVersion: string;
	private hmrDisposable?: Disposable;
	readonly installQueue: OfficialPluginInstallQueue;

	constructor(
		private readonly engine: ChronosEngine,
		deps?: OfficialPluginServiceDeps
	) {
		const resolved = deps ?? createOfficialPluginServiceDeps(engine);
		this.images = resolved.images ?? new ImageRepository();
		this.catalogClient = resolved.catalogClient;
		this.assetPipeline = resolved.assetPipeline;
		this.installedStore = resolved.installedStore;
		this.runtimeActivator = resolved.runtimeActivator;
		this.hostVersion = resolved.hostVersion ?? APP_VERSION;
		this.hostBuild = resolved.hostBuild;
		this.installQueue =
			resolved.installQueue ??
			new OfficialPluginInstallQueue({
				runner: (manifest, manifestUrl, options) => this.install(manifest, manifestUrl, options),
				onTaskFailed: (task) => {
					this.engine.notify(
						hostT('snackbar.install.failed', { message: task.error ?? '' }),
						'error'
					);
				}
			});
	}

	async init(): Promise<void> {
		if (this.initPromise) return this.initPromise;
		this.initPromise = this.initialize().catch((error) => {
			this.initPromise = undefined;
			throw error;
		});
		return this.initPromise;
	}
	private async initialize(): Promise<void> {
		if (this.initialized || this.disposed) return;
		await this.loadInstalledStore();
		await this.retryPreinstall();
		await this.activateInstalledFromCache();
		this.initialized = true;
		this.installedStore.notify();
		void this.retryPendingUpdates();
		this.storeSubscription = this.installedStore.onChanged(() => {
			if (this.installedStore.hostChanged) {
				this.dispose();
				if (typeof window !== 'undefined') window.location.reload();
				return;
			}
			if (!this.reconciling)
				this.reconciling = this.reconcileRuntime()
					.catch((error) => console.error('[plugin-reconcile]', error))
					.finally(() => {
						this.reconciling = undefined;
					});
		});
		this.setupDevHmr();
	}

	private async loadInstalledStore(): Promise<void> {
		if (this.loaded) return;
		await this.installedStore.load();
		const generation = this.installedStore.hostGeneration;
		if (this.hostBuild) {
			if (
				this.hostBuild.target !== 'mobile' &&
				typeof navigator !== 'undefined' &&
				navigator.serviceWorker?.controller
			) {
				const { readWorkerIdentity } = await import('$lib/client/pwa-sw');
				const controlling = await readWorkerIdentity(navigator.serviceWorker.controller);
				if (controlling.buildId !== this.hostBuild.buildId) {
					window.location.reload();
					throw new Error('Host controller changed; reloading');
				}
			}
			const previous = this.installedStore
				.getCache()
				.flatMap((record) => (record.wallpaperAssetId ? [record.wallpaperAssetId] : []));
			this.lifecycle.signal.throwIfAborted();
			await this.installedStore.startHost(this.hostBuild, generation);
			const retained = new Set(
				this.installedStore.getCache().map((record) => record.wallpaperAssetId)
			);
			await Promise.all(
				previous.filter((id) => !retained.has(id)).map((id) => this.images.delete(id))
			);
		}
		this.loaded = true;
	}

	private async syncWithHostCatalog(): Promise<void> {
		const signal = this.lifecycle.signal;
		await syncInstalledPluginsWithHost({
			hostVersion: this.hostVersion,
			preinstallIds: this.profile?.preinstall.map((plugin) => plugin.id) ?? [],
			catalogClient: this.catalogClient,
			getInstalledRecords: () => this.installedStore.getCache(),
			retryIds: [...this.failures.keys()],
			onStatus: (id, status, error) => {
				if (signal.aborted) return;
				this.updateStatuses.set(id, { status, error });
				this.installedStore.notify();
			},
			install: (manifest, manifestUrl, options) => {
				signal.throwIfAborted();
				return this.install(manifest, manifestUrl, { ...options, system: true, signal });
			}
		});
	}

	private isCompatible(record: InstalledOfficialPluginRecord): boolean {
		return isOfficialCatalogManifestUrl(record.manifestUrl, record.manifest.id)
			? record.manifest.version === this.hostVersion
			: record.acceptedHostVersion === this.hostVersion;
	}
	getUpdateStatus(id: string) {
		return this.updateStatuses.get(id);
	}
	get installationStore() {
		return this.installedStore;
	}
	async retryPendingUpdates(): Promise<void> {
		if (this.disposed) return;
		if (this.syncPromise) return this.syncPromise;
		const signal = this.lifecycle.signal;
		const operation: Promise<void> = this.syncWithHostCatalog()
			.catch((error) => console.error('[plugin-update]', error))
			.then(() => {
				if (this.disposed || signal.aborted) return;
				const preferred = this.engine.state.userPreferences.visualThemeId;
				if (preferred && this.engine.themes.isSelectable(preferred))
					this.engine.setTheme(preferred);
				this.installedStore.notify();
			})
			.finally(() => {
				if (this.syncPromise === operation) this.syncPromise = undefined;
			});
		this.syncPromise = operation;
		return operation;
	}
	private async reconcileRuntime(): Promise<void> {
		for (const id of this.activeVersions.keys()) {
			if (this.operations.isBusy(id)) continue;
			const record = this.installedStore.find(id);
			if (
				!record?.enabled ||
				!this.isCompatible(record) ||
				this.activeVersions.get(id) !== record.revision
			) {
				await this.runtimeActivator.deactivate(id, { revertThemes: false });
				this.activeVersions.delete(id);
			}
		}
		if (!this.installedStore.isFrozen)
			await this.activateInstalledFromCache({
				skipIds: new Set(this.operations.getBusyIds())
			});
	}
	private activeVersions = new Map<string, number | undefined>();
	async prepareHostUpdate(
		update: WebHostUpdate,
		progress?: (percent: number) => void
	): Promise<string> {
		await this.loadInstalledStore();
		await this.operations.waitForAllSettled();
		if (this.syncPromise) await this.syncPromise.catch(() => {});
		await this.installedStore.load();
		const revision = this.installedStore.revision;
		const installed = this.listInstalled().filter(
			(record) =>
				isOfficialCatalogManifestUrl(record.manifestUrl, record.manifest.id) &&
				!update.requiredPluginIds.includes(record.manifest.id)
		);
		const prepared: InstalledOfficialPluginRecord[] = [];
		const wallpaperIds: string[] = [];
		try {
			const catalog = installed.length
				? await this.catalogClient.fetchCatalog(update.pluginCatalogUrl)
				: undefined;
			for (const [index, record] of installed.entries()) {
				const url = catalog?.manifests.find((url) =>
					url.endsWith(`/${record.manifest.id}.manifest.json`)
				);
				if (!url || !url.startsWith(new URL('./manifests/', update.pluginCatalogUrl).href))
					throw new Error(`Target plugin unavailable: ${record.manifest.id}`);
				const manifest = await this.catalogClient.fetchManifest(url);
				assertOfficialManifestVersion(manifest, url, update.host.version);
				if (manifest.id !== record.manifest.id || manifest.version !== update.host.version)
					throw new Error('Target plugin identity mismatch');
				const assets = await this.assetPipeline.download(manifest, url, {
					signal: this.lifecycle.signal
				});
				let wallpaperAssetId: string | undefined;
				if (assets.wallpaper) {
					wallpaperAssetId = `theme:${manifest.id}:${crypto.randomUUID()}`;
					await this.images.put(wallpaperAssetId, assets.wallpaper);
					wallpaperIds.push(wallpaperAssetId);
				}
				prepared.push({
					...record,
					code: assets.code ?? null,
					colorsJson: assets.colorsJson ?? null,
					iconThemeJson: assets.iconThemeJson ?? null,
					cssCode: assets.cssCode ?? null,
					manifest,
					manifestUrl: url,
					wallpaperAssetId,
					acceptedHostVersion: update.host.version
				});
				progress?.(Math.round(((index + 1) / installed.length) * 100));
			}
			const token = crypto.randomUUID();
			await this.installedStore.prepare({
				target: update.host,
				revision,
				records: prepared,
				token,
				until: Date.now() + 180_000
			});
			return token;
		} catch (error) {
			await Promise.all(wallpaperIds.map((id) => this.images.delete(id)));
			throw error;
		}
	}

	async cancelHostPreparation(token: string): Promise<void> {
		await this.installedStore.load();
		const prepared = this.installedStore.prepared;
		await this.installedStore.cancelPreparation(token);
		if (prepared?.token === token) {
			const retained = new Set(
				this.installedStore.getCache().map((record) => record.wallpaperAssetId)
			);
			await Promise.all(
				prepared.records.flatMap((record) =>
					record.wallpaperAssetId && !retained.has(record.wallpaperAssetId)
						? [this.images.delete(record.wallpaperAssetId)]
						: []
				)
			);
		}
	}

	private setupDevHmr(): void {
		if (!import.meta.env.DEV) return;
		void import('./official-plugin-hmr').then(({ setupPluginHmr }) => {
			if (this.disposed) return;
			this.hmrDisposable?.dispose();
			this.hmrDisposable = setupPluginHmr(this, this.engine);
		});
	}

	private async activateInstalledFromCache(options?: { skipIds?: Set<string> }): Promise<void> {
		for (const record of this.installedStore.getCache()) {
			if (options?.skipIds?.has(record.manifest.id)) continue;
			if (!this.isCompatible(record)) {
				this.updateStatuses.set(record.manifest.id, {
					status: isOfficialCatalogManifestUrl(record.manifestUrl, record.manifest.id)
						? 'pending'
						: 'confirmation-required'
				});
				continue;
			}
			if (record.enabled && !this.runtimeActivator.isActive(record.manifest.id)) {
				try {
					await this.runtimeActivator.activate(record);
					this.failures.delete(record.manifest.id);
					this.activeVersions.set(record.manifest.id, record.revision);
				} catch (err) {
					this.failures.set(record.manifest.id, String(err));
					this.updateStatuses.set(record.manifest.id, { status: 'failed', error: String(err) });
					console.error(
						`[OfficialPluginService] Failed to load plugin ${record.manifest.id}:`,
						err
					);
				}
			}
		}
	}

	onChanged(listener: () => void): Disposable {
		return this.installedStore.onChanged(listener);
	}

	async fetchCatalog(catalogUrl = officialCatalogUrl(this.hostVersion)) {
		const catalog = await this.catalogClient.fetchCatalog(catalogUrl);
		if (catalogUrl === officialCatalogUrl(this.hostVersion) || catalogUrl === BUNDLED_CATALOG_URL) {
			const remoteDirectory = catalogUrl.startsWith('https:')
				? new URL('./manifests/', catalogUrl).href
				: undefined;
			if (
				catalog.manifests.some(
					(url) =>
						!isOfficialCatalogManifestUrl(url) ||
						(remoteDirectory && !url.startsWith(remoteDirectory))
				)
			)
				throw new Error('Invalid official catalog manifest source');
		}
		return catalog;
	}

	async fetchManifest(manifestUrl: string) {
		const manifest = await this.catalogClient.fetchManifest(manifestUrl);
		assertOfficialManifestVersion(manifest, manifestUrl, this.hostVersion);
		return manifest;
	}

	async installFromManifestUrl(manifestUrl: string): Promise<void> {
		assertValidManifestInstallUrl(manifestUrl);
		const manifest = await this.fetchManifest(manifestUrl);
		await this.install(manifest, manifestUrl);
	}

	async applyHotUpdate(
		data: {
			id: string;
			type?: 'theme' | 'tool' | 'source' | 'codec';
			manifest?: Record<string, unknown>;
			code: string | null;
			cssCode: string | null;
			colorsJson: string | null;
			iconThemeJson: string | null;
		},
		options?: { signal?: AbortSignal }
	): Promise<InstalledOfficialPluginRecord> {
		if (this.disposed) throw new DOMException('Aborted', 'AbortError');
		return this.operations.run(
			data.id,
			async ({ signal }) => {
				const existing = this.installedStore.find(data.id);
				if (!existing) {
					throw new Error(`Plugin not installed: ${data.id}`);
				}

				const isTheme = data.type === 'theme' || existing.manifest.type === 'theme';
				const nextManifest = data.manifest
					? { ...existing.manifest, ...data.manifest, id: existing.manifest.id }
					: existing.manifest;

				const candidate: InstalledOfficialPluginRecord = {
					...existing,
					manifest: nextManifest as InstalledOfficialPluginRecord['manifest'],
					code: data.code,
					cssCode: data.cssCode,
					colorsJson: isTheme ? data.colorsJson : null,
					iconThemeJson: isTheme ? data.iconThemeJson : null
				};

				for (const [urlField, hashField, content] of [
					['bundleUrl', 'sha256', candidate.code],
					['colorsUrl', 'colorsSha256', candidate.colorsJson],
					['iconThemeUrl', 'iconThemeSha256', candidate.iconThemeJson],
					['cssUrl', 'cssSha256', candidate.cssCode]
				] as const) {
					signal.throwIfAborted();
					if (content)
						candidate.manifest = {
							...candidate.manifest,
							[hashField]: await this.engine.runtime.sha256(content)
						};
					else {
						candidate.manifest = { ...candidate.manifest };
						delete candidate.manifest[urlField];
						delete candidate.manifest[hashField];
					}
				}

				signal.throwIfAborted();
				assertOfficialManifestVersion(candidate.manifest, candidate.manifestUrl, this.hostVersion);
				const resolvedManifest = resolveManifestForDownload(
					candidate.manifest,
					candidate.manifestUrl
				);
				const wallpaper =
					candidate.colorsJson && JSON.parse(candidate.colorsJson).wallpaper
						? await this.assetPipeline.downloadThemeWallpaper(
								candidate.colorsJson,
								resolvedManifest.colorsUrl,
								signal
							)
						: undefined;
				signal.throwIfAborted();
				return this.replacePluginAssets(candidate, {
					wallpaper,
					preserveInstalledAt: true,
					signal,
					revertThemesOnDeactivate: false
				});
			},
			{ cancelExisting: true, signal: options?.signal }
		);
	}

	private async replacePluginAssets(
		candidate: InstalledOfficialPluginRecord,
		options?: {
			preserveInstalledAt?: boolean;
			revertThemesOnDeactivate?: boolean;
			signal?: AbortSignal;
			wallpaper?: Blob;
		}
	): Promise<InstalledOfficialPluginRecord> {
		const previous = this.installedStore.find(candidate.manifest.id);
		const id = options?.wallpaper
			? `theme:${candidate.manifest.id}:${crypto.randomUUID()}`
			: undefined;
		if (id && options?.wallpaper) await this.images.put(id, options.wallpaper);
		const next = { ...candidate, wallpaperAssetId: id };
		let result: InstalledOfficialPluginRecord;
		const required =
			this.profile?.defaultTheme.pluginId === candidate.manifest.id
				? this.profile.defaultTheme
				: undefined;
		try {
			const replace = () =>
				replacePluginAssets(
					{
						installedStore: this.installedStore,
						runtimeActivator: this.runtimeActivator,
						isDisposed: () => this.disposed,
						validate: required ? () => this.engine.validateDefaultTheme(required) : undefined
					},
					next,
					{ ...options, forceEnabled: this.isPreinstalledPlugin(candidate.manifest.id) }
				);
			result = required
				? await this.engine.withPluginReplacement(candidate.manifest.id, replace)
				: await replace();
		} catch (error) {
			if (id) await this.images.delete(id).catch(console.error);
			throw error;
		} finally {
			if (!this.disposed && required && this.engine.themes.isSelectable(required.themeId))
				this.engine.configureDefaultTheme(required);
		}
		if (previous?.wallpaperAssetId && previous.wallpaperAssetId !== id) {
			await this.images.delete(previous.wallpaperAssetId).catch(console.error);
		}
		if (result.enabled)
			this.activeVersions.set(
				result.manifest.id,
				this.installedStore.find(result.manifest.id)?.revision
			);
		this.updateStatuses.set(result.manifest.id, { status: 'ready' });
		this.failures.delete(result.manifest.id);
		return result;
	}

	async install(
		manifest: PluginManifest,
		manifestUrl?: string,
		options?: Parameters<OfficialPluginService['performInstall']>[2]
	): Promise<void> {
		if (this.disposed) throw new DOMException('Aborted', 'AbortError');
		return this.operations.run(
			manifest.id,
			async ({ signal }) => {
				await this.performInstall(manifest, manifestUrl, {
					...options,
					signal
				});
				if (!this.disposed) await this.installedStore.load();
				this.installedStore.notify();
			},
			{ signal: options?.signal }
		);
	}
	private async performInstall(
		manifest: PluginManifest,
		manifestUrl?: string,
		options?: {
			silent?: boolean;
			system?: boolean;
			preinstall?: { profileId: string; enabled: boolean; config?: Record<string, unknown> };
			signal?: AbortSignal;
			onProgress?: (progress: {
				stage: PluginInstallStage;
				percent: number;
				message?: string;
			}) => void;
		}
	): Promise<void> {
		const signal = options?.signal
			? mergeAbortSignals([options.signal, this.lifecycle.signal])
			: this.lifecycle.signal;
		signal?.throwIfAborted?.();
		validatePluginManifest(manifest);
		const sourceUrl =
			manifestUrl ??
			(options?.system ? this.installedStore.find(manifest.id)?.manifestUrl : undefined);
		if (
			(RESERVED_OFFICIAL_PLUGIN_IDS.includes(manifest.id) ||
				isOfficialCatalogManifestUrl(
					this.installedStore.find(manifest.id)?.manifestUrl,
					manifest.id
				)) &&
			!isOfficialCatalogManifestUrl(sourceUrl, manifest.id)
		)
			throw new Error('Official plugin IDs cannot be installed from external sources');
		assertOfficialManifestVersion(manifest, sourceUrl, this.hostVersion);
		if (!options?.system) this.assertUserRemoval(manifest.id);

		await this.installedStore.load();
		const existingSnapshot = this.installedStore.find(manifest.id);
		const expectedRevision = existingSnapshot?.revision ?? -1;

		try {
			const assets = await this.assetPipeline.download(manifest, manifestUrl, {
				signal,
				onProgress: options?.onProgress
			});

			signal?.throwIfAborted?.();
			await this.installedStore.load();
			if ((this.installedStore.find(manifest.id)?.revision ?? -1) !== expectedRevision)
				throw new Error('Plugin changed during download; retry');
			options?.onProgress?.({ stage: 'installing', percent: 88 });

			const record: InstalledOfficialPluginRecord = {
				manifest,
				acceptedHostVersion: this.hostVersion,
				origin:
					existingSnapshot?.origin ??
					(options?.preinstall
						? { kind: 'profile', profileId: options.preinstall.profileId }
						: { kind: 'user' }),
				initialConfig: existingSnapshot
					? existingSnapshot.initialConfig
					: options?.preinstall?.config,
				code: assets.code ?? null,
				colorsJson: assets.colorsJson ?? null,
				iconThemeJson: assets.iconThemeJson ?? null,
				cssCode: assets.cssCode ?? null,
				manifestUrl: manifestUrl ?? existingSnapshot?.manifestUrl,
				enabled: existingSnapshot?.enabled ?? options?.preinstall?.enabled ?? true,
				installedAt: existingSnapshot?.installedAt ?? Date.now()
			};

			signal?.throwIfAborted?.();
			options?.onProgress?.({ stage: 'installing', percent: 96 });

			await this.replacePluginAssets(record, {
				wallpaper: assets.wallpaper,
				preserveInstalledAt: Boolean(existingSnapshot),
				revertThemesOnDeactivate: false,
				signal
			});

			options?.onProgress?.({ stage: 'completed', percent: 100 });

			if (options?.silent) return;

			this.engine.notify(hostT('plugins.notify.installed', { pluginId: manifest.id }), 'info');
		} catch (err: unknown) {
			if (signal?.aborted || isAbortError(err)) {
				throw new DOMException('Aborted', 'AbortError');
			}
			throw err;
		}
	}

	async uninstall(pluginId: string): Promise<void> {
		this.assertUserRemoval(pluginId);
		return this.operations.run(
			pluginId,
			async ({ signal }) => {
				await this.installedStore.load();
				if (this.installedStore.isFrozen || this.installedStore.hostChanged)
					throw new Error('Application update in progress; reload before changing plugins');
				signal.throwIfAborted();
				await this.runtimeActivator.deactivate(pluginId, { revertThemes: true });
				const record = this.installedStore.find(pluginId);
				await this.installedStore.remove(pluginId);
				if (record?.wallpaperAssetId) await this.images.delete(record.wallpaperAssetId);
				await this.engine.storage.clearPluginData?.(pluginId);
				this.installQueue.clearFinished(pluginId);
				this.engine.notify(hostT('plugins.notify.uninstalled', { pluginId }), 'info');
			},
			{ cancelExisting: true }
		);
	}

	async enable(pluginId: string): Promise<void> {
		return this.operations.run(pluginId, async ({ signal }) => {
			await this.installedStore.load();
			this.lifecycle.signal.throwIfAborted();
			signal.throwIfAborted();
			if (this.installedStore.isFrozen || this.installedStore.hostChanged)
				throw new Error('Application update in progress; reload before changing plugins');
			const record = this.installedStore.find(pluginId);
			if (!record) {
				throw new Error(`Plugin not installed: ${pluginId}`);
			}
			if (record.enabled && this.runtimeActivator.isActive(pluginId)) return;

			if (
				isOfficialCatalogManifestUrl(record.manifestUrl, pluginId) &&
				record.manifest.version !== this.hostVersion
			) {
				await this.installedStore.setEnabled(pluginId, true, this.hostVersion);
				await this.retryPendingUpdates();
				return;
			}
			await this.runtimeActivator.activate({ ...record, enabled: true });
			try {
				this.lifecycle.signal.throwIfAborted();
				signal.throwIfAborted();
				await this.installedStore.upsert(
					{ ...record, enabled: true, acceptedHostVersion: this.hostVersion },
					record.revision ?? -1
				);
				this.activeVersions.set(pluginId, this.installedStore.find(pluginId)?.revision);
				this.updateStatuses.set(pluginId, { status: 'ready' });
				this.installedStore.notify();
			} catch (error) {
				await this.runtimeActivator.deactivate(pluginId, { revertThemes: true });
				throw error;
			}
			this.engine.notify(hostT('plugins.notify.enabled', { pluginId }), 'info');
		});
	}

	async disable(pluginId: string): Promise<void> {
		this.assertUserRemoval(pluginId);
		return this.operations.run(
			pluginId,
			async ({ signal }) => {
				const record = this.installedStore.find(pluginId);
				if (!record) {
					throw new Error(`Plugin not installed: ${pluginId}`);
				}
				signal.throwIfAborted();
				await this.installedStore.setEnabled(pluginId, false);
				await this.runtimeActivator.deactivate(pluginId, { revertThemes: true });
				this.engine.notify(hostT('plugins.notify.disabled', { pluginId }), 'info');
			},
			{ cancelExisting: true }
		);
	}

	async getPluginConfig<T extends Record<string, unknown>>(pluginId: string): Promise<T | null> {
		return this.engine.storage.getPluginData<T>(pluginId, PLUGIN_CONFIG_STORAGE_KEY);
	}

	listInstalled(): ReadonlyArray<InstalledOfficialPluginRecord> {
		return this.installedStore.getCache();
	}

	getInstalled(pluginId: string): InstalledOfficialPluginRecord | undefined {
		return this.installedStore.find(pluginId);
	}

	isPluginActive(pluginId: string): boolean {
		return this.runtimeActivator.isActive(pluginId);
	}

	async resetAfterFactoryClear(): Promise<void> {
		this.lifecycle.abort();
		this.storeSubscription?.dispose();
		this.storeSubscription = undefined;
		await this.operations.waitForAllSettled();
		this.operations.dispose();
		this.lifecycle = new AbortController();
		this.syncPromise = undefined;
		this.initPromise = undefined;
		this.installQueue.cancelAll();
		this.engine.clearDefaultTheme();
		this.runtimeActivator.disposeAll();
		this.installedStore.clear();
		this.failures.clear();
		this.activeVersions.clear();
		this.updateStatuses.clear();
		this.initialized = false;
		this.loaded = false;
	}

	dispose(): void {
		this.disposed = true;
		this.lifecycle.abort();
		this.engine.clearDefaultTheme();
		this.operations.dispose();
		this.storeSubscription?.dispose();
		this.installedStore.dispose();
		this.hmrDisposable?.dispose();
		this.installQueue.dispose();
		this.runtimeActivator.disposeAll();
	}
}
