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

	const shellTab = getContext<ShellTabController>('shellTab');
	const state = $derived(appStartup.state);
	const failed = $derived(state.core === 'failed' || state.plugins === 'failed');
	const showing = $derived(
		state.core === 'failed' ||
			(state.core === 'ready' &&
				state.plugins !== 'ready' &&
				(!state.timetableFallback || !isShellRoute(page.url.pathname)))
	);
	$effect(() => {
		if (state.core !== 'ready' && state.core !== 'failed') return;
		const display = showing ? (failed ? 'error' : 'loading') : 'content';
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

{#if showing}
	<div
		class="fixed inset-0 z-[9998] flex min-h-dvh flex-col items-center justify-center gap-5 bg-canvas px-6 text-center text-ink"
		data-startup-state={failed ? 'failed' : 'loading'}
	>
		{#if failed}
			<h1 class="text-title-large">{hostT('startup.failed')}</h1>
			<p class="text-body-medium text-on-surface-variant" role="alert">
				{hostT(state.core === 'failed' ? 'startup.coreFailed' : 'startup.pluginsFailed')}
			</p>
			<Button onclick={() => window.location.reload()}>{hostT('startup.restart')}</Button>
			{#if state.core === 'ready'}
				<Button variant="outlined" onclick={enterTimetable}
					>{hostT('startup.enterTimetable')}</Button
				>
			{/if}
		{:else}
			<LoadingIndicator />
		{/if}
	</div>
{/if}
