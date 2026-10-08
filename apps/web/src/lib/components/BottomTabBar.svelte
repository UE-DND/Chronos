<script lang="ts">
	import { hostT } from '$lib/i18n/host-i18n.svelte';
	import { goto } from '$app/navigation';
	import { resolve } from '$app/paths';
	import { getContext } from 'svelte';
	import { MediaQuery } from 'svelte/reactivity';
	import type { BottomTabSlotContribution } from '@chronos/core';
	import { HOST_DEFAULT_ICON_THEME_ID, resolveLocalizedText } from '@chronos/core';
	import type { TimetableScreenController } from '$lib/timetable/timetable-screen.svelte';
	import type { ShellTabController } from '$lib/shell/shell-tab.svelte';
	import { getAppController, getAppEngine } from '$lib/services/app-engine';

	import { resolveShellIcon, shellIconSizeClass } from '$lib/shell/resolve-shell-icon';
	import ShellSvgIcon from '$lib/shell/ShellSvgIcon.svelte';
	import { haptic } from '$lib/haptic/haptic';
	import TimetableEditBar from '$lib/components/timetable/TimetableEditBar.svelte';
	import LayoutOptionsSheet from '$lib/components/timetable/LayoutOptionsSheet.svelte';
	import { trackEvent } from '$lib/client/analytics';

	const timetableScreen = getContext<TimetableScreenController>('timetableScreen');
	const shellTab = getContext<ShellTabController>('shellTab');
	const controller = getAppController();

	const sortedTabs = $derived(controller.getSlots('shell.bottom-bar.tab'));
	const compactLandscape = new MediaQuery('(orientation: landscape) and (max-height: 500px)');
	const displayedTabs = $derived(compactLandscape.current ? sortedTabs.toReversed() : sortedTabs);
	const activeTabId = $derived(shellTab.activeTabId);
	const isEditing = $derived(Boolean(timetableScreen?.state.isEditing));
	const isDragging = $derived(Boolean(timetableScreen?.interaction.isDragging));
	const isDragOverDeleteZone = $derived(Boolean(timetableScreen?.interaction.drag?.overDeleteZone));
	const hasTimetable = $derived(Boolean(timetableScreen?.state.currentTimetable));

	let layoutOptionsSheet = $state(false);

	$effect(() => {
		if (!isEditing) {
			layoutOptionsSheet = false;
		}
	});

	function resolveTabIcon(tab: BottomTabSlotContribution, active: boolean) {
		const engine = getAppEngine();
		const iconThemeId = controller.activeIconThemeId;
		const iconTheme =
			iconThemeId !== HOST_DEFAULT_ICON_THEME_ID
				? engine.iconThemes.getIconTheme(iconThemeId)
				: undefined;
		const iconOverride = iconTheme?.bottomTabIcons?.[tab.id];

		const iconRef = active
			? (iconOverride?.iconFill ?? iconOverride?.icon ?? tab.iconFill ?? tab.icon)
			: (iconOverride?.icon ?? tab.icon);

		return resolveShellIcon(iconRef);
	}

	function handleTabClick(event: MouseEvent, tab: BottomTabSlotContribution) {
		haptic.medium();
		if (timetableScreen?.state.isEditing && tab.hostPanel !== 'timetable') {
			timetableScreen.setEditing(false);
		}
		if (tab.onClick) {
			const ctx = controller.getPluginContextForSlot('shell.bottom-bar.tab', tab.id);
			void tab.onClick(event, ctx);
			return;
		}
		if (tab.hostPanel === 'timetable' && activeTabId === tab.id && timetableScreen) {
			timetableScreen.jumpToCurrentWeek();
			return;
		}
		if (activeTabId === tab.id) {
			trackEvent('shell_tab_scroll_top', { tabId: tab.id });
			shellTab.scrollToTop(tab.id);
			return;
		}
		shellTab.setActiveTab(tab.id);
	}
</script>

<div class="tab-bar-content flex h-full w-full flex-col justify-center">
	{#if isEditing}
		<TimetableEditBar
			{isDragging}
			{isDragOverDeleteZone}
			{hasTimetable}
			compactLandscape={compactLandscape.current}
			onEdit={() => {
				haptic.light();
				goto(resolve('/timetable/details'));
			}}
			onAdd={() => {
				haptic.light();
				trackEvent('course_editor_open', { trigger: 'bottom_bar' });
				goto(resolve('/timetable/course-editor'));
			}}
			onLayout={() => {
				haptic.light();
				layoutOptionsSheet = true;
			}}
		/>
	{:else}
		<nav aria-label={hostT('ui.nav.main')} class="flex items-center">
			{#each displayedTabs as tab (tab.id)}
				{@const active = activeTabId === tab.id}
				{@const icon = resolveTabIcon(tab, active)}
				<button
					type="button"
					role="tab"
					aria-selected={active}
					aria-label={resolveLocalizedText(tab.label)}
					class="flex min-h-0 cursor-pointer flex-col items-center justify-center border-0 bg-transparent py-0.5 text-on-surface-variant transition-colors outline-none hover:text-on-surface focus:outline-none sm:py-1"
					onclick={(e) => handleTabClick(e, tab)}
				>
					<span
						aria-hidden="true"
						class="tab-icon-shell rounded-circular flex items-center justify-center transition-colors {active
							? 'shell-bottom-tab-active'
							: ''}"
					>
						{#if icon?.kind === 'component'}
							{@const Icon = icon.component}
							<Icon class={shellIconSizeClass()} />
						{:else if icon?.kind === 'svg'}
							<ShellSvgIcon
								markup={icon.markup}
								rotation={icon.rotation}
								opacity={icon.opacity}
								class={shellIconSizeClass(icon.size)}
							/>
						{:else if icon?.kind === 'url'}
							<img src={icon.url} alt="" class="object-contain {shellIconSizeClass(icon.size)}" />
						{/if}
					</span>
					<span
						class="tab-label text-label-small leading-tight {active
							? 'text-on-surface'
							: 'text-on-surface-variant'}"
					>
						{resolveLocalizedText(tab.label)}
					</span>
				</button>
			{/each}
		</nav>
	{/if}
</div>

<LayoutOptionsSheet bind:open={layoutOptionsSheet} />

<style>
	.tab-icon-shell {
		width: 3rem;
		height: 1.75rem;
	}

	@media (min-width: 640px) {
		.tab-icon-shell {
			width: 3.5rem;
			height: 2rem;
		}
	}

	@media (orientation: landscape) and (max-height: 500px) {
		.tab-icon-shell {
			width: 2.25rem;
			height: 2.25rem;
		}
	}
</style>
