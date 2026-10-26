import type { OfficialPluginCatalog, PluginManifest } from '@chronos/core';
import type { ChronosEngine } from '@chronos/core';
import { officialCatalogUrl } from './market-config';
import {
	appDocumentUrl,
	isAppRelativeUrl,
	isSameOrigin,
	resolveManifestAssetUrl
} from './manifest-url';
import { validatePluginManifest } from './plugin-bundle';

export class OfficialPluginCatalogClient {
	constructor(private readonly engine: ChronosEngine) {}

	async fetchCatalog(catalogUrl = officialCatalogUrl()): Promise<OfficialPluginCatalog> {
		const response = await this.engine.http.request(catalogUrl, {
			method: 'GET',
			timeoutMs: 20_000
		});

		if (!response.ok) {
			throw new Error(
				`Failed to fetch official plugin catalog from ${catalogUrl}: ${response.status}`
			);
		}

		const catalog = (await response.json()) as OfficialPluginCatalog;
		if (!catalog || catalog.version !== 1 || !Array.isArray(catalog.manifests)) {
			throw new Error('Invalid official plugin catalog schema format');
		}

		const localCatalog = isAppRelativeUrl(catalogUrl);
		const documentUrl = new URL(appDocumentUrl());
		return {
			...catalog,
			manifests: catalog.manifests.map((url) => {
				if (typeof url !== 'string' || !url)
					throw new Error('Invalid official plugin catalog manifest URL');
				const resolved = new URL(resolveManifestAssetUrl(catalogUrl, url), documentUrl);
				const appLocal = localCatalog && isSameOrigin(resolved, documentUrl);
				if (resolved.protocol !== 'https:' && resolved.protocol !== 'http:' && !appLocal)
					throw new Error('Invalid catalog manifest protocol');
				return appLocal ? resolved.pathname + resolved.search + resolved.hash : resolved.href;
			})
		};
	}

	async fetchManifest(manifestUrl: string): Promise<PluginManifest> {
		const response = await this.engine.http.request(manifestUrl, {
			method: 'GET',
			timeoutMs: 20_000
		});

		if (!response.ok) {
			throw new Error(`Failed to fetch plugin manifest from ${manifestUrl}: ${response.status}`);
		}

		const manifest = (await response.json()) as PluginManifest;
		validatePluginManifest(manifest);
		return manifest;
	}
}
