import type { ChronosContext, Disposable } from '@chronos/core';
import type { ChronosUiView, ChronosUiController } from '../reactivity/chronos-ui-controller';
import { createChronosUiView } from '../reactivity/chronos-ui-view';
import type { EdgeBarActionsController, EdgeBarAction } from './edge-bar-actions.svelte';
import type { OverlayParent } from '../overlay/history-overlay';

export interface PluginEdgeActions {
	register(actions: readonly EdgeBarAction[]): () => void;
}

export interface PluginUiProps {
	controller: ChronosUiView;
	context: ChronosContext;
	pluginId: string;
	active?: boolean;
	viewId?: string;
	edgeActions?: PluginEdgeActions;
	overlayParent?: OverlayParent;
}

const uiResources = new WeakMap<object, Set<Disposable>>();

/** The host releases UI resources even when a foreign runtime fails before its own cleanup. */
export function releasePluginUiResources(view: unknown): void {
	if (!view || typeof view !== 'object') return;
	const resources = uiResources.get(view);
	if (!resources) return;
	for (const resource of resources) resource.dispose();
	resources.clear();
}

export function createPluginUiProps(
	controller: ChronosUiController,
	pluginId: string,
	options: { active?: boolean; viewId?: string; edgeActions?: EdgeBarActionsController } = {}
): PluginUiProps | undefined {
	void controller.slotVersion;
	let context: ChronosContext;
	try {
		context = controller.getPluginContext(pluginId);
	} catch {
		return undefined;
	}
	const resources = new Set<Disposable>();
	const own = (disposable: Disposable) => {
		resources.add(disposable);
		context.addDisposable(disposable);
	};
	const view = createChronosUiView(controller, { signal: context.signal, addDisposable: own });
	uiResources.set(view, resources);
	return Object.freeze({
		controller: view,
		context,
		pluginId: context.pluginId,
		active: options.active,
		viewId: options.viewId,
		edgeActions:
			options.edgeActions &&
			Object.freeze({
				register(actions: readonly EdgeBarAction[]) {
					if (context.signal.aborted) return () => {};
					const release = options.edgeActions!.register(context.pluginId, actions);
					own({ dispose: release });
					return release;
				}
			})
	});
}
