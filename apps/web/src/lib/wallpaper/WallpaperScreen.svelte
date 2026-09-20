<script lang="ts">
	import { trackEvent } from '$lib/client/analytics';
	import type { ChronosUiController } from '@chronos/ui-kit';
	import {
		TimetableLivePreview,
		getEdgeBarActions,
		type EdgeBarAction,
		type EdgeBarActionsController
	} from '@chronos/ui-kit';
	import WallpaperCropEditor from './WallpaperCropEditor.svelte';
	import { hostT } from '$lib/i18n/host-i18n.svelte';
	import type { HostMessageKey } from '$lib/i18n/host-messages';

	import type { AppShellController } from '$lib/app/app-shell.svelte';
	let { shell }: { shell: AppShellController } = $props();
	const controller = $derived(shell.controller);
	const edgeActions = getEdgeBarActions();
	const wallpaperUri = $derived(shell.state.wallpaperUri);
	const hasWallpaper = $derived(Boolean(wallpaperUri));
	const hasCustom = $derived(shell.wallpaper.state.hasCustom);
	const timetable = $derived(controller.currentTimetable);
	function pt(key: string) {
		return hostT(`wallpaper.${key}` as HostMessageKey);
	}

	const previewEmpty = $derived(pt('screen.preview.empty'));
	const clearLabel = $derived(pt('screen.action.clear'));
	const pickLabel = $derived(pt(hasWallpaper ? 'screen.action.repick' : 'screen.action.pick'));

	let fileInput: HTMLInputElement | undefined = $state();
	let cropSource = $state<File | null>(null);
	const actions = $derived<EdgeBarAction[]>([
		...(hasCustom
			? [
					{
						id: 'clear',
						label: clearLabel,
						icon: 'delete',
						variant: 'outlined' as const,
						onClick: clearWallpaper
					}
				]
			: []),
		{
			id: 'pick',
			label: pickLabel,
			icon: 'wallpaper',
			onClick: onPickWallpaper
		}
	]);
	$effect(() => {
		if (cropSource) return;
		return edgeActions?.register('host-wallpaper', actions);
	});

	function onPickWallpaper() {
		fileInput?.click();
	}

	function onFileChange(event: Event) {
		const input = event.currentTarget as HTMLInputElement;
		const file = input.files?.[0];
		input.value = '';
		if (!file) return;
		trackEvent('wallpaper_pick');
		cropSource = file;
	}

	function onCropCancel() {
		trackEvent('wallpaper_crop_cancel');
		cropSource = null;
	}

	async function onCropConfirm(blob: Blob) {
		try {
			await shell.wallpaper.save(blob);
			await shell.updatePreferences({ wallpaperSource: 'custom' });
			trackEvent('wallpaper_crop_confirm');
			cropSource = null;
		} catch (error) {
			const msg =
				error instanceof DOMException && error.name === 'QuotaExceededError'
					? pt('screen.error.tooLarge')
					: pt('screen.error.importFailed');
			controller.notify(msg, 'error');
		}
	}

	async function clearWallpaper() {
		try {
			await shell.wallpaper.clear();
			trackEvent('wallpaper_clear');
		} catch {
			controller.notify(pt('screen.error.importFailed'), 'error');
		}
	}
</script>

<div class="flex h-full min-h-0 flex-1 flex-col overflow-hidden">
	<input
		bind:this={fileInput}
		type="file"
		accept="image/*"
		class="hidden"
		onchange={onFileChange}
	/>

	{#if cropSource}
		<WallpaperCropEditor
			{controller}
			{edgeActions}
			source={cropSource}
			onConfirm={onCropConfirm}
			onCancel={onCropCancel}
		/>
	{:else if hasWallpaper && timetable}
		<div class="relative flex min-h-0 flex-1 flex-col overflow-hidden">
			<TimetableLivePreview
				{controller}
				hasDynamicBackground={true}
				{wallpaperUri}
				coursePalette={shell.appearance.coursePalette}
				fit="cover"
				interactive={false}
			/>
		</div>
	{:else if wallpaperUri}
		<img src={wallpaperUri} alt="" class="min-h-0 flex-1 object-contain" />
	{:else}
		<div class="flex min-h-0 flex-1 items-center justify-center bg-canvas p-4">
			<p class="text-body-medium text-center text-on-surface-variant">{previewEmpty}</p>
		</div>
	{/if}

	{#if !cropSource}
		<div class="bottom-bar wallpaper-bottom-actions">
			<div class="mx-auto flex h-full w-full max-w-lg items-center gap-3">
				{#if hasCustom}
					<button type="button" class="ui-btn ui-btn-outlined flex-1" onclick={clearWallpaper}>
						{clearLabel}
					</button>
				{/if}
				<button type="button" class="ui-btn ui-btn-filled flex-1" onclick={onPickWallpaper}>
					{pickLabel}
				</button>
			</div>
		</div>
	{/if}
</div>
