import { afterEach, describe, expect, it, vi } from 'vite-plus/test';
import { ChronosEngine, type ThemeContribution } from '@chronos/core';
import { createMockEnv } from '@chronos/core/test-utils';
import { coordinateAppearance } from './appearance-coordinator';

const resources: Array<{ dispose(): void }> = [];
afterEach(() => {
	for (const resource of resources.splice(0).reverse()) resource.dispose();
});

const flush = async () => {
	await Promise.resolve();
	await Promise.resolve();
};
function theme(id: string, supportsColors = true): ThemeContribution {
	return {
		id,
		name: id,
		workbenchColors: { light: {}, dark: {} },
		...(supportsColors ? { resolveWallpaperColors: () => ({ workbenchColors: {} }) } : {})
	};
}
async function fixture(enabled = true) {
	const { env } = createMockEnv();
	const engine = new ChronosEngine({ env });
	resources.push(engine);
	await engine.init();
	const registration = engine.themes.registerTheme(theme('default'), 'default-plugin');
	engine.configureDefaultTheme({ pluginId: 'default-plugin', themeId: 'default' });
	await engine.updatePreferences({
		visualThemeId: 'default',
		wallpaperSource: 'custom',
		wallpaperColorEnabled: enabled
	});
	const wallpaper = { select: vi.fn() };
	const apply = vi
		.fn<Parameters<typeof coordinateAppearance>[0]['apply']>()
		.mockResolvedValue(undefined);
	const updatePreferences = vi.fn((patch) => engine.updatePreferences(patch));
	const onPreferenceError = vi.fn();
	const coordinator = coordinateAppearance({
		engine,
		wallpaper,
		apply,
		updatePreferences,
		onPreferenceError
	});
	resources.push(coordinator);
	await flush();
	return {
		engine,
		registration,
		wallpaper,
		apply,
		updatePreferences,
		onPreferenceError,
		coordinator
	};
}

describe('appearance event pipeline', () => {
	it('selects the resolved theme wallpaper before rendering the matching appearance', async () => {
		const { engine, wallpaper, apply } = await fixture(false);
		expect(apply).toHaveBeenCalledOnce();
		const image = new Blob(['image']);
		engine.themes.registerTheme({ ...theme('other'), wallpaper: image });
		await flush();
		apply.mockClear();
		await engine.updatePreferences({ visualThemeId: 'other', wallpaperSource: 'theme' });
		await flush();
		expect(apply).toHaveBeenCalledOnce();
		expect(engine.state.activeThemeId).toBe('other');
		expect(wallpaper.select).toHaveBeenLastCalledWith('theme', image);
		expect(apply.mock.lastCall?.[0]).toMatchObject({
			activeThemeId: 'other',
			wallpaperColorEnabled: false
		});
		expect(wallpaper.select.mock.invocationCallOrder.at(-1)!).toBeLessThan(
			apply.mock.invocationCallOrder.at(-1)!
		);
	});

	it('preserves direct theme selection without resolving a saved preference again', async () => {
		const { engine, apply } = await fixture(false);
		engine.themes.registerTheme(theme('preview'));
		await flush();
		engine.setTheme('preview');
		await flush();
		expect(engine.state.userPreferences.visualThemeId).toBe('default');
		expect(engine.state.activeThemeId).toBe('preview');
		expect(apply.mock.lastCall?.[0].activeThemeId).toBe('preview');
	});

	it('waits through theme replacement before correcting wallpaper color preferences', async () => {
		const { engine, registration, updatePreferences } = await fixture();
		registration.dispose();
		await flush();
		expect(updatePreferences).not.toHaveBeenCalled();
		expect(engine.state.userPreferences.wallpaperColorEnabled).toBe(true);
		engine.themes.registerTheme(theme('default', false), 'default-plugin');
		await flush();
		expect(updatePreferences).toHaveBeenCalledWith({ wallpaperColorEnabled: false });
		expect(engine.state.userPreferences.wallpaperColorEnabled).toBe(false);
	});

	it('coalesces synchronous engine events into one appearance update', async () => {
		const { engine, apply } = await fixture();
		apply.mockClear();
		engine.events.emit('slots:updated', undefined);
		engine.events.emit('preferences:updated', { preferences: engine.state.userPreferences });
		engine.events.emit('theme:changed', { themeId: 'default' });
		await flush();
		expect(apply).toHaveBeenCalledOnce();
	});

	it('aborts superseded work and releases subscriptions and queued work on disposal', async () => {
		const { engine, apply, coordinator } = await fixture();
		const firstSignal = apply.mock.lastCall![1];
		coordinator.refresh();
		await flush();
		expect(firstSignal.aborted).toBe(true);
		const lastSignal = apply.mock.lastCall![1];
		expect(lastSignal.aborted).toBe(false);
		apply.mockClear();
		coordinator.refresh();
		coordinator.dispose();
		engine.events.emit('slots:updated', undefined);
		await flush();
		expect(lastSignal.aborted).toBe(true);
		expect(apply).not.toHaveBeenCalled();
	});
});
