import type { IHttpService, ChronosProfile } from '@chronos/core';

/** Applied after platform routing so native and Web actions obey the same profile policy. */
export class ProfilePolicyHttpAdapter implements IHttpService {
	constructor(
		private inner: IHttpService,
		private denied: NonNullable<ChronosProfile['deniedPluginServerActions']>
	) {}
	private allows(pluginId: string, action: string): boolean {
		return !this.denied.some((entry) => entry.pluginId === pluginId && entry.action === action);
	}
	supportsPluginServer(pluginId: string, action: string): boolean {
		return (
			this.allows(pluginId, action) &&
			(this.inner.supportsPluginServer?.(pluginId, action) ?? false)
		);
	}
	request(...args: Parameters<IHttpService['request']>) {
		return this.inner.request(...args);
	}
	async proxy(
		pluginId: string,
		action: string,
		payload: unknown,
		options?: { timeoutMs?: number; signal?: AbortSignal }
	) {
		if (!this.allows(pluginId, action))
			throw new Error(`Plugin action denied by profile: ${pluginId}/${action}`);
		if (!this.inner.proxy) throw new Error('Plugin server unavailable');
		return this.inner.proxy(pluginId, action, payload, options);
	}
}
