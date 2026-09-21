import type { OfficialPluginDef } from '../official-plugins.config.ts';
import { OFFICIAL_PLUGINS } from '../official-plugins.config.ts';
import type { OfficialPluginBuildResult } from './build-plugin.ts';
import { PluginBuildCoordinator } from './coordinator.ts';
export interface BuildAllOfficialPluginsDevOptions {
	root: string;
	releaseVersion?: string;
	plugins?: OfficialPluginDef[];
	createAliasRecord?: (root?: string) => Record<string, string>;
	onBuilt?: (payload: OfficialPluginBuildResult) => void;
	environment?: Record<string, string>;
}
export async function buildAllOfficialPluginsDev(
	options: BuildAllOfficialPluginsDevOptions
): Promise<OfficialPluginBuildResult[]> {
	const coordinator = new PluginBuildCoordinator({
		...options,
		plugins: options.plugins ?? OFFICIAL_PLUGINS,
		mode: 'dev'
	});
	try {
		const results = await coordinator.prepare();
		results.forEach((result) => options.onBuilt?.(result));
		return results;
	} finally {
		coordinator.dispose();
	}
}
