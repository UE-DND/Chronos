import { describe, expect, it, vi } from 'vite-plus/test';
import { OFFICIAL_IOS_BUNDLE_ID } from '@chronos/core';
import { fetchLatestProjectRelease } from './release-feed-adapter';
import {
	setHostPlatform,
	resetHostPlatform,
	getDefaultWebPlatform
} from '#lib/platform/host-platform.ts';

vi.mock('#lib/config/app-meta.ts', () => ({
	ANDROID_SIGNING_CERTIFICATE: '',
	HOST_BUILD: { version: '1.1.2', profileId: 'chronos-default' }
}));

const release = { tagName: 'v1.1.3', name: 'Chronos', body: '', publishedAt: '' };
const entry = {
	host: {
		target: 'mobile' as const,
		profileId: 'chronos-default',
		deploymentId: 'mobile',
		version: '1.1.3',
		buildId: 'a'.repeat(64),
		sourceCommit: 'b'.repeat(40)
	},
	ipaUrl: 'https://github.com/UE-DND/Chronos/releases/download/v1.1.3/Chronos-default-1.1.3.ipa',
	sha256: 'd'.repeat(64),
	sizeBytes: 12345,
	pluginCatalogUrl: 'https://ue-dnd.github.io/Chronos/plugins/releases/1.1.3/catalog.json',
	minimumOsVersion: '17.4'
};
const feed = {
	formatVersion: 1,
	release,
	bundleId: OFFICIAL_IOS_BUNDLE_ID,
	profiles: { 'chronos-default': entry }
};

describe('iOS release descriptor', () => {
	it('selects the IPA for the installed bundle and profile', async () => {
		setHostPlatform({
			...getDefaultWebPlatform(),
			getIosInstallationIdentity: async () => ({
				bundleId: OFFICIAL_IOS_BUNDLE_ID,
				version: '1.1.2',
				build: '1001002',
				osVersion: '18.0'
			})
		});
		try {
			const result = await fetchLatestProjectRelease(
				vi.fn(async () => ({
					ok: true,
					status: 200,
					json: async () => feed
				})) as unknown as typeof fetch,
				'https://ue-dnd.github.io/Chronos/ios/stable.json',
				'ios'
			);
			expect(result.ok).toBe(true);
			if (result.ok) {
				expect(result.value.iosUpdate?.ipaUrl).toBe(entry.ipaUrl);
				expect(result.value.platforms?.android).toBeUndefined();
				expect(result.value.platforms?.ios?.updateUrl).toBe(entry.ipaUrl);
			}
		} finally {
			resetHostPlatform();
		}
	});

	it('blocks a re-signed install whose bundle ID was changed', async () => {
		setHostPlatform({
			...getDefaultWebPlatform(),
			getIosInstallationIdentity: async () => ({
				bundleId: 'com.example.resign',
				version: '1.1.2',
				build: '1001002',
				osVersion: '18.0'
			})
		});
		try {
			const result = await fetchLatestProjectRelease(
				vi.fn(async () => ({
					ok: true,
					status: 200,
					json: async () => feed
				})) as unknown as typeof fetch,
				'https://ue-dnd.github.io/Chronos/ios/stable.json',
				'ios'
			);
			expect(result.ok).toBe(false);
			if (!result.ok) expect(result.error.message).toBe('about.update.ios.bundleMismatch');
		} finally {
			resetHostPlatform();
		}
	});

	it('reports a missing feed record with an iOS-specific message', async () => {
		const result = await fetchLatestProjectRelease(
			vi.fn(async () => ({
				ok: false,
				status: 404,
				json: async () => ({})
			})) as unknown as typeof fetch,
			'https://ue-dnd.github.io/Chronos/ios/stable.json',
			'ios'
		);
		expect(result.ok).toBe(false);
		if (!result.ok) expect(result.error.message).toBe('about.update.ios.feedNotFound');
	});

	it('blocks an update that requires a newer iOS version', async () => {
		setHostPlatform({
			...getDefaultWebPlatform(),
			getIosInstallationIdentity: async () => ({
				bundleId: OFFICIAL_IOS_BUNDLE_ID,
				version: '1.1.2',
				build: '1001002',
				osVersion: '17.3'
			})
		});
		try {
			const result = await fetchLatestProjectRelease(
				vi.fn(async () => ({
					ok: true,
					status: 200,
					json: async () => feed
				})) as unknown as typeof fetch,
				'https://ue-dnd.github.io/Chronos/ios/stable.json',
				'ios'
			);
			expect(result.ok).toBe(false);
			if (!result.ok) expect(result.error.message).toBe('about.update.ios.osTooOld');
		} finally {
			resetHostPlatform();
		}
	});
});
