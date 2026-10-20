<script lang="ts">
	import { appUpdateNotice } from '#lib/client/app-update-ux.svelte.ts';
	import { hostT } from '#lib/i18n/host-i18n.svelte.ts';
	import type { AppShellController } from '#lib/app/app-shell.svelte.ts';
	import { resolveMineSectionId } from '#lib/components/mine/mine-section-id.ts';
	import MineSection from '#lib/components/mine/MineSection.svelte';
	import MineRow, { type MineIconTone } from '#lib/components/mine/MineRow.svelte';
	import { getAppController } from '#lib/services/app-engine.ts';

	import { DEFAULT_MINE_SECTION_ID, resolveLocalizedText } from '@chronos/core';
	import { ChevronRight, CodeFill } from '#lib/icons/index.ts';
	import { resolveShellIcon } from '#lib/shell/resolve-shell-icon.ts';
	import type { Component } from 'svelte';

	let { shell }: { shell: AppShellController } = $props();

	const controller = getAppController();

	type SettingItem = {
		id: string;
		title: string;
		supporting?: string;
		href?: string;
		onClick?: () => void | Promise<void>;
		icon?: Component<{ class?: string }>;
		iconTone?: MineIconTone;
	};

	type SettingSection = {
		id: string;
		items: SettingItem[];
	};

	function resolveIcon(icon: unknown, itemId: string): Component<{ class?: string }> | undefined {
		const resolved = resolveShellIcon(icon);
		if (resolved?.kind === 'component') {
			return resolved.component;
		}
		return itemId ? CodeFill : undefined;
	}

	const sections = $derived.by(() => {
		void controller.slotVersion;
		const pluginSections = controller.getSlots('mine.section');
		const pluginItems = controller.getSlots('mine.item');
		const sectionMap: Record<string, SettingSection> = {};
		const registeredSectionIds = new Set(pluginSections.map((section) => section.id));

		for (const pSec of pluginSections) {
			sectionMap[pSec.id] = {
				id: pSec.id,
				items: []
			};
		}

		for (const item of pluginItems) {
			const targetSectionId = resolveMineSectionId(item.sectionId, registeredSectionIds);
			let section = sectionMap[targetSectionId];
			if (!section) {
				section = {
					id: targetSectionId,
					items: []
				};
				sectionMap[targetSectionId] = section;
			}

			const context = item.onClick
				? controller.getPluginContextForSlot('mine.item', item.id)
				: undefined;
			section.items.push({
				id: item.id,
				title: resolveLocalizedText(item.title),
				supporting: resolveLocalizedText(item.supporting),
				href: item.href,
				onClick: item.onClick && context ? () => item.onClick!(context) : undefined,
				icon: resolveIcon(item.icon, item.id),
				iconTone: item.iconTone ?? 'neutral'
			});
		}

		// Keep registry order for other sections, with app & support always last.
		return Object.values(sectionMap).sort(
			(a, b) => Number(a.id === DEFAULT_MINE_SECTION_ID) - Number(b.id === DEFAULT_MINE_SECTION_ID)
		);
	});
</script>

<div class="mx-auto flex w-full max-w-lg flex-col gap-5 p-4 pb-7 text-on-surface">
	{#if sections.length === 0}
		<div class="flex flex-col items-center justify-center py-12 text-center">
			<p class="text-body-medium text-on-surface-variant">
				{hostT('mine.empty.noItems')}
			</p>
		</div>
	{:else}
		{#each sections as section (section.id)}
			<MineSection>
				{#each section.items as item (item.id)}
					<MineRow
						title={item.title}
						supporting={item.supporting}
						href={item.href}
						onclick={item.onClick}
						icon={item.icon}
						iconTone={item.iconTone}
					>
						{#snippet trailing()}
							{#if item.id === 'about' && appUpdateNotice.hasUpdate}
								<span
									class="text-label-large inline-flex h-7 shrink-0 items-center justify-center rounded-full border border-transparent bg-primary-container/50 px-2.5 text-primary"
								>
									{hostT('mine.about.updateAvailable')}
								</span>
							{:else}
								<ChevronRight
									aria-hidden="true"
									class="size-4.5 shrink-0 text-on-surface-variant"
								/>
							{/if}
						{/snippet}
					</MineRow>
				{/each}
			</MineSection>
		{/each}
	{/if}
</div>
