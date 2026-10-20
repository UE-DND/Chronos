export interface OnlineScheduleWeekDay {
	weekDay: string;
	weekDate: string;
	today: boolean;
}

export interface OnlineScheduleEvent {
	weekNum: string;
	weekDay: string;
	weekList: string[];
	weekCover: string;
	sessionList: string[];
	sessionStart: string;
	sessionLast: string;
	eventName: string;
	address: string;
	memberName: string;
	remark: string;
	duplicateGroupType: string;
	duplicateGroup: number;
	eventType: string;
	eventID: string;
}

export interface OnlineSchedulePayload {
	yearTerm: string;
	weekNum: string;
	nowMonth: string;
	importSource: string;
	termStartDate: string | null;
	yearTermList: string[];
	weekList: string[];
	weekDayList: OnlineScheduleWeekDay[];
	eventList: OnlineScheduleEvent[];
}

export function resolveWeeksToFetch(
	initialPayload: OnlineSchedulePayload,
	requestedWeekNum: string | null | undefined
): string[] {
	const explicitWeek = requestedWeekNum?.trim();
	if (explicitWeek) {
		return [explicitWeek];
	}

	const uniqueWeeks = uniqueTrimmed(initialPayload.weekList);
	if (uniqueWeeks.length > 0) return uniqueWeeks;

	const fallbackWeek = initialPayload.weekNum.trim();
	return fallbackWeek ? [fallbackWeek] : [];
}

function nonEmptyTrimmed(values: readonly string[]): string[] {
	return values.map((value) => value.trim()).filter(Boolean);
}

function uniqueTrimmed(values: readonly string[]): string[] {
	return [...new Set(nonEmptyTrimmed(values))];
}

function normalizeEvent(event: OnlineScheduleEvent): OnlineScheduleEvent {
	return {
		...event,
		weekNum: event.weekNum.trim(),
		weekDay: event.weekDay.trim(),
		weekList: nonEmptyTrimmed(event.weekList),
		weekCover: event.weekCover.trim(),
		sessionList: nonEmptyTrimmed(event.sessionList),
		sessionStart: event.sessionStart.trim(),
		sessionLast: event.sessionLast.trim(),
		eventName: event.eventName.trim(),
		address: event.address.trim(),
		memberName: event.memberName.trim(),
		duplicateGroupType: event.duplicateGroupType.trim(),
		eventType: event.eventType.trim(),
		eventID: event.eventID.trim()
	};
}

function eventIdentityKey(event: OnlineScheduleEvent): string {
	return `${event.weekDay}\0${event.sessionStart}\0${event.sessionLast}\0${event.sessionList.join(',')}\0${event.eventName}\0${event.address}\0${event.memberName}\0${event.eventType}`;
}

function mergeWeekLists(left: string[], right: string[]): string[] {
	const set = new Set(left);
	for (const week of right) {
		set.add(week);
	}
	return [...set].sort((a, b) => Number.parseInt(a, 10) - Number.parseInt(b, 10));
}

export function mergeWeekPayloads(
	initialPayload: OnlineSchedulePayload,
	payloads: OnlineSchedulePayload[]
): OnlineSchedulePayload {
	const mergedEvents = new Map<string, OnlineScheduleEvent>();

	for (const payload of payloads) {
		for (const event of payload.eventList) {
			const normalizedEvent = normalizeEvent(event);
			const key = eventIdentityKey(normalizedEvent);
			const existing = mergedEvents.get(key);
			if (!existing) {
				mergedEvents.set(key, normalizedEvent);
				continue;
			}
			mergedEvents.set(key, {
				...existing,
				weekList: mergeWeekLists(existing.weekList, normalizedEvent.weekList)
			});
		}
	}

	return {
		...initialPayload,
		yearTerm: initialPayload.yearTerm.trim(),
		weekNum: initialPayload.weekNum.trim(),
		nowMonth: initialPayload.nowMonth.trim(),
		yearTermList: uniqueTrimmed(initialPayload.yearTermList),
		weekList: uniqueTrimmed(initialPayload.weekList),
		weekDayList: initialPayload.weekDayList,
		eventList: [...mergedEvents.values()]
	};
}
