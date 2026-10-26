import { getHostPlatform } from '#lib/platform/host-platform.ts';
import { staticPath } from '#lib/config/static-path.ts';
import {
	AppError,
	IosUpdateRejected,
	OFFICIAL_IOS_BUNDLE_ID,
	failure,
	success,
	validateWebUpdate,
	selectAndroidUpdate,
	selectIosUpdate,
	type AppResult
} from '@chronos/core';
import { createLocalReleaseCatalog } from './local-catalog';
import type { ReleaseCatalog } from './catalog';
import { HOST_BUILD, ANDROID_SIGNING_CERTIFICATE } from '#lib/config/app-meta.ts';
import { type Release } from './release';

/**
 * Seam for fetching remote or local release changelog feed.
 */
export interface ReleaseFeedAdapter {
	fetchLatestRelease(): Promise<AppResult<Release>>;
}

export type ReleaseFeedKind = 'web' | 'android' | 'ios';

function missingFeedMessage(kind: ReleaseFeedKind): string {
	if (kind === 'ios') return 'about.update.ios.feedMissing';
	if (kind === 'android') return '未配置 Android 版本检查地址';
	return '未配置版本检查地址';
}

function invalidFeedUrlMessage(kind: ReleaseFeedKind): string {
	if (kind === 'ios') return 'about.update.ios.feedInvalid';
	if (kind === 'android') return 'Android 版本检查地址无效';
	return '版本检查地址无效';
}

function insecureFeedUrlMessage(kind: ReleaseFeedKind): string {
	if (kind === 'ios') return 'about.update.ios.feedInsecure';
	if (kind === 'android') return 'Android 版本检查地址必须使用 HTTPS';
	return '版本检查地址必须使用 HTTPS';
}

function missingFeedRecordMessage(kind: ReleaseFeedKind): string {
	if (kind === 'ios') return 'about.update.ios.feedNotFound';
	return '未在服务器找到版本发布记录';
}

export async function fetchLatestProjectRelease(
	fetchFn: typeof fetch = fetch,
	versionUrl = staticPath('version.json'),
	kind: ReleaseFeedKind = 'web'
): Promise<AppResult<Release>> {
	const abortController = new AbortController();
	const timeout = setTimeout(() => abortController.abort(), 8000);
	try {
		const targetUrl = `${versionUrl}?t=${Date.now()}`;
		const response = await fetchFn(targetUrl, {
			cache: 'no-store',
			signal: abortController.signal
		});

		if (response.status === 404) {
			return failure(AppError.notFound(missingFeedRecordMessage(kind)));
		}
		if (!response.ok) {
			return failure(AppError.network(`检查更新失败 (HTTP ${response.status})`));
		}

		const data: unknown = await response.json();
		if (kind === 'android') {
			const readIdentity = getHostPlatform().getAndroidInstallationIdentity;
			if (!readIdentity) throw new Error('Android installation identity unavailable');
			const installed = await readIdentity();
			if (
				installed.version !== HOST_BUILD.version ||
				installed.signingCertificateSha256 !== ANDROID_SIGNING_CERTIFICATE
			)
				throw new Error('Installed Android identity does not match this build');
			const entry = selectAndroidUpdate(
				data,
				HOST_BUILD.profileId,
				installed.packageId,
				installed.signingCertificateSha256
			);
			return success({
				...entry.release,
				androidUpdate: entry,
				platforms: { android: { updateUrl: entry.apkUrl } }
			});
		}
		if (kind === 'ios') {
			const readIdentity = getHostPlatform().getIosInstallationIdentity;
			if (!readIdentity) throw new Error('iOS installation identity unavailable');
			const installed = await readIdentity();
			if (installed.bundleId !== OFFICIAL_IOS_BUNDLE_ID) {
				return failure(AppError.security('about.update.ios.bundleMismatch'));
			}
			if (installed.version !== HOST_BUILD.version) {
				return failure(AppError.security('about.update.ios.versionMismatch'));
			}
			try {
				const entry = selectIosUpdate(
					data,
					HOST_BUILD.profileId,
					installed.bundleId,
					installed.osVersion
				);
				return success({
					...entry.release,
					iosUpdate: entry,
					platforms: { ios: { updateUrl: entry.ipaUrl } }
				});
			} catch (error) {
				if (error instanceof IosUpdateRejected) {
					return failure(
						AppError.dataFormat(
							error.code === 'bundle_mismatch'
								? 'about.update.ios.bundleMismatch'
								: error.code === 'profile_unavailable'
									? 'about.update.ios.unavailable'
									: error.code === 'os_too_old'
										? 'about.update.ios.osTooOld'
										: 'about.update.ios.invalidDescriptor'
						)
					);
				}
				throw error;
			}
		}
		const update = validateWebUpdate(data, HOST_BUILD);
		return success({ ...update.release, hostUpdate: update });
	} catch (error) {
		const message =
			error instanceof Error && error.name === 'AbortError'
				? '检查更新超时，请检查网络连接'
				: error instanceof Error
					? error.message
					: '网络连接异常，无法获取更新信息';
		return failure(AppError.network(message));
	} finally {
		clearTimeout(timeout);
	}
}

export function createReleaseFeedAdapter(
	options: {
		fetchFn?: typeof fetch;
		versionUrl?: string;
		fetchLatestRelease?: () => Promise<AppResult<Release>>;
		localCatalog?: ReleaseCatalog;
		allowLocalFallback?: boolean;
		requireVersionUrl?: boolean;
		feedKind?: ReleaseFeedKind;
	} = {}
): ReleaseFeedAdapter {
	const {
		fetchFn = fetch,
		versionUrl,
		fetchLatestRelease: customFetchRelease,
		localCatalog = createLocalReleaseCatalog(),
		allowLocalFallback = true,
		requireVersionUrl = false,
		feedKind = requireVersionUrl ? 'android' : 'web'
	} = options;

	return {
		async fetchLatestRelease(): Promise<AppResult<Release>> {
			if (!customFetchRelease && requireVersionUrl && !versionUrl?.trim()) {
				return failure(AppError.network(missingFeedMessage(feedKind)));
			}
			if (!customFetchRelease && requireVersionUrl) {
				try {
					if (new URL(versionUrl!).protocol !== 'https:') {
						return failure(AppError.dataFormat(insecureFeedUrlMessage(feedKind)));
					}
				} catch {
					return failure(AppError.dataFormat(invalidFeedUrlMessage(feedKind)));
				}
			}
			const remoteResult = customFetchRelease
				? await customFetchRelease()
				: await fetchLatestProjectRelease(fetchFn, versionUrl, feedKind);
			if (remoteResult.ok) {
				return remoteResult;
			}
			if (!allowLocalFallback) return remoteResult;

			// Fallback to local catalog when offline or remote unavailable
			const localResult = await localCatalog.listReleases();
			if (localResult.ok && localResult.value.length > 0) {
				return success(localResult.value[0]!);
			}

			return remoteResult;
		}
	};
}
