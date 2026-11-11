import { PLUGIN_CONFIG_STORAGE_KEY } from '../constants/plugin-storage';
import type { Disposable, ServiceIdentifier } from '../types/services';
import type { ChronosContext, ChronosEvents } from '../types/context';
import type { ChronosSlotMap } from '../types/slots';
import type { CourseBadgeSlotContribution } from '../types/slots';
import type { EngineContextHost } from './engine-context-host';
import { createPluginI18n, createPluginStorage } from './plugin-context-factories';

export type { EngineContextHost } from './engine-context-host';

export class ScopedContext<Config extends object = Record<string, unknown>>
	implements ChronosContext<Config>, Disposable
{
	readonly subscriptions: Disposable[] = [];
	private _config: Config;
	private configWrites: Promise<void> | undefined;
	private disposed = false;

	readonly storage: ReturnType<typeof createPluginStorage>;
	readonly i18n: ReturnType<typeof createPluginI18n>;

	constructor(
		readonly pluginId: string,
		private host: EngineContextHost,
		initialConfig?: Config
	) {
		this._config = (initialConfig ?? {}) as Config;

		this.storage = createPluginStorage(this.pluginId, () => this.host.env.storage);
		this.i18n = createPluginI18n(this.pluginId, this.host, (disposable) => {
			this.subscriptions.push(disposable);
		});
	}

	get config(): Readonly<Config> {
		return this._config;
	}

	updateConfig(patch: Partial<Config>): Promise<void> {
		if (this.disposed)
			return Promise.reject(new Error(`Plugin context "${this.pluginId}" is disposed`));
		const values = { ...patch };
		const result = (this.configWrites ?? Promise.resolve()).then(async () => {
			if (this.disposed) throw new Error(`Plugin context "${this.pluginId}" is disposed`);
			const next = { ...this._config, ...values };
			await this.storage.set(PLUGIN_CONFIG_STORAGE_KEY, next);
			if (this.disposed) return;
			this._config = next;
			this.host.events.emit('config:changed', {
				pluginId: this.pluginId,
				config: next as Record<string, unknown>
			});
		});
		const clearQueue = () => {
			if (this.configWrites === settled) this.configWrites = undefined;
		};
		const settled = result.then(clearQueue, clearQueue);
		this.configWrites = settled;
		return result;
	}

	whenConfigWritesSettled(): Promise<void> | undefined {
		return this.configWrites;
	}

	service<T>(identifier: ServiceIdentifier<T>): T {
		const svc = this.tryService(identifier);
		if (svc === undefined) {
			throw new Error(`[ScopedContext] Service not found: "${identifier.key}"`);
		}
		return svc;
	}

	tryService<T>(identifier: ServiceIdentifier<T>): T | undefined {
		const key = identifier.key;
		const env = this.host.env;
		if (key === 'hostLinks') return env.hostLinks as T | undefined;
		if (key === 'storage') return env.storage as T;
		if (key === 'http') return env.http as T;
		if (key === 'vault') return env.vault as T | undefined;
		if (key === 'runtime') {
			return {
				platform: env.platform,
				sha256: env.runtime.sha256.bind(env.runtime)
			} as T;
		}
		if (key === 'analytics') return env.analytics as T | undefined;
		if (key === 'errorCapture') return env.errorCapture as T | undefined;
		if (key === 'hostNavigation') return env.navigation as T | undefined;
		if (key === 'coursePresentation') return env.coursePresentation as T | undefined;
		return undefined;
	}

	get state() {
		return this.host.state;
	}

	get actions() {
		return this.host.actions;
	}

	private track<T extends Disposable>(disposable: T): T {
		this.subscriptions.push(disposable);
		return {
			dispose: () => {
				const index = this.subscriptions.indexOf(disposable);
				if (index >= 0) {
					this.subscriptions.splice(index, 1);
				}
				disposable.dispose();
			}
		} as T;
	}

	addDisposable(disposable: Disposable): void {
		this.subscriptions.push(disposable);
	}

	registerSlot<K extends keyof ChronosSlotMap>(
		slotName: K,
		contribution: ChronosSlotMap[K] & { id: string }
	): Disposable {
		const slotDisp = this.host.slots.register(slotName, contribution, this.pluginId);

		if (slotName === 'timetable.cell.badge' && this.host.badges) {
			const badgeDisp = this.host.badges.registerCourseBadge(
				contribution as unknown as CourseBadgeSlotContribution,
				this
			);
			return this.track({
				dispose: () => {
					badgeDisp.dispose();
					slotDisp.dispose();
				}
			});
		}

		return this.track(slotDisp);
	}

	on<E extends keyof ChronosEvents>(
		event: E,
		handler: (payload: ChronosEvents[E]) => void | Promise<void>
	): Disposable {
		return this.track(this.host.events.on(event, handler));
	}

	emit<E extends keyof ChronosEvents>(event: E, payload: ChronosEvents[E]): void {
		this.host.events.emit(event, payload);
	}

	dispose(): void {
		this.disposed = true;
		for (let i = this.subscriptions.length - 1; i >= 0; i--) {
			const sub = this.subscriptions[i];
			if (sub) {
				try {
					sub.dispose();
				} catch (error) {
					console.error(
						`[ScopedContext] Error disposing subscription in "${this.pluginId}":`,
						error
					);
				}
			}
		}
		this.subscriptions.length = 0;
	}
}
