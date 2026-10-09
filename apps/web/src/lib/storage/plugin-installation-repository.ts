import type { ChronosDB, PluginResourceRow } from './db';
import {
	parseInstallationState,
	type PluginInstallationState,
	type PluginInstallationRepository
} from '#lib/services/official-plugins/installed-store.ts';
import {
	INSTALLED_STORAGE_KEY,
	OFFICIAL_PLUGINS_PLUGIN_ID,
	type InstalledOfficialPluginRecord
} from '#lib/services/official-plugins/official-plugin-types.ts';

const resourceFields = ['code', 'cssCode', 'colorsJson', 'iconThemeJson'] as const;

/** Metadata and resource references commit together; metadata-only changes never rewrite bodies. */
export function createPluginInstallationRepository(
	database: ChronosDB
): PluginInstallationRepository {
	const id = `${OFFICIAL_PLUGINS_PLUGIN_ID}:${INSTALLED_STORAGE_KEY}`;
	const cached = new Map<string, PluginResourceRow>();
	const records = (state: PluginInstallationState) => [
		...state.records,
		...(state.prepared?.records ?? [])
	];
	const readMetadata = async () => {
		const row = await database.pluginData.get(id);
		const state = parseInstallationState(row ? JSON.parse(row.valueJson) : null);
		if (
			records(state).some(
				(record) =>
					!record.resourceId || resourceFields.some((field) => Object.hasOwn(record, field))
			)
		) {
			throw new Error('Invalid plugin resource references; reset development data manually');
		}
		return state;
	};
	const hydrate = async (
		state: PluginInstallationState,
		assets: Map<string, PluginResourceRow>,
		refresh = false
	) => {
		const ids = [...new Set(records(state).map((record) => record.resourceId!))].filter(
			(key) => refresh || !assets.has(key)
		);
		if (ids.length) {
			const rows = await database.pluginResources.bulkGet(ids);
			ids.forEach((key, index) => {
				const row = rows[index];
				if (row) assets.set(key, row);
				else assets.delete(key);
			});
		}
		const expand = (record: InstalledOfficialPluginRecord) => {
			const resource = assets.get(record.resourceId!);
			if (!resource) return record;
			const { id: _id, pluginId: _pluginId, ...body } = resource;
			return { ...record, ...body };
		};
		state.records = state.records.map(expand);
		if (state.prepared) state.prepared.records = state.prepared.records.map(expand);
		return state;
	};
	return {
		read: () =>
			database.transaction('r', [database.pluginData, database.pluginResources], async () =>
				hydrate(await readMetadata(), cached, true)
			),
		async transaction(change) {
			const assets = new Map(cached);
			const result = await database.transaction(
				'rw',
				[database.pluginData, database.pluginResources],
				async () => {
					const state = await hydrate(await readMetadata(), assets);
					const previous = new Set(records(state).map((record) => record.resourceId!));
					change(state);
					// Copy records before stripping bodies; callers may reuse installed snapshots.
					state.records = state.records.map((record) => ({ ...record }));
					if (state.prepared)
						state.prepared = {
							...state.prepared,
							records: state.prepared.records.map((record) => ({ ...record }))
						};
					for (const record of records(state)) {
						if (
							resourceFields.some((field) => Object.hasOwn(record, field)) ||
							!record.resourceId
						) {
							const existing = record.resourceId
								? (assets.get(record.resourceId) ??
									(await database.pluginResources.get(record.resourceId)))
								: undefined;
							if (!existing || resourceFields.some((field) => existing[field] !== record[field])) {
								const resource = {
									id: crypto.randomUUID(),
									pluginId: record.manifest.id,
									...Object.fromEntries(
										resourceFields
											.filter((field) => Object.hasOwn(record, field))
											.map((field) => [field, record[field]])
									)
								};
								await database.pluginResources.put(resource);
								assets.set(resource.id, resource);
								record.resourceId = resource.id;
							}
						}
						for (const field of resourceFields) delete record[field];
					}
					const retained = new Set(records(state).map((record) => record.resourceId!));
					const obsolete = [...previous].filter((key) => !retained.has(key));
					await database.pluginResources.bulkDelete(obsolete);
					for (const key of assets.keys()) if (!retained.has(key)) assets.delete(key);
					await database.pluginData.put({
						id,
						pluginId: OFFICIAL_PLUGINS_PLUGIN_ID,
						key: INSTALLED_STORAGE_KEY,
						valueJson: JSON.stringify(state),
						updatedAt: Date.now()
					});
					return hydrate(state, assets);
				}
			);
			cached.clear();
			for (const [key, value] of assets) cached.set(key, value);
			return result;
		}
	};
}

export interface AppDataResetPolicy {
	profileId: string;
	preinstallIds: readonly string[];
	hostVersion: string;
	hostBuildId: string;
}

export function assertInstallationResetAllowed(
	state: PluginInstallationState,
	policy: AppDataResetPolicy
): void {
	if (
		state.generation !== policy.hostBuildId ||
		(state.prepared && (state.prepared.until === null || state.prepared.until > Date.now()))
	) {
		throw new Error('Application update in progress; reload before clearing data');
	}
}

/** One transaction owns both installation preservation and deletion of user data. */
export async function clearUserDataKeepingPreinstalls(
	database: ChronosDB,
	policy: AppDataResetPolicy
): Promise<void> {
	const repository = createPluginInstallationRepository(database);
	await database.transaction(
		'rw',
		[
			database.timetables,
			database.courses,
			database.pluginData,
			database.pluginBinary,
			database.pluginResources,
			database.images
		],
		async () => {
			await repository.transaction((state) => {
				assertInstallationResetAllowed(state, policy);
				state.records = state.records.filter(
					(record) =>
						policy.preinstallIds.includes(record.manifest.id) &&
						record.origin.kind === 'profile' &&
						record.origin.profileId === policy.profileId &&
						record.manifest.version === policy.hostVersion
				);
				state.revision++;
				for (const record of state.records) record.revision = state.revision;
				state.removed = [];
				state.seeded = false;
				delete state.prepared;
			});
			const state = await repository.read();
			const retainedImages = new Set(
				state.records.flatMap((record) =>
					record.wallpaperAssetId ? [record.wallpaperAssetId] : []
				)
			);
			const installationId = `${OFFICIAL_PLUGINS_PLUGIN_ID}:${INSTALLED_STORAGE_KEY}`;
			await database.timetables.clear();
			await database.courses.clear();
			await database.pluginData.bulkDelete(
				(await database.pluginData.toCollection().primaryKeys()).filter(
					(id) => id !== installationId
				)
			);
			await database.pluginBinary.clear();
			await database.images.bulkDelete(
				(await database.images.toCollection().primaryKeys()).filter((id) => !retainedImages.has(id))
			);
		}
	);
}
