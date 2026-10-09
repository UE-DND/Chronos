<script lang="ts">
	import { hostT } from '#lib/i18n/host-i18n.svelte.ts';
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';
	import { navigateBack } from '#lib/navigation/index.ts';
	import { resolve } from '$app/paths';
	import {
		ensureEngineFullyReady,
		getAppController,
		getAppEngine
	} from '#lib/services/app-engine.ts';
	import { ImportMode } from '#lib/domain/import-mode.ts';
	import { createTransferState } from '#lib/transfer/transfer-state.svelte.ts';
	import SecondaryPageShell from '#lib/components/SecondaryPageShell.svelte';
	import TransferImportConfirmScreen from '#lib/components/transfer/TransferImportConfirmScreen.svelte';
	import LoadingIndicator from '#lib/components/ui/LoadingIndicator.svelte';

	const engine = getAppEngine();
	const transfer = createTransferState(engine);
	const controller = getAppController();
	const currentTimetableName = $derived(controller.currentTimetable?.name ?? null);
	let ready = $state(false);

	onMount(async () => {
		await ensureEngineFullyReady();
		const loaded = transfer.loadPersistedPreview();
		if (!loaded) {
			navigateBack({ kind: 'route', href: '/transfer/import' });
			return;
		}
		if (!currentTimetableName && transfer.state.importMode === ImportMode.OVERWRITE_CURRENT) {
			transfer.setImportMode(ImportMode.AS_NEW);
		}
		ready = true;
	});

	function handleConfirmed() {
		goto(resolve(''));
	}
</script>

{#if ready}
	<SecondaryPageShell
		title={hostT('route.importConfirm')}
		backFallback={{ kind: 'route', href: '/transfer/import' }}
		flush
	>
		<TransferImportConfirmScreen {transfer} {currentTimetableName} onConfirm={handleConfirmed} />
	</SecondaryPageShell>
{:else}
	<div class="flex min-h-dvh items-center justify-center bg-canvas">
		<LoadingIndicator />
	</div>
{/if}
