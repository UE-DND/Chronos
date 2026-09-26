import {
	validateProfile,
	type ChronosProfile
} from '../../../../../packages/core/src/profile/profile.ts';

const DEFAULT_PROFILE: ChronosProfile = {
	profileId: 'chronos-default',
	name: 'Chronos 标准开源版',
	description: '包含分享口令与标准备份能力',
	defaultTheme: { pluginId: 'theme-m3', themeId: 'm3-default' },
	defaultImportSlot: 'share-link',
	preinstall: [
		{ id: 'theme-m3', enabled: true },
		{ id: 'codec-share', enabled: true }
	]
};

const CQUT_PROFILE: ChronosProfile = {
	profileId: 'chronos-cqut',
	name: '重庆理工大学在线版',
	description: '专为重庆理工大学定制，内置知行理工教务直连与校区专属节次',
	defaultTheme: { pluginId: 'theme-m3', themeId: 'm3-default' },
	defaultImportSlot: 'cqut-online',
	preinstall: [
		{ id: 'theme-m3', enabled: true },
		{ id: 'source-cqut', enabled: true },
		{ id: 'codec-share', enabled: true }
	]
};

const CQUT_OFFLINE_PROFILE: ChronosProfile = {
	profileId: 'chronos-cqut-offline',
	name: '重庆理工大学离线版',
	description: 'HTML 课表导入与分享口令，不含知行理工在线同步',
	defaultTheme: { pluginId: 'theme-m3', themeId: 'm3-default' },
	defaultImportSlot: 'edu-html',
	deniedPluginServerActions: [{ pluginId: 'source-cqut', action: 'preview' }],
	preinstall: [
		{ id: 'theme-m3', enabled: true },
		{ id: 'source-cqut', enabled: true },
		{ id: 'codec-share', enabled: true }
	]
};

export const CHRONOS_PROFILES: Record<string, ChronosProfile> = {
	'chronos-default': DEFAULT_PROFILE,
	'chronos-cqut': CQUT_PROFILE,
	'chronos-cqut-offline': CQUT_OFFLINE_PROFILE
};

import { resolveDeployTarget, getDeployTargetDefinition } from '../config/deploy-targets.ts';

export type ProfileResolveEnv = {
	CHRONOS_PROFILE?: string;
	CHRONOS_DEPLOY_TARGET?: string;
};

export function resolveProfileId(env: ProfileResolveEnv = process.env): string {
	if (env.CHRONOS_PROFILE) return env.CHRONOS_PROFILE;
	const target = resolveDeployTarget(env);
	const targetDef = getDeployTargetDefinition(target);
	return targetDef.defaultProfile;
}

export function resolveProfile(profileId: string): ChronosProfile {
	const profile = CHRONOS_PROFILES[profileId];
	if (!profile) throw new Error(`Unknown profile: ${profileId}`);
	validateProfile(profile);
	return profile;
}
