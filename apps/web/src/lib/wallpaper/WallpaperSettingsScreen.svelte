<script lang="ts">
	import { hostT } from '$lib/i18n/host-i18n.svelte';
	import {
		DEFAULT_USER_PREFERENCES,
		resolveLocalizedText,
		type WallpaperSource
	} from '@chronos/core';
	import type { AppShellController } from '$lib/app/app-shell.svelte';
	import { getAppEngine } from '$lib/services/app-engine';
	import { normalizeAppLocale } from '$lib/i18n/locale-sync';
	import { trackEvent } from '$lib/client/analytics';
	import { haptic } from '$lib/haptic/haptic';
	import Radio from '$lib/components/ui/Radio.svelte';
	import Switch from '$lib/components/ui/Switch.svelte';
	import MineSection from '$lib/components/mine/MineSection.svelte';
	import MineRow from '$lib/components/mine/MineRow.svelte';
	let { shell }: { shell: AppShellController } = $props();
	const visualThemeId = $derived(shell.controller.activeThemeId);
	const wallpaperColorsSelected = $derived(
		shell.state.wallpaperColorsAvailable &&
			(shell.controller.userPreferences?.wallpaperColorEnabled ?? false)
	);
	const wallpaperMaskSelected = $derived(
		shell.controller.userPreferences?.wallpaperMaskEnabled ??
			DEFAULT_USER_PREFERENCES.wallpaperMaskEnabled
	);
	const selectedTheme = $derived.by(() => {
		void shell.controller.slotVersion;
		return getAppEngine().themes.getTheme(visualThemeId);
	});
	const activeLocale = $derived(normalizeAppLocale(shell.controller.currentLocale));
	const source = $derived(
		shell.controller.userPreferences?.wallpaperSource ?? DEFAULT_USER_PREFERENCES.wallpaperSource
	);
	const wallpaperColorsDisabled = $derived(!shell.state.wallpaperColorsAvailable);
	const wallpaperMaskDisabled = $derived(!shell.state.hasWallpaper);
	const sources = ['none', 'custom', 'theme'] as const;
	async function selectSource(wallpaperSource: WallpaperSource) {
		if (wallpaperSource === 'theme' && !selectedTheme?.wallpaper) return;
		haptic.light();
		try {
			await shell.updatePreferences({ wallpaperSource });
		} catch {
			shell.controller.notify(hostT('wallpaper.settings.saveFailed'), 'error');
		}
	}
	const colorSchemeOptions = $derived.by(() => {
		void shell.controller.slotVersion;
		void activeLocale;

		return getAppEngine()
			.themes.getThemes()
			.map((theme) => ({
				id: theme.id,
				label: resolveLocalizedText(theme.name, theme.id, activeLocale),
				description: [
					theme.id === getAppEngine().defaultThemeId ? hostT('wallpaper.theme.default') : '',
					resolveLocalizedText(theme.description, '', activeLocale)
				]
					.filter(Boolean)
					.join(' · '),
				disabled: typeof theme.disabled === 'function' ? theme.disabled() : Boolean(theme.disabled)
			}))
			.sort(
				(a, b) =>
					Number(b.id === getAppEngine().defaultThemeId) -
					Number(a.id === getAppEngine().defaultThemeId)
			);
	});

	async function selectTheme(themeId: string) {
		const option = colorSchemeOptions.find((entry) => entry.id === themeId);
		if (!option || option.disabled) return;
		haptic.light();
		trackEvent('settings_color_scheme_change', { schemeId: themeId });
		await shell.setVisualTheme(themeId);
	}

	async function toggleWallpaperColors(enabled: boolean) {
		if (wallpaperColorsDisabled) return;
		trackEvent('wallpaper_colors_change', { enabled });
		try {
			await shell.updatePreferences({ wallpaperColorEnabled: enabled });
		} catch {
			shell.controller.notify(hostT('wallpaper.settings.saveFailed'), 'error');
		}
	}

	async function toggleWallpaperMask(enabled: boolean) {
		if (wallpaperMaskDisabled) return;
		trackEvent('wallpaper_mask_change', { enabled });
		try {
			await shell.setWallpaperMaskEnabled(enabled);
		} catch {
			shell.controller.notify(hostT('wallpaper.settings.saveFailed'), 'error');
		}
	}
</script>

<div class="flex flex-col gap-5">
	<MineSection title={hostT('wallpaper.themes.installed')}>
		{#each colorSchemeOptions as option (option.id)}
			{@const selected = visualThemeId === option.id}
			<MineRow label={true} title={option.label} supporting={option.description}>
				{#snippet trailing()}
					<Radio
						name="color-scheme"
						checked={selected}
						disabled={option.disabled}
						onchange={() => selectTheme(option.id)}
					/>
				{/snippet}
			</MineRow>
		{/each}
	</MineSection>
	<MineSection>
		<MineRow
			label
			title={hostT('wallpaper.colors.title')}
			aria-disabled={wallpaperColorsDisabled}
			style={wallpaperColorsDisabled ? 'opacity: 0.5; cursor: not-allowed;' : undefined}
		>
			{#snippet trailing()}
				<Switch
					checked={wallpaperColorsSelected}
					disabled={wallpaperColorsDisabled}
					onCheckedChange={toggleWallpaperColors}
				/>
			{/snippet}
		</MineRow>
		<MineRow
			label
			title={hostT('wallpaper.mask.title')}
			supporting={hostT('wallpaper.mask.description')}
			aria-disabled={wallpaperMaskDisabled}
			style={wallpaperMaskDisabled ? 'opacity: 0.5; cursor: not-allowed;' : undefined}
		>
			{#snippet trailing()}
				<Switch
					checked={wallpaperMaskSelected}
					disabled={wallpaperMaskDisabled}
					onCheckedChange={toggleWallpaperMask}
				/>
			{/snippet}
		</MineRow>
	</MineSection>
	<MineSection title={hostT('wallpaper.source.label')}>
		{#each sources as mode (mode)}
			{@const disabled = mode === 'theme' && !selectedTheme?.wallpaper}
			<MineRow
				label
				title={hostT(`wallpaper.source.${mode}`)}
				aria-disabled={disabled}
				style={disabled ? 'opacity: 0.5; cursor: not-allowed;' : undefined}
				supporting={mode === 'theme' && !selectedTheme?.wallpaper
					? hostT('wallpaper.source.themeEmpty')
					: undefined}
			>
				{#snippet trailing()}
					<Radio
						name="wallpaper-source"
						checked={source === mode}
						{disabled}
						onchange={() => selectSource(mode)}
					/>
				{/snippet}
			</MineRow>
		{/each}
	</MineSection>
	{#if source === 'custom'}
		<MineSection>
			<MineRow href="/wallpaper/preview" title={hostT('wallpaper.preview.title')} />
		</MineSection>
	{/if}
</div>
