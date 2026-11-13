import { PLUGIN_CONFIG_STORAGE_KEY } from '../constants/plugin-storage';
import type {
	Disposable,
	ServiceIdentifier,
	PluginStorageScope,
	IPluginHttpService
} from '../types/services';
import type { ChronosContext, ChronosEvents } from '../types/context';
import type { ChronosActions } from '../types/actions';
import type { ChronosSlotMap, CourseBadgeSlotContribution } from '../types/slots';
import type { EngineContextHost } from './engine-context-host';
import { createPluginI18n, createPluginStorage } from './plugin-context-factories';
import { immutableSnapshot } from './immutable-snapshot';
import { belongsToDomain } from '../hosts/url-policy';
import { pluginAnalyticsEventName } from '../analytics/plugin-analytics';

export type { EngineContextHost } from './engine-context-host';

const clockLeases = new WeakMap<EngineContextHost, Map<symbol, Date>>();

export class ScopedContext<Config extends object = Record<string, unknown>>
	implements ChronosContext<Config>, Disposable
{
	readonly subscriptions: Disposable[] = [];
	readonly instanceToken = Symbol('plugin activation');
	private readonly lifecycle = new AbortController();
	readonly signal = this.lifecycle.signal;
	private _config: Config;
	private configWrites: Promise<void> | undefined;
	private readonly pendingWrites = new Set<Promise<unknown>>();
	private accepted = false;
	private scope: PluginStorageScope;
	readonly storage: PluginStorageScope;
	readonly i18n: ReturnType<typeof createPluginI18n>;
	readonly actions: Omit<ChronosActions, 'setVirtualNow'>;
	readonly query: ChronosContext['query'];
	readonly calendar: ChronosContext['calendar'];
	readonly clock: ChronosContext['clock'];

	constructor(
		readonly pluginId: string,
		private host: EngineContextHost,
		initialConfig?: Config,
		private allowedDomains: readonly string[] = []
	) {
		this._config = immutableSnapshot((initialConfig ?? {}) as Config);
		this.scope = createPluginStorage(pluginId, host.env.storage);
		this.storage = {
			get: <T = unknown>(key: string) => this.scope.get<T>(key),
			set: <T = unknown>(key: string, value: T) => this.write(() => this.scope.set(key, value)),
			delete: (key) =>
				this.write(() => {
					if (key === PLUGIN_CONFIG_STORAGE_KEY)
						throw new Error('Use updateConfig for reserved plugin configuration');
					return this.scope.delete(key);
				}),
			updateJson: <T>(key: string, change: (current: T | null) => T) =>
				this.write(() => this.scope.updateJson(key, change)),
			onKeyChanged: (key, listener) => {
				this.assertRunning();
				return this.track(
					this.scope.onKeyChanged(key, () => {
						if (!this.signal.aborted) return listener();
					})
				);
			}
		};
		this.i18n = createPluginI18n(
			pluginId,
			host,
			(disposable) => this.addDisposable(disposable),
			() => this.assertRunning()
		);
		const synchronous = new Set(['setTheme', 'notify']);
		this.actions = Object.fromEntries(
			Object.entries(host.actions)
				.filter(([name]) => name !== 'setVirtualNow')
				.map(([name, action]) => [
					name,
					(...args: unknown[]) => {
						if (synchronous.has(name)) {
							this.assertRunning();
							return Reflect.apply(action, undefined, args);
						}
						return this.write(() => Promise.resolve(Reflect.apply(action, undefined, args)));
					}
				])
		) as Omit<ChronosActions, 'setVirtualNow'>;
		this.query = {
			listTimetables: async () => immutableSnapshot(await host.env.storage.listTimetables()),
			getTimetable: async (id) => immutableSnapshot(await host.env.storage.getTimetable(id)),
			queryCourses: async (filter) => immutableSnapshot(await host.env.storage.queryCourses(filter))
		};
		this.calendar = { getHolidays: (timetable) => host.resolveHolidays(timetable) };
		this.clock = {
			set: (now) => {
				this.assertRunning();
				if (now && !Number.isFinite(now.getTime())) throw new TypeError('Invalid virtual clock');
				let leases = clockLeases.get(host);
				if (!leases) {
					leases = new Map();
					clockLeases.set(host, leases);
				}
				leases.delete(this.instanceToken);
				if (now) leases.set(this.instanceToken, new Date(now.getTime()));
				this.publishClock(leases);
			}
		};
	}

	private publishClock(leases: Map<symbol, Date>): void {
		this.host.actions.setVirtualNow([...leases.values()].at(-1) ?? null);
	}

	accept(revision?: number): void {
		this.assertRunning();
		if (this.accepted) return;
		this.scope = createPluginStorage(this.pluginId, this.host.env.storage, revision);
		this.accepted = true;
	}

	private assertRunning(): void {
		if (this.signal.aborted) throw new Error(`Plugin context "${this.pluginId}" is disposed`);
	}

	private assertWritable(): void {
		this.assertRunning();
		if (!this.accepted) throw new Error(`Plugin context "${this.pluginId}" has not been accepted`);
	}

	private write<T>(operation: () => Promise<T>): Promise<T> {
		let pending: Promise<T>;
		try {
			this.assertWritable();
			pending = Promise.resolve(operation());
		} catch (error) {
			return Promise.reject(error);
		}
		this.pendingWrites.add(pending);
		void pending.then(
			() => this.pendingWrites.delete(pending),
			() => this.pendingWrites.delete(pending)
		);
		return pending;
	}

	whenWritesSettled(): Promise<unknown> | undefined {
		const pending = [...this.pendingWrites, ...(this.configWrites ? [this.configWrites] : [])];
		return pending.length ? Promise.allSettled(pending) : undefined;
	}

	get config(): Readonly<Config> {
		return this._config;
	}

	updateConfig(patch: Partial<Config>): Promise<void> {
		try {
			this.assertWritable();
		} catch (error) {
			return Promise.reject(error);
		}
		const values = immutableSnapshot(patch);
		const scope = this.scope;
		const result = (this.configWrites ?? Promise.resolve()).then(async () => {
			const next = { ...this._config, ...values };
			await scope.set(PLUGIN_CONFIG_STORAGE_KEY, next);
			this._config = immutableSnapshot(next);
			if (this.signal.aborted) return;
			this.host.events.emit('config:changed', {
				pluginId: this.pluginId,
				config: next as Record<string, unknown>
			});
		});
		const settled = result.then(
			() => {
				if (this.configWrites === settled) this.configWrites = undefined;
			},
			() => {
				if (this.configWrites === settled) this.configWrites = undefined;
			}
		);
		this.configWrites = settled;
		return result;
	}

	service<T>(identifier: ServiceIdentifier<T>): T {
		const service = this.tryService(identifier);
		if (service === undefined)
			throw new Error(`[ScopedContext] Service not found: "${identifier.key}"`);
		return service;
	}

	tryService<T>(identifier: ServiceIdentifier<T>): T | undefined {
		const key = identifier.key;
		const env = this.host.env;
		if (key === 'hostLinks') return env.hostLinks as T | undefined;
		if (key === 'pluginHttp') {
			const signal = (caller?: AbortSignal) =>
				caller ? AbortSignal.any([this.signal, caller]) : this.signal;
			const http: IPluginHttpService = {
				request: async (url, options) => {
					this.assertRunning();
					const parsed = new URL(url);
					if (
						parsed.protocol !== 'https:' ||
						parsed.username ||
						parsed.password ||
						!belongsToDomain(parsed.hostname, this.allowedDomains)
					)
						throw new Error(`Plugin request domain is not allowed: ${parsed.hostname}`);
					return env.http.request(url, { ...options, signal: signal(options?.signal) });
				},
				supportsServer: (action) =>
					!this.signal.aborted && (env.http.supportsPluginServer?.(this.pluginId, action) ?? false),
				proxy: async (action, payload, options) => {
					this.assertRunning();
					if (!env.http.proxy) throw new Error('HTTP proxy is not supported in this environment');
					return env.http.proxy(this.pluginId, action, payload, {
						...options,
						signal: signal(options?.signal)
					});
				}
			};
			return http as T;
		}
		if (key === 'runtime')
			return { platform: env.platform, sha256: env.runtime.sha256.bind(env.runtime) } as T;
		if (key === 'analytics' && env.analytics)
			return {
				track: (event: string, properties?: Record<string, unknown>) => {
					this.assertRunning();
					env.analytics!.track(pluginAnalyticsEventName(this.pluginId, event), {
						...properties,
						source: 'plugin',
						plugin_id: this.pluginId
					});
				}
			} as T;
		if (key === 'errorCapture' && env.errorCapture)
			return {
				onCaptured: (
					listener: Parameters<NonNullable<typeof env.errorCapture>['onCaptured']>[0]
				) => {
					this.assertRunning();
					return this.track(
						env.errorCapture!.onCaptured((entry) => {
							if (!this.signal.aborted) listener(entry);
						})
					);
				}
			} as T;
		if (key === 'hostNavigation' && env.navigation)
			return {
				openCourseEditor: (id: string) => {
					this.assertRunning();
					env.navigation!.openCourseEditor(id);
				},
				...(env.navigation.openCourseDetail
					? {
							openCourseDetail: (id: string, timetableId?: string) => {
								this.assertRunning();
								env.navigation!.openCourseDetail!(id, timetableId);
							}
						}
					: {})
			} as T;
		if (key === 'coursePresentation') return env.coursePresentation as T | undefined;
		return undefined;
	}

	get state() {
		return this.host.state;
	}

	private track(disposable: Disposable): Disposable {
		let active = true;
		const tracked = {
			dispose: () => {
				if (!active) return;
				active = false;
				const index = this.subscriptions.indexOf(tracked);
				if (index >= 0) this.subscriptions.splice(index, 1);
				disposable.dispose();
			}
		};
		this.addDisposable(tracked);
		return tracked;
	}

	addDisposable(disposable: Disposable): void {
		if (this.signal.aborted) {
			disposable.dispose();
			return;
		}
		this.subscriptions.push(disposable);
	}

	registerSlot<K extends keyof ChronosSlotMap>(
		slotName: K,
		contribution: ChronosSlotMap[K] & { id: string }
	): Disposable {
		this.assertRunning();
		const slot = this.host.slots.register(slotName, contribution, this.pluginId);
		if (slotName === 'timetable.cell.badge' && this.host.badges) {
			const badge = this.host.badges.registerCourseBadge(
				contribution as unknown as CourseBadgeSlotContribution,
				this
			);
			return this.track({
				dispose: () => {
					badge.dispose();
					slot.dispose();
				}
			});
		}
		return this.track(slot);
	}

	on<E extends keyof ChronosEvents>(
		event: E,
		handler: (payload: ChronosEvents[E]) => void | Promise<void>
	): Disposable {
		this.assertRunning();
		return this.track(
			this.host.events.on(event, (payload) => {
				if (!this.signal.aborted) return handler(payload);
			})
		);
	}

	dispose(): void {
		if (this.signal.aborted) return;
		this.lifecycle.abort();
		const leases = clockLeases.get(this.host);
		if (leases?.delete(this.instanceToken)) this.publishClock(leases);
		while (this.subscriptions.length) {
			const disposable = this.subscriptions.pop()!;
			try {
				disposable.dispose();
			} catch (error) {
				console.error(`[ScopedContext] Error disposing subscription in "${this.pluginId}":`, error);
			}
		}
	}
}
