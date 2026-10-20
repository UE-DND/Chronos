<script lang="ts">
	import { appStartup } from '#lib/boot/startup.svelte.ts';
	import { appUpdateNotice } from '#lib/client/app-update-ux.svelte.ts';
	import { hostT } from '#lib/i18n/host-i18n.svelte.ts';
	import { goto } from '$app/navigation';
	import { resolve } from '$app/paths';
	import { onMount } from 'svelte';
	import type { AppShellController } from '#lib/app/app-shell.svelte.ts';
	import { trackEvent } from '#lib/client/analytics.ts';
	import { dismissSnackbar, snackbarKey } from '#lib/components/ui/snackbar-state.svelte.ts';
	import Button from '#lib/components/ui/Button.svelte';
	import BottomSheet from '#lib/components/ui/BottomSheet.svelte';
	import { estimateAppDataBytes } from '#lib/storage/clear-app-data.ts';
	import { formatBytes } from '#lib/utils/format-bytes.ts';
	import {
		APP_VERSION,
		BUILD_TIME,
		COPYRIGHT_HOLDER,
		formatCopyrightYearRange,
		PROJECT_LICENSE
	} from '#lib/config/app-meta.ts';
	import { formatFullDate } from '@chronos/core';

	import MineSection from '#lib/components/mine/MineSection.svelte';
	import MineRow from '#lib/components/mine/MineRow.svelte';
	import Switch from '#lib/components/ui/Switch.svelte';
	import AppHero from '#lib/components/AppHero.svelte';
	import { ChevronRight, InfoFill, DeleteSweepFill, ScheduleFill } from '#lib/icons/index.ts';

	let { shell }: { shell: AppShellController } = $props();

	const DEVELOPER_PAGE_TAP_COUNT = 5;

	let developerPageTapCount = $state(0);
	let clearDialogOpen = $state(false);
	let clearing = $state(false);
	let dataUsageBytes = $state<number | null>(null);

	const dataUsageSupporting = $derived(
		dataUsageBytes === null
			? hostT('about.storage.calculating')
			: hostT('about.storage.usage', {
					size: formatBytes(dataUsageBytes)
				})
	);

	let savingAnalytics = $state(false);
	let localAnalyticsOverride = $state<boolean | null>(null);
	const analyticsEnabled = $derived(shell.controller.userPreferences?.analyticsEnabled ?? true);
	const analyticsChecked = $derived(localAnalyticsOverride ?? analyticsEnabled);

	async function refreshDataUsage() {
		dataUsageBytes = await estimateAppDataBytes();
	}

	async function toggleAnalytics(enabled: boolean) {
		if (savingAnalytics) return;
		savingAnalytics = true;
		localAnalyticsOverride = enabled;
		try {
			await shell.setAnalyticsEnabled(enabled);
		} catch {
			shell.controller.notify(hostT('about.analytics.saveFailed'), 'error');
		} finally {
			localAnalyticsOverride = null;
			savingAnalytics = false;
		}
	}

	onMount(() => {
		void refreshDataUsage();
	});

	function formatBuildTime(value: string) {
		if (!value) return '-';
		const datePart = value.slice(0, 10);
		const timePart = value.slice(11, 19);
		if (/^\d{4}-\d{2}-\d{2}$/.test(datePart) && /^\d{2}:\d{2}:\d{2}$/.test(timePart)) {
			return `${formatFullDate(datePart)} ${timePart}`;
		}
		return value.replace('T', ' ').replace(/\.\d+Z$/, '');
	}

	function onBuildTimeClickForDeveloperPage() {
		developerPageTapCount += 1;
		if (developerPageTapCount >= DEVELOPER_PAGE_TAP_COUNT) {
			developerPageTapCount = 0;
			trackEvent('developer_page_open');
			dismissSnackbar();
			void goto(resolve('about/developer'));
		} else if (developerPageTapCount >= Math.ceil(DEVELOPER_PAGE_TAP_COUNT / 2)) {
			const remaining = DEVELOPER_PAGE_TAP_COUNT - developerPageTapCount;
			snackbarKey('about.developerPage.hint', { remaining }, undefined, 1500);
		}
	}

	async function confirmClear() {
		trackEvent('about_clear_all_data');
		clearing = true;
		try {
			const result = await shell.clearAllData().catch(() => {
				snackbarKey('about.clear.failed');
				return null;
			});
			if (!result) return;
			clearDialogOpen = false;
			try {
				await refreshDataUsage();
			} catch (error) {
				dataUsageBytes = null;
				console.warn('[AboutScreen] Could not refresh data usage after clearing:', error);
			}
			snackbarKey(
				result.status === 'complete' ? 'about.clear.success' : 'about.clear.recoveryFailed'
			);
		} finally {
			clearing = false;
		}
	}
</script>

<div class="ui-stack">
	<AppHero title="Chronos" subtitle={hostT('meta.intro')} />

	<MineSection title={hostT('about.section.version')}>
		<MineRow
			title={hostT('about.version.current')}
			supporting={APP_VERSION}
			href={resolve('about/update')}
			icon={InfoFill}
			iconTone="primary"
		>
			{#snippet trailing()}
				{#if appUpdateNotice.hasUpdate}
					<span
						class="text-label-large inline-flex h-7 shrink-0 items-center justify-center rounded-full border border-transparent bg-primary-container/50 px-2.5 text-primary"
					>
						{hostT('mine.about.updateAvailable')}
					</span>
				{:else}
					<ChevronRight aria-hidden="true" class="size-4.5 shrink-0 text-on-surface-variant" />
				{/if}
			{/snippet}
		</MineRow>
		<MineRow
			title={hostT('about.buildTime')}
			supporting={formatBuildTime(BUILD_TIME)}
			icon={ScheduleFill}
			iconTone="secondary"
			onclick={onBuildTimeClickForDeveloperPage}
		/>
	</MineSection>

	<MineSection title={hostT('about.section.storage')}>
		<MineRow
			title={hostT('about.storage.clear')}
			supporting={dataUsageSupporting}
			icon={DeleteSweepFill}
			iconTone="neutral"
			onclick={() => (clearDialogOpen = true)}
		/>
	</MineSection>

	<MineSection title={hostT('about.section.info')}>
		<MineRow label title={hostT('analytics.toggle')}>
			{#snippet trailing()}
				<Switch
					checked={analyticsChecked}
					disabled={savingAnalytics}
					ariaLabel={hostT('analytics.toggle')}
					onCheckedChange={toggleAnalytics}
				/>
			{/snippet}
		</MineRow>
		<MineRow title={hostT('about.legal.terms')} href={resolve('legal/terms')} />
		<MineRow title={hostT('about.legal.privacy')} href={resolve('legal/privacy')} />
		<MineRow title={hostT('about.legal.licenses')} href={resolve('open-source-licenses')} />
	</MineSection>

	<footer class="copyright">
		<p class="text-body-small text-supporting text-on-surface-variant">
			© {formatCopyrightYearRange()}
			{COPYRIGHT_HOLDER} ·
			<a href={resolve('open-source-licenses/project')} class="license-link">
				{PROJECT_LICENSE}
			</a>
		</p>
	</footer>
</div>

<BottomSheet
	bind:open={clearDialogOpen}
	showHandle={false}
	title={hostT('about.clear.title')}
	description={hostT('about.clear.desc')}
>
	{#snippet footer()}
		<Button variant="text" onclick={() => (clearDialogOpen = false)} disabled={clearing}>
			{hostT('common.cancel')}
		</Button>
		<Button
			variant="danger"
			disabled={clearing || appStartup.state.failure !== null}
			onclick={confirmClear}
		>
			{hostT('common.clear')}
		</Button>
	{/snippet}
</BottomSheet>

<style>
	.copyright {
		padding-top: 1.5rem;
		text-align: center;
	}

	.license-link {
		color: inherit;
		text-decoration: underline;
		text-underline-offset: 0.125rem;
	}

	@media (hover: hover) and (pointer: fine) {
		.license-link:hover {
			opacity: 0.8;
		}
	}
</style>
