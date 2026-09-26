import type { OfficialPluginRuntimeActivator } from './runtime-activator';
import type { OfficialPluginInstalledStore } from './installed-store';
import type { InstalledOfficialPluginRecord } from './official-plugin-types';

export interface PluginAssetReplacerDeps {
	installedStore: OfficialPluginInstalledStore;
	runtimeActivator: OfficialPluginRuntimeActivator;
	isDisposed: () => boolean;
	validate?: () => void;
}

export interface ReplacePluginAssetsOptions {
	preserveInstalledAt?: boolean;
	forceEnabled?: boolean;
	revertThemesOnDeactivate?: boolean;
	signal?: AbortSignal;
}

/**
 * Atomically swaps plugin runtime assets and persisted record.
 * Rollback order on failure: deactivate new runtime → re-activate previous snapshot.
 */
export async function replacePluginAssets(
	deps: PluginAssetReplacerDeps,
	candidate: InstalledOfficialPluginRecord,
	options?: ReplacePluginAssetsOptions
): Promise<InstalledOfficialPluginRecord> {
	const pluginId = candidate.manifest.id;
	const existing = deps.installedStore.find(pluginId);
	const hadActiveRuntime = Boolean(existing?.enabled && deps.runtimeActivator.isActive(pluginId));

	const record: InstalledOfficialPluginRecord = {
		...candidate,
		enabled: options?.forceEnabled || (existing?.enabled ?? candidate.enabled),
		installedAt:
			options?.preserveInstalledAt && existing
				? existing.installedAt
				: (candidate.installedAt ?? existing?.installedAt ?? Date.now()),
		manifestUrl: candidate.manifestUrl ?? existing?.manifestUrl
	};

	let runtimeTouched = false;
	const rollbackErrors: unknown[] = [];

	const rollbackRuntime = async (cause: unknown): Promise<InstalledOfficialPluginRecord> => {
		if (runtimeTouched) {
			try {
				await deps.runtimeActivator.deactivate(pluginId, {
					revertThemes: options?.revertThemesOnDeactivate ?? true
				});
				if (existing && hadActiveRuntime && !deps.isDisposed()) {
					await deps.runtimeActivator.activate(existing);
				}
			} catch (rollbackErr) {
				rollbackErrors.push(rollbackErr);
			}
		}

		if (rollbackErrors.length > 0) {
			throw new AggregateError(
				[cause, ...rollbackErrors],
				`Failed to replace plugin ${pluginId} and rollback previous runtime`
			);
		}
		throw cause;
	};

	try {
		options?.signal?.throwIfAborted?.();

		if (existing?.enabled) {
			await deps.runtimeActivator.deactivate(pluginId, {
				revertThemes: options?.revertThemesOnDeactivate ?? false
			});
			runtimeTouched = true;
		}

		options?.signal?.throwIfAborted?.();

		if (record.enabled) {
			runtimeTouched = true;
			await deps.runtimeActivator.activate(record);
		}

		options?.signal?.throwIfAborted?.();

		if (deps.isDisposed()) throw new DOMException('Aborted', 'AbortError');
		deps.validate?.();
		await deps.installedStore.upsert(record, existing?.revision ?? -1);
		runtimeTouched = false;
		return record;
	} catch (err: unknown) {
		return rollbackRuntime(err);
	}
}
