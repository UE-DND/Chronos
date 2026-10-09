import { resolve } from '$app/paths';
import { staticPath } from '#lib/config/static-path.ts';
import type {
	ClassNotificationAdapter,
	ClassNotificationMessage,
	ClassNotificationStatus,
	HostPlatformInitCallbacks
} from './host-platform';

const DELIVERY_PREFIX = 'chronos_class_notifications:';
const OPEN_MESSAGE = 'chronos:class-notification-open';
const TAG = 'chronos-class-notification';

export function initWebClassNotificationLinks(callbacks?: HostPlatformInitCallbacks): () => void {
	if (typeof window === 'undefined') return () => {};
	const open = () => callbacks?.onDeepLink?.(new URL('chronos://today?class-reminder=1'));
	const receive = (event: MessageEvent) => {
		if (event.data?.type === OPEN_MESSAGE) open();
	};
	navigator.serviceWorker?.addEventListener('message', receive);
	if (new URL(window.location.href).searchParams.get('class-reminder') === '1') open();
	return () => navigator.serviceWorker?.removeEventListener('message', receive);
}

export function createWebClassNotifications(): ClassNotificationAdapter {
	let plan: ClassNotificationMessage[] = [];
	let timer: ReturnType<typeof setTimeout> | undefined;
	let generation = 0;
	let error: unknown;
	let active = false;
	const supported = () =>
		typeof window !== 'undefined' &&
		window.isSecureContext &&
		'Notification' in window &&
		'serviceWorker' in navigator &&
		'locks' in navigator &&
		typeof ServiceWorkerRegistration !== 'undefined' &&
		'showNotification' in ServiceWorkerRegistration.prototype;
	const status = (): ClassNotificationStatus => ({
		supported: supported(),
		permission: supported()
			? Notification.permission === 'default'
				? 'prompt'
				: Notification.permission
			: 'denied',
		exact: true
	});

	async function activeRegistration(): Promise<ServiceWorkerRegistration> {
		let timeout: ReturnType<typeof setTimeout> | undefined;
		try {
			return await Promise.race([
				(async () => {
					const workers = navigator.serviceWorker;
					let registration = await workers.getRegistration();
					if (!registration) {
						// Dev disables the PWA worker; use the notification handler without caching.
						registration = await workers.register(
							staticPath(import.meta.env.DEV ? 'sw-class-notifications.js' : 'sw.js'),
							{ scope: resolve('') }
						);
					}
					return registration.active?.state === 'activated' ? registration : await workers.ready;
				})(),
				new Promise<never>((_, reject) => {
					timeout = setTimeout(
						() => reject(new Error('Service Worker activation timed out')),
						10_000
					);
				})
			]);
		} finally {
			if (timeout !== undefined) clearTimeout(timeout);
		}
	}

	function stop() {
		generation++;
		if (timer !== undefined) clearTimeout(timer);
		timer = undefined;
	}
	async function show(message: ClassNotificationMessage, revision: number) {
		await navigator.locks.request('chronos-class-notifications', async () => {
			if (generation !== revision || Notification.permission !== 'granted') return;
			const courses = message.courses.filter((c) => !localStorage.getItem(DELIVERY_PREFIX + c.key));
			if (!courses.length) return;
			const registration = await activeRegistration();
			if (generation !== revision || Notification.permission !== 'granted') return;
			// Reserve before display: another window must never deliver the same occurrence.
			const keys = courses.map((c) => DELIVERY_PREFIX + c.key);
			for (const key of keys) localStorage.setItem(key, String(message.startAt));
			try {
				await registration.showNotification(message.title, {
					body: courses.map((course) => course.body).join('\n'),
					tag: TAG,
					data: { kind: 'class-reminder' },
					icon: new URL('pwa-192.png', registration.scope).href
				});
				if (generation !== revision) {
					for (const notification of await registration.getNotifications({ tag: TAG }))
						notification.close();
				}
			} catch (cause) {
				for (const key of keys) localStorage.removeItem(key);
				throw cause;
			}
		});
	}
	async function check() {
		if (!active) return;
		const revision = generation;
		const now = Date.now();
		const due = plan.filter((m) => m.notifyAt <= now);
		plan = plan.filter((m) => m.notifyAt > now);
		try {
			for (const message of due) {
				if (now - message.notifyAt <= 60_000 && message.startAt > now)
					await show(message, revision);
			}
		} catch (cause) {
			error = cause;
		}
		if (generation === revision) schedule();
	}
	function schedule() {
		if (timer !== undefined) clearTimeout(timer);
		timer = undefined;
		if (active && plan.length)
			timer = setTimeout(
				() => void check(),
				Math.max(0, Math.min(30_000, plan[0]!.notifyAt - Date.now()))
			);
	}
	const resume = () => {
		if (document.visibilityState === 'visible') void check();
	};
	function attach() {
		if (active) return;
		active = true;
		document.addEventListener('visibilitychange', resume);
	}
	return {
		background: false,
		async getStatus() {
			if (error) {
				const cause = error;
				error = undefined;
				throw cause;
			}
			return status();
		},
		async requestPermission() {
			if (supported() && Notification.permission === 'default')
				await Notification.requestPermission();
			return status();
		},
		async openSettings() {
			/* Browser permissions are managed through the site's settings UI. */
		},
		async replacePlan(next) {
			stop();
			const revision = generation;
			error = undefined;
			plan = [...next];
			if (!supported()) {
				if (plan.length) throw new Error('Notifications unavailable');
				return;
			}
			if (plan.length && Notification.permission !== 'granted')
				throw new Error('Notifications denied');
			if (plan.length) await activeRegistration();
			if (generation !== revision) return;
			// Prune completed occurrences, but retain recent ones across refreshes and toggles.
			for (let index = localStorage.length - 1; index >= 0; index--) {
				const key = localStorage.key(index);
				if (
					key?.startsWith(DELIVERY_PREFIX) &&
					Number(localStorage.getItem(key)) < Date.now() - 86_400_000
				)
					localStorage.removeItem(key);
			}
			if (!plan.length) {
				active = false;
				document.removeEventListener('visibilitychange', resume);
				const registration = await navigator.serviceWorker.getRegistration();
				for (const notification of (await registration?.getNotifications()) ?? [])
					if (notification.tag === TAG || notification.tag === TAG + '-test') notification.close();
				return;
			}
			attach();
			schedule();
		},
		async sendTest(title, body) {
			if (!supported() || Notification.permission !== 'granted')
				throw new Error('Notifications unavailable');
			const revision = generation;
			const registration = await activeRegistration();
			if (generation !== revision || Notification.permission !== 'granted') return;
			await registration.showNotification(title, {
				body,
				tag: TAG + '-test',
				data: { kind: 'class-reminder' }
			});
		},
		async clearData() {
			stop();
			plan = [];
			if (typeof localStorage === 'undefined') return;
			for (let index = localStorage.length - 1; index >= 0; index--) {
				const key = localStorage.key(index);
				if (key?.startsWith(DELIVERY_PREFIX)) localStorage.removeItem(key);
			}
		},
		dispose() {
			stop();
			active = false;
			plan = [];
			if (typeof document !== 'undefined') document.removeEventListener('visibilitychange', resume);
		}
	};
}
