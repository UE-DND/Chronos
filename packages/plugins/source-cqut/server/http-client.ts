import type { AppResult } from '@chronos/core';
import type { HttpRequestOptions } from '../src/online/http-client';
import { requestStep as requestStepOnline, withNetworkRetry } from '../src/online/http-client';
import type { CqutResponse, CqutSession } from '../src/online/cqut-session';
import { CookieJar } from './cookie-jar';
import { NodeCqutSession } from './node-cqut-session';

export type { HttpRequestOptions };
export { withNetworkRetry };

export async function requestStep(
	jarOrSession: CookieJar | CqutSession,
	url: string,
	init: RequestInit | { method?: string; headers?: Record<string, string>; body?: string },
	options: HttpRequestOptions,
	step: string
): Promise<AppResult<CqutResponse>> {
	const session =
		jarOrSession instanceof CookieJar ? new NodeCqutSession(jarOrSession) : jarOrSession;
	const headers = init.headers
		? init.headers instanceof Headers
			? Object.fromEntries(init.headers.entries())
			: Array.isArray(init.headers)
				? Object.fromEntries(init.headers)
				: (init.headers as Record<string, string>)
		: undefined;

	return requestStepOnline(
		session,
		url,
		{
			method: init.method,
			headers,
			body: typeof init.body === 'string' ? init.body : undefined
		},
		options,
		step
	);
}
