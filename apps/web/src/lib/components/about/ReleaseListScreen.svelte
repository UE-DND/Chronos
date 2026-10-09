<script lang="ts">
	import { hostT } from '#lib/i18n/host-i18n.svelte.ts';
	import { onMount } from 'svelte';
	import { resolve } from '$app/paths';
	import { formatPublishedDate } from '#lib/content/releases/release-display.ts';
	import {
		createReleaseListState,
		type ReleaseListStateController
	} from '#lib/content/releases/catalog-state.svelte.ts';
	import { getAppController } from '#lib/services/app-engine.ts';

	import LoadingIndicator from '#lib/components/ui/LoadingIndicator.svelte';
	import Card from '#lib/components/ui/Card.svelte';
	import MineSection from '#lib/components/mine/MineSection.svelte';
	import MineRow from '#lib/components/mine/MineRow.svelte';
	import { InfoFill } from '#lib/icons/index.ts';

	let { listState = createReleaseListState() }: { listState?: ReleaseListStateController } =
		$props();

	const controller = getAppController();

	onMount(() => {
		void listState.load();
	});
</script>

{#if listState.state.loading}
	<div class="flex min-h-[300px] items-center justify-center py-12">
		<LoadingIndicator />
	</div>
{:else if listState.state.releases.length > 0}
	<MineSection title={hostT('about.release.list.heading')}>
		{#each listState.state.releases as release (release.tagName)}
			<MineRow
				title={release.name || release.tagName}
				supporting={formatPublishedDate(release.publishedAt)}
				href={resolve('/(secondary)/about/releases/[tag]', { tag: release.tagName })}
			/>
		{/each}
	</MineSection>
{:else}
	<Card variant="filled" class="flex flex-col items-center gap-3 py-8 text-center">
		<InfoFill class="h-8 w-8 text-on-surface-variant" />
		<p class="text-body-medium text-danger">
			{listState.state.errorMessage ?? hostT('about.release.list.empty')}
		</p>
	</Card>
{/if}
