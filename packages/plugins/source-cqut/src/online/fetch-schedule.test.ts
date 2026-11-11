import { afterEach, describe, expect, it, vi } from 'vite-plus/test';
import { success } from '@chronos/core';
import { fetchCqutSchedule } from './fetch-schedule';
import { onlineSchedulePayloadSchema } from './online-schedule-schema';
import type { CqutSession } from './cqut-session';

vi.mock('./cas-auth', () => ({ loginCas: async () => success(undefined) }));
vi.mock('./fetch-campus-time', () => ({
	fetchCampusTimesForImport: async () =>
		success({ campusId: 'huaxi', campusPeriodTimes: { huaxi: [], liangjiang: [] } })
}));

afterEach(() => vi.restoreAllMocks());

function session(body: string): CqutSession {
	return {
		request: vi.fn().mockResolvedValue({ status: 200, text: async () => body }),
		createCasCookieJar: vi.fn(),
		hasCookie: vi.fn(),
		dispose: vi.fn()
	};
}

const input = { account: 'student', password: 'secret' };

describe('online schedule error boundary', () => {
	it('returns a data-format failure for malformed JSON and schema violations', async () => {
		for (const body of ['{', '{"weekDayList":42}']) {
			expect(await fetchCqutSchedule(session(body), input)).toMatchObject({
				ok: false,
				error: { kind: 'DataFormat' }
			});
		}
	});

	it('propagates a parser bug instead of telling the user the network failed', async () => {
		const error = new TypeError('parser implementation failed');
		vi.spyOn(onlineSchedulePayloadSchema, 'parse').mockImplementation(() => {
			throw error;
		});
		await expect(fetchCqutSchedule(session('{}'), input)).rejects.toBe(error);
	});

	it('propagates response-reader bugs unchanged', async () => {
		const error = new TypeError('reader implementation failed');
		const current = session('{}');
		vi.spyOn(current, 'request').mockResolvedValue({
			status: 200,
			text: async () => {
				throw error;
			}
		} as never);
		await expect(fetchCqutSchedule(current, input)).rejects.toBe(error);
	});
});
