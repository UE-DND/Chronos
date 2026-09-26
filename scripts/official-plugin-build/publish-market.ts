import { existsSync, mkdirSync, mkdtempSync, readdirSync, readFileSync, rmSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { verifyOfficialPlugins } from '../verify-official-plugins.ts';
import { publishProductionPlugin, type OfficialPluginBuildResult } from './build-plugin.ts';
import { createOfficialPluginBuildPaths } from './paths.ts';
import { digest, writeChanged } from './cache.ts';

/** Publish immutable resources first; catalog.json is the only live commit point. */
export function publishOfficialPluginMarket(
	root: string,
	results: OfficialPluginBuildResult[]
): OfficialPluginBuildResult[] {
	const paths = createOfficialPluginBuildPaths(root);
	mkdirSync(resolve(root, 'dist'), { recursive: true });
	const temporary = mkdtempSync(resolve(root, 'dist/market-stage-'));
	try {
		const staged = createOfficialPluginBuildPaths(temporary);
		const manifests: string[] = [];
		const published = results.map((result) => {
			const revision = digest(JSON.stringify([result.manifest, result.licenses ?? []])).slice(
				0,
				24
			);
			const manifest = { ...result.manifest };
			for (const field of ['bundleUrl', 'cssUrl', 'colorsUrl', 'iconThemeUrl']) {
				if (typeof manifest[field] === 'string')
					manifest[field] = manifest[field].replace(
						`/official-plugins/bundles/${result.id}/`,
						`../../bundles/${result.id}/${revision}/`
					);
			}
			const output = { ...result, manifest };
			const manifestDir = resolve(staged.manifestDir, revision);
			publishProductionPlugin(output, {
				...staged,
				manifestDir,
				pluginBundleDir: (id) => resolve(staged.pluginBundleDir(id), revision)
			});
			writeChanged(
				resolve(manifestDir, `${result.id}.licenses.json`),
				JSON.stringify(result.licenses ?? [])
			);
			manifests.push(`./manifests/${revision}/${result.id}.manifest.json`);
			return output;
		});
		let previous: { updatedAt?: number; manifests?: string[] } = {};
		if (existsSync(paths.catalogPath)) {
			try {
				previous = JSON.parse(readFileSync(paths.catalogPath, 'utf8'));
			} catch {
				/* replace an invalid catalog after validating the complete release */
			}
		}
		const unchanged = JSON.stringify(previous.manifests) === JSON.stringify(manifests);
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
		verifyOfficialPlugins(dirname(staged.catalogPath));
		const market = dirname(paths.catalogPath);
		const stagedMarket = dirname(staged.catalogPath);
		const copyResources = (relative = '') => {
			for (const entry of readdirSync(resolve(stagedMarket, relative), { withFileTypes: true })) {
				if (!relative && entry.name === 'catalog.json') continue;
				const path = relative ? `${relative}/${entry.name}` : entry.name;
				if (entry.isDirectory()) copyResources(path);
				else writeChanged(resolve(market, path), readFileSync(resolve(stagedMarket, path)));
			}
		};
		copyResources();
		// Keep earlier revisions readable for readers that already fetched their catalog.
		// Failure or termination before this atomic file replacement leaves the old release live.
		writeChanged(paths.catalogPath, readFileSync(staged.catalogPath));
		return published;
	} finally {
		rmSync(temporary, { recursive: true, force: true });
	}
}
