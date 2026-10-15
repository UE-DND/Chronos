<script lang="ts">
	import TopAppBar from '#lib/components/TopAppBar.svelte';
	import { ArrowBack } from '#lib/icons/index.ts';
	import { hostT } from '#lib/i18n/host-i18n.svelte.ts';
	import Radio from '#lib/components/ui/Radio.svelte';
	import Switch from '#lib/components/ui/Switch.svelte';
	import MineSection from '#lib/components/mine/MineSection.svelte';
	import MineRow from '#lib/components/mine/MineRow.svelte';
</script>

<div class="pointer-events-none" inert aria-hidden="true">
	<div class="secondary-page relative flex h-dvh flex-col overflow-hidden bg-canvas text-ink">
		<TopAppBar title={hostT('route.displaySettings')}>
			{#snippet leading()}
				<span class="ui-icon-button inline-flex items-center justify-center rounded-control">
					<ArrowBack class="size-6 text-on-surface" />
				</span>
			{/snippet}
		</TopAppBar>
		<div class="mx-auto flex w-full max-w-lg flex-col gap-5 p-4">
			<MineSection title={hostT('display.font.title')}>
				<div class="min-w-0 px-4 pt-4 pb-5">
					<input
						type="range"
						min="0"
						max="3"
						step="1"
						value="1"
						class="block h-11 min-h-[44px] w-full accent-brand"
						aria-label={hostT('display.font.title')}
					/>
				</div>
			</MineSection>
			<MineSection title={hostT('display.section.layout')}>
				<MineRow
					label={true}
					title={hostT('display.layout.compact.label')}
					supporting={hostT('display.layout.compact.desc')}
				>
					{#snippet trailing()}
						<Radio checked={true} />
					{/snippet}
				</MineRow>
			</MineSection>
			<MineSection>
				<MineRow label={true} title={hostT('display.periodHighlight.label')}>
					{#snippet trailing()}
						<Switch checked={true} />
					{/snippet}
				</MineRow>
			</MineSection>
		</div>
	</div>
</div>
