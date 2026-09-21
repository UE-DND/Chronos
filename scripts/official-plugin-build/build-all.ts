import { OFFICIAL_PLUGINS } from '../official-plugins.config.ts';
import type { OfficialPluginBuildResult } from './build-plugin.ts';
import { PluginBuildCoordinator } from './coordinator.ts';
import { publishOfficialPluginMarket } from './publish-market.ts';
export interface BuildAllOfficialPluginsOptions {
	root: string;
	releaseVersion?: string;
	environment?: Record<string, string>;
}
export async function buildAllOfficialPlugins(
	options: BuildAllOfficialPluginsOptions
): Promise<OfficialPluginBuildResult[]> {
	const coordinator = new PluginBuildCoordinator({
		...options,
		plugins: OFFICIAL_PLUGINS,
		mode: 'production'
	});
	try {
		const results = publishOfficialPluginMarket(options.root, await coordinator.prepare());
		console.log('Official plugin bundles and manifests updated.');
		return results;
	} finally {
		coordinator.dispose();
	}
}
