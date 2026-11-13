import { CHRONOS_MOUNTABLE, type ChronosMountable } from '@chronos/core';
import { mount, unmount, type Component } from 'svelte';
import { writable } from 'svelte/store';
import MountableSvelteHost from './MountableSvelteHost.svelte';

/** Adapt a Svelte component (including an independent ESM runtime) to the
 * public object handle. Only explicit props cross the plugin boundary.
 */
export function mountableSvelteComponent<P extends object>(
	component: Component<P>
): ChronosMountable<P> {
	return {
		[CHRONOS_MOUNTABLE]: true,
		mount(target: HTMLElement, props: P, lifecycle) {
			let stopped = false;
			const propsStore = writable<Record<string, unknown>>({ ...props } as Record<string, unknown>);
			const instance = mount(MountableSvelteHost, {
				target,
				context: new Map(),
				props: {
					component: component as Component<Record<string, unknown>>,
					propsStore,
					onFailure: lifecycle
						? (error: unknown) =>
								queueMicrotask(() => {
									if (!stopped) lifecycle.onError(error);
								})
						: undefined
				}
			});

			return {
				update(nextProps: P) {
					propsStore.set({ ...nextProps } as Record<string, unknown>);
				},
				unmount: () => {
					stopped = true;
					void unmount(instance).catch((error) =>
						console.error('[MountableSvelteHost] unmount failed:', error)
					);
				}
			};
		}
	};
}
