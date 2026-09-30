import { afterEach, describe, expect, it, vi } from 'vite-plus/test';
import { WebHttpProxyProvider } from './web-http';
import { OfficialPluginInstallQueue } from '$lib/services/official-plugins/install-queue';

vi.mock('$app/paths', () => ({ base: '' }));
vi.mock('$lib/boot/plugin-proxy-meta.generated', () => ({
	deploymentHasServerPlugins: () => false
}));

afterEach(() => {
	vi.useRealTimers();
	vi.unstubAllGlobals();
});

function pendingBody() {
	let body!: ReadableStreamDefaultController<Uint8Array>;
	let signal!: AbortSignal;
	const cancel = vi.fn();
	vi.stubGlobal(
		'fetch',
		vi.fn(async (_url: string, init: RequestInit) => {
			signal = init.signal!;
			const stream = new ReadableStream<Uint8Array>({
				start(controller) {
					body = controller;
					signal.addEventListener(
						'abort',
						() => controller.error(new DOMException('Stream aborted', 'AbortError')),
						{ once: true }
					);
				},
				cancel
			});
			return new Response(stream, { headers: { 'Content-Length': '3' } });
		})
	);
	return {
		get body() {
			return body;
		},
		get signal() {
			return signal;
		},
		cancel
	};
}

describe('Web HTTP response bodies', () => {
	it('forwards an explicit cache reload to fetch', async () => {
		const fetchMock = vi.fn(async () => new Response('fresh'));
		vi.stubGlobal('fetch', fetchMock);
		const response = await new WebHttpProxyProvider().request('https://themes.test/bundle.js', {
			cache: 'reload'
		});
		expect(await response.text()).toBe('fresh');
		expect(fetchMock).toHaveBeenCalledWith(
			'https://themes.test/bundle.js',
			expect.objectContaining({ cache: 'reload' })
		);
	});

	it.each(['text', 'json', 'bytes', 'bytes-progress'] as const)(
		'keeps the request deadline while reading %s',
		async (method) => {
			vi.useFakeTimers();
			const pending = pendingBody();
			const response = await new WebHttpProxyProvider().request('https://themes.test/image', {
				timeoutMs: 100
			});
			await vi.advanceTimersByTimeAsync(60);
			const reading = method === 'bytes-progress' ? response.bytes(vi.fn()) : response[method]();
			const rejected = expect(reading).rejects.toMatchObject({ name: 'TimeoutError' });
			await vi.advanceTimersByTimeAsync(40);
			expect(pending.signal.aborted).toBe(true);
			await rejected;
			expect(vi.getTimerCount()).toBe(0);
		}
	);

	it('reports received bytes and releases the timeout after a complete body', async () => {
		vi.useFakeTimers();
		const pending = pendingBody();
		const response = await new WebHttpProxyProvider().request('https://themes.test/image', {
			timeoutMs: 100
		});
		const progress = vi.fn();
		const reading = response.bytes(progress);
		pending.body.enqueue(new Uint8Array([1]));
		await vi.advanceTimersByTimeAsync(10);
		expect(progress).toHaveBeenCalledWith({ receivedBytes: 1, totalBytes: 3 });
		pending.body.enqueue(new Uint8Array([2, 3]));
		pending.body.close();
		expect(await reading).toEqual(new Uint8Array([1, 2, 3]));
		expect(progress).toHaveBeenLastCalledWith({ receivedBytes: 3, totalBytes: 3 });
		expect(vi.getTimerCount()).toBe(0);
		await vi.advanceTimersByTimeAsync(100);
		expect(pending.signal.aborted).toBe(false);
	});

	it('cancels a body read through an external signal', async () => {
		vi.useFakeTimers();
		pendingBody();
		const controller = new AbortController();
		const response = await new WebHttpProxyProvider().request('https://themes.test/image', {
			timeoutMs: 100,
			signal: controller.signal
		});
		const reading = response.bytes(vi.fn());
		const rejected = expect(reading).rejects.toMatchObject({ name: 'AbortError' });
		controller.abort();
		await rejected;
		expect(vi.getTimerCount()).toBe(0);
	});

	it.each(['text', 'json', 'bytes'] as const)(
		'releases the deadline after a failed %s read',
		async (method) => {
			vi.useFakeTimers();
			const pending = pendingBody();
			const response = await new WebHttpProxyProvider().request('https://themes.test/image', {
				timeoutMs: 100
			});
			const reading = response[method]();
			const rejected = expect(reading).rejects.toThrow('Disconnected');
			pending.body.error(new Error('Disconnected'));
			await rejected;
			expect(vi.getTimerCount()).toBe(0);
		}
	);

	it('does not use a compressed content length as the decoded byte total', async () => {
		vi.stubGlobal(
			'fetch',
			vi.fn(
				async () =>
					new Response(new Uint8Array([1, 2, 3]), {
						headers: { 'Content-Length': '1', 'Content-Encoding': 'gzip' }
					})
			)
		);
		const response = await new WebHttpProxyProvider().request('https://themes.test/image');
		const progress = vi.fn();
		expect(await response.bytes(progress)).toEqual(new Uint8Array([1, 2, 3]));
		expect(progress).toHaveBeenLastCalledWith({ receivedBytes: 3 });
	});

	it('keeps a timeout as a retryable installation failure', async () => {
		vi.useFakeTimers();
		pendingBody();
		const http = new WebHttpProxyProvider();
		const queue = new OfficialPluginInstallQueue({
			runner: async (_manifest, _url, options) => {
				const response = await http.request('https://themes.test/image', {
					timeoutMs: 100,
					signal: options?.signal
				});
				await response.bytes(vi.fn());
			}
		});
		queue.enqueue({
			id: 'theme',
			name: { en: 'Theme' },
			description: { en: 'Theme' },
			version: '1.0.0',
			author: 'Test',
			type: 'theme',
			bundleFormat: 'esm'
		});
		await vi.advanceTimersByTimeAsync(100);
		expect(queue.getTask('theme')).toMatchObject({ status: 'failed', error: 'Request timed out' });
		vi.stubGlobal(
			'fetch',
			vi.fn(async () => new Response(new Uint8Array([1, 2, 3])))
		);
		queue.retry('theme');
		await vi.advanceTimersByTimeAsync(0);
		expect(queue.getTask('theme')).toBeUndefined();
		expect(vi.getTimerCount()).toBe(0);
		queue.dispose();
	});

	it('clears the deadline when a progress callback fails and cancels its reader', async () => {
		vi.useFakeTimers();
		const pending = pendingBody();
		const response = await new WebHttpProxyProvider().request('https://themes.test/image', {
			timeoutMs: 100
		});
		const reading = response.bytes(() => {
			throw new Error('Progress failed');
		});
		const rejected = expect(reading).rejects.toThrow('Progress failed');
		pending.body.enqueue(new Uint8Array([1]));
		await rejected;
		expect(pending.cancel).toHaveBeenCalledOnce();
		expect(vi.getTimerCount()).toBe(0);
	});

	it('clears the deadline for a response without a body', async () => {
		vi.useFakeTimers();
		vi.stubGlobal(
			'fetch',
			vi.fn(async () => new Response(null, { status: 204 }))
		);
		const response = await new WebHttpProxyProvider().request('https://themes.test/image', {
			timeoutMs: 100
		});
		expect(vi.getTimerCount()).toBe(0);
		expect(await response.bytes()).toEqual(new Uint8Array());
	});

	it('reports bytes when the response does not advertise a total', async () => {
		vi.stubGlobal(
			'fetch',
			vi.fn(async () => new Response(new Uint8Array([1, 2, 3])))
		);
		const response = await new WebHttpProxyProvider().request('https://themes.test/image');
		const progress = vi.fn();
		await response.bytes(progress);
		expect(progress).toHaveBeenLastCalledWith({ receivedBytes: 3 });
	});
});
