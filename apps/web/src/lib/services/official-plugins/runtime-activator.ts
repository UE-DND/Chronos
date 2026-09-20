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
		await this.deactivate(manifest.id);

		if (record.cssCode) this.cssInjector.inject(manifest.id, record.cssCode);

		const disposables: Disposable[] = [];
		try {
			disposables.push(...(await this.activateThemeAssets(record)));
			disposables.push(...(await this.activateBundledPlugin(record)));

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
		if (colorTheme) {
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
