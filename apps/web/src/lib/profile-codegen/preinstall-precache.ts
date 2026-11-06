import { createHash } from 'node:crypto';
import { readFileSync, existsSync } from 'node:fs';
import { join, posix } from 'node:path';
import type { ChronosProfile } from '../../../../../packages/core/src/profile/profile';
/** Read the final market output, so revisions always match the distributed bytes. */
export function preinstallPrecache(webRoot: string, profile: ChronosProfile, base = '') {
	const entries: { url: string; revision: string }[] = [];
	const add = (relative: string) => {
		const bytes = readFileSync(join(webRoot, 'static', relative));
		const revision = createHash('sha256').update(bytes).digest('hex');
		// The downloader requests assets with an integrity hash query, including offline.
		const query = relative.includes('/bundles/') ? `?v=${revision.slice(0, 16)}` : '';
		entries.push({ url: `${base}/${relative}${query}`, revision });
	};
	const catalogPath = 'official-plugins/catalog.json';
	const catalog = JSON.parse(readFileSync(join(webRoot, 'static', catalogPath), 'utf8')) as {
		manifests: string[];
	};
	add(catalogPath);
	for (const plugin of profile.preinstall) {
		const url = catalog.manifests.find((url) => url.endsWith(`/${plugin.id}.manifest.json`));
		if (!url) throw new Error(`Preinstall missing from official catalog: ${plugin.id}`);
		const manifestPath = posix.join('official-plugins', url);
		add(manifestPath);
		const manifest = JSON.parse(readFileSync(join(webRoot, 'static', manifestPath), 'utf8'));
		for (const field of ['bundleUrl', 'cssUrl', 'colorsUrl', 'iconThemeUrl']) {
			const assetUrl = manifest[field] as string | undefined;
			if (!assetUrl) continue;
			const assetPath = posix.join(posix.dirname(manifestPath), assetUrl);
			add(assetPath);
			if (field === 'colorsUrl') {
				const colors = JSON.parse(readFileSync(join(webRoot, 'static', assetPath), 'utf8'));
				if (colors.wallpaper) add(posix.join(posix.dirname(assetPath), colors.wallpaper.url));
			}
		}
	}
	return entries;
}

/** Read generated assets when PWA generation runs, after the client build. */
export async function* preinstallPrecacheEntries(
	webRoot: string,
	profile: ChronosProfile,
	base = ''
): AsyncGenerator<{ url: string; revision: string }, undefined, void> {
	const licensePath = join(webRoot, '.svelte-kit/output/client/licenses/third-party.json');
	if (!existsSync(licensePath)) throw new Error('Missing generated production licenses');
	const licenseRevision = createHash('sha256').update(readFileSync(licensePath)).digest('hex');
	yield { url: `${base}/licenses/third-party.json`, revision: licenseRevision };
	yield* preinstallPrecache(webRoot, profile, base);
}
