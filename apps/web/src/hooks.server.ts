import type { Handle } from '@sveltejs/kit/hooks';
import type { AppLocale } from '@chronos/core';
import { appLocaleToBcp47 } from '#lib/i18n/locale-sync.ts';
import { getTextDirection } from '#lib/paraglide/runtime.js';
import { paraglideMiddleware } from '#lib/paraglide/server.js';

export const handle: Handle = ({ event, resolve }) =>
	paraglideMiddleware(event.request, ({ request, locale }) => {
		return resolve(
			{ ...event, request },
			{
				transformPageChunk: ({ html }) =>
					html
						.replace('%paraglide.lang%', appLocaleToBcp47(locale as AppLocale))
						.replace('%paraglide.dir%', getTextDirection(locale))
			}
		);
	});
