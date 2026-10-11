import type { FontSizeScale } from '@chronos/core';

export function createFontSizeSettings(options: {
	initial: FontSizeScale;
	preview: (scale: FontSizeScale | null) => void;
	save: (scale: FontSizeScale) => Promise<void>;
	onError: () => void;
}) {
	let draft = $state(options.initial);
	let saved = options.initial;
	let revision = 0;
	let pending: FontSizeScale | null = null;
	let running: Promise<void> | null = null;
	let inFlight: FontSizeScale | null = null;
	let disposed = false;
	async function drain() {
		while (pending !== null) {
			const target = pending;
			inFlight = target;
			const task = revision;
			pending = null;
			try {
				await options.save(target);
				saved = target;
			} catch {
				if (task === revision || (draft === target && pending === null)) draft = saved;
				if (!disposed) options.onError();
			}
			inFlight = null;
			if (!disposed) options.preview(draft === saved ? null : draft);
		}
	}
	return {
		get state() {
			return { draft };
		},
		sync(scale: FontSizeScale) {
			if (running || draft !== saved) return;
			saved = scale;
			draft = scale;
		},
		preview(scale: FontSizeScale) {
			revision++;
			draft = scale;
			options.preview(scale);
		},
		commit() {
			if (draft === inFlight) {
				pending = null;
				return running!;
			}
			if (!running && draft === saved) return Promise.resolve();
			pending = draft;
			if (!running)
				running = drain().finally(() => {
					running = null;
				});
			return running;
		},
		destroy() {
			disposed = true;
			options.preview(null);
		}
	};
}
