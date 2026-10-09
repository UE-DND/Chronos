<script lang="ts">
	import { appRouteHref } from '#lib/navigation/routes.ts';
	import { beforeNavigate, afterNavigate, goto } from '$app/navigation';
	import { onMount, untrack } from 'svelte';
	import type { Component } from 'svelte';
	import { createAppShell } from '#lib/app/app-shell.svelte.ts';
	import { getTimetableScreen } from '#lib/timetable/timetable-screen.svelte.ts';
	import { createPlatformBootstrap } from '#lib/platform/platform-bootstrap.svelte.ts';
	import Snackbar from '#lib/components/ui/Snackbar.svelte';
	import { setContext } from 'svelte';
	import { page, updated } from '$app/state';
	import { checkAppUpdateOnResume } from '#lib/client/app-update-ux.svelte.ts';
	import { createShellTabController } from '#lib/shell/shell-tab.svelte.ts';
	import { getAppController, getAppEngine } from '#lib/services/app-engine.ts';
	import { onboardingController } from '#lib/client/onboarding.svelte.ts';
	import {
		updateTransitionDirection,
		setupSecondaryPageViewTransition,
		secondaryTransitionGate,
		configureNavigationCoordinator,
		stageShellTabDeparture,
		isShellRoute,
		isSecondaryRoute,
		canSystemBack,
		backTargetIsShell,
		edgeSwipeBackAction,
		navigateBackAndWait
	} from '#lib/navigation/index.ts';
	import { getHostPlatform } from '#lib/platform/host-platform.ts';
	import {
		onAfterNavigate,
		onBeforeNavigate,
		syncNavigationPage,
		getPendingTraversal
	} from '#lib/navigation/nav-coordinator.ts';
	import ShellRouteHost from '#lib/components/shell/ShellRouteHost.svelte';
	import { PREVIEW_PAINT_READY_CONTEXT, TIMETABLE_PRESENTATION_CONTEXT } from '@chronos/ui-kit';
	import { toStore } from 'svelte/store';
	import { locales, localizeHref } from '#lib/paraglide/runtime.js';
	import './layout.css';
	import favicon from '#lib/assets/favicon.svg';
	import { pwaInfo } from 'virtual:pwa-info';

	setupSecondaryPageViewTransition();

	$effect(() => {
		if (updated.current && getHostPlatform().getUpdateAction?.().mode === 'service-worker')
			untrack(() => void checkAppUpdateOnResume(true));
	});

	const webManifestLink = $derived(pwaInfo ? pwaInfo.webManifest.linkTag : '');
	const gate = secondaryTransitionGate;

	let { children } = $props();

	const shell = createAppShell();
	const timetableScreen = getTimetableScreen();
	const shellTab = createShellTabController(() => getAppController());
	const platform = createPlatformBootstrap({ shell, timetableScreen, shellTab });

	configureNavigationCoordinator({
		goto: (href, opts) => goto(href, opts),
		pushState: (url, state) => {
			void goto(url || page.url.href, { shallow: true, state });
		},
		replaceState: (url, state) => {
			void goto(url || page.url.href, { shallow: true, state, replace: true });
		},
		getPage: () => ({ url: new URL(page.url.href), state: page.state }),
		setActiveTab: (tabId) => {
			shellTab.setActiveTab(tabId);
			shellTab.reconcileActiveTab();
		},
		historyGo: (delta) => history.go(delta)
	});

	beforeNavigate((navigation) => {
		if (navigation.shallow && navigation.type === 'goto') return;

		const { from, to, type } = navigation;
		const delta = type === 'popstate' ? navigation.delta : undefined;
		const traversal = getPendingTraversal();
		const fromPath = traversal?.from ?? from?.url.pathname;
		const toPath = to?.url.pathname;
		if (!toPath) return;

		if (fromPath && isShellRoute(fromPath) && isSecondaryRoute(toPath)) {
			stageShellTabDeparture(shellTab.activeTabId);
		}

		updateTransitionDirection(
			fromPath,
			toPath,
			traversal ? 'popstate' : type,
			traversal?.delta ?? delta
		);
		onBeforeNavigate(navigation);
	});

	afterNavigate(({ type, shallow }) => {
		if (shallow && type === 'goto') return;

		// SvelteKit's initial enter callback runs before its public history API is ready.
		if (type === 'enter') queueMicrotask(onAfterNavigate);
		else onAfterNavigate();
	});

	$effect(() => {
		void page.state;
		void page.url;
		syncNavigationPage();
		getHostPlatform().updateBackState?.(canSystemBack());
	});

	const blockShell = $derived(onboardingController.isActive(page.url.pathname));
	const shouldLoadOnboarding = $derived(onboardingController.shouldRender(page.url.pathname));

	let InstallPrompt = $state<Component | null>(null);
	let OnboardingFlow = $state<Component | null>(null);

	setContext('appShell', shell);
	setContext('timetableScreen', timetableScreen);
	setContext('shellTab', shellTab);
	setContext(
		PREVIEW_PAINT_READY_CONTEXT,
		toStore(() => gate.previewPaintReady)
	);
	setContext(
		TIMETABLE_PRESENTATION_CONTEXT,
		toStore(() => ({
			displayedWeek: timetableScreen.state.displayedWeek,
			coursePalette: shell.appearance.coursePalette
		}))
	);

	$effect(() => {
		void getAppController().slotVersion;
		shellTab.reconcileActiveTab();
	});

	$effect(() => {
		if (!shouldLoadOnboarding || OnboardingFlow) return;
		void import('#lib/components/onboarding/OnboardingFlow.svelte').then((module) => {
			OnboardingFlow = module.default;
		});
	});

	onMount(() => {
		const disposePlatform = platform.init();
		void import('#lib/components/pwa/InstallPrompt.svelte').then((module) => {
			InstallPrompt = module.default;
		});
		return disposePlatform;
	});
</script>

<svelte:document
	onvisibilitychange={() => {
		if (document.visibilityState === 'visible') getAppEngine().refreshSystemTime();
	}}
></svelte:document>

<svelte:head>
	{@html webManifestLink}
	<link rel="icon" href={favicon} />
</svelte:head>

<div
	class="relative grid min-h-dvh w-full grid-cols-1 grid-rows-1 overflow-x-clip bg-canvas text-ink"
>
	<div
		class={[
			'shell-root col-start-1 row-start-1 h-dvh w-full bg-canvas text-ink',
			gate.isReceded && 'is-receded'
		]}
		class:invisible={blockShell}
		class:pointer-events-none={blockShell || gate.frozen}
		inert={gate.frozen}
	>
		<ShellRouteHost />
	</div>
	<div
		class="secondary-root col-start-1 row-start-1 h-dvh w-full"
		class:is-blocked={blockShell}
		class:invisible={blockShell}
		use:edgeSwipeBackAction={{
			canSwipeBack: () =>
				!getHostPlatform().isNative && isSecondaryRoute(page.url.pathname) && canSystemBack(),
			revealsShell: backTargetIsShell,
			onBack: () => navigateBackAndWait()
		}}
	>
		{@render children()}
	</div>
</div>

{#if InstallPrompt}
	<InstallPrompt />
{/if}
{#if OnboardingFlow}
	<OnboardingFlow />
{/if}
<Snackbar />

<div style="display:none">
	{#each locales as locale (locale)}
		<a href={appRouteHref(localizeHref(page.url.pathname, { locale }))}>{locale}</a>
	{/each}
</div>
