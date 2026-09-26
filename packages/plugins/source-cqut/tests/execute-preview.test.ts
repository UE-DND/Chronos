import { describe, expect, it, vi } from 'vite-plus/test';
import { AppError, failure, success } from '@chronos/core';
import type { CqutSession } from '../src/online/cqut-session';
import { executeCqutPreview } from '../src/online/execute-preview';
import type { FetchCqutScheduleResult } from '../src/online/fetch-schedule';

describe('executeCqutPreview', () => {
	it('returns DataFormat error when payload is not an object', async () => {
		const sessionFactory = vi.fn();
		const result = await executeCqutPreview('not-an-object', sessionFactory);
		expect(result).toEqual({
			ok: false,
			error: { kind: 'DataFormat', message: '请求格式错误' }
		});
		expect(sessionFactory).not.toHaveBeenCalled();
	});

	it('returns DataFormat error when credential fields are not strings', async () => {
		const sessionFactory = vi.fn();
		const result = await executeCqutPreview(
			{ account: 20210001, password: { value: 'secret' } },
			sessionFactory
		);
		expect(result).toEqual({
			ok: false,
			error: { kind: 'DataFormat', message: '请求格式错误' }
		});
		expect(sessionFactory).not.toHaveBeenCalled();
	});

	it('returns Validation error when account or password is missing', async () => {
		const sessionFactory = vi.fn();
		const result = await executeCqutPreview({ account: '  ', password: '' }, sessionFactory);
		expect(result).toEqual({
			ok: false,
			error: { kind: 'Validation', message: '账号和密码不能为空' }
		});
		expect(sessionFactory).not.toHaveBeenCalled();
	});

	it('disposes session and returns mapped error on schedule fetch failure', async () => {
		const disposeMock = vi.fn().mockResolvedValue(undefined);
		const mockSession: CqutSession = {
			request: vi.fn(),
			createCasCookieJar: vi.fn(),
			hasCookie: vi.fn(),
			dispose: disposeMock
		};
		const sessionFactory = vi.fn().mockResolvedValue(mockSession);
		const mockFetch = vi.fn().mockResolvedValue(failure(AppError.auth('统一身份认证登录失败')));

		const result = await executeCqutPreview(
			{ account: '20210001', password: 'secret-password' },
			sessionFactory,
			mockFetch
		);

		expect(result).toEqual({
			ok: false,
			error: { kind: 'Auth', message: '统一身份认证登录失败' }
		});
		expect(disposeMock).toHaveBeenCalledTimes(1);
	});

	it('disposes session and returns success payload on schedule fetch success', async () => {
		const disposeMock = vi.fn().mockResolvedValue(undefined);
		const mockSession: CqutSession = {
			request: vi.fn(),
			createCasCookieJar: vi.fn(),
			hasCookie: vi.fn(),
			dispose: disposeMock
		};
		const sessionFactory = vi.fn().mockResolvedValue(mockSession);
		const payload: FetchCqutScheduleResult = {
			payload: {
				yearTerm: '2025-1',
				weekNum: '1',
				nowMonth: '9',
				importSource: 'online',
				termStartDate: null,
				yearTermList: [],
				weekList: [],
				weekDayList: [],
				eventList: []
			},
			campusId: 'huaxi',
			campusPeriodTimes: { huaxi: [], liangjiang: [] }
		};
		const mockFetch = vi.fn().mockResolvedValue(success(payload));

		const result = await executeCqutPreview(
			{ account: '20210001', password: 'secret-password' },
			sessionFactory,
			mockFetch
		);

		expect(result).toEqual({
			ok: true,
			payload
		});
		expect(disposeMock).toHaveBeenCalledTimes(1);
	});

	it('forwards signal and timeoutMs to fetchSchedule and disposes session on error', async () => {
		const disposeMock = vi.fn().mockResolvedValue(undefined);
		const mockSession: CqutSession = {
			request: vi.fn(),
			createCasCookieJar: vi.fn(),
			hasCookie: vi.fn(),
			dispose: disposeMock
		};
		const sessionFactory = vi.fn().mockResolvedValue(mockSession);
		const mockFetch = vi
			.fn()
			.mockResolvedValue(failure(AppError.network('Request cancelled by user')));
		const controller = new AbortController();

		const result = await executeCqutPreview(
			{ account: '20210001', password: 'secret-password' },
			sessionFactory,
			mockFetch,
			{ signal: controller.signal, timeoutMs: 3000 }
		);

		expect(mockFetch).toHaveBeenCalledWith(mockSession, {
			account: '20210001',
			password: 'secret-password',
			signal: controller.signal,
			timeoutMs: 3000
		});
		expect(result).toEqual({
			ok: false,
			error: { kind: 'Network', message: 'Request cancelled by user' }
		});
		expect(disposeMock).toHaveBeenCalledTimes(1);
	});
});
