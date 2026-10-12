/** Bounds waiting, without claiming to cancel the underlying operation. */
export function withStartupDeadline<T>(
	stage: string,
	milliseconds: number,
	work: () => Promise<T>,
	signal?: AbortSignal
): Promise<T> {
	return new Promise((resolve, reject) => {
		const cleanup = () => {
			clearTimeout(timer);
			signal?.removeEventListener('abort', aborted);
		};
		const failed = (error: unknown) => {
			cleanup();
			reject(error);
		};
		const aborted = () => failed(signal?.reason);
		const timer = setTimeout(
			() => failed(new Error(`Startup ${stage} timed out after ${milliseconds}ms`)),
			milliseconds
		);
		if (signal?.aborted) {
			aborted();
			return;
		}
		signal?.addEventListener('abort', aborted, { once: true });
		Promise.resolve()
			.then(() => {
				signal?.throwIfAborted();
				return work();
			})
			.then((value) => {
				cleanup();
				resolve(value);
			}, failed);
	});
}
