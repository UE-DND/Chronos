import { afterEach, describe, expect, it } from 'vite-plus/test';
import { mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { tmpdir } from 'node:os';
import { resolve } from 'node:path';
import { OFFICIAL_IOS_BUNDLE_ID, selectIosUpdate } from '../../packages/core/src/types/host-update';
import { ANDROID_PROFILES, androidArtifactBaseName } from './android-release';
import { assertIpaIdentity, collectIosRelease, stageIosRelease } from './ios-release';
import type { IosStableUpdate } from '../../packages/core/src/types/host-update';

const temporary: string[] = [];
afterEach(() => {
	for (const path of temporary.splice(0)) rmSync(path, { recursive: true, force: true });
});

function release(version: string): IosStableUpdate {
	const tagName = `v${version}`;
	return {
		formatVersion: 1,
		release: {
			tagName,
			name: `Chronos ${version}`,
			body: '## 修复\n\n- 修复课程显示。',
			publishedAt: '2026-10-24'
		},
		bundleId: OFFICIAL_IOS_BUNDLE_ID,
		profiles: Object.fromEntries(
			ANDROID_PROFILES.map((profileId) => [
				profileId,
				{
					host: {
						version,
						profileId,
						buildId: 'a'.repeat(64),
						sourceCommit: 'b'.repeat(40),
						target: 'mobile' as const,
						deploymentId: 'mobile'
					},
					ipaUrl: `https://github.com/UE-DND/Chronos/releases/download/${tagName}/${androidArtifactBaseName(profileId, version)}.ipa`,
					sha256: 'd'.repeat(64),
					sizeBytes: 100,
					pluginCatalogUrl: `https://ue-dnd.github.io/Chronos/plugins/releases/${version}/catalog.json`,
					minimumOsVersion: '17.4'
				}
			])
		)
	};
}

describe('iOS release feed', () => {
	it('collects pinned IPAs and stages the newest ready feed', () => {
		const directory = mkdtempSync(resolve(tmpdir(), 'chronos-ipas-'));
		temporary.push(directory);
		const value = release('1.2.11');
		for (const id of ANDROID_PROFILES) {
			const bytes = Buffer.from(`ipa ${id}`);
			const entry = value.profiles[id];
			entry.sha256 = createHash('sha256').update(bytes).digest('hex');
			entry.sizeBytes = bytes.length;
			const name = androidArtifactBaseName(id, '1.2.11');
			writeFileSync(resolve(directory, `${name}.ipa`), bytes);
			writeFileSync(
				resolve(directory, `${name}.json`),
				JSON.stringify({ entry, release: value.release })
			);
		}
		const collected = collectIosRelease(directory);
		expect(selectIosUpdate(collected, 'chronos-cqut', OFFICIAL_IOS_BUNDLE_ID).ipaUrl).toContain(
			'Chronos-cqut-1.2.11.ipa'
		);
		const root = mkdtempSync(resolve(tmpdir(), 'chronos-ios-site-'));
		temporary.push(root);
		mkdirSync(resolve(root, 'history'), { recursive: true });
		mkdirSync(resolve(root, 'site'), { recursive: true });
		stageIosRelease(resolve(root, 'history'), resolve(root, 'site'), collected);
		expect(
			JSON.parse(readFileSync(resolve(root, 'site/ios/stable.json'), 'utf8')).release.tagName
		).toBe('v1.2.11');
	});

	it('rejects an IPA whose build number does not match the release version', () => {
		const value = release('1.2.11');
		const descriptor = {
			formatVersion: 1 as const,
			host: value.profiles['chronos-default'].host,
			release: value.release,
			requiredPluginIds: [],
			pluginCatalogUrl: value.profiles['chronos-default'].pluginCatalogUrl
		};
		const info = {
			bundleId: OFFICIAL_IOS_BUNDLE_ID,
			version: '1.2.11',
			build: '1',
			minimumOsVersion: '17.4'
		};
		expect(() => assertIpaIdentity(info, descriptor)).toThrow('IPA build 1 does not match 1002011');
		expect(() => assertIpaIdentity({ ...info, build: '1002011' }, descriptor)).not.toThrow();
	});
});
