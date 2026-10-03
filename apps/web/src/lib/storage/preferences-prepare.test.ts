import { describe, expect, it } from 'vite-plus/test';
import { PREFERENCE_STORAGE_KEYS, PREPARE_REMINDER_MINUTES_OPTIONS } from '@chronos/core';
import { PreferencesStore } from './preferences-store';

function harness() {
	const values = new Map<string, string>();
	const storage = {
		getItem: (key: string) => values.get(key) ?? null,
		setItem: (key: string, value: string) => values.set(key, value)
	} as unknown as Storage;
	return { values, storage, store: new PreferencesStore(storage) };
}

describe('preparation preferences', () => {
	it('uses the default without storage or a stored value', async () => {
		expect((await new PreferencesStore(null).getPreferences()).prepareReminderMinutes).toBe(30);
		expect((await harness().store.getPreferences()).prepareReminderMinutes).toBe(30);
	});
	it.each(PREPARE_REMINDER_MINUTES_OPTIONS)(
		'persists %s minutes across store instances',
		async (minutes) => {
			const { store, storage } = harness();
			await store.savePreferences({ prepareReminderMinutes: minutes });
			expect((await new PreferencesStore(storage).getPreferences()).prepareReminderMinutes).toBe(
				minutes
			);
		}
	);
	it.each(['', '0', '4', '6', '61', '10.5', 'NaN', 'Infinity', 'abc'])(
		'defaults invalid stored value %s without modifying storage',
		async (raw) => {
			const { values, store } = harness();
			values.set(PREFERENCE_STORAGE_KEYS.prepareReminderMinutes, raw);
			expect((await store.getPreferences()).prepareReminderMinutes).toBe(30);
			expect(values.get(PREFERENCE_STORAGE_KEYS.prepareReminderMinutes)).toBe(raw);
		}
	);
	it.each([0, -5, 6, 65, 5.5, NaN, Infinity, undefined])(
		'rejects invalid %s before saving any part of the patch',
		async (minutes) => {
			const { values, store } = harness();
			await store.savePreferences({ prepareReminderMinutes: 15 });
			await expect(
				store.savePreferences({ prepareReminderMinutes: minutes, themeMode: 'dark' })
			).rejects.toThrow(RangeError);
			expect((await store.getPreferences()).prepareReminderMinutes).toBe(15);
			expect(values.has(PREFERENCE_STORAGE_KEYS.themeMode)).toBe(false);
		}
	);
});
