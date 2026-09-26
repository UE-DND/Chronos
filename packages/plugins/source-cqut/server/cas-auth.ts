import type { AppResult } from '@chronos/core';
import type { CasLoginOverrides, CqutSession } from '../src/online';
import { loginCas as loginCasOnline } from '../src/online';
import { CookieJar } from './cookie-jar';
import { NodeCqutSession } from './node-cqut-session';

export type { CasLoginOverrides };

export async function loginCas(
	jarOrSession: CookieJar | CqutSession,
	account: string,
	password: string,
	signal?: AbortSignal,
	overrides?: CasLoginOverrides
): Promise<AppResult<void>> {
	const session =
		jarOrSession instanceof CookieJar ? new NodeCqutSession(jarOrSession) : jarOrSession;
	return loginCasOnline(session, account, password, signal, overrides);
}
