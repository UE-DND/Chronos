import { storageNamespace } from './storage-namespace';
/**
 * Cache Storage helpers for app-owned offline caches.
 *
 * Kept separate from the Dexie provider so the cache inventory is a single
 * source shared by "clear all data" and the storage-usage estimate.
 */

function isAppCache(cacheName: string): boolean {
	return ['shell:', 'precache-', 'legal', 'manifest'].some((kind) =>
		cacheName.startsWith(storageNamespace.key(kind))
	);
}
function isHostCache(cacheName: string): boolean {
	return (
		cacheName.startsWith(storageNamespace.key('shell:')) ||
		cacheName.startsWith(storageNamespace.key('precache-'))
	);
}

/** Deletes app-owned caches, keeping third-party entries untouched. */
export async function clearAppCaches(
	cacheStorage: CacheStorage | null,
	options?: { keepHostAssets?: boolean }
): Promise<void> {
	if (!cacheStorage) return;
	const names = await cacheStorage.keys();
	await Promise.all(
		names
			.filter((name) => isAppCache(name))
			.filter((name) => !options?.keepHostAssets || !isHostCache(name))
			.map((name) => cacheStorage.delete(name))
	);
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
