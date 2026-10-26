import { registerPlugin } from '@capacitor/core';
import type { PluginListenerHandle } from '@capacitor/core';
import { Share } from '@capacitor/share';
import { pinnedIosIpaUrl, type SelectedIosUpdate, type ChronosProfile } from '@chronos/core';
import type {
	HostUpdatePhase,
	PlatformUpdateAction
} from '../../web/src/lib/platform/host-platform';
import { HOST_BUILD } from '../../web/src/lib/config/app-meta';
import { resolveActiveProfile } from '../../web/src/lib/boot/profile-registry';

interface PackageProgress {
	phase: 'downloading' | 'verifying';
	percent: number | null;
}

interface IosPackagePlugin {
	download(options: { url: string; sha256: string }): Promise<{ uri: string; sha256: string }>;
	cancel(): Promise<void>;
	addListener(
		name: 'progress',
		listener: (event: PackageProgress) => void
	): Promise<PluginListenerHandle>;
}

const iosPackage = () => registerPlugin<IosPackagePlugin>('ChronosIosPackage');

let verified: { sha256: string; uri: string } | undefined;
let applying: Promise<void> | undefined;
let active:
	| {
			token?: string;
			canceled: boolean;
			preparing: boolean;
			downloading: boolean;
			controller: AbortController;
	  }
	| undefined;
let lastProgress:
	| { phase: Exclude<HostUpdatePhase, 'restarting'>; percent: number | null }
	| undefined;

function coded(code: string, message: string): Error {
	return Object.assign(new Error(message), { code });
}

function errorCode(error: unknown): string {
	return typeof error === 'object' && error != null && 'code' in error ? String(error.code) : '';
}

function isCancelMessage(error: unknown): boolean {
	const message =
		error instanceof Error ? error.message.toLowerCase() : String(error).toLowerCase();
	return (
		message.includes('cancel') ||
		message.includes('abort') ||
		message.includes('dismiss') ||
		message.includes('-999')
	);
}

async function sharePackage(uri: string, filename: string): Promise<void> {
	try {
		await Share.share({ title: filename, url: uri, dialogTitle: filename });
	} catch (error) {
		if (isCancelMessage(error)) throw coded('share_canceled', 'Share canceled');
		throw coded('share_failed', 'Could not share the iOS package');
	}
}

function filenameFor(update: SelectedIosUpdate): string {
	return update.ipaUrl.split('/').pop() || 'Chronos.ipa';
}

function reportProgress(
	onProgress: ((progress: { phase: HostUpdatePhase; percent: number | null }) => void) | undefined,
	phase: Exclude<HostUpdatePhase, 'restarting'>,
	percent: number | null
): void {
	lastProgress = { phase, percent };
	onProgress?.({ phase, percent });
}

async function pluginService() {
	const { getOfficialPluginService } = await import('../../web/src/lib/services/app-engine');
	return getOfficialPluginService();
}

async function downloadPackage(
	update: SelectedIosUpdate,
	onProgress?: (progress: { phase: HostUpdatePhase; percent: number | null }) => void
): Promise<void> {
	const expected = pinnedIosIpaUrl(
		update.host.profileId,
		update.host.version,
		update.release.tagName
	);
	if (update.ipaUrl !== expected)
		throw coded('invalid_descriptor', 'iOS package URL is not pinned');
	if (verified?.sha256 === update.sha256) {
		try {
			await sharePackage(verified.uri, filenameFor(update));
			return;
		} catch (error) {
			// Keep the verified package only when the user dismissed the share sheet.
			if (errorCode(error) !== 'share_canceled') verified = undefined;
			throw error;
		}
	}

	const service = await pluginService();
	const current = {
		token: undefined as string | undefined,
		canceled: false,
		preparing: true,
		downloading: false,
		controller: new AbortController()
	};
	active = current;
	try {
		reportProgress(onProgress, 'downloading', null);
		try {
			const { ensureEngineFullyReady } = await import('../../web/src/lib/services/app-engine');
			await ensureEngineFullyReady();
			if (current.canceled) throw coded('download_canceled', 'Update canceled');
			const profile: ChronosProfile = resolveActiveProfile();
			current.token = await service.prepareHostUpdate(
				{
					host: update.host,
					pluginCatalogUrl: update.pluginCatalogUrl,
					requiredPluginIds: profile.preinstall.map(({ id }) => id)
				},
				(percent) => reportProgress(onProgress, 'downloading', percent),
				{ signal: current.controller.signal }
			);
			if (current.canceled) {
				await service.cancelHostPreparation(current.token).catch(() => {});
				current.token = undefined;
				throw coded('download_canceled', 'Update canceled');
			}
		} catch (error) {
			if (errorCode(error) === 'download_canceled') throw error;
			if (current.canceled || isCancelMessage(error))
				throw coded('download_canceled', 'Update canceled');
			throw coded('plugin_prepare_failed', 'Could not prepare installed plugins');
		} finally {
			current.preparing = false;
		}

		const plugin = iosPackage();
		const handle = await plugin
			.addListener('progress', (event) => {
				reportProgress(
					onProgress,
					event.phase === 'verifying' ? 'verifying' : 'downloading',
					event.percent
				);
			})
			.catch(() => null);
		try {
			if (current.canceled) throw coded('download_canceled', 'Update canceled');
			reportProgress(onProgress, 'downloading', null);
			current.downloading = true;
			const result = await plugin.download({ url: update.ipaUrl, sha256: update.sha256 });
			if (result.sha256 !== update.sha256)
				throw coded('integrity_mismatch', 'iOS package digest mismatch');
			verified = { sha256: result.sha256, uri: result.uri };
		} catch (error) {
			if (current.canceled || isCancelMessage(error))
				throw coded('download_canceled', 'Update canceled');
			if (errorCode(error) === 'integrity_mismatch') throw error;
			const message =
				error instanceof Error ? error.message.toLowerCase() : String(error).toLowerCase();
			if (message.includes('integrity') || message.includes('digest') || message.includes('sha256'))
				throw coded('integrity_mismatch', 'iOS package digest mismatch');
			throw coded('download_failed', 'Could not download the iOS package');
		} finally {
			current.downloading = false;
			await handle?.remove();
		}

		const saved = verified;
		if (!saved) throw coded('download_failed', 'Could not download the iOS package');
		if (current.canceled) throw coded('download_canceled', 'Update canceled');
		reportProgress(onProgress, 'installing', null);
		await sharePackage(saved.uri, filenameFor(update));
	} catch (error) {
		const code = errorCode(error);
		if (code !== 'share_canceled' && current.token)
			await service.cancelHostPreparation(current.token).catch(() => {});
		if (code === 'share_failed') verified = undefined;
		if (code) throw error;
		throw coded('download_failed', 'Could not download the iOS package');
	} finally {
		if (active === current) active = undefined;
		lastProgress = undefined;
	}
}

function apply(
	update: SelectedIosUpdate,
	onProgress?: (progress: { phase: HostUpdatePhase; percent: number | null }) => void
): Promise<void> {
	if (applying) return applying;
	applying = downloadPackage(update, onProgress).finally(() => {
		applying = undefined;
	});
	return applying;
}

async function idleState() {
	return { phase: 'idle' as const, percent: null, canCancel: false };
}

export function createIosUpdateAction(): PlatformUpdateAction {
	return {
		mode: 'external-ipa',
		canApplyInApp: false,
		actionLabelKey: 'about.update.ios.download',
		async applyUpdate(release, options) {
			if (!release?.iosUpdate)
				throw coded('invalid_descriptor', 'iOS update descriptor unavailable');
			await apply(release.iosUpdate, options?.onProgress);
		},
		native: {
			async getState() {
				if (applying && lastProgress && active)
					return {
						phase: lastProgress.phase,
						percent: lastProgress.percent,
						canCancel: (active.preparing || active.downloading) && !active.canceled
					};
				if (!applying && !verified) {
					const service = await pluginService();
					await service.installationStore.load();
					const prepared = service.installationStore.prepared;
					if (prepared && prepared.target.buildId !== HOST_BUILD.buildId)
						await service.cancelHostPreparation(prepared.token);
				}
				return idleState();
			},
			async subscribe() {
				return () => {};
			},
			async continueUpdate() {
				return idleState();
			},
			async cancelUpdate() {
				const current = active;
				if (current) {
					current.canceled = true;
					current.controller.abort();
					await iosPackage()
						.cancel()
						.catch(() => {});
					if (current.token) {
						const service = await pluginService();
						await service.cancelHostPreparation(current.token).catch(() => {});
					}
				}
				return {
					phase: 'canceled' as const,
					percent: null,
					canCancel: false
				};
			}
		}
	};
}
