import { describe, expect, it, vi } from 'vite-plus/test';
import type { ChronosDB, PluginBinaryRow, PluginDataRow } from '#lib/storage/db.ts';
import { PluginKvRepository } from '#lib/storage/plugin-kv-repository.ts';

function createMockDb() {
	const pluginDataMap = new Map<string, PluginDataRow>();
	const pluginBinaryMap = new Map<string, PluginBinaryRow>();

	const db = {
		transaction: vi.fn(async (_mode: string, _tables: unknown, work: () => Promise<unknown>) =>
			work()
		),
		pluginData: {
			clear: vi.fn(async () => pluginDataMap.clear()),
			get: vi.fn(async (id: string) => pluginDataMap.get(id)),
			put: vi.fn(async (row: PluginDataRow) => {
				pluginDataMap.set(row.id, row);
			}),
			delete: vi.fn(async (id: string) => {
				pluginDataMap.delete(id);
			}),
			where: vi.fn(() => ({
				equals: (pluginId: string) => ({
					delete: async () => {
						for (const [id, row] of pluginDataMap.entries()) {
							if (row.pluginId === pluginId) pluginDataMap.delete(id);
						}
					}
				})
			})),
			toArray: async () => Array.from(pluginDataMap.values())
		},
		pluginBinary: {
			clear: vi.fn(async () => pluginBinaryMap.clear()),
			get: vi.fn(async (id: string) => pluginBinaryMap.get(id)),
			put: vi.fn(async (row: PluginBinaryRow) => {
				pluginBinaryMap.set(row.id, row);
			}),
			delete: vi.fn(async (id: string) => {
				pluginBinaryMap.delete(id);
			}),
			where: vi.fn(() => ({
				equals: (pluginId: string) => ({
					delete: async () => {
						for (const [id, row] of pluginBinaryMap.entries()) {
							if (row.pluginId === pluginId) pluginBinaryMap.delete(id);
						}
					}
				})
			})),
			toArray: async () => Array.from(pluginBinaryMap.values())
		}
	} as unknown as ChronosDB;

	return { db, pluginDataMap, pluginBinaryMap };
}

describe('PluginKvRepository', () => {
	it('roundtrips Blob and Uint8Array values', async () => {
		const { db } = createMockDb();
		const repo = new PluginKvRepository(db);

		const blob = new Blob([new Uint8Array([1, 2, 3])], { type: 'image/png' });
		await repo.set('plugin-a', 'wallpaper', blob);
		const loadedBlob = await repo.get<Blob>('plugin-a', 'wallpaper');
		expect(loadedBlob).toBeInstanceOf(Blob);
		expect(new Uint8Array(await (loadedBlob as Blob).arrayBuffer())).toEqual(
			new Uint8Array([1, 2, 3])
		);

		await repo.set('plugin-a', 'bytes', new Uint8Array([9, 8, 7]));
		const loadedBytes = await repo.get<Blob>('plugin-a', 'bytes');
		expect(loadedBytes).toBeInstanceOf(Blob);
		expect((loadedBytes as Blob).type).toBe('application/octet-stream');
		expect(new Uint8Array(await (loadedBytes as Blob).arrayBuffer())).toEqual(
			new Uint8Array([9, 8, 7])
		);
	});

	it('replaces JSON with binary for the same key', async () => {
		const { db, pluginDataMap, pluginBinaryMap } = createMockDb();
		const repo = new PluginKvRepository(db);

		await repo.set('plugin-a', 'asset', { version: 1 });
		expect(pluginDataMap.has('plugin-a:asset')).toBe(true);
		expect(pluginBinaryMap.has('plugin-a:asset')).toBe(false);

		await repo.set('plugin-a', 'asset', new Uint8Array([1]));
		expect(pluginDataMap.has('plugin-a:asset')).toBe(false);
		expect(pluginBinaryMap.has('plugin-a:asset')).toBe(true);
		expect(await repo.get('plugin-a', 'asset')).toBeInstanceOf(Blob);
	});

	it('replaces binary with JSON for the same key', async () => {
		const { db, pluginDataMap, pluginBinaryMap } = createMockDb();
		const repo = new PluginKvRepository(db);

		await repo.set('plugin-a', 'asset', new Uint8Array([1]));
		await repo.set('plugin-a', 'asset', { version: 1 });

		expect(pluginBinaryMap.has('plugin-a:asset')).toBe(false);
		expect(pluginDataMap.has('plugin-a:asset')).toBe(true);
		expect(await repo.get<{ version: number }>('plugin-a', 'asset')).toEqual({ version: 1 });
	});

	it('returns null only for a missing value and preserves empty binary values', async () => {
		const { db } = createMockDb();
		const repo = new PluginKvRepository(db);
		await expect(repo.get('plugin', 'missing')).resolves.toBeNull();
		await repo.set('plugin', 'empty', new Uint8Array());
		const empty = await repo.get<Blob>('plugin', 'empty');
		expect(empty).toBeInstanceOf(Blob);
		expect(empty!.size).toBe(0);
	});

	it.each(['pluginData', 'pluginBinary'] as const)('propagates %s read failures', async (table) => {
		const { db } = createMockDb();
		const repo = new PluginKvRepository(db);
		const error = new Error('idb unavailable');
		vi.spyOn(db[table], 'get').mockRejectedValueOnce(error);

		await expect(repo.get('plugin', 'key')).rejects.toBe(error);
	});

	it.each(['{broken', ''])(
		'rejects malformed JSON %j without treating an existing record as missing',
		async (valueJson) => {
			const { db, pluginDataMap } = createMockDb();
			pluginDataMap.set('plugin:key', {
				id: 'plugin:key',
				pluginId: 'plugin',
				key: 'key',
				valueJson,
				updatedAt: 0
			});
			const repo = new PluginKvRepository(db);

			await expect(repo.get('plugin', 'key')).rejects.toBeInstanceOf(SyntaxError);
			expect(pluginDataMap.get('plugin:key')!.valueJson).toBe(valueJson);
		}
	);

	it.each([null, 42, false])(
		'rejects a non-string persisted JSON payload %j',
		async (valueJson) => {
			const { db, pluginDataMap } = createMockDb();
			pluginDataMap.set('plugin:key', {
				id: 'plugin:key',
				pluginId: 'plugin',
				key: 'key',
				valueJson,
				updatedAt: 0
			} as unknown as PluginDataRow);

			await expect(new PluginKvRepository(db).get('plugin', 'key')).rejects.toThrow(
				'Invalid stored plugin JSON'
			);
		}
	);

	it('rejects malformed binary records without falling back to JSON', async () => {
		const { db, pluginBinaryMap } = createMockDb();
		pluginBinaryMap.set('plugin:key', {
			id: 'plugin:key',
			pluginId: 'plugin',
			key: 'key',
			bytes: undefined,
			mimeType: 'text/plain',
			updatedAt: 0
		} as unknown as PluginBinaryRow);
		const repo = new PluginKvRepository(db);
		const readJson = vi.spyOn(db.pluginData, 'get');

		await expect(repo.get('plugin', 'key')).rejects.toThrow('Invalid stored plugin bytes');
		expect(readJson).not.toHaveBeenCalled();
	});

	it.each(['pluginData', 'pluginBinary'] as const)(
		'propagates %s size read failures',
		async (table) => {
			const { db } = createMockDb();
			const error = new Error('idb unavailable');
			vi.spyOn(db[table], 'toArray').mockRejectedValueOnce(error);
			const repo = new PluginKvRepository(db);

			await expect(repo.estimateBytes()).rejects.toBe(error);
		}
	);
});

it('does not delete the old value when Blob conversion fails', async () => {
	const { db, pluginDataMap } = createMockDb();
	const repo = new PluginKvRepository(db);
	await repo.set('plugin', 'key', { saved: true });
	const deleting = vi.spyOn(db.pluginData, 'delete');
	const blob = new Blob(['replacement']);
	vi.spyOn(blob, 'arrayBuffer').mockRejectedValue(new Error('unreadable'));
	await expect(repo.set('plugin', 'key', blob)).rejects.toThrow('unreadable');
	expect(JSON.parse(pluginDataMap.get('plugin:key')!.valueJson)).toEqual({ saved: true });
	expect(deleting).not.toHaveBeenCalled();
});

it('finishes Blob conversion before opening the replacement transaction', async () => {
	const { db } = createMockDb();
	const repo = new PluginKvRepository(db);
	const transaction = vi.spyOn(db, 'transaction');
	const gate = Promise.withResolvers<ArrayBuffer>();
	const blob = new Blob(['replacement'], { type: 'text/plain' });
	vi.spyOn(blob, 'arrayBuffer').mockReturnValue(gate.promise);
	const writing = repo.set('plugin', 'key', blob);
	expect(transaction).not.toHaveBeenCalled();
	gate.resolve(new Uint8Array([1]).buffer);
	await writing;
	expect(transaction).toHaveBeenCalledWith(
		'rw',
		[db.pluginData, db.pluginBinary],
		expect.any(Function)
	);
	expect((await repo.get<Blob>('plugin', 'key'))?.type).toBe('text/plain');
});
