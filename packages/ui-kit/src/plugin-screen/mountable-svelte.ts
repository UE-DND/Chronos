import { CHRONOS_MOUNTABLE, type ChronosMountable } from '@chronos/core';
import { mount, unmount, type Component } from 'svelte';
import { writable } from 'svelte/store';
import MountableSvelteHost from './MountableSvelteHost.svelte';

/** Adapt a Svelte component (including an independent ESM runtime) to the
 * public object handle. Props and explicitly supplied context cross the boundary;
 * plugin code must not depend on private host context keys.
 */
export function mountableSvelteComponent<P extends Record<string, unknown>>(
	component: Component<P>
): ChronosMountable<P> {
	return {
		[CHRONOS_MOUNTABLE]: true,
		mount(target: HTMLElement, props: P, context?: Map<any, any>) {
			const propsStore = writable<Record<string, unknown>>({ ...props });
			const instance = mount(MountableSvelteHost, {
				target,
				props: {
					component: component as Component<Record<string, unknown>>,
					propsStore
				},
				context
			});

			return {
				update(nextProps: P) {
					propsStore.set({ ...nextProps });
				},
				unmount: () => {
					void unmount(instance);
				}
			};
		}
	};
}
