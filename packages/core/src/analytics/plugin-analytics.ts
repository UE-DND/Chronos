import type { ChronosContext } from '../types/context';
import { IAnalyticsService } from '../types/services';

export function pluginAnalyticsEventName(pluginId: string, action: string): string {
	return `plugin.${pluginId}.${action}`;
}

export function trackPluginAnalytics(
	ctx: Pick<ChronosContext, 'tryService'>,
	action: string,
	properties?: Record<string, unknown>
): void {
	const analytics = ctx.tryService(IAnalyticsService);
	if (!analytics) return;
	analytics.track(action, properties);
}
