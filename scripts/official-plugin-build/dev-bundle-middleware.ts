import { existsSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import type { Connect } from 'vite';
import { OFFICIAL_PLUGINS } from '../official-plugins.config.ts';
import { createOfficialPluginBuildPaths } from './paths.ts';

const DEV_BUNDLE_WITH_REV_PATH =
	/^\/official-plugins\/bundles\/([^/]+)\/([^/]+)\/(bundle\.js|bundle\.css|colors\.json|icons\.json|wallpaper\.image)$/;

export function createDevOfficialPluginBundleMiddleware(
	monorepoRoot: string
): Connect.NextHandleFunction {
	const paths = createOfficialPluginBuildPaths(monorepoRoot);

	return (req, res, next) => {
		const url = req.url?.split('?')[0] ?? '';
		const manifest = /^\/official-plugins\/manifests\/([a-z0-9-]+)\.manifest\.json$/.exec(url);
		if (url === '/official-plugins/catalog.json' || manifest) {
			res.setHeader('Content-Type', 'application/json; charset=utf-8');
			res.setHeader('Cache-Control', 'no-store');
			if (manifest) {
				const path = paths.devManifestPath(manifest[1]);
				if (!existsSync(path)) {
					res.statusCode = 404;
					res.end('Not Found');
					return;
				}
				res.end(readFileSync(path, 'utf8'));
			} else
				res.end(
					JSON.stringify({
						version: 1,
						updatedAt: 0,
						manifests: OFFICIAL_PLUGINS.map(
							(plugin) => `/official-plugins/manifests/${plugin.id}.manifest.json`
						)
					})
				);
			return;
		}
		const match = DEV_BUNDLE_WITH_REV_PATH.exec(url);
		if (!match) {
			next();
			return;
		}

		const [, pluginId, rev, fileName] = match;
		if (!/^[a-z0-9-]+$/.test(pluginId) || !/^[a-zA-Z0-9-]+$/.test(rev)) {
			res.statusCode = 400;
			res.end('Invalid asset path');
			return;
		}
		const filePath = resolve(paths.devRevDir(pluginId, rev), fileName);
		if (!existsSync(filePath)) {
			res.statusCode = 404;
			res.end('Not Found');
			return;
		}

		const content =
			fileName === 'wallpaper.image' ? readFileSync(filePath) : readFileSync(filePath, 'utf8');
		const contentType =
			fileName === 'wallpaper.image'
				? 'application/octet-stream'
				: fileName.endsWith('.css')
					? 'text/css; charset=utf-8'
					: fileName.endsWith('.js')
						? 'text/javascript; charset=utf-8'
						: 'application/json; charset=utf-8';

		res.statusCode = 200;
		res.setHeader('Content-Type', contentType);
		res.setHeader('Cache-Control', 'no-cache');
		res.end(content);
	};
}
