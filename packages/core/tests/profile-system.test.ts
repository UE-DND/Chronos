import { describe, it, expect } from 'vite-plus/test';
import {
	resolveLayeredPluginConfig,
	validateProfile,
	type ChronosProfile
} from '../src/profile/profile';

describe('Profile System and Layered Config', () => {
	it('correctly resolves layered plugin configs across 4 priority levels', () => {
		const schemaDefault: Record<string, unknown> = {
			campusId: 'huaxi',
			autoSync: false,
			timeout: 3000
		};
		const manifestConfig: Record<string, unknown> = { timeout: 5000 };
		const profileConfig: Record<string, unknown> = { campusId: 'liangjiang' };
		const userPatch: Record<string, unknown> = { autoSync: true };

		const merged = resolveLayeredPluginConfig(
			schemaDefault,
			manifestConfig,
			profileConfig,
			userPatch
		);

		expect(merged).toEqual({
			campusId: 'liangjiang', // Overridden by Profile
			autoSync: true, // Overridden by User
			timeout: 5000 // Overridden by Manifest
		});
	});
});

describe('profile validation', () => {
	const profile: ChronosProfile = {
		profileId: 'test',
		name: 'Test',
		defaultTheme: { pluginId: 'base', themeId: 'theme' },
		preinstall: [{ id: 'base' }]
	};
	it('rejects a disabled ordinary preinstall', () => {
		expect(() =>
			validateProfile({
				...profile,
				preinstall: [...profile.preinstall, { id: 'tool', enabled: false }]
			})
		).toThrow('must be enabled');
	});
	it('rejects missing, disabled and overridden defaults', () => {
		expect(() =>
			validateProfile({ ...profile, defaultTheme: undefined } as unknown as ChronosProfile)
		).toThrow();
		expect(() => validateProfile({ ...profile, preinstall: [] })).toThrow();
		expect(() =>
			validateProfile({ ...profile, preinstall: [{ id: 'base', enabled: false }] })
		).toThrow();
		expect(() =>
			validateProfile({
				...profile,
				preferences: { visualThemeId: 'other' }
			} as unknown as ChronosProfile)
		).toThrow();
	});
});
