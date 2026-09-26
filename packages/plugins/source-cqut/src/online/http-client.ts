import { AppError, failure, success, type AppResult } from '@chronos/core';
import {
	CONNECT_TIMEOUT_MS,
	HTTP_RETRY_DELAY_MS,
	NETWORK_RETRY_COUNT,
	REQUEST_TIMEOUT_MS
} from './config';
import type { CqutRequest, CqutResponse, CqutSession } from './cqut-session';
import { isTransientNetworkError, toUpstreamNetworkError } from './upstream-error';

export interface HttpRequestOptions {
	redirect?: RequestRedirect;
	signal?: AbortSignal;
	retryOnServerError?: boolean;
	acceptStatus?: (status: number) => boolean;
}

function sleep(ms: number): Promise<void> {
	return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function withNetworkRetry<T>(
	signal: AbortSignal | undefined,
	executeOnce: () => Promise<T>
): Promise<T> {
	let lastError: unknown;
	for (let attempt = 1; attempt <= NETWORK_RETRY_COUNT; attempt++) {
		try {
			return await executeOnce();
		} catch (error) {
			lastError = error;
			if (signal?.aborted || attempt >= NETWORK_RETRY_COUNT || !isTransientNetworkError(error)) {
				throw error;
			}
			await sleep(HTTP_RETRY_DELAY_MS);
		}
	}
	throw lastError;
}

function mergeSignals(signals: AbortSignal[]): AbortSignal {
	if (signals.length === 1) return signals[0]!;
	const controller = new AbortController();
	for (const signal of signals) {
		if (signal.aborted) {
			controller.abort(signal.reason);
			return controller.signal;
		}
		signal.addEventListener('abort', () => controller.abort(signal.reason), { once: true });
	}
	return controller.signal;
}

export async function requestStep(
	session: CqutSession,
	url: string,
	init: { method?: string; headers?: Record<string, string>; body?: string },
	options: HttpRequestOptions,
	step: string
): Promise<AppResult<CqutResponse>> {
	const timeoutSignal = AbortSignal.timeout(REQUEST_TIMEOUT_MS);
	const signal = options.signal ? mergeSignals([options.signal, timeoutSignal]) : timeoutSignal;

	const executeOnce = async (): Promise<CqutResponse> => {
		const req: CqutRequest = {
			url,
			method: init.method,
			headers: init.headers,
			body: init.body,
			disableRedirects: options.redirect === 'manual',
			connectTimeoutMs: CONNECT_TIMEOUT_MS,
			readTimeoutMs: REQUEST_TIMEOUT_MS,
			signal
		};
		return session.request(req);
	};

	try {
		let response: CqutResponse;
		if (!options.retryOnServerError) {
			response = await withNetworkRetry(signal, executeOnce);
		} else {
			try {
				response = await withNetworkRetry(signal, executeOnce);
				if (response.status >= 500) {
					await sleep(HTTP_RETRY_DELAY_MS);
					response = await withNetworkRetry(signal, executeOnce);
				}
			} catch (error) {
				if (signal.aborted) throw error;
				await sleep(HTTP_RETRY_DELAY_MS);
				response = await withNetworkRetry(signal, executeOnce);
			}
		}

		const acceptable =
			options.acceptStatus?.(response.status) ?? (response.status >= 200 && response.status < 300);
		if (!acceptable) {
			return failure(AppError.network(`${step}失败：HTTP ${response.status}`));
		}
		return success(response);
	} catch (error) {
		return failure(toUpstreamNetworkError(error, step, options.signal));
	}
}
