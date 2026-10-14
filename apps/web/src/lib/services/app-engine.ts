import { StorageClearError } from '@chronos/core';
import { ChronosEngine } from '@chronos/core';
import { createWebChronosEnv, type WebProviderOptions } from '#lib/providers/index.ts';
import { ReactiveChronosController } from '@chronos/ui-kit';
import { getOverlayHistoryPort } from '#lib/navigation/overlay-history-port.ts';
import { resolveActiveProfile } from '#lib/boot/profile-registry.ts';
import { registerHostShell } from '#lib/boot/core-shell.ts';
import { getHostPlatform } from '#lib/platform/host-platform.ts';
import { appStartup } from '#lib/boot/startup.svelte.ts';

import {
	createOfficialPluginService,
	type OfficialPluginService
} from '#lib/services/official-plugins/official-plugin-service.ts';
import { snackbar } from '#lib/components/ui/snackbar-state.svelte.ts';
import { bindAnalyticsPort, trackEvent } from '#lib/client/analytics.ts';
import { deploymentHasServerPlugins } from '#lib/boot/plugin-proxy-meta.generated.ts';
import { detectSystemAppLocale, syncAppLocaleOnStartup } from '#lib/i18n/locale-sync.ts';
import { HOST_MESSAGES, HOST_UI_PLUGIN_ID } from '#lib/i18n/host-messages.ts';
import { openCourseDetail } from '#lib/timetable/course-detail.svelte.ts';
import {
	createCoursePaletteRef,
	createWebCoursePresentationPort,
	type CoursePaletteRef
} from '#lib/services/course-presentation-port.ts';

function createEngine(paletteRef: CoursePaletteRef, options?: WebProviderOptions): ChronosEngine {
	const hostPlatform = getHostPlatform();
	const env = createWebChronosEnv({
		...options,
		platform: options?.platform ?? hostPlatform.platformType,
		wrapHttpService: options?.wrapHttpService ?? hostPlatform.wrapHttpService?.bind(hostPlatform),
		enablePluginProxy: deploymentHasServerPlugins(),
		navigation: {
			openCourseDetail,
			openCourseEditor(courseId: string) {
				trackEvent('course_editor_open', { trigger: 'plugin' });
				void import('#lib/navigation/nav-coordinator.ts').then(({ navigateForward }) => {
					void navigateForward(`/timetable/course-editor?courseId=${encodeURIComponent(courseId)}`);
				});
			}
		}
	});
	bindAnalyticsPort(env.analytics);
	const engine = new ChronosEngine({
		env,
		initialLocale: typeof navigator !== 'undefined' ? detectSystemAppLocale() : 'zh-cn',
		presetI18nCatalogs: [{ pluginId: HOST_UI_PLUGIN_ID, messages: HOST_MESSAGES }],
		onNotification: (message) => {
			if (typeof window !== 'undefined') {
				snackbar(message);
			}
		}
	});
	env.coursePresentation = createWebCoursePresentationPort(paletteRef, () => engine);
	return engine;
}

async function applyThemeFromPreferences(engine: ChronosEngine): Promise<void> {
	const prefs = await engine.storage.getPreferences();
	syncAppLocaleOnStartup(engine);
	engine.setTheme(engine.resolveThemeId(prefs?.visualThemeId));
}

class HostBootstrapSession {
	readonly palette = createCoursePaletteRef();
	private engine?: ChronosEngine;
	private controller?: ReactiveChronosController;
	private plugins?: OfficialPluginService;
	private coreReady?: Promise<ChronosEngine>;
	private pluginsReady?: Promise<void>;
	private resetting?: Promise<ResetAppResult>;
	private disposed = false;

	private assertActive(): void {
		if (this.disposed) throw new Error('Startup session disposed');
	}

	private ensureEngine(options?: WebProviderOptions): ChronosEngine {
		this.assertActive();
		if (!this.engine) {
			this.engine = createEngine(this.palette, options);
			this.plugins = createOfficialPluginService(this.engine, options?.database);
		}
		return this.engine;
	}

	getEngine(options?: WebProviderOptions): ChronosEngine {
		const engine = this.ensureEngine(options);
		if (typeof window !== 'undefined')
			void this.ensureReady(options).catch((error) => {
				console.error('[app-engine] Bootstrap failed', error);
				if (typeof window !== 'undefined') window.__chronosShowBootFailure?.();
			});
		return engine;
	}

	getController(options?: WebProviderOptions): ReactiveChronosController {
		return (this.controller ??= new ReactiveChronosController(this.getEngine(options), {
			overlayHistoryPort: getOverlayHistoryPort()
		}));
	}

	getPlugins(options?: WebProviderOptions): OfficialPluginService {
		this.assertActive();
		if (!this.plugins) this.getEngine(options);
		return this.plugins!;
	}

	notifyPaletteChanged(): void {
		this.engine?.events.emit('coursePalette:changed', undefined);
	}

	ensureReady(options?: WebProviderOptions): Promise<ChronosEngine> {
		const engine = this.ensureEngine(options);
		return (this.coreReady ??= appStartup
			.prepareCore(async () => {
				await engine.init();
				this.assertActive();
				registerHostShell(engine);
				await this.plugins!.prepareProfile(resolveActiveProfile());
				this.assertActive();
				await applyThemeFromPreferences(engine);
				return engine;
			})
			.then(() => {
				this.schedulePlugins(engine);
				return engine;
			}));
	}

	async ensureFullyReady(options?: WebProviderOptions): Promise<ChronosEngine> {
		const engine = await this.ensureReady(options);
		this.schedulePlugins(engine);
		await this.pluginsReady;
		return engine;
	}

	private schedulePlugins(engine: ChronosEngine): void {
		this.assertActive();
		if (this.pluginsReady) return;
		this.pluginsReady = appStartup.restorePlugins(async () => {
			await new Promise<void>((resolve) => setTimeout(resolve, 0));
			this.assertActive();
			await this.plugins!.init();
			this.assertActive();
			const preferred = engine.state.userPreferences.visualThemeId;
			if (preferred && !engine.themes.isSelectable(preferred)) {
				const service = this.plugins!;
				const records = service.listInstalled();
				// JSON themes declare their ID. Failed ESM plugins may contribute arbitrary theme IDs.
				const couldRecover =
					service.listFailures().size > 0 ||
					records.some(
						(record) =>
							(!record.manifest.colorsUrl && !service.isPluginActive(record.manifest.id)) ||
							record.manifest.themeId === preferred
					);
				if (!couldRecover) await engine.revertToDefaultThemes();
			}
			await applyThemeFromPreferences(engine);
		});
		void this.pluginsReady.catch(() => {});
	}

	reset(afterClear?: () => Promise<void>): Promise<ResetAppResult> {
		return (this.resetting ??= performAppReset(this, afterClear).finally(() => {
			this.resetting = undefined;
		}));
	}

	dispose(): void {
		this.plugins?.dispose();
		this.controller?.dispose();
		this.engine?.dispose();
		this.disposed = true;
	}
}

let session = new HostBootstrapSession();

export function getSharedCoursePaletteRef(): CoursePaletteRef {
	return session.palette;
}
export function notifyCoursePaletteChanged(): void {
	session.notifyPaletteChanged();
}
export async function ensureEngineReady(options?: WebProviderOptions): Promise<ChronosEngine> {
	return session.ensureReady(options);
}
/** Waits for deferred builtins and official plugins (import/share codecs, official catalog tabs). */
export async function ensureEngineFullyReady(options?: WebProviderOptions): Promise<ChronosEngine> {
	return session.ensureFullyReady(options);
}
export function getAppEngine(options?: WebProviderOptions): ChronosEngine {
	return session.getEngine(options);
}
export function getAppController(options?: WebProviderOptions): ReactiveChronosController {
	return session.getController(options);
}
export function getOfficialPluginService(options?: WebProviderOptions): OfficialPluginService {
	return session.getPlugins(options);
}

export type ResetAppResult = { status: 'complete' } | { status: 'recovery-failed' };

function getMissingPreinstalls(
	service: OfficialPluginService,
	profile: ReturnType<typeof resolveActiveProfile>
): string[] {
	const installed = new Map(service.listInstalled().map((record) => [record.manifest.id, record]));
	return profile.preinstall.flatMap((entry) => {
		const record = installed.get(entry.id);
		return record && service.isPluginActive(entry.id) ? [] : [entry.id];
	});
}

export function resetAppToInitialState(afterClear?: () => Promise<void>): Promise<ResetAppResult> {
	return session.reset(afterClear);
}

async function performAppReset(
	session: HostBootstrapSession,
	afterClear?: () => Promise<void>
): Promise<ResetAppResult> {
	const engine = await session.ensureFullyReady();
	const service = session.getPlugins();
	const profile = resolveActiveProfile();
	await service.resetAfterFactoryClear();
	let cleanupError: unknown;
	try {
		await engine.clearAllData();
	} catch (error) {
		if (error instanceof StorageClearError) {
			cleanupError = error;
		} else {
			service.resumeAfterFactoryClear();
			try {
				await service.prepareProfile(profile);
				await service.init();
				await applyThemeFromPreferences(engine);
			} catch (restoreError) {
				console.error('[app-engine] Could not resume after failed data transaction:', restoreError);
			}
			throw error;
		}
	}
	service.resumeAfterFactoryClear();
	try {
		await afterClear?.();
	} catch (error) {
		cleanupError = error;
	}

	let restoreError: unknown;
	let recoveryRetried = false;
	try {
		await service.prepareProfile(profile);
		await service.init();
	} catch (error) {
		restoreError = error;
		recoveryRetried = true;
		try {
			// Data is already gone. Retry profile assembly once in this session before
			// reporting a partial reset; a later app launch also runs normal bootstrap.
			await service.prepareProfile(profile);
			await service.init();
			restoreError = undefined;
		} catch (retryError) {
			restoreError = retryError;
		}
	}

	if (!restoreError) {
		let missing = getMissingPreinstalls(service, profile);
		if (missing.length > 0 && !recoveryRetried) {
			try {
				// init() records individual preinstall failures instead of rejecting.
				// Explicit retry must include those failures too.
				await service.retryPreinstall();
				missing = getMissingPreinstalls(service, profile);
			} catch (error) {
				restoreError = error;
			}
			if (!restoreError && missing.length > 0) {
				restoreError = new Error(`Preinstall recovery incomplete: ${missing.join(', ')}`);
			}
		} else if (missing.length > 0) {
			restoreError = new Error(`Preinstall recovery incomplete: ${missing.join(', ')}`);
		}
	}

	if (!restoreError) {
		try {
			await engine.updatePreferences({
				visualThemeId: profile.defaultTheme.themeId,
				wallpaperColorEnabled: false,
				wallpaperSource: 'none'
			});
			engine.setTheme(profile.defaultTheme.themeId);
		} catch (error) {
			restoreError = error;
		}
	}

	if (restoreError || cleanupError) {
		console.error('[app-engine] Data cleared, but recovery failed:', restoreError ?? cleanupError);
		return { status: 'recovery-failed' };
	}
	return { status: 'complete' };
}

/** Disposes the shared host engine and all resources owned by its bootstrap session. */
export function disposeAppEngine(): void {
	appStartup.reset();
	session.dispose();
	session = new HostBootstrapSession();
}
