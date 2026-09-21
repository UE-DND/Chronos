import {
	cpSync,
	existsSync,
	mkdirSync,
	mkdtempSync,
	readdirSync,
	readFileSync,
	renameSync,
	rmSync
} from 'node:fs';
import { dirname, resolve } from 'node:path';
import { verifyOfficialPlugins } from '../verify-official-plugins.ts';
import { OFFICIAL_PLUGINS } from '../official-plugins.config.ts';
import { publishProductionPlugin, type OfficialPluginBuildResult } from './build-plugin.ts';
import { createOfficialPluginBuildPaths } from './paths.ts';
import { PluginBuildCoordinator } from './coordinator.ts';
import { writeChanged } from './cache.ts';
export interface BuildAllOfficialPluginsOptions {
	root: string;
	releaseVersion?: string;
	environment?: Record<string, string>;
}
export async function buildAllOfficialPlugins(
	options: BuildAllOfficialPluginsOptions
): Promise<OfficialPluginBuildResult[]> {
	const paths = createOfficialPluginBuildPaths(options.root);
	const coordinator = new PluginBuildCoordinator({
		...options,
		plugins: OFFICIAL_PLUGINS,
		mode: 'production'
	});
	let temporary: string | undefined;
	try {
		const results = await coordinator.prepare();
		mkdirSync(resolve(options.root, 'dist'), { recursive: true });
		temporary = mkdtempSync(resolve(options.root, 'dist/market-stage-'));
		const staged = createOfficialPluginBuildPaths(temporary);
		mkdirSync(staged.manifestDir, { recursive: true });
		mkdirSync(staged.staticBundleDir, { recursive: true });
		for (const result of results) publishProductionPlugin(result, staged);
		const manifests = OFFICIAL_PLUGINS.map(
			(plugin) => `/official-plugins/manifests/${plugin.id}.manifest.json`
		);
		let previous: { updatedAt?: number; manifests?: string[] } = {};
		if (existsSync(paths.catalogPath)) {
			try {
				previous = JSON.parse(readFileSync(paths.catalogPath, 'utf8'));
			} catch {
				/* rebuild invalid catalog */
			}
		}
		const unchanged =
			JSON.stringify(previous.manifests) === JSON.stringify(manifests) &&
			results.every((result) => {
				try {
					return (
						JSON.stringify(
							JSON.parse(
								readFileSync(resolve(paths.manifestDir, `${result.id}.manifest.json`), 'utf8')
							)
						) === JSON.stringify(result.manifest)
					);
				} catch {
					return false;
				}
			});
		const catalog = {
			version: 1,
			updatedAt: process.env.SOURCE_DATE_EPOCH
				? Number(process.env.SOURCE_DATE_EPOCH)
				: unchanged
					? (previous.updatedAt ?? Date.now())
					: Date.now(),
			manifests
		};
		writeChanged(staged.catalogPath, `${JSON.stringify(catalog, null, '\t')}\n`);
		verifyOfficialPlugins(resolve(temporary, 'apps/web/static'));
		const market = dirname(paths.catalogPath),
			stagedMarket = dirname(staged.catalogPath);
		if (existsSync(market))
			for (const entry of readdirSync(market)) {
				if (!['bundles', 'manifests', 'catalog.json'].includes(entry))
					cpSync(resolve(market, entry), resolve(stagedMarket, entry), { recursive: true });
			}
		mkdirSync(dirname(market), { recursive: true });
		const backup = resolve(temporary, 'previous-market');
		if (existsSync(market)) renameSync(market, backup);
		try {
			renameSync(stagedMarket, market);
		} catch (error) {
			if (existsSync(backup)) renameSync(backup, market);
			throw error;
		}
		console.log('Official plugin bundles and manifests updated.');
		return results;
	} finally {
		coordinator.dispose();
		if (temporary) rmSync(temporary, { recursive: true, force: true });
	}
}
