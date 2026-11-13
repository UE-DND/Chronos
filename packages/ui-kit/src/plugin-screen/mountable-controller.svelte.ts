import {
	isChronosMountable,
	isChronosMountHandle,
	type ChronosMountHandle,
	type ChronosMountable
} from '@chronos/core';
import { releasePluginUiResources } from './plugin-ui-props';

type MountableState = {
	readonly phase: 'idle' | 'mounted' | 'failed';
	readonly error: unknown;
};

/** Owns one plugin UI instance and keeps a failed instance stopped until explicit retry. */
export function createMountableController(
	report: (phase: 'mount' | 'update' | 'unmount', error: unknown) => void = (phase, error) =>
		console.error(`[MountableSlotOutlet] ${phase} failed:`, error)
) {
	let state = $state.raw<MountableState>({ phase: 'idle', error: null });
	let handle: ChronosMountHandle | undefined;
	let component: ChronosMountable | undefined;
	let target: HTMLElement | undefined;
	let mountToken: symbol | undefined;
	const views = new Set<unknown>();

	function stop() {
		mountToken = undefined;
		for (const view of views) releasePluginUiResources(view);
		views.clear();
		const previous = handle;
		handle = undefined;
		try {
			previous?.unmount();
		} catch (error) {
			report('unmount', error);
		} finally {
			target?.replaceChildren();
		}
	}
	function fail(phase: 'mount' | 'update', error: unknown) {
		state = { phase: 'failed', error };
		stop();
		report(phase, error);
	}
	function start(props: Record<string, unknown>) {
		if (!target || !component) return;
		const token = Symbol('mount');
		mountToken = token;
		views.add(props.controller);
		try {
			const mounted = component.mount(target, props, {
				onError: (error) => {
					if (mountToken === token) fail('update', error);
				}
			});
			handle = mounted;
			if (!isChronosMountHandle(mounted)) {
				throw new Error('Invalid mount handle: expected unmount() and optional update()');
			}
			if (mountToken !== token) {
				stop();
				return;
			}
			state = { phase: 'mounted', error: null };
		} catch (error) {
			fail('mount', error);
		}
	}
	function dispose() {
		stop();
		component = undefined;
		target = undefined;
		state = { phase: 'idle', error: null };
	}
	return {
		get state() {
			return state;
		},
		mount(next: unknown, element: HTMLElement, props: Record<string, unknown>) {
			dispose();
			target = element;
			if (!isChronosMountable(next)) {
				fail('mount', new Error('Invalid plugin component: expected CHRONOS_MOUNTABLE'));
				return;
			}
			component = next;
			start(props);
		},
		update(props: Record<string, unknown>) {
			if (state.phase !== 'mounted' || !handle?.update) return;
			views.add(props.controller);
			try {
				handle.update(props);
			} catch (error) {
				fail('update', error);
			}
		},
		retry(props: Record<string, unknown>) {
			if (state.phase !== 'failed') return;
			start(props);
		},
		dispose
	};
}
