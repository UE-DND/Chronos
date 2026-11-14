<script lang="ts">
	import { tick } from 'svelte';
	import SegmentedControl from '../../src/components/SegmentedControl.svelte';
	import SelectableOption from '../../src/form/SelectableOption.svelte';
	import RadioGroupField from '../../src/form/RadioGroupField.svelte';
	import { focusSegmentByKey } from '../../src/components/segmented-control';
	import CqutOnlineImportTab from '../../../plugins/source-cqut/src/CqutOnlineImportTab.svelte';
	import type { ImportTabComponentProps } from '../../src/plugin-screen/import-tab-props';

	let tab = $state('first');
	let option = $state('first');
	let selected = $state('first');
	let disabled = $state(false);
	let showDeferred = $state(true);
	let calls = $state(0);
	let groupOne = $state<string | number>('first');
	let groupTwo = $state<string | number>('first');
	let scrollTab = $state('first');
	let loginCalls = $state(0);
	let continued = $state(0);
	let finishLogin: ((success: boolean) => void) | undefined;
	let acceptSelection: (() => void) | undefined;
	const segments = [
		{ value: 'first', label: 'First' },
		{ value: 'second', label: 'Second' },
		{ value: 'third', label: 'Third' }
	];
	const cqutController = {
		translatePlugin: (_plugin: string, key: string) => key
	} as ImportTabComponentProps['controller'];
	const cqutContext = {
		actions: { notify() {} }
	} as unknown as ImportTabComponentProps['context'];
	const cqutTransfer: ImportTabComponentProps['transfer'] = {
		state: { errorMessage: null },
		previewWithSlot() {
			loginCalls++;
			return new Promise<boolean>((resolve) => {
				finishLogin = resolve;
			});
		}
	};

	function select(value: string) {
		calls++;
		acceptSelection = () => {
			selected = value;
		};
	}

	function attachControls() {
		window.__chronosSelectableQa = {
			async commit(success: boolean) {
				if (success) acceptSelection?.();
				acceptSelection = undefined;
				await tick();
			},
			async setDisabled(value: boolean) {
				disabled = value;
				await tick();
			},
			async hideSelection() {
				showDeferred = false;
				await tick();
			},
			async setTab(value: string) {
				tab = value;
				await tick();
			},
			finishLogin(success: boolean) {
				finishLogin?.(success);
			}
		};
	}
</script>

<main {@attach attachControls}>
	<button type="button">Before</button>
	<SegmentedControl
		ariaLabel="Views"
		{segments}
		value={tab}
		onValueChange={(value) => (tab = value)}
	/>
	<input aria-label="After" />
	<output data-testid="tab-value">{tab}</output>
	<div role="tablist" aria-label="Scrollable views">
		{#each [...segments, { value: 'fourth', label: 'Fourth' }] as segment, index (segment.value)}
			<button
				type="button"
				role="tab"
				aria-selected={scrollTab === segment.value}
				tabindex={scrollTab === segment.value ? 0 : -1}
				onclick={() => (scrollTab = segment.value)}
				onkeydown={(event) => {
					const next = focusSegmentByKey(event, index);
					if (next !== null) scrollTab = [...segments, { value: 'fourth' }][next]!.value;
				}}>{segment.label}</button
			>
		{/each}
	</div>
	<SegmentedControl
		{segments}
		semantics="options"
		ariaLabel="Scope"
		value={option}
		onValueChange={(value) => (option = value)}
	/>
	{#if showDeferred}
		<fieldset>
			<legend>Deferred selection</legend>
			{#each segments as segment (segment.value)}
				<SelectableOption
					name="deferred"
					label={segment.label}
					description={`${segment.label} description`}
					selected={selected === segment.value}
					{disabled}
					onclick={() => select(segment.value)}
				/>
			{/each}
		</fieldset>
	{/if}
	<output data-testid="selection-value">{selected}</output>
	<output data-testid="selection-calls">{calls}</output>
	<RadioGroupField
		label="Group one"
		options={segments}
		value={groupOne}
		onValueChange={(value) => (groupOne = value)}
	/>
	<RadioGroupField
		label="Group two"
		options={segments}
		value={groupTwo}
		onValueChange={(value) => (groupTwo = value)}
	/>
	<section aria-label="CQUT login">
		<CqutOnlineImportTab
			controller={cqutController}
			context={cqutContext}
			transfer={cqutTransfer}
			onContinue={() => continued++}
		/>
		<output data-testid="login-calls">{loginCalls}</output>
		<output data-testid="login-continued">{continued}</output>
	</section>
</main>
