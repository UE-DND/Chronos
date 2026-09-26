import { cpSync, mkdirSync, readFileSync, rmSync } from 'node:fs';
import { dirname, relative, resolve } from 'node:path';
import { writeChanged } from './cache.ts';
import { resolveMarketFile } from './market-files.ts';
import { verifyOfficialPlugins } from '../verify-official-plugins.ts';

/** Recreate the host's market from the required plugins, never from stale static output. */
export function bundlePreinstall(market: string, destination: string, ids: string[]): void {
	const catalog = JSON.parse(readFileSync(resolve(market, 'catalog.json'), 'utf8')) as {
		version: number;
		updatedAt: number;
		manifests: string[];
	};
	const manifests = ids.map((id) => {
		const path = catalog.manifests.find((path) => path.endsWith(`/${id}.manifest.json`));
		if (!path) throw new Error(`Preinstall missing from official catalog: ${id}`);
		return path;
	});
	rmSync(destination, { recursive: true, force: true });
	mkdirSync(destination, { recursive: true });

	const copy = (source: string) => {
		const target = resolve(destination, relative(market, source));
		mkdirSync(dirname(target), { recursive: true });
		cpSync(source, target);
	};
	for (const path of manifests) {
		const manifestPath = resolveMarketFile(market, resolve(market, 'catalog.json'), path);
		copy(manifestPath);
		copy(manifestPath.replace('.manifest.json', '.licenses.json'));
		const manifest = JSON.parse(readFileSync(manifestPath, 'utf8'));
		for (const field of ['bundleUrl', 'cssUrl', 'colorsUrl', 'iconThemeUrl']) {
			if (!manifest[field]) continue;
			const source = resolveMarketFile(market, manifestPath, manifest[field]);
			copy(source);
			if (field === 'colorsUrl') {
				const wallpaper = JSON.parse(readFileSync(source, 'utf8')).wallpaper;
				if (wallpaper) copy(resolveMarketFile(market, source, wallpaper.url));
			}
		}
	}
	writeChanged(
		resolve(destination, 'catalog.json'),
		JSON.stringify({ ...catalog, manifests }, null, '\t') + '\n'
	);
	verifyOfficialPlugins(destination);
}
