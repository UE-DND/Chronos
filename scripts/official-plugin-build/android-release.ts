import { createHostIdentity } from '../../apps/web/scripts/build-config/host-identity.ts';
import { createHash } from 'node:crypto';
import { execFileSync } from 'node:child_process';
import {
	cpSync,
	existsSync,
	mkdirSync,
	mkdtempSync,
	readFileSync,
	readdirSync,
	rmSync,
	writeFileSync
} from 'node:fs';
import { tmpdir } from 'node:os';
import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import {
	androidVersionCode,
	selectAndroidUpdate,
	type AndroidStableUpdate,
	type AndroidProfileUpdate,
	type WebHostUpdate
} from '../../packages/core/src/types/host-update.ts';

export const ANDROID_PROFILES = [
	'chronos-default',
	'chronos-cqut',
	'chronos-cqut-offline'
] as const;
const digest = (file: string) => createHash('sha256').update(readFileSync(file)).digest('hex');
export function inspectAndroidArtifact(
	apk: string,
	descriptor: WebHostUpdate,
	certificate: string
): AndroidProfileUpdate {
	if (
		descriptor.host.target !== 'mobile' ||
		!ANDROID_PROFILES.includes(descriptor.host.profileId as (typeof ANDROID_PROFILES)[number])
	)
		throw new Error('Invalid Android host descriptor');
	const profileId = descriptor.host.profileId;
	const version = descriptor.host.version;
	validateCertificate(certificate);
	return {
		host: descriptor.host,
		apkUrl: `https://github.com/UE-DND/Chronos/releases/download/v${version}/Chronos-${profileId}-${version}.apk`,
		sha256: digest(apk),
		sizeBytes: readFileSync(apk).byteLength,
		pluginCatalogUrl: descriptor.pluginCatalogUrl
	};
}
function validateCertificate(value: string): void {
	if (!/^[a-f0-9]{64}$/.test(value)) throw new Error('Invalid signing certificate');
}
export function validateAndroidRelease(release: AndroidStableUpdate): void {
	if (
		JSON.stringify(Object.keys(release.profiles).sort()) !==
		JSON.stringify([...ANDROID_PROFILES].sort())
	)
		throw new Error('Every Android profile must be ready');
	let commit: string | undefined;
	for (const id of ANDROID_PROFILES) {
		const entry = selectAndroidUpdate(
			release,
			id,
			'org.uednd.chronos',
			release.signingCertificateSha256
		);
		if (commit && commit !== entry.host.sourceCommit)
			throw new Error('Mixed Android source commits');
		commit = entry.host.sourceCommit;
	}
}
export function collectAndroidRelease(directory: string): AndroidStableUpdate {
	const artifacts = ANDROID_PROFILES.map((id) => {
		const files = readdirSync(directory).filter((file) =>
			new RegExp(`^Chronos-${id}-\\d+\\.\\d+\\.\\d+\\.json$`).test(file)
		);
		if (files.length !== 1) throw new Error(`Expected one artifact record for ${id}`);
		const metadata = JSON.parse(readFileSync(resolve(directory, files[0]), 'utf8')) as {
			entry: AndroidProfileUpdate;
			release: AndroidStableUpdate['release'];
			certificate: string;
		};
		const apk = resolve(directory, files[0].replace(/\.json$/, '.apk'));
		if (
			digest(apk) !== metadata.entry.sha256 ||
			readFileSync(apk).byteLength !== metadata.entry.sizeBytes
		)
			throw new Error('APK integrity mismatch');
		return metadata;
	});
	const first = artifacts[0];
	if (
		artifacts.some(
			(item) =>
				item.certificate !== first.certificate ||
				JSON.stringify(item.release) !== JSON.stringify(first.release)
		)
	)
		throw new Error('Conflicting Android release metadata');
	const release: AndroidStableUpdate = {
		formatVersion: 1,
		release: first.release,
		packageId: 'org.uednd.chronos',
		versionCode: androidVersionCode(first.entry.host.version),
		signingCertificateSha256: first.certificate,
		profiles: Object.fromEntries(artifacts.map((item) => [item.entry.host.profileId, item.entry]))
	};
	validateAndroidRelease(release);
	return release;
}
export function stageAndroidRelease(
	history: string,
	site: string,
	release: AndroidStableUpdate
): void {
	validateAndroidRelease(release);
	const directory = resolve(history, 'android/releases');
	mkdirSync(directory, { recursive: true });
	const record = resolve(directory, `${release.release.tagName}.json`);
	const json = JSON.stringify(release, null, '\t') + '\n';
	if (existsSync(record) && readFileSync(record, 'utf8') !== json)
		throw new Error('Immutable Android release conflict');
	writeFileSync(record, json);
	const releases = readdirSync(directory).map((file) => {
		const item = JSON.parse(readFileSync(resolve(directory, file), 'utf8')) as AndroidStableUpdate;
		validateAndroidRelease(item);
		return item;
	});
	releases.sort((a, b) => b.versionCode - a.versionCode);
	writeFileSync(
		resolve(history, 'android/stable.json'),
		JSON.stringify(releases[0], null, '\t') + '\n'
	);
	cpSync(resolve(history, 'android'), resolve(site, 'android'), { recursive: true });
}

export async function smokeAndroidFeed(
	base: string,
	expected: AndroidStableUpdate,
	website: WebHostUpdate
): Promise<void> {
	const readJson = async (path: string) => {
		const response = await fetch(new URL(path, base), { cache: 'no-store' });
		if (!response.ok) throw new Error(`Published update resource unavailable: ${path}`);
		return response.json();
	};
	const feed = (await readJson('android/stable.json')) as AndroidStableUpdate;
	validateAndroidRelease(feed);
	if (feed.versionCode < expected.versionCode) throw new Error('Android feed has not advanced');
	const deployed = (await readJson('version.json')) as WebHostUpdate;
	if (JSON.stringify(deployed.host) !== JSON.stringify(website.host))
		throw new Error('Android feed publication changed the website build');
	for (const entry of Object.values(feed.profiles)) {
		const response = await fetch(entry.apkUrl, { method: 'HEAD', redirect: 'follow' });
		if (!response.ok) throw new Error('Ready feed points to an unavailable APK');
		const length = response.headers.get('content-length');
		if (length && Number(length) !== entry.sizeBytes)
			throw new Error('Published APK size mismatch');
		const catalog = await fetch(entry.pluginCatalogUrl, { cache: 'no-store' });
		if (!catalog.ok) throw new Error('Ready feed plugin catalog unavailable');
	}
}

export function reuseAndroidArtifact(
	directory: string,
	repository: string,
	tag: string,
	profileId: string,
	commit: string,
	certificate: string,
	expectedBuildId: string
): boolean {
	const gh = (args: string[]) =>
		execFileSync('gh', [...args, '--repo', repository], {
			encoding: 'utf8',
			stdio: ['ignore', 'pipe', 'pipe']
		});
	let release: { assets: { name: string }[] };
	try {
		release = JSON.parse(gh(['release', 'view', tag, '--json', 'assets']));
	} catch (error) {
		if (String((error as { stderr?: unknown }).stderr).includes('release not found')) return false;
		throw error;
	}
	const apkName = `Chronos-${profileId}-${tag.slice(1)}.apk`;
	const metadataName = apkName.replace(/\.apk$/, '.json');
	const hasApk = release.assets.some((asset) => asset.name === apkName);
	const hasMetadata = release.assets.some((asset) => asset.name === metadataName);
	if (!hasApk && !hasMetadata) return false;
	if (!hasApk || !hasMetadata)
		throw new Error(
			'Partial Android artifact upload; reuse the original CI artifact to repair the draft'
		);
	mkdirSync(directory, { recursive: true });
	for (const file of [apkName, metadataName])
		gh(['release', 'download', tag, '--pattern', file, '--dir', directory]);
	const metadata = JSON.parse(readFileSync(resolve(directory, metadataName), 'utf8'));
	if (
		metadata.entry.host.sourceCommit !== commit ||
		metadata.entry.host.buildId !== expectedBuildId ||
		metadata.entry.host.profileId !== profileId ||
		metadata.certificate !== certificate ||
		metadata.entry.sha256 !== digest(resolve(directory, apkName))
	)
		throw new Error('Existing Android artifact identity mismatch');
	return true;
}

/** Reuse an existing draft or published artifact only when its bytes exactly match. */
export function publishAndroidRelease(directory: string, repository: string): AndroidStableUpdate {
	const release = collectAndroidRelease(directory);
	const tag = release.release.tagName;
	const gh = (args: string[]) =>
		execFileSync('gh', [...args, '--repo', repository], {
			encoding: 'utf8',
			stdio: ['ignore', 'pipe', 'pipe']
		});
	let existing: { isDraft: boolean; assets: { name: string }[] } | undefined;
	try {
		existing = JSON.parse(gh(['release', 'view', tag, '--json', 'isDraft,assets']));
	} catch (error) {
		if (!String((error as { stderr?: unknown }).stderr).includes('release not found')) throw error;
	}
	if (!existing)
		gh([
			'release',
			'create',
			tag,
			'--draft',
			'--verify-tag',
			'--title',
			release.release.name,
			'--notes',
			release.release.body
		]);
	const temporary = mkdtempSync(resolve(tmpdir(), 'chronos-release-'));
	try {
		for (const file of readdirSync(directory).filter((file) => /\.(apk|json)$/.test(file))) {
			if (existing?.assets.some((asset) => asset.name === file)) {
				gh(['release', 'download', tag, '--pattern', file, '--dir', temporary]);
				if (digest(resolve(temporary, file)) !== digest(resolve(directory, file)))
					throw new Error(`Published artifact conflict: ${file}`);
			} else {
				if (existing && !existing.isDraft)
					throw new Error('A published release cannot be repaired by replacing APK assets');
				gh(['release', 'upload', tag, resolve(directory, file)]);
			}
		}
		const complete = JSON.parse(gh(['release', 'view', tag, '--json', 'isDraft,assets']));
		if (
			readdirSync(directory).some(
				(file) => !complete.assets.some((asset: { name: string }) => asset.name === file)
			)
		)
			throw new Error('Release upload incomplete');
		if (complete.isDraft) gh(['release', 'edit', tag, '--draft=false', '--latest=false']);
		return release;
	} finally {
		rmSync(temporary, { recursive: true, force: true });
	}
}
if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
	const [command, ...args] = process.argv.slice(2);
	if (command === 'inspect' && args.length === 3) {
		const descriptor = JSON.parse(readFileSync(args[1], 'utf8')) as WebHostUpdate;
		const entry = inspectAndroidArtifact(args[0], descriptor, args[2]);
		writeFileSync(
			args[0].replace(/\.apk$/, '.json'),
			JSON.stringify({ entry, release: descriptor.release, certificate: args[2] }, null, '\t') +
				'\n'
		);
	} else if (command === 'reuse' && args.length === 6) {
		const reused = reuseAndroidArtifact(
			args[0],
			args[1],
			args[2],
			args[3],
			args[4],
			args[5],
			createHostIdentity(process.cwd()).buildId
		);
		if (process.env.GITHUB_OUTPUT)
			writeFileSync(process.env.GITHUB_OUTPUT, `reused=${reused}\n`, { flag: 'a' });
	} else if (command === 'publish' && args.length === 3) {
		const release = publishAndroidRelease(args[0], args[1]);
		writeFileSync(args[2], JSON.stringify(release, null, '\t') + '\n');
	} else if (command === 'stage' && args.length === 3)
		stageAndroidRelease(args[0], args[1], JSON.parse(readFileSync(args[2], 'utf8')));
	else if (command === 'smoke' && args.length === 3) {
		for (let attempt = 0; ; attempt++) {
			try {
				await smokeAndroidFeed(
					args[0],
					JSON.parse(readFileSync(args[1], 'utf8')),
					JSON.parse(readFileSync(args[2], 'utf8'))
				);
				break;
			} catch (error) {
				if (attempt >= 11) throw error;
				await new Promise((resolve) => setTimeout(resolve, 5000));
			}
		}
	} else
		throw new Error(
			'Usage: android-release.ts inspect <apk> <host-version.json> <certificate> | reuse <artifacts> <repository> <tag> <profile> <commit> <certificate> | publish <artifacts> <repository> <record> | stage <history> <site> <record> | smoke <website-base> <android-record> <web-descriptor>'
		);
}
