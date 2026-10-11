import { describe, expect, it } from 'vite-plus/test';
import { PreferencesStore } from './preferences-store';
import { PREFERENCE_STORAGE_KEYS } from '@chronos/core';

function harness() {
	const values = new Map<string, string>();
	const storage = {
		getItem: (key: string) => values.get(key) ?? null,
		setItem: (key: string, value: string) => values.set(key, value)
	} as unknown as Storage;
	return { values, storage, store: new PreferencesStore(storage) };
}
describe('font preferences', () => {
	it.each([0.9, 1, 1.15, 1.3] as const)(
		'persists scale %s at schema version 1',
		async (fontSizeScale) => {
			const { store, storage } = harness();
			await store.savePreferences({ fontSizeScale });
			const preferences = await new PreferencesStore(storage).getPreferences();
			expect(preferences.fontSizeScale).toBe(fontSizeScale);
			expect(preferences.schemaVersion).toBe(1);
		}
	);
	it('defaults missing or corrupt values without rewriting storage', async () => {
		const { values, store } = harness();
		expect((await store.getPreferences()).fontSizeScale).toBe(1);
		values.set(PREFERENCE_STORAGE_KEYS.fontSizeScale, '9');
		expect((await store.getPreferences()).fontSizeScale).toBe(1);
		expect(values.get(PREFERENCE_STORAGE_KEYS.fontSizeScale)).toBe('9');
	});
	it('rejects an invalid scale before writing any other preference', async () => {
		const { values, store } = harness();
		await expect(
			store.savePreferences({ fontSizeScale: 2 as never, themeMode: 'dark' })
		).rejects.toThrow(RangeError);
		expect(values.size).toBe(0);
	});
});
