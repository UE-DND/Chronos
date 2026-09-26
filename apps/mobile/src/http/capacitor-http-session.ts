import { CapacitorCookies, CapacitorHttp } from '@capacitor/core';
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
	const cookieOrigins = [...new Set(options.cookieOrigins.map((origin) => new URL(origin).origin))];
	for (const origin of cookieOrigins) {
		const parsed = new URL(origin);
		if (
			parsed.protocol !== 'https:' ||
			!allowedDomains.some(
				(domain) => parsed.hostname === domain || parsed.hostname.endsWith(`.${domain}`)
			)
		) {
			throw new Error(`HTTPS cookie origin must belong to an allowed domain: ${origin}`);
		}
	}
	return { allowedDomains, cookieOrigins };
}

function isDomainAllowed(hostname: string, allowedDomains: readonly string[]): boolean {
	const normalized = hostname.toLowerCase();
	return allowedDomains.some(
		(domain) => normalized === domain || normalized.endsWith(`.${domain}`)
	);
}

class CapacitorHttpSession implements IHostHttpSession {
	private disposed = false;
	private initialization: Promise<void> | null = null;
	private readonly responseCookies = new Map<string, Set<string>>();

	constructor(private readonly options: CapacitorHttpSessionOptions) {}

	async request(
		url: string,
		options: HttpSessionRequestOptions = {}
	): Promise<HttpSessionResponse> {
		if (this.disposed) throw new Error('HTTP session has been disposed');
		await this.ensureInitialized();

		const parsedUrl = new URL(url);
		if (parsedUrl.protocol !== 'https:') {
			throw new Error('HTTP session requests must use HTTPS');
		}
		if (!isDomainAllowed(parsedUrl.hostname, this.options.allowedDomains)) {
			throw new Error(`HTTP session request host is not allowed: ${parsedUrl.hostname}`);
		}
		if (options.signal?.aborted) {
			throw new DOMException('The operation was aborted', 'AbortError');
		}

		const requestPromise = CapacitorHttp.request({
			url,
			method: options.method ?? 'GET',
			headers: options.headers,
			data: options.body,
			disableRedirects: options.disableRedirects ?? false,
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
				reject(new DOMException('The operation was aborted due to timeout', 'TimeoutError'));
			options.signal.addEventListener('abort', onAbort, { once: true });
			cancelListener = () => options.signal?.removeEventListener('abort', onAbort);
		});

		try {
			const response = await Promise.race([requestPromise, abortPromise]);
			cancelListener?.();
			const headers: Record<string, string | string[]> = {};
			for (const [key, value] of Object.entries(response.headers ?? {})) {
				headers[key.toLowerCase()] = String(value);
				headers[key] = String(value);
			}
			this.storeResponseCookies(headers, response.url || url);

			return {
				status: response.status,
				headers,
				url: response.url || url,
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
		} catch (error) {
			cancelListener?.();
			throw error;
		}
	}

	async hasCookie(url: string, name: string): Promise<boolean> {
		const parsed = new URL(url.startsWith('http') ? url : `https://${url}/`);
		if (
			parsed.protocol !== 'https:' ||
			!isDomainAllowed(parsed.hostname, this.options.allowedDomains)
		) {
			throw new Error('HTTP session cookie queries must use an allowed HTTPS host');
		}
		const hostname = parsed.hostname.toLowerCase();
		return [...this.responseCookies].some(
			([domain, names]) =>
				(hostname === domain || hostname.endsWith(`.${domain}`)) && names.has(name)
		);
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
				if (value.length > 0 && !/(?:^|;)\s*max-age=0(?:;|$)/i.test(segment)) {
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

export class CapacitorHttpSessionService implements IHostHttpSessionService {
	createSession(options: CapacitorHttpSessionOptions): IHostHttpSession {
		return new CapacitorHttpSession(normalizeOptions(options));
	}
}
