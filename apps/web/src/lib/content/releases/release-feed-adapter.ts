import { getHostPlatform } from '$lib/platform/host-platform';
import { base } from '$app/paths';
import {
	AppError,
	failure,
	success,
	validateWebUpdate,
	selectAndroidUpdate,
	type AppResult
} from '@chronos/core';
import { createLocalReleaseCatalog } from './local-catalog';
import type { ReleaseCatalog } from './catalog';
import { HOST_BUILD, ANDROID_SIGNING_CERTIFICATE } from '$lib/config/app-meta';
import { type Release } from './release';

/**
 * Seam for fetching remote or local release changelog feed.
 */
export interface ReleaseFeedAdapter {
	fetchLatestRelease(): Promise<AppResult<Release>>;
}

export async function fetchLatestProjectRelease(
	fetchFn: typeof fetch = fetch,
	versionUrl = `${base}/version.json`,
	android = false
): Promise<AppResult<Release>> {
	try {
		const targetUrl = `${versionUrl}?t=${Date.now()}`;
		const response = await fetchFn(targetUrl, {
			cache: 'no-store',
			signal:
				typeof AbortSignal !== 'undefined' && 'timeout' in AbortSignal
					? AbortSignal.timeout(8000)
					: undefined
		});

		if (response.status === 404) {
			return failure(AppError.notFound('未在服务器找到版本发布记录'));
		}
		if (!response.ok) {
			return failure(AppError.network(`检查更新失败 (HTTP ${response.status})`));
		}

		const data: unknown = await response.json();
		if (android) {
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
			return success({ ...entry.release, platforms: { android: { updateUrl: entry.apkUrl } } });
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
	} = {}
): ReleaseFeedAdapter {
	const {
		fetchFn = fetch,
		versionUrl,
		fetchLatestRelease: customFetchRelease,
		localCatalog = createLocalReleaseCatalog(),
		allowLocalFallback = true,
		requireVersionUrl = false
	} = options;

	return {
		async fetchLatestRelease(): Promise<AppResult<Release>> {
			if (!customFetchRelease && requireVersionUrl && !versionUrl?.trim()) {
				return failure(AppError.network('未配置 Android 版本检查地址'));
			}
			if (!customFetchRelease && requireVersionUrl) {
				try {
					if (new URL(versionUrl!).protocol !== 'https:') {
						return failure(AppError.dataFormat('Android 版本检查地址必须使用 HTTPS'));
					}
				} catch {
					return failure(AppError.dataFormat('Android 版本检查地址无效'));
				}
			}
			const remoteResult = customFetchRelease
				? await customFetchRelease()
				: await fetchLatestProjectRelease(fetchFn, versionUrl, requireVersionUrl);
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
