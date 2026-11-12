import type { ICookieJar } from '@cqut-openproject/cas-sdk';
import type { CqutRequest, CqutResponse, CqutSession } from '../src/online';
import { CookieJar, getResponseCookies } from './cookie-jar';

const REDIRECT_STATUSES = new Set([301, 302, 303, 307, 308]);
const MAX_REDIRECTS = 20;

function requestUrl(value: string, base?: string): URL {
	const url = new URL(value, base);
	if (!['http:', 'https:'].includes(url.protocol) || url.username || url.password) {
		throw new TypeError('Invalid CQUT HTTP URL');
	}
	url.hash = '';
	return url;
}

/** Native Workers fetch, with a private cookie jar and explicit redirect handling. */
export class FetchCqutSession implements CqutSession {
	readonly jar: CookieJar;
	private readonly lifetime = new AbortController();

	constructor(jar?: CookieJar) {
		this.jar = jar ?? new CookieJar();
	}

	createCasCookieJar(): ICookieJar {
		return this.jar;
	}

	async hasCookie(url: string, name: string): Promise<boolean> {
		return this.jar.hasCookie(url, name);
	}

	async request(input: CqutRequest): Promise<CqutResponse> {
		const signal = input.signal
			? AbortSignal.any([input.signal, this.lifetime.signal])
			: this.lifetime.signal;
		let url = requestUrl(input.url);
		let method = (input.method ?? 'GET').toUpperCase();
		let body = input.body;
		const headers = new Headers(input.headers);
		const visited = new Set<string>();

		for (let redirects = 0; ; redirects++) {
			signal.throwIfAborted();
			const key = `${method} ${url.href}`;
			if (visited.has(key)) throw new TypeError('CQUT redirect loop detected');
			visited.add(key);

			const cookie = this.jar.cookieHeader(url.href);
			if (cookie) headers.set('cookie', cookie);
			const response = await fetch(url.href, {
				method,
				headers: new Headers(headers),
				body,
				redirect: 'manual',
				signal
			});
			try {
				signal.throwIfAborted();
				this.jar.storeFrom(response, url.href);
				const location = response.headers.get('location');
				if (!input.disableRedirects && REDIRECT_STATUSES.has(response.status) && location) {
					// A redirect response need not be read, but its stream must be released first.
					await response.body?.cancel();
					if (redirects >= MAX_REDIRECTS) throw new TypeError('CQUT redirect limit exceeded');
					const next = requestUrl(location, url.href);
					if (next.origin !== url.origin) {
						for (const name of ['authorization', 'proxy-authorization', 'cookie2']) {
							headers.delete(name);
						}
					}
					// Cookies are selected for each hop, never copied from the preceding request.
					headers.delete('cookie');
					if (
						((response.status === 301 || response.status === 302) && method === 'POST') ||
						(response.status === 303 && method !== 'GET' && method !== 'HEAD')
					) {
						method = 'GET';
						body = undefined;
						for (const name of [
							'content-encoding',
							'content-language',
							'content-location',
							'content-type',
							'content-length',
							'transfer-encoding'
						]) {
							headers.delete(name);
						}
					}
					url = next;
					continue;
				}

				const responseHeaders: Record<string, string | string[]> = {};
				response.headers.forEach((value, name) => {
					responseHeaders[name.toLowerCase()] = value;
				});
				const setCookieList = getResponseCookies(response.headers);
				if (setCookieList.length) responseHeaders['set-cookie'] = setCookieList;
				// Buffer before returning so retry/status paths cannot retain a connection slot.
				const text = await response.text();
				signal.throwIfAborted();
				return {
					status: response.status,
					headers: responseHeaders,
					url: response.url || url.href,
					text: async () => text,
					json: async <T = unknown>() => JSON.parse(text) as T,
					getSetCookie: () => setCookieList
				};
			} finally {
				if (!response.bodyUsed) await response.body?.cancel().catch(() => {});
			}
		}
	}

	async dispose(): Promise<void> {
		this.lifetime.abort(new DOMException('CQUT session disposed', 'AbortError'));
		this.jar.clear();
	}
}

export function createCqutSession(): CqutSession {
	return new FetchCqutSession();
}
