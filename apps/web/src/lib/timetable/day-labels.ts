import type { HostMessageKey } from '#lib/i18n/host-messages.ts';
import { hostT } from '#lib/i18n/host-i18n.svelte.ts';
import {
	timetableDayColumnHeaderLabel as uiDayColumnHeaderLabel,
	timetableDayLabel as uiDayLabel,
	timetableMonthLabel as uiMonthLabel
} from '@chronos/ui-kit';

const translate = (key: string) => hostT(key as HostMessageKey);

export function timetableDayLabel(dayOfWeek: number): string {
	return uiDayLabel(dayOfWeek, translate);
}

export function timetableDayColumnHeaderLabel(day: {
	dayOfWeek: number;
	holiday?: { label: string };
}): string {
	return uiDayColumnHeaderLabel(day, translate);
}

export function timetableMonthLabel(monthLabel: string): string {
	return uiMonthLabel(monthLabel, translate);
}
