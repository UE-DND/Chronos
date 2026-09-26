import { ImageRepository } from '$lib/storage/image-repository';
import type { ChronosEngine, Disposable } from '@chronos/core';
import {
	createIconThemeFromJson,
	createThemeFromColorJson,
	parseColorThemeJson,
	parseIconThemeJson
} from '@chronos/core';
import { loadEsmPluginFromCode } from './plugin-bundle';
import { PluginCssInjector } from './plugin-css-injector';
import type { InstalledOfficialPluginRecord } from './official-plugin-types';

/**
 * Loads/unloads official plugin runtime in the engine.
 * Activation failures clean up partial state and rethrow for upper-layer rollback.
 */
export class OfficialPluginRuntimeActivator {
	private activeHandles = new Map<string, Disposable>();
	private readonly cssInjector = new PluginCssInjector();

	constructor(
		private readonly engine: ChronosEngine,
		private readonly isInstalled: (pluginId: string) => boolean,
		private readonly images = new ImageRepository()
	) {}

	isActive(pluginId: string): boolean {
		return this.activeHandles.has(pluginId);
	}

	async activate(record: InstalledOfficialPluginRecord): Promise<Disposable> {
		const manifest = record.manifest;
		for (const [url, expected, content] of [
			[manifest.bundleUrl, manifest.sha256, record.code],
			[manifest.colorsUrl, manifest.colorsSha256, record.colorsJson],
			[manifest.iconThemeUrl, manifest.iconThemeSha256, record.iconThemeJson],
			[manifest.cssUrl, manifest.cssSha256, record.cssCode]
		]) {
			if (!url && content == null) continue;
			if (
				!url ||
				!content ||
				!expected ||
				(await this.engine.runtime.sha256(content)).toLowerCase() !== expected.toLowerCase()
			)
				throw new Error('Cached plugin integrity mismatch');
		}
		const wallpaper = record.colorsJson
			? parseColorThemeJson(JSON.parse(record.colorsJson)).wallpaper
			: undefined;
		if (record.wallpaperAssetId || wallpaper) {
			const blob = record.wallpaperAssetId
				? await this.images.get(record.wallpaperAssetId)
				: undefined;
			if (
				!blob ||
				!wallpaper ||
				(
					await this.engine.runtime.sha256(new Uint8Array(await blob.arrayBuffer()))
				).toLowerCase() !== wallpaper.sha256.toLowerCase()
			)
				throw new Error('Cached wallpaper integrity mismatch');
		}
		await this.deactivate(manifest.id);

		if (record.cssCode) this.cssInjector.inject(manifest.id, record.cssCode);

		const disposables: Disposable[] = [];
		try {
			disposables.push(...(await this.activateThemeAssets(record)));
			disposables.push(...(await this.activateBundledPlugin(record)));
			if (record.code && record.colorsJson) {
				const snapshot = createThemeFromColorJson(
					parseColorThemeJson(JSON.parse(record.colorsJson))
				);
				const theme = this.engine.themes.getTheme(snapshot.id);
				if (
					!theme ||
					this.engine.slots.resolveOwner('theme.definition', snapshot.id) !== manifest.id ||
					(['light', 'dark'] as const).some(
						(mode) =>
							Object.entries(snapshot.workbenchColors[mode]).some(
								([key, value]) => theme.workbenchColors[mode][key] !== value
							) ||
							Object.keys(theme.workbenchColors[mode]).length !==
								Object.keys(snapshot.workbenchColors[mode]).length
					)
				) {
					throw new Error(
						'ESM theme must register the same colors and identity as its static resource'
					);
				}
			}

			const composite: Disposable = {
				dispose: () => {
					for (const d of disposables) d.dispose();
				}
			};
			this.activeHandles.set(manifest.id, composite);
			return composite;
		} catch (error) {
			for (const disposable of disposables) {
				disposable.dispose();
			}
			this.cssInjector.remove(manifest.id);
			throw error;
		}
	}

	private async activateThemeAssets(record: InstalledOfficialPluginRecord): Promise<Disposable[]> {
		const manifest = record.manifest;
		if (!record.colorsJson && !record.iconThemeJson) return [];

		// Parse all resources before registering either contribution, so invalid icons
		// cannot leave the new color theme registered during an update rollback.
		const colorTheme = record.colorsJson
			? createThemeFromColorJson(parseColorThemeJson(JSON.parse(record.colorsJson)))
			: undefined;
		const iconTheme = record.iconThemeJson
			? createIconThemeFromJson(parseIconThemeJson(JSON.parse(record.iconThemeJson)))
			: undefined;
		const disposables: Disposable[] = [];
		if (colorTheme && !record.code) {
			const wallpaper = record.wallpaperAssetId
				? await this.images.get(record.wallpaperAssetId)
				: undefined;
			if (record.wallpaperAssetId && !wallpaper) throw new Error('Missing cached theme wallpaper');
			disposables.push(
				this.engine.themes.registerTheme(
					{
						...colorTheme,
						...(wallpaper ? { wallpaper } : {})
					},
					manifest.id
				)
			);
		}
		if (iconTheme) {
			disposables.push(this.engine.iconThemes.registerIconTheme(iconTheme, manifest.id));
		}
		return disposables;
	}

	private async activateBundledPlugin(
		record: InstalledOfficialPluginRecord
	): Promise<Disposable[]> {
		if (!record.code) return [];
		const manifest = record.manifest;
		const plugin = await loadEsmPluginFromCode(record.code);
		if (plugin.id !== manifest.id) {
			throw new Error(`Plugin id mismatch: manifest "${manifest.id}" vs bundle "${plugin.id}"`);
		}
		const handle = await this.engine.loadPlugin({
			...plugin,
			defaultConfig: { ...plugin.defaultConfig, ...record.initialConfig },
			configSchema: manifest.configSchema ?? plugin.configSchema,
			allowedDomains: manifest.allowedDomains ?? plugin.allowedDomains
		});
		return [handle];
	}

	async deactivate(pluginId: string, options?: { revertThemes?: boolean }): Promise<void> {
		if (this.engine.isPluginLoaded(pluginId)) {
			await this.engine.unloadPlugin(pluginId);
		}
		const handle = this.activeHandles.get(pluginId);
		if (handle) {
			handle.dispose();
			this.activeHandles.delete(pluginId);
		}
		this.cssInjector.remove(pluginId);
		if (options?.revertThemes && this.isInstalled(pluginId)) {
			const preferred = this.engine.state.userPreferences.visualThemeId;
			if (preferred && !this.engine.themes.isSelectable(preferred))
				await this.engine.revertToDefaultThemes();
		}
	}

	disposeAll(): void {
		for (const [, handle] of this.activeHandles) {
			handle.dispose();
		}
		this.activeHandles.clear();
		this.cssInjector.disposeAll();
	}
}
