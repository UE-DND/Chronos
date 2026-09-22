import { describe, expect, it } from 'vite-plus/test';
import {
	CHRONOS_PROFILES,
	resolveProfile,
	resolveProfileId
} from '$lib/profile-codegen/profile-definitions';
import { resolveDeployment } from '$lib/profile-codegen/deployment-definitions';
import { OFFICIAL_PLUGINS } from '../../../../../scripts/official-plugins.config';
import { resolveOfficialServerPlugin } from '../../../../../scripts/official-plugin-build/server-definition';
import { fileURLToPath } from 'node:url';
describe('profile and deployment boundaries', () => {
	it('preinstalls only market plugins and requires an enabled default provider', () => {
		for (const profile of Object.values(CHRONOS_PROFILES)) {
			expect(resolveProfile(profile.profileId)).toBe(profile);
			expect(
				profile.preinstall.every((entry) => OFFICIAL_PLUGINS.some((p) => p.id === entry.id))
			).toBe(true);
			expect(
				profile.preinstall.some(
					(entry) => entry.id === profile.defaultTheme.pluginId && entry.enabled !== false
				)
			).toBe(true);
			expect(profile.preinstall.some((entry) => entry.id === 'core-shell')).toBe(false);
			expect(profile.preinstall.some((entry) => entry.id === 'theme-arknights')).toBe(false);
		}
	});
	it('selects server capabilities independently from the client profile', async () => {
		expect(
			resolveDeployment({ CHRONOS_DEPLOYMENT: 'chronos-cqut', CHRONOS_PROFILE: 'chronos-default' })
				.serverPlugins
		).toEqual(['source-cqut']);
		expect(resolveDeployment({ CHRONOS_DEPLOYMENT: 'chronos-cqut-offline' }).serverPlugins).toEqual(
			[]
		);
		expect(resolveDeployment({ CHRONOS_DEPLOY_TARGET: 'pages' }).serverPlugins).toEqual([]);
		expect(resolveDeployment({ CHRONOS_DEPLOYMENT: 'chronos-default' }).serverPlugins).toEqual([]);
		const cqut = OFFICIAL_PLUGINS.find((plugin) => plugin.id === 'source-cqut');
		expect(cqut).toBeDefined();
		const server = await resolveOfficialServerPlugin(
			cqut!,
			fileURLToPath(new URL('../../../../../', import.meta.url))
		);
		expect(server?.definition.proxy.domains).toEqual(['cqut.edu.cn']);
	});
	it('rejects unknown explicit choices and retains the deployment default', () => {
		expect(() => resolveProfile('typo')).toThrow('Unknown profile');
		expect(() => resolveDeployment({ CHRONOS_DEPLOYMENT: 'typo' })).toThrow('Unknown deployment');
		expect(resolveProfileId({})).toBe('chronos-cqut');
		expect(resolveProfileId({ CHRONOS_DEPLOY_TARGET: 'pages' })).toBe('chronos-default');
	});
});
