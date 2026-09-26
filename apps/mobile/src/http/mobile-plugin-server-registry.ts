import type {
	IHostHttpSessionService,
	MobilePluginServerContext,
	MobilePluginServerDefinition,
	MobilePluginServerHandler
} from '@chronos/core';

export interface MobilePluginServerRegistration {
	definition: MobilePluginServerDefinition & { allowedDomains: readonly string[] };
	createHandlers(context: MobilePluginServerContext): Record<string, MobilePluginServerHandler>;
}

export interface MobilePluginServerRegistry {
	supports(pluginId: string, action: string): boolean;
	execute(
		pluginId: string,
		action: string,
		payload: unknown,
		options?: { timeoutMs?: number; signal?: AbortSignal }
	): Promise<Awaited<ReturnType<MobilePluginServerHandler>>>;
}

function routeKey(pluginId: string, action: string): string {
	return `${pluginId}/${action}`;
}

export function createMobilePluginServerRegistry(
	registrations: readonly MobilePluginServerRegistration[],
	sessions: IHostHttpSessionService
): MobilePluginServerRegistry {
	const handlers = new Map<string, MobilePluginServerHandler>();
	for (const registration of registrations) {
		const { definition } = registration;
		const context: MobilePluginServerContext = {
			createHttpSession: () =>
				sessions.createSession({
					allowedDomains: definition.allowedDomains,
					cookieOrigins: definition.cookieOrigins
				})
		};
		const pluginHandlers = registration.createHandlers(context);
		const declaredActions = new Set(definition.actions);
		for (const action of Object.keys(pluginHandlers)) {
			if (!declaredActions.has(action)) {
				throw new Error(
					`${definition.pluginId}: mobile handler action "${action}" is not declared`
				);
			}
		}
		for (const action of definition.actions) {
			const handler = pluginHandlers[action];
			if (typeof handler !== 'function') {
				throw new Error(`${definition.pluginId}: mobile handler "${action}" is missing`);
			}
			const key = routeKey(definition.pluginId, action);
			if (handlers.has(key)) throw new Error(`Duplicate mobile plugin action: ${key}`);
			handlers.set(key, handler);
		}
	}

	return {
		supports(pluginId, action) {
			return handlers.has(routeKey(pluginId, action));
		},
		async execute(pluginId, action, payload, options) {
			const key = routeKey(pluginId, action);
			const handler = handlers.get(key);
			if (!handler) throw new Error(`Unsupported plugin server proxy action: ${key}`);
			return handler(payload, options);
		}
	};
}
