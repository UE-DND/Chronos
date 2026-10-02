import { describe, expect, it, vi } from 'vite-plus/test';
import { fetchLatestProjectRelease } from './release-feed-adapter';
import {
	setHostPlatform,
	resetHostPlatform,
	getDefaultWebPlatform
} from '$lib/platform/host-platform';

vi.mock('$lib/config/app-meta', () => ({
	ANDROID_SIGNING_CERTIFICATE: 'c'.repeat(64),
	HOST_BUILD: { version: '1.1.2', profileId: 'chronos-default' }
}));

const release = { tagName: 'v1.1.3', name: 'Chronos', body: '', publishedAt: '' };
const entry = {
	host: {
		target: 'mobile',
		profileId: 'chronos-default',
		deploymentId: 'mobile',
		version: '1.1.3',
		buildId: 'a'.repeat(64),
		sourceCommit: 'b'.repeat(40)
	},
	apkUrl: 'https://github.com/UE-DND/Chronos/releases/download/v1.1.3/Chronos-default-1.1.3.apk',
	sha256: 'd'.repeat(64),
	sizeBytes: 12345,
	pluginCatalogUrl: 'https://ue-dnd.github.io/Chronos/plugins/releases/1.1.3/catalog.json'
};
const feed = {
	formatVersion: 1,
	release,
	packageId: 'org.uednd.chronos',
	versionCode: 1001003,
	signingCertificateSha256: 'c'.repeat(64),
	profiles: { 'chronos-default': entry }
};

describe('Android release descriptor', () => {
	it('preserves the full selected artifact and verifies the actual installation', async () => {
		setHostPlatform({
			...getDefaultWebPlatform(),
			getAndroidInstallationIdentity: async () => ({
				packageId: feed.packageId,
				version: '1.1.2',
				versionCode: 1001002,
				signingCertificateSha256: feed.signingCertificateSha256
			})
		});
		try {
			const result = await fetchLatestProjectRelease(
				vi.fn(async () => ({
					ok: true,
					status: 200,
					json: async () => feed
				})) as unknown as typeof fetch,
				'https://ue-dnd.github.io/Chronos/android/stable.json',
				true
			);
			expect(result.ok).toBe(true);
			if (result.ok)
				expect(result.value.androidUpdate).toEqual({
					...entry,
					release,
					packageId: feed.packageId,
					versionCode: feed.versionCode,
					signingCertificateSha256: feed.signingCertificateSha256
				});
		} finally {
			resetHostPlatform();
		}
	});
	it('rejects a feed for an installation signed with a different certificate', async () => {
		setHostPlatform({
			...getDefaultWebPlatform(),
			getAndroidInstallationIdentity: async () => ({
				packageId: feed.packageId,
				version: '1.1.2',
				versionCode: 1001002,
				signingCertificateSha256: 'e'.repeat(64)
			})
		});
		try {
			const result = await fetchLatestProjectRelease(
				vi.fn(async () => ({
					ok: true,
					status: 200,
					json: async () => feed
				})) as unknown as typeof fetch,
				'https://ue-dnd.github.io/Chronos/android/stable.json',
				true
			);
			expect(result.ok).toBe(false);
		} finally {
			resetHostPlatform();
		}
	});
});
