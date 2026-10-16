import type { IAnalyticsService } from '@chronos/core';
import { captureAnalyticsEvent } from '#lib/client/analytics.ts';

/**
 * WebAnalyticsProvider implements the IAnalyticsService interface for Chronos Web host.
 * It bridges custom engine and plugin telemetry events to Firebase Analytics.
 */
export class WebAnalyticsProvider implements IAnalyticsService {
	track(event: string, properties?: Record<string, unknown>): void {
		captureAnalyticsEvent(event, properties);
	}
}
