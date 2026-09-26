import { describe, expect, it, vi } from 'vite-plus/test';
import type { IHostHttpSessionService, MobilePluginServerContext } from '@chronos/core';
import { pluginServerSuccess } from '@chronos/core';
import {
	createMobilePluginServerRegistry,
	type MobilePluginServerRegistration
} from '../src/http/mobile-plugin-server-registry';

const definition = {
	pluginId: 'school-one',
	actions: ['preview'],
	allowedDomains: ['example.org'],
	cookieOrigins: ['https://login.example.org']
};

function registration(
	createHandlers: MobilePluginServerRegistration['createHandlers'] = () => ({
		preview: vi.fn().mockResolvedValue(pluginServerSuccess({ courses: [] }))
	})
): MobilePluginServerRegistration {
	return { definition, createHandlers };
}

describe('mobile plugin server registry', () => {
	it('advertises and dispatches handlers declared by unrelated plugins', async () => {
		const schoolOne = registration();
		const schoolTwo = registration(() => ({
			preview: vi.fn().mockResolvedValue(pluginServerSuccess({ school: 2 }))
		}));
		schoolTwo.definition = {
			...definition,
			pluginId: 'school-two',
			cookieOrigins: ['https://login.other.org'],
			allowedDomains: ['other.org']
		};
		const sessions: IHostHttpSessionService = { createSession: vi.fn() };
		const registry = createMobilePluginServerRegistry([schoolOne, schoolTwo], sessions);

		expect(registry.supports('school-one', 'preview')).toBe(true);
		expect(registry.supports('school-two', 'preview')).toBe(true);
		expect(registry.supports('school-one', 'sync')).toBe(false);
		expect(await registry.execute('school-two', 'preview', {})).toEqual({
			ok: true,
			payload: { school: 2 }
		});
	});

	it('creates a session bound to the declaring plugin origins', () => {
		const createSession = vi.fn();
		const sessions: IHostHttpSessionService = { createSession };
		let context: MobilePluginServerContext | undefined;
		const registry = createMobilePluginServerRegistry(
			[
				registration((createdContext) => {
					context = createdContext;
					return { preview: vi.fn() };
				})
			],
			sessions
		);
		void registry;

		void context?.createHttpSession();
		expect(createSession).toHaveBeenCalledWith({
			allowedDomains: ['example.org'],
			cookieOrigins: ['https://login.example.org']
		});
	});

	it('fails initialization for missing, undeclared, or duplicate handlers', () => {
		const sessions: IHostHttpSessionService = { createSession: vi.fn() };
		expect(() => createMobilePluginServerRegistry([registration(() => ({}))], sessions)).toThrow(
			'mobile handler "preview" is missing'
		);
		expect(() =>
			createMobilePluginServerRegistry(
				[registration(() => ({ preview: vi.fn(), other: vi.fn() }))],
				sessions
			)
		).toThrow('mobile handler action "other" is not declared');
		expect(() =>
			createMobilePluginServerRegistry([registration(), registration()], sessions)
		).toThrow('Duplicate mobile plugin action: school-one/preview');
	});

	it('rejects dispatch of an action absent from the registry', async () => {
		const registry = createMobilePluginServerRegistry([registration()], { createSession: vi.fn() });
		await expect(registry.execute('school-one', 'sync', {})).rejects.toThrow(
			'Unsupported plugin server proxy action: school-one/sync'
		);
	});
});
