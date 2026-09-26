import { beforeEach, describe, expect, it, vi } from 'vite-plus/test';
import { CapacitorCqutSession } from '../src/http/capacitor-cqut-session';

const mockGetCookies = vi.hoisted(() => vi.fn());
const mockClearCookies = vi.hoisted(() => vi.fn().mockResolvedValue(undefined));
const mockRequest = vi.hoisted(() => vi.fn());

vi.mock('@capacitor/core', () => ({
	CapacitorCookies: {
		getCookies: mockGetCookies,
		clearCookies: mockClearCookies
	},
	CapacitorHttp: {
		request: mockRequest
	}
}));

describe('CapacitorCqutSession', () => {
	beforeEach(() => {
		vi.clearAllMocks();
	});

	it('rejects HTTP plaintext requests', async () => {
		const session = new CapacitorCqutSession();
		await expect(
			session.request({
				url: 'http://uis.cqut.edu.cn/center-auth-server'
			})
		).rejects.toThrow('HTTP plaintext is not permitted for CQUT requests');
	});

	it('passes disableRedirects and timeouts to CapacitorHttp.request', async () => {
		mockRequest.mockResolvedValue({
			status: 302,
			headers: { Location: 'https://timetable-cfc.cqut.edu.cn/api/auth/casLogin?ticket=ST-123' },
			url: 'https://uis.cqut.edu.cn/login',
			data: ''
		});

		const session = new CapacitorCqutSession();
		const response = await session.request({
			url: 'https://uis.cqut.edu.cn/login',
			method: 'GET',
			headers: { Accept: 'text/html' },
			disableRedirects: true,
			connectTimeoutMs: 5000,
			readTimeoutMs: 10000
		});

		expect(mockRequest).toHaveBeenCalledWith({
			url: 'https://uis.cqut.edu.cn/login',
			method: 'GET',
			headers: { Accept: 'text/html' },
			data: undefined,
			disableRedirects: true,
			connectTimeout: 5000,
			readTimeout: 10000
		});

		expect(response.status).toBe(302);
		expect(response.headers['location']).toBe(
			'https://timetable-cfc.cqut.edu.cn/api/auth/casLogin?ticket=ST-123'
		);
		expect(await response.text()).toBe('');
	});

	it('normalizes parsed JSON data and string data', async () => {
		mockRequest.mockResolvedValue({
			status: 200,
			headers: { 'content-type': 'application/json' },
			url: 'https://timetable-cfc.cqut.edu.cn/api/test',
			data: { code: 200, msg: 'ok' }
		});

		const session = new CapacitorCqutSession();
		const response = await session.request({
			url: 'https://timetable-cfc.cqut.edu.cn/api/test'
		});

		expect(await response.json()).toEqual({ code: 200, msg: 'ok' });
		expect(await response.text()).toBe('{"code":200,"msg":"ok"}');
	});

	it('checks response cookies without reading WebView document.cookie', async () => {
		mockRequest.mockResolvedValue({
			status: 302,
			headers: {
				'set-cookie': 'JSESSIONID=session-xyz; Path=/; HttpOnly, theme=dark; Path=/'
			},
			url: 'https://timetable-cfc.cqut.edu.cn/api/auth/casLogin',
			data: ''
		});

		const session = new CapacitorCqutSession();
		await session.request({ url: 'https://timetable-cfc.cqut.edu.cn/api/auth/casLogin' });
		const hasSession = await session.hasCookie('https://timetable-cfc.cqut.edu.cn', 'JSESSIONID');

		expect(hasSession).toBe(true);
		const hasOther = await session.hasCookie('https://timetable-cfc.cqut.edu.cn', 'OTHER');
		expect(hasOther).toBe(false);
		expect(mockGetCookies).not.toHaveBeenCalled();
	});

	it('cleans up CQUT domain cookies on dispose', async () => {
		const session = new CapacitorCqutSession();
		await session.dispose();

		expect(mockClearCookies).toHaveBeenCalledWith({
			url: 'https://uis.cqut.edu.cn'
		});
		expect(mockClearCookies).toHaveBeenCalledWith({
			url: 'https://timetable-cfc.cqut.edu.cn'
		});
	});

	it('aborts when signal is already aborted', async () => {
		const session = new CapacitorCqutSession();
		const controller = new AbortController();
		controller.abort();

		await expect(
			session.request({
				url: 'https://uis.cqut.edu.cn/test',
				signal: controller.signal
			})
		).rejects.toThrow();
	});

	it('clears cookies again when a native request finishes after disposal', async () => {
		let resolveRequest!: (value: {
			status: number;
			headers: Record<string, string>;
			url: string;
			data: string;
		}) => void;
		mockRequest.mockReturnValue(
			new Promise((resolve) => {
				resolveRequest = resolve;
			})
		);

		const session = new CapacitorCqutSession();
		const controller = new AbortController();
		const pending = session.request({
			url: 'https://uis.cqut.edu.cn/test',
			signal: controller.signal
		});

		await vi.waitFor(() => expect(mockRequest).toHaveBeenCalled());
		controller.abort();
		await expect(pending).rejects.toThrow();
		await session.dispose();
		const clearsAfterDispose = mockClearCookies.mock.calls.length;

		resolveRequest({
			status: 200,
			headers: {},
			url: 'https://uis.cqut.edu.cn/test',
			data: ''
		});

		await vi.waitFor(() =>
			expect(mockClearCookies.mock.calls.length).toBeGreaterThan(clearsAfterDispose)
		);
	});
});
