import { describe, expect, it, vi } from 'vite-plus/test';
import type { ChronosDB } from './db';
import { createPluginInstallationRepository } from './plugin-installation-repository';
import { emptyInstallationState } from '#lib/services/official-plugins/installed-store.ts';
import type { InstalledOfficialPluginRecord } from '#lib/services/official-plugins/official-plugin-types.ts';

function fixture() {
	const metadata = new Map<string, { valueJson: string }>();
	const resources = new Map<string, Record<string, unknown>>();
	const database = {
		pluginData: {
			get: async (id: string) => metadata.get(id),
			put: async (row: { id: string; valueJson: string }) => metadata.set(row.id, row)
		},
		pluginResources: {
			get: vi.fn(async (id: string) => resources.get(id)),
			bulkGet: vi.fn(async (ids: string[]) => ids.map((id) => resources.get(id))),
			put: vi.fn(async (row: { id: string }) => resources.set(row.id, row)),
			bulkDelete: vi.fn(async (ids: string[]) => {
				for (const id of ids) resources.delete(id);
			})
		},
		transaction: async (_mode: string, _tables: unknown, action: () => Promise<unknown>) => action()
	};
	const repository = createPluginInstallationRepository(database as unknown as ChronosDB);
	return { repository, database, metadata, resources };
}
const record = (code: string): InstalledOfficialPluginRecord => ({
	manifest: { id: 'plugin', version: '1' } as never,
	origin: { kind: 'user' },
	installedAt: 1,
	code,
	cssCode: 'css'
});

describe('plugin installation resources', () => {
	it('keeps resource bodies out of metadata and reuses them for metadata mutations', async () => {
		const { repository, database, metadata, resources } = fixture();
		await repository.transaction((state) => {
			state.records = [record('current')];
		});
		const saved = JSON.parse([...metadata.values()][0]!.valueJson);
		expect(saved.records[0].code).toBeUndefined();
		expect(saved.records[0].resourceId).toEqual(expect.any(String));
		expect(resources.size).toBe(1);
		expect((await repository.read()).records[0]!.code).toBe('current');
		database.pluginResources.put.mockClear();
		database.pluginResources.bulkGet.mockClear();
		await repository.transaction((state) => {
			state.seeded = true;
		});
		expect(database.pluginResources.put).not.toHaveBeenCalled();
		expect(database.pluginResources.bulkGet).not.toHaveBeenCalled();
	});
	it.each(['adopt', 'cancel'])(
		'retains current and prepared resources during %s and collects only unreferenced resources',
		async (action) => {
			const { repository, resources } = fixture();
			await repository.transaction((state) => {
				state.records = [record('current')];
				state.prepared = {
					target: { buildId: 'next' } as never,
					revision: 0,
					token: 'token',
					until: 100,
					records: [record('future')]
				};
			});
			expect(resources.size).toBe(2);
			expect((await repository.read()).prepared!.records[0]!.code).toBe('future');
			await repository.transaction((state) => {
				if (action === 'adopt') state.records = state.prepared!.records;
				delete state.prepared;
			});
			expect(resources.size).toBe(1);
			expect((await repository.read()).records[0]!.code).toBe(
				action === 'adopt' ? 'future' : 'current'
			);
			await repository.transaction((state) => {
				state.records = [];
			});
			expect(resources.size).toBe(0);
			expect(await repository.read()).toEqual(emptyInstallationState());
		}
	);
});

it('preserves untouched bodies and caller snapshots when replacing a resource', async () => {
	const { repository } = fixture();
	const input = record('before');
	await repository.transaction((state) => {
		state.records = [input];
	});
	expect(input.code).toBe('before');
	await repository.transaction((state) => {
		expect(state.records[0]!.code).toBe('before');
		state.records[0]!.code = 'after';
	});
	expect((await repository.read()).records[0]).toMatchObject({ code: 'after', cssCode: 'css' });
});

it('keeps installation metadata when a resource is missing so recovery can repair it', async () => {
	const { repository, resources } = fixture();
	await repository.transaction((state) => {
		state.records = [record('current')];
	});
	resources.clear();
	const state = await repository.read();
	expect(state.records[0]!.manifest.id).toBe('plugin');
	expect(state.records[0]!.code).toBeUndefined();
});
