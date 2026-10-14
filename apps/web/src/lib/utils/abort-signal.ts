/**
 * Merges multiple AbortSignals into one that aborts when any source aborts.
 * Dispose disconnects the merged signal from its sources after an operation settles.
 * AbortSignal.any alone cannot provide this explicit lifetime boundary.
 */
export function mergeAbortSignals(signals: AbortSignal[]): {
	signal: AbortSignal;
	dispose(): void;
} {
	const active = [...new Set(signals.filter(Boolean))];
	if (active.length === 0) {
		throw new Error('mergeAbortSignals requires at least one signal');
	}
	const aborted = active.find((signal) => signal.aborted);
	if (aborted || active.length === 1) {
		return { signal: aborted ?? active[0]!, dispose() {} };
	}

	const controller = new AbortController();
	const listeners = new Map<AbortSignal, () => void>();
	const dispose = () => {
		for (const [signal, listener] of listeners) signal.removeEventListener('abort', listener);
		listeners.clear();
	};
	for (const signal of active) {
		const listener = () => {
			controller.abort(signal.reason);
			dispose();
		};
		listeners.set(signal, listener);
		signal.addEventListener('abort', listener, { once: true });
	}
	return { signal: controller.signal, dispose };
}
