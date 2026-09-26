import { beforeEach, describe, expect, it, vi } from 'vite-plus/test';
import { CapacitorHttpSessionService } from '../src/http/capacitor-http-session';

const mockClearCookies = vi.hoisted(() => vi.fn().mockResolvedValue(undefined));
const mockRequest = vi.hoisted(() => vi.fn());

vi.mock('@capacitor/core', () => ({
	CapacitorCookies: { clearCookies: mockClearCookies },
	CapacitorHttp: { request: mockRequest }
}));

const sessionOptions = {
	allowedDomains: ['example.org'],
	cookieOrigins: ['https://login.example.org', 'https://schedule.example.org']
};

describe('CapacitorHttpSessionService', () => {
	beforeEach(() => vi.clearAllMocks());

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
	});

	it('rejects cookie origins outside the declared allowed domains', () => {
		expect(() =>
			new CapacitorHttpSessionService().createSession({
				allowedDomains: ['example.org'],
				cookieOrigins: ['https://unrelated.org']
			})
		).toThrow('must belong to an allowed domain');
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
