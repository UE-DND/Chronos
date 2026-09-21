import { existsSync, readFileSync, realpathSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { OFFICIAL_PLUGINS } from '../../../../../scripts/official-plugins.config.ts';
import {
	digest,
	readBuildCache,
	writeBuildCache
} from '../../../../../scripts/official-plugin-build/cache.ts';
import type { BundledLicenseInfo } from './third-party-license-generator.ts';

export function declaredDevelopmentLicenses(root: string): BundledLicenseInfo[] {
	const cachePath = resolve(root, 'dist/plugin-cache/dev-licenses.json');
	const collectorFiles = [
		resolve(root, 'apps/web/src/lib/legal/dev-licenses.ts'),
		resolve(root, 'scripts/official-plugin-build/cache.ts')
	];
	const key = digest(
		JSON.stringify([process.version, ...collectorFiles.map((file) => readFileSync(file, 'utf8'))])
	);
	const cached = readBuildCache<BundledLicenseInfo[]>(cachePath, key);
	if (cached) return cached.value;
	const files = [
		resolve(root, 'pnpm-lock.yaml'),
		resolve(root, 'scripts/official-plugins.config.ts')
	];
	const visited = new Set<string>();
	const licenses: BundledLicenseInfo[] = [];
	function locate(from: string, name: string): string | undefined {
		let dir = from;
		while (true) {
			const modules = resolve(dir, 'node_modules');
			const candidate = resolve(modules, name, 'package.json');
			files.push(candidate);
			if (existsSync(candidate)) return dirname(realpathSync(candidate));
			const parent = dirname(dir);
			if (parent === dir) return;
			dir = parent;
		}
	}
	function visit(directory: string) {
		const dir = realpathSync(directory);
		if (visited.has(dir)) return;
		visited.add(dir);
		const path = resolve(dir, 'package.json');
		files.push(path);
		const pkg = JSON.parse(readFileSync(path, 'utf8')) as {
			name: string;
			version?: string;
			license?: string | { type?: string };
			dependencies?: Record<string, string>;
			optionalDependencies?: Record<string, string>;
			peerDependencies?: Record<string, string>;
		};
		if (!pkg.name.startsWith('@chronos/'))
			licenses.push({
				name: pkg.name,
				version: pkg.version ?? '',
				license: typeof pkg.license === 'string' ? pkg.license : (pkg.license?.type ?? '')
			});
		for (const name of Object.keys({
			...pkg.dependencies,
			...pkg.optionalDependencies,
			...pkg.peerDependencies
		})) {
			const dependency = locate(dir, name);
			if (dependency) visit(dependency);
			else if (pkg.dependencies?.[name] && !pkg.optionalDependencies?.[name])
				throw new Error(`Missing runtime dependency ${name} in ${pkg.name}`);
		}
	}
	visit(resolve(root, 'apps/web'));
	for (const plugin of OFFICIAL_PLUGINS) visit(resolve(root, 'packages/plugins', plugin.sourceDir));
	writeBuildCache(cachePath, key, files, [], [], licenses);
	return licenses;
}
