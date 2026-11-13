import { defineChronosPlugin } from '@chronos/core';
import type { ChronosMountable } from '@chronos/core';
import { parseStoredFrozenEpoch } from './clock';
import { CLOCK_PLUGIN_ID, CLOCK_STORAGE_KEY } from './constants';
import { CLOCK_MESSAGES } from './messages';

export interface CreateClockPluginOptions {
	screenComponent?: ChronosMountable;
}

export function createClockPlugin(options: CreateClockPluginOptions = {}) {
	const { screenComponent } = options;

	return defineChronosPlugin({
		id: CLOCK_PLUGIN_ID,
		messages: CLOCK_MESSAGES,
		nameKey: 'plugin.name',
		category: 'tool',
		toolGroup: 'dev',
		order: 55,
		author: 'Chronos',
		homepage: 'https://github.com/UE-DND/Chronos',
		async apply(ctx, t) {
			const stored = parseStoredFrozenEpoch(await ctx.storage.get(CLOCK_STORAGE_KEY));
			if (stored != null) {
				ctx.clock.set(new Date(stored));
			}

			ctx.registerSlot('mine.item', {
				id: 'clock',
				sectionId: CLOCK_PLUGIN_ID,
				title: () => t('mine.title'),
				href: `/plugins/${CLOCK_PLUGIN_ID}`,
				icon: 'schedule',
				iconTone: 'secondary',
				order: 40
			});

			ctx.registerSlot('shell.route.screen', {
				id: CLOCK_PLUGIN_ID,
				title: () => t('screen.title'),
				...(screenComponent ? { component: screenComponent } : {})
			});
		}
	});
}

export { CLOCK_PLUGIN_ID, CLOCK_STORAGE_KEY } from './constants';
