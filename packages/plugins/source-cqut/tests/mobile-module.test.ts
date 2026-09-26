import { describe, expect, it, vi } from 'vite-plus/test';

const executeCqutPreview = vi.hoisted(() => vi.fn());

vi.mock('../src/online', () => ({ executeCqutPreview }));

import type { IHostHttpSession, MobilePluginServerContext } from '@chronos/core';
import { mobilePluginServerModule } from '../src/mobile';

describe('CQUT mobile plugin module', () => {
	it('adapts the generic host session to CqutSession and delegates the preview action', async () => {
		const request = vi.fn().mockResolvedValue({ status: 200 });
		const hasCookie = vi.fn().mockResolvedValue(true);
		const dispose = vi.fn().mockResolvedValue(undefined);
		const createHttpSession = vi.fn((): IHostHttpSession => ({ request, hasCookie, dispose }));
		const context: MobilePluginServerContext = { createHttpSession };
		executeCqutPreview.mockImplementation(async (payload, createSession) => {
			const session = await createSession();
			await session.request({
				url: 'https://uis.cqut.edu.cn/login',
				method: 'POST',
				headers: { Accept: 'text/html' },
				body: 'account=20210001',
				disableRedirects: true,
				connectTimeoutMs: 1000,
				readTimeoutMs: 2000
			});
			await session.hasCookie('https://timetable-cfc.cqut.edu.cn', 'JSESSIONID');
			await session.dispose();
			return { ok: true, payload };
		});

		const payload = { account: '20210001', password: 'secret' };
		const result = await mobilePluginServerModule.createHandlers(context).preview!(payload);

		expect(createHttpSession).toHaveBeenCalledOnce();
		expect(request).toHaveBeenCalledWith('https://uis.cqut.edu.cn/login', {
			method: 'POST',
			headers: { Accept: 'text/html' },
			body: 'account=20210001',
			disableRedirects: true,
			connectTimeoutMs: 1000,
			readTimeoutMs: 2000,
			signal: undefined
		});
		expect(hasCookie).toHaveBeenCalledWith('https://timetable-cfc.cqut.edu.cn', 'JSESSIONID');
		expect(dispose).toHaveBeenCalledOnce();
		expect(executeCqutPreview).toHaveBeenCalledWith(payload, expect.any(Function));
		expect(result).toEqual({ ok: true, payload });
	});
});
