import { describe, expect, it, vi } from 'vite-plus/test';
import {
	ChronosEngine,
	IAnalyticsService,
	pluginAnalyticsEventName,
	trackPluginAnalytics
} from '../src';
import { createMockEnv } from '../src/test-utils';

describe('plugin analytics ownership', () => {
	it('formats names and tolerates a missing analytics capability', () => {
		expect(pluginAnalyticsEventName('tool', 'pick')).toBe('plugin.tool.pick');
		expect(() => trackPluginAnalytics({ tryService: () => undefined }, 'pick')).not.toThrow();
	});
	it('binds attribution at the capability and rejects stopped instances', async () => {
		const { env } = createMockEnv();
		const track = vi.fn();
		env.analytics = { track };
		const engine = new ChronosEngine({ env });
		try {
			await engine.loadPlugin({ id: 'tool', name: 'Tool', version: '1', apply() {} });
			const ctx = engine.getPluginContext('tool');
			trackPluginAnalytics(ctx, 'pick', { plugin_id: 'other', source: 'other', success: true });
			expect(track).toHaveBeenCalledWith('plugin.tool.pick', {
				plugin_id: 'tool',
				source: 'plugin',
				success: true
			});
			const analytics = ctx.service(IAnalyticsService);
			await engine.unloadPlugin('tool');
			expect(() => analytics.track('late')).toThrow('disposed');
			expect(track).toHaveBeenCalledOnce();
		} finally {
			engine.dispose();
		}
	});
});
