import { parseColorThemeJson } from '@chronos/core';
import { validateImage } from '$lib/wallpaper/validate-image';
import { resolveManifestAssetUrl } from './manifest-url';
import type { PluginManifest } from '@chronos/core';
import type { ChronosEngine } from '@chronos/core';
import type { OfficialPluginAssets } from './official-plugin-types';
import { resolveManifestForDownload } from './manifest-url';

export interface AssetDownloadOptions {
	signal?: AbortSignal;
	onProgress?: (progress: {
		stage: 'downloading' | 'verifying';
		percent: number;
		label?: string;
	}) => void;
}

export class OfficialPluginAssetPipeline {
	constructor(private readonly engine: ChronosEngine) {}

	async download(
		manifest: PluginManifest,
		manifestUrl?: string,
		options?: AssetDownloadOptions
	): Promise<OfficialPluginAssets> {
		const resolvedManifest = resolveManifestForDownload(manifest, manifestUrl);
		let code: string | null = null;
		let colorsJson: string | null = null;
		let iconThemeJson: string | null = null;
		let cssCode: string | null = null;
		let percent = 0;
		const reportProgress: NonNullable<AssetDownloadOptions['onProgress']> = (progress) => {
			percent = Math.max(percent, progress.percent);
			options?.onProgress?.({ ...progress, percent });
		};

		const tasks: Array<{
			url: string;
			sha256?: string;
			label: string;
			assign: (val: string) => void;
		}> = [];

		if (resolvedManifest.colorsUrl) {
			tasks.push({
				url: resolvedManifest.colorsUrl,
				sha256: resolvedManifest.colorsSha256,
				label: 'colors',
				assign: (val) => (colorsJson = val)
			});
		}

		if (resolvedManifest.iconThemeUrl) {
			tasks.push({
				url: resolvedManifest.iconThemeUrl,
				sha256: resolvedManifest.iconThemeSha256,
				label: 'icon theme',
				assign: (val) => (iconThemeJson = val)
			});
		}

		if (resolvedManifest.bundleUrl) {
			tasks.push({
				url: resolvedManifest.bundleUrl,
				sha256: resolvedManifest.sha256,
				label: 'bundle',
				assign: (val) => (code = val)
			});
			if (resolvedManifest.cssUrl) {
				tasks.push({
					url: resolvedManifest.cssUrl,
					sha256: resolvedManifest.cssSha256,
					label: 'css',
					assign: (val) => (cssCode = val)
				});
			}
		}

		const total = tasks.length || 1;
		for (let i = 0; i < tasks.length; i++) {
			options?.signal?.throwIfAborted?.();
			const task = tasks[i]!;
			const text = await this.downloadTextAsset(
				task.url,
				task.sha256,
				task.label,
				options?.signal,
				(progress) => {
					reportProgress({
						stage: progress.stage,
						percent: Math.round(((i + progress.percent / 100) / total) * 70),
						label: task.label
					});
				}
			);

			task.assign(text);
		}

		options?.signal?.throwIfAborted?.();
		const wallpaper = await this.downloadThemeWallpaper(
			colorsJson,
			resolvedManifest.colorsUrl,
			options?.signal,
			options?.onProgress
				? (progress) =>
						reportProgress({
							...progress,
							percent: Math.round(70 + (progress.percent / 100) * 15)
						})
				: undefined
		);
		reportProgress({ stage: 'verifying', percent: 85 });
		return { code, colorsJson, iconThemeJson, cssCode, ...(wallpaper ? { wallpaper } : {}) };
	}

	async downloadThemeWallpaper(
		colorsJson: string | null,
		colorsUrl?: string,
		signal?: AbortSignal,
		onProgress?: AssetDownloadOptions['onProgress']
	): Promise<Blob | undefined> {
		if (!colorsJson) return undefined;
		const raw = JSON.parse(colorsJson);
		if (!raw.wallpaper) return undefined;
		const asset = parseColorThemeJson(raw).wallpaper!;
		if (!colorsUrl) throw new Error('Theme wallpaper requires a colors URL');
		const url = resolveManifestAssetUrl(colorsUrl, asset.url);
		signal?.throwIfAborted();
		onProgress?.({ stage: 'downloading', percent: 0, label: 'wallpaper' });
		const response = await this.engine.http.request(withIntegrityBust(url, asset.sha256), {
			method: 'GET',
			timeoutMs: 20_000,
			signal
		});
		if (!response.ok) throw new Error('Failed to download theme wallpaper');
		let downloadPercent = 0;
		const bytes = await response.bytes(
			onProgress
				? ({ receivedBytes, totalBytes }) => {
						downloadPercent = Math.max(
							downloadPercent,
							totalBytes ? Math.min(90, (receivedBytes / totalBytes) * 90) : 0
						);
						onProgress({
							stage: 'downloading',
							percent: downloadPercent,
							label: 'wallpaper'
						});
					}
				: undefined
		);
		signal?.throwIfAborted();
		onProgress?.({ stage: 'verifying', percent: 90, label: 'wallpaper' });
		const hash = await this.engine.runtime.sha256(bytes);
		signal?.throwIfAborted();
		if (hash.toLowerCase() !== asset.sha256.toLowerCase())
			throw new Error('Theme wallpaper integrity check failed');
		const blob = new Blob([new Uint8Array(bytes)]);
		onProgress?.({ stage: 'verifying', percent: 95, label: 'wallpaper' });
		await validateImage(blob, signal);
		signal?.throwIfAborted();
		onProgress?.({ stage: 'verifying', percent: 100, label: 'wallpaper' });
		return blob;
	}

	private async downloadTextAsset(
		url: string,
		expectedSha256: string | undefined,
		label = 'asset',
		signal?: AbortSignal,
		onProgress?: AssetDownloadOptions['onProgress']
	): Promise<string> {
		const requestUrl = withIntegrityBust(url, expectedSha256);
		try {
			return await this.fetchVerifiedText(
				requestUrl,
				url,
				expectedSha256,
				label,
				signal,
				onProgress
			);
		} catch (err) {
			if (!isIntegrityMismatch(err) || requestUrl === url) throw err;
			// Even a hash-specific URL may have cached corrupt bytes; refresh it once.
			return await this.fetchVerifiedText(
				requestUrl,
				url,
				expectedSha256,
				label,
				signal,
				onProgress,
				'reload'
			);
		}
	}

	private async fetchVerifiedText(
		requestUrl: string,
		url: string,
		expectedSha256: string | undefined,
		label: string,
		signal?: AbortSignal,
		onProgress?: AssetDownloadOptions['onProgress'],
		cache?: 'reload'
	): Promise<string> {
		signal?.throwIfAborted?.();
		onProgress?.({ stage: 'downloading', percent: 0, label });
		const response = await this.engine.http.request(requestUrl, {
			method: 'GET',
			timeoutMs: 20_000,
			signal,
			cache
		});
		if (!response.ok) {
			throw new Error(`Failed to download plugin ${label} from ${url}`);
		}
		const text = await response.text();
		signal?.throwIfAborted?.();
		if (expectedSha256) {
			onProgress?.({ stage: 'verifying', percent: 85, label });
			const hash = await this.engine.runtime.sha256(text);
			signal?.throwIfAborted?.();
			if (hash.toLowerCase() !== expectedSha256.toLowerCase()) {
				throw new Error(
					`Plugin ${label} integrity check failed. Expected ${expectedSha256}, got ${hash}`
				);
			}
		}
		onProgress?.({ stage: 'verifying', percent: 100, label });
		return text;
	}
}

/**
 * Appends a content-hash query so each asset version is a distinct cache key.
 * Plugin bundle URLs are stable across releases; without this a stale
 * ServiceWorker/middleware cache can pin old bytes under the new sha.
 */
function withIntegrityBust(url: string, sha256: string | undefined): string {
	if (!sha256) return url;
	const separator = url.includes('?') ? '&' : '?';
	return `${url}${separator}v=${encodeURIComponent(sha256.slice(0, 16))}`;
}

function isIntegrityMismatch(err: unknown): boolean {
	return err instanceof Error && /integrity check failed/.test(err.message);
}
