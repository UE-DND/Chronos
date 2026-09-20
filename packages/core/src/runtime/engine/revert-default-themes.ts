import type { UserPreferences } from '../../domain/preferences';
import type { ThemeRegistry } from '../theme-registry';
export interface RevertDefaultThemesInput {
	activeThemeId: string | null;
	defaultThemeId: string | null;
	preferences: UserPreferences;
	themes: ThemeRegistry;
}
export interface RevertDefaultThemesPlan {
	nextThemeId?: string;
	preferencesPatch: Partial<UserPreferences>;
}
export function planRevertToDefaultThemes(
	input: RevertDefaultThemesInput
): RevertDefaultThemesPlan | null {
	const { defaultThemeId, themes, activeThemeId, preferences } = input;
	if (!defaultThemeId || !themes.isSelectable(defaultThemeId)) return null;
	if (
		(activeThemeId && !themes.isSelectable(activeThemeId)) ||
		(preferences.visualThemeId && !themes.isSelectable(preferences.visualThemeId))
	) {
		return { nextThemeId: defaultThemeId, preferencesPatch: { visualThemeId: defaultThemeId } };
	}
	return null;
}
