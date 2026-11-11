import { afterEach, describe, expect, it, vi } from 'vite-plus/test';
import { PREFERENCE_STORAGE_KEYS } from '@chronos/core';
import { TimetableRepository } from '#lib/storage/timetable-repository.ts';
import { createTimetable } from '@chronos/core';
import { DexieStorageProvider } from './dexie-storage';

afterEach(() => vi.unstubAllGlobals());

describe('cross-tab storage changes', () => {
	it('routes active timetable changes to timetable synchronization', () => {
		const window = new EventTarget();
		vi.stubGlobal('window', window);
		const storage = new DexieStorageProvider(undefined, null, null);
		const changed = vi.fn();
		storage.onChanged(changed);
		try {
			for (const newValue of ['other-timetable', null]) {
				window.dispatchEvent(
					Object.assign(new Event('storage'), {
						key: 'chronos:/:' + PREFERENCE_STORAGE_KEYS.currentTimetableId,
						newValue
					})
				);
				expect(changed).toHaveBeenLastCalledWith({
					type: 'timetable',
					key: PREFERENCE_STORAGE_KEYS.currentTimetableId
				});
			}
			window.dispatchEvent(
				Object.assign(new Event('storage'), {
					key: 'chronos:/:' + PREFERENCE_STORAGE_KEYS.themeMode
				})
			);
			expect(changed).toHaveBeenLastCalledWith({
				type: 'preferences',
				key: PREFERENCE_STORAGE_KEYS.themeMode
			});
			changed.mockClear();
			window.dispatchEvent(
				Object.assign(new Event('storage'), {
					key: 'chronos:/Other:' + PREFERENCE_STORAGE_KEYS.themeMode
				})
			);
			expect(changed).not.toHaveBeenCalled();
		} finally {
			storage.dispose();
		}
	});
});

it('broadcasts committed data changes without changing the active id, and closes the channel', async () => {
	const channels: Channel[] = [];
	class Channel {
		onmessage: ((event: { data: unknown }) => void) | null = null;
		close = vi.fn();
		constructor(public name: string) {
			channels.push(this);
		}
		postMessage(data: unknown) {
			for (const other of channels) if (other !== this) other.onmessage?.({ data });
		}
	}
	vi.stubGlobal('window', new EventTarget());
	vi.stubGlobal('BroadcastChannel', Channel);
	vi.spyOn(TimetableRepository.prototype, 'saveTimetable').mockResolvedValue();
	vi.spyOn(TimetableRepository.prototype, 'deleteTimetable')
		.mockResolvedValueOnce()
		.mockRejectedValueOnce(new Error('failed'));
	const first = new DexieStorageProvider(undefined, null, null);
	const second = new DexieStorageProvider(undefined, null, null);
	const changed = vi.fn();
	second.onChanged(changed);
	try {
		await first.saveTimetable(createTimetable({ id: 'inactive', name: 'Inactive' }));
		expect(changed).toHaveBeenLastCalledWith({ type: 'timetable', key: 'inactive' });
		await first.deleteTimetable('inactive');
		expect(changed).toHaveBeenCalledTimes(2);
		await expect(first.deleteTimetable('inactive')).rejects.toThrow('failed');
		expect(changed).toHaveBeenCalledTimes(2);
	} finally {
		first.dispose();
		second.dispose();
		vi.restoreAllMocks();
	}
	expect(channels).toHaveLength(2);
	expect(channels.every((channel) => channel.close.mock.calls.length === 1)).toBe(true);
});

it('requests persistence only after a successful timetable save', async () => {
	const request = vi.fn(async () => {});
	const save = vi
		.spyOn(TimetableRepository.prototype, 'saveTimetable')
		.mockRejectedValueOnce(new Error('save failed'))
		.mockResolvedValueOnce();
	const storage = new DexieStorageProvider(undefined, null, null, undefined, request);
	const timetable = createTimetable({ id: 'persistent', name: 'Persistent' });
	const warn = vi.spyOn(console, 'warn').mockImplementation(() => {});
	try {
		await expect(storage.saveTimetable(timetable)).rejects.toThrow('save failed');
		expect(request).not.toHaveBeenCalled();
		await storage.saveTimetable(timetable);
		expect(request).toHaveBeenCalledOnce();
	} finally {
		storage.dispose();
		save.mockRestore();
		warn.mockRestore();
	}
});

it('publishes and requests persistence only after an atomic mutation commits', async () => {
	const committed = Promise.withResolvers<import('@chronos/core').Timetable>();
	const mutate = vi
		.spyOn(TimetableRepository.prototype, 'mutateTimetable')
		.mockReturnValueOnce(committed.promise)
		.mockRejectedValueOnce(new Error('transaction failed'));
	const request = vi.fn(async () => {});
	const storage = new DexieStorageProvider(undefined, null, null, undefined, request);
	const changed = vi.fn();
	storage.onChanged(changed);
	const timetable = createTimetable({ id: 'atomic', name: 'Committed' });
	try {
		const pending = storage.mutateTimetable(timetable.id, (current) => current);
		expect(changed).not.toHaveBeenCalled();
		expect(request).not.toHaveBeenCalled();
		committed.resolve(timetable);
		await expect(pending).resolves.toBe(timetable);
		expect(changed).toHaveBeenCalledWith({ type: 'timetable', key: timetable.id });
		expect(request).toHaveBeenCalledOnce();
		await expect(storage.mutateTimetable(timetable.id, (current) => current)).rejects.toThrow(
			'transaction failed'
		);
		expect(changed).toHaveBeenCalledOnce();
		expect(request).toHaveBeenCalledOnce();
	} finally {
		storage.dispose();
		mutate.mockRestore();
	}
});

it('isolates asynchronous change listeners without rejecting a committed write', async () => {
	const save = vi.spyOn(TimetableRepository.prototype, 'saveTimetable').mockResolvedValue();
	const log = vi.spyOn(console, 'error').mockImplementation(() => {});
	const storage = new DexieStorageProvider(undefined, null, null);
	const failure = new Error('Async sync failed');
	const next = vi.fn();
	storage.onChanged(() => Promise.reject(failure));
	storage.onChanged(next);
	try {
		await expect(
			storage.saveTimetable(createTimetable({ id: 'committed', name: 'Committed' }))
		).resolves.toBeUndefined();
		await Promise.resolve();
		expect(next).toHaveBeenCalledWith({ type: 'timetable', key: 'committed' });
		expect(log).toHaveBeenCalledWith(
			'[DexieStorageProvider] Error in onChanged listener:',
			failure
		);
	} finally {
		storage.dispose();
		save.mockRestore();
		log.mockRestore();
	}
});
