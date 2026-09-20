import type { OfficialPluginCatalog, PluginManifest } from '@chronos/core';
import type { InstalledOfficialPluginRecord } from './official-plugin-types';
import type { OfficialPluginCatalogClient } from './catalog-client';

export const DEFAULT_OFFICIAL_CATALOG_URL = '/official-plugins/catalog.json';

export interface CatalogManifestEntry {
	manifest: PluginManifest;
	manifestUrl: string;
}

/** True when the manifest URL is served from the built-in official plugin catalog. */
export function isOfficialCatalogManifestUrl(url?: string): boolean {
	return typeof url === 'string' && url.startsWith('/official-plugins/manifests/');
}

/** Returns true when a cached install should be refreshed from the official catalog. */
export function shouldSyncInstalledPlugin(
	record: InstalledOfficialPluginRecord,
	hostVersion: string
): boolean {
	return (
		isOfficialCatalogManifestUrl(record.manifestUrl) && record.manifest.version !== hostVersion
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
	catalogUrl?: string;
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
	const catalogUrl = options.catalogUrl ?? DEFAULT_OFFICIAL_CATALOG_URL;
	const stale = options
		.getInstalledRecords()
		.filter((record) => shouldSyncInstalledPlugin(record, options.hostVersion));
	if (stale.length === 0) return;

	let catalogMap: Map<string, CatalogManifestEntry>;
	try {
		const catalog = await options.catalogClient.fetchCatalog(catalogUrl);
		catalogMap = await buildCatalogManifestMap(catalog, (url) =>
			options.catalogClient.fetchManifest(url)
		);
	} catch (err) {
		console.error('[sync-installed-plugins] Failed to sync installed plugins:', err);
		return;
	}

	for (const record of stale) {
		const entry = catalogMap.get(record.manifest.id);
		if (!entry) continue;

		try {
			await options.install(entry.manifest, entry.manifestUrl, { silent: true });
		} catch (err) {
			console.error(`[sync-installed-plugins] Failed to sync plugin ${record.manifest.id}:`, err);
		}
	}
}
