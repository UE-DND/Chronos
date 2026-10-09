import { afterEach, beforeEach, describe, expect, it, vi } from 'vite-plus/test';
import {
	createWebClassNotifications,
	initWebClassNotificationLinks
} from './web-class-notifications';
import type { ClassNotificationAdapter, ClassNotificationMessage } from './host-platform';
const adapters: ClassNotificationAdapter[] = [];
const delivered = new Map<string, string>();
let lock: Promise<unknown>;
let permission: NotificationPermission;
const show = vi.fn(async () => {});
const request = vi.fn(async () => permission);
const documentTarget = new EventTarget();
const messages = new EventTarget();
let ready: Promise<typeof registration>;
const register = vi.fn(async () => registration);
const registration = {
	active: { state: 'activated' },
	scope: 'https://chronos.example/Chronos/',
	showNotification: show,
	getNotifications: vi.fn(async () => [])
};
function message(delay = 1_000): ClassNotificationMessage {
	return {
		dateIso: '2026-03-02',
		startTime: '08:00',
		startAt: Date.now() + 1_800_000,
		notifyAt: Date.now() + delay,
		prepareReminderMinutes: 30,
		title: 'Ready',
		body: 'Math',
		courses: [
			{
				key: 'main/math/2026-03-02',
				name: 'Math',
				teacher: '',
				endTime: '08:45',
				body: 'Math',
				location: 'Room',
				startPeriod: 1,
				endPeriod: 2
			}
		]
	};
}
function adapter() {
	const result = createWebClassNotifications();
	adapters.push(result);
	return result;
}
beforeEach(() => {
	vi.useFakeTimers();
	vi.setSystemTime(new Date('2026-03-02T07:30:00'));
	permission = 'granted';
	delivered.clear();
	lock = Promise.resolve();
	show.mockClear();
	ready = Promise.resolve(registration);
	register.mockClear();
	request.mockClear();
	vi.stubGlobal('window', {
		isSecureContext: true,
		Notification: {},
		location: { href: registration.scope }
	});
	vi.stubGlobal('Notification', {
		get permission() {
			return permission;
		},
		requestPermission: request
	});
	class Registration {}
	Object.assign(Registration.prototype, { showNotification: show });
	vi.stubGlobal('ServiceWorkerRegistration', Registration);
	vi.stubGlobal('document', {
		visibilityState: 'visible',
		addEventListener: documentTarget.addEventListener.bind(documentTarget),
		removeEventListener: documentTarget.removeEventListener.bind(documentTarget)
	});
	vi.stubGlobal('navigator', {
		serviceWorker: {
			register,
			get ready() {
				return ready;
			},
			getRegistration: vi.fn(async () => registration),
			addEventListener: messages.addEventListener.bind(messages),
			removeEventListener: messages.removeEventListener.bind(messages)
		},
		locks: {
			request: (_: string, task: () => unknown) => {
				const next = lock.then(task);
				lock = next.catch(() => {});
				return next;
			}
		}
	});
	vi.stubGlobal('localStorage', {
		getItem: (key: string) => delivered.get(key) ?? null,
		setItem: (key: string, value: string) => delivered.set(key, value),
		removeItem: (key: string) => delivered.delete(key),
		get length() {
			return delivered.size;
		},
		key: (index: number) => [...delivered.keys()][index] ?? null
	});
});
afterEach(() => {
	adapters.splice(0).forEach((a) => a.dispose());
	vi.unstubAllGlobals();
	vi.unstubAllEnvs();
	vi.useRealTimers();
});
describe('web class reminders', () => {
	it('waits for activation before scheduling and sending a test notification', async () => {
		vi.spyOn(navigator.serviceWorker, 'getRegistration').mockResolvedValue({
			...registration,
			active: null
		} as unknown as ServiceWorkerRegistration);
		let activate!: (value: typeof registration) => void;
		ready = new Promise((resolve) => {
			activate = resolve;
		});
		const a = adapter();
		const scheduled = a.replacePlan([message()]);
		const tested = a.sendTest('Test', 'Body');
		await vi.advanceTimersByTimeAsync(0);
		expect(show).not.toHaveBeenCalled();
		activate(registration);
		await Promise.all([scheduled, tested]);
		expect(show).toHaveBeenCalledOnce();
		await vi.advanceTimersByTimeAsync(1_000);
		expect(show).toHaveBeenCalledTimes(2);
		expect(register).not.toHaveBeenCalled();
	});
	it('registers a notification worker when development has no PWA worker', async () => {
		vi.spyOn(navigator.serviceWorker, 'getRegistration').mockResolvedValue(undefined);
		await adapter().replacePlan([message()]);
		expect(register).toHaveBeenCalledWith(
			expect.stringContaining('sw-class-notifications.js'),
			expect.any(Object)
		);
	});
	it('uses the PWA worker in production and retries a failed registration', async () => {
		vi.stubEnv('DEV', false);
		vi.spyOn(navigator.serviceWorker, 'getRegistration').mockResolvedValue(undefined);
		register.mockRejectedValueOnce(new Error('Worker fetch failed'));
		const a = adapter();
		await expect(a.replacePlan([message()])).rejects.toThrow('Worker fetch failed');
		expect(vi.getTimerCount()).toBe(0);
		await a.replacePlan([message()]);
		expect(register).toHaveBeenLastCalledWith(
			expect.stringMatching(/\/sw\.js$/),
			expect.any(Object)
		);
		await vi.advanceTimersByTimeAsync(1_000);
		expect(show).toHaveBeenCalledOnce();
	});
	it('times out activation and allows a later retry', async () => {
		vi.spyOn(navigator.serviceWorker, 'getRegistration').mockResolvedValue({
			...registration,
			active: null
		} as unknown as ServiceWorkerRegistration);
		ready = new Promise(() => {});
		const a = adapter();
		const attempt = expect(a.replacePlan([message()])).rejects.toThrow(
			'Service Worker activation timed out'
		);
		await vi.advanceTimersByTimeAsync(10_000);
		await attempt;
		ready = Promise.resolve(registration);
		await a.replacePlan([message()]);
		await vi.advanceTimersByTimeAsync(1_000);
		expect(show).toHaveBeenCalledOnce();
	});
	it('does not restore a plan disabled while waiting for activation', async () => {
		vi.spyOn(navigator.serviceWorker, 'getRegistration').mockResolvedValue({
			...registration,
			active: null
		} as unknown as ServiceWorkerRegistration);
		let activate!: (value: typeof registration) => void;
		ready = new Promise((resolve) => {
			activate = resolve;
		});
		const a = adapter();
		const pending = a.replacePlan([message()]);
		await vi.advanceTimersByTimeAsync(0);
		await a.replacePlan([]);
		activate(registration);
		await pending;
		await vi.advanceTimersByTimeAsync(60_000);
		expect(show).not.toHaveBeenCalled();
		expect(vi.getTimerCount()).toBe(0);
	});
	it('delivers one occurrence across two windows and a later lead-time change', async () => {
		const plan = [message()];
		const one = adapter();
		const two = adapter();
		await Promise.all([one.replacePlan(plan), two.replacePlan(plan)]);
		await vi.advanceTimersByTimeAsync(1_000);
		expect(show).toHaveBeenCalledOnce();
		await one.replacePlan([{ ...plan[0]!, notifyAt: Date.now() + 1_000 }]);
		await vi.advanceTimersByTimeAsync(1_000);
		expect(show).toHaveBeenCalledOnce();
	});
	it('skips old reminders after suspension but permits one minute of delay before class', async () => {
		const a = adapter();
		const m = message();
		await a.replacePlan([m]);
		vi.setSystemTime(Date.now() + 120_000);
		documentTarget.dispatchEvent(new Event('visibilitychange'));
		await vi.advanceTimersByTimeAsync(0);
		expect(show).not.toHaveBeenCalled();
		await a.replacePlan([{ ...m, notifyAt: Date.now() - 30_000 }]);
		await vi.advanceTimersByTimeAsync(0);
		expect(show).toHaveBeenCalledOnce();
	});
	it('cancels timers and retains occurrence claims across disabling', async () => {
		const a = adapter();
		await a.replacePlan([message()]);
		await a.replacePlan([]);
		await vi.advanceTimersByTimeAsync(60_000);
		expect(show).not.toHaveBeenCalled();
		expect(request).not.toHaveBeenCalled();
	});
	it('requests permissions only from explicit actions and detects unsupported environments', async () => {
		const a = adapter();
		permission = 'default';
		await a.replacePlan([]);
		expect(request).not.toHaveBeenCalled();
		await a.requestPermission();
		expect(request).toHaveBeenCalledOnce();
		vi.stubGlobal('window', { isSecureContext: false });
		expect((await a.getStatus()).supported).toBe(false);
	});
	it('rolls back a failed display claim and clears delivery records on data reset', async () => {
		const a = adapter();
		show.mockRejectedValueOnce(new Error('OS rejected display'));
		const plan = [message()];
		await a.replacePlan(plan);
		await vi.advanceTimersByTimeAsync(1_000);
		await expect(a.getStatus()).rejects.toThrow();
		expect(delivered.size).toBe(0);
		await a.replacePlan([{ ...plan[0]!, notifyAt: Date.now() }]);
		await vi.advanceTimersByTimeAsync(0);
		expect(delivered.size).toBe(1);
		await a.clearData();
		expect(delivered.size).toBe(0);
	});
	it('opens the app after a worker click or a cold launch', () => {
		const open = vi.fn();
		const off = initWebClassNotificationLinks({ onDeepLink: open });
		messages.dispatchEvent(
			new MessageEvent('message', { data: { type: 'chronos:/:class-notification-open' } })
		);
		expect(open).toHaveBeenCalledOnce();
		off();
		vi.stubGlobal('window', { location: { href: registration.scope + '?class-reminder=1' } });
		const dispose = initWebClassNotificationLinks({ onDeepLink: open });
		expect(open).toHaveBeenCalledTimes(2);
		dispose();
	});
});
