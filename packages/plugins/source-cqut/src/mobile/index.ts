import type { Cookie, CqutRequest, CqutResponse, CqutSession, ICookieJar } from '../online';
import { executeCqutPreview } from '../online';
import type { MobilePluginServerContext, MobilePluginServerModule } from '@chronos/core';

class NativeCasCookieJar implements ICookieJar {
	setCookie(_rawCookie: string, _currentUrl: string): void {}
	setCookies(_rawCookies: string[], _currentUrl: string): void {}
	getCookieString(_currentUrl: string): string {
		return '';
	}
	getCookies(_currentUrl: string): Cookie[] {
		return [];
	}
	clear(): void {}
}

async function createCqutSession(context: MobilePluginServerContext): Promise<CqutSession> {
	const httpSession = await context.createHttpSession();
	return {
		request(input: CqutRequest): Promise<CqutResponse> {
			return httpSession.request(input.url, {
				method: input.method,
				headers: input.headers,
				body: input.body,
				disableRedirects: input.disableRedirects,
				connectTimeoutMs: input.connectTimeoutMs,
				readTimeoutMs: input.readTimeoutMs,
				signal: input.signal
			});
		},
		createCasCookieJar() {
			return new NativeCasCookieJar();
		},
		hasCookie(url, name) {
			return httpSession.hasCookie(url, name);
		},
		dispose() {
			return httpSession.dispose();
		}
	};
}

export const mobilePluginServerModule: MobilePluginServerModule = {
	createHandlers(context) {
		return {
			preview(payload) {
				return executeCqutPreview(payload, () => createCqutSession(context));
			}
		};
	}
};
