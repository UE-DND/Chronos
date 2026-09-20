import { planPreinstall } from './preinstall-policy';
import { ImageRepository } from '$lib/storage/image-repository';
import { resolveManifestForDownload } from './manifest-url';
import { hostT } from '$lib/i18n/host-i18n.svelte';
import type { ChronosEngine, ChronosProfile, Disposable, PluginManifest } from '@chronos/core';
import { PLUGIN_CONFIG_STORAGE_KEY, validateProfile } from '@chronos/core';
import { APP_VERSION } from '$lib/config/app-meta';
import { isAbortError, swallowAbortRejection } from './abort-utils';
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
	images?: ImageRepository;
}

function createOfficialPluginServiceDeps(engine: ChronosEngine): OfficialPluginServiceDeps {
	const installedStore = new OfficialPluginInstalledStore(engine);
	const runtimeActivator = new OfficialPluginRuntimeActivator(engine, (pluginId) =>
		installedStore.has(pluginId)
	);
	return {
		catalogClient: new OfficialPluginCatalogClient(engine),
		assetPipeline: new OfficialPluginAssetPipeline(engine),
		installedStore,
		runtimeActivator
	};
}

export class OfficialPluginService implements Disposable {
	private readonly images: ImageRepository;
	private profile?: ChronosProfile;
	private loaded = false;
	private failures = new Map<string, string>();
	private initialized = false;
	private initPromise?: Promise<void>;
	private lifecycle = new AbortController();
	private installs = new Map<string, Promise<void>>();

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
		if (cached) {
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
		const url = `/official-plugins/manifests/${id}.manifest.json`;
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
			this.listInstalled().filter((record) => !this.failures.has(record.manifest.id))
		);
		for (const entry of pending) {
			try {
				const cached = this.installedStore.find(entry.id);
				if (cached) {
					await this.runtimeActivator.activate({ ...cached, enabled: true });
					await this.installedStore.setEnabled(entry.id, true);
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
	private readonly hotUpdates = new Map<
		string,
		{ controller: AbortController; settled: Promise<InstalledOfficialPluginRecord> }
	>();
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
		await this.syncWithHostCatalog();
		this.installedStore.notify();
		this.setupDevHmr();
	}

	private async loadInstalledStore(): Promise<void> {
		if (this.loaded) return;
		await this.installedStore.load();
		this.loaded = true;
	}

	private async syncWithHostCatalog(): Promise<void> {
		await syncInstalledPluginsWithHost({
			hostVersion: this.hostVersion,
			catalogClient: this.catalogClient,
			getInstalledRecords: () => this.installedStore.getCache(),
			install: (manifest, manifestUrl, options) =>
				this.install(manifest, manifestUrl, { ...options, system: true })
		});
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
			if (record.enabled && !this.runtimeActivator.isActive(record.manifest.id)) {
				try {
					await this.runtimeActivator.activate(record);
					this.failures.delete(record.manifest.id);
				} catch (err) {
					if (this.isPreinstalledPlugin(record.manifest.id))
						this.failures.set(record.manifest.id, String(err));
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

	async fetchCatalog(catalogUrl?: string) {
		return this.catalogClient.fetchCatalog(catalogUrl);
	}

	async fetchManifest(manifestUrl: string) {
		return this.catalogClient.fetchManifest(manifestUrl);
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

		if (this.disposed) throw new DOMException('Aborted', 'AbortError');
		const controller = new AbortController();
		const signal = options?.signal
			? AbortSignal.any([options.signal, controller.signal])
			: controller.signal;
		const resolvedManifest = resolveManifestForDownload(candidate.manifest, candidate.manifestUrl);
		const settled = (async () => {
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
		})();
		const update = { controller, settled };
		this.hotUpdates.set(data.id, update);
		try {
			return await settled;
		} finally {
			if (this.hotUpdates.get(data.id) === update) this.hotUpdates.delete(data.id);
		}
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
		if (required) this.engine.clearDefaultTheme();
		try {
			result = await replacePluginAssets(
				{
					installedStore: this.installedStore,
					runtimeActivator: this.runtimeActivator,
					isDisposed: () => this.disposed,
					validate: required ? () => this.engine.validateDefaultTheme(required) : undefined
				},
				next,
				{ ...options, forceEnabled: this.isPreinstalledPlugin(candidate.manifest.id) }
			);
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
		return result;
	}

	async install(
		manifest: PluginManifest,
		manifestUrl?: string,
		options?: Parameters<OfficialPluginService['performInstall']>[2]
	): Promise<void> {
		if (this.disposed) throw new DOMException('Aborted', 'AbortError');
		const pending = this.installs.get(manifest.id);
		if (pending) return pending;
		const operation = this.performInstall(manifest, manifestUrl, options);
		this.installs.set(manifest.id, operation);
		try {
			await operation;
		} finally {
			if (this.installs.get(manifest.id) === operation) this.installs.delete(manifest.id);
		}
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
			? AbortSignal.any([options.signal, this.lifecycle.signal])
			: this.lifecycle.signal;
		signal?.throwIfAborted?.();
		validatePluginManifest(manifest);
		if (!options?.system) this.assertUserRemoval(manifest.id);

		const existingSnapshot = this.installedStore.find(manifest.id);

		try {
			const assets = await this.assetPipeline.download(manifest, manifestUrl, {
				signal,
				onProgress: options?.onProgress
			});

			signal?.throwIfAborted?.();
			options?.onProgress?.({ stage: 'installing', percent: 88 });

			const record: InstalledOfficialPluginRecord = {
				manifest,
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

	private async cancelHotUpdate(pluginId: string): Promise<void> {
		const update = this.hotUpdates.get(pluginId);
		if (!update) return;
		update.controller.abort();
		await swallowAbortRejection(update.settled);
	}

	async uninstall(pluginId: string): Promise<void> {
		this.assertUserRemoval(pluginId);
		await this.cancelHotUpdate(pluginId);
		await this.runtimeActivator.deactivate(pluginId, { revertThemes: true });
		const record = this.installedStore.find(pluginId);
		await this.installedStore.remove(pluginId);
		if (record?.wallpaperAssetId) await this.images.delete(record.wallpaperAssetId);
		await this.engine.storage.clearPluginData?.(pluginId);
		this.installQueue.clearFinished(pluginId);
		this.engine.notify(hostT('plugins.notify.uninstalled', { pluginId }), 'info');
	}

	async enable(pluginId: string): Promise<void> {
		await this.cancelHotUpdate(pluginId);
		const record = this.installedStore.find(pluginId);
		if (!record) {
			throw new Error(`Plugin not installed: ${pluginId}`);
		}
		if (record.enabled && this.runtimeActivator.isActive(pluginId)) return;

		await this.installedStore.setEnabled(pluginId, true);
		const updated = this.installedStore.find(pluginId);
		if (updated) {
			await this.runtimeActivator.activate(updated);
		}
		this.engine.notify(hostT('plugins.notify.enabled', { pluginId }), 'info');
	}

	async disable(pluginId: string): Promise<void> {
		this.assertUserRemoval(pluginId);
		await this.cancelHotUpdate(pluginId);
		const record = this.installedStore.find(pluginId);
		if (!record) {
			throw new Error(`Plugin not installed: ${pluginId}`);
		}
		await this.installedStore.setEnabled(pluginId, false);
		await this.runtimeActivator.deactivate(pluginId, { revertThemes: true });
		this.engine.notify(hostT('plugins.notify.disabled', { pluginId }), 'info');
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
		for (const update of this.hotUpdates.values()) update.controller.abort();
		await Promise.allSettled([
			...this.installs.values(),
			...[...this.hotUpdates.values()].map((update) => update.settled)
		]);
		this.lifecycle = new AbortController();
		this.initPromise = undefined;
		this.installQueue.cancelAll();
		this.engine.clearDefaultTheme();
		this.runtimeActivator.disposeAll();
		this.installedStore.clear();
		this.failures.clear();
		this.initialized = false;
		this.loaded = false;
	}

	dispose(): void {
		this.disposed = true;
		this.lifecycle.abort();
		this.engine.clearDefaultTheme();
		for (const update of this.hotUpdates.values()) update.controller.abort();
		this.hmrDisposable?.dispose();
		this.installQueue.dispose();
		this.runtimeActivator.disposeAll();
	}
}
