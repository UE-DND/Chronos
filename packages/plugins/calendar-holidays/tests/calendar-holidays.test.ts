import { describe, expect, it, vi } from 'vite-plus/test';
import {
	ChronosEngine,
	createTimetable,
	type HttpResponse,
	type IHttpService
} from '@chronos/core';
import { createMockEnv } from '@chronos/core/test-utils';
import { createHolidayPlugin, HOLIDAY_PLUGIN_ID } from '../src/index';
import { syncHolidayCalendarFromHolidayCn, type HolidayCalendars } from '../src/holiday-sync';

function response(label = '假日'): HttpResponse {
	return {
		ok: true,
		status: 200,
		statusText: 'OK',
		headers: {},
		text: async () => '',
		bytes: async () => new Uint8Array(),
		json: async <T>() =>
			({ year: 2026, papers: [], days: [{ date: '2026-03-02', name: label, isOffDay: true }] }) as T
	};
}
async function harness(
	request: IHttpService['request'] = vi.fn(async () => response()),
	serialized = false
) {
	const mock = createMockEnv({ http: { request } });
	if (serialized) {
		const persisted = new Map<string, string>();
		mock.env.storage.getPluginData = async <T>(id: string, key: string): Promise<T | null> => {
			const value = persisted.get(`${id}:${key}`);
			return value === undefined ? null : JSON.parse(value);
		};
		mock.env.storage.setPluginData = async (id, key, value) => {
			persisted.set(`${id}:${key}`, JSON.stringify(value));
			mock.triggerStorageChange({ type: 'pluginData', key: `${id}:${key}` });
		};
	}

	const timetable = createTimetable({
		id: 't1',
		name: 'T',
		academicConfig: { termStartDate: '2026-03-02', startWeek: 1, endWeek: 2, periodTimes: [] }
	});
	mock.timetables.set(timetable.id, timetable);
	const engine = new ChronosEngine({ env: mock.env });
	await engine.init();
	await engine.switchTimetable(timetable.id);
	await engine.loadPlugin(createHolidayPlugin());
	return { ...mock, engine, timetable, ctx: engine.getPluginContext(HOLIDAY_PLUGIN_ID) };
}
describe('plugin owned holiday calendar', () => {
	it('does not report success after a newer request supersedes its final cache read', async () => {
		const h = await harness();
		const read = h.ctx.storage.get.bind(h.ctx.storage);
		const reading = Promise.withResolvers<void>();
		const finishRead = Promise.withResolvers<void>();
		let reads = 0;
		vi.spyOn(h.ctx.storage, 'get').mockImplementation(async (key) => {
			if (++reads === 3) {
				reading.resolve();
				await finishRead.promise;
			}
			return read(key);
		});
		const old = syncHolidayCalendarFromHolidayCn(h.ctx, { force: true });
		const result = old.then(
			() => 'success',
			(error: unknown) => error
		);
		await reading.promise;
		await syncHolidayCalendarFromHolidayCn(h.ctx, { force: true });
		finishRead.resolve();
		expect(await result).toMatchObject({ name: 'AbortError' });
		h.engine.dispose();
	});
	it('publishes only committed cache, keeps timetable untouched and revokes immediately', async () => {
		const h = await harness();
		const original = structuredClone(h.timetables.get('t1'));
		expect(h.engine.resolveHolidays(h.timetable)).toEqual([]);
		await syncHolidayCalendarFromHolidayCn(h.ctx, { force: true });
		expect(h.engine.resolveHolidays(h.timetable)).toEqual([{ date: '2026-03-02', label: '假日' }]);
		expect(h.timetables.get('t1')).toEqual(original);
		const cache = await h.ctx.storage.get<HolidayCalendars>('calendars');
		expect(cache?.t1?.years['2026']?.source).toBe('remote');
		await h.engine.unloadPlugin(HOLIDAY_PLUGIN_ID);
		expect(h.engine.resolveHolidays(h.timetable)).toEqual([]);
		await h.engine.loadPlugin(createHolidayPlugin());
		expect(h.engine.resolveHolidays(h.timetable)).toEqual([{ date: '2026-03-02', label: '假日' }]);
		h.engine.dispose();
	});
	it('supersedes a hanging request and stops stale results after unloading and reloading', async () => {
		let resolveOld!: (value: HttpResponse) => void;
		const request = vi
			.fn<IHttpService['request']>()
			.mockImplementationOnce(
				() =>
					new Promise((resolve) => {
						resolveOld = resolve;
					})
			)
			.mockResolvedValue(response('新结果'));
		const h = await harness(request);
		const old = syncHolidayCalendarFromHolidayCn(h.ctx, { force: true });
		const oldRejected = expect(old).rejects.toMatchObject({ name: 'AbortError' });
		await vi.waitFor(() => expect(request).toHaveBeenCalledTimes(1));
		await h.engine.unloadPlugin(HOLIDAY_PLUGIN_ID);
		await h.engine.loadPlugin(createHolidayPlugin());
		await syncHolidayCalendarFromHolidayCn(h.engine.getPluginContext(HOLIDAY_PLUGIN_ID), {
			force: true
		});
		resolveOld(response('旧结果'));
		await oldRejected;
		expect(h.engine.resolveHolidays(h.timetable)).toEqual([
			{ date: '2026-03-02', label: '新结果' }
		]);
		h.engine.dispose();
	});
	it('lets later requests win on one timetable while preserving another timetable', async () => {
		let resolveOld!: (value: HttpResponse) => void;
		const request = vi
			.fn<IHttpService['request']>()
			.mockImplementationOnce(
				() =>
					new Promise((resolve) => {
						resolveOld = resolve;
					})
			)
			.mockResolvedValue(response('最新'));
		const h = await harness(request);
		const second = createTimetable({ ...h.timetable, id: 't2' });
		h.timetables.set(second.id, second);
		const old = syncHolidayCalendarFromHolidayCn(h.ctx, { force: true });
		const oldRejected = expect(old).rejects.toMatchObject({ name: 'AbortError' });
		await vi.waitFor(() => expect(request).toHaveBeenCalledTimes(1));
		await syncHolidayCalendarFromHolidayCn(h.ctx, { force: true });
		await h.engine.switchTimetable(second.id);
		await syncHolidayCalendarFromHolidayCn(h.ctx, { force: true });
		resolveOld(response('旧'));
		await oldRejected;
		const cache = await h.ctx.storage.get<HolidayCalendars>('calendars');
		expect(Object.keys(cache!)).toEqual(['t1', 't2']);
		expect(h.engine.resolveHolidays(h.timetable)[0]?.label).toBe('最新');
		h.engine.dispose();
	});
	it('keeps last published holidays when a new save fails', async () => {
		const h = await harness();
		await syncHolidayCalendarFromHolidayCn(h.ctx, { force: true });
		const prior = h.engine.resolveHolidays(h.timetable);
		const update = h.ctx.storage.updateJson.bind(h.ctx.storage);
		let writes = 0;
		vi.spyOn(h.ctx.storage, 'updateJson').mockImplementation((key, change) => {
			if (++writes === 2) return Promise.reject(new Error('disk full'));
			return update(key, change);
		});
		await expect(syncHolidayCalendarFromHolidayCn(h.ctx, { force: true })).rejects.toThrow(
			'disk full'
		);
		expect(h.engine.resolveHolidays(h.timetable)).toEqual(prior);
		h.engine.dispose();
	});
	it('lets a later request in another window win and refreshes both immutable calendar views', async () => {
		const staleResponse = Promise.withResolvers<HttpResponse>();
		let requestSignal: AbortSignal | undefined;
		const request = vi.fn<IHttpService['request']>().mockImplementation((_url, options) => {
			requestSignal = options?.signal;
			return staleResponse.promise;
		});
		const h = await harness(request, true);
		const other = new ChronosEngine({
			env: { ...h.env, http: { request: vi.fn(async () => response('Other window')) } }
		});
		await other.init();
		await other.switchTimetable('t1');
		await other.loadPlugin(createHolidayPlugin());
		const old = syncHolidayCalendarFromHolidayCn(h.ctx, { force: true });
		const rejected = old.then(
			() => null,
			(error: unknown) => error
		);
		await vi.waitFor(() => expect(request).toHaveBeenCalledOnce());
		await syncHolidayCalendarFromHolidayCn(other.getPluginContext(HOLIDAY_PLUGIN_ID), {
			force: true
		});
		await vi.waitFor(() => expect(requestSignal?.aborted).toBe(true));
		staleResponse.resolve(response('Stale'));
		expect(await rejected).toMatchObject({ name: 'AbortError' });
		await vi.waitFor(() =>
			expect(h.engine.resolveHolidays(h.timetable)[0]?.label).toBe('Other window')
		);
		expect(other.resolveHolidays(h.timetable)).toEqual(h.engine.resolveHolidays(h.timetable));
		const cache = await h.ctx.storage.get<HolidayCalendars>('calendars');
		expect(cache?.t1?.years['2026']?.holidays[0]?.label).toBe('Other window');
		expect(Object.isFrozen(h.engine.resolveHolidays(h.timetable)[0])).toBe(true);
		other.dispose();
		h.engine.dispose();
	});

	it('merges concurrent requests for different timetables across windows into latest persisted JSON', async () => {
		const firstResponse = Promise.withResolvers<HttpResponse>();
		const request = vi.fn<IHttpService['request']>().mockReturnValue(firstResponse.promise);
		const h = await harness(request, true);
		const second = createTimetable({ ...h.timetable, id: 't2' });
		h.timetables.set(second.id, second);
		const other = new ChronosEngine({
			env: { ...h.env, http: { request: vi.fn(async () => response('Second timetable')) } }
		});
		await other.init();
		await other.switchTimetable(second.id);
		await other.loadPlugin(createHolidayPlugin());
		const first = syncHolidayCalendarFromHolidayCn(h.ctx, { force: true });
		await vi.waitFor(() => expect(request).toHaveBeenCalledOnce());
		await syncHolidayCalendarFromHolidayCn(other.getPluginContext(HOLIDAY_PLUGIN_ID), {
			force: true
		});
		firstResponse.resolve(response('First timetable'));
		await first;
		const cache = await h.ctx.storage.get<HolidayCalendars>('calendars');
		expect(Object.keys(cache!).sort()).toEqual(['t1', 't2']);
		await vi.waitFor(() =>
			expect(other.resolveHolidays(h.timetable)[0]?.label).toBe('First timetable')
		);
		expect(h.engine.resolveHolidays(second)[0]?.label).toBe('Second timetable');
		other.dispose();
		h.engine.dispose();
	});
});
