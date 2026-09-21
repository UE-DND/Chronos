import type { Plugin } from 'vite';
import { createHash } from 'node:crypto';
import { readFileSync, readdirSync, existsSync } from 'node:fs';
import { join } from 'node:path';
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
	for (const plugin of profile.preinstall) {
		add(`official-plugins/manifests/${plugin.id}.manifest.json`);
		const walk = (relative: string) => {
			for (const entry of readdirSync(join(webRoot, 'static', relative), { withFileTypes: true })) {
				const path = `${relative}/${entry.name}`;
				if (entry.isDirectory()) walk(path);
				else add(path);
			}
		};
		walk(`official-plugins/bundles/${plugin.id}`);
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
