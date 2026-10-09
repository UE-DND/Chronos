<script lang="ts">
	import { tick } from 'svelte';
	import { DEFAULT_USER_PREFERENCES, PREPARE_REMINDER_MINUTES_OPTIONS } from '@chronos/core';
	import { PickerWheel } from '@chronos/ui-kit';
	import BottomSheet from '#lib/components/ui/BottomSheet.svelte';
	import { hostT } from '#lib/i18n/host-i18n.svelte.ts';
	import type { AppShellController } from '#lib/app/app-shell.svelte.ts';
	import { trackEvent } from '#lib/client/analytics.ts';
	import Switch from '#lib/components/ui/Switch.svelte';
	import MineSection from '#lib/components/mine/MineSection.svelte';
	import MineRow from '#lib/components/mine/MineRow.svelte';
	import { AnimationFill, MobileVibrateFill } from '#lib/icons/index.ts';
	import { haptic } from '#lib/haptic/haptic.ts';

	let { shell }: { shell: AppShellController } = $props();
	const hapticFeedbackEnabled = $derived(
		shell.controller.userPreferences?.hapticFeedbackEnabled ?? true
	);
	const reduceMotionEnabled = $derived(
		shell.controller.userPreferences?.reduceMotionEnabled ?? false
	);

	const prepareReminderMinutes = $derived(
		shell.controller.userPreferences?.prepareReminderMinutes ??
			DEFAULT_USER_PREFERENCES.prepareReminderMinutes
	);
	const notifications = $derived(shell.classNotifications.state);
	let permissionHelpOpen = $state(false);
	async function openNotificationSettings() {
		if (notifications.background) await shell.classNotifications.openSettings();
		else permissionHelpOpen = true;
	}
	const prepareOptions = PREPARE_REMINDER_MINUTES_OPTIONS.map((minutes) => ({
		value: String(minutes),
		label: String(minutes)
	}));
	const instanceId = $props.id();
	let prepareOpen = $state(false);
	let prepareDraft = $state('');
	let prepareSaving = $state(false);
	let prepareWheel: PickerWheel | null = $state(null);

	function openPreparePicker() {
		prepareDraft = String(prepareReminderMinutes);
		prepareOpen = true;
		void tick().then(() => prepareWheel?.scrollToValue());
	}

	async function confirmPrepareSelection() {
		if (prepareSaving) return;
		const minutes = Number(prepareWheel?.commitDraft() ?? prepareDraft);
		if (minutes === prepareReminderMinutes) {
			prepareOpen = false;
			return;
		}
		prepareSaving = true;
		try {
			await shell.setPrepareReminderMinutes(minutes);
			trackEvent('settings_prepare_reminder_change', { minutes });
			prepareOpen = false;
		} catch {
			shell.controller.notify(hostT('mine.feedback.prepare.saveFailed'), 'error');
		} finally {
			prepareSaving = false;
		}
	}

	async function toggleHapticFeedback(checked: boolean) {
		trackEvent('settings_haptic_feedback_change', { enabled: checked });
		await shell.setHapticFeedbackEnabled(checked);
		if (checked) {
			haptic.light();
		}
	}

	async function toggleReduceMotion(checked: boolean) {
		trackEvent('settings_reduce_motion_change', { enabled: checked });
		await shell.setReduceMotionEnabled(checked);
	}
</script>

<div class="flex flex-col gap-5">
	<MineSection title={hostT('mine.feedback.section.haptic')}>
		<MineRow
			label
			title={hostT('mine.feedback.haptic.label')}
			icon={MobileVibrateFill}
			iconTone="primary"
		>
			{#snippet trailing()}
				<Switch
					checked={hapticFeedbackEnabled}
					hapticOnChange={false}
					onCheckedChange={toggleHapticFeedback}
				/>
			{/snippet}
		</MineRow>
	</MineSection>

	<MineSection title={hostT('mine.feedback.section.motion')}>
		<MineRow
			label
			title={hostT('mine.feedback.motion.label')}
			icon={AnimationFill}
			iconTone="primary"
		>
			{#snippet trailing()}
				<Switch checked={reduceMotionEnabled} onCheckedChange={toggleReduceMotion} />
			{/snippet}
		</MineRow>
	</MineSection>
	<MineSection title={hostT('mine.feedback.section.prepare')}>
		<MineRow
			title={hostT('mine.feedback.prepare.label')}
			onclick={openPreparePicker}
			aria-haspopup="dialog"
			aria-expanded={prepareOpen}
		>
			{#snippet trailing()}
				<span class="text-body-medium shrink-0 text-on-surface-variant">
					{hostT('mine.feedback.prepare.minutes', { minutes: prepareReminderMinutes })}
				</span>
			{/snippet}
		</MineRow>
		<MineRow label title={hostT('mine.feedback.notifications.label')}>
			{#snippet trailing()}
				<Switch
					checked={notifications.enabled}
					disabled={notifications.busy || notifications.status === 'unsupported'}
					onCheckedChange={shell.classNotifications.setEnabled}
				/>
			{/snippet}
		</MineRow>
		{#if notifications.status === 'permission'}
			<MineRow
				title={hostT('mine.feedback.notifications.settings')}
				onclick={openNotificationSettings}
			/>
		{:else if notifications.status === 'error'}
			<MineRow
				title={hostT('mine.feedback.notifications.retry')}
				onclick={() => shell.classNotifications.sync(true)}
			/>
		{/if}
		{#if notifications.enabled}
			<MineRow
				title={hostT('mine.feedback.notifications.test')}
				onclick={shell.classNotifications.sendTest}
				disabled={notifications.busy}
			/>
		{/if}
	</MineSection>
</div>

<BottomSheet bind:open={permissionHelpOpen} title={hostT('mine.feedback.notifications.settings')}>
	<p class="text-body-medium px-4 py-3 text-on-surface-variant">
		{hostT('mine.feedback.notifications.browserHelp')}
	</p>
</BottomSheet>

<BottomSheet bind:open={prepareOpen} title={hostT('mine.feedback.prepare.label')}>
	<div class="px-4 pt-1 pb-2">
		<PickerWheel
			bind:this={prepareWheel}
			bind:value={prepareDraft}
			options={prepareOptions}
			label={hostT('mine.feedback.prepare.label')}
			idPrefix={`prepare-reminder-${instanceId}`}
			disabled={prepareSaving}
		/>
	</div>
	{#snippet footer()}
		<button
			type="button"
			class="text-label-large h-11 rounded-full px-5 text-on-surface-variant hover:bg-on-surface/5 active:bg-on-surface/10"
			disabled={prepareSaving}
			onclick={() => (prepareOpen = false)}
		>
			{hostT('common.cancel')}
		</button>
		<button
			type="button"
			class="text-label-large h-11 rounded-full bg-brand px-6 text-on-primary active:opacity-90"
			disabled={prepareSaving}
			onclick={confirmPrepareSelection}
		>
			{hostT('common.confirm')}
		</button>
	{/snippet}
</BottomSheet>
