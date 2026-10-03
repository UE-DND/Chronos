import { describe, expect, it, vi } from 'vite-plus/test';
import { readFileSync } from 'node:fs';
import { runInNewContext } from 'node:vm';
const source = readFileSync(
	new URL('../../../static/sw-class-notifications.js', import.meta.url),
	'utf8'
);
function harness(windows: unknown[]) {
	let click!: (event: unknown) => void;
	const openWindow = vi.fn(async () => {});
	runInNewContext(source, {
		URL,
		self: {
			addEventListener: (_: string, listener: typeof click) => {
				click = listener;
			},
			registration: { scope: 'https://chronos.example/Chronos/' },
			clients: { matchAll: async () => windows, openWindow }
		}
	});
	return { click, openWindow };
}
describe('notification worker navigation', () => {
	it('focuses a window within the app scope and sends the open action', async () => {
		const focus = vi.fn(async () => {});
		const postMessage = vi.fn();
		const h = harness([{ url: 'https://chronos.example/Chronos/', focus, postMessage }]);
		let pending!: Promise<void>;
		h.click({
			notification: { data: { kind: 'class-reminder' }, close: vi.fn() },
			waitUntil: (promise: Promise<void>) => {
				pending = promise;
			}
		});
		await pending;
		expect(focus).toHaveBeenCalledOnce();
		expect(postMessage).toHaveBeenCalledWith({ type: 'chronos:class-notification-open' });
		expect(h.openWindow).not.toHaveBeenCalled();
	});
	it('opens the correct deployment path when the app is closed', async () => {
		const h = harness([{ url: 'https://other.example/', focus: vi.fn() }]);
		let pending!: Promise<void>;
		h.click({
			notification: { data: { kind: 'class-reminder' }, close: vi.fn() },
			waitUntil: (promise: Promise<void>) => {
				pending = promise;
			}
		});
		await pending;
		expect(h.openWindow).toHaveBeenCalledWith('https://chronos.example/Chronos/?class-reminder=1');
	});
});
