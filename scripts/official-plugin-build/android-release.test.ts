import { renderGitHubReleaseNotes } from '../release-notes';
import { afterEach, describe, expect, it, vi } from 'vite-plus/test';
import { mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { execFileSync } from 'node:child_process';
import { tmpdir } from 'node:os';
import { resolve } from 'node:path';
import {
	ANDROID_PROFILES,
	androidArtifactBaseName,
	collectAndroidRelease,
	publishAndroidRelease,
	stageAndroidRelease,
	validateAndroidRelease
} from './android-release';
import type { AndroidStableUpdate } from '../../packages/core/src/types/host-update';

const temporary: string[] = [];
const androidReleaseWorkflow = readFileSync(
	new URL('../../.github/workflows/release.yml', import.meta.url),
	'utf8'
);
vi.mock('node:child_process', () => ({ execFileSync: vi.fn() }));
afterEach(() => {
	vi.resetAllMocks();
	for (const path of temporary.splice(0)) rmSync(path, { recursive: true, force: true });
});
function artifacts(): string {
	const directory = mkdtempSync(resolve(tmpdir(), 'chronos-apks-'));
	temporary.push(directory);
	const value = release('1.0.3');
	for (const id of ANDROID_PROFILES) {
		const bytes = Buffer.from(`signed test artifact ${id}`);
		const entry = value.profiles[id];
		entry.sha256 = createHash('sha256').update(bytes).digest('hex');
		entry.sizeBytes = bytes.length;
		const name = androidArtifactBaseName(id, '1.0.3');
		writeFileSync(resolve(directory, `${name}.apk`), bytes);
		writeFileSync(
			resolve(directory, `${name}.json`),
			JSON.stringify({ entry, release: value.release, certificate: value.signingCertificateSha256 })
		);
	}
	return directory;
}
function release(version: string): AndroidStableUpdate {
	const tagName = `v${version}`;
	return {
		formatVersion: 1,
		release: {
			tagName,
			name: `Chronos ${version}`,
			body: '## 修复\n\n- 修复课程显示。',
			publishedAt: '2026-09-26'
		},
		packageId: 'org.uednd.chronos',
		versionCode: 1_000_000 + Number(version.split('.')[2]),
		signingCertificateSha256: 'c'.repeat(64),
		profiles: Object.fromEntries(
			ANDROID_PROFILES.map((profileId) => [
				profileId,
				{
					host: {
						version,
						profileId,
						buildId: 'a'.repeat(64),
						sourceCommit: 'b'.repeat(40),
						target: 'mobile',
						deploymentId: 'mobile'
					},
					apkUrl: `https://github.com/UE-DND/Chronos/releases/download/${tagName}/${androidArtifactBaseName(profileId, version)}.apk`,
					sha256: 'd'.repeat(64),
					sizeBytes: 100,
					pluginCatalogUrl: `https://ue-dnd.github.io/Chronos/plugins/releases/${version}/catalog.json`
				}
			])
		)
	};
}
describe('ready Android publishing', () => {
	it('adds profile downloads and comparison only to GitHub notes', () => {
		const value = release('1.0.3');
		const original = JSON.stringify(value);
		const body = renderGitHubReleaseNotes(value, 'UE-DND/Chronos', 'v1.0.2');
		expect(body).toContain(value.release.body);
		for (const entry of Object.values(value.profiles)) expect(body).toContain(entry.apkUrl);
		expect(body).toContain('重庆理工大学在线版');
		expect(body).toContain('不含知行理工在线同步');
		expect(body).toContain('/compare/v1.0.2...v1.0.3');
		expect(JSON.stringify(value)).toBe(original);
		expect(renderGitHubReleaseNotes(value, 'UE-DND/Chronos')).toContain('/commits/v1.0.3');
	});
	it.each(['new', 'draft', 'published'])(
		'handles %s releases without modifying feed prose or public notes',
		(state) => {
			const directory = artifacts();
			let notes = '';
			let views = 0;
			vi.mocked(execFileSync).mockImplementation(((_file: unknown, args: string[]) => {
				if (args[1] === 'list')
					return JSON.stringify([{ tagName: 'v1.0.2', isDraft: false, isPrerelease: false }]);
				if (args[1] === 'view') {
					if (views++ === 0 && state === 'new')
						throw Object.assign(new Error('not found'), { stderr: 'release not found' });
					return JSON.stringify({
						isDraft: state !== 'published',
						assets: [
							...ANDROID_PROFILES.flatMap((id) =>
								['apk', 'json'].map((ext) => ({
									name: `${androidArtifactBaseName(id, '1.0.3')}.${ext}`
								}))
							),
							{ name: 'SHA256SUMS' }
						]
					});
				}
				if (args[1] === 'download') {
					const file = args[args.indexOf('--pattern') + 1];
					writeFileSync(
						resolve(args[args.indexOf('--dir') + 1], file),
						readFileSync(resolve(directory, file))
					);
				}
				if (args[1] === 'edit' || args[1] === 'create')
					notes = readFileSync(args[args.indexOf('--notes-file') + 1], 'utf8');
				return '';
			}) as typeof execFileSync);
			const result = publishAndroidRelease(directory, 'UE-DND/Chronos');
			if (state === 'published') {
				expect(notes).toBe('');
				expect(
					vi
						.mocked(execFileSync)
						.mock.calls.some(
							([, args]) => Array.isArray(args) && ['edit', 'create', 'upload'].includes(args[1])
						)
				).toBe(false);
			} else {
				expect(notes).toContain('/compare/v1.0.2...v1.0.3');
				expect(notes).toContain('## 下载与安装');
			}
			expect(result.release.body).toBe(release('1.0.3').release.body);
			const checksums = readFileSync(resolve(directory, 'SHA256SUMS'), 'utf8');
			for (const id of ANDROID_PROFILES) {
				expect(checksums).toContain(`${androidArtifactBaseName(id, '1.0.3')}.apk`);
				expect(checksums).toContain(`${androidArtifactBaseName(id, '1.0.3')}.json`);
			}
		}
	);
	it('requires Firebase Android configuration for official Android builds', () => {
		expect(androidReleaseWorkflow).toContain(
			'test -s apps/mobile/android/app/google-services.json'
		);
		expect(androidReleaseWorkflow).toContain("== 'org.uednd.chronos'");
		expect(androidReleaseWorkflow.indexOf('Validate Android Firebase configuration')).toBeLessThan(
			androidReleaseWorkflow.indexOf('Reuse immutable Android artifacts on retry')
		);
		for (const profileId of ANDROID_PROFILES) {
			expect(androidReleaseWorkflow).toContain(`profile: ${profileId}`);
		}
	});

	it('collects CQUT and CQUT offline independently and rejects corrupted APK bytes', () => {
		const directory = artifacts();
		expect(Object.keys(collectAndroidRelease(directory).profiles)).toEqual([...ANDROID_PROFILES]);
		writeFileSync(resolve(directory, 'Chronos-cqut-offline-1.0.3.apk'), 'corrupt');
		expect(() => collectAndroidRelease(directory)).toThrow('APK integrity mismatch');
	});
	it('keeps a release draft when an upload fails and never publishes a partial set', () => {
		const directory = artifacts();
		const calls: string[][] = [];
		vi.mocked(execFileSync).mockImplementation(((_file: unknown, args: string[]) => {
			calls.push(args);
			if (args[1] === 'view') return JSON.stringify({ isDraft: true, assets: [] });
			if (args[1] === 'list') return '[]';
			if (args[1] === 'upload') throw new Error('upload failed');
			return '';
		}) as typeof execFileSync);
		expect(() => publishAndroidRelease(directory, 'UE-DND/Chronos')).toThrow('upload failed');
		expect(calls.some((args) => args[1] === 'edit')).toBe(false);
		expect(calls.some((args) => args.includes('--clobber'))).toBe(false);
	});
	it('refuses to add missing APK assets to an already public release', () => {
		const directory = artifacts();
		vi.mocked(execFileSync).mockReturnValue(JSON.stringify({ isDraft: false, assets: [] }));
		expect(() => publishAndroidRelease(directory, 'UE-DND/Chronos')).toThrow(
			'A published release cannot be repaired'
		);
		expect(vi.mocked(execFileSync).mock.calls).toHaveLength(1);
	});
	it('requires every profile from the same source commit before publishing', () => {
		const value = release('1.0.3');
		delete value.profiles['chronos-cqut-offline'];
		expect(() => validateAndroidRelease(value)).toThrow('Every Android profile');
		const mixed = release('1.0.3');
		mixed.profiles['chronos-cqut'].host.sourceCommit = 'e'.repeat(40);
		expect(() => validateAndroidRelease(mixed)).toThrow('Mixed Android source');
	});
	it('retains the highest complete stable release when the website is rolled back', () => {
		const root = mkdtempSync(resolve(tmpdir(), 'chronos-ready-feed-'));
		temporary.push(root);
		stageAndroidRelease(resolve(root, 'history'), resolve(root, 'site'), release('1.0.3'));
		stageAndroidRelease(resolve(root, 'history'), resolve(root, 'site'), release('1.0.2'));
		const feed = JSON.parse(readFileSync(resolve(root, 'site/android/stable.json'), 'utf8'));
		expect(feed.release.tagName).toBe('v1.0.3');
		const conflict = release('1.0.3');
		conflict.profiles['chronos-default'].sha256 = 'f'.repeat(64);
		expect(() =>
			stageAndroidRelease(resolve(root, 'history'), resolve(root, 'site'), conflict)
		).toThrow('Immutable Android release conflict');
		expect(
			JSON.parse(readFileSync(resolve(root, 'site/android/stable.json'), 'utf8')).release.tagName
		).toBe('v1.0.3');
	});
	it('preserves superseded records without applying current APK naming rules to them', () => {
		const root = mkdtempSync(resolve(tmpdir(), 'chronos-ready-feed-'));
		temporary.push(root);
		const history = resolve(root, 'history');
		const site = resolve(root, 'site');
		mkdirSync(resolve(history, 'android/releases'), { recursive: true });
		const archived = release('1.0.1');
		for (const id of ANDROID_PROFILES) {
			archived.profiles[id].apkUrl =
				`https://github.com/UE-DND/Chronos/releases/download/v1.0.1/Chronos-${id}-1.0.1.apk`;
		}
		const record = resolve(history, 'android/releases/v1.0.1.json');
		const bytes = JSON.stringify(archived, null, '\t') + '\n';
		writeFileSync(record, bytes);
		stageAndroidRelease(history, site, release('1.0.3'));
		stageAndroidRelease(history, site, release('1.0.2'));
		expect(readFileSync(record, 'utf8')).toBe(bytes);
		expect(JSON.parse(readFileSync(resolve(site, 'android/stable.json'), 'utf8'))).toEqual(
			release('1.0.3')
		);
	});
	it('still rejects a highest historical record that fails current installation rules', () => {
		const root = mkdtempSync(resolve(tmpdir(), 'chronos-ready-feed-'));
		temporary.push(root);
		const history = resolve(root, 'history');
		const site = resolve(root, 'site');
		stageAndroidRelease(history, site, release('1.0.2'));
		const invalid = release('1.0.4');
		invalid.profiles['chronos-default'].apkUrl =
			'https://github.com/another/repository/releases/download/v1.0.4/Chronos-default-1.0.4.apk';
		writeFileSync(resolve(history, 'android/releases/v1.0.4.json'), JSON.stringify(invalid));
		expect(() => stageAndroidRelease(history, site, release('1.0.3'))).toThrow(
			'Invalid pinned Android artifact'
		);
		expect(JSON.parse(readFileSync(resolve(site, 'android/stable.json'), 'utf8'))).toEqual(
			release('1.0.2')
		);
	});
});
