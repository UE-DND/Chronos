import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { resolve } from 'node:path';
import { createHash } from 'node:crypto';
import type { HostBuildIdentity } from '../../../../packages/core/src/types/host-update.ts';

/** Finalize after SvelteKit has emitted its fallback and environment module. */
export function finalizeWorkerArtifacts(
	output: string,
	host: HostBuildIdentity,
	base: string
): void {
	if (host.target === 'mobile') return;
	const directory = `_chronos/${host.buildId}`;
	const shellPath = `${directory}/shell.html`;
	const envPath = `${directory}/env.js`;
	mkdirSync(resolve(output, directory), { recursive: true });
	const environment = readFileSync(resolve(output, '_app/env.js'));
	writeFileSync(resolve(output, envPath), environment);
	const assets = [shellPath, envPath].map((path) => ({
		url: `${base}/${path}`,
		hash: createHash('sha256')
			.update(readFileSync(resolve(output, path)))
			.digest('hex')
	}));
	const source = `/* Generated per host build. No plugin code is evaluated in this worker. */
const HOST = ${JSON.stringify(host)};
const ASSETS = ${JSON.stringify(assets)};
const CACHE = 'chronos-shell:' + self.registration.scope + ':' + HOST.buildId;
function changeState(change) {
 return new Promise((resolve, reject) => {
  const open = indexedDB.open('chronos');
  open.onupgradeneeded = () => { open.transaction.abort(); reject(new Error('Installation state unavailable')); };
  open.onerror = () => reject(open.error);
  open.onsuccess = () => {
   const db = open.result;
   const tx = db.transaction('pluginData', 'readwrite');
   const store = tx.objectStore('pluginData');
   const request = store.get('core.official-plugins:installed_plugins');
   let value;
   request.onsuccess = () => {
    try { value = JSON.parse(request.result.valueJson); change(value); store.put({ ...request.result, valueJson: JSON.stringify(value), updatedAt: Date.now() }); }
    catch (error) { tx.abort(); reject(error); }
   };
   tx.oncomplete = () => { db.close(); resolve(value); };
   tx.onabort = () => { db.close(); reject(tx.error || new Error('Update gate rejected')); };
  };
 });
}
function assertPrepared(state) {
 const prepared = state.prepared;
 if (!prepared || prepared.target.buildId !== HOST.buildId || prepared.target.profileId !== HOST.profileId || prepared.target.target !== HOST.target || prepared.revision !== state.revision || prepared.until <= Date.now()) throw new Error('Prepare plugins before updating the application');
}
async function loadAsset(asset, fresh = false) {
 const cache = await caches.open(CACHE);
 if (!fresh) { const cached = await cache.match(asset.url); if (cached) return cached; }
 const controller = new AbortController();
 const timeout = setTimeout(() => controller.abort(), 30000);
 let response;
 try { response = await fetch(asset.url, { cache: 'no-store', signal: controller.signal }); }
 finally { clearTimeout(timeout); }
 if (!response.ok) throw new Error('Host shell download failed');
 const bytes = await response.clone().arrayBuffer();
 const hash = Array.from(new Uint8Array(await crypto.subtle.digest('SHA-256', bytes)), byte => byte.toString(16).padStart(2, '0')).join('');
 if (hash !== asset.hash) throw new Error('Host shell integrity mismatch');
 await cache.put(asset.url, response.clone());
 return response;
}
self.addEventListener('install', event => event.waitUntil((async () => {
 if (self.registration.active) await changeState(state => { assertPrepared(state); state.prepared.until = Number.MAX_SAFE_INTEGER; });
 for (const asset of ASSETS) await loadAsset(asset, true);
})()));
self.addEventListener('activate', event => event.waitUntil((async () => {
 await self.clients.claim();
 const clients = await self.clients.matchAll({ type: 'window', includeUncontrolled: true });
 for (const client of clients) client.postMessage({ type: 'CHRONOS_HOST_ACTIVE', host: HOST });
 const prefix = 'chronos-shell:' + self.registration.scope + ':';
 for (const name of await caches.keys()) if (name.startsWith(prefix) && name !== CACHE) await caches.delete(name);
})()));
self.addEventListener('message', event => {
 if (event.data?.type === 'CHRONOS_HOST_IDENTITY') event.ports[0]?.postMessage(HOST);
});
self.addEventListener('fetch', event => {
 const url = new URL(event.request.url);
 if (url.origin !== self.location.origin) return;
 if (event.request.mode === 'navigate' && !url.pathname.startsWith('${base}/api/') && !url.pathname.startsWith('${base}/plugins/') && !url.pathname.startsWith('${base}/official-plugins/') && !/\\.(?:json|js|css|png|svg|woff2?|md|apk)$/.test(url.pathname)) {
  event.respondWith(loadAsset(ASSETS[0]));
 } else if (url.pathname === '${base}/_app/env.js') {
  event.respondWith(loadAsset(ASSETS[1]));
 }
});
`;
	writeFileSync(resolve(output, `sw-host-gate-${host.buildId}.js`), source);
	// Force a distinct worker script for configuration-only releases as well.
	const workerPath = resolve(output, 'sw.js');
	writeFileSync(workerPath, readFileSync(workerPath, 'utf8') + `\n/* ${host.buildId} */\n`);
}
