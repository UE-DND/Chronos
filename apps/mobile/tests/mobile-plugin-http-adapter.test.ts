import { describe, expect, it, vi } from 'vite-plus/test';
import type { IHttpService } from '@chronos/core';
import { MobilePluginHttpAdapter } from '../src/http/mobile-plugin-http-adapter';

vi.mock('../src/http/capacitor-cqut-session', () => ({
	CapacitorCqutSession: vi.fn().mockImplementation(() => ({
		request: vi.fn(),
		createCasCookieJar: vi.fn(),
		hasCookie: vi.fn(),
		dispose: vi.fn().mockResolvedValue(undefined)
	}))
}));

vi.mock('@chronos/plugin-source-cqut/online', () => ({
	executeCqutPreview: vi.fn()
}));

import { executeCqutPreview } from '@chronos/plugin-source-cqut/online';

describe('MobilePluginHttpAdapter', () => {
	it('supports only source-cqut preview action by default', () => {
		const inner: IHttpService = {
			request: vi.fn(),
			supportsPluginServer: vi.fn().mockReturnValue(false)
		};
		const adapter = new MobilePluginHttpAdapter(inner);

		expect(adapter.supportsPluginServer('source-cqut', 'preview')).toBe(true);
		expect(adapter.supportsPluginServer('source-cqut', 'other')).toBe(false);
		expect(adapter.supportsPluginServer('other-plugin', 'preview')).toBe(false);
	});

	it('delegates request calls to inner http service', async () => {
		const mockResponse = {
			status: 200,
			statusText: 'OK',
			headers: {},
			ok: true,
			text: vi.fn().mockResolvedValue('ok'),
			json: vi.fn().mockResolvedValue({}),
			bytes: vi.fn().mockResolvedValue(new Uint8Array())
		};
		const requestSpy = vi.fn().mockResolvedValue(mockResponse);
		const inner: IHttpService = {
			request: requestSpy
		};
		const adapter = new MobilePluginHttpAdapter(inner);

		const result = await adapter.request('https://example.com/api');
		expect(requestSpy).toHaveBeenCalledWith('https://example.com/api', undefined);
		expect(result).toBe(mockResponse);
	});

	it('handles source-cqut preview proxy success', async () => {
		const inner: IHttpService = {
			request: vi.fn()
		};
		const adapter = new MobilePluginHttpAdapter(inner);

		const payloadData = {
			payload: { yearTerm: '2025-1' },
			campusId: 'huaxi',
			campusPeriodTimes: { huaxi: [] }
		};
		vi.mocked(executeCqutPreview).mockResolvedValue({
			ok: true,
			payload: payloadData as any
		});

		const response = await adapter.proxy('source-cqut', 'preview', {
			account: '20210001',
			password: 'secret'
		});

		expect(response.ok).toBe(true);
		expect(response.status).toBe(200);
		const json = await response.json();
		expect(json).toEqual(payloadData);
	});

	it('handles source-cqut preview proxy error with 502 status', async () => {
		const inner: IHttpService = {
			request: vi.fn()
		};
		const adapter = new MobilePluginHttpAdapter(inner);

		vi.mocked(executeCqutPreview).mockResolvedValue({
			ok: false,
			error: { kind: 'Auth', message: '统一身份认证登录失败' }
		});

		const response = await adapter.proxy('source-cqut', 'preview', {
			account: '20210001',
			password: 'bad'
		});

		expect(response.ok).toBe(false);
		expect(response.status).toBe(502);
		expect(response.statusText).toBe('统一身份认证登录失败');
		const json = await response.json();
		expect(json).toEqual({
			ok: false,
			error: { kind: 'Auth', message: '统一身份认证登录失败' }
		});
	});

	it('rejects unsupported proxy action when inner does not support proxy', async () => {
		const inner: IHttpService = {
			request: vi.fn()
		};
		const adapter = new MobilePluginHttpAdapter(inner);

		await expect(adapter.proxy('other-plugin', 'preview', {})).rejects.toThrow(
			'Unsupported plugin server proxy action: other-plugin/preview'
		);
	});
});
