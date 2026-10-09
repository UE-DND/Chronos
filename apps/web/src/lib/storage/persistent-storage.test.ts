import { describe, expect, it, vi } from 'vite-plus/test';
import { createPersistentStorageRequest } from './persistent-storage';

describe('persistent storage request', () => {
	it.each([true, false])('records permission result %s and coalesces saves', async (granted) => {
		const manager = { persisted: vi.fn(async () => false), persist: vi.fn(async () => granted) };
		const storage = { setItem: vi.fn() };
		const request = createPersistentStorageRequest(manager, storage as unknown as Storage);
		await Promise.all([request(), request(), request()]);
		expect(manager.persist).toHaveBeenCalledOnce();
		expect(storage.setItem).toHaveBeenCalledWith(
			'chronos:storage-persistence',
			granted ? 'granted' : 'denied'
		);
	});
	it('does not request permission when already persistent', async () => {
		const manager = { persisted: vi.fn(async () => true), persist: vi.fn() };
		await createPersistentStorageRequest(manager, null)();
		expect(manager.persist).not.toHaveBeenCalled();
	});
	it('records unsupported browsers without rejecting', async () => {
		const storage = { setItem: vi.fn() };
		await createPersistentStorageRequest(undefined, storage as unknown as Storage)();
		expect(storage.setItem).toHaveBeenCalledWith('chronos:storage-persistence', 'unsupported');
	});
	it('contains API and result-storage failures', async () => {
		const warn = vi.spyOn(console, 'warn').mockImplementation(() => {});
		try {
			const manager = {
				persisted: vi.fn().mockRejectedValue(new Error('unavailable')),
				persist: vi.fn()
			};
			const storage = {
				setItem: vi.fn(() => {
					throw new Error('storage blocked');
				})
			} as unknown as Storage;
			await expect(
				createPersistentStorageRequest(manager, storage as unknown as Storage)()
			).resolves.toBeUndefined();
			expect(manager.persist).not.toHaveBeenCalled();
		} finally {
			warn.mockRestore();
		}
	});
});
