import { resolveDeployTarget, getDeployTargetDefinition } from '../config/deploy-targets.ts';

export interface DeploymentDefinition {
	serverPlugins: string[];
}

/** Server deployment is independent of client installation state. */
export const DEPLOYMENTS: Record<string, DeploymentDefinition> = {
	'chronos-default': { serverPlugins: [] },
	'chronos-cqut': { serverPlugins: ['source-cqut'] },
	'chronos-cqut-offline': { serverPlugins: [] },
	pages: { serverPlugins: [] },
	mobile: { serverPlugins: [] }
};

export function resolveDeployment(
	env: {
		CHRONOS_DEPLOYMENT?: string;
		CHRONOS_DEPLOY_TARGET?: string;
		CHRONOS_PROFILE?: string;
	} = process.env
) {
	const target = resolveDeployTarget(env);
	const targetDef = getDeployTargetDefinition(target);
	const id = env.CHRONOS_DEPLOYMENT ?? targetDef.defaultDeployment;
	const deployment = DEPLOYMENTS[id];
	if (!deployment) throw new Error(`Unknown deployment: ${id}`);
	return deployment;
}
