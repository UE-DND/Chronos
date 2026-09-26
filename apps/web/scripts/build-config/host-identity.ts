import { createHash } from 'node:crypto';
import { execFileSync } from 'node:child_process';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import type { HostBuildIdentity } from '../../../../packages/core/src/types/host-update.ts';
import {
	resolveProfile,
	resolveProfileId
} from '../../src/lib/profile-codegen/profile-definitions.ts';
import { resolveDeployment } from '../../src/lib/profile-codegen/deployment-definitions.ts';
import {
	getDeployTargetDefinition,
	resolveDeployTarget,
	type DeployTarget
} from '../../src/lib/config/deploy-targets.ts';
import type { ChronosProfile } from '../../../../packages/core/src/profile/profile.ts';

export interface HostIdentityContext {
	profileId?: string;
	deploymentId?: string;
	target?: DeployTarget;
	profile?: ChronosProfile;
}

export function createHostIdentity(root: string, context?: HostIdentityContext): HostBuildIdentity {
	const sourceCommit = execFileSync('git', ['rev-parse', 'HEAD'], {
		cwd: root,
		encoding: 'utf8'
	}).trim();
	const version = JSON.parse(readFileSync(resolve(root, 'apps/web/package.json'), 'utf8')).version;
	const target = context?.target ?? resolveDeployTarget();
	const deploymentId =
		context?.deploymentId ??
		process.env.CHRONOS_DEPLOYMENT ??
		getDeployTargetDefinition(target).defaultDeployment;
	const profileId = context?.profileId ?? resolveProfileId();
	const profile = context?.profile ?? resolveProfile(profileId);
	const deployment = resolveDeployment({
		CHRONOS_DEPLOYMENT: deploymentId,
		CHRONOS_DEPLOY_TARGET: target
	});
	const environment = Object.fromEntries(
		Object.entries(process.env)
			.filter(([key]) => key.startsWith('PUBLIC_') || key === 'CHRONOS_PLUGIN_MARKET_BASE_URL')
			.sort(([a], [b]) => a.localeCompare(b))
	);
	const buildId = createHash('sha256')
		.update(
			JSON.stringify({
				sourceCommit,
				version,
				profile,
				deployment,
				deploymentId,
				target,
				environment
			})
		)
		.digest('hex');
	return {
		version,
		buildId,
		sourceCommit,
		profileId,
		deploymentId,
		target
	};
}
