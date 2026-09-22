import { describe, expect, it } from 'vite-plus/test';
import { PreferencesStore } from './preferences-store';

function store() {
	const values = new Map<string, string>();
	return new PreferencesStore({
		getItem: (key: string) => values.get(key) ?? null,
		setItem: (key: string, value: string) => values.set(key, value)
	} as unknown as Storage);
}
describe('wallpaper preferences', () => {
	it('defaults to no wallpaper with colors off, and persists source independently of theme', async () => {
		const prefs = store();
		expect(await prefs.getPreferences()).toMatchObject({
			wallpaperSource: 'none',
			wallpaperColorEnabled: false,
			wallpaperMaskEnabled: true
		});
		await prefs.savePreferences({
			wallpaperSource: 'custom',
			wallpaperColorEnabled: true,
			wallpaperMaskEnabled: false
		});
		await prefs.savePreferences({ visualThemeId: 'Theme.MixedCase' });
		expect(await prefs.getPreferences()).toMatchObject({
			wallpaperSource: 'custom',
			wallpaperColorEnabled: true,
			wallpaperMaskEnabled: false,
			visualThemeId: 'Theme.MixedCase'
		});
	});
});
