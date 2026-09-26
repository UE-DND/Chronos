import { createHash } from 'node:crypto';
import {
	appendFileSync,
	cpSync,
	existsSync,
	mkdirSync,
	mkdtempSync,
	readFileSync,
	readdirSync,
	renameSync,
	rmSync,
	writeFileSync
} from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { marketFiles, resolveMarketFile, listMarketFiles } from './market-files.ts';
import { OFFICIAL_PLUGINS } from '../official-plugins.config.ts';
import { verifyOfficialPlugins } from './verify-official-plugins.ts';

const versionPattern = /^\d+\.\d+\.\d+$/;
const sha = (bytes: Uint8Array) => createHash('sha256').update(bytes).digest('hex');
interface PluginRelease {
	version: string;
	commit: string;
	files: Record<string, string>;
}
function releaseFiles(market: string): Record<string, string> {
	return Object.fromEntries(
		marketFiles(market).files.map((file) => [file, sha(readFileSync(resolve(market, file)))])
	);
}
export function verifyPluginRelease(directory: string, version: string): void {
	// Historical snapshots are checked by integrity, not the current release's CSS fingerprints.
	verifyOfficialPlugins(directory, false);
	const release = JSON.parse(
		readFileSync(resolve(directory, 'release.json'), 'utf8')
	) as PluginRelease;
	if (
		release.version !== version ||
		!/^[a-f0-9]{40}$/.test(release.commit) ||
		JSON.stringify(release.files) !== JSON.stringify(releaseFiles(directory))
	)
		throw new Error(`Invalid plugin release: ${version}`);
	if (
		JSON.stringify(listMarketFiles(directory)) !==
		JSON.stringify([...Object.keys(release.files), 'release.json'].sort())
	)
		throw new Error(`Unreferenced release files: ${version}`);
	const catalog = JSON.parse(readFileSync(resolve(directory, 'catalog.json'), 'utf8'));
	for (const url of catalog.manifests) {
		const manifest = JSON.parse(
			readFileSync(resolveMarketFile(directory, resolve(directory, 'catalog.json'), url), 'utf8')
		);
		if (manifest.version !== version) throw new Error(`Plugin version mismatch in ${version}`);
	}
}
/** Append an immutable snapshot and assemble a complete Pages deployment. */
export function stagePluginRelease(
	market: string,
	history: string,
	site: string,
	version: string,
	commit: string
): string {
	if (!versionPattern.test(version) || !/^[a-f0-9]{40}$/.test(commit))
		throw new Error('Invalid release version or commit');
	verifyOfficialPlugins(market);
	const release: PluginRelease = { version, commit, files: releaseFiles(market) };
	const releases = resolve(history, 'releases');
	mkdirSync(releases, { recursive: true });
	const destination = resolve(releases, version);
	if (existsSync(destination)) {
		verifyPluginRelease(destination, version);
		if (
			JSON.stringify(JSON.parse(readFileSync(resolve(destination, 'release.json'), 'utf8'))) !==
			JSON.stringify(release)
		)
			throw new Error(`Plugin release conflict: ${version}`);
	} else {
		const staging = mkdtempSync(resolve(history, '.release-'));
		try {
			for (const file of Object.keys(release.files)) {
				mkdirSync(dirname(resolve(staging, file)), { recursive: true });
				cpSync(resolve(market, file), resolve(staging, file));
			}
			writeFileSync(resolve(staging, 'release.json'), JSON.stringify(release, null, '\t') + '\n');
			verifyPluginRelease(staging, version);
			renameSync(staging, destination);
		} finally {
			rmSync(staging, { recursive: true, force: true });
		}
	}
	const versions = readdirSync(releases).sort((a, b) =>
		a.localeCompare(b, undefined, { numeric: true })
	);
	for (const version of versions) {
		if (!versionPattern.test(version)) throw new Error(`Invalid history directory: ${version}`);
		verifyPluginRelease(resolve(releases, version), version);
	}
	const output = resolve(site, 'plugins/releases');
	rmSync(output, { recursive: true, force: true });
	cpSync(releases, output, { recursive: true });
	if (existsSync(resolve(history, 'android')))
		cpSync(resolve(history, 'android'), resolve(site, 'android'), { recursive: true });
	return versions.filter((item) => item !== version).at(-1) ?? '';
}

/** Probe the published catalog, every manifest, and one payload per release. */
export async function smokePluginRelease(
	base: string,
	version: string,
	fetcher: typeof fetch = fetch
): Promise<void> {
	if (!versionPattern.test(version)) throw new Error('Invalid smoke-test version');
	const root = new URL(`${version}/`, base.endsWith('/') ? base : `${base}/`);
	const get = async (path: string) => {
		const url = new URL(path, root);
		if (url.origin !== root.origin || !url.pathname.startsWith(root.pathname))
			throw new Error('Published resource escapes release');
		const response = await fetcher(url, { signal: AbortSignal.timeout(20_000), cache: 'no-store' });
		if (!response.ok)
			throw new Error(`Published resource unavailable: ${url} (${response.status})`);
		return new Uint8Array(await response.arrayBuffer());
	};
	const release = JSON.parse(new TextDecoder().decode(await get('release.json'))) as PluginRelease;
	if (release.version !== version) throw new Error('Published release version mismatch');
	const verified = async (path: string) => {
		const bytes = await get(path);
		const key = new URL(path, root).pathname.slice(root.pathname.length);
		if (sha(bytes) !== release.files[key])
			throw new Error(`Published resource integrity mismatch: ${path}`);
		return bytes;
	};
	const catalog = JSON.parse(new TextDecoder().decode(await verified('catalog.json')));
	if (catalog.version !== 1 || !Array.isArray(catalog.manifests) || !catalog.manifests.length)
		throw new Error('Invalid published catalog');
	let payloadVerified = false;
	for (const path of catalog.manifests) {
		const manifest = JSON.parse(new TextDecoder().decode(await verified(path)));
		if (manifest.version !== version || !path.endsWith(`/${manifest.id}.manifest.json`))
			throw new Error('Published manifest identity mismatch');
		if (!payloadVerified) {
			const resource = manifest.bundleUrl ?? manifest.colorsUrl;
			const url = new URL(resource, new URL(path, root));
			const bytes = await verified(url.href);
			if (sha(bytes) !== (manifest.sha256 ?? manifest.colorsSha256))
				throw new Error('Published payload integrity mismatch');
			payloadVerified = true;
		}
	}
}
if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
	const [command, ...args] = process.argv.slice(2);
	if (command === 'stage' && args.length === 5) {
		if (
			JSON.stringify(marketFiles(args[0]!).ids.sort()) !==
			JSON.stringify(OFFICIAL_PLUGINS.map((plugin) => plugin.id).sort())
		)
			throw new Error('Release catalog must contain every official plugin');
		const previous = stagePluginRelease(args[0]!, args[1]!, args[2]!, args[3]!, args[4]!);
		if (process.env.GITHUB_OUTPUT)
			appendFileSync(process.env.GITHUB_OUTPUT, `previous=${previous}\n`);
	} else if (command === 'smoke' && args.length >= 2) {
		for (const version of args.slice(1).filter(Boolean)) {
			for (let attempt = 0; ; attempt++) {
				try {
					await smokePluginRelease(args[0]!, version);
					break;
				} catch (error) {
					if (attempt === 5) throw error;
					await new Promise((done) => setTimeout(done, 5000));
				}
			}
		}
	} else
		throw new Error(
			'Usage: plugin-release.ts stage <market> <history> <site> <version> <commit> | smoke <base> <version> [previous]'
		);
}
