import { getEventListeners } from 'node:events';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vite-plus/test';
import { WebHttpProxyProvider } from './web-http';

vi.mock('$app/paths', () => ({ resolve: () => '/Chronos/' }));
vi.mock('#lib/boot/plugin-proxy-meta.generated.ts', () => ({
	deploymentHasServerPlugins: () => true
}));

beforeEach(() => {
	vi.stubGlobal('window', { location: { origin: 'https://app.test' } });
	vi.stubGlobal(
		'fetch',
		vi.fn(async () => new Response('body'))
	);
});
afterEach(() => {
	vi.useRealTimers();
	vi.unstubAllGlobals();
});

describe('Web HTTP routing and proxy policy', () => {
	it.each([
		['/official-plugins/bundle.js?rev=1', '/Chronos/official-plugins/bundle.js?rev=1'],
		[
			'https://app.test/official-plugins/a.js?rev=1#v',
			'https://app.test/Chronos/official-plugins/a.js?rev=1#v'
		],
		['https://cdn.test/official-plugins/a.js', 'https://cdn.test/official-plugins/a.js'],
		['/Chronos/official-plugins/a.js', '/Chronos/official-plugins/a.js'],
		['/api/local', '/api/local']
	])('resolves asset URL %s to %s', async (url, expected) => {
		const response = await new WebHttpProxyProvider().request(url);
		expect(await response.text()).toBe('body');
		expect(fetch).toHaveBeenCalledWith(expected, expect.any(Object));
	});

	it.each(['https://cqut.edu.cn/api', 'https://api.cqut.edu.cn/api', '/api/local'])(
		'preserves allowed wildcard domains and relative requests: %s',
		async (url) => {
			const response = await new WebHttpProxyProvider(['*.cqut.edu.cn']).request(url, {
				bypassCors: true
			});
			expect(await response.text()).toBe('body');
			expect(fetch).toHaveBeenCalledWith(url, expect.any(Object));
		}
	);

	it.each([
		['http://127.0.0.1/admin', 'SSRF Protection'],
		['http://172.16.1.2/admin', 'SSRF Protection'],
		['http://intranet.local/admin', 'SSRF Protection'],
		['https://cqut.edu.cn.attacker.test/api', 'allowed proxy whitelist']
	])('rejects %s before fetch and releases request resources', async (url, message) => {
		vi.useFakeTimers();
		const controller = new AbortController();
		await expect(
			new WebHttpProxyProvider(['*.cqut.edu.cn']).request(url, {
				bypassCors: true,
				timeoutMs: 100,
				signal: controller.signal
			})
		).rejects.toThrow(message);
		expect(fetch).not.toHaveBeenCalled();
		expect(vi.getTimerCount()).toBe(0);
		expect(getEventListeners(controller.signal, 'abort')).toHaveLength(0);
	});
});
