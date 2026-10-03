import { describe, expect, it, vi } from 'vite-plus/test';
import { ChronosEngine, PREPARE_REMINDER_MINUTES_OPTIONS } from '../src/index';
import { createMockEnv } from '../src/test-utils';

describe('public preparation preferences', () => {
	it('reads, persists and publishes each allowed value through plugin APIs', async () => {
		const { env } = createMockEnv();
		const engine = new ChronosEngine({ env });
		await engine.init();
		await engine.loadPlugin({ id: 'reader', name: 'Reader', version: '1', apply() {} });
		const ctx = engine.getPluginContext('reader');
		const changed = vi.fn();
		ctx.on('preferences:updated', changed);
		expect(ctx.state.userPreferences.prepareReminderMinutes).toBe(30);
		for (const minutes of PREPARE_REMINDER_MINUTES_OPTIONS) {
			await ctx.actions.updatePreferences({ prepareReminderMinutes: minutes });
			expect(ctx.state.userPreferences.prepareReminderMinutes).toBe(minutes);
			expect((await env.storage.getPreferences()).prepareReminderMinutes).toBe(minutes);
			expect(changed).toHaveBeenLastCalledWith({
				preferences: expect.objectContaining({ prepareReminderMinutes: minutes, schemaVersion: 1 })
			});
		}
		engine.dispose();
	});
	it.each([0, -5, 6, 65, 10.5, NaN, Infinity, '15', null, undefined])(
		'rejects %s without changing state, storage or events',
		async (minutes) => {
			const { env } = createMockEnv();
			const engine = new ChronosEngine({ env });
			await engine.init();
			await engine.updatePreferences({ prepareReminderMinutes: 15 });
			const before = engine.state.userPreferences;
			const changed = vi.fn();
			engine.on('preferences:updated', changed);
			const save = vi.spyOn(env.storage, 'savePreferences');
			await expect(
				engine.updatePreferences({ prepareReminderMinutes: minutes as number, themeMode: 'dark' })
			).rejects.toThrow(RangeError);
			expect(engine.state.userPreferences).toBe(before);
			expect((await env.storage.getPreferences()).prepareReminderMinutes).toBe(15);
			expect(save).not.toHaveBeenCalled();
			expect(changed).not.toHaveBeenCalled();
			engine.dispose();
		}
	);
});
