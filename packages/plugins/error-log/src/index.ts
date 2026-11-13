import { defineChronosPlugin, IErrorCaptureService } from '@chronos/core';
import type { ChronosMountable } from '@chronos/core';
import { ERROR_LOG_PLUGIN_ID } from './constants';
import { ERROR_LOG_MESSAGES } from './messages';
import { createErrorLogRuntime } from './runtime.svelte';

export interface CreateErrorLogPluginOptions {
	screenComponent?: ChronosMountable;
}

export function createErrorLogPlugin(options: CreateErrorLogPluginOptions = {}) {
	const { screenComponent } = options;

	return defineChronosPlugin({
		id: ERROR_LOG_PLUGIN_ID,
		messages: ERROR_LOG_MESSAGES,
		nameKey: 'plugin.name',
		category: 'tool',
		toolGroup: 'dev',
		order: 50,
		author: 'Chronos',
		homepage: 'https://github.com/UE-DND/Chronos',
		async apply(ctx, t) {
			const runtime = createErrorLogRuntime(ctx);
			ctx.addDisposable({ dispose: () => runtime.dispose() });
			await runtime.load();

			const errorCapture = ctx.tryService(IErrorCaptureService);
			ctx.on('plugin:loaded', ({ pluginId }) => {
				if (pluginId === ctx.pluginId && errorCapture) {
					errorCapture.onCaptured((entry) => {
						void runtime.append(entry).catch((error) => {
							if (!ctx.signal.aborted)
								console.warn('[error-log] Failed to save captured error', error);
						});
					});
				}
			});

			ctx.registerSlot('mine.item', {
				id: 'error-log',
				sectionId: ERROR_LOG_PLUGIN_ID,
				title: () => t('mine.title'),
				href: `/plugins/${ERROR_LOG_PLUGIN_ID}`,
				icon: 'history',
				iconTone: 'secondary',
				order: 35
			});

			ctx.registerSlot('shell.route.screen', {
				id: ERROR_LOG_PLUGIN_ID,
				title: () => t('screen.title'),
				...(screenComponent ? { component: screenComponent } : {})
			});
		}
	});
}

export { ERROR_LOG_PLUGIN_ID } from './constants';
