/**
 * Cache Storage helpers for app-owned offline caches.
 *
 * Kept separate from the Dexie provider so the cache inventory is a single
 * source shared by "clear all data" and the storage-usage estimate.
 */

/** App caches use an owned namespace; generic Workbox or other sites' caches are untouched. */
const APP_CACHE_PATTERNS: RegExp[] = [
	/^chronos-shell:/,
	/^chronos-.*-precache/,
	/^chronos-(?:legal|manifest):/
];

function isAppCache(cacheName: string): boolean {
	return APP_CACHE_PATTERNS.some((pattern) => pattern.test(cacheName));
}

/** Deletes app-owned caches, keeping third-party entries untouched. */
export async function clearAppCaches(
	cacheStorage: CacheStorage | null,
	options?: { keepHostAssets?: boolean }
): Promise<void> {
	if (!cacheStorage) return;
	try {
		const names = await cacheStorage.keys();
		await Promise.all(
			names
				.filter((name) => isAppCache(name))
				.filter(
					(name) => !options?.keepHostAssets || !/^chronos-shell:|^chronos-.*-precache/.test(name)
				)
				.map((name) => cacheStorage.delete(name).catch(() => false))
		);
	} catch (err) {
		console.warn('[cache-storage] Failed to clear app caches:', err);
	}
}

/** Sums cached response body sizes (settings page only; reads bodies into memory). */
export async function estimateCacheStorageBytes(
	cacheStorage: CacheStorage | null
): Promise<number> {
	if (!cacheStorage) return 0;
	try {
		let total = 0;
		for (const name of await cacheStorage.keys()) {
			if (!isAppCache(name)) continue;
			const cache = await cacheStorage.open(name);
			for (const request of await cache.keys()) {
				try {
					const response = await cache.match(request);
					const blob = await response?.blob();
					total += blob?.size ?? 0;
				} catch {
					// unreadable entry: skip it
				}
			}
		}
		return total;
	} catch {
		return 0;
	}
}
