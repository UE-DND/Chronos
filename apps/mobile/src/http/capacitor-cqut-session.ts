import { CapacitorCookies, CapacitorHttp } from '@capacitor/core';
import type {
	Cookie,
	CqutRequest,
	CqutResponse,
	CqutSession,
	ICookieJar
} from '@chronos/plugin-source-cqut/online';
import { CONNECT_TIMEOUT_MS, REQUEST_TIMEOUT_MS } from '@chronos/plugin-source-cqut/online';

const CQUT_COOKIE_DOMAINS = ['https://uis.cqut.edu.cn', 'https://timetable-cfc.cqut.edu.cn'];

/**
 * CookieJar for CAS SDK in Capacitor Android.
 * Returns empty cookie string so that CAS SDK does not generate a manual `Cookie` header,
 * allowing Android's native CookieManager to handle cookies natively without conflict.
 */
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

export class CapacitorCqutSession implements CqutSession {
	private initialized = false;
	private disposed = false;
	private readonly responseCookies = new Map<string, Set<string>>();

	private async ensureInitialized(): Promise<void> {
		if (!this.initialized) {
			this.initialized = true;
			await this.clearCookies();
		}
	}

	createCasCookieJar(): ICookieJar {
		return new NativeCasCookieJar();
	}

	async hasCookie(url: string, name: string): Promise<boolean> {
		const hostname = new URL(url.startsWith('http') ? url : `https://${url}/`).hostname;
		return [...this.responseCookies].some(
			([domain, names]) =>
				(hostname === domain || hostname.endsWith(`.${domain}`)) && names.has(name)
		);
	}

	async request(input: CqutRequest): Promise<CqutResponse> {
		if (this.disposed) throw new Error('CQUT session has been disposed');
		await this.ensureInitialized();

		const parsedUrl = new URL(input.url);
		if (parsedUrl.protocol !== 'https:') {
			throw new Error('HTTP plaintext is not permitted for CQUT requests');
		}

		if (input.signal?.aborted) {
			throw new DOMException('The operation was aborted', 'AbortError');
		}

		const connectTimeout = input.connectTimeoutMs ?? CONNECT_TIMEOUT_MS;
		const readTimeout = input.readTimeoutMs ?? REQUEST_TIMEOUT_MS;

		const requestPromise = CapacitorHttp.request({
			url: input.url,
			method: input.method ?? 'GET',
			headers: input.headers,
			data: input.body,
			disableRedirects: input.disableRedirects ?? false,
			connectTimeout,
			readTimeout
		});
		void requestPromise.then(
			() => {
				if (this.disposed) void this.clearCookies();
			},
			() => {
				if (this.disposed) void this.clearCookies();
			}
		);

		let cancelListener: (() => void) | undefined;
		const abortPromise = new Promise<never>((_, reject) => {
			if (!input.signal) return;
			const onAbort = () =>
				reject(new DOMException('The operation was aborted due to timeout', 'TimeoutError'));
			input.signal.addEventListener('abort', onAbort, { once: true });
			cancelListener = () => input.signal?.removeEventListener('abort', onAbort);
		});

		try {
			const res = await Promise.race([requestPromise, abortPromise]);
			cancelListener?.();

			const responseHeaders: Record<string, string | string[]> = {};
			if (res.headers && typeof res.headers === 'object') {
				for (const [key, value] of Object.entries(res.headers)) {
					responseHeaders[key.toLowerCase()] = String(value);
					responseHeaders[key] = String(value);
				}
			}
			this.storeResponseCookies(responseHeaders, res.url || input.url);

			return {
				status: res.status,
				headers: responseHeaders,
				url: res.url || input.url,
				async text(): Promise<string> {
					if (typeof res.data === 'string') return res.data;
					if (res.data === null || res.data === undefined) return '';
					return JSON.stringify(res.data);
				},
				async json<T = unknown>(): Promise<T> {
					if (typeof res.data === 'string') {
						return JSON.parse(res.data) as T;
					}
					return res.data as T;
				}
			};
		} catch (err) {
			cancelListener?.();
			throw err;
		}
	}

	async dispose(): Promise<void> {
		this.disposed = true;
		this.responseCookies.clear();
		await this.clearCookies();
	}

	private storeResponseCookies(
		headers: Record<string, string | string[]>,
		responseUrl: string
	): void {
		const setCookie = headers['set-cookie'];
		if (!setCookie) return;

		const cookieHeaders = Array.isArray(setCookie) ? setCookie : [setCookie];
		const responseHost = new URL(responseUrl).hostname.toLowerCase();
		for (const header of cookieHeaders) {
			for (const match of header.matchAll(/(?:^|,\s*)([^=;,\s]+)=([^;,\s]*)/g)) {
				const name = match[1];
				const cookieValue = match[2];
				if (!name || cookieValue === undefined) continue;

				const names = this.responseCookies.get(responseHost) ?? new Set<string>();
				if (cookieValue.length > 0) names.add(name);
				else names.delete(name);
				if (names.size > 0) this.responseCookies.set(responseHost, names);
				else this.responseCookies.delete(responseHost);
			}
		}
	}

	private async clearCookies(): Promise<void> {
		await Promise.all(
			CQUT_COOKIE_DOMAINS.map(async (url) => {
				try {
					await CapacitorCookies.clearCookies({ url });
				} catch {
					// Ignore clear failure on individual domains
				}
			})
		);
	}
}
