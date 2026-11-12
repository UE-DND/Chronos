import { afterEach, describe, expect, it, vi } from 'vite-plus/test';
import { executeCqutPreview } from '../src/online/execute-preview';
import {
	CAS_APPLICATION_CODE,
	GET_CAMPUS_TIME_INFO_URL,
	GET_USER_INFO_URL,
	TIMETABLE_BASE_URL,
	TIMETABLE_SESSION_COOKIE,
	UIS_BASE_URL,
	WEEK_EVENTS_URL
} from '../src/online/config';
import { FetchCqutSession } from './fetch-cqut-session';

afterEach(() => vi.unstubAllGlobals());

describe('CQUT import through native fetch', () => {
	it('authenticates against a fake upstream, imports campus periods and both weeks, then clears the session', async () => {
		const requests: Array<{ url: string; method: string; cookie: string | null }> = [];
		const responses: Response[] = [];
		const casLoginPath = `/center-auth-server/${CAS_APPLICATION_CODE}/cas/login`;
		const ticket = 'ST-fake-test-ticket';
		const session = new FetchCqutSession();
		const fetcher = vi.fn<typeof fetch>().mockImplementation(async (input, init) => {
			const url = new URL(input instanceof Request ? input.url : input);
			const method = init?.method ?? 'GET';
			const cookie = new Headers(init?.headers).get('cookie');
			requests.push({ url: url.href, method, cookie });
			let response: Response;
			if (url.origin === UIS_BASE_URL && url.pathname === casLoginPath) {
				response = cookie?.includes('auth_server_token=uis-test-token')
					? new Response(null, {
							status: 302,
							headers: {
								location: `${TIMETABLE_BASE_URL}/api/auth/casLogin?ticket=${ticket}`
							}
						})
					: new Response('<html><form id="casLoginForm"></form></html>');
			} else if (
				url.origin === UIS_BASE_URL &&
				url.pathname === '/center-auth-server/sso/doLogin' &&
				method === 'POST'
			) {
				const headers = new Headers({ 'content-type': 'application/json' });
				headers.append('set-cookie', 'auth_server_token=uis-test-token; Path=/; HttpOnly');
				headers.append('set-cookie', 'uis_test_extra=second-cookie; Path=/');
				response = new Response(JSON.stringify({ code: 200, msg: '登录成功' }), { headers });
			} else if (
				url.origin === TIMETABLE_BASE_URL &&
				url.pathname === '/api/auth/casLogin' &&
				url.searchParams.get('ticket') === ticket
			) {
				expect(cookie).toBeNull();
				response = new Response(null, {
					status: 302,
					headers: {
						'set-cookie': `${TIMETABLE_SESSION_COOKIE}=timetable-test-session; Path=/; HttpOnly`,
						location: `${TIMETABLE_BASE_URL}/`
					}
				});
			} else {
				expect(cookie).toBe(`${TIMETABLE_SESSION_COOKIE}=timetable-test-session`);
				expect(method).toBe('POST');
				if (typeof init?.body !== 'string') throw new Error('Expected JSON request body');
				if (url.href === GET_USER_INFO_URL) {
					response = Response.json({
						data: { userCustomSetting: { campusName: '花溪校区' } }
					});
				} else if (url.href === GET_CAMPUS_TIME_INFO_URL) {
					const { campusName } = JSON.parse(init.body) as { campusName: string };
					response = Response.json([
						{ campusName, sessionNum: 2, startTime: '09:25', endTime: '10:10' },
						{ campusName, sessionNum: 1, startTime: '08:30', endTime: '09:15' }
					]);
				} else if (url.href === WEEK_EVENTS_URL) {
					const body = JSON.parse(init.body) as { userID: string; weekNum?: string };
					expect(body.userID).toBe('fake-test-student');
					const week = body.weekNum ?? '1';
					response = Response.json({
						yearTerm: '2026-1',
						weekNum: week,
						weekList: ['1', '2'],
						eventList: [
							{
								weekNum: week,
								weekDay: '1',
								weekList: [week],
								sessionList: ['1', '2'],
								sessionStart: '1',
								sessionLast: '2',
								eventName: '假上游测试课程',
								address: '测试教室',
								memberName: '测试教师'
							}
						]
					});
				} else {
					throw new Error(`Unexpected fake upstream request: ${url.pathname}`);
				}
			}
			responses.push(response);
			return response;
		});
		vi.stubGlobal('fetch', fetcher);

		const result = await executeCqutPreview(
			{ account: 'fake-test-student', password: 'fake-test-password' },
			() => session
		);

		expect(result).toMatchObject({
			ok: true,
			payload: {
				campusId: 'huaxi',
				payload: {
					yearTerm: '2026-1',
					weekList: ['1', '2'],
					eventList: [{ eventName: '假上游测试课程', weekList: ['1', '2'] }]
				},
				campusPeriodTimes: {
					huaxi: [
						{ index: 1, startTime: '08:30', endTime: '09:15' },
						{ index: 2, startTime: '09:25', endTime: '10:10' }
					],
					liangjiang: [
						{ index: 1, startTime: '08:30', endTime: '09:15' },
						{ index: 2, startTime: '09:25', endTime: '10:10' }
					]
				}
			}
		});
		expect(requests.map(({ method, url }) => `${method} ${new URL(url).pathname}`)).toEqual([
			`GET ${casLoginPath}`,
			'POST /center-auth-server/sso/doLogin',
			`GET ${casLoginPath}`,
			'GET /api/auth/casLogin',
			'POST /api/courseSchedule/getUserInfo',
			'POST /api/courseSchedule/getCampusTimeInfo',
			'POST /api/courseSchedule/getCampusTimeInfo',
			'POST /api/courseSchedule/listWeekEvents',
			'POST /api/courseSchedule/listWeekEvents'
		]);
		expect(requests[2]?.cookie).toContain('uis_test_extra=second-cookie');
		expect(responses.every((response) => response.body === null || response.bodyUsed)).toBe(true);
		expect(await session.hasCookie(TIMETABLE_BASE_URL, TIMETABLE_SESSION_COOKIE)).toBe(false);
		expect(await session.hasCookie(UIS_BASE_URL, 'auth_server_token')).toBe(false);
	});
});
