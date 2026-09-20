import { deflateRaw, inflateRaw } from '@chronos/codec-kit';

export const MAX_SHARE_DECOMPRESSED_BYTES = 262_144;

export class ShareDecompressionTooLargeError extends Error {
	constructor() {
		super('share payload exceeds decompression limit');
	}
}

export const compressShare = deflateRaw;

export async function decompressShare(
	bytes: Uint8Array,
	maxBytes: number = MAX_SHARE_DECOMPRESSED_BYTES
): Promise<Uint8Array> {
	if (typeof DecompressionStream === 'undefined') {
		const decompressed = await inflateRaw(bytes);
		if (decompressed.length > maxBytes) throw new ShareDecompressionTooLargeError();
		return decompressed;
	}
	const stream = new ReadableStream<Uint8Array>({
		start(controller) {
			controller.enqueue(bytes);
			controller.close();
		}
	}).pipeThrough(
		new DecompressionStream('deflate-raw') as unknown as ReadableWritablePair<
			Uint8Array,
			Uint8Array
		>
	);
	const reader = stream.getReader();
	const chunks: Uint8Array[] = [];
	let total = 0;
	for (;;) {
		const { done, value } = await reader.read();
		if (done) break;
		total += value.byteLength;
		if (total > maxBytes) {
			await reader.cancel().catch(() => {});
			throw new ShareDecompressionTooLargeError();
		}
		chunks.push(value);
	}
	const output = new Uint8Array(total);
	let offset = 0;
	for (const chunk of chunks) {
		output.set(chunk, offset);
		offset += chunk.byteLength;
	}
	return output;
}
