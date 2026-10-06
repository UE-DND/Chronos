import { registerPlugin } from '@capacitor/core';
import type { PluginListenerHandle } from '@capacitor/core';
import type { SelectedAndroidUpdate, ChronosProfile } from '@chronos/core';
import type {
	NativeUpdateState,
	HostUpdatePhase,
	PlatformUpdateAction
} from '../../web/src/lib/platform/host-platform';
import { HOST_BUILD } from '../../web/src/lib/config/app-meta';
import { resolveActiveProfile } from '../../web/src/lib/boot/profile-registry';
import { trackEvent } from '../../web/src/lib/client/analytics';

interface UpdateEvent {
	kind: 'start' | 'confirmation' | 'result';
	taskId: string;
	phase: string;
}
interface UpdaterPlugin {
	startUpdate(options: {
		update: SelectedAndroidUpdate;
		preparationToken: string;
	}): Promise<NativeUpdateState>;
	getState(): Promise<NativeUpdateState>;
	continueUpdate(): Promise<NativeUpdateState>;
	cancelUpdate(): Promise<NativeUpdateState>;
	takeEvents(): Promise<{ events: UpdateEvent[] }>;
	addListener(
		name: 'stateChanged',
		listener: (state: NativeUpdateState) => void
	): Promise<PluginListenerHandle>;
}
const updater = () => registerPlugin<UpdaterPlugin>('ChronosUpdater');

export async function flushAndroidUpdateEvents(): Promise<void> {
	const { events } = await updater().takeEvents();
	for (const event of events) {
		trackEvent(
			event.kind === 'start'
				? 'android_update_start'
				: event.kind === 'confirmation'
					? 'android_update_confirmation'
					: 'android_update_result',
			{ task_id: event.taskId, phase: event.phase }
		);
	}
}

// Shared across update pages and bootstrap recovery, even if the platform creates another action.
let applying: Promise<void> | undefined;
let preparation: AbortController | undefined;
let startingNative = false;
let preparationState: NativeUpdateState | undefined;
const listeners = new Set<(state: NativeUpdateState) => void>();
let recovery: Promise<unknown> = Promise.resolve();

function isActive(state: NativeUpdateState): boolean {
	return !['idle', 'failed', 'canceled', 'succeeded'].includes(state.phase);
}
function publish(state: NativeUpdateState): void {
	preparationState = state;
	for (const listener of listeners) listener(state);
}
async function reconcile(): Promise<NativeUpdateState> {
	const run = recovery
		.catch(() => {})
		.then(async () => {
			if (preparation && preparationState) return preparationState;
			// Re-read ownership inside the queue so an old event cannot discard a new task's snapshot.
			const state = await updater().getState();
			if (preparation && preparationState) return preparationState;
			if (startingNative) return state;
			const { getOfficialPluginService } = await import('../../web/src/lib/services/app-engine');
			const service = getOfficialPluginService();
			await service.installationStore.load();
			const prepared = service.installationStore.prepared;
			// The new host adopts before cleanup, including when the native task already succeeded.
			if (!prepared || prepared.target.buildId === HOST_BUILD.buildId) return state;
			if (
				isActive(state) &&
				state.preparationToken === prepared.token &&
				state.update?.host.buildId === prepared.target.buildId
			)
				return state;
			await service.cancelHostPreparation(prepared.token);
			return state;
		});
	recovery = run;
	return run;
}
async function readState(): Promise<NativeUpdateState> {
	const state = await reconcile();
	await flushAndroidUpdateEvents().catch(() => {});
	return !isActive(state) &&
		preparationState &&
		(preparationState.errorCode === 'plugin_prepare_failed' ||
			(state.phase === 'idle' && preparationState.phase === 'canceled'))
		? preparationState
		: state;
}
function apply(plugin: UpdaterPlugin, update: SelectedAndroidUpdate): Promise<void> {
	if (applying) return applying;
	applying = (async () => {
		const existing = await readState();
		if (isActive(existing)) return;
		const controller = new AbortController();
		preparation = controller;
		publish({
			phase: 'downloading',
			percent: 0,
			canCancel: true,
			targetVersion: update.host.version,
			update
		});
		let token: string | undefined;
		let starting = false;
		const { ensureEngineFullyReady, getOfficialPluginService } =
			await import('../../web/src/lib/services/app-engine');
		const service = getOfficialPluginService();
		try {
			await ensureEngineFullyReady();
			controller.signal.throwIfAborted();
			const profile: ChronosProfile = resolveActiveProfile();
			const preparationToken: string = await service.prepareHostUpdate(
				{
					host: update.host,
					pluginCatalogUrl: update.pluginCatalogUrl,
					requiredPluginIds: profile.preinstall.map(({ id }) => id)
				},
				(percent: number) => {
					if (!controller.signal.aborted)
						publish({
							phase: 'downloading',
							percent,
							canCancel: true,
							targetVersion: update.host.version,
							update
						});
				},
				{ signal: controller.signal }
			);
			token = preparationToken;
			controller.signal.throwIfAborted();
			// From this point cancellation belongs to the native task. Never discard a snapshot on
			// a lost bridge response: startUpdate may already have persisted and started the APK.
			starting = true;
			startingNative = true;
			preparation = undefined;
			const state = await plugin.startUpdate({ update, preparationToken });
			startingNative = false;
			await reconcile();
			publish(state);
			await flushAndroidUpdateEvents().catch(() => {});
		} catch (error) {
			if (starting) {
				startingNative = false;
				try {
					await reconcile();
				} catch {
					/* Unknown native ownership; retain the snapshot. */
				}
				throw error;
			}
			if (token) await service.cancelHostPreparation(token);
			if (controller.signal.aborted) {
				publish({ phase: 'canceled', percent: null, canCancel: false });
				return;
			}
			publish({
				phase: 'failed',
				percent: null,
				canCancel: false,
				targetVersion: update.host.version,
				update,
				errorCode: 'plugin_prepare_failed'
			});
			throw Object.assign(new Error('Could not prepare plugins for the update', { cause: error }), {
				code: 'plugin_prepare_failed'
			});
		} finally {
			if (preparation === controller) preparation = undefined;
		}
	})().finally(() => {
		applying = undefined;
	});
	return applying;
}

export function createAndroidUpdateAction(): PlatformUpdateAction {
	const plugin = updater();
	return {
		mode: 'native-apk',
		canApplyInApp: true,
		actionLabelKey: 'about.update.android.install',
		applyUpdate(release, options) {
			if (!release?.androidUpdate)
				return Promise.reject(new Error('Android update descriptor unavailable'));
			const progress = (state: NativeUpdateState) => {
				if (isActive(state))
					options?.onProgress?.({ phase: state.phase as HostUpdatePhase, percent: state.percent });
			};
			listeners.add(progress);
			return apply(plugin, release.androidUpdate).finally(() => listeners.delete(progress));
		},
		native: {
			getState: () => readState(),
			async subscribe(listener) {
				listeners.add(listener);
				let handle: PluginListenerHandle;
				try {
					handle = await plugin.addListener('stateChanged', () => {
						if (preparation || startingNative) return;
						void readState()
							.then((state) => listener(state))
							.catch(console.error);
					});
				} catch (error) {
					listeners.delete(listener);
					throw error;
				}
				return () => {
					listeners.delete(listener);
					void handle.remove();
				};
			},
			async continueUpdate() {
				const state = await readState();
				if (state.phase === 'failed') {
					if (!state.update) throw new Error('Pinned Android target unavailable');
					await apply(plugin, state.update);
					return readState();
				}
				const next = await plugin.continueUpdate();
				await reconcile();
				return next;
			},
			async cancelUpdate() {
				if (preparation) {
					preparation.abort();
					const state: NativeUpdateState = { phase: 'canceled', percent: null, canCancel: false };
					publish(state);
					return state;
				}
				await applying?.catch(() => {});
				const state = await plugin.cancelUpdate();
				await reconcile();
				return state;
			}
		}
	};
}
