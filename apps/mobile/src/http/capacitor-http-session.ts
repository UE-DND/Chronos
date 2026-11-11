import { CapacitorCookies, CapacitorHttp, registerPlugin } from '@capacitor/core';
import { belongsToDomain, isHttpsOrigin } from '@chronos/core';
import type {
	HttpSessionRequestOptions,
	HttpSessionResponse,
	IHostHttpSession,
	IHostHttpSessionService
} from '@chronos/core';

export interface CapacitorHttpSessionOptions {
	allowedDomains: readonly string[];
	cookieOrigins: readonly string[];
}

function normalizeOptions(options: CapacitorHttpSessionOptions): CapacitorHttpSessionOptions {
	const allowedDomains = [...new Set(options.allowedDomains.map((domain) => domain.toLowerCase()))];
	if (allowedDomains.length === 0) throw new Error('HTTP session requires allowed domains');
	const cookieOrigins = [
		...new Set(
			options.cookieOrigins.map((origin) => {
				let parsed: URL;
				try {
					parsed = new URL(origin);
				} catch {
					throw new Error(`Invalid HTTPS cookie origin: ${origin}`);
				}
				if (!isHttpsOrigin(parsed) || !belongsToDomain(parsed.hostname, allowedDomains)) {
					throw new Error(`HTTPS cookie origin must belong to an allowed domain: ${origin}`);
				}
				return parsed.origin;
			})
		)
	];
	return { allowedDomains, cookieOrigins };
}

function isPersistentCookie(value: string, segment: string): boolean {
	return value.length > 0 && !/(?:^|;)\s*max-age=0(?:;|$)/i.test(segment);
}

const MAX_REDIRECTS = 20;
const REDIRECT_STATUSES = new Set([301, 302, 303, 307, 308]);
const BODY_HEADERS = new Set([
	'content-encoding',
	'content-language',
	'content-length',
	'content-location',
	'content-type'
]);
const CREDENTIAL_HEADERS = new Set(['authorization', 'proxy-authorization', 'cookie']);

class CapacitorHttpSession implements IHostHttpSession {
	private disposed = false;
	private initialization: Promise<void> | null = null;
	private readonly responseCookies = new Map<string, Set<string>>();

	constructor(private readonly options: CapacitorHttpSessionOptions) {}

	async request(
		url: string,
		options: HttpSessionRequestOptions = {}
	): Promise<HttpSessionResponse> {
		this.assertActive(options.signal);
		await this.ensureInitialized();
		let currentUrl = new URL(url);
		let method = (options.method ?? 'GET').toUpperCase();
		let body = options.body;
		let requestHeaders = options.headers ? { ...options.headers } : undefined;
		const visited = new Set<string>();
		for (let redirects = 0; ; redirects++) {
			this.assertActive(options.signal);
			this.assertAllowedUrl(currentUrl);
			const key = `${method} ${currentUrl.href}`;
			if (visited.has(key)) throw new Error('HTTP session redirect cycle');
			visited.add(key);
			const response = await this.requestOnce(currentUrl.href, {
				...options,
				method,
				body,
				headers: requestHeaders
			});
			this.assertActive(options.signal);
			const responseUrl = new URL(response.url || currentUrl.href);
			this.assertAllowedUrl(responseUrl);
			const headers: Record<string, string | string[]> = {};
			for (const [key, value] of Object.entries(response.headers ?? {})) {
				headers[key.toLowerCase()] = value;
				headers[key] = value;
			}
			this.storeResponseCookies(headers, responseUrl.href);
			const location = headers.location;
			if (options.disableRedirects || !REDIRECT_STATUSES.has(response.status) || !location) {
				return {
					status: response.status,
					headers,
					url: responseUrl.href,
					async text() {
						if (typeof response.data === 'string') return response.data;
						if (response.data === null || response.data === undefined) return '';
						return JSON.stringify(response.data);
					},
					async json<T = unknown>() {
						if (typeof response.data === 'string') return JSON.parse(response.data) as T;
						return response.data as T;
					}
				};
			}
			if (redirects >= MAX_REDIRECTS) throw new Error('HTTP session redirect limit exceeded');
			const nextUrl = new URL(Array.isArray(location) ? location[0]! : location, responseUrl);
			this.assertAllowedUrl(nextUrl);
			const dropsBody =
				((response.status === 301 || response.status === 302) && method === 'POST') ||
				(response.status === 303 && method !== 'GET' && method !== 'HEAD');
			if (dropsBody) {
				method = 'GET';
				body = undefined;
			}
			if (requestHeaders) {
				const changesOrigin = nextUrl.origin !== responseUrl.origin;
				requestHeaders = Object.fromEntries(
					Object.entries(requestHeaders).filter(
						([name]) =>
							!(dropsBody && BODY_HEADERS.has(name.toLowerCase())) &&
							!(changesOrigin && CREDENTIAL_HEADERS.has(name.toLowerCase()))
					)
				);
			}
			currentUrl = nextUrl;
		}
	}

	private assertAllowedUrl(url: URL): void {
		if (url.protocol !== 'https:') {
			throw new Error('HTTP session requests must use HTTPS');
		}
		if (!belongsToDomain(url.hostname, this.options.allowedDomains)) {
			throw new Error(`HTTP session request host is not allowed: ${url.hostname}`);
		}
	}

	private assertActive(signal?: AbortSignal): void {
		if (this.disposed) throw new Error('HTTP session has been disposed');
		signal?.throwIfAborted();
	}

	private async requestOnce(url: string, options: HttpSessionRequestOptions) {
		const requestPromise = CapacitorHttp.request({
			url,
			method: options.method ?? 'GET',
			headers: options.headers,
			data: options.body,
			// Native redirects cannot enforce the plugin domain boundary at each hop.
			disableRedirects: true,
			connectTimeout: options.connectTimeoutMs,
			readTimeout: options.readTimeoutMs
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
			if (!options.signal) return;
			const onAbort = () =>
				reject(
					options.signal?.reason ?? new DOMException('The operation was aborted', 'AbortError')
				);
			options.signal.addEventListener('abort', onAbort, { once: true });
			cancelListener = () => options.signal?.removeEventListener('abort', onAbort);
			if (options.signal.aborted) onAbort();
		});

		try {
			return await Promise.race([requestPromise, abortPromise]);
		} finally {
			cancelListener?.();
		}
	}

	async hasCookie(url: string, name: string): Promise<boolean> {
		const parsed = new URL(url.startsWith('http') ? url : `https://${url}/`);
		if (
			parsed.protocol !== 'https:' ||
			!belongsToDomain(parsed.hostname, this.options.allowedDomains)
		) {
			throw new Error('HTTP session cookie queries must use an allowed HTTPS host');
		}
		const hostname = parsed.hostname.toLowerCase();
		if (
			[...this.responseCookies].some(
				([domain, names]) => belongsToDomain(hostname, [domain]) && names.has(name)
			)
		) {
			return true;
		}
		// iOS may store an HttpOnly session cookie without echoing Set-Cookie to JavaScript.
		return nativeCookiePresent(parsed.href, name);
	}

	async dispose(): Promise<void> {
		this.disposed = true;
		this.responseCookies.clear();
		await this.clearCookies();
	}

	private ensureInitialized(): Promise<void> {
		this.initialization ??= this.clearCookies();
		return this.initialization;
	}

	private storeResponseCookies(
		headers: Record<string, string | string[]>,
		responseUrl: string
	): void {
		const setCookie = headers['set-cookie'];
		if (!setCookie) return;
		const responseHost = new URL(responseUrl).hostname.toLowerCase();
		const cookieHeaders = Array.isArray(setCookie) ? setCookie : [setCookie];
		for (const header of cookieHeaders) {
			const segments = header.split(/,(?=\s*[^=;,\s]+=)/g);
			for (const segment of segments) {
				const pair = /^\s*([^=;,\s]+)=([^;]*)/.exec(segment);
				const name = pair?.[1];
				const value = pair?.[2];
				if (!name || value === undefined) continue;
				const domainAttribute = /(?:^|;)\s*domain=([^;]+)/i.exec(segment)?.[1];
				const domain = (domainAttribute?.trim().replace(/^\./, '') ?? responseHost).toLowerCase();
				const names = this.responseCookies.get(domain) ?? new Set<string>();
				if (isPersistentCookie(value, segment)) {
					names.add(name);
				} else {
					names.delete(name);
				}
				if (names.size > 0) this.responseCookies.set(domain, names);
				else this.responseCookies.delete(domain);
			}
		}
	}

	private async clearCookies(): Promise<void> {
		await Promise.all(
			this.options.cookieOrigins.map(async (url) => {
				try {
					await CapacitorCookies.clearCookies({ url });
				} catch {
					// Ignore cookie clearing failure for individual origins.
				}
			})
		);
	}
}

async function nativeCookiePresent(url: string, name: string): Promise<boolean> {
	try {
		const plugin = registerPlugin<{
			hasCookie(options: { url: string; name: string }): Promise<{ present?: boolean }>;
		}>('ChronosHttpCookie');
		return (await plugin.hasCookie({ url, name })).present === true;
	} catch {
		return false;
	}
}

export class CapacitorHttpSessionService implements IHostHttpSessionService {
	createSession(options: CapacitorHttpSessionOptions): IHostHttpSession {
		return new CapacitorHttpSession(normalizeOptions(options));
	}
}
