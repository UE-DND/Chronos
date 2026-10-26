<script lang="ts">
	import { appStartup } from '#lib/boot/startup.svelte.ts';
	import type { AppLocale } from '@chronos/core';
	import { getAppUpdateState } from '#lib/client/app-update-ux.svelte.ts';
	import { hostT } from '#lib/i18n/host-i18n.svelte.ts';
	import type { HostMessageKey } from '#lib/i18n/host-messages.ts';
	import { appLocaleToBcp47 } from '#lib/i18n/locale-sync.ts';
	import { onMount } from 'svelte';
	import { resolve } from '$app/paths';
	import { type SoftwareUpdateStateController } from '#lib/content/releases/update-state.svelte.ts';
	import { parseMarkdown } from '#lib/content/markdown.ts';
	import { formatPublishedDate } from '#lib/content/releases/release-display.ts';
	import { SOURCE_CODE_URL } from '#lib/config/app-meta.ts';
	import { copyTextWithFallback } from '#lib/platform/transfer.ts';
	import { getAppController } from '#lib/services/app-engine.ts';

	import AppHero from '#lib/components/AppHero.svelte';
	import Button from '#lib/components/ui/Button.svelte';
	import Card from '#lib/components/ui/Card.svelte';
	import LoadingIndicator from '#lib/components/ui/LoadingIndicator.svelte';
	import HighlightRow from '#lib/components/ui/HighlightRow.svelte';
	import HighlightRowList from '#lib/components/ui/HighlightRowList.svelte';
	import MineSection from '#lib/components/mine/MineSection.svelte';
	import MineRow from '#lib/components/mine/MineRow.svelte';
	import UpdateInstallProgress from '#lib/components/about/UpdateInstallProgress.svelte';
	import {
		CalendarMonthFill,
		CheckCircleFill,
		CodeFill,
		ContentCopy,
		DownloadFill,
		History,
		InfoFill,
		OpenInNewFill,
		Refresh,
		Update
	} from '#lib/icons/index.ts';

	let {
		updateState = getAppUpdateState()
	}: {
		updateState?: SoftwareUpdateStateController;
	} = $props();

	const controller = getAppController();
	const activeLocale = $derived(appLocaleToBcp47(controller.locale as AppLocale));
	const androidUpdateUrl = $derived(updateState.state.latestRelease?.platforms?.android?.updateUrl);
	const iosPackageUrl = $derived(
		updateState.state.latestRelease?.iosUpdate?.ipaUrl ??
			updateState.state.latestRelease?.platforms?.ios?.updateUrl
	);
	const updateMode = $derived(updateState.updateAction?.mode);
	const iosShareAgain = $derived(
		updateState.state.packageShared ||
			updateState.state.errorMessage === 'about.update.ios.error.share_canceled'
	);

	onMount(() => {
		void updateState.checkUpdate();
		let active = true;
		let dispose = () => {};
		void updateState
			.observeNativeUpdate()
			.then((cleanup) => {
				if (active) dispose = cleanup;
				else cleanup();
			})
			.catch(() => {});
		return () => {
			active = false;
			dispose();
		};
	});

	let htmlBody = $state('');

	$effect(() => {
		const body = updateState.state.latestRelease?.body;
		if (!body) {
			htmlBody = '';
			return;
		}
		void parseMarkdown(body).then((html) => {
			htmlBody = html;
		});
	});

	const heroSubtitle = $derived(
		updateState.state.hasUpdate
			? updateMode === 'external-ipa'
				? hostT('about.update.ios.subtitle')
				: updateState.state.hasNewerVersion
					? hostT('about.update.subtitle.new')
					: hostT('about.update.subtitle.swOnly')
			: ''
	);

	let copyFailed = $state(false);

	async function copyIosPackageUrl(): Promise<void> {
		if (!iosPackageUrl) return;
		copyFailed = !(await copyTextWithFallback(iosPackageUrl));
	}

	function formatCheckTime(date: Date | null): string {
		if (!date) return '-';
		return date.toLocaleTimeString(activeLocale, {
			hour: '2-digit',
			minute: '2-digit',
			second: '2-digit'
		});
	}

	function formatErrorMessage(message: string | null): string {
		if (!message) return '';
		return message.startsWith('about.') ? hostT(message as HostMessageKey) : message;
	}
</script>

<div class="flex flex-col gap-6 py-2">
	<AppHero subtitle={heroSubtitle} />

	{#if updateState.state.checking}
		<Card
			variant="elevated"
			class="flex flex-col items-center justify-center gap-3 py-10 text-center"
		>
			<LoadingIndicator />
			<p class="text-body-medium text-on-surface-variant">
				{hostT('about.update.checking')}
			</p>
		</Card>
	{:else if updateState.state.hasUpdate}
		<div class="flex flex-col gap-4">
			<HighlightRowList>
				{#if updateState.state.latestRelease && updateState.state.hasNewerVersion}
					<HighlightRow
						icon={Update}
						title={hostT('about.update.latest')}
						subtitle={updateState.state.latestRelease.name ||
							updateState.state.latestRelease.tagName}
					/>
					<HighlightRow
						icon={CalendarMonthFill}
						title={hostT('about.update.published')}
						subtitle={formatPublishedDate(updateState.state.latestRelease.publishedAt)}
					/>
				{/if}
				<HighlightRow
					icon={InfoFill}
					title={hostT('about.version.current')}
					subtitle={`v${updateState.state.currentVersion}`}
				/>
			</HighlightRowList>

			{#if htmlBody && updateState.state.hasNewerVersion}
				<MineSection title={hostT('about.update.changelog')} comfortable>
					<div
						class="markdown-prose markdown-prose--release prose prose-sm max-w-none dark:prose-invert"
					>
						{@html htmlBody}
					</div>
				</MineSection>
			{/if}

			<div class="pt-2">
				{#if updateState.state.updating}
					<UpdateInstallProgress
						phase={updateState.state.installPhase ?? 'downloading'}
						percent={updateState.state.installPercent}
					/>
					{#if updateMode === 'native-apk' && (updateState.state.installPhase === 'awaiting-permission' || updateState.state.installPhase === 'awaiting-confirmation')}
						<Button
							variant="filled"
							class="mt-3 w-full"
							onclick={() => void updateState.continueNativeUpdate()}
						>
							{hostT('about.update.android.continue')}
						</Button>
					{/if}
					{#if updateMode === 'native-apk' && updateState.state.nativeState?.canCancel}
						<Button
							variant="outlined"
							class="mt-3 w-full"
							onclick={() => void updateState.cancelNativeUpdate()}
						>
							{hostT('about.update.android.cancel')}
						</Button>
					{/if}
					{#if updateMode === 'external-ipa' && (updateState.state.installPhase === 'downloading' || updateState.state.installPhase === 'verifying')}
						<Button
							variant="outlined"
							class="mt-3 w-full"
							onclick={() => void updateState.cancelNativeUpdate()}
						>
							{hostT('about.update.ios.cancel')}
						</Button>
					{/if}
				{:else}
					{#if updateState.state.errorMessage}
						<p class="text-body-medium mb-2 text-danger">
							{formatErrorMessage(updateState.state.errorMessage)}
						</p>
					{/if}
					{#if updateMode === 'external-ipa' && !iosPackageUrl}
						<p class="text-body-small text-supporting text-on-surface-variant">
							{hostT('about.update.ios.unavailable')}
						</p>
					{:else if updateMode === 'external-link' && !androidUpdateUrl}
						<p class="text-body-small text-supporting text-on-surface-variant">
							{hostT('about.update.unavailable')}
						</p>
					{:else}
						{#if updateMode === 'external-ipa' && updateState.state.packageShared}
							<p class="text-body-small text-supporting mb-3 text-on-surface-variant">
								{hostT('about.update.ios.saved')}
							</p>
						{/if}
						<Button
							variant="filled"
							class="w-full"
							disabled={updateState.state.updating || appStartup.state.failure !== null}
							onclick={() => void updateState.installUpdate()}
						>
							{#if updateMode === 'external-link'}
								<OpenInNewFill class="size-5" />
							{:else}
								<DownloadFill class="size-5" />
							{/if}
							{hostT(
								(updateMode === 'external-ipa' && iosShareAgain
									? 'about.update.ios.shareAgain'
									: (updateState.updateAction?.actionLabelKey ??
										'about.update.install')) as HostMessageKey
							)}
						</Button>
						{#if updateMode === 'external-ipa' && iosPackageUrl}
							{#if copyFailed}
								<p class="text-body-small mt-3 text-danger">
									{hostT('about.update.ios.copyFailed')}
								</p>
							{/if}
							<Button
								variant="outlined"
								class="mt-3 w-full"
								onclick={() => void copyIosPackageUrl()}
							>
								<ContentCopy class="size-5" />
								{hostT('about.update.ios.copy')}
							</Button>
						{/if}
					{/if}
				{/if}
			</div>
		</div>
	{:else if updateState.state.errorMessage === 'about.update.ios.bundleMismatch'}
		<Card variant="elevated" class="flex flex-col items-center gap-3 py-8 text-center">
			<InfoFill class="h-8 w-8 text-on-surface-variant" />
			<p class="text-body-medium text-on-surface">
				{hostT('about.update.ios.bundleMismatch')}
			</p>
		</Card>
	{:else if updateState.state.errorMessage}
		<Card variant="elevated" class="flex flex-col items-center gap-3 py-8 text-center">
			<InfoFill class="h-8 w-8 text-on-surface-variant" />
			<p class="text-body-medium text-danger">
				{formatErrorMessage(updateState.state.errorMessage)}
			</p>
			<Button variant="filled" onclick={() => void updateState.checkUpdate()} class="mt-2">
				<Refresh class="size-4" />
				{hostT('about.update.retry')}
			</Button>
		</Card>
	{:else}
		<Card variant="elevated" class="flex flex-col items-center gap-3 py-8 text-center">
			<CheckCircleFill class="h-10 w-10 text-primary" />
			<div>
				<h3 class="text-title-medium text-on-surface">
					{hostT('about.update.upToDate.title')}
				</h3>
				<p class="text-body-small text-supporting mt-1 text-on-surface-variant">
					{hostT('about.update.upToDate.lastChecked', {
						time: formatCheckTime(updateState.state.lastChecked)
					})}
				</p>
			</div>
			<Button variant="outlined" onclick={() => void updateState.checkUpdate()} class="mt-2">
				<Refresh class="size-4" />
				{hostT('about.update.recheck')}
			</Button>
		</Card>
	{/if}

	<MineSection title={hostT('about.update.more.heading')}>
		<MineRow
			title={hostT('about.update.more.history')}
			href={resolve('about/releases')}
			icon={History}
			iconTone="primary"
		/>
		<MineRow
			title={hostT('about.update.more.repo')}
			supporting="UE-DND/Chronos"
			href={SOURCE_CODE_URL}
			target="_blank"
			rel="noreferrer"
			icon={CodeFill}
			iconTone="neutral"
		>
			{#snippet trailing()}
				<OpenInNewFill class="text-on-surface-variant" style="width:1.125rem;height:1.125rem" />
			{/snippet}
		</MineRow>
	</MineSection>
</div>
