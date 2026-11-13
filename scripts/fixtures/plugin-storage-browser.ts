import { ChronosEngine, createTimetable, type HttpResponse } from '../../packages/core/src/index';
import { ChronosDB } from '../../apps/web/src/lib/storage/db';
import { DexieStorageProvider } from '../../apps/web/src/lib/providers/dexie-storage';
import { createPluginInstallationRepository } from '../../apps/web/src/lib/storage/plugin-installation-repository';
import { OfficialPluginInstalledStore } from '../../apps/web/src/lib/services/official-plugins/installed-store';
import {
	createHolidayPlugin,
	HOLIDAY_PLUGIN_ID
} from '../../packages/plugins/calendar-holidays/src/index';
import { syncHolidayCalendarFromHolidayCn } from '../../packages/plugins/calendar-holidays/src/holiday-sync';

export async function createStorageFixture() {
	const database = new ChronosDB('chronos-plugin-storage-qa');
	const storage = new DexieStorageProvider(database, null, null);
	const requests: { resolve(value: HttpResponse): void; signal?: AbortSignal }[] = [];
	const engine = new ChronosEngine({
		env: {
			platform: 'web',
			storage,
			runtime: { sha256: async () => 'fixture' },
			http: {
				request: (_url, options) =>
					new Promise<HttpResponse>((resolve) => {
						requests.push({ resolve, signal: options?.signal });
					})
			}
		}
	});
	const store = new OfficialPluginInstalledStore(
		engine,
		createPluginInstallationRepository(database)
	);
	await store.load();
	const record = {
		manifest: {
			id: HOLIDAY_PLUGIN_ID,
			name: { en: 'Holidays' },
			description: {},
			author: 'QA',
			version: '1',
			type: 'tool',
			toolGroup: 'utility',
			bundleFormat: 'esm'
		},
		origin: { kind: 'user' },
		installedAt: 1,
		code: 'fixture resource'
	} as const;
	if (!store.find(HOLIDAY_PLUGIN_ID)) await store.upsert(record);
	for (const id of ['one', 'two']) {
		if (!(await storage.getTimetable(id)))
			await storage.saveTimetable(
				createTimetable({
					id,
					name: id,
					academicConfig: { termStartDate: '2026-03-02', startWeek: 1, endWeek: 2, periodTimes: [] }
				})
			);
	}
	await engine.init();
	async function activate(fail = false) {
		await store.load();
		const plugin = createHolidayPlugin();
		await engine.loadPlugin(
			{
				...plugin,
				async apply(ctx) {
					await plugin.apply(ctx);
					if (fail) throw new Error('Candidate rejected');
				}
			},
			{ storageRevision: store.find(HOLIDAY_PLUGIN_ID)!.revision }
		);
	}
	await activate();
	const initial = engine.getPluginContext(HOLIDAY_PLUGIN_ID);
	return {
		async sync(id: string) {
			await engine.switchTimetable(id);
			try {
				await syncHolidayCalendarFromHolidayCn(engine.getPluginContext(HOLIDAY_PLUGIN_ID), {
					force: true
				});
				return 'success';
			} catch (error) {
				return error instanceof Error ? error.name : String(error);
			}
		},
		requests: () => requests.map((request) => ({ aborted: request.signal?.aborted })),
		respond(index: number, label: string) {
			requests[index]!.resolve({
				ok: true,
				status: 200,
				statusText: 'OK',
				headers: {},
				text: async () => '',
				bytes: async () => new Uint8Array(),
				json: async <T>() =>
					({
						year: 2026,
						papers: [],
						days: [{ name: label, date: '2026-03-02', isOffDay: true }]
					}) as T
			});
		},
		async holidays(id: string) {
			return engine.resolveHolidays((await storage.getTimetable(id))!);
		},
		cache: () => storage.getPluginData(HOLIDAY_PLUGIN_ID, 'calendars'),
		async upgrade(fail = false) {
			await engine.unloadPlugin(HOLIDAY_PLUGIN_ID);
			if (!fail) await store.upsert(record);
			try {
				await activate(fail);
			} catch {
				await activate();
			}
		},
		async uninstall(fail = false) {
			await engine.unloadPlugin(HOLIDAY_PLUGIN_ID);
			await store.load();
			const deleting = () => {
				throw new Error('Forced transactional delete failure');
			};
			if (fail) database.pluginBinary.hook('deleting', deleting);
			try {
				await store.remove(HOLIDAY_PLUGIN_ID, store.find(HOLIDAY_PLUGIN_ID)?.revision);
				return 'removed';
			} catch {
				await activate();
				return 'restored';
			} finally {
				database.pluginBinary.hook('deleting').unsubscribe(deleting);
			}
		},
		async reinstall() {
			await store.load();
			await store.upsert(record);
			await activate();
		},
		async writeBinary() {
			await engine
				.getPluginContext(HOLIDAY_PLUGIN_ID)
				.storage.set('bytes', new Uint8Array([1, 2, 3]));
		},
		async oldWrite() {
			try {
				await initial.storage.set('late', { stale: true });
				return 'written';
			} catch {
				return 'rejected';
			}
		},
		async data() {
			await store.load();
			return {
				installed: store.has(HOLIDAY_PLUGIN_ID),
				resources: await database.pluginResources
					.where('pluginId')
					.equals(HOLIDAY_PLUGIN_ID)
					.count(),
				binary: await database.pluginBinary.where('pluginId').equals(HOLIDAY_PLUGIN_ID).count(),
				late: await storage.getPluginData(HOLIDAY_PLUGIN_ID, 'late')
			};
		},
		close() {
			engine.dispose();
			store.dispose();
			storage.dispose();
			database.close();
		}
	};
}
