import { dev } from '$app/env';
import type { HostBuildIdentity } from '@chronos/core';
import type { ImageRepository } from '#lib/storage/image-repository.ts';
import { hostT } from '#lib/i18n/host-i18n.svelte.ts';
import { mergeAbortSignals } from '#lib/utils/abort-signal.ts';
import type { OfficialPluginAssetPipeline } from './asset-pipeline';
import type { OfficialPluginCatalogClient } from './catalog-client';
import type { OfficialPluginInstalledStore } from './installed-store';
import type { InstalledOfficialPluginRecord } from './official-plugin-types';
import { assertOfficialManifestVersion, isOfficialCatalogManifestUrl } from './market-config';

export interface HostPluginPreparation {
	host: HostBuildIdentity;
	pluginCatalogUrl: string;
	requiredPluginIds: string[];
}

interface HostPreparationOptions {
	lifecycleSignal: AbortSignal;
	signal?: AbortSignal;
	onProgress?: (percent: number) => void;
}

interface HostUpdateTransactionDeps {
	installedStore: OfficialPluginInstalledStore;
	catalogClient: OfficialPluginCatalogClient;
	assetPipeline: OfficialPluginAssetPipeline;
	images: ImageRepository;
	waitForPluginChanges(): Promise<void>;
}

export class HostUpdateTransactionService {
	private loaded = false;
	private preparations = 0;

	constructor(
		readonly hostBuild: HostBuildIdentity | undefined,
		private readonly deps: HostUpdateTransactionDeps
	) {}

	async start(signal: AbortSignal): Promise<void> {
		if (this.loaded) return;
		await this.deps.installedStore.load();
		if (this.hostBuild?.target === 'mobile') {
			const { getHostPlatform } = await import('#lib/platform/host-platform.ts');
			// Recover an orphaned native lock before profile installation can write the store.
			const { withStartupDeadline } = await import('#lib/boot/startup-deadline.ts');
			await withStartupDeadline(
				'native-recovery',
				3000,
				async () => {
					await getHostPlatform().getUpdateAction?.()?.native?.getState();
				},
				signal
			);
			signal.throwIfAborted();
			performance.mark?.('chronos-native-recovery-ready');
			await this.deps.installedStore.load();
		}
		const generation = this.deps.installedStore.hostGeneration;
		if (this.hostBuild) {
			if (
				!dev &&
				this.hostBuild.target !== 'mobile' &&
				typeof navigator !== 'undefined' &&
				navigator.serviceWorker?.controller
			) {
				const { readWorkerIdentity } = await import('#lib/client/pwa-sw.ts');
				const controlling = await readWorkerIdentity(navigator.serviceWorker.controller);
				if (controlling.buildId !== this.hostBuild.buildId) {
					window.location.reload();
					throw new Error('Host controller changed; reloading');
				}
			}

			const previous = this.deps.installedStore
				.getCache()
				.flatMap((record) => (record.wallpaperAssetId ? [record.wallpaperAssetId] : []));

			signal.throwIfAborted();
			await this.deps.installedStore.startHost(this.hostBuild, generation);
			const retained = new Set(
				this.deps.installedStore.getCache().map((record) => record.wallpaperAssetId)
			);
			await Promise.all(
				previous.filter((id) => !retained.has(id)).map((id) => this.deps.images.delete(id))
			);
		}
		this.loaded = true;
	}

	async prepare(update: HostPluginPreparation, options: HostPreparationOptions): Promise<string> {
		options.lifecycleSignal.throwIfAborted();
		this.preparations++;
		try {
			return await this.prepareSnapshot(update, options);
		} finally {
			this.preparations--;
		}
	}
	private async prepareSnapshot(
		update: HostPluginPreparation,
		options: HostPreparationOptions
	): Promise<string> {
		const lifecycleSignal = options.lifecycleSignal;
		const progress = options.onProgress;
		lifecycleSignal.throwIfAborted();
		await this.start(lifecycleSignal);
		await this.deps.waitForPluginChanges();
		await this.deps.installedStore.load();
		const revision = this.deps.installedStore.revision;
		const merged = mergeAbortSignals([
			lifecycleSignal,
			...(options.signal ? [options.signal] : [])
		]);
		const signal = merged.signal;
		const installed = this.deps.installedStore
			.getCache()
			.filter(
				(record) =>
					isOfficialCatalogManifestUrl(record.manifestUrl, record.manifest.id) &&
					!update.requiredPluginIds.includes(record.manifest.id)
			);
		const prepared: InstalledOfficialPluginRecord[] = [];
		const wallpaperIds: string[] = [];
		try {
			signal.throwIfAborted();
			const catalog = installed.length
				? await this.deps.catalogClient.fetchCatalog(update.pluginCatalogUrl)
				: undefined;
			for (const [index, record] of installed.entries()) {
				signal.throwIfAborted();
				const url = catalog?.manifests.find((url) =>
					url.endsWith(`/${record.manifest.id}.manifest.json`)
				);
				if (!url || !url.startsWith(new URL('./manifests/', update.pluginCatalogUrl).href))
					throw new Error(`Target plugin unavailable: ${record.manifest.id}`);
				const manifest = await this.deps.catalogClient.fetchManifest(url);
				assertOfficialManifestVersion(manifest, url, update.host.version);
				if (manifest.id !== record.manifest.id || manifest.version !== update.host.version)
					throw new Error('Target plugin identity mismatch');
				const assets = await this.deps.assetPipeline.download(manifest, url, {
					signal,
					onProgress: ({ percent }) =>
						progress?.(Math.round(((index + percent / 100) / installed.length) * 100))
				});
				let wallpaperAssetId: string | undefined;
				if (assets.wallpaper) {
					wallpaperAssetId = `theme:${manifest.id}:${crypto.randomUUID()}`;
					await this.deps.images.put(wallpaperAssetId, assets.wallpaper);
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
			signal.throwIfAborted();
			const token = crypto.randomUUID();
			await this.deps.installedStore.prepare({
				target: update.host,
				revision,
				records: prepared,
				token,
				until: update.host.target === 'mobile' ? null : Date.now() + 180_000
			});
			return token;
		} catch (error) {
			await Promise.all(wallpaperIds.map((id) => this.deps.images.delete(id)));
			throw error;
		} finally {
			merged.dispose();
		}
	}

	async cancel(token: string): Promise<void> {
		await this.deps.installedStore.load();
		const prepared = await this.deps.installedStore.cancelPreparation(token);
		if (prepared) {
			const retained = new Set(
				this.deps.installedStore.getCache().map((record) => record.wallpaperAssetId)
			);
			await Promise.all(
				prepared.records.flatMap((record) =>
					record.wallpaperAssetId && !retained.has(record.wallpaperAssetId)
						? [this.deps.images.delete(record.wallpaperAssetId)]
						: []
				)
			);
		}
	}

	async assertResetAllowed(): Promise<void> {
		await this.deps.installedStore.load();
		if (
			this.preparations > 0 ||
			this.deps.installedStore.isFrozen ||
			this.deps.installedStore.hostChanged ||
			(this.hostBuild && this.deps.installedStore.hostGeneration !== this.hostBuild.buildId)
		) {
			throw new Error(hostT('plugins.update.locked'));
		}
	}

	reset(): void {
		this.loaded = false;
	}
}
