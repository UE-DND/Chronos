import { afterEach, describe, expect, it, vi } from 'vite-plus/test';
import { toUpstreamNetworkError } from '../src/online/upstream-error';
import { CasError } from '@cqut-openproject/cas-sdk';

afterEach(() => {
	vi.restoreAllMocks();
});

describe('toUpstreamNetworkError', () => {
	it('preserves a known transport cause and propagates a program error wrapped by CAS', () => {
		const networkError = Object.assign(new Error('socket closed'), { code: 'ECONNRESET' });
		expect(toUpstreamNetworkError(networkError, '获取课表')).toMatchObject({
			kind: 'Network',
			cause: networkError
		});
		const bug = new TypeError('Cannot read properties of undefined');
		expect(() =>
			toUpstreamNetworkError(
				new CasError('NETWORK_ERROR', 'request failed', { cause: bug }),
				'获取课表'
			)
		).toThrow(bug);
	});
	it('keeps a known transport wrapper cause but rejects undici option bugs', () => {
		const socket = Object.assign(new Error('socket closed'), { code: 'UND_ERR_SOCKET' });
		const terminated = new TypeError('terminated', { cause: socket });
		expect(toUpstreamNetworkError(terminated, '读取课表')).toMatchObject({
			kind: 'Network',
			cause: terminated
		});
		const invalid = new TypeError('fetch failed', { cause: new Error('invalid fetch option') });
		expect(() => toUpstreamNetworkError(invalid, '获取课表')).toThrow(invalid);
	});

	it('maps DOMException TimeoutError to step timeout message', () => {
		const error = new DOMException('The operation timed out', 'TimeoutError');
		const result = toUpstreamNetworkError(error, '统一身份认证登录');
		expect(result.kind).toBe('Network');
		expect(result.message).toBe('统一身份认证登录超时，请稍后重试');
	});

	it('maps DOMException AbortError to step timeout message', () => {
		const error = new DOMException('The operation was aborted', 'AbortError');
		const result = toUpstreamNetworkError(error, '获取课表');
		expect(result.kind).toBe('Network');
		expect(result.message).toBe('获取课表超时，请稍后重试');
	});

	it('maps TypeError fetch failed with timeout cause to step timeout message', () => {
		const cause = Object.assign(new Error('Connect Timeout Error'), {
			code: 'UND_ERR_CONNECT_TIMEOUT'
		});
		const error = new TypeError('fetch failed', { cause });
		const result = toUpstreamNetworkError(error, '获取校区节次时间');
		expect(result.kind).toBe('Network');
		expect(result.message).toBe('获取校区节次时间超时，请稍后重试');
	});

	it('maps ETIMEDOUT code to step timeout message', () => {
		const error = Object.assign(new Error('connect ETIMEDOUT'), { code: 'ETIMEDOUT' });
		const result = toUpstreamNetworkError(error, '获取用户校区信息');
		expect(result.kind).toBe('Network');
		expect(result.message).toBe('获取用户校区信息超时，请稍后重试');
	});

	it('prefers parent signal aborted message over single-request timeout', () => {
		const controller = new AbortController();
		controller.abort();
		const error = new DOMException('The operation timed out', 'TimeoutError');
		const result = toUpstreamNetworkError(error, '建立课表系统会话', controller.signal);
		expect(result.kind).toBe('Network');
		expect(result.message).toBe('在线课表导入超时（建立课表系统会话），请稍后重试');
	});

	it('maps other connectivity failures to step failure message', () => {
		const cause = Object.assign(new Error('connect ECONNREFUSED'), { code: 'ECONNREFUSED' });
		const error = new TypeError('fetch failed', { cause });
		const result = toUpstreamNetworkError(error, '获取课表系统登录票据');
		expect(result.kind).toBe('Network');
		expect(result.message).toBe('获取课表系统登录票据失败，请稍后重试');
	});

	it('does not log sensitive upstream error messages', () => {
		const consoleError = vi.spyOn(console, 'error').mockImplementation(() => {});
		toUpstreamNetworkError(
			Object.assign(new Error('request failed for ?ticket=ST-sensitive&password=secret'), {
				code: 'ECONNRESET'
			}),
			'建立课表系统会话'
		);

		const logText = consoleError.mock.calls.flat().join(' ');
		expect(logText).not.toContain('ST-sensitive');
		expect(logText).not.toContain('password=secret');
		expect(logText).toContain('upstream-error.test.ts:');
	});
});
