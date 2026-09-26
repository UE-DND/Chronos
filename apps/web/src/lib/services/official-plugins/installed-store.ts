import type { ChronosEngine, Disposable, HostBuildIdentity } from '@chronos/core';
import {
	INSTALLED_STORAGE_KEY,
	OFFICIAL_PLUGINS_PLUGIN_ID,
	type InstalledOfficialPluginRecord
} from './official-plugin-types';

export interface PreparedPluginUpdate {
	target: HostBuildIdentity;
	revision: number;
	records: InstalledOfficialPluginRecord[];
	token: string;
	until: number;
}
export interface PluginInstallationState {
	records: InstalledOfficialPluginRecord[];
	removed: string[];
	seeded: boolean;
	revision: number;
	generation: string;
	prepared?: PreparedPluginUpdate;
}
export interface PluginInstallationRepository {
	read(): Promise<PluginInstallationState>;
	transaction(change: (state: PluginInstallationState) => void): Promise<PluginInstallationState>;
}
export function emptyInstallationState(): PluginInstallationState {
	return { records: [], removed: [], seeded: false, revision: 0, generation: '' };
}
export function parseInstallationState(value: unknown): PluginInstallationState {
	if (value == null) return emptyInstallationState();
	const state = value as PluginInstallationState;
	if (
		!Array.isArray(state.records) ||
		!Array.isArray(state.removed) ||
		typeof state.seeded !== 'boolean' ||
		!Number.isSafeInteger(state.revision) ||
		state.revision < 0 ||
		typeof state.generation !== 'string' ||
		state.removed.some((id) => typeof id !== 'string') ||
		state.records.some(
			(record) =>
				!record?.manifest?.id ||
				typeof record.enabled !== 'boolean' ||
				!(
					record.origin?.kind === 'user' ||
					(record.origin?.kind === 'profile' && typeof record.origin.profileId === 'string')
				)
		) ||
		new Set(state.records.map((record) => record.manifest.id)).size !== state.records.length ||
		(state.prepared &&
			(!Array.isArray(state.prepared.records) ||
				!state.prepared.target?.buildId ||
				!Number.isSafeInteger(state.prepared.revision) ||
				typeof state.prepared.token !== 'string' ||
				!Number.isFinite(state.prepared.until)))
	)
		throw new Error('Invalid plugin installation state; reset development data manually');
	return state;
}

// Non-browser hosts and tests share a queue per storage port. Browser production uses a Dexie transaction.
const queues = new WeakMap<object, Promise<unknown>>();
function storageRepository(engine: ChronosEngine): PluginInstallationRepository {
	const read = async () =>
		structuredClone(
			parseInstallationState(
				await engine.storage.getPluginData(OFFICIAL_PLUGINS_PLUGIN_ID, INSTALLED_STORAGE_KEY)
			)
		);
	return {
		read,
		transaction(change) {
			const operation = (queues.get(engine.storage) ?? Promise.resolve())
				.catch(() => {})
				.then(async () => {
					const state = await read();
					change(state);
					await engine.storage.setPluginData(
						OFFICIAL_PLUGINS_PLUGIN_ID,
						INSTALLED_STORAGE_KEY,
						state
					);
					return state;
				});
			queues.set(engine.storage, operation);
			return operation;
		}
	};
}

export class OfficialPluginInstalledStore {
	private state = emptyInstallationState();
	private generation = '';
	private listeners = new Set<() => void>();
	private repository: PluginInstallationRepository;
	private channel?: BroadcastChannel;
	constructor(engine: ChronosEngine, repository?: PluginInstallationRepository) {
		this.repository = repository ?? storageRepository(engine);
		if (repository && typeof window !== 'undefined' && typeof BroadcastChannel !== 'undefined') {
			this.channel = new BroadcastChannel('chronos-plugin-installations');
			this.channel.onmessage = () => {
				void this.load()
					.then(() => this.notify())
					.catch(console.error);
			};
		}
	}
	onChanged(listener: () => void): Disposable {
		this.listeners.add(listener);
		return { dispose: () => this.listeners.delete(listener) };
	}
	notify(): void {
		for (const listener of this.listeners) {
			try {
				listener();
			} catch (error) {
				console.error(error);
			}
		}
	}
	async load(): Promise<InstalledOfficialPluginRecord[]> {
		this.state = await this.repository.read();
		return this.state.records;
	}
	getCache(): ReadonlyArray<InstalledOfficialPluginRecord> {
		return this.state.records;
	}
	find(id: string) {
		return this.state.records.find((record) => record.manifest.id === id);
	}
	has(id: string) {
		return Boolean(this.find(id));
	}
	getRemoved(): readonly string[] {
		return this.state.removed;
	}
	get isSeeded() {
		return this.state.seeded;
	}
	get revision() {
		return this.state.revision;
	}
	get hostGeneration() {
		return this.state.generation;
	}
	get isFrozen() {
		return Boolean(this.state.prepared && this.state.prepared.until > Date.now());
	}
	get hostChanged() {
		return Boolean(this.generation && this.state.generation !== this.generation);
	}
	get prepared() {
		return this.state.prepared;
	}

	async startHost(host: HostBuildIdentity, expectedGeneration?: string): Promise<void> {
		this.state = await this.repository.transaction((state) => {
			if (
				expectedGeneration !== undefined &&
				state.generation !== expectedGeneration &&
				state.generation !== host.buildId
			)
				throw new Error('Host generation changed during initialization; reload');
			if (
				state.prepared?.target.buildId === host.buildId &&
				state.prepared.revision === state.revision
			) {
				for (const record of state.prepared.records) {
					const index = state.records.findIndex((old) => old.manifest.id === record.manifest.id);
					if (index >= 0)
						state.records[index] = { ...record, enabled: state.records[index].enabled };
				}
				state.revision++;
				delete state.prepared;
			}
			if (state.generation !== host.buildId) {
				state.generation = host.buildId;
				delete state.prepared;
			}
		});
		this.generation = host.buildId;
		this.channel?.postMessage({ generation: host.buildId });
	}
	private async mutate(change: (state: PluginInstallationState) => void): Promise<void> {
		this.state = await this.repository.transaction((state) => {
			if (
				state.generation !== this.generation ||
				(state.prepared && state.prepared.until > Date.now())
			)
				throw new Error('Application update in progress; reload before changing plugins');
			change(state);
			state.revision++;
			delete state.prepared;
		});
		this.channel?.postMessage({ revision: this.state.revision });
		this.notify();
	}
	async markSeeded() {
		await this.mutate((state) => {
			state.seeded = true;
		});
	}
	async upsert(record: InstalledOfficialPluginRecord, expected?: number): Promise<void> {
		await this.mutate((state) => {
			const index = state.records.findIndex((old) => old.manifest.id === record.manifest.id);
			const old = state.records[index];
			if (expected !== undefined && (old?.revision ?? -1) !== expected)
				throw new Error('Plugin changed during download; retry');
			const next = { ...record, revision: (old?.revision ?? 0) + 1 };
			if (index >= 0) state.records[index] = next;
			else state.records.push(next);
			state.removed = state.removed.filter((id) => id !== record.manifest.id);
		});
	}
	async remove(id: string) {
		await this.mutate((state) => {
			state.records = state.records.filter((record) => record.manifest.id !== id);
			state.removed = [...new Set([...state.removed, id])];
		});
	}
	async setEnabled(id: string, enabled: boolean, acceptedHostVersion?: string) {
		await this.mutate((state) => {
			const record = state.records.find((record) => record.manifest.id === id);
			if (!record) throw new Error(`Plugin not installed: ${id}`);
			record.enabled = enabled;
			if (acceptedHostVersion) record.acceptedHostVersion = acceptedHostVersion;
			record.revision = (record.revision ?? 0) + 1;
		});
	}
	async prepare(update: PreparedPluginUpdate): Promise<void> {
		this.state = await this.repository.transaction((state) => {
			if (state.generation !== this.generation || state.revision !== update.revision)
				throw new Error('Installed plugins changed; retry update');
			if (
				state.prepared &&
				state.prepared.until > Date.now() &&
				state.prepared.token !== update.token
			)
				throw new Error('Update is already running in another window');
			state.prepared = update;
		});
		this.channel?.postMessage({ transition: update.target.buildId });
		this.notify();
	}
	async cancelPreparation(token: string) {
		this.state = await this.repository.transaction((state) => {
			if (state.prepared?.token === token) delete state.prepared;
		});
		this.channel?.postMessage({ cancelled: token });
		this.notify();
	}
	async persist() {
		await this.load();
		this.notify();
	}
	clear() {
		this.state = emptyInstallationState();
		this.generation = '';
		this.notify();
	}
	dispose() {
		this.channel?.close();
		this.listeners.clear();
	}
}
