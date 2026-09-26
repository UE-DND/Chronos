import { describe, expect, it, vi } from 'vite-plus/test';
import { clearAppCaches, estimateCacheStorageBytes } from './cache-storage';

function createFakeCacheStorage(initial: Record<string, number[]> = {}) {
	const stores = new Map<string, Map<string, number>>();
	for (const [name, sizes] of Object.entries(initial)) {
		const entries = new Map<string, number>();
		sizes.forEach((size, index) => entries.set(`https://example.com/a${index}`, size));
		stores.set(name, entries);
	}
	const deleted: string[] = [];
	return {
		deleted,
		async keys() {
			return [...stores.keys()];
		},
		async open(name: string) {
			const entries = stores.get(name) ?? new Map<string, number>();
			stores.set(name, entries);
			return {
				async keys() {
					return [...entries.keys()].map((url) => ({ url }));
				},
				async match(request: { url: string }) {
					const size = entries.get(request.url);
					if (size === undefined) return undefined;
					return {
						async blob() {
							return { size };
						}
					};
				}
			};
		},
		async delete(name: string) {
			deleted.push(name);
			return stores.delete(name);
		}
	};
}

describe('clearAppCaches', () => {
	it('deletes only app-owned caches and tolerates missing storage', async () => {
		const caches = createFakeCacheStorage({
			'chronos-shell:example:build': [10],
			'chronos-legal:/Chronos': [20],
			'chronos-default-pages-precache-v2': [30],
			'third-party-cache': [40],
			'workbox-precache-v2': [50],
			'pages-cache': [60]
		});

		await clearAppCaches(caches as unknown as CacheStorage);

		expect(caches.deleted.sort()).toEqual(
			[
				'chronos-legal:/Chronos',
				'chronos-shell:example:build',
				'chronos-default-pages-precache-v2'
			].sort()
		);
		expect(await caches.keys()).toEqual([
			'third-party-cache',
			'workbox-precache-v2',
			'pages-cache'
		]);
		await expect(clearAppCaches(null)).resolves.toBeUndefined();
	});
});

describe('estimateCacheStorageBytes', () => {
	it('sums cached response sizes and returns 0 without storage', async () => {
		const caches = createFakeCacheStorage({
			'chronos-shell:example:build': [100, 200],
			'chronos-legal:/Chronos': [50]
		});

		await expect(estimateCacheStorageBytes(caches as unknown as CacheStorage)).resolves.toBe(350);
		await expect(estimateCacheStorageBytes(null)).resolves.toBe(0);
	});

	it('ignores unreadable entries', async () => {
		const caches = createFakeCacheStorage({ 'chronos-shell:example:build': [10] });
		vi.spyOn(caches, 'open').mockRejectedValueOnce(new Error('denied'));

		await expect(estimateCacheStorageBytes(caches as unknown as CacheStorage)).resolves.toBe(0);
	});
});
