/** Server deployment is independent of client installation state. */
export const DEPLOYMENTS: Record<string, { serverPlugins: string[] }> = {
	'chronos-default': { serverPlugins: [] },
	'chronos-cqut': { serverPlugins: ['source-cqut'] },
	'chronos-cqut-offline': { serverPlugins: [] },
	pages: { serverPlugins: [] }
};
export function resolveDeployment(
	env: {
		CHRONOS_DEPLOYMENT?: string;
		CHRONOS_DEPLOY_TARGET?: string;
		CHRONOS_PROFILE?: string;
	} = process.env
) {
	const id =
		env.CHRONOS_DEPLOYMENT ?? (env.CHRONOS_DEPLOY_TARGET === 'pages' ? 'pages' : 'chronos-cqut');
	const deployment = DEPLOYMENTS[id];
	if (!deployment) throw new Error(`Unknown deployment: ${id}`);
	return deployment;
}
