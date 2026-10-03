import { defineChronosPlugin } from '@chronos/core';
import type { ChronosMountable } from '@chronos/core';
import { TODAY_MESSAGES } from './messages';
import { TODAY_PLUGIN_ID, type TodayPluginConfig } from './constants';

export type { TodayPluginConfig, TodayScope } from './constants';

export interface CreateTodayPluginOptions {
	screenComponent?: ChronosMountable;
}

export function createTodayPlugin(options: CreateTodayPluginOptions = {}) {
	const { screenComponent } = options;

	return defineChronosPlugin<TodayPluginConfig>({
		id: TODAY_PLUGIN_ID,
		messages: TODAY_MESSAGES,
		nameKey: 'plugin.name',
		descriptionKey: 'plugin.description',
		category: 'tool',
		toolGroup: 'utility',
		order: 35,
		author: 'Chronos',
		defaultConfig: { scope: 'active' },
		async apply(ctx, t) {
			ctx.registerSlot('shell.bottom-bar.tab', {
				id: 'today',
				label: () => t('tab.label'),
				order: 15,
				icon: 'calendar-clock',
				iconFill: 'calendar-clock-fill',
				defaultLaunch: true
			});

			ctx.registerSlot('shell.route.screen', {
				id: TODAY_PLUGIN_ID,
				title: () => t('screen.title'),
				...(screenComponent ? { component: screenComponent } : {})
			});
		}
	});
}

export { TODAY_PLUGIN_ID } from './constants';
