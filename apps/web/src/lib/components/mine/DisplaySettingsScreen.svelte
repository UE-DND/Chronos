<script lang="ts">
	import { hostT } from '$lib/i18n/host-i18n.svelte';
	import { type CapsuleCornerStyle, type ThemeMode, type TimetableLayoutMode } from '@chronos/core';
	import type { AppShellController } from '$lib/app/app-shell.svelte';
	import { trackEvent } from '$lib/client/analytics';

	import Radio from '$lib/components/ui/Radio.svelte';
	import Switch from '$lib/components/ui/Switch.svelte';
	import MineSection from '$lib/components/mine/MineSection.svelte';
	import MineRow from '$lib/components/mine/MineRow.svelte';
	import { haptic } from '$lib/haptic/haptic';

	let { shell }: { shell: AppShellController } = $props();
	const themeMode = $derived(shell.controller.userPreferences?.themeMode ?? 'auto');
	const layoutMode = $derived(shell.state.effectiveTimetableLayoutMode);
	const compactLandscape = $derived(shell.state.compactLandscape);
	const capsuleCornerStyle = $derived(
		shell.controller.userPreferences?.capsuleCornerStyle ?? 'sharp'
	);
	const currentPeriodHighlightEnabled = $derived(
		shell.controller.userPreferences?.currentPeriodHighlightEnabled ?? false
	);
	const periodHighlightDesc = $derived(
		layoutMode === 'compact'
			? hostT('display.periodHighlight.desc.compact')
			: hostT('display.periodHighlight.desc')
	);

	const themeOptions = $derived.by(() => {
		void shell.controller.currentLocale;
		return [
			{ mode: 'auto' as const, label: hostT('display.theme.auto') },
			{ mode: 'light' as const, label: hostT('display.theme.light') },
			{ mode: 'dark' as const, label: hostT('display.theme.dark') }
		] as const;
	});

	const layoutOptions = $derived.by(() => {
		void shell.controller.currentLocale;
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
		void shell.controller.currentLocale;
		return [
			{
				mode: 'sharp' as const,
				label: hostT('display.capsule.sharp.label'),
				description: hostT('display.capsule.sharp.desc')
			},
			{
				mode: 'pill' as const,
				label: hostT('display.capsule.pill.label'),
				description: hostT('display.capsule.pill.desc')
			}
		] as const;
	});

	async function selectThemeMode(mode: ThemeMode) {
		haptic.light();
		trackEvent('settings_theme_change', { mode });
		await shell.setThemeMode(mode);
	}

	async function selectLayoutMode(mode: TimetableLayoutMode) {
		if (layoutMode === mode || (compactLandscape && mode === 'compact')) return;
		haptic.light();
		trackEvent('settings_layout_change', { mode });
		await shell.setTimetableLayoutMode(mode);
	}

	async function selectCapsuleCornerStyle(style: CapsuleCornerStyle) {
		haptic.light();
		trackEvent('settings_capsule_corner_change', { style });
		await shell.setCapsuleCornerStyle(style);
	}

	async function toggleCurrentPeriodHighlight(checked: boolean) {
		trackEvent('settings_period_highlight_change', { enabled: checked });
		await shell.setCurrentPeriodHighlightEnabled(checked);
	}
</script>

<div class="flex flex-col gap-5">
	<MineSection title={hostT('display.section.themeMode')}>
		{#each themeOptions as option (option.mode)}
			{@const selected = themeMode === option.mode}
			<MineRow label={true} title={option.label} onclick={() => selectThemeMode(option.mode)}>
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
				onclick={() => selectLayoutMode(option.mode)}
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
		<MineRow label title={hostT('display.periodHighlight.label')} supporting={periodHighlightDesc}>
			{#snippet trailing()}
				<Switch
					checked={currentPeriodHighlightEnabled}
					onCheckedChange={toggleCurrentPeriodHighlight}
				/>
			{/snippet}
		</MineRow>
	</MineSection>

	<MineSection title={hostT('display.section.capsule')}>
		{#each capsuleCornerOptions as option (option.mode)}
			{@const selected = capsuleCornerStyle === option.mode}
			<MineRow
				label={true}
				title={option.label}
				supporting={option.description}
				onclick={() => selectCapsuleCornerStyle(option.mode)}
			>
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
