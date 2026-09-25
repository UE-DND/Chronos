import { ChronosEngine } from '@chronos/core';
import { createWebChronosEnv, type WebProviderOptions } from '$lib/providers';
import { ReactiveChronosController } from '@chronos/ui-kit';
import { getOverlayHistoryPort } from '$lib/navigation/overlay-history-port';
import { resolveActiveProfile } from '$lib/boot/profile-registry';
import { registerHostShell } from '$lib/boot/core-shell';
import { getHostPlatform } from '$lib/platform/host-platform';

import { OfficialPluginService } from '$lib/services/official-plugins/official-plugin-service';
import { snackbar } from '$lib/components/ui/snackbar-state.svelte';
import { bindAnalyticsPort, trackEvent } from '$lib/client/analytics';
import { deploymentHasServerPlugins } from '$lib/boot/plugin-proxy-meta.generated';
import { detectSystemAppLocale, syncAppLocaleOnStartup } from '$lib/i18n/locale-sync';
import { HOST_MESSAGES, HOST_UI_PLUGIN_ID } from '$lib/i18n/host-messages';
import {
	createCoursePaletteRef,
	createWebCoursePresentationPort,
	type CoursePaletteRef
} from '$lib/services/course-presentation-port';

let sharedEngine: ChronosEngine | null = null;
let sharedController: ReactiveChronosController | null = null;
let sharedOfficialPlugins: OfficialPluginService | null = null;
let enginePhase1Promise: Promise<ChronosEngine> | null = null;
let enginePhase2Promise: Promise<void> | null = null;
let sharedCoursePaletteRef: CoursePaletteRef | null = null;

function getSharedCoursePaletteRef(): CoursePaletteRef {
	if (!sharedCoursePaletteRef) {
		sharedCoursePaletteRef = createCoursePaletteRef();
	}
	return sharedCoursePaletteRef;
}

function notifyCoursePaletteChanged(): void {
	sharedEngine?.events.emit('coursePalette:changed', undefined);
}

function createEngine(options?: WebProviderOptions): ChronosEngine {
	const paletteRef = getSharedCoursePaletteRef();
	const engineRef: { current: ChronosEngine | null } = { current: null };
	const coursePresentation = createWebCoursePresentationPort(paletteRef, () => {
		if (!engineRef.current) {
			throw new Error('[app-engine] ChronosEngine not initialized');
		}
		return engineRef.current;
	});

	const hostPlatform = getHostPlatform();
	const env = createWebChronosEnv({
		...options,
		platform: options?.platform ?? hostPlatform.platformType,
		enablePluginProxy: deploymentHasServerPlugins(),
		coursePresentation,
		navigation: {
			openCourseEditor(courseId: string) {
				trackEvent('course_editor_open', { trigger: 'plugin' });
				void import('$lib/navigation/nav-coordinator').then(({ navigateForward }) => {
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
	sharedEngine = engine;
	engineRef.current = engine;
	return engine;
}

async function applyThemeFromPreferences(engine: ChronosEngine): Promise<void> {
	const prefs = await engine.storage.getPreferences();
	syncAppLocaleOnStartup(engine);
	engine.setTheme(engine.resolveThemeId(prefs?.visualThemeId));
}

async function bootstrapEnginePhase1(engine: ChronosEngine): Promise<void> {
	registerHostShell(engine);
	sharedOfficialPlugins ??= new OfficialPluginService(engine);
	await sharedOfficialPlugins.prepareProfile(resolveActiveProfile());
	await applyThemeFromPreferences(engine);
}

async function bootstrapEnginePhase2(engine: ChronosEngine): Promise<void> {
	if (!sharedOfficialPlugins) throw new Error('Plugin service not prepared');
	await sharedOfficialPlugins.init();
	const preferred = engine.state.userPreferences.visualThemeId;
	if (preferred && !engine.themes.isSelectable(preferred)) {
		const service = sharedOfficialPlugins;
		const records = service.listInstalled();
		// JSON themes declare their ID. Failed ESM plugins may contribute arbitrary theme IDs.
		const couldRecover =
			service.listFailures().size > 0 ||
			records.some(
				(record) =>
					record.enabled &&
					((!record.manifest.colorsUrl && !service.isPluginActive(record.manifest.id)) ||
						record.manifest.themeId === preferred)
			);
		if (!couldRecover) await engine.revertToDefaultThemes();
	}
	await applyThemeFromPreferences(engine);
}

function waitForIdleTurn(): Promise<void> {
	return new Promise((resolve) => {
		if (typeof requestIdleCallback !== 'undefined') {
			requestIdleCallback(() => resolve());
		} else {
			queueMicrotask(() => resolve());
		}
	});
}

function scheduleBootstrapPhase2(engine: ChronosEngine): void {
	if (enginePhase2Promise) return;
	enginePhase2Promise = waitForIdleTurn()
		.then(() => bootstrapEnginePhase2(engine))
		.catch((err) => {
			console.error('[app-engine] Phase 2 bootstrap failed:', err);
			enginePhase2Promise = null;
		});
}

export async function ensureEngineReady(options?: WebProviderOptions): Promise<ChronosEngine> {
	if (!sharedEngine) {
		sharedEngine = createEngine(options);
	}
	if (!enginePhase1Promise) {
		enginePhase1Promise = sharedEngine!
			.init()
			.then(() => bootstrapEnginePhase1(sharedEngine!))
			.then(() => {
				scheduleBootstrapPhase2(sharedEngine!);
				return sharedEngine!;
			});
	}
	return enginePhase1Promise;
}

/** Waits for deferred builtins and official plugins (import/share codecs, official catalog tabs). */
export async function ensureEngineFullyReady(options?: WebProviderOptions): Promise<ChronosEngine> {
	const engine = await ensureEngineReady(options);
	if (!enginePhase2Promise) {
		scheduleBootstrapPhase2(engine);
	}
	if (enginePhase2Promise) {
		await enginePhase2Promise;
	}
	return engine;
}

export function getAppEngine(options?: WebProviderOptions): ChronosEngine {
	if (!sharedEngine) {
		sharedEngine = createEngine(options);
	}
	if (typeof window !== 'undefined')
		void ensureEngineReady(options).catch((error) => {
			console.error('[app-engine] Bootstrap failed', error);
			if (typeof window !== 'undefined') window.__chronosShowBootFailure?.();
		});
	return sharedEngine;
}

export { getSharedCoursePaletteRef, notifyCoursePaletteChanged };

export function getAppController(options?: WebProviderOptions): ReactiveChronosController {
	if (!sharedController) {
		const engine = getAppEngine(options);
		sharedController = new ReactiveChronosController(engine, {
			overlayHistoryPort: getOverlayHistoryPort()
		});
	}
	return sharedController;
}

export function getOfficialPluginService(options?: WebProviderOptions): OfficialPluginService {
	if (!sharedOfficialPlugins) {
		const engine = getAppEngine(options);
		sharedOfficialPlugins = new OfficialPluginService(engine);
	}
	return sharedOfficialPlugins;
}

export async function resetAppToInitialState(): Promise<void> {
	const engine = await ensureEngineFullyReady();
	const service = getOfficialPluginService();
	await service.resetAfterFactoryClear();
	await engine.clearAllData();
	const profile = resolveActiveProfile();
	await service.prepareProfile(profile);
	await service.init();
	await engine.updatePreferences({
		visualThemeId: profile.defaultTheme.themeId,
		wallpaperColorEnabled: false,
		wallpaperSource: 'none'
	});
	engine.setTheme(profile.defaultTheme.themeId);
}

/** Disposes the shared host engine and teardown state. */
export function disposeAppEngine(): void {
	sharedOfficialPlugins?.dispose();
	sharedOfficialPlugins = null;
	sharedController?.dispose();
	sharedController = null;
	sharedEngine?.dispose();
	sharedEngine = null;
	sharedCoursePaletteRef = null;
	enginePhase1Promise = null;
	enginePhase2Promise = null;
}
