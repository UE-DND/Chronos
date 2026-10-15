<script lang="ts">
	import { tick, getContext } from 'svelte';
	import { appStartup } from '#lib/boot/startup.svelte.ts';
	import { hostT } from '#lib/i18n/host-i18n.svelte.ts';
	import type { ShellTabController } from '#lib/shell/shell-tab.svelte.ts';
	import { navigateForward } from '#lib/navigation/nav-coordinator.ts';
	import { page } from '$app/state';
	import { isShellRoute } from '#lib/navigation/routes.ts';
	import Button from '#lib/components/ui/Button.svelte';
	import LoadingIndicator from '#lib/components/ui/LoadingIndicator.svelte';
	import RouteMotionWarmup from './RouteMotionWarmup.svelte';
	import { getHostPlatform } from '#lib/platform/host-platform.ts';
	import { isReducedMotionActive } from '#lib/navigation/route-motion-controller.svelte.ts';

	const shellTab = getContext<ShellTabController>('shellTab');
	let motionReady = $state(false);
	const platform = getHostPlatform();
	const needsMotionWarmup =
		platform.isNative && platform.platformType === 'android' && !isReducedMotionActive();
	const startupState = $derived(appStartup.state);
	const failed = $derived(startupState.core === 'failed' || startupState.plugins === 'failed');
	const showing = $derived(
		startupState.core === 'failed' ||
			(startupState.core === 'ready' &&
				startupState.plugins !== 'ready' &&
				(!startupState.timetableFallback || !isShellRoute(page.url.pathname)))
	);
	$effect(() => {
		if (startupState.core !== 'ready' && startupState.core !== 'failed') return;
		const display = showing ? (failed ? 'error' : 'loading') : 'content';
		if (display === 'content' && needsMotionWarmup && !motionReady) return;
		let alive = true;
		let frame = 0;
		void tick().then(() => {
			if (!alive) return;
			frame = requestAnimationFrame(() => {
				if (!alive) return;
				appStartup.markDisplayed(display);
				window.__chronosHideBootFallback?.();
				if (display !== 'loading') window.__chronosStartupDisplayReady = true;
			});
		});
		return () => {
			alive = false;
			cancelAnimationFrame(frame);
		};
	});
	function enterTimetable() {
		if (!appStartup.enterTimetable()) return;
		shellTab.init();
		shellTab.setActiveTab('timetable');
		void navigateForward('/', { replace: true });
	}
</script>

{#if startupState.core === 'ready' && !showing && needsMotionWarmup && !motionReady}
	<RouteMotionWarmup onready={() => (motionReady = true)} />
{/if}

{#if showing}
	<div
		class="fixed inset-0 z-[9998] flex min-h-dvh flex-col items-center justify-center gap-5 bg-canvas px-6 text-center text-ink"
		data-startup-state={failed ? 'failed' : 'loading'}
	>
		{#if failed}
			<h1 class="text-title-large">{hostT('startup.failed')}</h1>
			<p class="text-body-medium text-on-surface-variant" role="alert">
				{hostT(startupState.core === 'failed' ? 'startup.coreFailed' : 'startup.pluginsFailed')}
			</p>
			<Button onclick={() => window.location.reload()}>{hostT('startup.restart')}</Button>
			{#if startupState.core === 'ready'}
				<Button variant="outlined" onclick={enterTimetable}
					>{hostT('startup.enterTimetable')}</Button
				>
			{/if}
		{:else}
			<LoadingIndicator />
		{/if}
	</div>
{/if}
