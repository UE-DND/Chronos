import { describe, expect, it } from 'vite-plus/test';
import {
	OFFICIAL_IOS_BUNDLE_ID,
	compareIosVersions,
	iosVersionAtLeast,
	selectAndroidUpdate,
	selectIosUpdate,
	validateWebUpdate
} from '../src/types/host-update';

const host = {
	version: '1.0.3',
	buildId: 'a'.repeat(64),
	sourceCommit: 'b'.repeat(40),
	profileId: 'chronos-default',
	deploymentId: 'pages',
	target: 'pages' as const
};
const release = { tagName: 'v1.0.3', name: '1.0.3', publishedAt: '2026-09-26', body: '' };
const feed = {
	formatVersion: 1,
	release,
	packageId: 'org.uednd.chronos',
	versionCode: 1000003,
	signingCertificateSha256: 'c'.repeat(64),
	profiles: {
		'chronos-default': {
			host: { ...host, target: 'mobile', deploymentId: 'mobile' },
			apkUrl:
				'https://github.com/UE-DND/Chronos/releases/download/v1.0.3/Chronos-default-1.0.3.apk',
			sha256: 'd'.repeat(64),
			sizeBytes: 100,
			pluginCatalogUrl: 'https://ue-dnd.github.io/Chronos/plugins/releases/1.0.3/catalog.json'
		},
		'chronos-cqut': {
			host: { ...host, profileId: 'chronos-cqut', target: 'mobile', deploymentId: 'mobile' },
			apkUrl: 'https://github.com/UE-DND/Chronos/releases/download/v1.0.3/Chronos-cqut-1.0.3.apk',
			sha256: 'e'.repeat(64),
			sizeBytes: 100,
			pluginCatalogUrl: 'https://ue-dnd.github.io/Chronos/plugins/releases/1.0.3/catalog.json'
		}
	}
};
const iosFeed = {
	formatVersion: 1,
	release,
	bundleId: 'org.uednd.chronos',
	profiles: {
		'chronos-default': {
			host: { ...host, target: 'mobile' as const, deploymentId: 'mobile' },
			ipaUrl:
				'https://github.com/UE-DND/Chronos/releases/download/v1.0.3/Chronos-default-1.0.3.ipa',
			sha256: 'd'.repeat(64),
			sizeBytes: 100,
			pluginCatalogUrl: 'https://ue-dnd.github.io/Chronos/plugins/releases/1.0.3/catalog.json',
			minimumOsVersion: '17.4'
		},
		'chronos-cqut': {
			host: {
				...host,
				profileId: 'chronos-cqut',
				target: 'mobile' as const,
				deploymentId: 'mobile'
			},
			ipaUrl: 'https://github.com/UE-DND/Chronos/releases/download/v1.0.3/Chronos-cqut-1.0.3.ipa',
			sha256: 'e'.repeat(64),
			sizeBytes: 100,
			pluginCatalogUrl: 'https://ue-dnd.github.io/Chronos/plugins/releases/1.0.3/catalog.json',
			minimumOsVersion: '17.4'
		}
	}
};

describe('published host updates', () => {
	it('selects only the installed Android profile and signing identity', () => {
		expect(
			selectAndroidUpdate(feed, 'chronos-cqut', 'org.uednd.chronos', 'c'.repeat(64)).apkUrl
		).toContain('Chronos-cqut-1.0.3.apk');
		expect(() =>
			selectAndroidUpdate(feed, 'missing', 'org.uednd.chronos', 'c'.repeat(64))
		).toThrow();
		expect(() =>
			selectAndroidUpdate(feed, 'chronos-default', 'other.app', 'c'.repeat(64))
		).toThrow();
		expect(() =>
			selectAndroidUpdate(feed, 'chronos-default', 'org.uednd.chronos', 'f'.repeat(64))
		).toThrow();
	});
	it('rejects conflicting release identities and unpinned APK links', () => {
		expect(() =>
			selectAndroidUpdate(
				{ ...feed, versionCode: 1 },
				'chronos-default',
				feed.packageId,
				feed.signingCertificateSha256
			)
		).toThrow();
		expect(() =>
			selectAndroidUpdate(
				{
					...feed,
					profiles: {
						'chronos-default': {
							...feed.profiles['chronos-default'],
							apkUrl: 'https://github.com/UE-DND/Chronos/releases/latest'
						}
					}
				},
				'chronos-default',
				feed.packageId,
				feed.signingCertificateSha256
			)
		).toThrow();
	});
	it('accepts a website rollback but rejects a different profile or target', () => {
		const update = {
			formatVersion: 1,
			host,
			release,
			requiredPluginIds: ['theme-m3'],
			pluginCatalogUrl: feed.profiles['chronos-default'].pluginCatalogUrl
		};
		expect(
			validateWebUpdate(update, { ...host, version: '1.0.4', buildId: 'f'.repeat(64) }).host.version
		).toBe('1.0.3');
		expect(() => validateWebUpdate(update, { ...host, profileId: 'chronos-cqut' })).toThrow();
		expect(() => validateWebUpdate(update, { ...host, target: 'mobile' })).toThrow();
	});
	it.each([
		'http://github.com/UE-DND/Chronos/releases/download/v1.0.3/Chronos-default-1.0.3.apk',
		'https://github.com:444/UE-DND/Chronos/releases/download/v1.0.3/Chronos-default-1.0.3.apk',
		'https://user@github.com/UE-DND/Chronos/releases/download/v1.0.3/Chronos-default-1.0.3.apk',
		'https://github.com/UE-DND/Chronos/releases/download/v1.0.3/Chronos-default-1.0.3.apk?token=x',
		'https://github.com/UE-DND/Chronos/releases/download/v1.0.3/Chronos-default-1.0.3.apk#fragment',
		'https://github.com/UE-DND/Chronos/releases/download/v1.0.3/Chronos-cqut-1.0.3.apk',
		'https://example.com/UE-DND/Chronos/releases/download/v1.0.3/Chronos-default-1.0.3.apk'
	])('rejects an APK URL outside the pinned profile artifact: %s', (apkUrl) => {
		const candidate = structuredClone(feed);
		candidate.profiles['chronos-default'].apkUrl = apkUrl;
		expect(() =>
			selectAndroidUpdate(
				candidate,
				'chronos-default',
				feed.packageId,
				feed.signingCertificateSha256
			)
		).toThrow('Invalid pinned Android artifact');
	});

	it.each([{ sha256: 'invalid' }, { sizeBytes: 0 }, { sizeBytes: 1.5 }, { sizeBytes: Infinity }])(
		'rejects invalid APK integrity metadata: %j',
		(patch) => {
			const candidate = structuredClone(feed);
			Object.assign(candidate.profiles['chronos-default'], patch);
			expect(() =>
				selectAndroidUpdate(
					candidate,
					'chronos-default',
					feed.packageId,
					feed.signingCertificateSha256
				)
			).toThrow('Invalid pinned Android artifact');
		}
	);

	it('selects a pinned IPA without a signing certificate', () => {
		const selected = selectIosUpdate(iosFeed, 'chronos-cqut', OFFICIAL_IOS_BUNDLE_ID);
		expect(selected.ipaUrl).toContain('Chronos-cqut-1.0.3.ipa');
		expect(selected.minimumOsVersion).toBe('17.4');
		expect(selected).not.toHaveProperty('signingCertificateSha256');
	});

	it('rejects a changed bundle id, another profile, an unpinned IPA, and an older iOS version', () => {
		expect(() => selectIosUpdate(iosFeed, 'chronos-default', 'com.example.resign')).toThrow(
			'bundle_mismatch'
		);
		expect(() => selectIosUpdate(iosFeed, 'missing', OFFICIAL_IOS_BUNDLE_ID)).toThrow(
			'profile_unavailable'
		);
		expect(() =>
			selectIosUpdate(iosFeed, 'chronos-default', OFFICIAL_IOS_BUNDLE_ID, '17.3')
		).toThrow('os_too_old');
		expect(() =>
			selectIosUpdate(iosFeed, 'chronos-default', OFFICIAL_IOS_BUNDLE_ID, '17.4')
		).not.toThrow();
		const unpinned = structuredClone(iosFeed);
		unpinned.profiles['chronos-default'].ipaUrl =
			'https://github.com/UE-DND/Chronos/releases/latest';
		expect(() => selectIosUpdate(unpinned, 'chronos-default', OFFICIAL_IOS_BUNDLE_ID)).toThrow(
			'invalid_artifact'
		);
	});

	it('compares dotted iOS versions with missing patch components', () => {
		expect(compareIosVersions('17.4', '17.4.0')).toBe(0);
		expect(compareIosVersions('17.4.1', '17.4')).toBe(1);
		expect(compareIosVersions('17.3.9', '17.4')).toBeLessThan(0);
		expect(iosVersionAtLeast('18.0', '17.4')).toBe(true);
		expect(iosVersionAtLeast('17.3', '17.4')).toBe(false);
		expect(iosVersionAtLeast('invalid', '17.4')).toBe(false);
	});
});
