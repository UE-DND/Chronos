import type { PluginServerResponse, PluginServerErrorKind, AppError } from '@chronos/core';
import { pluginServerError, pluginServerSuccess } from '@chronos/core';
import type { CqutSession } from './cqut-session';
import {
	fetchCqutSchedule,
	type FetchCqutScheduleInput,
	type FetchCqutScheduleResult
} from './fetch-schedule';

function toWireErrorKind(kind: AppError['kind']): PluginServerErrorKind {
	switch (kind) {
		case 'Security':
		case 'Unknown':
			return 'Upstream';
		default:
			return kind;
	}
}

export interface PreviewRequestBody {
	account?: string;
	password?: string;
}

export interface ExecutePreviewOptions {
	signal?: AbortSignal;
	timeoutMs?: number;
}

export async function executeCqutPreview(
	payload: unknown,
	sessionFactory: () => CqutSession | Promise<CqutSession>,
	fetchSchedule: (
		session: CqutSession,
		input: FetchCqutScheduleInput
	) => Promise<import('@chronos/core').AppResult<FetchCqutScheduleResult>> = fetchCqutSchedule,
	options?: ExecutePreviewOptions
): Promise<PluginServerResponse<FetchCqutScheduleResult>> {
	if (!payload || typeof payload !== 'object' || Array.isArray(payload)) {
		return pluginServerError('DataFormat', '请求格式错误');
	}

	const body = payload as PreviewRequestBody;
	if (
		(body.account !== undefined && typeof body.account !== 'string') ||
		(body.password !== undefined && typeof body.password !== 'string')
	) {
		return pluginServerError('DataFormat', '请求格式错误');
	}
	const account = body.account?.trim() ?? '';
	const password = body.password?.trim() ?? '';
	if (!account || !password) {
		return pluginServerError('Validation', '账号和密码不能为空');
	}

	const session = await sessionFactory();
	try {
		const result = await fetchSchedule(session, {
			account,
			password,
			signal: options?.signal,
			timeoutMs: options?.timeoutMs
		});
		if (result.ok) {
			return pluginServerSuccess(result.value);
		}
		return pluginServerError(toWireErrorKind(result.error.kind), result.error.message);
	} finally {
		await session.dispose().catch(() => {});
	}
}
