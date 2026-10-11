<script lang="ts">
	import { onDestroy, untrack } from 'svelte';
	import { FONT_SIZE_SCALE_OPTIONS } from '@chronos/core';
	import { createFontSizeSettings } from './font-size-settings.svelte';
	import { hostT } from '#lib/i18n/host-i18n.svelte.ts';
	import { type CapsuleCornerStyle, type ThemeMode, type TimetableLayoutMode } from '@chronos/core';
	import type { AppShellController } from '#lib/app/app-shell.svelte.ts';
	import { trackEvent } from '#lib/client/analytics.ts';

	import Radio from '#lib/components/ui/Radio.svelte';
	import Switch from '#lib/components/ui/Switch.svelte';
	import MineSection from '#lib/components/mine/MineSection.svelte';
	import MineRow from '#lib/components/mine/MineRow.svelte';
	import { haptic } from '#lib/haptic/haptic.ts';

	let { shell }: { shell: AppShellController } = $props();
	let themeMode = $derived(shell.controller.userPreferences?.themeMode ?? 'auto');
	let layoutMode = $derived(shell.state.effectiveTimetableLayoutMode);
	const compactLandscape = $derived(shell.state.compactLandscape);
	let capsuleCornerStyle = $derived(
		shell.controller.userPreferences?.capsuleCornerStyle ?? 'sharp'
	);
	let currentPeriodHighlightEnabled = $derived(
		shell.controller.userPreferences?.currentPeriodHighlightEnabled ?? false
	);

	const fontSettings = createFontSizeSettings({
		initial: untrack(() => shell.controller.userPreferences?.fontSizeScale ?? 1),
		preview: (scale) => shell.previewFontSizeScale(scale),
		save: (scale) => shell.setFontSizeScale(scale),
		onError: () => shell.controller.notify(hostT('wallpaper.settings.saveFailed'), 'error')
	});
	const fontIndex = $derived(FONT_SIZE_SCALE_OPTIONS.indexOf(fontSettings.state.draft));
	const fontLabels = $derived([
		hostT('display.font.small'),
		hostT('display.font.standard'),
		hostT('display.font.large'),
		hostT('display.font.maximum')
	]);
	$effect(() => {
		const saved = shell.controller.userPreferences?.fontSizeScale ?? 1;
		untrack(() => fontSettings.sync(saved));
	});
	onDestroy(() => fontSettings.destroy());
	function previewFont(event: Event) {
		const index = Number((event.currentTarget as HTMLInputElement).value);
		const scale = FONT_SIZE_SCALE_OPTIONS[index];
		if (scale !== undefined) fontSettings.preview(scale);
	}
	function commitFont() {
		void fontSettings.commit();
	}

	const themeOptions = $derived.by(() => {
		void shell.controller.locale;
		return [
			{ mode: 'auto' as const, label: hostT('display.theme.auto') },
			{ mode: 'light' as const, label: hostT('display.theme.light') },
			{ mode: 'dark' as const, label: hostT('display.theme.dark') }
		] as const;
	});

	const layoutOptions = $derived.by(() => {
		void shell.controller.locale;
		return [
			{
				mode: 'compact' as const,
				label: hostT('display.layout.compact.label'),
				description: hostT('display.layout.compact.desc')
			},
			{
				mode: 'fixed' as const,
				label: hostT('display.layout.fixed.label'),
				description: hostT('display.layout.fixed.desc')
			}
		] as const;
	});

	const capsuleCornerOptions = $derived.by(() => {
		void shell.controller.locale;
		return [
			{
				mode: 'sharp' as const,
				label: hostT('display.capsule.sharp.label')
			},
			{
				mode: 'pill' as const,
				label: hostT('display.capsule.pill.label')
			}
		] as const;
	});

	async function selectThemeMode(mode: ThemeMode) {
		if (themeMode === mode) return;
		haptic.light();
		trackEvent('settings_theme_change', { mode });
		const previous = themeMode;
		themeMode = mode;
		try {
			await shell.setThemeMode(mode);
		} catch {
			themeMode = previous;
			shell.controller.notify(hostT('wallpaper.settings.saveFailed'), 'error');
		}
	}

	async function selectLayoutMode(mode: TimetableLayoutMode) {
		if (layoutMode === mode || (compactLandscape && mode === 'compact')) return;
		haptic.light();
		trackEvent('settings_layout_change', { mode });
		const previous = layoutMode;
		layoutMode = mode;
		try {
			await shell.setTimetableLayoutMode(mode);
		} catch {
			layoutMode = previous;
			shell.controller.notify(hostT('wallpaper.settings.saveFailed'), 'error');
		}
	}

	async function selectCapsuleCornerStyle(style: CapsuleCornerStyle) {
		if (capsuleCornerStyle === style) return;
		haptic.light();
		trackEvent('settings_capsule_corner_change', { style });
		const previous = capsuleCornerStyle;
		capsuleCornerStyle = style;
		try {
			await shell.setCapsuleCornerStyle(style);
		} catch {
			capsuleCornerStyle = previous;
			shell.controller.notify(hostT('wallpaper.settings.saveFailed'), 'error');
		}
	}

	async function toggleCurrentPeriodHighlight(checked: boolean) {
		trackEvent('settings_period_highlight_change', { enabled: checked });
		try {
			await shell.setCurrentPeriodHighlightEnabled(checked);
		} catch {
			currentPeriodHighlightEnabled =
				shell.controller.userPreferences?.currentPeriodHighlightEnabled ?? false;
			shell.controller.notify(hostT('wallpaper.settings.saveFailed'), 'error');
		}
	}
</script>

<div class="flex flex-col gap-5">
	<MineSection title={hostT('display.section.themeAppearance')}>
		{#each themeOptions as option (option.mode)}
			{@const selected = themeMode === option.mode}
			<MineRow label={true} title={option.label}>
				{#snippet trailing()}
					<Radio
						name="theme-mode"
						checked={selected}
						onchange={() => selectThemeMode(option.mode)}
					/>
				{/snippet}
			</MineRow>
		{/each}
	</MineSection>

	<MineSection title={hostT('display.font.title')}>
		<div class="min-w-0 px-4 pt-4 pb-5">
			<div class="grid grid-cols-[auto_minmax(0,1fr)_auto] items-start gap-3">
				<span
					class="flex h-11 min-h-[44px] items-center text-sm font-medium text-on-surface-variant"
					aria-hidden="true">A</span
				>
				<div class="relative min-w-0 pb-5">
					<input
						id="font-size-slider"
						class="block h-11 min-h-[44px] w-full cursor-pointer accent-brand"
						type="range"
						min="0"
						max="3"
						step="1"
						value={fontIndex}
						aria-label={hostT('display.font.title')}
						aria-valuetext={fontLabels[fontIndex]}
						oninput={previewFont}
						onchange={commitFont}
						onpointerup={commitFont}
						onpointercancel={commitFont}
						onkeyup={commitFont}
					/>
					<div
						class="pointer-events-none absolute inset-x-2 top-[calc(max(1.375rem,22px)+0.75rem)] flex justify-between"
						aria-hidden="true"
					>
						{#each FONT_SIZE_SCALE_OPTIONS as scale (scale)}
							<div class="relative flex w-0 justify-center">
								<span class="size-1 shrink-0 rounded-full bg-on-surface-variant/40"></span>
								{#if scale === 1}
									<span
										class="text-body-small absolute top-2 font-medium whitespace-nowrap text-on-surface-variant"
										>{hostT('display.font.standard')}</span
									>
								{/if}
							</div>
						{/each}
					</div>
				</div>
				<span
					class="flex h-11 min-h-[44px] items-center text-[2.5rem] leading-none text-on-surface-variant"
					aria-hidden="true">A</span
				>
			</div>
		</div>
	</MineSection>

	<MineSection title={hostT('display.section.layout')}>
		{#each layoutOptions as option (option.mode)}
			{@const selected = layoutMode === option.mode}
			<MineRow
				label={true}
				title={option.label}
				supporting={compactLandscape && option.mode === 'compact'
					? hostT('display.layout.compact.landscapeUnavailable')
					: option.description}
				aria-disabled={compactLandscape && option.mode === 'compact'}
			>
				{#snippet trailing()}
					<Radio
						name="timetable-layout-mode"
						checked={selected}
						disabled={compactLandscape && option.mode === 'compact'}
						onchange={() => selectLayoutMode(option.mode)}
					/>
				{/snippet}
			</MineRow>
		{/each}
	</MineSection>

	<MineSection>
		<MineRow label title={hostT('display.periodHighlight.label')}>
			{#snippet trailing()}
				<Switch
					bind:checked={currentPeriodHighlightEnabled}
					onCheckedChange={toggleCurrentPeriodHighlight}
				/>
			{/snippet}
		</MineRow>
	</MineSection>

	<MineSection title={hostT('display.section.capsule')}>
		{#each capsuleCornerOptions as option (option.mode)}
			{@const selected = capsuleCornerStyle === option.mode}
			<MineRow label={true} title={option.label}>
				{#snippet trailing()}
					<Radio
						name="capsule-corner-style"
						checked={selected}
						onchange={() => selectCapsuleCornerStyle(option.mode)}
					/>
				{/snippet}
			</MineRow>
		{/each}
	</MineSection>
</div>
