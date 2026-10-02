import { registerPlugin } from '@capacitor/core';
import type { PluginListenerHandle } from '@capacitor/core';
import type { SelectedAndroidUpdate } from '@chronos/core';
import type {
	NativeUpdateState,
	PlatformUpdateAction
} from '../../web/src/lib/platform/host-platform';
import { trackEvent } from '../../web/src/lib/client/analytics';

interface UpdateEvent {
	kind: 'start' | 'confirmation' | 'result';
	taskId: string;
	phase: string;
}
interface UpdaterPlugin {
	startUpdate(options: { update: SelectedAndroidUpdate }): Promise<NativeUpdateState>;
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

export function createAndroidUpdateAction(): PlatformUpdateAction {
	const plugin = updater();
	return {
		mode: 'native-apk',
		canApplyInApp: true,
		actionLabelKey: 'about.update.android.install',
		async applyUpdate(release) {
			if (!release?.androidUpdate) throw new Error('Android update descriptor unavailable');
			await plugin.startUpdate({ update: release.androidUpdate });
			await flushAndroidUpdateEvents().catch(() => {});
		},
		native: {
			async getState() {
				const state = await plugin.getState();
				await flushAndroidUpdateEvents().catch(() => {});
				return state;
			},
			async subscribe(listener) {
				const handle = await plugin.addListener('stateChanged', (state) => {
					listener(state);
					void flushAndroidUpdateEvents().catch(() => {});
				});
				return () => {
					void handle.remove();
				};
			},
			continueUpdate: () => plugin.continueUpdate(),
			cancelUpdate: () => plugin.cancelUpdate()
		}
	};
}
