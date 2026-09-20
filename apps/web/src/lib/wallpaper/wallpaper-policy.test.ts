import { describe, expect, it } from 'vite-plus/test';
import { resolveWallpaper } from './wallpaper-policy';

describe('host wallpaper policy', () => {
	it('keeps custom, theme and none independent across theme switches', () => {
		const custom = new Blob(['custom']);
		const first = new Blob(['first']);
		const second = new Blob(['second']);
		expect(resolveWallpaper('custom', custom, first)).toBe(custom);
		expect(resolveWallpaper('custom', custom, second)).toBe(custom);
		expect(resolveWallpaper('theme', custom, second)).toBe(second);
		expect(resolveWallpaper('theme', custom, undefined)).toBeNull();
		expect(resolveWallpaper('none', custom, second)).toBeNull();
	});
});
