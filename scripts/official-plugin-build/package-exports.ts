import { existsSync } from 'node:fs';
import { relative, resolve } from 'node:path';

/** Resolve a package export target and ensure it stays inside the package. */
export function resolvePackageExport(
	packageDir: string,
	exports: Record<string, unknown>,
	key: string
): string {
	const entry = exports[key];
	const target =
		typeof entry === 'string'
			? entry
			: entry && typeof entry === 'object'
				? (entry as { import?: unknown }).import
				: undefined;
	if (typeof target !== 'string' || !target.startsWith('./')) {
		throw new Error(`Invalid ${key} package export`);
	}
	const file = resolve(packageDir, target);
	const inside = relative(packageDir, file);
	if (!inside || inside === '..' || inside.startsWith('../') || inside.startsWith('..\\')) {
		throw new Error(`Invalid ${key} package export target`);
	}
	if (!existsSync(file)) throw new Error(`Missing ${key} package export target: ${file}`);
	return file;
}
