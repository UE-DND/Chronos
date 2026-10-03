import { buildClassNotificationPlan, type ChronosEngine, type Disposable } from '@chronos/core';
import { hostT } from '$lib/i18n/host-i18n.svelte';
import type {
	ClassNotificationAdapter,
	ClassNotificationMessage,
	ClassNotificationStatus
} from './host-platform';

export function createClassNotificationsController(
	engine: Pick<ChronosEngine, 'state' | 'events' | 'updatePreferences'>,
	adapter?: ClassNotificationAdapter
) {
	let permission = $state<ClassNotificationStatus>({
		supported: false,
		permission: 'prompt',
		exact: false
	});
	let status = $state<'off' | 'ready' | 'permission' | 'unsupported' | 'error'>('off');
	let busy = $state(false);
	let pending: Promise<void> | undefined;
	let toggle: Promise<void> | undefined;
	let requested = 0;
	let completed = 0;
	let forceApply = false;
	let signature: string | undefined;
	let disposed = false;
	let started = false;
	let permissionAttempted = false;
	let interval: ReturnType<typeof setInterval> | undefined;
	const subscriptions: Disposable[] = [];

	function messages(): ClassNotificationMessage[] {
		return buildClassNotificationPlan({
			timetable: engine.state.currentTimetable,
			prepareReminderMinutes: engine.state.userPreferences.prepareReminderMinutes,
			graceMs: adapter?.background ? 0 : 60_000
		}).map((batch) => {
			const courses = batch.courses.map((course) => {
				const details = [course.location, course.teacher].filter(Boolean).join(' · ');
				return {
					...course,
					body: hostT('mine.feedback.notifications.course', {
						name: course.name,
						time: `${batch.startTime}–${course.endTime}`,
						details: details ? `\n${details}` : ''
					})
				};
			});
			return {
				...batch,
				courses,
				title: hostT('mine.feedback.notifications.title'),
				body: courses.map((course) => course.body).join('\n')
			};
		});
	}
	async function drain() {
		while (!disposed && completed < requested) {
			const revision = requested;
			const forced = forceApply;
			forceApply = false;
			try {
				permission = adapter
					? await adapter.getStatus()
					: { supported: false, permission: 'denied', exact: false };
				if (disposed) return;
				if (requested !== revision) continue;
				const desired = engine.state.userPreferences.classNotificationsEnabled;
				const allowed =
					permission.supported && permission.permission === 'granted' && permission.exact;
				const next = desired && allowed ? messages() : [];
				const nextSignature = JSON.stringify(next);
				if (adapter && (forced || nextSignature !== signature)) {
					await adapter.replacePlan(next);
					if (disposed) return;
					signature = nextSignature;
				}
				status = !permission.supported
					? 'unsupported'
					: (desired || permissionAttempted) && !allowed
						? 'permission'
						: desired
							? 'ready'
							: 'off';
			} catch (error) {
				console.error('[class-notifications] Failed to sync reminders', error);
				signature = undefined;
				status = 'error';
			}
			completed = revision;
		}
	}
	function sync(force = false): Promise<void> {
		if (disposed) return Promise.resolve();
		requested++;
		forceApply ||= force;
		if (!pending)
			pending = drain().finally(() => {
				pending = undefined;
			});
		return pending;
	}
	async function applyEnabled(enabled: boolean) {
		if (busy || disposed) return;
		busy = true;
		try {
			if (enabled) {
				permissionAttempted = true;
				// Keep the browser permission request in the original click's call stack.
				permission = adapter
					? await adapter.requestPermission()
					: { supported: false, permission: 'denied', exact: false };
				if (!permission.supported || permission.permission !== 'granted' || !permission.exact) {
					status = permission.supported ? 'permission' : 'unsupported';
					return;
				}
			}
			if (!enabled) permissionAttempted = false;
			await engine.updatePreferences({ classNotificationsEnabled: enabled });
			await sync(true);
		} catch (error) {
			console.error('[class-notifications] Failed to change reminders', error);
			status = 'error';
		} finally {
			busy = false;
		}
	}
	function setEnabled(enabled: boolean): Promise<void> {
		if (toggle) return toggle;
		toggle = applyEnabled(enabled).finally(() => {
			toggle = undefined;
		});
		return toggle;
	}
	async function clearData() {
		await toggle;
		await engine.updatePreferences({ classNotificationsEnabled: false });
		await sync(true);
		await adapter?.clearData();
		signature = undefined;
		await sync();
		if (status === 'error') throw new Error('Failed to cancel class notifications');
	}
	async function openSettings() {
		if (busy || !adapter) return;
		busy = true;
		try {
			await adapter.openSettings();
			await sync(true);
		} catch {
			status = 'error';
		} finally {
			busy = false;
		}
	}
	async function sendTest() {
		if (busy || !adapter || !engine.state.userPreferences.classNotificationsEnabled) return;
		busy = true;
		try {
			permission = await adapter.getStatus();
			if (!permission.supported || permission.permission !== 'granted' || !permission.exact) {
				await sync();
				return;
			}
			await adapter.sendTest(
				hostT('mine.feedback.notifications.title'),
				hostT('mine.feedback.notifications.testBody')
			);
		} catch {
			status = 'error';
		} finally {
			busy = false;
		}
	}
	const onVisible = () => {
		if (document.visibilityState === 'visible') void sync(true);
	};
	function start() {
		if (started || disposed) return;
		started = true;
		for (const event of [
			'timetable:loaded',
			'timetable:updated',
			'timetable:switched',
			'timetables:updated',
			'preferences:updated',
			'i18n:localeChanged'
		] as const) {
			subscriptions.push(engine.events.on(event, () => void sync()));
		}
		if (typeof document !== 'undefined') document.addEventListener('visibilitychange', onVisible);
		interval = setInterval(() => void sync(), 30_000);
		void sync();
	}
	function dispose() {
		disposed = true;
		for (const subscription of subscriptions) subscription.dispose();
		subscriptions.length = 0;
		if (interval !== undefined) clearInterval(interval);
		if (typeof document !== 'undefined')
			document.removeEventListener('visibilitychange', onVisible);
		adapter?.dispose();
	}
	return {
		get state() {
			return {
				status,
				busy,
				supported: permission.supported,
				enabled: Boolean(
					engine.state.userPreferences.classNotificationsEnabled &&
					permission.supported &&
					permission.permission === 'granted' &&
					permission.exact
				),
				background: adapter?.background ?? false,
				permission: permission.permission,
				exact: permission.exact
			};
		},
		start,
		sync,
		setEnabled,
		openSettings,
		sendTest,
		clearData,
		dispose
	};
}
export type ClassNotificationsController = ReturnType<typeof createClassNotificationsController>;
