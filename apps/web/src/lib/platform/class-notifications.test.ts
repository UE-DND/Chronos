import { afterEach, describe, expect, it, vi } from 'vite-plus/test';
import { ChronosEngine, createCourse, createTimetable } from '@chronos/core';
import { createMockEnv } from '@chronos/core/test-utils';
vi.mock('#lib/i18n/host-i18n.svelte.ts', async () => {
	const { zhCn } = await import('../i18n/host-messages/zh-cn');
	return {
		hostT: (key: keyof typeof zhCn, params: Record<string, string> = {}) =>
			zhCn[key].replace(/\{(\w+)\}/g, (_, name: string) => params[name] ?? '')
	};
});
import { createClassNotificationsController } from './class-notifications.svelte';
import type { ClassNotificationAdapter, ClassNotificationStatus } from './host-platform';
const cleanups: Array<() => void> = [];
afterEach(() => {
	cleanups.splice(0).forEach((fn) => fn());
});
async function harness(waitForPlugins?: () => Promise<void>) {
	const { env, timetables } = createMockEnv();
	const engine = new ChronosEngine({ env });
	await engine.init();
	let status: ClassNotificationStatus = { supported: true, permission: 'granted', exact: true };
	const adapter: ClassNotificationAdapter = {
		background: true,
		getStatus: vi.fn(async () => status),
		requestPermission: vi.fn(async () => status),
		openSettings: vi.fn(async () => {}),
		replacePlan: vi.fn(async () => {}),
		sendTest: vi.fn(async () => {}),
		clearData: vi.fn(async () => {}),
		dispose: vi.fn()
	};
	const controller = createClassNotificationsController(engine, adapter, waitForPlugins);
	cleanups.push(() => {
		controller.dispose();
		engine.dispose();
	});
	return {
		controller,
		engine,
		timetables,
		adapter,
		status: (next: ClassNotificationStatus) => {
			status = next;
		}
	};
}
describe('class notification controller', () => {
	it('rebuilds only the active timetable when its lead time or selection changes', async () => {
		const h = await harness();
		const main = createTimetable({
			id: 'main',
			name: 'Main',
			academicConfig: {
				termStartDate: '2099-03-02',
				startWeek: 1,
				endWeek: 1,
				periodTimes: [
					{ index: 1, startTime: '08:00', endTime: '08:45' },
					{ index: 2, startTime: '08:55', endTime: '09:40' }
				]
			},
			courses: [
				createCourse({
					id: 'math',
					name: 'Math',
					teacher: 'Teacher',
					location: 'Room 1',
					dayOfWeek: 1,
					startPeriod: 1,
					endPeriod: 2
				}),
				createCourse({ id: 'physics', name: 'Physics', dayOfWeek: 1, startPeriod: 1, endPeriod: 1 })
			]
		});
		h.timetables.set(main.id, main);
		const other = createTimetable({ ...main, id: 'other', name: 'Other' });
		h.timetables.set(other.id, other);
		await h.engine.switchTimetable(main.id);
		await h.controller.setEnabled(true);
		const original = vi.mocked(h.adapter.replacePlan).mock.calls.at(-1)![0];
		expect(original).toHaveLength(1);
		expect(original[0]!.courses[0]!.key).toContain('main');
		expect(original[0]!.body).toBe('Math · 08:00–09:40\nRoom 1 · Teacher\nPhysics · 08:00–08:45');
		await h.engine.updatePreferences({ prepareReminderMinutes: 5 });
		await h.controller.sync();
		expect(
			vi.mocked(h.adapter.replacePlan).mock.calls.at(-1)![0][0]!.notifyAt - original[0]!.notifyAt
		).toBe(25 * 60_000);
		await h.engine.switchTimetable('other');
		await h.controller.sync();
		expect(vi.mocked(h.adapter.replacePlan).mock.calls.at(-1)![0][0]!.courses[0]!.key).toContain(
			'other'
		);
		h.controller.start();
		const dateIso = vi.mocked(h.adapter.replacePlan).mock.calls.at(-1)![0][0]!.dateIso;
		const calendar = h.engine.slots.register('calendar.holidays', {
			id: 'test-holiday',
			getHolidays: () => [{ date: dateIso, label: '休息日' }]
		});
		await vi.waitFor(() => expect(h.adapter.replacePlan).toHaveBeenLastCalledWith([]));
		calendar.dispose();
		await vi.waitFor(() =>
			expect(vi.mocked(h.adapter.replacePlan).mock.calls.at(-1)![0]).toHaveLength(1)
		);
		await h.controller.clearData();
		expect(h.adapter.clearData).toHaveBeenCalledOnce();
		expect(h.adapter.replacePlan).toHaveBeenLastCalledWith([]);
	});
	it('does not enable until display and precise timing permissions are granted', async () => {
		const h = await harness();
		h.status({ supported: true, permission: 'granted', exact: false });
		await h.controller.setEnabled(true);
		expect(h.engine.state.userPreferences.classNotificationsEnabled).toBe(false);
		expect(h.controller.state.status).toBe('permission');
		expect(h.adapter.requestPermission).toHaveBeenCalledOnce();
		h.status({ supported: true, permission: 'granted', exact: true });
		await h.controller.setEnabled(true);
		expect(h.engine.state.userPreferences.classNotificationsEnabled).toBe(true);
		expect(h.controller.state.status).toBe('ready');
	});
	it('does not request permission on sync and cancels when permissions are revoked', async () => {
		const h = await harness();
		await h.engine.updatePreferences({ classNotificationsEnabled: true });
		await h.controller.sync();
		h.status({ supported: true, permission: 'denied', exact: true });
		await h.controller.sync();
		expect(h.adapter.requestPermission).not.toHaveBeenCalled();
		expect(h.adapter.replacePlan).toHaveBeenLastCalledWith([]);
		expect(h.controller.state.enabled).toBe(false);
		expect(h.controller.state.status).toBe('permission');
	});
	it('reports schedule failures and retries without a new authorization prompt', async () => {
		const h = await harness();
		vi.mocked(h.adapter.replacePlan).mockRejectedValueOnce(new Error('disk full'));
		await h.controller.setEnabled(true);
		expect(h.controller.state.status).toBe('error');
		await h.controller.sync();
		expect(h.controller.state.status).toBe('ready');
	});
	it('serializes an in-flight refresh with a later disable and clears the final plan', async () => {
		const h = await harness();
		await h.controller.setEnabled(true);
		let release!: () => void;
		vi.mocked(h.adapter.replacePlan).mockImplementationOnce(
			() =>
				new Promise<void>((resolve) => {
					release = resolve;
				})
		);
		const first = h.controller.sync(true);
		await vi.waitFor(() => expect(release).toBeTypeOf('function'));
		const off = h.controller.setEnabled(false);
		release();
		await Promise.all([first, off]);
		expect(h.adapter.replacePlan).toHaveBeenLastCalledWith([]);
		expect(h.engine.state.userPreferences.classNotificationsEnabled).toBe(false);
	});
	it('holds a plan while restoration or replacement is pending and retains it on resolution failure', async () => {
		const restored = Promise.withResolvers<void>();
		let gate = restored.promise;
		const h = await harness(() => gate);
		const timetable = createTimetable({
			id: 't',
			name: 'T',
			academicConfig: {
				termStartDate: '2099-03-02',
				startWeek: 1,
				endWeek: 1,
				periodTimes: [{ index: 1, startTime: '08:00', endTime: '08:45' }]
			},
			courses: [
				createCourse({ id: 'c', name: 'Course', dayOfWeek: 1, startPeriod: 1, endPeriod: 1 })
			]
		});
		h.timetables.set(timetable.id, timetable);
		await h.engine.switchTimetable(timetable.id);
		await h.engine.updatePreferences({ classNotificationsEnabled: true });
		h.controller.start();
		await Promise.resolve();
		expect(h.adapter.replacePlan).not.toHaveBeenCalled();
		restored.resolve();
		await h.controller.sync();
		expect(h.adapter.replacePlan).toHaveBeenCalledTimes(1);
		const date = vi.mocked(h.adapter.replacePlan).mock.calls[0]![0][0]!.dateIso;
		const permission = Promise.withResolvers<ClassNotificationStatus>();
		vi.mocked(h.adapter.getStatus).mockReturnValueOnce(permission.promise);
		const refreshing = h.controller.sync(true);
		await vi.waitFor(() => expect(h.adapter.getStatus).toHaveBeenCalledTimes(2));
		const replacement = Promise.withResolvers<void>();
		gate = replacement.promise;
		permission.resolve({ supported: true, permission: 'granted', exact: true });
		for (let i = 0; i < 10; i++) await Promise.resolve();
		expect(h.adapter.replacePlan).toHaveBeenCalledTimes(1);
		const provider = h.engine.slots.register('calendar.holidays', {
			id: 'holidays',
			getHolidays: () => [{ date, label: 'Holiday' }]
		});
		replacement.resolve();
		await refreshing;
		expect(h.adapter.replacePlan).toHaveBeenLastCalledWith([]);
		provider.dispose();
		await h.controller.sync();
		const calls = vi.mocked(h.adapter.replacePlan).mock.calls.length;
		const error = new Error('Broken calendar');
		const report = vi.spyOn(console, 'error').mockImplementation(() => {});
		h.engine.slots.register('calendar.holidays', {
			id: 'broken',
			getHolidays: () => {
				throw error;
			}
		});
		await h.controller.sync();
		expect(h.adapter.replacePlan).toHaveBeenCalledTimes(calls);
		expect(h.controller.state.status).toBe('error');
		expect(report).toHaveBeenCalledWith('[class-notifications] Failed to sync reminders', error);
		report.mockRestore();
	});

	it('handles unsupported platforms and tests only with effective permission', async () => {
		const h = await harness();
		h.status({ supported: false, permission: 'denied', exact: false });
		await h.controller.sync();
		expect(h.controller.state.status).toBe('unsupported');
		await h.controller.sendTest();
		expect(h.adapter.sendTest).not.toHaveBeenCalled();
	});
});
