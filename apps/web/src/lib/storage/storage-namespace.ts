import { resolve } from '$app/paths';
import { createStorageNamespace } from '@chronos/core';

export const storageNamespace = createStorageNamespace(resolve(''));

/** Storage views expose only this deployment's keys, including enumeration and clear. */
export function scopedStorage(storage: Storage, prefix = storageNamespace.prefix): Storage {
	const keys = () =>
		Array.from({ length: storage.length }, (_, index) => storage.key(index)).filter(
			(key): key is string => key !== null && key.startsWith(prefix)
		);
	return {
		getItem: (key) => storage.getItem(prefix + key),
		setItem: (key, value) => storage.setItem(prefix + key, value),
		removeItem: (key) => storage.removeItem(prefix + key),
		key: (index) => keys()[index]?.slice(prefix.length) ?? null,
		get length() {
			return keys().length;
		},
		clear: () => {
			for (const key of keys()) storage.removeItem(key);
		}
	};
}
export const appLocalStorage = () => scopedStorage(localStorage);
export const appSessionStorage = () => scopedStorage(sessionStorage);
