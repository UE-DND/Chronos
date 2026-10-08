import { afterEach, describe, expect, it, vi } from 'vite-plus/test';
import { PREFERENCE_STORAGE_KEYS } from '@chronos/core';
import { TimetableRepository } from '$lib/storage/timetable-repository';
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
						key: PREFERENCE_STORAGE_KEYS.currentTimetableId,
						newValue
					})
				);
				expect(changed).toHaveBeenLastCalledWith({
					type: 'timetable',
					key: PREFERENCE_STORAGE_KEYS.currentTimetableId
				});
			}
			window.dispatchEvent(
				Object.assign(new Event('storage'), { key: PREFERENCE_STORAGE_KEYS.themeMode })
			);
			expect(changed).toHaveBeenLastCalledWith({
				type: 'preferences',
				key: PREFERENCE_STORAGE_KEYS.themeMode
			});
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
