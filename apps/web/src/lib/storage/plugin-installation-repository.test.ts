import { describe, expect, it, vi } from 'vite-plus/test';
import type { ChronosDB } from './db';
import { createPluginInstallationRepository } from './plugin-installation-repository';
import { emptyInstallationState } from '#lib/services/official-plugins/installed-store.ts';
import type { InstalledOfficialPluginRecord } from '#lib/services/official-plugins/official-plugin-types.ts';

function fixture() {
	const metadata = new Map<string, { valueJson: string }>();
	const resources = new Map<string, Record<string, unknown>>();
	const images = new Map<string, { id: string; blob: Blob }>();
	const database = {
		pluginData: {
			get: async (id: string) => metadata.get(id),
			put: vi.fn(async (row: { id: string; valueJson: string }) => metadata.set(row.id, row))
		},
		pluginResources: {
			get: vi.fn(async (id: string) => resources.get(id)),
			bulkGet: vi.fn(async (ids: string[]) => ids.map((id) => resources.get(id))),
			put: vi.fn(async (row: { id: string }) => resources.set(row.id, row)),
			bulkDelete: vi.fn(async (ids: string[]) => {
				for (const id of ids) resources.delete(id);
			})
		},
		images: {
			put: vi.fn(async (row: { id: string; blob: Blob }) => images.set(row.id, row)),
			toCollection: () => ({ primaryKeys: async () => [...images.keys()] }),
			bulkDelete: vi.fn(async (ids: string[]) => {
				for (const id of ids) images.delete(id);
			})
		},
		transaction: vi.fn(async (_mode: string, _tables: unknown, action: () => Promise<unknown>) => {
			const before = [new Map(metadata), new Map(resources), new Map(images)];
			try {
				return await action();
			} catch (error) {
				for (const [index, target] of [metadata, resources, images].entries()) {
					target.clear();
					for (const [key, value] of before[index]!) target.set(key, value as never);
				}
				throw error;
			}
		})
	};
	const repository = createPluginInstallationRepository(database as unknown as ChronosDB);
	return { repository, database, metadata, resources, images };
}
const record = (code: string): InstalledOfficialPluginRecord => ({
	manifest: { id: 'plugin', version: '1' } as never,
	origin: { kind: 'user' },
	installedAt: 1,
	code,
	cssCode: 'css'
});

describe('plugin image transactions', () => {
	it('commits wallpaper bytes with metadata and retains current and prepared references', async () => {
		const { repository, database, images, metadata } = fixture();
		const wallpaper = new Blob(['current']);
		await repository.transaction((state) => {
			state.records = [
				{ ...record('current'), wallpaperAssetId: 'theme:current', wallpaperBlob: wallpaper }
			];
			state.prepared = {
				target: { buildId: 'next' } as never,
				revision: 0,
				token: 'token',
				until: 100,
				records: [
					{
						...record('future'),
						wallpaperAssetId: 'theme:future',
						wallpaperBlob: new Blob(['future'])
					}
				]
			};
		});
		expect(database.transaction).toHaveBeenCalledWith(
			'rw',
			expect.arrayContaining([database.images]),
			expect.any(Function)
		);
		expect(images.get('theme:current')?.blob).toBe(wallpaper);
		expect(images.has('theme:future')).toBe(true);
		expect([...metadata.values()][0]!.valueJson).not.toContain('wallpaperBlob');
		await repository.transaction((state) => {
			delete state.prepared;
		});
		expect([...images.keys()]).toEqual(['theme:current']);
	});

	it('rolls back wallpaper and executable bytes when metadata commit fails', async () => {
		const { repository, database, images, resources } = fixture();
		await repository.transaction((state) => {
			state.records = [record('before')];
		});
		database.pluginData.put.mockRejectedValueOnce(new Error('commit failed'));
		await expect(
			repository.transaction((state) => {
				state.records = [
					{ ...record('after'), wallpaperAssetId: 'theme:new', wallpaperBlob: new Blob(['new']) }
				];
			})
		).rejects.toThrow('commit failed');
		expect(images.size).toBe(0);
		expect(resources.size).toBe(1);
		expect((await repository.read()).records[0]?.code).toBe('before');
	});

	it('collects crash leftovers while preserving user images and another repository preparation', async () => {
		const { repository, database, images } = fixture();
		images.set('custom-wallpaper', { id: 'custom-wallpaper', blob: new Blob(['user']) });
		images.set('theme:orphan', { id: 'theme:orphan', blob: new Blob(['orphan']) });
		await repository.transaction((state) => {
			state.records = [
				{
					...record('current'),
					wallpaperAssetId: 'theme:current',
					wallpaperBlob: new Blob(['current'])
				}
			];
			state.prepared = {
				target: { buildId: 'next' } as never,
				revision: 0,
				token: 'token',
				until: 100,
				records: [
					{
						...record('future'),
						wallpaperAssetId: 'theme:future',
						wallpaperBlob: new Blob(['future'])
					}
				]
			};
		});
		const other = createPluginInstallationRepository(database as unknown as ChronosDB);
		await other.transaction((state) => {
			state.seeded = true;
		});
		expect([...images.keys()].sort()).toEqual([
			'custom-wallpaper',
			'theme:current',
			'theme:future'
		]);
	});
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

it('preserves absent, null and empty resource fields when replacing bodies', async () => {
	const { repository, resources, database } = fixture();
	const input = { ...record(''), colorsJson: null, iconThemeJson: undefined };
	await repository.transaction((state) => {
		state.records = [input];
	});
	const resource = [...resources.values()][0]!;
	expect(resource).toMatchObject({ code: '', colorsJson: null });
	expect(Object.hasOwn(resource, 'iconThemeJson')).toBe(true);
	expect(input).not.toHaveProperty('resourceId');

	database.pluginResources.put.mockClear();
	await repository.transaction((state) => {
		state.records[0]!.installedAt++;
	});
	expect(database.pluginResources.put).not.toHaveBeenCalled();

	await repository.transaction((state) => {
		delete state.records[0]!.colorsJson;
	});
	expect(resources.size).toBe(1);
	const replacement = [...resources.values()][0]!;
	expect(Object.hasOwn(replacement, 'colorsJson')).toBe(false);
	expect((await repository.read()).records[0]!.code).toBe('');
});
