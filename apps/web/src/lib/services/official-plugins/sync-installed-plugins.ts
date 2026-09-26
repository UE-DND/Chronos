import type { OfficialPluginCatalog, PluginManifest } from '@chronos/core';
import type { InstalledOfficialPluginRecord } from './official-plugin-types';
import type { OfficialPluginCatalogClient } from './catalog-client';

import {
	BUNDLED_CATALOG_URL,
	officialCatalogUrl,
	isOfficialCatalogManifestUrl,
	assertOfficialManifestVersion
} from './market-config';
export { isOfficialCatalogManifestUrl } from './market-config';

export interface CatalogManifestEntry {
	manifest: PluginManifest;
	manifestUrl: string;
}

/** Returns true when a cached install should be refreshed from the official catalog. */
export function shouldSyncInstalledPlugin(
	record: InstalledOfficialPluginRecord,
	hostVersion: string
): boolean {
	return (
		isOfficialCatalogManifestUrl(record.manifestUrl, record.manifest.id) &&
		record.manifest.version !== hostVersion
	);
}

export async function buildCatalogManifestMap(
	catalog: OfficialPluginCatalog,
	fetchManifest: (manifestUrl: string) => Promise<PluginManifest>
): Promise<Map<string, CatalogManifestEntry>> {
	const entries = await Promise.all(
		catalog.manifests.map(async (manifestUrl) => {
			try {
				const manifest = await fetchManifest(manifestUrl);
				return { manifest, manifestUrl };
			} catch (err) {
				console.error(
					`[sync-installed-plugins] Failed to fetch catalog manifest ${manifestUrl}:`,
					err
				);
				return null;
			}
		})
	);

	const map = new Map<string, CatalogManifestEntry>();
	for (const entry of entries) {
		if (entry) map.set(entry.manifest.id, entry);
	}
	return map;
}

export interface SyncInstalledPluginsOptions {
	hostVersion: string;
	preinstallIds?: string[];
	catalogClient: OfficialPluginCatalogClient;
	getInstalledRecords: () => ReadonlyArray<InstalledOfficialPluginRecord>;
	install: (
		manifest: PluginManifest,
		manifestUrl: string,
		options?: { silent?: boolean }
	) => Promise<void>;
}

/**
 * Refreshes stale official installs from the catalog.
 * Catalog fetch failures and per-plugin sync errors are logged and skipped (non-fatal boot path).
 */
export async function syncInstalledPluginsWithHost(
	options: SyncInstalledPluginsOptions
): Promise<void> {
	const stale = options
		.getInstalledRecords()
		.filter((record) => shouldSyncInstalledPlugin(record, options.hostVersion));
	if (stale.length === 0) return;

	const groups = new Map<string, InstalledOfficialPluginRecord[]>();
	for (const record of stale) {
		const url = options.preinstallIds?.includes(record.manifest.id)
			? BUNDLED_CATALOG_URL
			: officialCatalogUrl(options.hostVersion);
		groups.set(url, [...(groups.get(url) ?? []), record]);
	}
	// Apply offline-required updates before attempting the remote catalog.
	const sources = [...groups].sort(
		([a], [b]) => Number(b === BUNDLED_CATALOG_URL) - Number(a === BUNDLED_CATALOG_URL)
	);
	for (const [catalogUrl, records] of sources) {
		try {
			const catalog = await options.catalogClient.fetchCatalog(catalogUrl);
			const ids = new Set(records.map((record) => record.manifest.id));
			const map = await buildCatalogManifestMap(
				{
					...catalog,
					manifests: catalog.manifests.filter((url) =>
						[...ids].some((id) => url.endsWith(`/${id}.manifest.json`))
					)
				},
				async (url) => {
					const manifest = await options.catalogClient.fetchManifest(url);
					assertOfficialManifestVersion(manifest, url, options.hostVersion);
					if (
						manifest.version !== options.hostVersion ||
						!isOfficialCatalogManifestUrl(url, manifest.id)
					)
						throw new Error('Invalid official catalog entry');
					return manifest;
				}
			);
			for (const record of records) {
				const entry = map.get(record.manifest.id);
				if (!entry) continue;
				try {
					await options.install(entry.manifest, entry.manifestUrl, { silent: true });
				} catch (error) {
					console.error('[sync-installed-plugins] Failed to sync plugin:', error);
				}
			}
		} catch (error) {
			console.error('[sync-installed-plugins] Failed to fetch catalog:', error);
		}
	}
}
