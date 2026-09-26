import { AppError, failure, success, type AppResult } from '@chronos/core';
import {
	createCasClient,
	isCasErrorOfKind,
	type Fetcher,
	type HttpRequest,
	type HttpResponse
} from '@cqut-openproject/cas-sdk';
import {
	CAS_APPLICATION_CODE,
	CONNECT_TIMEOUT_MS,
	REQUEST_TIMEOUT_MS,
	TIMETABLE_BASE_URL,
	TIMETABLE_HOST,
	TIMETABLE_SESSION_COOKIE,
	UIS_BASE_URL
} from './config';
import type { CqutSession } from './cqut-session';
import { requestStep, withNetworkRetry } from './http-client';
import { toUpstreamNetworkError } from './upstream-error';

export interface CasLoginOverrides {
	uisBaseUrl?: string;
	timetableBaseUrl?: string;
	timetableHost?: string;
	applicationCode?: string;
}

function createCasFetcher(session: CqutSession): Fetcher {
	return async (req: HttpRequest): Promise<HttpResponse> => {
		const response = await withNetworkRetry(req.signal, () =>
			session.request({
				url: req.url,
				method: req.method ?? 'GET',
				headers: req.headers,
				body: req.body,
				disableRedirects: true,
				signal: req.signal,
				connectTimeoutMs: CONNECT_TIMEOUT_MS,
				readTimeoutMs: REQUEST_TIMEOUT_MS
			})
		);

		const text = await response.text();
		const bodyStream = new ReadableStream({
			start(controller) {
				controller.enqueue(new TextEncoder().encode(text));
				controller.close();
			}
		});

		const setCookieList =
			response.getSetCookie?.() ??
			(Array.isArray(response.headers['set-cookie'])
				? (response.headers['set-cookie'] as string[])
				: typeof response.headers['set-cookie'] === 'string'
					? [response.headers['set-cookie']]
					: []);

		const casHeaders = {
			...response.headers,
			getSetCookie: () => setCookieList,
			get: (name: string) => {
				const val = response.headers[name.toLowerCase()] ?? response.headers[name];
				return Array.isArray(val) ? val.join(', ') : (val ?? null);
			}
		};

		return {
			status: response.status,
			headers: casHeaders,
			url: response.url,
			body: bodyStream,
			text: async () => text,
			json: async () => response.json()
		} as unknown as HttpResponse;
	};
}

function resolveEndpoints(overrides?: CasLoginOverrides) {
	const timetableBaseUrl = overrides?.timetableBaseUrl ?? TIMETABLE_BASE_URL;
	const uisBaseUrl = overrides?.uisBaseUrl ?? UIS_BASE_URL;
	return {
		uisBaseUrl,
		casApplicationCode: overrides?.applicationCode ?? CAS_APPLICATION_CODE,
		casServiceUrl: `${timetableBaseUrl}/api/auth/casLogin`,
		timetableHost: overrides?.timetableHost ?? TIMETABLE_HOST,
		timetableBaseUrl
	};
}

export async function loginCas(
	session: CqutSession,
	account: string,
	password: string,
	signal?: AbortSignal,
	overrides?: CasLoginOverrides
): Promise<AppResult<void>> {
	const endpoints = resolveEndpoints(overrides);

	const client = createCasClient({
		uisBaseUrl: endpoints.uisBaseUrl,
		applicationCode: endpoints.casApplicationCode,
		cookieJarFactory: () => session.createCasCookieJar(),
		fetcher: createCasFetcher(session)
	});

	const loginResult = await client.safeLogin({
		account,
		password,
		serviceUrl: endpoints.casServiceUrl,
		applicationCode: endpoints.casApplicationCode,
		signal
	});

	if (!loginResult.ok) {
		const err = loginResult.error;
		if (isCasErrorOfKind(err, 'CAPTCHA_REQUIRED')) {
			return failure(AppError.auth('需要验证码，当前版本暂不支持'));
		}
		if (isCasErrorOfKind(err, 'AUTH_FAILED')) {
			return failure(AppError.auth(err.message || '统一身份认证登录失败'));
		}
		if (isCasErrorOfKind(err, 'PROTOCOL_ERROR')) {
			return failure(AppError.auth('登录失败，请重新输入账号或密码'));
		}
		return failure(toUpstreamNetworkError(err, '统一身份认证登录', signal));
	}

	const casSession = loginResult.data;
	if (casSession.kind !== 'ticket') {
		return failure(AppError.auth('登录失败，请重新输入账号或密码'));
	}

	const ticket = casSession.ticket;
	const casLoginUrl = `${endpoints.casServiceUrl}?ticket=${encodeURIComponent(ticket)}`;
	const sessionResponseResult = await requestStep(
		session,
		casLoginUrl,
		{ method: 'GET' },
		{ redirect: 'manual', signal, acceptStatus: (status) => status < 500 },
		'建立课表系统会话'
	);
	if (!sessionResponseResult.ok) return sessionResponseResult;

	const hasTimetableSession =
		(await session.hasCookie(endpoints.timetableBaseUrl, TIMETABLE_SESSION_COOKIE)) ||
		(await session.hasCookie(endpoints.timetableHost, TIMETABLE_SESSION_COOKIE));

	if (!hasTimetableSession) {
		return failure(AppError.auth('登录失败，请重新输入账号或密码'));
	}

	return success(undefined);
}
