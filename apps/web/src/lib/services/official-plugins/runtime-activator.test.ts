import { describe, expect, it, vi, beforeEach, afterEach } from 'vite-plus/test';
import { ChronosEngine } from '@chronos/core';
import type { ChronosEnv } from '@chronos/core';
import { DEFAULT_USER_PREFERENCES } from '@chronos/core';
import { OfficialPluginRuntimeActivator } from './runtime-activator';
import type { ImageRepository } from '#lib/storage/image-repository.ts';
import type { InstalledOfficialPluginRecord } from './official-plugin-types';

const SAMPLE_BUNDLE = `
export default {
  id: 'test-plugin',
  name: function () { return 'Test'; },
  version: '1.0.0',
  apply: function (ctx) {
    ctx.registerSlot('mine.item', {
      id: 'test-item',
      sectionId: 'app-support',
      title: function () { return 'Test'; },
      href: '/test',
      order: 1
    });
  }
};
`;

const THEME_COLORS_JSON = JSON.stringify({
	id: 'theme-test',
	name: 'Test',
	variants: {
		light: { colors: { 'editor.background': '#ffffff' } },
		dark: { colors: { 'editor.background': '#000000' } }
	}
});

function createMockEnv() {
	const env: ChronosEnv = {
		platform: 'node',
		http: { request: vi.fn() },
		storage: {
			getTimetable: async () => null,
			listTimetables: async () => [],
			saveTimetable: async () => {},
			deleteTimetable: async () => {},
			getActiveTimetableId: async () => null,
			setActiveTimetableId: async () => {},
			queryCourses: async () => [],
			getPreferences: async () => ({ ...DEFAULT_USER_PREFERENCES }),
			savePreferences: async () => {},
			getPluginData: async () => null,
			setPluginData: async () => {},
			deletePluginData: async () => {},
			onChanged: () => ({ dispose: () => {} })
		},
		vault: {
			isSupported: async () => false,
			storeSecret: vi.fn(),
			getSecret: vi.fn(),
			removeSecret: vi.fn()
		},
		runtime: {
			sha256: async () => 'hash'
		}
	};
	return env;
}

describe('OfficialPluginRuntimeActivator', () => {
	let engine: ChronosEngine;
	let activator: OfficialPluginRuntimeActivator;
	let installed = new Set<string>();

	beforeEach(async () => {
		installed = new Set();
		engine = new ChronosEngine({ env: createMockEnv(), onNotification: vi.fn() });
		await engine.init();
		activator = new OfficialPluginRuntimeActivator(engine, (id) =>
			installed.has(id)
				? { manifest: { id } as never, origin: { kind: 'user' }, installedAt: 1 }
				: undefined
		);
	});

	afterEach(() => {
		vi.unstubAllGlobals();
	});
	it.each(['digest', 'missing-url'])(
		'rejects an unverified cached bundle before loading plugin code (%s)',
		async (invalid) => {
			const load = vi.spyOn(engine, 'loadPlugin');
			await expect(
				activator.activate({
					manifest: {
						id: 'test-plugin',
						bundleUrl: invalid === 'missing-url' ? undefined : '/bundle.js',
						sha256: 'different-hash'
					} as never,
					code: SAMPLE_BUNDLE,
					origin: { kind: 'user' },
					installedAt: 1
				})
			).rejects.toThrow('Cached plugin integrity mismatch');
			expect(load).not.toHaveBeenCalled();
		}
	);

	it.each([false, true])(
		'ESM owns the theme and validates static resource consistency (mismatch=%s)',
		async (mismatch) => {
			const colors = {
				light: { 'color.primary': '#123456' },
				dark: { 'color.primary': '#abcdef' }
			};
			const record = {
				manifest: {
					id: 'hybrid',
					name: { en: 'Hybrid' },
					version: '1',
					description: { en: '' },
					author: 'test',
					type: 'theme' as const,
					bundleFormat: 'esm' as const,
					themeId: 'hybrid-theme',
					bundleUrl: '/hybrid.js',
					sha256: 'hash',
					colorsUrl: '/colors.json',
					colorsSha256: 'hash'
				},
				colorsJson: JSON.stringify({
					id: 'hybrid-theme',
					variants: { light: { colors: colors.light }, dark: { colors: colors.dark } }
				}),
				code: `export default { id: 'hybrid', apply(ctx) { ctx.registerSlot('theme.definition', { id: 'hybrid-theme', name: 'Hybrid', workbenchColors: ${JSON.stringify(mismatch ? { light: {}, dark: {} } : colors)}, resolveWallpaperColors() { return { workbenchColors: {} }; } }); } };`,
				origin: { kind: 'user' as const },
				installedAt: 1
			};
			if (mismatch) {
				await expect(activator.activate(record)).rejects.toThrow('same colors');
				expect(engine.themes.getTheme('hybrid-theme')).toBeUndefined();
			} else {
				await activator.activate(record);
				expect(engine.slots.resolveOwner('theme.definition', 'hybrid-theme')).toBe('hybrid');
				expect(engine.themes.getTheme('hybrid-theme')?.resolveWallpaperColors).toBeTypeOf(
					'function'
				);
				await activator.deactivate('hybrid');
				expect(engine.themes.getTheme('hybrid-theme')).toBeUndefined();
			}
		}
	);
	it('preserves cached wallpaper and ESM behavior until the hybrid theme is disabled', async () => {
		const wallpaper = new Blob(['cached wallpaper']);
		const hash = 'a'.repeat(64);
		const env = createMockEnv();
		env.runtime.sha256 = async () => hash;
		const hybridEngine = new ChronosEngine({ env });
		const images = { get: vi.fn().mockResolvedValue(wallpaper) } as unknown as ImageRepository;
		const hybridActivator = new OfficialPluginRuntimeActivator(
			hybridEngine,
			() => undefined,
			images
		);
		const colors = { light: { 'color.primary': '#123456' }, dark: { 'color.primary': '#abcdef' } };
		try {
			await hybridActivator.activate({
				manifest: {
					id: 'hybrid',
					bundleUrl: '/hybrid.js',
					sha256: hash,
					colorsUrl: '/colors.json',
					colorsSha256: hash
				} as never,
				colorsJson: JSON.stringify({
					id: 'hybrid-theme',
					wallpaper: { url: './wallpaper.jpg', sha256: hash },
					variants: { light: { colors: colors.light }, dark: { colors: colors.dark } }
				}),
				code: `export default { id: 'hybrid', apply(ctx) { ctx.registerSlot('theme.definition', { id: 'hybrid-theme', name: 'Hybrid', className: 'hybrid-class', workbenchColors: ${JSON.stringify(colors)}, resolveWallpaperColors() { return { workbenchColors: {} }; } }); } };`,
				wallpaperAssetId: 'cached-image',
				origin: { kind: 'user' },
				installedAt: 1
			});
			const theme = hybridEngine.themes.getTheme('hybrid-theme');
			expect(theme?.wallpaper).toBe(wallpaper);
			expect(theme?.className).toBe('hybrid-class');
			expect(theme?.resolveWallpaperColors).toBeTypeOf('function');
			expect(hybridEngine.slots.resolveOwner('theme.definition', 'hybrid-theme')).toBe('hybrid');
			await hybridActivator.deactivate('hybrid');
			expect(hybridEngine.themes.getTheme('hybrid-theme')).toBeUndefined();
		} finally {
			hybridActivator.disposeAll();
			hybridEngine.dispose();
		}
	});

	it('registers JSON-only theme', async () => {
		installed.add('theme-json');
		await activator.activate({
			manifest: {
				id: 'theme-json',
				name: { 'zh-CN': 'T' },
				version: '1',
				description: { 'zh-CN': 'T' },
				author: 'Chronos',
				type: 'theme',
				bundleFormat: 'esm',
				colorsUrl: '/c.json',
				colorsSha256: 'hash'
			},
			colorsJson: THEME_COLORS_JSON,
			origin: { kind: 'user' as const },
			installedAt: 1
		});

		expect(engine.themes.getTheme('theme-test')).toBeDefined();
	});

	it('rejects ESM bundle id mismatch', async () => {
		installed.add('wrong-id');
		await expect(
			activator.activate({
				manifest: {
					id: 'wrong-id',
					name: { 'zh-CN': 'T' },
					version: '1',
					description: { 'zh-CN': 'T' },
					author: 'Chronos',
					type: 'tool',
					bundleFormat: 'esm',
					bundleUrl: '/b.js',
					sha256: 'hash'
				},
				code: SAMPLE_BUNDLE,
				origin: { kind: 'user' as const },
				installedAt: 1
			})
		).rejects.toThrow(/id mismatch/);
	});

	it('leaves no CSS in DOM when activation fails', async () => {
		type FakeStyle = {
			attrs: Map<string, string>;
			textContent: string | null;
			removed: boolean;
			setAttribute: (key: string, value: string) => void;
			remove: () => void;
		};
		const styles: FakeStyle[] = [];
		vi.stubGlobal('document', {
			createElement: () => {
				const el: FakeStyle = {
					attrs: new Map(),
					textContent: null,
					removed: false,
					setAttribute(key: string, value: string) {
						el.attrs.set(key, value);
					},
					remove() {
						el.removed = true;
					}
				};
				styles.push(el);
				return el;
			},
			head: { appendChild: vi.fn() },
			querySelector: (selector: string) => {
				const match = /data-plugin-id="([^"]+)"/.exec(selector);
				return (
					styles.find((el) => !el.removed && el.attrs.get('data-plugin-id') === match?.[1]) ?? null
				);
			}
		});

		installed.add('wrong-id');
		await expect(
			activator.activate({
				manifest: {
					id: 'wrong-id',
					name: { 'zh-CN': 'T' },
					version: '1',
					description: { 'zh-CN': 'T' },
					author: 'Chronos',
					type: 'tool',
					bundleFormat: 'esm',
					bundleUrl: '/b.js',
					sha256: 'hash',
					cssUrl: '/style.css',
					cssSha256: 'hash'
				},
				code: SAMPLE_BUNDLE,
				cssCode: '.x{color:red}',
				origin: { kind: 'user' as const },
				installedAt: 1
			})
		).rejects.toThrow(/id mismatch/);

		expect(styles.filter((el) => !el.removed)).toHaveLength(0);
	});

	it('injects CSS before loading the bundle', async () => {
		type FakeStyle = {
			attrs: Map<string, string>;
			textContent: string | null;
			removed: boolean;
			setAttribute: (key: string, value: string) => void;
			remove: () => void;
		};
		const styles: FakeStyle[] = [];
		vi.stubGlobal('document', {
			createElement: () => {
				const el: FakeStyle = {
					attrs: new Map(),
					textContent: null,
					removed: false,
					setAttribute(key: string, value: string) {
						el.attrs.set(key, value);
					},
					remove() {
						el.removed = true;
					}
				};
				styles.push(el);
				return el;
			},
			head: { appendChild: vi.fn() },
			querySelector: (selector: string) => {
				const match = /data-plugin-id="([^"]+)"/.exec(selector);
				return (
					styles.find((el) => !el.removed && el.attrs.get('data-plugin-id') === match?.[1]) ?? null
				);
			}
		});

		const originalLoad = engine.loadPlugin.bind(engine);
		const loadSpy = vi.spyOn(engine, 'loadPlugin').mockImplementation(async (...args) => {
			const live = styles.find(
				(el) => !el.removed && el.attrs.get('data-plugin-id') === 'test-plugin'
			);
			expect(live).toBeDefined();
			expect(live?.textContent).toBe('.x{color:red}');
			return originalLoad(...args);
		});

		installed.add('test-plugin');
		await activator.activate({
			manifest: {
				id: 'test-plugin',
				name: { 'zh-CN': 'T' },
				version: '1',
				description: { 'zh-CN': 'T' },
				author: 'Chronos',
				type: 'tool',
				bundleFormat: 'esm',
				bundleUrl: '/b.js',
				sha256: 'hash',
				cssUrl: '/style.css',
				cssSha256: 'hash'
			},
			code: SAMPLE_BUNDLE,
			cssCode: '.x{color:red}',
			origin: { kind: 'user' as const },
			installedAt: 1
		});

		expect(loadSpy).toHaveBeenCalled();
		expect(styles.filter((el) => !el.removed)).toHaveLength(1);
	});

	it('deactivateAll waits for asynchronous engine disposal', async () => {
		const gate = Promise.withResolvers<void>();
		const entered = Promise.withResolvers<void>();
		vi.stubGlobal('__resetDispose', async () => {
			entered.resolve();
			await gate.promise;
		});
		const code = SAMPLE_BUNDLE.replace(
			'apply: function',
			'dispose: () => globalThis.__resetDispose(), apply: function'
		);
		await activator.activate({
			manifest: { id: 'test-plugin', bundleUrl: '/b.js', sha256: 'hash' } as never,
			code,
			origin: { kind: 'user' },
			installedAt: 1
		});
		let completed = false;
		const stopping = activator.deactivateAll().then(() => {
			completed = true;
		});
		await entered.promise;
		expect(completed).toBe(false);
		gate.resolve();
		await stopping;
		expect(activator.isActive('test-plugin')).toBe(false);
		expect(engine.isPluginLoaded('test-plugin')).toBe(false);
	});

	it('unload disposes engine plugin handle', async () => {
		installed.add('test-plugin');
		await activator.activate({
			manifest: {
				id: 'test-plugin',
				name: { 'zh-CN': 'T' },
				version: '1',
				description: { 'zh-CN': 'T' },
				author: 'Chronos',
				type: 'tool',
				bundleFormat: 'esm',
				bundleUrl: '/b.js',
				sha256: 'hash'
			},
			code: SAMPLE_BUNDLE,
			origin: { kind: 'user' as const },
			installedAt: 1
		});
		expect(engine.isPluginLoaded('test-plugin')).toBe(true);

		await activator.deactivate('test-plugin');
		expect(engine.isPluginLoaded('test-plugin')).toBe(false);
	});

	it('does not call revertToDefaultThemes when re-activating on boot', async () => {
		const revertSpy = vi.spyOn(engine, 'revertToDefaultThemes');
		installed.add('test-plugin');

		await activator.activate({
			manifest: {
				id: 'test-plugin',
				name: { 'zh-CN': 'T' },
				version: '1',
				description: { 'zh-CN': 'T' },
				author: 'Chronos',
				type: 'tool',
				bundleFormat: 'esm',
				bundleUrl: '/b.js',
				sha256: 'hash'
			},
			code: SAMPLE_BUNDLE,
			origin: { kind: 'user' as const },
			installedAt: 1
		});

		expect(revertSpy).not.toHaveBeenCalled();
	});

	it('disposes partially registered theme assets when icon theme registration fails', async () => {
		const registerThemeSpy = vi.spyOn(engine.themes, 'registerTheme');
		vi.spyOn(engine.iconThemes, 'registerIconTheme').mockImplementation(() => {
			throw new Error('icon theme failed');
		});

		installed.add('theme-json');
		await expect(
			activator.activate({
				manifest: {
					id: 'theme-json',
					name: { 'zh-CN': 'T' },
					version: '1',
					description: { 'zh-CN': 'T' },
					author: 'Chronos',
					type: 'theme',
					bundleFormat: 'esm',
					colorsUrl: '/c.json',
					colorsSha256: 'hash',
					iconThemeUrl: '/i.json',
					iconThemeSha256: 'hash'
				},
				colorsJson: THEME_COLORS_JSON,
				iconThemeJson: '{"id":"icon-test","icons":{}}',
				origin: { kind: 'user' as const },
				installedAt: 1
			})
		).rejects.toThrow(/icon theme failed/);

		expect(registerThemeSpy).toHaveBeenCalled();
		expect(activator.isActive('theme-json')).toBe(false);
	});

	it('preserves a pending third-party theme preference when uninstalling an unrelated tool', async () => {
		engine.themes.registerTheme(
			{ id: 'default-theme', name: 'Default', workbenchColors: { light: {}, dark: {} } },
			'default-plugin'
		);
		engine.configureDefaultTheme({ pluginId: 'default-plugin', themeId: 'default-theme' });
		installed.add('test-plugin');

		await activator.activate({
			manifest: {
				id: 'test-plugin',
				name: { 'zh-CN': 'T' },
				version: '1',
				description: { 'zh-CN': 'T' },
				author: 'Chronos',
				type: 'tool',
				bundleFormat: 'esm',
				bundleUrl: '/b.js',
				sha256: 'hash'
			},
			code: SAMPLE_BUNDLE,
			origin: { kind: 'user' as const },
			installedAt: 1
		});

		await engine.updatePreferences({
			visualThemeId: 'third-party-theme',
			wallpaperSource: 'theme',
			wallpaperColorEnabled: true
		});
		const preferences = { ...engine.state.userPreferences };
		expect(engine.themes.isSelectable('third-party-theme')).toBe(false);
		await activator.deactivate('test-plugin', { revertThemes: true });

		expect(engine.state.userPreferences).toEqual(preferences);
		expect(engine.state.activeThemeId).toBe('default-theme');
		expect(engine.isPluginLoaded('test-plugin')).toBe(false);
	});

	it.each([
		{ identity: 'manifest', failed: false },
		{ identity: 'manifest', failed: true },
		{ identity: 'colors', failed: false },
		{ identity: 'colors', failed: true }
	])(
		'reverts an unregistered selected theme using its $identity identity (failed=$failed)',
		async ({ identity, failed }) => {
			engine.themes.registerTheme(
				{ id: 'default-theme', name: 'Default', workbenchColors: { light: {}, dark: {} } },
				'default-plugin'
			);
			engine.configureDefaultTheme({ pluginId: 'default-plugin', themeId: 'default-theme' });
			const record: InstalledOfficialPluginRecord = {
				manifest: {
					id: 'theme-plugin',
					name: { en: 'Test' },
					version: '1',
					description: { en: 'Test' },
					author: 'Test',
					type: 'theme',
					bundleFormat: 'esm',
					themeId: identity === 'manifest' ? 'theme-test' : undefined,
					colorsUrl: '/colors.json',
					colorsSha256: failed ? 'invalid' : 'hash'
				},
				colorsJson: THEME_COLORS_JSON,
				origin: { kind: 'user' },
				installedAt: 1
			};
			activator = new OfficialPluginRuntimeActivator(engine, (id) =>
				id === record.manifest.id ? record : undefined
			);
			if (failed) await expect(activator.activate(record)).rejects.toThrow('integrity');
			await engine.updatePreferences({
				visualThemeId: 'theme-test',
				wallpaperSource: 'theme',
				wallpaperColorEnabled: true
			});
			expect(engine.slots.resolveOwner('theme.definition', 'theme-test')).toBeUndefined();

			await activator.deactivate('theme-plugin', { revertThemes: true });

			expect(engine.state.userPreferences).toMatchObject({
				visualThemeId: 'default-theme',
				wallpaperSource: 'none',
				wallpaperColorEnabled: false
			});
			expect(engine.state.activeThemeId).toBe('default-theme');
		}
	);

	it.each(['json', 'esm'])(
		'reverts to the default when uninstalling the selected %s theme owner',
		async (format) => {
			engine.themes.registerTheme(
				{ id: 'default-theme', name: 'Default', workbenchColors: { light: {}, dark: {} } },
				'default-plugin'
			);
			engine.configureDefaultTheme({ pluginId: 'default-plugin', themeId: 'default-theme' });
			installed.add('theme-plugin');
			await activator.activate({
				manifest: {
					id: 'theme-plugin',
					name: { en: 'Test' },
					version: '1',
					description: { en: 'Test' },
					author: 'Test',
					type: 'theme',
					bundleFormat: 'esm',
					...(format === 'json'
						? { colorsUrl: '/colors.json', colorsSha256: 'hash' }
						: { bundleUrl: '/theme.js', sha256: 'hash' })
				},
				...(format === 'json'
					? { colorsJson: THEME_COLORS_JSON }
					: {
							code: `export default { id: 'theme-plugin', apply(ctx) { ctx.registerSlot('theme.definition', { id: 'theme-test', name: 'Test', workbenchColors: { light: {}, dark: {} } }); } };`
						}),
				origin: { kind: 'user' },
				installedAt: 1
			});
			await engine.updatePreferences({
				visualThemeId: 'theme-test',
				wallpaperSource: 'theme',
				wallpaperColorEnabled: true
			});
			engine.setTheme('theme-test');

			await activator.deactivate('theme-plugin', { revertThemes: true });

			expect(engine.state.userPreferences).toMatchObject({
				visualThemeId: 'default-theme',
				wallpaperSource: 'none',
				wallpaperColorEnabled: false
			});
			expect(engine.state.activeThemeId).toBe('default-theme');
			expect(engine.themes.getTheme('theme-test')).toBeUndefined();
			expect(activator.isActive('theme-plugin')).toBe(false);
		}
	);
});
