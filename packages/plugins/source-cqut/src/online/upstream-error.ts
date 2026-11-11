import { AppError } from '@chronos/core';
import { isCasError } from '@cqut-openproject/cas-sdk';

function getCause(error: unknown): unknown {
	if (error && typeof error === 'object' && 'cause' in error) {
		return (error as { cause?: unknown }).cause;
	}
	return undefined;
}

function getErrorCode(error: unknown): string | undefined {
	if (error && typeof error === 'object' && 'code' in error) {
		const code = (error as { code?: unknown }).code;
		return typeof code === 'string' ? code : undefined;
	}
	return undefined;
}

function isDomAbortOrTimeout(error: unknown): boolean {
	if (error instanceof DOMException) {
		return error.name === 'AbortError' || error.name === 'TimeoutError';
	}
	if (error && typeof error === 'object' && 'name' in error) {
		const name = (error as { name?: unknown }).name;
		return name === 'AbortError' || name === 'TimeoutError';
	}
	return false;
}

const TRANSIENT_NETWORK_CODES = new Set([
	'UND_ERR_CONNECT_TIMEOUT',
	'UND_ERR_SOCKET',
	'UND_ERR_HEADERS_TIMEOUT',
	'UND_ERR_BODY_TIMEOUT',
	'ETIMEDOUT',
	'ECONNRESET',
	'ECONNREFUSED',
	'EHOSTUNREACH',
	'ENETUNREACH',
	'EAI_AGAIN'
]);

const NETWORK_CODES = new Set([
	...TRANSIENT_NETWORK_CODES,
	'ENOTFOUND',
	'ERR_TLS_CERT_ALTNAME_INVALID',
	'CERT_HAS_EXPIRED',
	'UNABLE_TO_VERIFY_LEAF_SIGNATURE',
	'DEPTH_ZERO_SELF_SIGNED_CERT'
]);

export function isKnownNetworkError(error: unknown): boolean {
	if (isDomAbortOrTimeout(error)) return true;
	const code = getErrorCode(error);
	if (code && NETWORK_CODES.has(code)) return true;
	if (error instanceof TypeError) {
		if (
			![
				'fetch failed',
				'Failed to fetch',
				'Network request failed',
				'Load failed',
				'terminated'
			].includes(error.message)
		)
			return false;
		const cause = getCause(error);
		return cause ? isKnownNetworkError(cause) : error.message !== 'terminated';
	}
	return false;
}

export function isTransientNetworkError(error: unknown): boolean {
	if (!isKnownNetworkError(error)) return false;
	if (isDomAbortOrTimeout(error)) {
		const name = (error as { name?: unknown }).name;
		return name === 'TimeoutError';
	}

	const code = getErrorCode(error);
	if (code && TRANSIENT_NETWORK_CODES.has(code)) return true;

	const cause = getCause(error);
	if (cause && isTransientNetworkError(cause)) return true;

	if (error instanceof TypeError && error.message === 'fetch failed' && cause) {
		if (isDomAbortOrTimeout(cause)) {
			const causeName = (cause as { name?: unknown }).name;
			return causeName === 'TimeoutError';
		}
		const causeCode = getErrorCode(cause);
		if (causeCode && TRANSIENT_NETWORK_CODES.has(causeCode)) return true;
	}

	return false;
}

function isTimeoutCode(code: string | undefined): boolean {
	return code === 'ETIMEDOUT' || code === 'UND_ERR_CONNECT_TIMEOUT';
}

function isTimeoutError(error: unknown): boolean {
	if (isDomAbortOrTimeout(error)) return true;

	if (isTimeoutCode(getErrorCode(error))) return true;

	const cause = getCause(error);
	if (cause && isTimeoutError(cause)) return true;

	if (error instanceof TypeError && error.message === 'fetch failed' && cause) {
		if (isDomAbortOrTimeout(cause)) return true;
		if (isTimeoutCode(getErrorCode(cause))) return true;
	}

	return false;
}

export function logUpstreamError(step: string, error: unknown): void {
	const parts = [`step=${step}`];
	const seen = new Set<unknown>();
	for (
		let item = error;
		item && typeof item === 'object' && !seen.has(item);
		item = getCause(item)
	) {
		seen.add(item);
		const record = item as Record<string, unknown>;
		if (typeof record.name === 'string') parts.push(`name=${record.name}`);
		if (typeof record.code === 'string') parts.push(`code=${record.code}`);
		if (typeof record.stack === 'string') {
			const frames = record.stack.split('\n').filter((line) => /^\s+at /.test(line));
			if (frames.length)
				parts.push(frames.join('\n').replace(/https?:\/\/[^\s)]+/g, '[upstream-url]'));
		}
	}

	console.error('[source-cqut]', parts.join(' '));
}

export function toUpstreamNetworkError(
	error: unknown,
	step: string,
	parentSignal?: AbortSignal
): AppError {
	if (isCasError(error)) {
		// The SDK also wraps unknown fetcher exceptions as NETWORK_ERROR.
		const cause = getCause(error);
		if (error.kind === 'NETWORK_ERROR' && cause && !isKnownNetworkError(cause)) throw cause;
		if (!['NETWORK_ERROR', 'TIMEOUT', 'ABORTED', 'UPSTREAM_ERROR'].includes(error.kind))
			throw error;
	} else if (!isKnownNetworkError(error)) {
		throw error;
	}
	logUpstreamError(step, error);

	if (parentSignal?.aborted) {
		return AppError.network(`在线课表导入超时（${step}），请稍后重试`, error);
	}

	if (isTimeoutError(error)) {
		return AppError.network(`${step}超时，请稍后重试`, error);
	}

	return AppError.network(`${step}失败，请稍后重试`, error);
}
