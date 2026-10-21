<script lang="ts">
	import { Checkbox } from 'bits-ui';
	import { hostT } from '#lib/i18n/host-i18n.svelte.ts';
	import { fade } from 'svelte/transition';
	import { getContext } from 'svelte';
	import { goto } from '$app/navigation';
	import { page } from '$app/state';
	import { resolve } from '$app/paths';
	import type { AppShellController } from '#lib/app/app-shell.svelte.ts';
	import { trackEvent } from '#lib/client/analytics.ts';
	import {
		hasSeenOnboarding,
		onboardingController,
		ONBOARDING_STEPS
	} from '#lib/client/onboarding.svelte.ts';
	import type { TimetableLayoutMode } from '@chronos/core';
	import Button from '#lib/components/ui/Button.svelte';
	import MineRow from '#lib/components/mine/MineRow.svelte';
	import MineSection from '#lib/components/mine/MineSection.svelte';
	import AppHero from '#lib/components/AppHero.svelte';
	import HighlightRowList from '#lib/components/ui/HighlightRowList.svelte';
	import HighlightRow from '#lib/components/ui/HighlightRow.svelte';
	import InstallGuideCard from '#lib/components/pwa/InstallGuideCard.svelte';
	import LongPressDemo from './LongPressDemo.svelte';
	import LayoutModePreview from './LayoutModePreview.svelte';
	import {
		Check,
		CheckCircleFill,
		DownloadFill,
		GavelFill,
		RocketLaunchFill,
		ShieldFill,
		WifiOffFill
	} from '#lib/icons/index.ts';
	import { isReducedMotionActive } from '@chronos/ui-kit';
	import { haptic } from '#lib/haptic/haptic.ts';
	import Switch from '#lib/components/ui/Switch.svelte';

	const shell = getContext<AppShellController>('appShell');
	const onboardingState = $derived(onboardingController.state);
	const step = $derived(onboardingState.currentStepId);
	const stepIndex = $derived(onboardingState.stepIndex);
	const showOnboarding = $derived(onboardingController.isActive(page.url.pathname));
	const shouldRenderOnboarding = $derived(onboardingController.shouldRender(page.url.pathname));
	const isLastStep = $derived(onboardingState.isLastStep);
	const stepTitleId = 'onboarding-step-title';
	const layoutMode = $derived(shell.state.effectiveTimetableLayoutMode);
	const compactLandscape = $derived(shell.state.compactLandscape);
	let dialogNode = $state<HTMLElement | null>(null);
	let analyticsEnabled = $state(shell.controller.userPreferences?.analyticsEnabled ?? true);
	let legalAccepted = $state(false);

	const layoutOptions = $derived.by(() => {
		return [
			{
				mode: 'compact' as const,
				label: hostT('onboarding.layout.compact.label'),
				description: hostT('onboarding.layout.compact.desc')
			},
			{
				mode: 'fixed' as const,
				label: hostT('onboarding.layout.fixed.label'),
				description: hostT('onboarding.layout.fixed.desc')
			}
		] as const;
	});

	$effect(() => {
		if (!showOnboarding) return;
		const prevOverflow = document.body.style.overflow;
		document.body.style.overflow = 'hidden';
		return () => {
			document.body.style.overflow = prevOverflow;
		};
	});

	$effect(() => {
		if (!showOnboarding || !dialogNode) return;
		queueMicrotask(() => {
			if (showOnboarding && dialogNode && !dialogNode.contains(document.activeElement)) {
				dialogNode.focus();
			}
		});
	});

	function dialogAttach(node: HTMLElement) {
		const selector = 'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])';
		const getFocusable = () =>
			[...node.querySelectorAll<HTMLElement>(selector)].filter(
				(el) => !el.hasAttribute('disabled')
			);

		function onKeydown(event: KeyboardEvent) {
			if (event.key === 'Escape') {
				event.preventDefault();
				return;
			}
			if (event.key !== 'Tab') return;
			const elements = getFocusable();
			if (elements.length === 0) return;
			const first = elements[0];
			const last = elements[elements.length - 1];
			const active = document.activeElement;
			if (event.shiftKey && (active === first || active === node)) {
				event.preventDefault();
				last.focus();
			} else if (!event.shiftKey && active === last) {
				event.preventDefault();
				first.focus();
			}
		}

		node.addEventListener('keydown', onKeydown);
		return () => node.removeEventListener('keydown', onKeydown);
	}

	const stepTransitionDuration = $derived(isReducedMotionActive() ? 1 : 200);

	function handleNext() {
		if (step === 'legal') {
			if (!legalAccepted) return;
			trackEvent('onboarding_legal_continue');
		} else {
			trackEvent('onboarding_step_next', { step: stepIndex });
		}
		haptic.light();
		onboardingController.next();
	}

	function handleBack() {
		trackEvent('onboarding_step_back', { step: stepIndex });
		haptic.light();
		onboardingController.back();
	}

	async function completeOnboarding(): Promise<boolean> {
		if (!hasSeenOnboarding()) {
			try {
				await shell.setAnalyticsEnabled(analyticsEnabled);
			} catch {
				shell.controller.notify(hostT('about.analytics.saveFailed'), 'error');
				return false;
			}
		}
		onboardingController.finish();
		return true;
	}

	async function handleStartImport() {
		if (!(await completeOnboarding())) return;
		trackEvent('onboarding_start_import');
		void goto(resolve('transfer/import'));
	}

	async function handleFinish() {
		haptic.light();
		await completeOnboarding();
	}

	async function selectLayoutMode(mode: TimetableLayoutMode) {
		if (layoutMode === mode || (compactLandscape && mode === 'compact')) return;
		trackEvent('onboarding_layout_selected', { mode });
		haptic.light();
		await shell.setTimetableLayoutMode(mode);
	}

	function openLegalDocument(href: string) {
		haptic.light();
		void goto(href);
	}
</script>

{#if shouldRenderOnboarding}
	<div
		bind:this={dialogNode}
		class="fixed inset-0 z-[var(--z-onboarding)] flex flex-col bg-canvas text-ink outline-none"
		class:invisible={!showOnboarding}
		class:pointer-events-none={!showOnboarding}
		role="dialog"
		aria-modal="true"
		aria-labelledby={stepTitleId}
		aria-hidden={!showOnboarding}
		inert={!showOnboarding || undefined}
		tabindex="-1"
		{@attach dialogAttach}
	>
		<div class="mx-auto flex min-h-0 w-full max-w-lg flex-1 flex-col">
			<div class="w-full shrink-0" style:padding-top="calc(var(--topbar-safe) + 0.75rem)"></div>

			<div
				class="app-scroll-y native-overscroll-y grid min-h-0 flex-1 grid-cols-1 overflow-x-clip overflow-y-auto px-6 py-4"
			>
				{#key step}
					<div
						class="col-start-1 row-start-1 flex h-full min-h-full flex-col"
						in:fade={{ duration: stepTransitionDuration, delay: stepTransitionDuration }}
						out:fade={{ duration: stepTransitionDuration }}
					>
						{#if step === 'welcome'}
							<div class="flex flex-1 flex-col items-center justify-center gap-4 text-center">
								<AppHero
									title={hostT('onboarding.welcome.title')}
									subtitle={hostT('onboarding.welcome.subtitle')}
									titleId={stepTitleId}
								/>
							</div>
						{:else if step === 'legal'}
							<div class="flex flex-1 flex-col justify-center gap-4">
								<h2
									id={stepTitleId}
									class="text-headline-small text-center font-semibold text-on-surface"
								>
									{hostT('onboarding.legal.title')}
								</h2>
								<p class="text-body-small text-supporting text-center text-on-surface-variant">
									{hostT('onboarding.legal.subtitle')}
								</p>
								<MineSection>
									<MineRow
										title={hostT('about.legal.terms')}
										supporting={hostT('onboarding.legal.terms.desc')}
										icon={GavelFill}
										iconTone="primary"
										onclick={() => openLegalDocument(resolve('legal/terms'))}
									/>
									<MineRow
										title={hostT('about.legal.privacy')}
										supporting={hostT('onboarding.legal.privacy.desc')}
										icon={ShieldFill}
										iconTone="primary"
										onclick={() => openLegalDocument(resolve('legal/privacy'))}
									/>
								</MineSection>
								{#if !hasSeenOnboarding()}
									<MineSection>
										<MineRow
											label
											title={hostT('analytics.toggle')}
											supporting={hostT('analytics.description')}
										>
											{#snippet trailing()}
												<Switch
													checked={analyticsEnabled}
													ariaLabel={hostT('analytics.toggle')}
													onCheckedChange={(checked) => (analyticsEnabled = checked)}
												/>
											{/snippet}
										</MineRow>
									</MineSection>
								{/if}
								<Checkbox.Root
									checked={legalAccepted}
									onCheckedChange={(checked) => (legalAccepted = checked)}
									aria-label={hostT('onboarding.legal.agreement')}
									class="text-body-medium ui-row-state flex w-full cursor-pointer items-center gap-4 border-none bg-transparent px-4 py-3 text-left text-on-surface transition-colors focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-primary"
								>
									<span
										class={[
											'flex size-5 shrink-0 items-center justify-center rounded-sm border transition-colors',
											legalAccepted
												? 'border-brand bg-brand text-on-primary'
												: 'border-outline text-transparent'
										]}
										aria-hidden="true"
									>
										{#if legalAccepted}<Check class="size-4" />{/if}
									</span>
									<span>{hostT('onboarding.legal.agreement')}</span>
								</Checkbox.Root>
								<p class="text-body-small text-supporting text-center text-on-surface-variant">
									{hostT('legal.zhOnlyNotice')}
								</p>
							</div>
						{:else if step === 'highlights'}
							<div class="flex flex-1 flex-col items-center justify-center gap-6">
								<h2
									id={stepTitleId}
									class="text-headline-small text-center font-semibold text-on-surface"
								>
									{hostT('onboarding.highlights.title')}
								</h2>
								<HighlightRowList>
									<HighlightRow
										icon={RocketLaunchFill}
										title={hostT('onboarding.highlights.plugins.title')}
										subtitle={hostT('onboarding.highlights.plugins.subtitle')}
									/>
									<HighlightRow
										icon={WifiOffFill}
										title={hostT('onboarding.highlights.offline.title')}
										subtitle={hostT('onboarding.highlights.offline.subtitle')}
									/>
									<HighlightRow
										icon={CheckCircleFill}
										title={hostT('onboarding.highlights.lightweight.title')}
										subtitle={hostT('onboarding.highlights.lightweight.subtitle')}
									/>
								</HighlightRowList>
							</div>
						{:else if step === 'install'}
							<div class="flex flex-1 flex-col justify-center gap-4">
								<h2
									id={stepTitleId}
									class="text-headline-small text-center font-semibold text-on-surface"
								>
									{hostT('onboarding.install.title')}
								</h2>
								<p class="text-body-small text-supporting text-center text-on-surface-variant">
									{hostT('onboarding.install.subtitle')}
								</p>
								<InstallGuideCard inOnboarding />
							</div>
						{:else if step === 'layout'}
							<div class="flex flex-1 flex-col justify-center gap-4">
								<h2
									id={stepTitleId}
									class="text-headline-small text-center font-semibold text-on-surface"
								>
									{hostT('onboarding.layout.title')}
								</h2>
								<p class="text-body-small text-supporting text-center text-on-surface-variant">
									{hostT('onboarding.layout.hint')}
								</p>
								<div class="grid grid-cols-2 gap-3" role="radiogroup" aria-labelledby={stepTitleId}>
									{#each layoutOptions as option (option.mode)}
										{@const selected = layoutMode === option.mode}
										{@const unavailable = compactLandscape && option.mode === 'compact'}
										<label
											class="flex min-w-0 flex-col items-center text-center {unavailable
												? 'cursor-not-allowed opacity-50'
												: 'cursor-pointer'}"
										>
											<input
												type="radio"
												name="onboarding-layout-mode"
												value={option.mode}
												checked={selected}
												disabled={unavailable}
												onchange={() => void selectLayoutMode(option.mode)}
												aria-label={option.label}
												aria-describedby="onboarding-layout-{option.mode}-desc"
												class="peer sr-only"
											/>
											<span
												class="block w-full rounded-2xl border-[3px] p-1 shadow-raised transition-colors peer-focus-visible:ring-2 peer-focus-visible:ring-brand {selected
													? 'border-brand'
													: 'border-transparent'}"
											>
												<LayoutModePreview
													mode={option.mode}
													active={showOnboarding && step === 'layout'}
												/>
											</span>
											<span
												class="text-title-medium mt-2 font-semibold {selected
													? 'text-on-surface'
													: 'text-on-surface-variant'}">{option.label}</span
											>
											<span id="onboarding-layout-{option.mode}-desc" class="sr-only">
												{unavailable
													? hostT('onboarding.layout.compact.landscapeUnavailable')
													: option.description}
											</span>
										</label>
									{/each}
								</div>
								<p class="text-body-small text-supporting text-center text-on-surface-variant">
									{layoutOptions.find((option) => option.mode === layoutMode)?.description}
								</p>
								{#if compactLandscape}
									<p class="text-body-small text-supporting text-center text-on-surface-variant">
										{hostT('onboarding.layout.compact.landscapeUnavailable')}
									</p>
								{/if}
							</div>
						{:else if step === 'longPress'}
							<div class="flex flex-1 flex-col items-center justify-center gap-5">
								<h2
									id={stepTitleId}
									class="text-headline-small text-center font-semibold text-on-surface"
								>
									{hostT('onboarding.longPress.title')}
								</h2>
								<LongPressDemo active={showOnboarding && step === 'longPress'} />
							</div>
						{:else}
							<div class="flex flex-1 flex-col items-center justify-center gap-3 text-center">
								<div
									class="flex h-16 w-16 items-center justify-center rounded-2xl bg-brand/10 text-brand"
								>
									<DownloadFill class="h-8 w-8" />
								</div>
								<h2 id={stepTitleId} class="text-headline-small font-semibold text-on-surface">
									{hostT('onboarding.done.title')}
								</h2>
								<p class="text-body-medium text-on-surface-variant">
									{hostT('onboarding.done.subtitle')}
								</p>
							</div>
						{/if}
					</div>
				{/key}
			</div>

			<div
				class="flex flex-col gap-4 px-6 pt-2"
				style:padding-bottom="calc(var(--tabbar-block-safe) + 1.25rem)"
			>
				<ol
					class="flex list-none justify-center gap-1.5"
					aria-label={hostT('onboarding.steps.aria')}
				>
					{#each ONBOARDING_STEPS as stepId, index (stepId)}
						<li
							class="h-1.5 w-6 rounded-full transition-colors {index <= stepIndex
								? 'bg-brand'
								: 'bg-outline-variant'}"
							aria-current={stepId === step ? 'step' : undefined}
							aria-label={hostT('onboarding.steps.label', {
								current: index + 1,
								total: onboardingState.stepCount
							})}
						></li>
					{/each}
				</ol>
				<div class="flex gap-3">
					{#if !isLastStep}
						{#if onboardingState.canGoBack}
							<Button variant="text" class="flex-1" onclick={handleBack}>
								{hostT('onboarding.back')}
							</Button>
						{/if}
						<Button
							variant="filled"
							class="flex-1"
							disabled={step === 'legal' && !legalAccepted}
							onclick={handleNext}
						>
							{step === 'legal' ? hostT('onboarding.legal.continue') : hostT('onboarding.next')}
						</Button>
					{:else}
						<Button variant="text" class="flex-1" onclick={handleFinish}>
							{hostT('onboarding.later')}
						</Button>
						<Button variant="filled" class="flex-1" onclick={handleStartImport}>
							{hostT('onboarding.startImport')}
						</Button>
					{/if}
				</div>
			</div>
		</div>
	</div>
{/if}
