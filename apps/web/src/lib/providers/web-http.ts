import { resolve } from '$app/paths';

import { belongsToDomain } from '@chronos/core';
import type {
	HttpDownloadProgress,
	HttpRequestOptions,
	HttpResponse,
	IHttpService
} from '@chronos/core';
import { mergeAbortSignals } from '#lib/utils/abort-signal.ts';
import { deploymentHasServerPlugins } from '#lib/boot/plugin-proxy-meta.generated.ts';

const base = resolve('').replace(/\/$/, '');

function parseIpv4(value: string): number[] | undefined {
	const match = /^(\d{1,3})\.(\d{1,3})\.(\d{1,3})\.(\d{1,3})$/.exec(value);
	if (!match) return undefined;
	const octets = match.slice(1).map(Number);
	return octets.every((octet) => octet <= 255) ? octets : undefined;
}

function isPrivateIpv4([first = 0, second = 0]: readonly number[]): boolean {
	if (first === 0 || first === 10 || first === 127) return true;
	if (first === 100 && second >= 64 && second <= 127) return true;
	if (first === 169 && second === 254) return true;
	if (first === 172 && second >= 16 && second <= 31) return true;
	if (first === 192 && second === 168) return true;
	return first === 198 && (second === 18 || second === 19);
}

/** Parse an IPv6 literal (optionally with an IPv4 tail) into eight hextets. */
function parseIpv6(value: string): number[] | undefined {
	const input = value.split('%')[0]?.toLowerCase() ?? '';
	const halves = input.split('::');
	if (halves.length > 2) return undefined;
	const parsePart = (part: string | undefined): number[] | undefined => {
		if (!part) return [];
		const words: number[] = [];
		const segments = part.split(':');
		for (const [index, segment] of segments.entries()) {
			if (segment.includes('.')) {
				if (index !== segments.length - 1) return undefined;
				const ipv4 = parseIpv4(segment);
				if (!ipv4) return undefined;
				words.push((ipv4[0]! << 8) | ipv4[1]!, (ipv4[2]! << 8) | ipv4[3]!);
				continue;
			}
			if (!/^[0-9a-f]{1,4}$/.test(segment)) return undefined;
			words.push(Number.parseInt(segment, 16));
		}
		return words;
	};
	const head = parsePart(halves[0]);
	const tail = halves.length === 2 ? parsePart(halves[1]) : [];
	if (!head || !tail) return undefined;
	if (halves.length === 1) return head.length === 8 ? head : undefined;
	const missing = 8 - head.length - tail.length;
	if (missing < 1) return undefined;
	return [...head, ...Array<number>(missing).fill(0), ...tail];
}

function ipv4FromWords(high = 0, low = 0): number[] {
	return [high >> 8, high & 0xff, low >> 8, low & 0xff];
}

function isPrivateIpv6(value: string): boolean {
	const words = parseIpv6(value);
	if (!words) return false;
	const first = words[0] ?? 0;
	const low = words[7] ?? 0;
	if (words.slice(0, 7).every((word) => word === 0) && (low === 0 || low === 1)) {
		return true;
	}
	if (words.slice(0, 5).every((word) => word === 0) && words[5] === 0xffff) {
		return isPrivateIpv4(ipv4FromWords(words[6] ?? 0, low));
	}
	if (words.slice(0, 6).every((word) => word === 0)) {
		return isPrivateIpv4(ipv4FromWords(words[6] ?? 0, low));
	}
	return (
		(first >= 0xfc00 && first <= 0xfdff) ||
		(first >= 0xfe80 && first <= 0xfebf) ||
		(first >= 0xfec0 && first <= 0xfeff) ||
		(first >= 0xff00 && first <= 0xffff)
	);
}

/**
 * Checks whether a given hostname is a private or loopback address (anti-SSRF).
 */
function isPrivateOrLoopbackHost(hostname: string): boolean {
	const normalized = hostname.toLowerCase();
	const host =
		normalized.startsWith('[') && normalized.endsWith(']') ? normalized.slice(1, -1) : normalized;
	if (host === 'localhost' || host.endsWith('.localhost') || host.endsWith('.local')) {
		return true;
	}
	const ipv4 = parseIpv4(host);
	return ipv4 ? isPrivateIpv4(ipv4) : isPrivateIpv6(host);
}

/**
 * Checks if a hostname matches the deployment allowlist.
 * An empty list means no deployment-level restriction.
 */
function isDomainAllowed(hostname: string, allowedDomains: readonly string[]): boolean {
	return allowedDomains.length === 0 || belongsToDomain(hostname, allowedDomains);
}

function assertProxyDestinationAllowed(url: string, allowedDomains: readonly string[]): void {
	let parsed: URL;
	try {
		parsed = new URL(url);
	} catch {
		// Relative requests use the host's own routes.
		return;
	}
	if (isPrivateOrLoopbackHost(parsed.hostname)) {
		throw new Error(
			`SSRF Protection: Requests to private host "${parsed.hostname}" are forbidden.`
		);
	}
	if (!isDomainAllowed(parsed.hostname, allowedDomains)) {
		throw new Error(`Domain "${parsed.hostname}" is not in the allowed proxy whitelist.`);
	}
}

function resolveRequestUrl(url: string): string {
	if (!base) return url;
	if (url.startsWith('/official-plugins/')) return `${base}${url}`;
	if (typeof window === 'undefined') return url;
	const documentUrl = window.location.href || window.location.origin;
	const documentOrigin = new URL(documentUrl).origin;
	const parsed = new URL(url, documentUrl);
	if (parsed.origin === documentOrigin && parsed.pathname.startsWith('/official-plugins/')) {
		parsed.pathname = `${base}${parsed.pathname}`;
		return parsed.href;
	}
	return url;
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

			if (options?.bypassCors) assertProxyDestinationAllowed(url, this.allowedDomains);

			const headers = new Headers(options?.headers);

			let body: BodyInit | undefined;
			if (options?.body) {
				if (typeof options.body === 'string') {
					body = options.body;
				} else {
					body = options.body as unknown as Uint8Array<ArrayBuffer>;
				}
			}

			const response = await fetch(resolveRequestUrl(url), {
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
