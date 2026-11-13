import { PLUGIN_CONFIG_STORAGE_KEY } from '../../constants/plugin-storage';
import type { ChronosPlugin } from '../../types/context';
import type { ChronosSlotMap } from '../../types/slots';
import type { Disposable, IStorageService } from '../../types/services';
import { ScopedContext } from '../scoped-context';
import type { EngineContextHost } from '../engine-context-host';
import type { EventPipeline } from '../event-pipeline';
import type { I18nCatalog } from '../../i18n/i18n-catalog';

export interface PluginLoadOptions {
	deferAcceptance?: boolean;
	storageRevision?: number;
}
export interface PluginLoadHandle extends Disposable {
	accept(storageRevision?: number): void;
}
type LoadedPluginEntry = {
	plugin: ChronosPlugin<Record<string, unknown>>;
	context: ScopedContext<Record<string, unknown>>;
	applied: Promise<void>;
	accepted: boolean;
	stopping?: Promise<void>;
};

/** An activation owns its abort signal, contributions, writes and load handle. */
export class PluginLifecycleManager {
	private readonly entries = new Map<string, LoadedPluginEntry>();
	private readonly tokens = new Map<string, symbol>();
	private readonly stopping = new Map<string, Promise<void>>();
	private disposed = false;

	constructor(
		private readonly host: EngineContextHost,
		private readonly storage: IStorageService,
		private readonly events: EventPipeline,
		private readonly i18nCatalog: I18nCatalog
	) {}

	getPluginContext(pluginId: string): ScopedContext<Record<string, unknown>> {
		const entry = this.entries.get(pluginId);
		if (!entry?.accepted || entry.context.signal.aborted)
			throw new Error(`Plugin "${pluginId}" is not running`);
		return entry.context;
	}

	getPluginContextForSlot<K extends keyof ChronosSlotMap>(
		slotName: K,
		slotId: string
	): ScopedContext<Record<string, unknown>> {
		const owner = this.host.slots.resolveOwner(slotName, slotId);
		if (!owner)
			throw new Error(`No owner plugin registered for slot ${String(slotName)}/${slotId}`);
		return this.getPluginContext(owner);
	}

	isPluginLoaded(pluginId: string): boolean {
		const entry = this.entries.get(pluginId);
		return Boolean(entry?.accepted && !entry.context.signal.aborted);
	}

	async loadPlugin<Config extends object = Record<string, unknown>>(
		plugin: ChronosPlugin<Config>,
		options: PluginLoadOptions = {}
	): Promise<PluginLoadHandle> {
		if (this.disposed) throw new Error('Plugin lifecycle is disposed');
		const token = Symbol(plugin.id);
		this.tokens.set(plugin.id, token);
		const previous = this.entries.get(plugin.id);
		if (previous) await this.stopEntry(plugin.id, previous);
		else await this.stopping.get(plugin.id);
		const assertCurrent = () => {
			if (this.disposed || this.tokens.get(plugin.id) !== token)
				throw new DOMException('Plugin activation was stopped', 'AbortError');
		};
		assertCurrent();
		const saved = await this.storage.getPluginData<Record<string, unknown>>(
			plugin.id,
			PLUGIN_CONFIG_STORAGE_KEY
		);
		assertCurrent();
		const context = new ScopedContext(
			plugin.id,
			this.host,
			{ ...plugin.defaultConfig, ...saved },
			plugin.allowedDomains
		);
		const entry: LoadedPluginEntry = {
			plugin: plugin as unknown as ChronosPlugin<Record<string, unknown>>,
			context,
			accepted: false,
			applied: Promise.resolve()
		};
		this.entries.set(plugin.id, entry);
		entry.applied = Promise.resolve().then(() => {
			assertCurrent();
			return plugin.apply(context as unknown as ScopedContext<Config>);
		});
		try {
			await entry.applied;
			assertCurrent();
			context.signal.throwIfAborted();
			const handle: PluginLoadHandle = {
				accept: (revision = options.storageRevision) => {
					assertCurrent();
					context.signal.throwIfAborted();
					if (entry.accepted) return;
					context.accept(revision);
					entry.accepted = true;
					this.events.emit('plugin:loaded', { pluginId: plugin.id });
				},
				dispose: () => {
					if (this.entries.get(plugin.id) !== entry) return;
					if (this.tokens.get(plugin.id) === token) this.tokens.delete(plugin.id);
					void this.stopEntry(plugin.id, entry);
				}
			};
			if (!options.deferAcceptance) handle.accept();
			return handle;
		} catch (error) {
			await this.stopEntry(plugin.id, entry);
			throw error;
		}
	}

	private stopEntry(pluginId: string, entry: LoadedPluginEntry): Promise<void> {
		if (entry.stopping) return entry.stopping;
		if (this.entries.get(pluginId) === entry) this.entries.delete(pluginId);
		entry.context.dispose();
		this.i18nCatalog.disposePlugin(pluginId);
		const stopping = (async () => {
			await entry.applied.catch(() => {});
			await entry.context.whenWritesSettled();
			try {
				await entry.plugin.dispose?.();
			} catch (error) {
				console.error(`[ChronosEngine] Error in plugin "${pluginId}" dispose hook:`, error);
			}
			if (entry.accepted) this.events.emit('plugin:unloaded', { pluginId });
		})();
		entry.stopping = stopping;
		this.stopping.set(pluginId, stopping);
		void stopping.finally(() => {
			if (this.stopping.get(pluginId) === stopping) this.stopping.delete(pluginId);
		});
		return stopping;
	}

	async unloadPlugin(pluginId: string): Promise<void> {
		this.tokens.delete(pluginId);
		const entry = this.entries.get(pluginId);
		if (entry) return this.stopEntry(pluginId, entry);
		await this.stopping.get(pluginId);
	}

	disposeAll(): void {
		this.disposed = true;
		this.tokens.clear();
		for (const [id, entry] of this.entries) void this.stopEntry(id, entry);
	}
}
