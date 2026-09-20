import { describe, expect, it } from 'vite-plus/test';
import { deflateRaw } from '@chronos/codec-kit';
import { decompressShare } from '../src/share-link/share-link-compression';

describe('share-link-compression', () => {
	it('rejects decompressed output beyond the safety cap', async () => {
		const repetitive = new Uint8Array(300_000).fill(0x41);
		const compressed = await deflateRaw(repetitive);

		await expect(decompressShare(compressed)).rejects.toThrow(/exceeds decompression limit/);
	});
});
