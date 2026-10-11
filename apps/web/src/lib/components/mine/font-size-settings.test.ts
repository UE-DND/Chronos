import { describe, expect, it, vi } from 'vite-plus/test';
import { createFontSizeSettings } from './font-size-settings.svelte';
import type { FontSizeScale } from '@chronos/core';

describe('font size settings', () => {
	it('discards queued writes when the latest choice returns to the in-flight scale', async () => {
		let finish!: () => void;
		const save = vi.fn(
			() =>
				new Promise<void>((resolve) => {
					finish = resolve;
				})
		);
		const settings = createFontSizeSettings({
			initial: 1,
			preview: vi.fn(),
			onError: vi.fn(),
			save
		});
		settings.preview(1.3);
		const saving = settings.commit();
		settings.preview(0.9);
		void settings.commit();
		settings.preview(1.3);
		void settings.commit();
		finish();
		await saving;
		expect(save).toHaveBeenCalledExactlyOnceWith(1.3);
		expect(settings.state.draft).toBe(1.3);
	});
	it('previews immediately and serializes the latest committed selection', async () => {
		const calls: FontSizeScale[] = [];
		let finish!: () => void;
		const preview = vi.fn();
		const settings = createFontSizeSettings({
			initial: 1,
			preview,
			onError: vi.fn(),
			save: async (scale) => {
				calls.push(scale);
				if (calls.length === 1)
					await new Promise<void>((resolve) => {
						finish = resolve;
					});
			}
		});
		settings.preview(1.15);
		const saving = settings.commit();
		settings.preview(1.3);
		void settings.commit();
		expect(preview).toHaveBeenLastCalledWith(1.3);
		expect(calls).toEqual([1.15]);
		finish();
		await saving;
		expect(calls).toEqual([1.15, 1.3]);
		expect(settings.state.draft).toBe(1.3);
	});
	it('restores the saved scale on failure and releases preview on teardown', async () => {
		const preview = vi.fn();
		const onError = vi.fn();
		const settings = createFontSizeSettings({
			initial: 1,
			preview,
			onError,
			save: async () => {
				throw new Error('storage');
			}
		});
		settings.preview(0.9);
		await settings.commit();
		expect(settings.state.draft).toBe(1);
		expect(onError).toHaveBeenCalledOnce();
		expect(preview).toHaveBeenLastCalledWith(null);
		settings.destroy();
		expect(preview).toHaveBeenLastCalledWith(null);
	});
});
