import { APP_VERSION } from '$lib/config/app-meta';
import { staticPath } from '$lib/config/static-path';

declare const __CHRONOS_PLUGIN_MARKET_BASE_URL__: string;
export const DEFAULT_PLUGIN_MARKET_BASE_URL = 'https://ue-dnd.github.io/Chronos/plugins/releases/';

export function resolvePluginMarketBase(value = DEFAULT_PLUGIN_MARKET_BASE_URL): string {
	const url = new URL(value);
	if (url.protocol !== 'https:' || url.username || url.password || url.search || url.hash)
		throw new Error('Plugin market base must be an HTTPS directory URL');
	url.pathname = `${url.pathname.replace(/\/$/, '')}/`;
	return url.href;
}
const marketBase = resolvePluginMarketBase(
	typeof __CHRONOS_PLUGIN_MARKET_BASE_URL__ === 'string' && __CHRONOS_PLUGIN_MARKET_BASE_URL__
		? __CHRONOS_PLUGIN_MARKET_BASE_URL__
		: undefined
);
export const BUNDLED_CATALOG_URL = staticPath('/official-plugins/catalog.json');
export function officialCatalogUrl(
	version = APP_VERSION,
	development = import.meta.env.DEV
): string {
	return development ? BUNDLED_CATALOG_URL : new URL(`${version}/catalog.json`, marketBase).href;
}

/** Recognize only our local namespace or a version directory at the configured origin. */
export function isOfficialCatalogManifestUrl(value?: string, pluginId?: string): boolean {
	if (!value) return false;
	try {
		const origin = typeof window === 'undefined' ? 'http://localhost' : window.location.origin;
		const url = new URL(value, origin);
		const local = new URL(staticPath('/official-plugins/manifests/'), origin);
		const remote = new URL(marketBase);
		let path: string;
		if (url.origin === local.origin && url.pathname.startsWith(local.pathname)) {
			path = url.pathname.slice(local.pathname.length);
			if (!/^(?:[a-zA-Z0-9-]+\/)?[a-z0-9-]+\.manifest\.json$/.test(path)) return false;
		} else if (url.origin === remote.origin && url.pathname.startsWith(remote.pathname)) {
			path = url.pathname.slice(remote.pathname.length);
			if (!/^\d+\.\d+\.\d+\/manifests\/[a-zA-Z0-9-]+\/[a-z0-9-]+\.manifest\.json$/.test(path))
				return false;
		} else return false;
		return (
			!url.search &&
			!url.hash &&
			!url.username &&
			!url.password &&
			(!pluginId ||
				path.endsWith(`/${pluginId}.manifest.json`) ||
				path === `${pluginId}.manifest.json`)
		);
	} catch {
		return false;
	}
}
export function assertOfficialManifestVersion(
	manifest: { id: string; version: string },
	url: string | undefined,
	version: string
): void {
	if (!url || !isOfficialCatalogManifestUrl(url)) return;
	if (!isOfficialCatalogManifestUrl(url, manifest.id))
		throw new Error('Official manifest ID does not match its URL');

	const normalizedUrl = new URL(
		url,
		typeof window === 'undefined' ? 'http://localhost' : window.location.origin
	).href;
	if (
		normalizedUrl.startsWith(marketBase) &&
		(manifest.version !== version ||
			!normalizedUrl.startsWith(new URL(`${version}/`, marketBase).href))
	)
		throw new Error(`Official plugin version must match host ${version}`);
}
