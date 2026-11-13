export interface OverlayHistoryPort {
	openOverlay(id: string, onDismiss: () => void): { close(): void; dispose(): void };
}
export interface OverlayParent {
	attachChild(cancel: () => void): () => void;
}
export interface HistoryOverlaySync extends OverlayParent {
	syncOpenState(isOpen: boolean): void;
	dispose(): void;
}
/** Component ancestry, independent of the browser's chronological record order. */
export const OVERLAY_LIFECYCLE_CONTEXT = Symbol('overlay-lifecycle');

export function createHistoryOverlaySync(options: {
	overlayId: string;
	setOpen: (open: boolean) => void;
	port?: OverlayHistoryPort;
	parent?: OverlayParent;
}): HistoryOverlaySync {
	let handle: ReturnType<OverlayHistoryPort['openOverlay']> | undefined;
	let disposed = false;
	let open = false;
	const children = new Set<() => void>();
	const detach = options.parent?.attachChild(cancel);
	function cancelChildren() {
		for (const cancel of children) cancel();
	}
	function cancel() {
		if (!open) return;
		open = false;
		const closing = handle;
		handle = undefined;
		closing?.dispose();
		cancelChildren();
		options.setOpen(false);
	}
	const sync: HistoryOverlaySync = {
		attachChild(cancelChild) {
			if (disposed) {
				cancelChild();
				return () => {};
			}
			children.add(cancelChild);
			return () => children.delete(cancelChild);
		},
		syncOpenState(next) {
			if (disposed || next === open) return;
			open = next;
			if (next) {
				handle = options.port?.openOverlay(options.overlayId, () => {
					handle = undefined;
					cancel();
				});
			} else {
				const closing = handle;
				handle = undefined;
				closing?.close();
				cancelChildren();
			}
		},
		dispose() {
			if (disposed) return;
			disposed = true;
			detach?.();
			cancel();
			children.clear();
		}
	};
	return sync;
}
