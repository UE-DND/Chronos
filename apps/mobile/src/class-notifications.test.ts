import { beforeEach, describe, expect, it, vi } from 'vite-plus/test';
const mocks = vi.hoisted(() => ({
	available: true,
	display: 'granted',
	exact: 'granted',
	enabled: true,
	channelEnabled: true,
	requestPermissions: vi.fn(async () => {}),
	changeExactNotificationSetting: vi.fn(async () => {}),
	settings: vi.fn(async () => {}),
	replacePlan: vi.fn(async () => {}),
	clearData: vi.fn(async () => {}),
	sendTest: vi.fn(async () => {})
}));
vi.mock('@capacitor/core', () => ({
	Capacitor: { isPluginAvailable: () => mocks.available },
	registerPlugin: () => ({
		getStatus: async () => ({ enabled: mocks.enabled, channelEnabled: mocks.channelEnabled }),
		replacePlan: mocks.replacePlan,
		clearData: mocks.clearData,
		sendTest: mocks.sendTest,
		openNotificationSettings: mocks.settings
	})
}));
vi.mock('@capacitor/local-notifications', () => ({
	LocalNotifications: {
		checkPermissions: async () => ({ display: mocks.display }),
		checkExactNotificationSetting: async () => ({ exact_alarm: mocks.exact }),
		requestPermissions: mocks.requestPermissions,
		changeExactNotificationSetting: mocks.changeExactNotificationSetting
	}
}));
import { createAndroidClassNotifications } from './class-notifications';
beforeEach(() => {
	vi.clearAllMocks();
	Object.assign(mocks, {
		available: true,
		display: 'granted',
		exact: 'granted',
		enabled: true,
		channelEnabled: true
	});
});
describe('Android class reminder permissions', () => {
	it('checks both privileges without prompting during automatic sync', async () => {
		const a = createAndroidClassNotifications();
		mocks.exact = 'denied';
		expect(await a.getStatus()).toEqual({ supported: true, permission: 'granted', exact: false });
		expect(mocks.requestPermissions).not.toHaveBeenCalled();
		expect(mocks.changeExactNotificationSetting).not.toHaveBeenCalled();
	});
	it('requests exact alarms only after display permission succeeds', async () => {
		const a = createAndroidClassNotifications();
		mocks.display = 'denied';
		mocks.enabled = false;
		mocks.exact = 'denied';
		await a.requestPermission();
		expect(mocks.requestPermissions).toHaveBeenCalledOnce();
		expect(mocks.changeExactNotificationSetting).not.toHaveBeenCalled();
		mocks.display = 'granted';
		mocks.enabled = true;
		await a.requestPermission();
		expect(mocks.changeExactNotificationSetting).toHaveBeenCalledOnce();
	});
	it('detects blocked channels and missing native bridges', async () => {
		const a = createAndroidClassNotifications();
		mocks.channelEnabled = false;
		expect((await a.getStatus()).permission).toBe('denied');
		await a.openSettings();
		expect(mocks.settings).toHaveBeenCalledOnce();
		mocks.available = false;
		expect((await a.getStatus()).supported).toBe(false);
	});
});
