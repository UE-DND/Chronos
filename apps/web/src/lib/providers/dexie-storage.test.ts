import { afterEach, describe, expect, it, vi } from 'vite-plus/test';
import { PREFERENCE_STORAGE_KEYS } from '@chronos/core';
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
