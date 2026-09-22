<script lang="ts">
	import { tick } from 'svelte';
	import PickerWheel from './PickerWheel.svelte';
	import {
		hourItems,
		minuteItems,
		type TimePickerLabels,
		type TimeValue
	} from './time-wheel-utils';

	let {
		value = $bindable({ hour: 0, minute: 0 }),
		label,
		labels,
		idPrefix,
		disabled = false,
		minimum,
		onValueChange
	}: {
		value?: TimeValue;
		label: string;
		labels: TimePickerLabels;
		idPrefix: string;
		disabled?: boolean;
		minimum?: TimeValue;
		onValueChange?: (value: TimeValue) => void;
	} = $props();

	let hourValue = $state(String(value.hour));
	let minuteValue = $state(String(value.minute));
	let hourWheel: PickerWheel | null = $state(null);
	let minuteWheel: PickerWheel | null = $state(null);
	const hours = $derived(
		hourItems()
			.filter((hour) => !minimum || hour >= minimum.hour)
			.map((hour) => ({
				value: String(hour),
				label: String(hour).padStart(2, '0')
			}))
	);
	const minutes = $derived(
		minuteItems()
			.filter((minute) => !minimum || Number(hourValue) > minimum.hour || minute >= minimum.minute)
			.map((minute) => ({
				value: String(minute),
				label: String(minute).padStart(2, '0')
			}))
	);

	function clampToMinimum(next: TimeValue): TimeValue {
		if (!minimum || next.hour * 60 + next.minute >= minimum.hour * 60 + minimum.minute) {
			return next;
		}
		return { ...minimum };
	}

	function setValue(next: TimeValue) {
		const clamped = clampToMinimum(next);
		const changed = clamped.hour !== value.hour || clamped.minute !== value.minute;
		hourValue = String(clamped.hour);
		minuteValue = String(clamped.minute);
		if (!changed) return;
		value = clamped;
		onValueChange?.(clamped);
	}

	function syncDraftFromValue() {
		const next = clampToMinimum(value);
		hourValue = String(next.hour);
		minuteValue = String(next.minute);
	}

	export function scrollToValue() {
		syncDraftFromValue();
		void tick().then(() => {
			hourWheel?.scrollToValue();
			minuteWheel?.scrollToValue();
		});
	}

	function updateHour(next: string) {
		setValue({ hour: Number(next), minute: Number(minuteValue) });
		void tick().then(() => minuteWheel?.scrollToValue());
	}

	function updateMinute(next: string) {
		setValue({ hour: Number(hourValue), minute: Number(next) });
	}

	/** Flush scroll positions into the bindable value before the parent confirms. */
	export function commitDraft(): TimeValue {
		const hour = Number(hourWheel?.commitDraft() ?? hourValue);
		const minute = Number(minuteWheel?.commitDraft() ?? minuteValue);
		setValue({ hour, minute });
		return value;
	}
</script>

<div class="flex justify-center gap-3">
	<div class="flex min-w-0 flex-1 flex-col items-center">
		<PickerWheel
			bind:this={hourWheel}
			bind:value={hourValue}
			options={hours}
			label={labels.columnAria(label, labels.hour)}
			idPrefix={`${idPrefix}-hour`}
			{disabled}
			onValueChange={updateHour}
		/>
	</div>
	<div class="flex min-w-0 flex-1 flex-col items-center">
		<PickerWheel
			bind:this={minuteWheel}
			bind:value={minuteValue}
			options={minutes}
			label={labels.columnAria(label, labels.minute)}
			idPrefix={`${idPrefix}-minute`}
			{disabled}
			onValueChange={updateMinute}
		/>
	</div>
</div>
