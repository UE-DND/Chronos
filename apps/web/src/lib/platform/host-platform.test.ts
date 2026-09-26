import { afterEach, expect, it, vi } from 'vite-plus/test';
import { getHostPlatform, resetHostPlatform } from './host-platform';
import { getBootPlatformAdapter } from '$chronos-platform-adapter';

vi.mock('$chronos-platform-adapter', () => ({
	getBootPlatformAdapter: vi.fn(() => ({
		id: 'mobile',
		isNative: true,
		platformType: 'android',
		supportsPwaInstall: false,
		shouldShowInstallGuide: false
	}))
}));

afterEach(() => {
	resetHostPlatform();
	vi.clearAllMocks();
});

it('resolves the target adapter on first access, before platform bootstrap', () => {
	resetHostPlatform();
	expect(getHostPlatform().platformType).toBe('android');
	expect(getBootPlatformAdapter).toHaveBeenCalledOnce();
	expect(getHostPlatform().platformType).toBe('android');
	expect(getBootPlatformAdapter).toHaveBeenCalledOnce();
});
