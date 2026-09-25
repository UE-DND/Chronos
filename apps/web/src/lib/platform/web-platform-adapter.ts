import type { HostPlatformAdapter } from './host-platform';
import { getDefaultWebPlatform } from './host-platform';

export function getBootPlatformAdapter(): HostPlatformAdapter {
	return getDefaultWebPlatform();
}
