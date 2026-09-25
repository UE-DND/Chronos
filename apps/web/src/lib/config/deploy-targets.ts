export type DeployTarget = 'vercel' | 'pages' | 'mobile';
export type DeployTargetBasePath = '' | `/${string}`;
export type AdapterKind = 'vercel' | 'static-pages' | 'static-spa';

export interface DeployTargetDefinition {
	readonly target: DeployTarget;
	readonly basePath: DeployTargetBasePath;
	readonly isMobile: boolean;
	readonly disablePwa: boolean;
	readonly defaultDeployment: string;
	readonly adapterKind: AdapterKind;
}

export const DEPLOY_TARGET_DEFINITIONS: Record<DeployTarget, DeployTargetDefinition> = {
	vercel: {
		target: 'vercel',
		basePath: '',
		isMobile: false,
		disablePwa: false,
		defaultDeployment: 'chronos-cqut',
		adapterKind: 'vercel'
	},
	pages: {
		target: 'pages',
		basePath: '/Chronos',
		isMobile: false,
		disablePwa: false,
		defaultDeployment: 'pages',
		adapterKind: 'static-pages'
	},
	mobile: {
		target: 'mobile',
		basePath: '',
		isMobile: true,
		disablePwa: true,
		defaultDeployment: 'mobile',
		adapterKind: 'static-spa'
	}
};

export function resolveDeployTarget(
	targetOrEnv?: string | Record<string, string | undefined>
): DeployTarget {
	const raw =
		typeof targetOrEnv === 'string'
			? targetOrEnv
			: (targetOrEnv?.CHRONOS_DEPLOY_TARGET ?? process.env.CHRONOS_DEPLOY_TARGET);

	if (!raw || raw === 'vercel') return 'vercel';
	if (raw === 'pages') return 'pages';
	if (raw === 'mobile') return 'mobile';

	throw new Error(`Unknown deploy target: "${raw}". Supported targets are: vercel, pages, mobile.`);
}

export function getDeployTargetDefinition(target: DeployTarget): DeployTargetDefinition {
	const def = DEPLOY_TARGET_DEFINITIONS[target];
	if (!def) {
		throw new Error(`Unknown deploy target: "${target}"`);
	}
	return def;
}
