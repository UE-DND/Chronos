import {
	assertReleaseContent,
	compareReleaseVersions
} from '../../apps/web/src/lib/content/releases/release.ts';
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
	statSync,
	writeFileSync
} from 'node:fs';
import { tmpdir } from 'node:os';
import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { createHostIdentity } from '../../apps/web/scripts/build-config/host-identity.ts';
import {
	OFFICIAL_IOS_BUNDLE_ID,
	pinnedIosIpaUrl,
	selectIosUpdate,
	type IosProfileUpdate,
	type IosStableUpdate,
	type WebHostUpdate
} from '../../packages/core/src/types/host-update.ts';
import { iosBuildNumber } from '../versioning.ts';
import { MOBILE_PROFILES, mobileArtifactBaseName } from './mobile-profiles.ts';
import { previousReleaseTag, renderGitHubReleaseNotes } from '../release-notes.ts';

const digest = (file: string) => createHash('sha256').update(readFileSync(file)).digest('hex');

export interface IpaInfo {
	bundleId: string;
	version: string;
	build: string;
	minimumOsVersion: string;
}

/** Reads the app metadata from an IPA. Only release builds on macOS need this. */
export function extractIpaInfo(ipa: string): IpaInfo {
	if (process.platform !== 'darwin')
		throw new Error('IPA inspection requires macOS (unzip and plutil)');
	const plist = execFileSync('unzip', ['-p', ipa, 'Payload/App.app/Info.plist'], {
		maxBuffer: 16 * 1024 * 1024
	});
	const temporary = mkdtempSync(resolve(tmpdir(), 'chronos-ipa-info-'));
	try {
		const plistPath = resolve(temporary, 'Info.plist');
		writeFileSync(plistPath, plist);
		const parsed = JSON.parse(
			execFileSync('plutil', ['-convert', 'json', '-o', '-', plistPath], {
				encoding: 'utf8'
			})
		) as Record<string, unknown>;
		const read = (key: string) => (typeof parsed[key] === 'string' ? parsed[key] : '');
		return {
			bundleId: read('CFBundleIdentifier'),
			version: read('CFBundleShortVersionString'),
			build: read('CFBundleVersion'),
			minimumOsVersion: read('MinimumOSVersion')
		};
	} finally {
		rmSync(temporary, { recursive: true, force: true });
	}
}

export function assertIpaIdentity(info: IpaInfo, descriptor: WebHostUpdate): void {
	if (info.bundleId !== OFFICIAL_IOS_BUNDLE_ID)
		throw new Error(`IPA bundle identifier mismatch: ${info.bundleId || '<empty>'}`);
	if (info.version !== descriptor.host.version)
		throw new Error(
			`IPA version ${info.version || '<empty>'} does not match ${descriptor.host.version}`
		);
	if (info.build !== iosBuildNumber(descriptor.host.version))
		throw new Error(
			`IPA build ${info.build || '<empty>'} does not match ${iosBuildNumber(descriptor.host.version)}`
		);
	if (!/^(0|[1-9]\d*)\.(0|[1-9]\d*)(?:\.(0|[1-9]\d*))?$/.test(info.minimumOsVersion))
		throw new Error(`IPA has an invalid MinimumOSVersion: ${info.minimumOsVersion || '<empty>'}`);
}

export function inspectIosArtifact(
	ipa: string,
	descriptor: WebHostUpdate,
	info: IpaInfo = extractIpaInfo(ipa)
): IosProfileUpdate {
	if (
		descriptor.host.target !== 'mobile' ||
		!MOBILE_PROFILES.includes(descriptor.host.profileId as (typeof MOBILE_PROFILES)[number])
	)
		throw new Error('Invalid iOS host descriptor');
	const version = descriptor.host.version;
	if (descriptor.release.tagName !== `v${version}`)
		throw new Error('iOS release tag and host version differ');
	assertIpaIdentity(info, descriptor);
	return {
		host: descriptor.host,
		ipaUrl: pinnedIosIpaUrl(descriptor.host.profileId, version, descriptor.release.tagName),
		sha256: digest(ipa),
		sizeBytes: statSync(ipa).size,
		pluginCatalogUrl: descriptor.pluginCatalogUrl,
		minimumOsVersion: info.minimumOsVersion
	};
}

export function validateIosRelease(release: IosStableUpdate): void {
	assertReleaseContent(release.release);
	if (release.bundleId !== OFFICIAL_IOS_BUNDLE_ID) throw new Error('Invalid iOS bundle identifier');
	if (
		JSON.stringify(Object.keys(release.profiles).sort()) !==
		JSON.stringify([...MOBILE_PROFILES].sort())
	)
		throw new Error('Every iOS profile must be ready');
	let commit: string | undefined;
	for (const id of MOBILE_PROFILES) {
		const entry = selectIosUpdate(release, id, OFFICIAL_IOS_BUNDLE_ID);
		if (commit && commit !== entry.host.sourceCommit) throw new Error('Mixed iOS source commits');
		commit = entry.host.sourceCommit;
	}
}

export function collectIosRelease(directory: string): IosStableUpdate {
	const artifacts = MOBILE_PROFILES.map((id) => {
		const flavor = id.replace(/^chronos-/, '');
		const files = readdirSync(directory).filter((file) =>
			new RegExp(`^Chronos-${flavor}-\\d+\\.\\d+\\.\\d+\\.json$`).test(file)
		);
		if (files.length !== 1) throw new Error(`Expected one iOS artifact record for ${id}`);
		const metadata = JSON.parse(readFileSync(resolve(directory, files[0]), 'utf8')) as {
			entry: IosProfileUpdate;
			release: IosStableUpdate['release'];
		};
		assertReleaseContent(metadata.release);
		const ipa = resolve(directory, files[0].replace(/\.json$/, '.ipa'));
		if (digest(ipa) !== metadata.entry.sha256 || statSync(ipa).size !== metadata.entry.sizeBytes)
			throw new Error('IPA integrity mismatch');
		return metadata;
	});
	const first = artifacts[0];
	if (artifacts.some((item) => JSON.stringify(item.release) !== JSON.stringify(first.release)))
		throw new Error('Conflicting iOS release metadata');
	const release: IosStableUpdate = {
		formatVersion: 1,
		release: first.release,
		bundleId: OFFICIAL_IOS_BUNDLE_ID,
		profiles: Object.fromEntries(artifacts.map((item) => [item.entry.host.profileId, item.entry]))
	};
	validateIosRelease(release);
	return release;
}

export function stageIosRelease(history: string, site: string, release: IosStableUpdate): void {
	validateIosRelease(release);
	const directory = resolve(history, 'ios/releases');
	mkdirSync(directory, { recursive: true });
	const record = resolve(directory, `${release.release.tagName}.json`);
	const json = JSON.stringify(release, null, '\t') + '\n';
	if (existsSync(record) && readFileSync(record, 'utf8') !== json)
		throw new Error('Immutable iOS release conflict');
	writeFileSync(record, json);
	const releases = readdirSync(directory).map((file) => {
		return JSON.parse(readFileSync(resolve(directory, file), 'utf8')) as IosStableUpdate;
	});
	releases.sort((a, b) => compareReleaseVersions(b.release.tagName, a.release.tagName));
	validateIosRelease(releases[0]);
	writeFileSync(
		resolve(history, 'ios/stable.json'),
		JSON.stringify(releases[0], null, '\t') + '\n'
	);
	cpSync(resolve(history, 'ios'), resolve(site, 'ios'), { recursive: true });
}

function github(repository: string) {
	return (args: string[]) =>
		execFileSync('gh', [...args, '--repo', repository], {
			encoding: 'utf8',
			stdio: ['ignore', 'pipe', 'pipe']
		});
}

/**
 * Downloads a previously published IPA and its metadata when a release retry
 * should not rebuild the whole Xcode archive. The identity must match exactly.
 */
export function reuseIosArtifact(
	directory: string,
	repository: string,
	tag: string,
	profileId: string,
	commit: string,
	expectedBuildId: string
): boolean {
	const gh = github(repository);
	let release: { assets: { name: string }[] };
	try {
		release = JSON.parse(gh(['release', 'view', tag, '--json', 'assets']));
	} catch (error) {
		if (String((error as { stderr?: unknown }).stderr).includes('release not found')) return false;
		throw error;
	}
	const baseName = mobileArtifactBaseName(profileId, tag.slice(1));
	const ipaName = `${baseName}.ipa`;
	const metadataName = `${baseName}.json`;
	const hasIpa = release.assets.some((asset) => asset.name === ipaName);
	const hasMetadata = release.assets.some((asset) => asset.name === metadataName);
	if (!hasIpa && !hasMetadata) return false;
	if (!hasIpa || !hasMetadata)
		throw new Error('Partial iOS artifact upload; rebuild the IPA and repair the draft');
	mkdirSync(directory, { recursive: true });
	for (const file of [ipaName, metadataName])
		gh(['release', 'download', tag, '--pattern', file, '--dir', directory]);
	const metadata = JSON.parse(readFileSync(resolve(directory, metadataName), 'utf8')) as {
		entry: IosProfileUpdate;
		release: IosStableUpdate['release'];
	};
	const entry = metadata.entry;
	const ipa = resolve(directory, ipaName);
	if (
		entry.host.sourceCommit !== commit ||
		entry.host.buildId !== expectedBuildId ||
		entry.host.profileId !== profileId ||
		metadata.release.tagName !== tag ||
		entry.ipaUrl !== pinnedIosIpaUrl(profileId, tag.slice(1), tag) ||
		digest(ipa) !== entry.sha256 ||
		statSync(ipa).size !== entry.sizeBytes
	)
		throw new Error('Existing iOS artifact identity mismatch');
	return true;
}

/**
 * Adds IPA assets to an existing release (Android publication normally creates
 * it first). Assets are immutable: an existing asset must match byte-for-byte.
 * Missing assets may still be added while publication is incomplete.
 */
export function publishIosRelease(directory: string, repository: string): IosStableUpdate {
	const release = collectIosRelease(directory);
	const tag = release.release.tagName;
	const gh = github(repository);
	let existing: { isDraft: boolean; assets: { name: string }[] } | undefined;
	try {
		existing = JSON.parse(gh(['release', 'view', tag, '--json', 'isDraft,assets']));
	} catch (error) {
		if (!String((error as { stderr?: unknown }).stderr).includes('release not found')) throw error;
	}
	const temporary = mkdtempSync(resolve(tmpdir(), 'chronos-ios-release-'));
	try {
		if (!existing) {
			const notesPath = resolve(temporary, 'notes.md');
			const releases = JSON.parse(
				gh(['release', 'list', '--limit', '100', '--json', 'tagName,isDraft,isPrerelease'])
			) as { tagName: string; isDraft: boolean; isPrerelease: boolean }[];
			const previous = previousReleaseTag(
				releases.filter((r) => !r.isDraft && !r.isPrerelease).map((r) => r.tagName),
				tag
			);
			writeFileSync(notesPath, renderGitHubReleaseNotes(release, repository, previous));
			gh([
				'release',
				'create',
				tag,
				'--draft',
				'--verify-tag',
				'--title',
				release.release.name,
				'--notes-file',
				notesPath
			]);
			existing = { isDraft: true, assets: [] };
		}
		const ipaFiles = readdirSync(directory)
			.filter((file) => file.endsWith('.ipa'))
			.sort();
		if (ipaFiles.length !== MOBILE_PROFILES.length)
			throw new Error('Expected one IPA for every profile');
		const metadataFiles = ipaFiles.map((file) => file.replace(/\.ipa$/, '.json'));
		const recordPath = resolve(directory, 'ios-release.json');
		writeFileSync(recordPath, JSON.stringify(release, null, '\t') + '\n');
		const checksumEntries = [...ipaFiles, ...metadataFiles]
			.map((file) => `${digest(resolve(directory, file))}  ${file}\n`)
			.sort();
		const checksumPath = resolve(directory, 'SHA256SUMS.ios');
		writeFileSync(checksumPath, checksumEntries.join(''));
		const uploadFiles = [...ipaFiles, ...metadataFiles, 'ios-release.json', 'SHA256SUMS.ios'];
		for (const file of uploadFiles) {
			if (existing.assets.some((asset) => asset.name === file)) {
				gh(['release', 'download', tag, '--pattern', file, '--dir', temporary]);
				if (digest(resolve(temporary, file)) !== digest(resolve(directory, file)))
					throw new Error(`Published iOS artifact conflict: ${file}`);
			} else {
				gh(['release', 'upload', tag, resolve(directory, file)]);
			}
		}
		const complete = JSON.parse(gh(['release', 'view', tag, '--json', 'isDraft,assets'])) as {
			isDraft: boolean;
			assets: { name: string }[];
		};
		if (uploadFiles.some((file) => !complete.assets.some((asset) => asset.name === file)))
			throw new Error('iOS release upload incomplete');
		if (complete.isDraft) gh(['release', 'edit', tag, '--draft=false', '--latest=false']);
		return release;
	} finally {
		rmSync(temporary, { recursive: true, force: true });
	}
}

/** Waits for Pages propagation, then verifies the published feed and IPA links. */
export async function smokeIosFeed(baseUrl: string, expected: IosStableUpdate): Promise<void> {
	const origin = baseUrl.replace(/\/$/, '');
	for (let attempt = 0; ; attempt++) {
		try {
			const response = await fetch(`${origin}/ios/stable.json?t=${Date.now()}`, {
				cache: 'no-store'
			});
			if (!response.ok) throw new Error(`iOS feed returned HTTP ${response.status}`);
			const actual = (await response.json()) as IosStableUpdate;
			validateIosRelease(actual);
			if (JSON.stringify(actual) !== JSON.stringify(expected))
				throw new Error('Published iOS feed differs from the release record');
			for (const entry of Object.values(actual.profiles)) {
				const ipa = await fetch(entry.ipaUrl, { method: 'HEAD', redirect: 'manual' });
				if (![200, 302].includes(ipa.status))
					throw new Error(`iOS package is unavailable: ${entry.ipaUrl}`);
			}
			return;
		} catch (error) {
			if (attempt >= 11) throw error;
			await new Promise((done) => setTimeout(done, 5000));
		}
	}
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
	const [command, ...args] = process.argv.slice(2);
	if (command === 'inspect' && args.length === 2) {
		const descriptor = JSON.parse(readFileSync(args[1], 'utf8')) as WebHostUpdate;
		const entry = inspectIosArtifact(args[0], descriptor);
		const metadataPath = args[0].replace(/\.ipa$/i, '.json');
		if (metadataPath === args[0]) throw new Error('Expected an .ipa input');
		writeFileSync(
			metadataPath,
			JSON.stringify({ entry, release: descriptor.release }, null, '\t') + '\n'
		);
	} else if (command === 'reuse' && args.length === 5) {
		const reused = reuseIosArtifact(
			args[0],
			args[1],
			args[2],
			args[3],
			args[4],
			createHostIdentity(process.cwd()).buildId
		);
		if (process.env.GITHUB_OUTPUT)
			writeFileSync(process.env.GITHUB_OUTPUT, `reused=${reused}\n`, { flag: 'a' });
	} else if (command === 'collect' && args.length === 2) {
		writeFileSync(args[1], JSON.stringify(collectIosRelease(args[0]), null, '\t') + '\n');
	} else if (command === 'stage' && args.length === 3) {
		stageIosRelease(args[0], args[1], JSON.parse(readFileSync(args[2], 'utf8')));
	} else if (command === 'publish' && args.length === 3) {
		const release = publishIosRelease(args[0], args[1]);
		writeFileSync(args[2], JSON.stringify(release, null, '\t') + '\n');
	} else if (command === 'smoke' && args.length === 2) {
		await smokeIosFeed(args[0], JSON.parse(readFileSync(args[1], 'utf8')));
	} else {
		throw new Error('Usage: ios-release.ts inspect|reuse|collect|stage|publish|smoke');
	}
}
