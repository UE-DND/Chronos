import { existsSync, readFileSync, readdirSync } from 'node:fs';
import { dirname, isAbsolute, relative, resolve } from 'node:path';

/** Only relative URLs within the market are valid build artifacts. */
export function resolveMarketFile(market: string, from: string, url: string): string {
	if (!url || isAbsolute(url) || /^[a-z]+:/i.test(url) || /[?#\\]/.test(url))
		throw new Error(`Invalid market resource URL: ${url}`);
	const path = resolve(dirname(from), url);
	const inside = relative(market, path);
	if (inside.startsWith('../') || inside === '..' || isAbsolute(inside))
		throw new Error(`Resource escapes market: ${url}`);
	return path;
}
export function marketFiles(market: string): { ids: string[]; files: string[] } {
	const catalogPath = resolve(market, 'catalog.json');
	const catalog = JSON.parse(readFileSync(catalogPath, 'utf8'));
	if (catalog.version !== 1 || !Array.isArray(catalog.manifests))
		throw new Error('Invalid market catalog');
	const files = new Set<string>(['catalog.json']);
	const ids: string[] = [];
	const add = (path: string) => {
		if (!existsSync(path)) throw new Error(`Missing market file: ${path}`);
		files.add(relative(market, path));
	};
	for (const url of catalog.manifests) {
		const path = resolveMarketFile(market, catalogPath, url);
		add(path);
		const manifest = JSON.parse(readFileSync(path, 'utf8'));
		if (
			typeof manifest.id !== 'string' ||
			!/^[a-z0-9-]+$/.test(manifest.id) ||
			!url.endsWith(`/${manifest.id}.manifest.json`) ||
			ids.includes(manifest.id)
		)
			throw new Error('Invalid or duplicate market plugin ID');
		ids.push(manifest.id);
		add(path.replace('.manifest.json', '.licenses.json'));
		for (const field of ['bundleUrl', 'cssUrl', 'colorsUrl', 'iconThemeUrl']) {
			if (!manifest[field]) continue;
			const asset = resolveMarketFile(market, path, manifest[field]);
			add(asset);
			if (field === 'colorsUrl') {
				const wallpaper = JSON.parse(readFileSync(asset, 'utf8')).wallpaper;
				if (wallpaper) add(resolveMarketFile(market, asset, wallpaper.url));
			}
		}
	}
	return { ids, files: [...files].sort() };
}

export function listMarketFiles(directory: string): string[] {
	return readdirSync(directory, { recursive: true, withFileTypes: true })
		.filter((file) => {
			if (!file.isFile() && !file.isDirectory())
				throw new Error('Market cannot contain symlinks or special files');
			return file.isFile();
		})
		.map((file) => relative(directory, resolve(file.parentPath, file.name)))
		.sort();
}
