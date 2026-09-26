import type { HttpResponse, IHttpService, PluginServerResponse } from '@chronos/core';
import { pluginServerErrorMessage } from '@chronos/core';
import { executeCqutPreview } from '@chronos/plugin-source-cqut/online';
import { CapacitorCqutSession } from './capacitor-cqut-session';

export class MobilePluginHttpAdapter implements IHttpService {
	constructor(private readonly inner: IHttpService) {}

	supportsPluginServer(pluginId: string, action: string): boolean {
		if (pluginId === 'source-cqut' && action === 'preview') {
			return true;
		}
		return this.inner.supportsPluginServer?.(pluginId, action) ?? false;
	}

	async request(
		url: string,
		options?: Parameters<IHttpService['request']>[1]
	): Promise<HttpResponse> {
		return this.inner.request(url, options);
	}

	async proxy(
		pluginId: string,
		action: string,
		payload: unknown,
		options?: { timeoutMs?: number; signal?: AbortSignal }
	): Promise<HttpResponse> {
		if (pluginId === 'source-cqut' && action === 'preview') {
			const pluginResponse = await executeCqutPreview(payload, () => new CapacitorCqutSession());
			return this.buildProxyResponse(pluginResponse);
		}

		if (this.inner.proxy) {
			return this.inner.proxy(pluginId, action, payload, options);
		}

		throw new Error(`Unsupported plugin server proxy action: ${pluginId}/${action}`);
	}

	private buildProxyResponse(proxyData: PluginServerResponse<unknown>): HttpResponse {
		if (!proxyData.ok) {
			const errorMsg = pluginServerErrorMessage(proxyData) ?? 'Plugin upstream connection failed';
			const rawJson = JSON.stringify(proxyData);
			return {
				status: 502,
				statusText: errorMsg,
				headers: { 'Content-Type': 'application/json' },
				ok: false,
				text: async () => rawJson,
				json: async <T>() => proxyData as T,
				bytes: async () => new TextEncoder().encode(rawJson)
			};
		}

		const payloadStr = JSON.stringify(proxyData.payload ?? {});
		return {
			status: 200,
			statusText: 'OK',
			headers: { 'Content-Type': 'application/json' },
			ok: true,
			text: async () => payloadStr,
			json: async <T>() => (proxyData.payload ?? {}) as T,
			bytes: async () => new TextEncoder().encode(payloadStr)
		};
	}
}
