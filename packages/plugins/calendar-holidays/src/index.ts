import { defineChronosPlugin } from '@chronos/core';
import type { ChronosMountable } from '@chronos/core';
import { HOLIDAY_MESSAGES } from './messages';
import { HOLIDAY_PLUGIN_ID } from './constants';
import { activateHolidayCalendar } from './holiday-sync';

export interface CreateHolidayPluginOptions {
	screenComponent?: ChronosMountable;
}

export function createHolidayPlugin(options: CreateHolidayPluginOptions = {}) {
	const { screenComponent } = options;

	return defineChronosPlugin({
		id: HOLIDAY_PLUGIN_ID,
		messages: HOLIDAY_MESSAGES,
		nameKey: 'plugin.name',
		descriptionKey: 'plugin.description',
		category: 'tool',
		toolGroup: 'utility',
		order: 45,
		author: 'Chronos',
		homepage: 'https://github.com/NateScarlet/holiday-cn',
		allowedDomains: ['fastly.jsdelivr.net', 'raw.githubusercontent.com'],
		async apply(ctx, t) {
			await activateHolidayCalendar(ctx);
			ctx.registerSlot('mine.item', {
				id: 'holiday-calendar',
				sectionId: 'data-sync',
				title: () => t('mine.title'),
				href: `/plugins/${HOLIDAY_PLUGIN_ID}`,
				icon: 'event',
				iconTone: 'secondary',
				order: 25
			});

			ctx.registerSlot('shell.route.screen', {
				id: HOLIDAY_PLUGIN_ID,
				title: () => t('screen.title'),
				...(screenComponent ? { component: screenComponent } : {})
			});
		}
	});
}

export { HOLIDAY_PLUGIN_ID } from './constants';
