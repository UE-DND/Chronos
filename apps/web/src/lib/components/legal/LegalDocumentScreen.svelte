<script lang="ts">
	import { hostT } from '#lib/i18n/host-i18n.svelte.ts';
	import { onMount } from 'svelte';
	import type { BackFallback } from '#lib/navigation/index.ts';
	import { staticPath } from '#lib/config/static-path.ts';
	import MarkdownContent from '#lib/content/MarkdownContent.svelte';
	import { connectivity } from '#lib/platform/connectivity.svelte.ts';
	import { resolveFetchErrorMessage } from '#lib/client/fetch-error-message.ts';

	import SecondaryPageShell from '#lib/components/SecondaryPageShell.svelte';
	import FetchErrorState from '#lib/components/ui/FetchErrorState.svelte';
	import LoadingIndicator from '#lib/components/ui/LoadingIndicator.svelte';

	let {
		title,
		backFallback,
		documentPath
	}: {
		title: string;
		backFallback: BackFallback;
		documentPath: string;
	} = $props();

	type LoadState = 'loading' | 'ready' | 'error';

	let loadState = $state<LoadState>('loading');
	let markdownContent = $state('');
	let errorMessage = $state('');
	let request: AbortController | null = null;

	async function loadDocument() {
		request?.abort();
		const controller = new AbortController();
		request = controller;
		loadState = 'loading';
		errorMessage = '';

		try {
			const response = await fetch(staticPath(documentPath), { signal: controller.signal });
			if (controller.signal.aborted) return;
			if (!response.ok) {
				errorMessage = resolveFetchErrorMessage(!connectivity.isOnline, hostT('legal.loadFailed'));
				loadState = 'error';
				return;
			}

			const markdown = await response.text();
			if (controller.signal.aborted) return;
			markdownContent = markdown;
			loadState = 'ready';
		} catch {
			if (controller.signal.aborted) return;
			errorMessage = resolveFetchErrorMessage(!connectivity.isOnline, hostT('legal.loadFailed'));
			loadState = 'error';
		}
	}

	onMount(() => {
		void loadDocument();
		return () => request?.abort();
	});
</script>

<SecondaryPageShell {title} {backFallback}>
	{#if loadState === 'loading'}
		<div class="flex items-center justify-center py-12">
			<LoadingIndicator />
		</div>
	{:else if loadState === 'error'}
		<FetchErrorState
			offline={!connectivity.isOnline}
			description={errorMessage}
			onRetry={loadDocument}
		/>
	{:else}
		<MarkdownContent
			markdown={markdownContent}
			class="markdown-prose prose prose-sm max-w-none px-4 py-2 dark:prose-invert"
		/>
	{/if}
</SecondaryPageShell>
