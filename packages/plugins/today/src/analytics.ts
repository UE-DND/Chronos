export const TODAY_ANALYTICS = {
	preparingStatusShown: 'preparing_status_shown'
} as const;

export type TodayAnalyticsAction = (typeof TODAY_ANALYTICS)[keyof typeof TODAY_ANALYTICS];
