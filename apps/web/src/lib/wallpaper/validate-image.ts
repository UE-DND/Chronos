/** Decode before installing an image so a valid hash cannot hide unusable bytes. */
export async function validateImage(blob: Blob, signal?: AbortSignal): Promise<void> {
	signal?.throwIfAborted();
	const image = new Image();
	const url = URL.createObjectURL(blob);
	let timeout: ReturnType<typeof setTimeout> | undefined;
	let onAbort: (() => void) | undefined;
	try {
		image.src = url;
		await new Promise<void>((resolve, reject) => {
			onAbort = () => reject(signal?.reason);
			signal?.addEventListener('abort', onAbort, { once: true });
			if (signal?.aborted) {
				onAbort();
				return;
			}
			timeout = setTimeout(
				() => reject(new DOMException('Image decoding timed out', 'TimeoutError')),
				20_000
			);
			// Keep a rejection handler attached even after cancellation or timeout wins.
			image.decode().then(resolve, reject);
		});
		signal?.throwIfAborted();
		if (!image.naturalWidth || !image.naturalHeight) throw new Error('Invalid wallpaper image');
	} finally {
		if (timeout !== undefined) clearTimeout(timeout);
		if (onAbort) signal?.removeEventListener('abort', onAbort);
		image.src = '';
		URL.revokeObjectURL(url);
	}
}
