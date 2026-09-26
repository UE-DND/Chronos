import { resolve } from '$app/paths';
import type { ChronosDB } from '$lib/storage/db';
import { DexieStorageProvider } from './dexie-storage';
import { WebHttpProxyProvider } from './web-http';
import { PluginProxyHttpAdapter } from './plugin-proxy-http';
import { WebRuntimeProvider } from './web-runtime';
import { WebAnalyticsProvider } from './web-analytics';
import { WebErrorCaptureProvider } from './web-error-capture';
import { env } from '$env/dynamic/public';

import type { PlatformType } from '@chronos/core';

export {
	DexieStorageProvider,
	WebHttpProxyProvider,
	PluginProxyHttpAdapter,
	WebRuntimeProvider,
	WebAnalyticsProvider,
	WebErrorCaptureProvider
};

export interface WebProviderOptions {
	database?: ChronosDB;
	localStorage?: Storage | null;
	allowedDomains?: string[];
	enablePluginProxy?: boolean;
	platform?: PlatformType;
	wrapHttpService?: (
		inner: import('@chronos/core').IHttpService
	) => import('@chronos/core').IHttpService;
	navigation?: {
		openCourseEditor(courseId: string): void;
	};
	coursePresentation?: import('@chronos/core').ICoursePresentationService;
}

/**
 * Creates an instance of all Web standard providers.
 */
export function createWebProviders(options?: WebProviderOptions) {
	const baseHttp = new WebHttpProxyProvider(options?.allowedDomains);
	let http: import('@chronos/core').IHttpService =
		options?.enablePluginProxy === true ? new PluginProxyHttpAdapter(baseHttp) : baseHttp;
	if (options?.wrapHttpService) {
		http = options.wrapHttpService(http);
	}

	return {
		storage: new DexieStorageProvider(options?.database, options?.localStorage),
		http,
		runtime: new WebRuntimeProvider(),
		analytics: new WebAnalyticsProvider(),
		errorCapture: new WebErrorCaptureProvider()
	};
}

/**
 * Creates a ChronosEnv facade populated with Web providers.
 */
export function createWebChronosEnv(options?: WebProviderOptions) {
	const providers = createWebProviders(options);
	return {
		platform: options?.platform ?? ('web' as const),
		hostLinks: {
			getImportUrl: () => {
				if (options?.platform === 'ios' || options?.platform === 'android') {
					return env.PUBLIC_CHRONOS_SHARE_IMPORT_URL?.trim() || null;
				}
				return typeof window === 'undefined'
					? null
					: new URL(resolve('/s'), window.location.origin).href;
			}
		},
		http: providers.http,
		storage: providers.storage,
		runtime: providers.runtime,
		analytics: providers.analytics,
		errorCapture: providers.errorCapture,
		...(options?.navigation ? { navigation: options.navigation } : {}),
		...(options?.coursePresentation ? { coursePresentation: options.coursePresentation } : {})
	};
}
