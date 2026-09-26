import { afterEach, describe, expect, it, vi } from 'vite-plus/test';
import { mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { execFileSync } from 'node:child_process';
import { tmpdir } from 'node:os';
import { resolve } from 'node:path';
import {
	ANDROID_PROFILES,
	collectAndroidRelease,
	publishAndroidRelease,
	stageAndroidRelease,
	validateAndroidRelease
} from './android-release';
import type { AndroidStableUpdate } from '../../packages/core/src/types/host-update';

const temporary: string[] = [];
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
		const name = `Chronos-${id}-1.0.3`;
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
		release: { tagName, name: version, body: '', publishedAt: '2026-09-26' },
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
					apkUrl: `https://github.com/UE-DND/Chronos/releases/download/${tagName}/Chronos-${profileId}-${version}.apk`,
					sha256: 'd'.repeat(64),
					sizeBytes: 100,
					pluginCatalogUrl: `https://ue-dnd.github.io/Chronos/plugins/releases/${version}/catalog.json`
				}
			])
		)
	};
}
describe('ready Android publishing', () => {
	it('collects CQUT and CQUT offline independently and rejects corrupted APK bytes', () => {
		const directory = artifacts();
		expect(Object.keys(collectAndroidRelease(directory).profiles)).toEqual([...ANDROID_PROFILES]);
		writeFileSync(resolve(directory, 'Chronos-chronos-cqut-offline-1.0.3.apk'), 'corrupt');
		expect(() => collectAndroidRelease(directory)).toThrow('APK integrity mismatch');
	});
	it('keeps a release draft when an upload fails and never publishes a partial set', () => {
		const directory = artifacts();
		const calls: string[][] = [];
		vi.mocked(execFileSync).mockImplementation(((_file: unknown, args: string[]) => {
			calls.push(args);
			if (args[1] === 'view') return JSON.stringify({ isDraft: true, assets: [] });
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
});
