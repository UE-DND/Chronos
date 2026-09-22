import { afterEach, beforeEach, describe, expect, it, vi } from 'vite-plus/test';
import { createAppShell } from './app-shell.svelte';

const mocks = vi.hoisted(() => ({
	themeAvailable: true,
	supportsWallpaper: true,
	preferences: {
		timetableLayoutMode: 'compact' as 'compact' | 'fixed',
		wallpaperSource: 'custom' as 'custom' | 'none' | 'theme',
		wallpaperColorEnabled: true
	},
	updatePreferences: vi.fn().mockResolvedValue(undefined),
	applyAppearance: vi.fn().mockResolvedValue(undefined),
	setTheme: vi.fn()
}));

vi.mock('$lib/appearance/appearance.svelte', () => ({
	createAppearance: () => ({ apply: mocks.applyAppearance, destroy: vi.fn() })
}));

vi.mock('$lib/wallpaper/wallpaper-controller.svelte', () => ({
	createWallpaperController: () => ({
		state: { uri: null },
		init: vi.fn(),
		select: vi.fn(),
		destroy: vi.fn()
	})
}));

vi.mock('$lib/appearance/apply-active-theme', () => ({ applyActiveTheme: vi.fn() }));

vi.mock('$lib/services/app-engine', () => ({
	getAppController: () => ({
		get userPreferences() {
			return mocks.preferences;
		},
		activeThemeId: 'm3-default',
		currentTimetable: null,
		timetables: [],
		updatePreferences: mocks.updatePreferences,
		setTheme: mocks.setTheme
	}),
	getAppEngine: () => ({
		state: { activeThemeId: 'm3-default' },
		defaultThemeId: 'm3-default',
		events: { emit: vi.fn() },
		on: () => ({ dispose: vi.fn() }),
		themes: {
			getTheme: (id?: string) =>
				mocks.themeAvailable
					? {
							wallpaper: id === 'theme-with-wallpaper' ? new Blob() : undefined,
							resolveWallpaperColors: mocks.supportsWallpaper
								? () => ({ workbenchColors: {} })
								: undefined
						}
					: null,
			isSelectable: (id: string) =>
				id === 'custom' || id === 'theme-with-wallpaper' || id === 'm3-default'
		},
		resolveThemeId: () => 'm3-default'
	}),
	getSharedCoursePaletteRef: () => ({}),
	notifyCoursePaletteChanged: vi.fn(),
	resetAppToInitialState: vi.fn()
}));

vi.mock('@chronos/ui-kit', () => ({ applyReduceMotionClass: vi.fn() }));

describe('app shell timetable layout in compact landscape', () => {
	let setLandscape: (matches: boolean) => void;
	let removeLandscapeListener: ReturnType<typeof vi.fn>;

	beforeEach(() => {
		mocks.preferences.timetableLayoutMode = 'compact';
		mocks.updatePreferences.mockClear();
		let landscapeListener: ((event: { matches: boolean }) => void) | undefined;
		removeLandscapeListener = vi.fn();
		const landscapeQuery = {
			matches: true,
			addEventListener: vi.fn((_type, listener) => {
				landscapeListener = listener;
			}),
			removeEventListener: removeLandscapeListener
		};
		setLandscape = (matches) => {
			landscapeQuery.matches = matches;
			landscapeListener?.({ matches });
		};
		vi.stubGlobal('window', {
			matchMedia: (query: string) =>
				query === '(orientation: landscape) and (max-height: 500px)'
					? landscapeQuery
					: { matches: false, addEventListener: vi.fn(), removeEventListener: vi.fn() }
		});
	});

	afterEach(() => vi.unstubAllGlobals());

	it('uses scrolling in compact landscape and restores the saved fit mode in portrait', async () => {
		const shell = createAppShell();
		shell.init();
		expect(shell.state.compactLandscape).toBe(true);
		expect(shell.state.effectiveTimetableLayoutMode).toBe('fixed');

		await shell.setTimetableLayoutMode('compact');
		expect(mocks.updatePreferences).not.toHaveBeenCalled();
		setLandscape(false);
		expect(shell.state.effectiveTimetableLayoutMode).toBe('compact');
		expect(mocks.preferences.timetableLayoutMode).toBe('compact');

		shell.destroy();
		expect(removeLandscapeListener).toHaveBeenCalledOnce();
	});

	it('preserves a saved scrolling preference across rotation', () => {
		mocks.preferences.timetableLayoutMode = 'fixed';
		const shell = createAppShell();
		shell.init();
		expect(shell.state.effectiveTimetableLayoutMode).toBe('fixed');
		setLandscape(false);
		expect(shell.state.effectiveTimetableLayoutMode).toBe('fixed');
		shell.destroy();
	});

	it('allows fit mode when the compact-landscape query does not match at startup', () => {
		setLandscape(false);
		const shell = createAppShell();
		shell.init();
		expect(shell.state.compactLandscape).toBe(false);
		expect(shell.state.effectiveTimetableLayoutMode).toBe('compact');
		shell.destroy();
	});
});

describe('theme selection and wallpaper color override', () => {
	it.each(['none', 'theme'] as const)(
		'closes wallpaper colors when source becomes %s',
		async (wallpaperSource) => {
			const shell = createAppShell();
			await shell.updatePreferences({ wallpaperSource });
			expect(mocks.updatePreferences).toHaveBeenLastCalledWith({
				wallpaperSource,
				wallpaperColorEnabled: false
			});
		}
	);

	it('closes wallpaper colors when switching away from the default theme', async () => {
		mocks.updatePreferences.mockClear();
		mocks.setTheme.mockClear();
		const shell = createAppShell();
		await shell.updatePreferences({ wallpaperColorEnabled: true });
		expect(mocks.updatePreferences).toHaveBeenCalledWith({ wallpaperColorEnabled: true });
		expect(mocks.setTheme).not.toHaveBeenCalled();
		await shell.setVisualTheme('custom');
		expect(mocks.updatePreferences).toHaveBeenLastCalledWith({
			visualThemeId: 'custom',
			wallpaperSource: 'none',
			wallpaperColorEnabled: false
		});
		expect(mocks.setTheme).toHaveBeenCalledWith('custom');
		await shell.updatePreferences({ wallpaperColorEnabled: false });
		expect(mocks.updatePreferences).toHaveBeenLastCalledWith({ wallpaperColorEnabled: false });
		expect(mocks.setTheme).toHaveBeenCalledTimes(1);
	});

	it('automatically selects theme wallpaper source when theme provides wallpaper', async () => {
		mocks.updatePreferences.mockClear();
		mocks.setTheme.mockClear();
		const shell = createAppShell();
		await shell.setVisualTheme('theme-with-wallpaper');
		expect(mocks.updatePreferences).toHaveBeenLastCalledWith({
			visualThemeId: 'theme-with-wallpaper',
			wallpaperSource: 'theme',
			wallpaperColorEnabled: false
		});
	});

	it('automatically selects none wallpaper source when switching to default theme', async () => {
		mocks.updatePreferences.mockClear();
		mocks.setTheme.mockClear();
		const shell = createAppShell();
		await shell.setVisualTheme('m3-default');
		expect(mocks.updatePreferences).toHaveBeenLastCalledWith({
			visualThemeId: 'm3-default',
			wallpaperSource: 'none',
			wallpaperColorEnabled: false
		});

		await shell.updatePreferences({ wallpaperSource: 'custom' });
		expect(mocks.updatePreferences).toHaveBeenLastCalledWith({ wallpaperSource: 'custom' });
	});
});

it('does not overwrite a restored preference during temporary theme absence', async () => {
	mocks.themeAvailable = false;
	try {
		const shell = createAppShell();
		await shell.updatePreferences({ reduceMotionEnabled: true });
		expect(mocks.updatePreferences).toHaveBeenLastCalledWith({ reduceMotionEnabled: true });
	} finally {
		mocks.themeAvailable = true;
	}
});
it('requires an explicit wallpaper color capability even for the default theme', async () => {
	mocks.supportsWallpaper = false;
	try {
		const shell = createAppShell();
		await shell.updatePreferences({ wallpaperColorEnabled: true });
		expect(mocks.updatePreferences).toHaveBeenLastCalledWith({ wallpaperColorEnabled: false });
	} finally {
		mocks.supportsWallpaper = true;
	}
});
