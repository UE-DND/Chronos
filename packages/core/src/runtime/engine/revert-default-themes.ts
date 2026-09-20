import type { UserPreferences } from '../../domain/preferences';
import { DEFAULT_VISUAL_THEME_ID } from '../../theme/theme-defaults';
import type { ThemeRegistry } from '../theme-registry';

export interface RevertDefaultThemesInput {
	activeThemeId: string;
	preferences: UserPreferences;
	themes: ThemeRegistry;
}

export interface RevertDefaultThemesPlan {
	nextThemeId?: string;
	preferencesPatch: Partial<UserPreferences>;
}

/** Computes theme/preference rollback when plugin-owned themes are removed. */
export function planRevertToDefaultThemes(
	input: RevertDefaultThemesInput
): RevertDefaultThemesPlan | null {
	const patch: Partial<UserPreferences> = {};
	let nextThemeId: string | undefined;

	if (
		(input.activeThemeId !== DEFAULT_VISUAL_THEME_ID &&
			!input.themes.getTheme(input.activeThemeId)) ||
		(input.preferences.visualThemeId &&
			input.preferences.visualThemeId !== DEFAULT_VISUAL_THEME_ID &&
			!input.themes.getTheme(input.preferences.visualThemeId))
	) {
		nextThemeId = DEFAULT_VISUAL_THEME_ID;
		patch.visualThemeId = DEFAULT_VISUAL_THEME_ID;
	}

	if (Object.keys(patch).length === 0) {
		return null;
	}

	return { nextThemeId, preferencesPatch: patch };
}
