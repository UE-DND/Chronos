import { describe, expect, it, beforeEach, vi } from 'vite-plus/test';
import { ImportMode } from '#lib/domain/import-mode.ts';
import { createTransferState, shareImportErrorSnackbarKey } from './transfer-state.svelte';
import { ImportSlotError } from '@chronos/core';
import { ImportSlotError as PluginImportSlotError } from '../../../../../packages/core/tests/fixtures/plugin-import-slot-error';

vi.mock('#lib/i18n/host-i18n.svelte.ts', () => ({
	hostT: (key: string) => key
}));

const finalizePreview = vi.fn(async (preview: { name: string }) => ({
	...preview,
	name: 'Finalized'
}));

vi.mock('#lib/services/app-engine.ts', () => ({
	getAppController: () => ({
		getSlots: (slot: string) =>
			slot === 'import.source.tab'
				? [...slotImportHandlers.entries()].map(([id, executeImport]) => ({
						id,
						executeImport
					}))
				: [],
		getSlotItem: (_slot: string, id: string) =>
			id === 'finalize-slot'
				? {
						validateConfirmInputs: () => null,
						finalizePreview
					}
				: undefined,
		getPluginContextForSlot: () => undefined
	})
}));

const slotImportHandlers = new Map<string, (inputs: Record<string, unknown>) => Promise<unknown>>();

describe('createTransferState', () => {
	let mockStorage: Record<string, string> = {};

	beforeEach(() => {
		vi.restoreAllMocks();
		mockStorage = {};
		slotImportHandlers.clear();
		vi.stubGlobal('sessionStorage', {
			getItem: (key: string) => mockStorage[key] ?? null,
			setItem: (key: string, value: string) => {
				mockStorage[key] = value;
			},
			removeItem: (key: string) => {
				delete mockStorage[key];
			}
		});
	});
	it('uses the same known-error result and message for interactive and persisted previews', async () => {
		const error = new ImportSlotError('network', 'Offline import source');
		slotImportHandlers.set('broken', async () => {
			throw error;
		});
		const controller = createTransferState();
		expect(await controller.previewWithSlot('broken', {})).toBe(false);
		expect(controller.state.errorMessage).toBe(error.message);
		expect(await controller.previewAndPersist('broken', {})).toEqual({
			ok: false,
			kind: 'network'
		});
		expect(controller.state.errorMessage).toBe(error.message);
	});
	it('recognizes a known import error from an independent plugin bundle constructor', async () => {
		const error = new PluginImportSlotError('no-data', 'No valid timetable share link');
		const report = vi.spyOn(console, 'error').mockImplementation(() => {});
		expect(error).not.toBeInstanceOf(ImportSlotError);
		slotImportHandlers.set('bundled-plugin', async () => {
			throw error;
		});
		const controller = createTransferState();
		expect(await controller.previewWithSlot('bundled-plugin', {})).toBe(false);
		expect(controller.state.errorMessage).toBe(error.message);
		expect(await controller.previewAndPersist('bundled-plugin', {})).toEqual({
			ok: false,
			kind: 'no-data'
		});
		expect(controller.state.error).toBe(error);
		expect(report).not.toHaveBeenCalled();
	});
	it.each([
		Object.assign(new Error('Unexpected failure'), { kind: 'network' }),
		{ kind: 'network' }
	])('keeps non-contract plugin errors unexpected: %s', async (error) => {
		const report = vi.spyOn(console, 'error').mockImplementation(() => {});
		slotImportHandlers.set('unexpected-plugin', async () => {
			throw error;
		});
		const controller = createTransferState();
		expect(await controller.previewAndPersist('unexpected-plugin', {})).toEqual({
			ok: false,
			kind: 'unknown'
		});
		expect(controller.state.errorMessage).toBe('transfer.error.fetchFailed');
		expect(controller.state.error).toBe(error);
		expect(report).toHaveBeenCalledWith('[transfer] preview failed', error);
	});
	it('preserves and reports an unexpected preview exception instead of showing its internal message', async () => {
		const error = new TypeError('Unexpected parser bug', { cause: new Error('Original cause') });
		const report = vi.spyOn(console, 'error').mockImplementation(() => {});
		slotImportHandlers.set('broken', async () => {
			throw error;
		});
		const controller = createTransferState();
		expect(await controller.previewAndPersist('broken', {})).toEqual({
			ok: false,
			kind: 'unknown'
		});
		expect(controller.state.errorMessage).toBe('transfer.error.fetchFailed');
		expect(controller.state.error).toBe(error);
		expect(report).toHaveBeenCalledWith('[transfer] preview failed', error);
	});
	it('returns the preview failure contract when session persistence fails and leaves no new preview accepted', async () => {
		const error = new Error('Storage quota exceeded');
		vi.spyOn(console, 'error').mockImplementation(() => {});
		vi.spyOn(sessionStorage, 'setItem').mockImplementation(() => {
			throw error;
		});
		slotImportHandlers.set('valid', async () => ({ name: 'Preview', courses: [{ id: 'c1' }] }));
		const controller = createTransferState();
		expect(await controller.previewAndPersist('valid', {})).toEqual({ ok: false, kind: 'unknown' });
		expect(controller.state.error).toBe(error);
		expect(controller.state.preview).toBeNull();
	});

	it('clears preview from memory and sessionStorage when clearPreview is called', () => {
		const controller = createTransferState();

		mockStorage['chronos:/:chronos:import-preview'] = JSON.stringify({ name: 'Test' });
		mockStorage['chronos:/:chronos:import-preview-slot'] = 'share-link';

		controller.loadPersistedPreview();
		expect(controller.state.preview).toEqual({ name: 'Test' });
		expect(controller.state.previewSlotId).toBe('share-link');

		controller.clearPreview();
		expect(controller.state.preview).toBeNull();
		expect(mockStorage['chronos:/:chronos:import-preview']).toBeUndefined();
	});

	it('clears sessionStorage when clearPersistedPreview is called', () => {
		const controller = createTransferState();

		mockStorage['chronos:/:chronos:import-preview'] = JSON.stringify({ name: 'Test' });
		mockStorage['chronos:/:chronos:import-preview-slot'] = 'share-link';

		controller.clearPersistedPreview();
		expect(mockStorage['chronos:/:chronos:import-preview']).toBeUndefined();
		expect(mockStorage['chronos:/:chronos:import-preview-slot']).toBeUndefined();
	});

	it('skips confirmInputs update when values are unchanged', () => {
		const controller = createTransferState();
		controller.setConfirmInputs({ campusId: 'huaxi', termStartDate: '' });
		const snapshot = controller.state.confirmInputs;
		controller.setConfirmInputs({ campusId: 'huaxi' });
		expect(controller.state.confirmInputs).toBe(snapshot);
	});

	describe('shareImportErrorSnackbarKey', () => {
		it('maps failure kinds to distinct messages', () => {
			expect(shareImportErrorSnackbarKey('no-data')).toBe('share.error.noData');
			expect(shareImportErrorSnackbarKey('invalid-data')).toBe('share.error.invalidData');
			expect(shareImportErrorSnackbarKey('network')).toBe('share.error.network');
		});
	});

	it('persists and restores confirmInputs with preview snapshot', async () => {
		const controller = createTransferState();
		const sampleTimetable = {
			id: 'preview-1',
			name: 'Test Schedule',
			courses: [{ id: 'c1' }],
			academicConfig: { termStartDate: '', startWeek: 1, endWeek: 20, periodTimes: [] }
		} as never;

		slotImportHandlers.set('edu-html', async () => sampleTimetable);
		expect(await controller.previewWithSlot('edu-html', {})).toBe(true);
		controller.setConfirmInputs({ campusId: 'huaxi', termStartDate: '2026-02-23' });
		controller.persistPreview();
		const next = createTransferState();
		expect(next.loadPersistedPreview()).toBe(true);
		expect(next.state.confirmInputs).toEqual({
			campusId: 'huaxi',
			termStartDate: '2026-02-23'
		});
	});

	it('persists the selected import mode and restores it after reload', async () => {
		const importTimetable = vi.fn().mockResolvedValue(undefined);
		const mockEngine = {
			importTimetable,
			state: { currentTimetable: { id: 'current' } },
			services: { get: () => null }
		} as unknown as Parameters<typeof createTransferState>[0];
		const sampleTimetable = {
			id: 'preview-1',
			name: 'Test Schedule',
			courses: [{ id: 'c1' }],
			academicConfig: { termStartDate: '', startWeek: 1, endWeek: 20, periodTimes: [] }
		} as never;

		slotImportHandlers.set('share-link', async () => sampleTimetable);
		const controller = createTransferState(mockEngine);
		expect(await controller.previewWithSlot('share-link', {})).toBe(true);
		expect(controller.setImportMode(ImportMode.OVERWRITE_CURRENT)).toBe(true);

		const restored = createTransferState(mockEngine);
		expect(restored.loadPersistedPreview()).toBe(true);
		expect(restored.state.importMode).toBe(ImportMode.OVERWRITE_CURRENT);
		expect(await restored.confirmImport()).toBe(true);
		expect(importTimetable).toHaveBeenCalledWith(sampleTimetable, { overwriteActive: true });
	});

	it('calls finalizePreview before importing through engine', async () => {
		finalizePreview.mockClear();
		const importTimetable = vi.fn().mockResolvedValue(undefined);
		const mockEngine = {
			importTimetable,
			state: { currentTimetable: null },
			services: { get: () => null }
		} as unknown as Parameters<typeof createTransferState>[0];

		const controller = createTransferState(mockEngine);
		const sampleTimetable = {
			id: 'preview-1',
			name: 'Test Schedule',
			courses: [{ id: 'c1' }],
			academicConfig: { termStartDate: '', startWeek: 1, endWeek: 20, periodTimes: [] }
		} as never;

		slotImportHandlers.set('finalize-slot', async () => sampleTimetable);
		expect(await controller.previewWithSlot('finalize-slot', {})).toBe(true);
		controller.setConfirmInputs({ termStartDate: '2026-02-23' });

		const success = await controller.confirmImport();
		expect(success).toBe(true);
		expect(finalizePreview).toHaveBeenCalledTimes(1);
		expect(importTimetable).toHaveBeenCalledWith(
			expect.objectContaining({ name: 'Finalized' }),
			expect.any(Object)
		);
	});

	it('requires another confirmation if the target changes during finalization', async () => {
		const importTimetable = vi.fn();
		const mockEngine = { importTimetable, state: { currentTimetable: { id: 'a' } } };
		let finish!: (preview: { name: string }) => void;
		finalizePreview.mockImplementationOnce(
			() =>
				new Promise((resolve) => {
					finish = resolve;
				})
		);
		slotImportHandlers.set('finalize-slot', async () => ({
			name: 'Imported',
			courses: [{ id: 'c' }]
		}));
		const controller = createTransferState(mockEngine as never);
		await controller.previewWithSlot('finalize-slot', {});
		controller.setImportMode(ImportMode.OVERWRITE_CURRENT);
		const pending = controller.confirmImport();
		mockEngine.state.currentTimetable = { id: 'b' };
		finish({ name: 'Finalized' });
		expect(await pending).toBe(false);
		expect(importTimetable).not.toHaveBeenCalled();
		expect(controller.state.errorMessage).toBe('transfer.confirm.targetChanged');
		expect(controller.state.preview).not.toBeNull();
	});

	it('persists preview and confirms import through engine', async () => {
		const importTimetable = vi.fn().mockResolvedValue(undefined);
		const mockEngine = {
			importTimetable,
			state: { currentTimetable: null },
			services: { get: () => null }
		} as unknown as Parameters<typeof createTransferState>[0];

		const controller = createTransferState(mockEngine);
		const sampleTimetable = {
			id: 'preview-1',
			name: 'Test Schedule',
			courses: [{ id: 'c1' }],
			academicConfig: { termStartDate: '2026-02-23', startWeek: 1, endWeek: 20, periodTimes: [] },
			importMetadata: { source: 'share-link' }
		} as never;

		slotImportHandlers.set('share-link', async () => sampleTimetable);
		expect(await controller.previewWithSlot('share-link', {})).toBe(true);
		controller.persistPreview();

		expect(mockStorage['chronos:/:chronos:import-preview']).toBeDefined();
		expect(mockStorage['chronos:/:chronos:import-preview-slot']).toBe('share-link');

		const success = await controller.confirmImport();
		expect(success).toBe(true);
		expect(importTimetable).toHaveBeenCalledTimes(1);
		expect(controller.state.preview).toBeNull();
	});

	it('checkPrimaryExportWarning returns null when engine has no timetable', async () => {
		const mockEngine = {
			state: { currentTimetable: null }
		} as unknown as Parameters<typeof createTransferState>[0];

		const { checkPrimaryExportWarning } = await import('#lib/transfer/transfer-state.svelte.ts');
		const warning = await checkPrimaryExportWarning(mockEngine!);
		expect(warning).toBeNull();
	});

	it('rejects overwrite import mode when no current timetable exists', async () => {
		const importTimetable = vi.fn().mockResolvedValue(undefined);
		const mockEngine = {
			importTimetable,
			state: { currentTimetable: null },
			services: { get: () => null }
		} as unknown as Parameters<typeof createTransferState>[0];

		const controller = createTransferState(mockEngine);
		const sampleTimetable = {
			id: 'preview-1',
			name: 'Test Schedule',
			courses: [{ id: 'c1' }],
			academicConfig: { termStartDate: '2026-02-23', startWeek: 1, endWeek: 20, periodTimes: [] }
		} as never;

		slotImportHandlers.set('share-link', async () => sampleTimetable);
		expect(await controller.previewWithSlot('share-link', {})).toBe(true);
		expect(controller.setImportMode(ImportMode.OVERWRITE_CURRENT)).toBe(false);
		expect(controller.state.importMode).toBe(ImportMode.AS_NEW);

		const success = await controller.confirmImport();
		expect(success).toBe(true);
		expect(importTimetable).toHaveBeenCalledWith(sampleTimetable, { overwriteActive: false });
	});
});
