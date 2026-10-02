import { base } from '$app/paths';
import type {
	HttpDownloadProgress,
	HttpRequestOptions,
	HttpResponse,
	IHttpService
} from '@chronos/core';
import { mergeAbortSignals } from '$lib/utils/abort-signal';
import { deploymentHasServerPlugins } from '$lib/boot/plugin-proxy-meta.generated';

/**
 * Checks whether a given hostname is a private or loopback IP address (anti-SSRF).
 */
function isPrivateOrLoopbackHost(hostname: string): boolean {
	const normalized = hostname.toLowerCase();
	if (
		normalized === 'localhost' ||
		normalized === '127.0.0.1' ||
		normalized === '0.0.0.0' ||
		normalized === '::1' ||
		normalized.endsWith('.local')
	) {
		return true;
	}

	// IPv4 private ranges: 10.0.0.0/8, 172.16.0.0/12, 192.168.0.0/16, 169.254.0.0/16
	const ipv4Match = normalized.match(/^(\d+)\.(\d+)\.(\d+)\.(\d+)$/);
	if (ipv4Match) {
		const [_, a, b] = ipv4Match.map(Number);
		if (a === 10) return true;
		if (a === 172 && b !== undefined && b >= 16 && b <= 31) return true;
		if (a === 192 && b === 168) return true;
		if (a === 169 && b === 254) return true;
		if (a === 127) return true;
	}

	return false;
}

/**
 * Checks if a hostname matches any pattern in the allowed domains whitelist.
 */
function isDomainAllowed(hostname: string, allowedDomains: string[]): boolean {
	if (allowedDomains.length === 0) return true;
	const lowerHost = hostname.toLowerCase();

	return allowedDomains.some((pattern) => {
		const lowerPattern = pattern.toLowerCase();
		if (lowerPattern.startsWith('*.')) {
			const suffix = lowerPattern.slice(1); // e.g. .cqut.edu.cn
			return lowerHost.endsWith(suffix) || lowerHost === lowerPattern.slice(2);
		}
		return lowerHost === lowerPattern;
	});
}

async function readResponseBytes(
	response: Response,
	onProgress?: (progress: HttpDownloadProgress) => void
): Promise<Uint8Array> {
	if (!onProgress || !response.body) {
		const bytes = new Uint8Array(await response.arrayBuffer());
		onProgress?.({ receivedBytes: bytes.length, totalBytes: bytes.length });
		return bytes;
	}
	const length = response.headers.get('Content-Length');
	const encoding = response.headers.get('Content-Encoding')?.trim().toLowerCase();
	const parsedLength = length === null ? undefined : Number(length);
	let totalBytes =
		(!encoding || encoding === 'identity') &&
		parsedLength !== undefined &&
		Number.isSafeInteger(parsedLength) &&
		parsedLength >= 0
			? parsedLength
			: undefined;
	const reader = response.body.getReader();
	const chunks: Uint8Array[] = [];
	let receivedBytes = 0;
	try {
		while (true) {
			const { done, value } = await reader.read();
			if (done) break;
			chunks.push(value);
			receivedBytes += value.length;
			// CORS may hide Content-Encoding, or the server may send an inaccurate length.
			if (totalBytes !== undefined && receivedBytes > totalBytes) totalBytes = undefined;
			onProgress({ receivedBytes, ...(totalBytes === undefined ? {} : { totalBytes }) });
		}
		const bytes = new Uint8Array(receivedBytes);
		let offset = 0;
		for (const chunk of chunks) {
			bytes.set(chunk, offset);
			offset += chunk.length;
		}
		return bytes;
	} catch (error) {
		await reader.cancel().catch(() => {});
		throw error;
	} finally {
		reader.releaseLock();
	}
}

/**
 * WebHttpProxyProvider implements IHttpService for Web environments.
 * It manages direct fetches, CORS bypass proxy routing with whitelist validation,
 * anti-SSRF protections, and static deployment fallbacks.
 */
export class WebHttpProxyProvider implements IHttpService {
	private allowedDomains: string[];

	constructor(allowedDomains: string[] = []) {
		this.allowedDomains = allowedDomains;
	}

	async request(url: string, options?: HttpRequestOptions): Promise<HttpResponse> {
		const controller = options?.timeoutMs ? new AbortController() : undefined;
		const timeoutId =
			options?.timeoutMs && controller
				? setTimeout(
						() => controller.abort(new DOMException('Request timed out', 'TimeoutError')),
						options.timeoutMs
					)
				: undefined;
		const finishRequest = () => {
			if (timeoutId !== undefined) clearTimeout(timeoutId);
			mergedSignal?.dispose();
		};
		const abortSignals = [options?.signal, controller?.signal].filter(
			(signal): signal is AbortSignal => signal !== undefined
		);
		const mergedSignal = abortSignals.length > 0 ? mergeAbortSignals(abortSignals) : undefined;
		const requestSignal = mergedSignal?.signal;

		try {
			if (options?.bypassCors && !deploymentHasServerPlugins()) {
				throw new Error('Server-side proxy is not available in this build');
			}

			// Validate URL and security constraints if bypassCors is requested
			if (options?.bypassCors) {
				try {
					const parsedUrl = new URL(url);
					if (isPrivateOrLoopbackHost(parsedUrl.hostname)) {
						throw new Error(
							`SSRF Protection: Requests to private host "${parsedUrl.hostname}" are forbidden.`
						);
					}
					if (!isDomainAllowed(parsedUrl.hostname, this.allowedDomains)) {
						throw new Error(
							`Domain "${parsedUrl.hostname}" is not in the allowed proxy whitelist.`
						);
					}
				} catch (err: unknown) {
					if (
						err instanceof Error &&
						(err.message.startsWith('SSRF') || err.message.startsWith('Domain'))
					) {
						throw err;
					}
					// If not a full URL, continue
				}
			}

			const headers = new Headers(options?.headers);

			let body: BodyInit | undefined;
			if (options?.body) {
				if (typeof options.body === 'string') {
					body = options.body;
				} else {
					body = options.body as unknown as Uint8Array<ArrayBuffer>;
				}
			}

			let requestUrl = url;
			if (base && url.startsWith('/official-plugins/')) requestUrl = `${base}${url}`;
			else if (base && typeof window !== 'undefined') {
				const parsed = new URL(url, window.location.origin);
				if (
					parsed.origin === window.location.origin &&
					parsed.pathname.startsWith('/official-plugins/')
				) {
					parsed.pathname = `${base}${parsed.pathname}`;
					requestUrl = parsed.href;
				}
			}
			const response = await fetch(requestUrl, {
				method: options?.method ?? 'GET',
				headers,
				body,
				cache: options?.cache,
				signal: requestSignal
			});

			const responseHeaders: Record<string, string> = {};
			response.headers.forEach((val, key) => {
				responseHeaders[key] = val;
			});
			if (!response.body) finishRequest();
			// fetch resolves at headers; the same deadline must also cover body consumption.
			const consume = async <T>(read: () => Promise<T>): Promise<T> => {
				try {
					requestSignal?.throwIfAborted();
					return await read();
				} catch (error) {
					// Browsers may reject a timed-out body with AbortError; preserve the cause.
					throw requestSignal?.aborted ? requestSignal.reason : error;
				} finally {
					finishRequest();
				}
			};

			return {
				status: response.status,
				statusText: response.statusText,
				headers: responseHeaders,
				ok: response.ok,
				text: () => consume(() => response.text()),
				json: <T = unknown>() => consume(() => response.json() as Promise<T>),
				bytes: (onProgress) => consume(() => readResponseBytes(response, onProgress))
			};
		} catch (error) {
			finishRequest();
			throw requestSignal?.aborted ? requestSignal.reason : error;
		}
	}
}
