import type { TimetableViewPrefs } from '@chronos/core';

export function createViewPrefsSaver(save: (prefs: TimetableViewPrefs) => Promise<void>) {
	let latest: TimetableViewPrefs | undefined;
	let inFlight = false;
	let inflightPromise = Promise.resolve();

	function flush() {
		if (inFlight) return inflightPromise;
		inFlight = true;
		inflightPromise = (async () => {
			try {
				while (latest !== undefined) {
					const snapshot = latest;
					await save(snapshot);
					if (latest === snapshot) latest = undefined;
				}
			} catch (error) {
				latest = undefined;
				throw error;
			} finally {
				inFlight = false;
			}
		})();
		return inflightPromise;
	}

	return {
		apply(base: TimetableViewPrefs, patch: Partial<TimetableViewPrefs>): TimetableViewPrefs {
			const next = { ...(latest ?? base), ...patch };
			latest = next;
			// The save callback reports failures; whenIdle still exposes the rejected write.
			void flush().catch(() => {});
			return next;
		},
		whenIdle() {
			return inflightPromise;
		}
	};
}
