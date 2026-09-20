<script lang="ts">
	import { hostT } from '$lib/i18n/host-i18n.svelte';
	import {
		DEFAULT_VISUAL_THEME_ID,
		resolveLocalizedText,
		type WallpaperSource
	} from '@chronos/core';
	import type { AppShellController } from '$lib/app/app-shell.svelte';
	import { getAppEngine } from '$lib/services/app-engine';
	import { normalizeAppLocale } from '$lib/i18n/locale-sync';
	import { BUILTIN_COLOR_SCHEME_VIBRANT, resolveColorSchemeId } from '$lib/appearance/color-scheme';
	import { trackEvent } from '$lib/client/analytics';
	import { haptic } from '$lib/haptic/haptic';
	import Radio from '$lib/components/ui/Radio.svelte';
	import Switch from '$lib/components/ui/Switch.svelte';
	import MineSection from '$lib/components/mine/MineSection.svelte';
	import MineRow from '$lib/components/mine/MineRow.svelte';
	let { shell }: { shell: AppShellController } = $props();
	const visualThemeId = $derived(shell.controller.activeThemeId);
	const activeColorSchemeId = $derived(resolveColorSchemeId(visualThemeId));
	const activeLocale = $derived(normalizeAppLocale(shell.controller.currentLocale));
	const source = $derived(shell.controller.userPreferences?.wallpaperSource ?? 'theme');
	const sources = ['none', 'custom', 'theme'] as const;
	async function selectSource(wallpaperSource: WallpaperSource) {
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

		const builtin = [
			{
				id: BUILTIN_COLOR_SCHEME_VIBRANT,
				label: hostT('display.builtin.default'),
				description: hostT('display.colorScheme.builtinDesc'),
				disabled: false
			}
		];

		const pluginThemes = getAppEngine()
			.themes.getThemes()
			.filter((theme) => theme.id !== DEFAULT_VISUAL_THEME_ID)
			.map((theme) => {
				const isDisabled =
					typeof theme.disabled === 'function' ? theme.disabled() : Boolean(theme.disabled);
				const desc = resolveLocalizedText(theme.description, '', activeLocale);

				return {
					id: theme.id,
					label: resolveLocalizedText(theme.name, theme.id, activeLocale),
					description: desc,
					disabled: isDisabled
				};
			});

		return [...builtin, ...pluginThemes];
	});

	async function selectColorScheme(schemeId: string) {
		const option = colorSchemeOptions.find((entry) => entry.id === schemeId);
		if (!option || option.disabled) return;
		haptic.light();
		trackEvent('settings_color_scheme_change', { schemeId });
		await shell.setColorScheme(schemeId);
	}
</script>

<div class="flex flex-col gap-5">
	<MineSection title={hostT('wallpaper.source.label')}>
		{#each sources as mode (mode)}
			<MineRow label title={hostT(`wallpaper.source.${mode}`)}>
				{#snippet trailing()}
					<Radio
						name="wallpaper-source"
						checked={source === mode}
						onchange={() => selectSource(mode)}
					/>
				{/snippet}
			</MineRow>
		{/each}
	</MineSection>
	<MineSection>
		<MineRow
			href="/wallpaper/preview"
			title={hostT('wallpaper.preview.title')}
			supporting={hostT('wallpaper.preview.description')}
		/>
	</MineSection>
	<MineSection title={hostT('display.section.colorScheme')}>
		{#each colorSchemeOptions as option (option.id)}
			{@const selected = activeColorSchemeId === option.id}
			<MineRow
				label={true}
				title={option.label}
				supporting={option.description}
				onclick={() => !option.disabled && selectColorScheme(option.id)}
			>
				{#snippet trailing()}
					<Radio
						name="color-scheme"
						checked={selected}
						disabled={option.disabled}
						onchange={() => selectColorScheme(option.id)}
					/>
				{/snippet}
			</MineRow>
		{/each}
	</MineSection>

	<MineSection>
		<MineRow
			label
			title={hostT('wallpaper.colors.title')}
			supporting={hostT(
				visualThemeId === DEFAULT_VISUAL_THEME_ID
					? 'wallpaper.colors.description'
					: 'wallpaper.colors.unavailable'
			)}
		>
			{#snippet trailing()}
				<Switch
					checked={shell.controller.userPreferences?.wallpaperColorEnabled ?? false}
					disabled={visualThemeId !== DEFAULT_VISUAL_THEME_ID}
					onCheckedChange={(enabled) => {
						if (visualThemeId !== DEFAULT_VISUAL_THEME_ID) return;
						trackEvent('wallpaper_colors_change', { enabled });
						void shell.updatePreferences({ wallpaperColorEnabled: enabled });
					}}
				/>
			{/snippet}
		</MineRow>
	</MineSection>
</div>
