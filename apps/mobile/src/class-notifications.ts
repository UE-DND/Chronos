import { Capacitor, registerPlugin } from '@capacitor/core';
import { LocalNotifications } from '@capacitor/local-notifications';
import type {
	ClassNotificationAdapter,
	ClassNotificationMessage,
	ClassNotificationStatus
} from '../../web/src/lib/platform/host-platform';

const reminders = registerPlugin<{
	getStatus(): Promise<{ enabled: boolean; channelEnabled: boolean }>;
	replacePlan(options: { plan: ClassNotificationMessage[] }): Promise<void>;
	sendTest(options: { title: string; body: string }): Promise<void>;
	openNotificationSettings(): Promise<void>;
	clearData(): Promise<void>;
}>('ChronosClassNotifications');

export function createAndroidClassNotifications(): ClassNotificationAdapter {
	async function getStatus(): Promise<ClassNotificationStatus> {
		const supported =
			Capacitor.isPluginAvailable('ChronosClassNotifications') &&
			Capacitor.isPluginAvailable('LocalNotifications');
		if (!supported) return { supported: false, permission: 'denied', exact: false };
		const [display, exact, native] = await Promise.all([
			LocalNotifications.checkPermissions(),
			LocalNotifications.checkExactNotificationSetting(),
			reminders.getStatus()
		]);
		return {
			supported: true,
			permission:
				native.enabled && native.channelEnabled && display.display === 'granted'
					? 'granted'
					: display.display === 'prompt' || display.display === 'prompt-with-rationale'
						? 'prompt'
						: 'denied',
			exact: exact.exact_alarm === 'granted'
		};
	}
	return {
		background: true,
		getStatus,
		async requestPermission() {
			let status = await getStatus();
			if (!status.supported) return status;
			if (status.permission !== 'granted') await LocalNotifications.requestPermissions();
			status = await getStatus();
			if (status.permission === 'granted' && !status.exact)
				await LocalNotifications.changeExactNotificationSetting();
			return getStatus();
		},
		async openSettings() {
			const status = await getStatus();
			if (status.permission !== 'granted') await reminders.openNotificationSettings();
			else if (!status.exact) await LocalNotifications.changeExactNotificationSetting();
		},
		replacePlan(plan) {
			return reminders.replacePlan({ plan });
		},
		sendTest(title, body) {
			return reminders.sendTest({ title, body });
		},
		clearData() {
			return reminders.clearData();
		},
		dispose() {
			/* Persisted alarms keep running after the WebView is disposed. */
		}
	};
}
