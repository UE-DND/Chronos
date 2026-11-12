import { afterEach, describe, expect, it, vi } from 'vite-plus/test';
import { CookieJar } from './cookie-jar';
import { FetchCqutSession } from './fetch-cqut-session';

vi.mock('../src/online/config', async (importOriginal) => ({
	...(await importOriginal<typeof import('../src/online/config')>()),
	HTTP_RETRY_DELAY_MS: 0,
	NETWORK_RETRY_COUNT: 2
}));

const { requestStep } = await import('../src/online/http-client');

afterEach(() => vi.unstubAllGlobals());

function stubFetch() {
	const fetcher = vi.fn<typeof fetch>();
	vi.stubGlobal('fetch', fetcher);
	return fetcher;
}

function redirect(location: string, status = 302, cookies: string[] = []) {
	const headers = new Headers({ location });
	for (const cookie of cookies) headers.append('set-cookie', cookie);
	return new Response('redirect body', { status, headers });
}

describe('FetchCqutSession', () => {
	it('stores every cookie from each hop and sends cookies for the next URL', async () => {
		const fetcher = stubFetch();
		fetcher.mockResolvedValueOnce(
			redirect('/account/next', 302, [
				'auth=token; Path=/; HttpOnly',
				'local=account; Path=/account',
				'expiring=value; Expires=Wed, 21 Oct 2037 07:28:00 GMT; Path=/'
			])
		);
		fetcher.mockResolvedValueOnce(new Response('{"ok":true}'));
		const session = new FetchCqutSession();
		const response = await session.request({ url: 'https://uis.example.test/start' });

		expect(fetcher.mock.calls[1]?.[0]).toBe('https://uis.example.test/account/next');
		const headers = new Headers(fetcher.mock.calls[1]?.[1]?.headers);
		expect(headers.get('cookie')).toContain('auth=token');
		expect(headers.get('cookie')).toContain('local=account');
		expect(headers.get('cookie')).toContain('expiring=value');
		expect(response.url).toBe('https://uis.example.test/account/next');
		expect(await response.json()).toEqual({ ok: true });
		expect(await response.text()).toBe('{"ok":true}');
	});

	it('preserves manual redirect status, location and multiple Set-Cookie values', async () => {
		const fetcher = stubFetch();
		const cookies = ['one=1; Path=/', 'two=2; Path=/'];
		fetcher.mockResolvedValueOnce(redirect('/next', 302, cookies));
		const session = new FetchCqutSession();
		const response = await session.request({
			url: 'https://uis.example.test/start',
			disableRedirects: true
		});

		expect(fetcher).toHaveBeenCalledOnce();
		expect(response.status).toBe(302);
		expect(response.headers.location).toBe('/next');
		expect(response.headers['set-cookie']).toEqual(cookies);
		expect(response.getSetCookie?.()).toEqual(cookies);
		expect(await response.text()).toBe('redirect body');
		expect(await session.hasCookie('https://uis.example.test/', 'two')).toBe(true);
	});

	it('removes origin credentials and rebuilds cookies across origins', async () => {
		const fetcher = stubFetch();
		fetcher.mockResolvedValueOnce(redirect('https://timetable.example.test/next'));
		fetcher.mockResolvedValueOnce(new Response('ok'));
		const jar = new CookieJar();
		jar.setCookie('uis=secret; Path=/', 'https://uis.example.test/');
		jar.setCookie('timetable=own; Path=/', 'https://timetable.example.test/');
		await new FetchCqutSession(jar).request({
			url: 'https://uis.example.test/start',
			headers: {
				authorization: 'Bearer secret',
				'proxy-authorization': 'Basic secret',
				cookie: 'explicit=secret',
				cookie2: 'legacy=secret',
				accept: 'text/html'
			}
		});

		const first = new Headers(fetcher.mock.calls[0]?.[1]?.headers);
		const second = new Headers(fetcher.mock.calls[1]?.[1]?.headers);
		expect(first.get('authorization')).toBe('Bearer secret');
		expect(second.get('authorization')).toBeNull();
		expect(second.get('proxy-authorization')).toBeNull();
		expect(second.get('cookie2')).toBeNull();
		expect(second.get('cookie')).toBe('timetable=own');
		expect(second.get('accept')).toBe('text/html');
	});

	it('retains authorization across same-origin redirects', async () => {
		const fetcher = stubFetch();
		fetcher.mockResolvedValueOnce(redirect('/next'));
		fetcher.mockResolvedValueOnce(new Response('ok'));
		await new FetchCqutSession().request({
			url: 'https://uis.example.test/start',
			headers: { authorization: 'Bearer secret' }
		});
		expect(new Headers(fetcher.mock.calls[1]?.[1]?.headers).get('authorization')).toBe(
			'Bearer secret'
		);
	});

	it.each([
		[301, 'POST', 'GET', undefined],
		[302, 'POST', 'GET', undefined],
		[303, 'PUT', 'GET', undefined],
		[303, 'HEAD', 'HEAD', undefined],
		[301, 'PUT', 'PUT', 'payload'],
		[307, 'POST', 'POST', 'payload'],
		[308, 'POST', 'POST', 'payload']
	])('applies HTTP redirect semantics for %s %s', async (status, method, nextMethod, nextBody) => {
		const fetcher = stubFetch();
		fetcher.mockResolvedValueOnce(redirect('/next', status as number));
		fetcher.mockResolvedValueOnce(new Response('ok'));
		await new FetchCqutSession().request({
			url: 'https://uis.example.test/start',
			method: method as string,
			body: method === 'HEAD' ? undefined : 'payload',
			headers: { 'content-type': 'text/plain', 'content-length': '7' }
		});
		expect(fetcher.mock.calls[1]?.[1]?.method).toBe(nextMethod);
		expect(fetcher.mock.calls[1]?.[1]?.body).toBe(nextBody);
		if (method !== nextMethod) {
			const headers = new Headers(fetcher.mock.calls[1]?.[1]?.headers);
			expect(headers.get('content-type')).toBeNull();
			expect(headers.get('content-length')).toBeNull();
		}
	});

	it('permits a POST redirect to GET at the same URL', async () => {
		const fetcher = stubFetch();
		fetcher.mockResolvedValueOnce(redirect('/login', 303));
		fetcher.mockResolvedValueOnce(new Response('ok'));
		expect(
			await (
				await new FetchCqutSession().request({
					url: 'https://uis.example.test/login',
					method: 'POST',
					body: 'credentials'
				})
			).text()
		).toBe('ok');
	});

	it('rejects redirect loops including fragment-only redirects', async () => {
		const fetcher = stubFetch();
		fetcher.mockResolvedValueOnce(redirect('/start#different'));
		await expect(
			new FetchCqutSession().request({ url: 'https://uis.example.test/start' })
		).rejects.toThrow('redirect loop');
		expect(fetcher).toHaveBeenCalledOnce();
	});

	it.each(['file:///private/file', 'https://username:password@uis.example.test/next'])(
		'releases redirects before rejecting an invalid HTTP destination (%s)',
		async (location) => {
			const fetcher = stubFetch();
			const response = redirect(location);
			fetcher.mockResolvedValueOnce(response);
			await expect(
				new FetchCqutSession().request({ url: 'https://uis.example.test/' })
			).rejects.toThrow('Invalid CQUT HTTP URL');
			expect(response.bodyUsed).toBe(true);
			expect(fetcher).toHaveBeenCalledOnce();
		}
	);

	it('returns a redirect without Location and a non-redirect with Location as terminal responses', async () => {
		const fetcher = stubFetch();
		fetcher.mockResolvedValueOnce(new Response('no location', { status: 302 }));
		fetcher.mockResolvedValueOnce(
			new Response('not a redirect', { headers: { location: '/next' } })
		);
		const session = new FetchCqutSession();
		expect(await (await session.request({ url: 'https://uis.example.test/' })).text()).toBe(
			'no location'
		);
		expect(await (await session.request({ url: 'https://uis.example.test/' })).text()).toBe(
			'not a redirect'
		);
		expect(fetcher).toHaveBeenCalledTimes(2);
	});

	it.each([20, 21])('limits redirect chains to 20 hops (chain: %s)', async (hops) => {
		const fetcher = stubFetch();
		for (let index = 1; index <= hops; index++) {
			fetcher.mockResolvedValueOnce(redirect(`/hop-${index}`));
		}
		fetcher.mockResolvedValueOnce(new Response('complete'));
		const request = new FetchCqutSession().request({ url: 'https://uis.example.test/start' });
		if (hops === 20) {
			expect(await (await request).text()).toBe('complete');
		} else {
			await expect(request).rejects.toThrow('redirect limit');
		}
		expect(fetcher).toHaveBeenCalledTimes(21);
	});

	it('cancels redirect bodies before issuing the next request and consumes final bodies', async () => {
		const fetcher = stubFetch();
		const cancel = vi.fn();
		const first = new Response(new ReadableStream({ cancel }), {
			status: 302,
			headers: { location: '/next' }
		});
		fetcher.mockResolvedValueOnce(first);
		const final = new Response('final body');
		fetcher.mockImplementationOnce(async () => {
			expect(cancel).toHaveBeenCalledOnce();
			return final;
		});
		const response = await new FetchCqutSession().request({ url: 'https://uis.example.test/' });
		expect(final.bodyUsed).toBe(true);
		expect(await response.text()).toBe('final body');
	});

	it('consumes failed HTTP bodies before the shared retry issues another request', async () => {
		const fetcher = stubFetch();
		const failed = new Response('temporary failure', { status: 500 });
		fetcher.mockResolvedValueOnce(failed);
		fetcher.mockImplementationOnce(async () => {
			expect(failed.bodyUsed).toBe(true);
			return new Response('recovered');
		});
		const result = await requestStep(
			new FetchCqutSession(),
			'https://uis.example.test/',
			{},
			{ retryOnServerError: true },
			'获取课表'
		);
		expect(result.ok).toBe(true);
		if (result.ok) expect(await result.value.text()).toBe('recovered');
		expect(fetcher).toHaveBeenCalledTimes(2);
	});

	it('uses the shared transient network retry without losing session cookies', async () => {
		const fetcher = stubFetch();
		fetcher.mockRejectedValueOnce(Object.assign(new Error('socket reset'), { code: 'ECONNRESET' }));
		fetcher.mockResolvedValueOnce(new Response('recovered'));
		const jar = new CookieJar();
		jar.setCookie('session=own; Path=/', 'https://uis.example.test/');
		const result = await requestStep(
			new FetchCqutSession(jar),
			'https://uis.example.test/',
			{},
			{},
			'获取课表'
		);
		expect(result.ok).toBe(true);
		expect(fetcher).toHaveBeenCalledTimes(2);
		expect(new Headers(fetcher.mock.calls[1]?.[1]?.headers).get('cookie')).toBe('session=own');
	});

	it('propagates caller cancellation and aborts active requests on disposal', async () => {
		const fetcher = stubFetch();
		fetcher.mockImplementation(async (_url, init) => {
			const signal = init!.signal!;
			signal.throwIfAborted();
			return new Promise<Response>((_resolve, reject) => {
				signal.addEventListener('abort', () => reject(signal.reason), { once: true });
			});
		});
		const caller = new AbortController();
		const session = new FetchCqutSession();
		const request = session.request({ url: 'https://uis.example.test/', signal: caller.signal });
		caller.abort(new DOMException('cancelled', 'AbortError'));
		await expect(request).rejects.toMatchObject({ name: 'AbortError' });

		const active = session.request({ url: 'https://uis.example.test/' });
		await session.dispose();
		await expect(active).rejects.toMatchObject({ name: 'AbortError' });
		await expect(session.request({ url: 'https://uis.example.test/' })).rejects.toMatchObject({
			name: 'AbortError'
		});
	});

	it('does not issue a fetch when the caller has already cancelled', async () => {
		const fetcher = stubFetch();
		await expect(
			new FetchCqutSession().request({
				url: 'https://uis.example.test/',
				signal: AbortSignal.abort(new DOMException('cancelled', 'AbortError'))
			})
		).rejects.toMatchObject({ name: 'AbortError' });
		expect(fetcher).not.toHaveBeenCalled();
	});

	it('isolates cookies between sessions and clears them on disposal', async () => {
		const fetcher = stubFetch();
		fetcher.mockResolvedValueOnce(
			new Response('ok', { headers: { 'set-cookie': 'session=private; Path=/' } })
		);
		fetcher.mockResolvedValueOnce(new Response('ok'));
		const first = new FetchCqutSession();
		const second = new FetchCqutSession();
		await first.request({ url: 'https://uis.example.test/' });
		await second.request({ url: 'https://uis.example.test/' });
		expect(new Headers(fetcher.mock.calls[1]?.[1]?.headers).get('cookie')).toBeNull();
		expect(await first.hasCookie('https://uis.example.test/', 'session')).toBe(true);
		await first.dispose();
		expect(await first.hasCookie('https://uis.example.test/', 'session')).toBe(false);
	});
});
