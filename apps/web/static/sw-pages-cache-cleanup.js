// Keep cache name in sync with PAGES_CACHE_NAME in src/lib/storage/cache-storage.ts
self.addEventListener('activate', (event) => {
	event.waitUntil(caches.delete('pages-cache'));
});
