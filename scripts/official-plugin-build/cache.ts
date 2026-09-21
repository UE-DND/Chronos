import { createHash, randomUUID } from 'node:crypto';
import {
	existsSync,
	mkdirSync,
	readFileSync,
	realpathSync,
	readdirSync,
	renameSync,
	statSync,
	writeFileSync
} from 'node:fs';
import { basename, dirname, join, resolve } from 'node:path';

export interface BuildInputs {
	files: Record<string, string>;
	directories: Record<string, string>;
	scans: Record<string, string>;
}
export interface BuildCache<T> {
	key: string;
	inputs: BuildInputs;
	value: T;
	digest: string;
}
export const digest = (value: string | Uint8Array): string =>
	createHash('sha256').update(value).digest('hex');
const relevant = (path: string) =>
	/\.(?:[cm]?[jt]sx?|svelte|css|json|svg|png|webp|jpe?g|avif|woff2?)$/.test(path) &&
	!/(?:^|\/)(?:tests|node_modules|dist)\/|\.(?:test|spec)\./.test(path);
function fileDigest(path: string): string {
	try {
		return digest(readFileSync(path));
	} catch {
		return 'missing';
	}
}
function directoryDigest(path: string, recursive: boolean): string {
	try {
		const entries: string[] = [];
		for (const item of readdirSync(path, { withFileTypes: true }).sort((a, b) =>
			a.name.localeCompare(b.name)
		)) {
			if (['node_modules', 'dist', 'tests', '.git'].includes(item.name)) continue;
			const full = join(path, item.name);
			if (item.isDirectory())
				entries.push(`${item.name}/:${recursive ? directoryDigest(full, true) : ''}`);
			else if (relevant(full)) entries.push(`${item.name}:${recursive ? fileDigest(full) : ''}`);
		}
		return digest(JSON.stringify(entries));
	} catch {
		return 'missing';
	}
}
export function canonicalPath(path: string): string {
	try {
		return realpathSync(path);
	} catch {
		try {
			return join(realpathSync(dirname(path)), basename(path));
		} catch {
			return resolve(path);
		}
	}
}
export function snapshotInputs(
	files: string[],
	directories: string[],
	scans: string[]
): BuildInputs {
	return {
		files: Object.fromEntries(
			[...new Set(files.map(canonicalPath))].sort().map((path) => [path, fileDigest(path)])
		),
		directories: Object.fromEntries(
			[...new Set(directories.map(canonicalPath))]
				.sort()
				.map((path) => [path, directoryDigest(path, false)])
		),
		scans: Object.fromEntries(
			[...new Set(scans.map(canonicalPath))]
				.sort()
				.map((path) => [path, directoryDigest(path, true)])
		)
	};
}
export function inputAffected(inputs: BuildInputs, path: string): boolean {
	path = canonicalPath(path);
	if (Object.hasOwn(inputs.files, path)) return true;
	if (!relevant(path)) return false;
	return (
		Object.hasOwn(inputs.directories, dirname(path)) ||
		Object.keys(inputs.scans).some((dir) => path.startsWith(`${dir}/`))
	);
}
export function readBuildCache<T>(path: string, key: string): BuildCache<T> | null {
	try {
		const record = JSON.parse(readFileSync(path, 'utf8')) as BuildCache<T>;
		if (record.key !== key || digest(JSON.stringify(record.value)) !== record.digest) return null;
		const current = snapshotInputs(
			Object.keys(record.inputs.files),
			Object.keys(record.inputs.directories),
			Object.keys(record.inputs.scans)
		);
		return JSON.stringify(current) === JSON.stringify(record.inputs) ? record : null;
	} catch {
		return null;
	}
}
export function atomicWrite(path: string, contents: string | Uint8Array): void {
	mkdirSync(dirname(path), { recursive: true });
	const temporary = `${path}.${randomUUID()}.tmp`;
	writeFileSync(temporary, contents);
	renameSync(temporary, path);
}
export function writeChanged(path: string, contents: string | Uint8Array): void {
	try {
		if (digest(readFileSync(path)) === digest(contents)) return;
	} catch {
		/* first write */
	}
	atomicWrite(path, contents);
}
export function writeBuildCache<T>(
	path: string,
	key: string,
	files: string[],
	directories: string[],
	scans: string[],
	value: T
): BuildCache<T> {
	const record = {
		key,
		inputs: snapshotInputs(files, directories, scans),
		value,
		digest: digest(JSON.stringify(value))
	};
	atomicWrite(path, JSON.stringify(record));
	return record;
}
export function buildConfigurationKey(root: string, extra: unknown): string {
	const files = [
		'pnpm-lock.yaml',
		'package.json',
		'apps/web/package.json',
		'scripts/resolve-chronos-aliases.ts',
		'apps/web/src/lib/legal/bundled-licenses.ts',
		'apps/web/src/lib/legal/third-party-license-generator.ts'
	];
	for (const file of readdirSync(resolve(root, 'apps/web')))
		if (/^\.env(?:\.|$)/.test(file)) files.push(`apps/web/${file}`);
	const buildDir = resolve(root, 'scripts/official-plugin-build');
	for (const file of readdirSync(buildDir))
		if (file.endsWith('.ts') && !file.includes('.test.'))
			files.push(`scripts/official-plugin-build/${file}`);
	for (const parent of ['packages', 'packages/plugins']) {
		for (const name of readdirSync(resolve(root, parent))) {
			const path = `${parent}/${name}/package.json`;
			if (existsSync(resolve(root, path))) files.push(path);
		}
	}
	return digest(
		JSON.stringify({
			node: process.version,
			environment: Object.fromEntries(
				Object.entries(process.env)
					.filter(([key]) => /^(PUBLIC_|VITE_)/.test(key))
					.sort(([a], [b]) => a.localeCompare(b))
			),
			files: files.map((file) => [file, fileDigest(resolve(root, file))]),
			extra
		})
	);
}
export function captureBuildInputs(ids: string[]): {
	files: string[];
	directories: string[];
	scans: string[];
} {
	const files = ids
		.map((id) => id.split('?')[0])
		.filter(
			(id): id is string =>
				Boolean(id) && !id.startsWith('\0') && existsSync(id) && statSync(id).isFile()
		);
	const directories = files.filter((file) => !file.includes('/node_modules/')).map(dirname);
	const scans: string[] = [];
	for (const file of files.filter((file) => file.endsWith('.css'))) {
		const css = readFileSync(file, 'utf8');
		for (const match of css.matchAll(/@source\s+['"]([^'"]+)['"]/g)) {
			const scan = resolve(dirname(file), match[1]);
			if (existsSync(scan) && statSync(scan).isDirectory()) scans.push(scan);
			else files.push(scan);
		}
	}
	return { files, directories, scans };
}
