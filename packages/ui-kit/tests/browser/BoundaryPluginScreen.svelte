<script lang="ts">
	import { getContext } from 'svelte';
	import { fromStore } from 'svelte/store';
	import BottomSheet from '../../src/overlay/BottomSheet.svelte';
	import type { PluginUiProps } from '../../src/plugin-screen/plugin-ui-props';
	let { controller, context, overlayParent, edgeActions }: PluginUiProps = $props();
	const ui = $derived(fromStore(controller.snapshot));
	const privateContext = getContext('chronos.test.private');
	const publicKeys = [
		'snapshot',
		'overlayHistoryPort',
		'currentTimetable',
		'timetables',
		'activeWeek',
		'currentPeriodIndex',
		'activeThemeId',
		'activeIconThemeId',
		'userPreferences',
		'locale',
		'now',
		'todayIso',
		'clockFrozen',
		'slotVersion',
		'courseBadges',
		'coursePaletteRevision',
		'calendarRevision',
		'resolveHolidays',
		'translatePlugin'
	];
	const boundary = $derived(
		Object.keys(controller).sort().join() === publicKeys.sort().join() &&
			privateContext === undefined &&
			Object.keys(overlayParent ?? {}).join() === 'attachChild' &&
			Object.keys(edgeActions ?? {}).join() === 'register'
	);
	let open = $state(true);
	let nestedOpen = $state(true);
	$effect(() =>
		edgeActions?.register([
			{ id: 'fixture-action', label: 'Fixture action', icon: 'check', onClick() {} }
		])
	);
	$effect(() => {
		if (ui.current.locale === 'failure') throw new Error('Intentional boundary plugin failure');
	});
</script>

<p data-testid="boundary">{boundary && Object.isFrozen(controller) ? 'isolated' : 'leaked'}</p>
<p data-testid="locale">{ui.current.locale}</p>
<p data-testid="owner">{context.pluginId}</p>
<p data-testid="sheet-status">{open ? 'open' : 'closed'}/{nestedOpen ? 'open' : 'closed'}</p>
<BottomSheet
	bind:open
	title="Plugin overlay"
	overlayId="plugin-overlay"
	historyPort={controller.overlayHistoryPort}
>
	<p>Plugin overlay content</p>
	<BottomSheet
		bind:open={nestedOpen}
		title="Nested plugin overlay"
		overlayId="nested-plugin-overlay"
		historyPort={controller.overlayHistoryPort}
	>
		<p>Nested overlay content</p>
	</BottomSheet>
</BottomSheet>
