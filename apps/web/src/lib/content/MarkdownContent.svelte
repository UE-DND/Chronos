<script lang="ts">
	import { hostT } from '#lib/i18n/host-i18n.svelte.ts';
	import FetchErrorState from '#lib/components/ui/FetchErrorState.svelte';
	import LoadingIndicator from '#lib/components/ui/LoadingIndicator.svelte';
	import { parseMarkdown } from '#lib/content/markdown.ts';

	let { markdown, class: className = '' }: { markdown: string; class?: string } = $props();
	let status = $state<'loading' | 'ready' | 'error'>('loading');
	let attempt = $state(0);

	function renderMarkdown(node: HTMLDivElement) {
		const source = markdown;
		void attempt;
		let active = true;
		status = 'loading';
		node.replaceChildren();
		void parseMarkdown(source)
			.then((fragment) => {
				if (!active) return;
				node.replaceChildren(fragment);
				status = 'ready';
			})
			.catch((error) => {
				if (!active) return;
				console.error('[MarkdownContent] Failed to render document', error);
				status = 'error';
			});
		return () => {
			active = false;
			node.replaceChildren();
		};
	}
</script>

<div class={className} hidden={status !== 'ready'} {@attach renderMarkdown}></div>
{#if status === 'loading'}
	<div class="flex justify-center py-6">
		<LoadingIndicator />
	</div>
{:else if status === 'error'}
	<FetchErrorState description={hostT('content.markdown.failed')} onRetry={() => (attempt += 1)} />
{/if}
