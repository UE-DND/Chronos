import type { AppResult } from '@chronos/core';
import type { CqutSession, FetchCqutScheduleInput, FetchCqutScheduleResult } from '../src/online';
import { fetchCqutSchedule as fetchCqutScheduleOnline } from '../src/online';
import { CookieJar } from './cookie-jar';
import { NodeCqutSession } from './node-cqut-session';

export type { FetchCqutScheduleInput, FetchCqutScheduleResult };

export async function fetchCqutSchedule(
	sessionOrInput: CqutSession | CookieJar | FetchCqutScheduleInput,
	maybeInput?: FetchCqutScheduleInput
): Promise<AppResult<FetchCqutScheduleResult>> {
	if (maybeInput) {
		const session =
			sessionOrInput instanceof CookieJar
				? new NodeCqutSession(sessionOrInput)
				: (sessionOrInput as CqutSession);
		return fetchCqutScheduleOnline(session, maybeInput);
	}

	const input = sessionOrInput as FetchCqutScheduleInput;
	const session = new NodeCqutSession();
	try {
		return await fetchCqutScheduleOnline(session, input);
	} finally {
		await session.dispose().catch(() => {});
	}
}
