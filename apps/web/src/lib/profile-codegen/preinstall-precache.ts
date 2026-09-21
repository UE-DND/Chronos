import type { Plugin } from 'vite';
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
		add(url.slice(1));
		const manifest = JSON.parse(readFileSync(join(webRoot, 'static', url), 'utf8'));
		for (const field of ['bundleUrl', 'cssUrl', 'colorsUrl', 'iconThemeUrl']) {
			const assetUrl = manifest[field] as string | undefined;
			if (!assetUrl) continue;
			add(assetUrl.slice(1));
			if (field === 'colorsUrl') {
				const colors = JSON.parse(readFileSync(join(webRoot, 'static', assetUrl), 'utf8'));
				if (colors.wallpaper)
					add(posix.join(posix.dirname(assetUrl), colors.wallpaper.url).slice(1));
			}
		}
	}
	return entries;
}

/** Extend additional entries without replacing SvelteKit's URL normalization transform. */
export function preinstallPrecachePlugin(
	webRoot: string,
	profile: ChronosProfile,
	base = ''
): Plugin {
	let serverBuild = false;
	let api:
		| {
				extendManifestEntries: (
					extend: (
						entries: Array<string | { url: string; revision?: string | null }>
					) => Array<string | { url: string; revision?: string | null }>
				) => void;
		  }
		| undefined;
	return {
		name: 'chronos-preinstall-precache',
		configResolved(config) {
			serverBuild = Boolean(config.build.ssr);
			api = config.plugins.find((plugin) => plugin.name === 'vite-plugin-pwa')?.api;
		},
		writeBundle: {
			order: 'post',
			sequential: true,
			handler() {
				if (!serverBuild) return;
				if (!api) throw new Error('PWA manifest extension API is unavailable');
				api.extendManifestEntries((entries) => {
					const licensePath = join(webRoot, '.svelte-kit/output/client/licenses/third-party.json');
					if (!existsSync(licensePath)) throw new Error('Missing generated production licenses');
					const licenseRevision = createHash('sha256')
						.update(readFileSync(licensePath))
						.digest('hex');
					return [
						{ url: `${base}/licenses/third-party.json`, revision: licenseRevision },
						...entries,
						...preinstallPrecache(webRoot, profile, base)
					];
				});
			}
		}
	};
}
