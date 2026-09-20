import type { ChronosProfile } from '@chronos/core';
import type { InstalledOfficialPluginRecord } from './official-plugin-types';
/** Current preinstalls must be present and enabled, regardless of past removals. */
export function planPreinstall(
	profile: ChronosProfile,
	installed: readonly InstalledOfficialPluginRecord[]
) {
	return profile.preinstall.filter(
		(entry) => !installed.some((record) => record.manifest.id === entry.id && record.enabled)
	);
}
