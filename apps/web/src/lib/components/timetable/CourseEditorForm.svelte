<script lang="ts">
	import { goto } from '$app/navigation';
	import { resolve } from '$app/paths';
	import { hostT } from '$lib/i18n/host-i18n.svelte';
	import type { CourseEditorController } from '$lib/timetable/course-editor.svelte';
	import { COURSE_REMARK_MAX_LENGTH } from '@chronos/core';
	import Button from '$lib/components/ui/Button.svelte';
	import FormCard from '$lib/components/ui/FormCard.svelte';
	import SegmentedControl from '$lib/components/ui/SegmentedControl.svelte';
	import TextField from '$lib/components/ui/TextField.svelte';
	import WheelRangeField from '$lib/components/ui/WheelRangeField.svelte';
	import WheelSelectField from '$lib/components/ui/WheelSelectField.svelte';
	import WeekMultiSelectField from './WeekMultiSelectField.svelte';

	let { editor }: { editor: CourseEditorController } = $props();

	const draft = $derived(editor.draft);
	const timetable = $derived(editor.timetable);
	const optionalPlaceholder = $derived(hostT('course.form.optional'));
	const selectPlaceholder = $derived(hostT('course.form.select'));
	const recurrenceSegments = $derived([
		{ value: 'all', label: hostT('course.form.recurrence.all') },
		{ value: 'weeks', label: hostT('course.form.recurrence.weeks') }
	]);
	const weekdayOptions = $derived(
		Array.from({ length: 7 }, (_, index) => ({
			value: String(index + 1),
			label: hostT(`course.form.weekday.${index + 1}` as Parameters<typeof hostT>[0])
		}))
	);
	const weeks = $derived(
		timetable
			? Array.from(
					{
						length: timetable.academicConfig.endWeek - timetable.academicConfig.startWeek + 1
					},
					(_, index) => timetable.academicConfig.startWeek + index
				)
			: []
	);
	const periodOptions = $derived(
		timetable?.academicConfig.periodTimes.map((period) => ({
			value: String(period.index),
			label: hostT('course.form.period', { period: period.index })
		})) ?? []
	);
	function numberOrNull(value: string): number | null {
		return value ? Number(value) : null;
	}
</script>

{#if draft}
	<div class="space-y-4">
		<section class="space-y-2" aria-labelledby="course-basic-heading">
			<h2 id="course-basic-heading" class="text-title-small px-1 text-on-surface-variant">
				{hostT('course.form.basic')}
			</h2>
			<FormCard>
				<TextField label={hostT('course.form.name')} required bind:value={draft.name} />
				<TextField
					label={hostT('course.form.teacher')}
					placeholder={optionalPlaceholder}
					autocomplete="name"
					bind:value={draft.teacher}
				/>
				<TextField
					label={hostT('course.form.location')}
					placeholder={optionalPlaceholder}
					autocomplete="address-line1"
					bind:value={draft.location}
				/>
			</FormCard>
		</section>

		<section class="space-y-2" aria-labelledby="course-schedule-heading">
			<h2 id="course-schedule-heading" class="text-title-small px-1 text-on-surface-variant">
				{hostT('course.form.schedule')}
			</h2>
			<FormCard>
				<div class="ui-form-field gap-3">
					<SegmentedControl
						segments={recurrenceSegments}
						value={draft.recurrenceMode}
						onValueChange={(value) => editor.setRecurrenceMode(value as 'all' | 'weeks')}
					/>
				</div>

				{#if draft.recurrenceMode === 'weeks'}
					<WeekMultiSelectField
						label={hostT('course.form.weekRange')}
						required
						{weeks}
						value={draft.selectedWeeks}
						onValueChange={(weeks) => (draft.selectedWeeks = weeks)}
					/>
				{/if}

				<WheelSelectField
					label={hostT('course.form.weekday')}
					required
					placeholder={selectPlaceholder}
					options={weekdayOptions}
					value={draft.dayOfWeek?.toString() ?? ''}
					onValueChange={(value) => (draft.dayOfWeek = numberOrNull(value))}
				/>

				{#if periodOptions.length > 0}
					<WheelRangeField
						label={hostT('course.form.periodRange')}
						startLabel={hostT('course.form.startPeriod')}
						endLabel={hostT('course.form.endPeriod')}
						required
						placeholder={selectPlaceholder}
						options={periodOptions}
						startValue={draft.startPeriod?.toString() ?? ''}
						endValue={draft.endPeriod?.toString() ?? ''}
						onValueChange={(start, end) => {
							editor.setStartPeriod(numberOrNull(start));
							draft.endPeriod = numberOrNull(end);
						}}
					/>
				{:else}
					<div class="ui-form-field gap-2">
						<p class="text-body-medium text-on-surface-variant">
							{hostT('course.form.noPeriods')}
						</p>
						<Button variant="text" onclick={() => goto(resolve('/timetable/details'))}>
							{hostT('course.form.configurePeriods')}
						</Button>
					</div>
				{/if}
			</FormCard>

			{#if editor.conflicts.length > 0}
				<div
					class="rounded-2xl border border-error/30 bg-error-container/20 px-4 py-3 text-on-error-container"
					role="status"
					aria-live="polite"
				>
					<p class="text-label-large font-medium">{hostT('course.form.conflicts')}</p>
					<ul class="text-body-small mt-1 list-inside list-disc">
						{#each editor.conflicts as course (course.id)}
							<li>
								{hostT('course.form.conflictItem', {
									name: course.name,
									weekday: hostT(
										`course.form.weekday.${course.dayOfWeek}` as Parameters<typeof hostT>[0]
									),
									start: course.startPeriod,
									end: course.endPeriod
								})}
							</li>
						{/each}
					</ul>
				</div>
			{/if}
		</section>

		<section class="space-y-2" aria-labelledby="course-remark-heading">
			<h2 id="course-remark-heading" class="text-title-small px-1 text-on-surface-variant">
				{hostT('course.form.remark')}
			</h2>
			<FormCard>
				<TextField
					label={hostT('course.form.remark')}
					multiline
					rows={3}
					placeholder={optionalPlaceholder}
					autocomplete="off"
					maxlength={COURSE_REMARK_MAX_LENGTH}
					bind:value={draft.remark}
				/>
			</FormCard>
		</section>
	</div>
{/if}
