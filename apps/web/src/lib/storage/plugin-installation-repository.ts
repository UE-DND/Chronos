import type { ChronosDB } from './db';
import {
	parseInstallationState,
	type PluginInstallationRepository
} from '$lib/services/official-plugins/installed-store';
import {
	INSTALLED_STORAGE_KEY,
	OFFICIAL_PLUGINS_PLUGIN_ID
} from '$lib/services/official-plugins/official-plugin-types';

/** All installation changes merge against the latest row under an IndexedDB write transaction. */
export function createPluginInstallationRepository(
	database: ChronosDB
): PluginInstallationRepository {
	const id = `${OFFICIAL_PLUGINS_PLUGIN_ID}:${INSTALLED_STORAGE_KEY}`;
	const read = async () => {
		const row = await database.pluginData.get(id);
		return parseInstallationState(row ? JSON.parse(row.valueJson) : null);
	};
	return {
		read,
		transaction: (change) =>
			database.transaction('rw', database.pluginData, async () => {
				const state = await read();
				change(state);
				await database.pluginData.put({
					id,
					pluginId: OFFICIAL_PLUGINS_PLUGIN_ID,
					key: INSTALLED_STORAGE_KEY,
					valueJson: JSON.stringify(state),
					updatedAt: Date.now()
				});
				return state;
			})
	};
}
