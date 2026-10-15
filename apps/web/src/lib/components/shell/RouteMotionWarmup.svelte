<script lang="ts">
	import { mount, onMount, unmount } from 'svelte';
	import { warmupRouteMotion } from '#lib/navigation/route-motion-warmup.ts';
	import { getHostPlatform } from '#lib/platform/host-platform.ts';
	import LoadingIndicator from '#lib/components/ui/LoadingIndicator.svelte';
	import RouteMotionWarmupContent from './RouteMotionWarmupContent.svelte';

	let { onready }: { onready: () => void } = $props();

	onMount(() => {
		const root = document.querySelector<HTMLElement>('.secondary-root');
		if (!root) {
			onready();
			return;
		}
		// Reuse the actual compositing container, including on a secondary deep link.
		const content = root.querySelector('.secondary-page')
			? null
			: mount(RouteMotionWarmupContent, { target: root });
		// A native splash can suspend WebView drawing. Hand off to the web cover first.
		window.__chronosHideBootFallback?.();
		getHostPlatform().hideBootSplash?.();
		const dispose = warmupRouteMotion(
			root,
			document.querySelector<HTMLElement>('.shell-root'),
			onready
		);
		return () => {
			dispose();
			if (content) void unmount(content);
		};
	});
</script>

<div class="route-warmup-cover fixed inset-0 z-[9998] flex items-center justify-center">
	<LoadingIndicator />
</div>

<style>
	.route-warmup-cover {
		/* Visually cover preparation without occluding its GPU drawing. */
		background: color-mix(in srgb, var(--color-canvas) 99.9%, transparent);
	}
</style>
