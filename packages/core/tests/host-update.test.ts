import { describe, expect, it } from 'vite-plus/test';
import { selectAndroidUpdate, validateWebUpdate } from '../src/types/host-update';

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
});
