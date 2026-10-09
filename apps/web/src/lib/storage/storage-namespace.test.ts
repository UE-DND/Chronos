import { expect, it } from 'vite-plus/test';
import { createStorageNamespace } from '@chronos/core';
import { scopedStorage } from './storage-namespace';

it('isolates root, sibling and nested deployments for reads, enumeration and deletion', () => {
	const values = new Map<string, string>();
	const raw: Storage = {
		get length() {
			return values.size;
		},
		key: (index) => [...values.keys()][index] ?? null,
		getItem: (key) => values.get(key) ?? null,
		setItem: (key, value) => {
			values.set(key, value);
		},
		removeItem: (key) => {
			values.delete(key);
		},
		clear: () => values.clear()
	};
	const stores = ['', '/one', '/one/two', '/other'].map((base) =>
		scopedStorage(raw, createStorageNamespace(base).prefix)
	);
	stores.forEach((storage, index) => storage.setItem('theme', String(index)));
	expect(stores.map((storage) => storage.getItem('theme'))).toEqual(['0', '1', '2', '3']);
	expect(stores.map((storage) => storage.length)).toEqual([1, 1, 1, 1]);
	stores[1]!.clear();
	expect(stores.map((storage) => storage.getItem('theme'))).toEqual(['0', null, '2', '3']);
	expect(createStorageNamespace('/one/')).toMatchObject({
		prefix: createStorageNamespace('/one').prefix
	});
});
