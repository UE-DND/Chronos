import { beforeEach, describe, expect, it, vi } from 'vite-plus/test';
import { CapacitorHttpSessionService } from '../src/http/capacitor-http-session';

const mockClearCookies = vi.hoisted(() => vi.fn().mockResolvedValue(undefined));
const mockRequest = vi.hoisted(() => vi.fn());
const mockHasNativeCookie = vi.hoisted(() => vi.fn().mockResolvedValue({ present: false }));

vi.mock('@capacitor/core', () => ({
	CapacitorCookies: { clearCookies: mockClearCookies },
	CapacitorHttp: { request: mockRequest },
	registerPlugin: () => ({ hasCookie: mockHasNativeCookie })
}));

const sessionOptions = {
	allowedDomains: ['example.org'],
	cookieOrigins: ['https://login.example.org', 'https://schedule.example.org']
};

describe('CapacitorHttpSessionService', () => {
	beforeEach(() => {
		vi.clearAllMocks();
		mockRequest.mockReset();
	});

	it('restricts requests to HTTPS hosts in the plugin declared domains', async () => {
		const session = new CapacitorHttpSessionService().createSession(sessionOptions);
		await expect(session.request('http://login.example.org/login')).rejects.toThrow(
			'must use HTTPS'
		);
		await expect(session.request('https://example.net/login')).rejects.toThrow(
			'host is not allowed'
		);
		expect(mockRequest).not.toHaveBeenCalled();
	});

	it('passes redirect, timeout, method and body options to CapacitorHttp', async () => {
		mockRequest.mockResolvedValue({
			status: 302,
			headers: { Location: 'https://schedule.example.org/home' },
			url: 'https://login.example.org/login',
			data: ''
		});
		const session = new CapacitorHttpSessionService().createSession(sessionOptions);
		const response = await session.request('https://login.example.org/login', {
			method: 'POST',
			headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
			body: 'ticket=abc',
			disableRedirects: true,
			connectTimeoutMs: 1000,
			readTimeoutMs: 2500
		});

		expect(mockRequest).toHaveBeenCalledWith({
			url: 'https://login.example.org/login',
			method: 'POST',
			headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
			data: 'ticket=abc',
			disableRedirects: true,
			connectTimeout: 1000,
			readTimeout: 2500
		});
		expect(response.status).toBe(302);
		expect(response.headers.location).toBe('https://schedule.example.org/home');
	});

	it('follows allowed redirects with native automatic redirects disabled on every hop', async () => {
		mockRequest
			.mockResolvedValueOnce({
				status: 302,
				headers: {
					Location: '/continue',
					'Set-Cookie': 'JSESSIONID=session-1; Domain=.example.org; Path=/; HttpOnly'
				},
				url: 'https://login.example.org/login',
				data: ''
			})
			.mockResolvedValueOnce({
				status: 301,
				headers: { Location: 'https://schedule.example.org/home' },
				url: 'https://login.example.org/continue',
				data: ''
			})
			.mockResolvedValueOnce({
				status: 200,
				headers: {},
				url: 'https://schedule.example.org/home',
				data: 'schedule'
			});
		const session = new CapacitorHttpSessionService().createSession(sessionOptions);
		const response = await session.request('https://login.example.org/login');

		expect(response.url).toBe('https://schedule.example.org/home');
		expect(await response.text()).toBe('schedule');
		expect(
			mockRequest.mock.calls.map(([request]) => [request.url, request.disableRedirects])
		).toEqual([
			['https://login.example.org/login', true],
			['https://login.example.org/continue', true],
			['https://schedule.example.org/home', true]
		]);
		expect(await session.hasCookie('https://schedule.example.org', 'JSESSIONID')).toBe(true);
	});

	it.each(['https://unrelated.org/login', 'http://login.example.org/login'])(
		'rejects an unsafe redirect before requesting %s',
		async (location) => {
			mockRequest.mockResolvedValue({
				status: 302,
				headers: { Location: location },
				url: 'https://login.example.org/login',
				data: ''
			});
			const session = new CapacitorHttpSessionService().createSession(sessionOptions);
			await expect(session.request('https://login.example.org/login')).rejects.toThrow(
				location.startsWith('https:') ? 'host is not allowed' : 'must use HTTPS'
			);
			expect(mockRequest).toHaveBeenCalledTimes(1);
		}
	);

	it.each([
		[301, 'POST', 'GET', undefined],
		[302, 'POST', 'GET', undefined],
		[303, 'PUT', 'GET', undefined],
		[303, 'HEAD', 'HEAD', 'ticket=abc'],
		[307, 'POST', 'POST', 'ticket=abc'],
		[308, 'POST', 'POST', 'ticket=abc']
	])('applies HTTP %i redirect semantics for %s', async (status, method, nextMethod, body) => {
		mockRequest
			.mockResolvedValueOnce({
				status,
				headers: { Location: '/home' },
				url: 'https://login.example.org/login',
				data: ''
			})
			.mockResolvedValueOnce({
				status: 200,
				headers: {},
				url: 'https://login.example.org/home',
				data: 'done'
			});
		const headers = { 'Content-Type': 'application/x-www-form-urlencoded', 'X-Request': 'keep' };
		const session = new CapacitorHttpSessionService().createSession(sessionOptions);
		const response = await session.request('https://login.example.org/login', {
			method,
			headers,
			body: 'ticket=abc'
		});

		expect(response.status).toBe(200);
		expect(mockRequest.mock.calls[1]![0]).toMatchObject({
			method: nextMethod,
			data: body,
			headers: body === undefined ? { 'X-Request': 'keep' } : headers,
			disableRedirects: true
		});
		expect(headers['Content-Type']).toBe('application/x-www-form-urlencoded');
	});

	it('drops credential headers when following an allowed redirect to another origin', async () => {
		mockRequest
			.mockResolvedValueOnce({
				status: 307,
				headers: { Location: 'https://schedule.example.org/home' },
				url: 'https://login.example.org/login',
				data: ''
			})
			.mockResolvedValueOnce({
				status: 200,
				headers: {},
				url: 'https://schedule.example.org/home',
				data: 'done'
			});
		const session = new CapacitorHttpSessionService().createSession(sessionOptions);
		await session.request('https://login.example.org/login', {
			headers: {
				Authorization: 'Bearer secret',
				cookie: 'explicit=secret',
				'Proxy-Authorization': 'Basic secret',
				'X-Request': 'keep'
			}
		});

		expect(mockRequest.mock.calls[1]![0].headers).toEqual({ 'X-Request': 'keep' });
	});

	it('rejects redirect cycles and bounds a chain of distinct allowed URLs', async () => {
		mockRequest.mockImplementation(async ({ url }) => ({
			status: 302,
			headers: { Location: url },
			url,
			data: ''
		}));
		const session = new CapacitorHttpSessionService().createSession(sessionOptions);
		await expect(session.request('https://login.example.org/login')).rejects.toThrow('redirect');
		expect(mockRequest).toHaveBeenCalledTimes(1);
		mockRequest.mockClear();
		mockRequest.mockImplementation(async ({ url }) => ({
			status: 302,
			headers: { Location: `/hop/${mockRequest.mock.calls.length}` },
			url,
			data: ''
		}));
		await expect(session.request('https://login.example.org/login')).rejects.toThrow('redirect');
		expect(mockRequest).toHaveBeenCalledTimes(21);
	});

	it('stops a redirect chain when the request is aborted', async () => {
		const controller = new AbortController();
		mockRequest.mockImplementation(async () => {
			controller.abort();
			return {
				status: 302,
				headers: { Location: '/home' },
				url: 'https://login.example.org/login',
				data: ''
			};
		});
		const session = new CapacitorHttpSessionService().createSession(sessionOptions);
		await expect(
			session.request('https://login.example.org/login', { signal: controller.signal })
		).rejects.toThrow('operation was aborted');
		expect(mockRequest).toHaveBeenCalledTimes(1);
	});

	it('preserves a timeout reason when cancellation races with the native response', async () => {
		const controller = new AbortController();
		const reason = new DOMException('Native request deadline exceeded', 'TimeoutError');
		mockRequest.mockImplementation(async () => {
			controller.abort(reason);
			return { status: 200, headers: {}, url: 'https://login.example.org/login', data: '' };
		});
		const session = new CapacitorHttpSessionService().createSession(sessionOptions);
		await expect(
			session.request('https://login.example.org/login', { signal: controller.signal })
		).rejects.toBe(reason);
	});

	it('rejects a native response that unexpectedly reports an undeclared host', async () => {
		mockRequest.mockResolvedValue({
			status: 200,
			headers: {},
			url: 'https://unrelated.org/home',
			data: ''
		});
		const session = new CapacitorHttpSessionService().createSession(sessionOptions);
		await expect(session.request('https://login.example.org/login')).rejects.toThrow(
			'host is not allowed'
		);
		expect(mockRequest).toHaveBeenCalledWith(expect.objectContaining({ disableRedirects: true }));
	});

	it('tracks cookie domains and clears the configured origins on initialization and disposal', async () => {
		mockRequest.mockResolvedValue({
			status: 302,
			headers: {
				'set-cookie': 'JSESSIONID=session-1; Domain=.example.org; Path=/; HttpOnly'
			},
			url: 'https://login.example.org/auth',
			data: ''
		});
		const session = new CapacitorHttpSessionService().createSession(sessionOptions);
		await session.request('https://login.example.org/auth');
		expect(await session.hasCookie('https://schedule.example.org', 'JSESSIONID')).toBe(true);
		await expect(session.hasCookie('https://unrelated.org', 'JSESSIONID')).rejects.toThrow(
			'allowed HTTPS host'
		);
		expect(mockClearCookies).toHaveBeenCalledTimes(2);
		await session.dispose();
		expect(mockClearCookies).toHaveBeenCalledTimes(4);
		expect(mockHasNativeCookie).not.toHaveBeenCalled();
	});

	it('reads an HttpOnly session cookie from the native store when Set-Cookie is omitted', async () => {
		mockRequest.mockResolvedValue({
			status: 302,
			headers: {},
			url: 'https://schedule.example.org/api/auth/casLogin',
			data: ''
		});
		mockHasNativeCookie.mockResolvedValue({ present: true });
		const session = new CapacitorHttpSessionService().createSession(sessionOptions);
		await session.request('https://schedule.example.org/api/auth/casLogin');
		expect(await session.hasCookie('https://schedule.example.org', 'JSESSIONID')).toBe(true);
		expect(mockHasNativeCookie).toHaveBeenCalledWith({
			url: 'https://schedule.example.org/',
			name: 'JSESSIONID'
		});
	});

	it('treats a missing native cookie store as absent', async () => {
		mockHasNativeCookie.mockRejectedValue(new Error('unimplemented'));
		const session = new CapacitorHttpSessionService().createSession(sessionOptions);
		expect(await session.hasCookie('https://schedule.example.org', 'JSESSIONID')).toBe(false);
	});

	it('rejects cookie origins outside the declared allowed domains', () => {
		expect(() =>
			new CapacitorHttpSessionService().createSession({
				allowedDomains: ['example.org'],
				cookieOrigins: ['https://unrelated.org']
			})
		).toThrow('must belong to an allowed domain');
	});

	it('rejects cookie origins with credentials, paths, queries, or fragments', () => {
		for (const origin of [
			'https://user:pass@login.example.org',
			'https://login.example.org/path',
			'https://login.example.org/?token=1',
			'https://login.example.org/#fragment'
		]) {
			expect(() =>
				new CapacitorHttpSessionService().createSession({
					allowedDomains: ['example.org'],
					cookieOrigins: [origin]
				})
			).toThrow('HTTPS cookie origin');
		}
	});

	it('accepts nested subdomain cookie origins', () => {
		expect(() =>
			new CapacitorHttpSessionService().createSession({
				allowedDomains: ['example.org'],
				cookieOrigins: ['https://deep.login.example.org']
			})
		).not.toThrow();
	});

	it('rejects already aborted requests and prevents requests after disposal', async () => {
		const session = new CapacitorHttpSessionService().createSession(sessionOptions);
		const controller = new AbortController();
		controller.abort();
		await expect(
			session.request('https://login.example.org/login', { signal: controller.signal })
		).rejects.toThrow('operation was aborted');
		await session.dispose();
		await expect(session.request('https://login.example.org/login')).rejects.toThrow(
			'HTTP session has been disposed'
		);
	});

	it('rejects an in-flight request on abort and clears cookies again after it settles', async () => {
		let resolveRequest!: (value: {
			status: number;
			headers: {};
			url: string;
			data: string;
		}) => void;
		mockRequest.mockReturnValue(
			new Promise((resolve) => {
				resolveRequest = resolve;
			})
		);
		const session = new CapacitorHttpSessionService().createSession(sessionOptions);
		const controller = new AbortController();
		const pending = session.request('https://login.example.org/login', {
			signal: controller.signal
		});
		await vi.waitFor(() => expect(mockRequest).toHaveBeenCalled());
		controller.abort();
		await expect(pending).rejects.toThrow('operation was aborted');
		await session.dispose();
		const clearCount = mockClearCookies.mock.calls.length;
		resolveRequest({ status: 200, headers: {}, url: 'https://login.example.org/login', data: '' });
		await vi.waitFor(() => expect(mockClearCookies.mock.calls.length).toBeGreaterThan(clearCount));
	});
});
