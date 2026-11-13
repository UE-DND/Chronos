import type { IStorageService, PluginStorageScope } from '../types/services';
import type { EngineContextHost } from './engine-context-host';
import type { Disposable } from '../types/services';

export interface PluginI18nApi {
	readonly locale: string;
	t(key: string, params?: Record<string, unknown>): string;
	registerMessages(messages: Record<string, Record<string, string>>): Disposable;
}

// Lightweight non-database hosts serialize atomic updates on their shared storage port.
const storageQueues = new WeakMap<IStorageService, Promise<unknown>>();

export function createPluginStorage(
	pluginId: string,
	storage: IStorageService,
	revision?: number
): PluginStorageScope {
	if (storage.createPluginScope) return storage.createPluginScope(pluginId, revision);
	return {
		get: <T = unknown>(key: string) => storage.getPluginData<T>(pluginId, key),
		set: <T = unknown>(key: string, value: T) => storage.setPluginData(pluginId, key, value),
		delete: (key: string) => storage.deletePluginData(pluginId, key),
		updateJson<T>(key: string, change: (current: T | null) => T): Promise<T> {
			const operation = (storageQueues.get(storage) ?? Promise.resolve())
				.catch(() => {})
				.then(async () => {
					const current = await storage.getPluginData<T>(pluginId, key);
					const next = change(current === null ? null : structuredClone(current));
					if (next instanceof Promise)
						throw new TypeError('Plugin JSON change must be synchronous');
					await storage.setPluginData(pluginId, key, next);
					return structuredClone(next);
				});
			storageQueues.set(storage, operation);
			return operation;
		},
		onKeyChanged: (key, listener) =>
			storage.onChanged?.((event) => {
				if (
					event.type === 'pluginData' &&
					(event.key === `${pluginId}:${key}` || event.key === pluginId)
				)
					return listener();
			}) ?? { dispose() {} }
	};
}

/** Creates per-plugin i18n helpers bound to the engine host. */
export function createPluginI18n(
	pluginId: string,
	host: EngineContextHost,
	onRegister: (disposable: Disposable) => void,
	beforeRegister: () => void
): PluginI18nApi {
	return {
		get locale() {
			return host.locale;
		},
		t: (key: string, params?: Record<string, unknown>) =>
			host.translateForPlugin(pluginId, key, params),
		registerMessages: (messages: Record<string, Record<string, string>>) => {
			beforeRegister();
			const handle = host.i18nCatalog.register(pluginId, messages);
			onRegister(handle);
			return handle;
		}
	};
}
