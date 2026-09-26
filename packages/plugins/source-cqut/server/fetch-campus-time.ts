import type { AppResult, PeriodTime } from '@chronos/core';
import type { CqutCampusId } from '../src/campus-period-times';
import type { CampusTimeFetchOverrides, CampusTimesForImport, CqutSession } from '../src/online';
import {
	fetchCampusTimeInfo as fetchCampusTimeInfoOnline,
	fetchCampusTimesForImport as fetchCampusTimesForImportOnline,
	fetchUserCampusName as fetchUserCampusNameOnline
} from '../src/online';
import { CookieJar } from './cookie-jar';
import { NodeCqutSession } from './node-cqut-session';

export type { CampusTimeFetchOverrides, CampusTimesForImport };

export async function fetchUserCampusName(
	jarOrSession: CookieJar | CqutSession,
	signal?: AbortSignal,
	overrides?: CampusTimeFetchOverrides
): Promise<AppResult<CqutCampusId>> {
	const session =
		jarOrSession instanceof CookieJar ? new NodeCqutSession(jarOrSession) : jarOrSession;
	return fetchUserCampusNameOnline(session, signal, overrides);
}

export async function fetchCampusTimeInfo(
	jarOrSession: CookieJar | CqutSession,
	campusId: CqutCampusId,
	signal?: AbortSignal,
	overrides?: CampusTimeFetchOverrides
): Promise<AppResult<PeriodTime[]>> {
	const session =
		jarOrSession instanceof CookieJar ? new NodeCqutSession(jarOrSession) : jarOrSession;
	return fetchCampusTimeInfoOnline(session, campusId, signal, overrides);
}

export async function fetchCampusTimesForImport(
	jarOrSession: CookieJar | CqutSession,
	signal?: AbortSignal
): Promise<AppResult<CampusTimesForImport>> {
	const session =
		jarOrSession instanceof CookieJar ? new NodeCqutSession(jarOrSession) : jarOrSession;
	return fetchCampusTimesForImportOnline(session, signal);
}
