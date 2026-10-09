import type { PluginManifest } from '@chronos/core';

export const OFFICIAL_PLUGINS_PLUGIN_ID = 'core.official-plugins';
export const INSTALLED_STORAGE_KEY = 'installed_plugins';

export interface InstalledOfficialPluginRecord {
	/** Immutable resource reference assigned by the browser repository. */
	resourceId?: string;
	revision?: number;
	acceptedHostVersion?: string;
	origin: { kind: 'user' } | { kind: 'profile'; profileId: string };
	initialConfig?: Record<string, unknown>;
	wallpaperAssetId?: string;
	manifest: PluginManifest;
	code?: string | null;
	colorsJson?: string | null;
	iconThemeJson?: string | null;
	cssCode?: string | null;
	manifestUrl?: string;
	installedAt: number;
}

export interface OfficialPluginAssets {
	wallpaper?: Blob;
	code?: string | null;
	colorsJson?: string | null;
	iconThemeJson?: string | null;
	cssCode?: string | null;
}
