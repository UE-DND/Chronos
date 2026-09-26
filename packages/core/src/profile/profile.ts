import type { UserPreferences } from '../domain/preferences';

export interface PluginProfileConfig {
	id: string;
	enabled?: boolean;
	config?: Record<string, unknown>;
}

export interface ChronosProfile {
	profileId: string;
	name: string;
	description?: string;
	preinstall: PluginProfileConfig[];
	defaultTheme: { pluginId: string; themeId: string };
	/** Initial import.source.tab slot id when opening the import screen. */
	defaultImportSlot?: string;
	deniedPluginServerActions?: { pluginId: string; action: string }[];
	preferences?: Partial<Omit<UserPreferences, 'visualThemeId'>>;
}

/**
 * Merges configuration for a plugin across 4 distinct layers:
 * 1. Default Schema (plugin.defaultConfig)
 * 2. Manifest Bundle Config
 * 3. Profile Config (profile.preinstall[i].config)
 * 4. User Persistent Patch (storage __config__)
 */
export function resolveLayeredPluginConfig<T extends Record<string, unknown>>(
	schemaDefault?: Partial<T>,
	manifestConfig?: Partial<T>,
	profileConfig?: Partial<T>,
	userPersistentPatch?: Partial<T>
): T {
	return {
		...schemaDefault,
		...manifestConfig,
		...profileConfig,
		...userPersistentPatch
	} as T;
}

export function validateProfile(profile: ChronosProfile): void {
	if (new Set(profile.preinstall.map((p) => p.id)).size !== profile.preinstall.length)
		throw new Error('Duplicate preinstall plugin ID');
	if (profile.preinstall.some((entry) => entry.enabled === false))
		throw new Error('Preinstalled plugins must be enabled');
	const selection = profile.defaultTheme;
	if (!selection?.pluginId?.trim() || !selection.themeId?.trim())
		throw new Error(`Profile ${profile.profileId} requires a default theme`);
	if (!profile.preinstall.some((p) => p.id === selection.pluginId && p.enabled !== false))
		throw new Error(
			`Default theme provider ${selection.pluginId} must be enabled in profile ${profile.profileId}`
		);
	if (profile.preferences && 'visualThemeId' in profile.preferences)
		throw new Error('Profile preferences must not set visualThemeId');
}
