/* Local notifications only: this worker does not subscribe to Web Push. */
self.addEventListener('notificationclick', (event) => {
 if (event.notification.data?.kind !== 'class-reminder') return;
 event.notification.close();
 event.waitUntil((async () => {
 const windows = await self.clients.matchAll({ type: 'window', includeUncontrolled: true });
 const client = windows.find((window) => window.url.startsWith(self.registration.scope));
 if (client) {
 await client.focus();
 client.postMessage({ type: 'chronos:class-notification-open' });
 } else {
 await self.clients.openWindow(new URL('?class-reminder=1', self.registration.scope).href);
 }
 })());
});
