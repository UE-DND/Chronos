import { describe, expect, it, vi } from 'vite-plus/test';
import type { IHttpService } from '@chronos/core';
import type { MobilePluginServerRegistry } from '../src/http/mobile-plugin-server-registry';
import { MobilePluginHttpAdapter } from '../src/http/mobile-plugin-http-adapter';

describe('MobilePluginHttpAdapter', () => {
	function registry(
		handlers: Record<string, (payload: unknown) => Promise<unknown>> = {}
	): MobilePluginServerRegistry {
		return {
			supports: vi.fn((pluginId, action) => `${pluginId}/${action}` in handlers),
			execute: vi.fn((pluginId, action, payload) => {
				const handler = handlers[`${pluginId}/${action}`];
				if (!handler)
					throw new Error(`Unsupported plugin server proxy action: ${pluginId}/${action}`);
				return handler(payload) as never;
			})
		};
	}

	it('combines registered native capabilities with inner service capabilities', () => {
		const supportsPluginServer = vi.fn(
			(pluginId: string, action: string) => pluginId === 'remote' && action === 'sync'
		);
		const inner: IHttpService = {
			request: vi.fn(),
			supportsPluginServer
		};
		const mobileRegistry = registry({ 'source-cqut/preview': vi.fn() });
		const adapter = new MobilePluginHttpAdapter(inner, mobileRegistry);

		expect(adapter.supportsPluginServer('source-cqut', 'preview')).toBe(true);
		expect(adapter.supportsPluginServer('remote', 'sync')).toBe(true);
		expect(adapter.supportsPluginServer('source-cqut', 'other')).toBe(false);
		expect(supportsPluginServer).toHaveBeenCalledWith('remote', 'sync');
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
		const adapter = new MobilePluginHttpAdapter({ request: requestSpy }, registry());

		const result = await adapter.request('https://example.com/api');
		expect(requestSpy).toHaveBeenCalledWith('https://example.com/api', undefined);
		expect(result).toBe(mockResponse);
	});

	it('dispatches registered handlers and wraps successful responses', async () => {
		const handler = vi.fn().mockResolvedValue({ ok: true, payload: { yearTerm: '2025-1' } });
		const adapter = new MobilePluginHttpAdapter(
			{ request: vi.fn() },
			registry({ 'source-cqut/preview': handler })
		);

		const response = await adapter.proxy('source-cqut', 'preview', { account: '20210001' });
		expect(handler).toHaveBeenCalledWith({ account: '20210001' });
		expect(response.ok).toBe(true);
		expect(response.status).toBe(200);
		expect(await response.json()).toEqual({ yearTerm: '2025-1' });
	});

	it('wraps registered handler errors as a 502 response', async () => {
		const handler = vi.fn().mockResolvedValue({
			ok: false,
			error: { kind: 'Auth', message: '统一身份认证登录失败' }
		});
		const adapter = new MobilePluginHttpAdapter(
			{ request: vi.fn() },
			registry({ 'source-cqut/preview': handler })
		);

		const response = await adapter.proxy('source-cqut', 'preview', {});
		expect(response.ok).toBe(false);
		expect(response.status).toBe(502);
		expect(response.statusText).toBe('统一身份认证登录失败');
		expect(await response.json()).toEqual({
			ok: false,
			error: { kind: 'Auth', message: '统一身份认证登录失败' }
		});
	});

	it('delegates unregistered actions or reports unsupported operations', async () => {
		const remoteResponse = { status: 200 } as Awaited<ReturnType<IHttpService['request']>>;
		const proxy = vi.fn().mockResolvedValue(remoteResponse);
		const adapter = new MobilePluginHttpAdapter({ request: vi.fn(), proxy }, registry());
		expect(await adapter.proxy('remote', 'sync', { value: 1 })).toBe(remoteResponse);
		expect(proxy).toHaveBeenCalledWith('remote', 'sync', { value: 1 }, undefined);

		const unsupported = new MobilePluginHttpAdapter({ request: vi.fn() }, registry());
		await expect(unsupported.proxy('remote', 'sync', {})).rejects.toThrow(
			'Unsupported plugin server proxy action: remote/sync'
		);
	});
});
