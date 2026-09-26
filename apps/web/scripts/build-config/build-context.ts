import {
	resolveDeployTarget,
	getDeployTargetDefinition,
	type DeployTarget,
	type DeployTargetDefinition
} from './deploy-targets.ts';
import {
	resolveProfile,
	type ProfileResolveEnv
} from '../../src/lib/profile-codegen/profile-definitions.ts';
import {
	DEPLOYMENTS,
	type DeploymentDefinition
} from '../../src/lib/profile-codegen/deployment-definitions.ts';
import type { ChronosProfile } from '../../../../packages/core/src/profile/profile.ts';
import { OFFICIAL_PLUGINS } from '../../../../scripts/official-plugins.config.ts';
import { resolveDeploymentServerPlugins } from '../../../../scripts/official-plugin-build/server-definition.ts';
import { resolve } from 'node:path';
import { loadDistributionConfig } from './distributions.ts';

export interface BuildContextCliOptions {
	distribution?: string;
	target?: string;
	profile?: string;
	deployment?: string;
}

export interface ParsedBuildCliArgs {
	options: BuildContextCliOptions;
	remainingArgs: string[];
}

export function parseBuildCliArgs(argv: string[]): ParsedBuildCliArgs {
	const options: BuildContextCliOptions = {};
	const remainingArgs: string[] = [];
	const flags = new Map<string, keyof BuildContextCliOptions>([
		['--distribution', 'distribution'],
		['--target', 'target'],
		['--profile', 'profile'],
		['--deployment', 'deployment']
	]);

	for (let i = 0; i < argv.length; i++) {
		const arg = argv[i]!;
		const equalsIndex = arg.indexOf('=');
		const flag = equalsIndex >= 0 ? arg.slice(0, equalsIndex) : arg;
		const option = flags.get(flag);
		if (!option) {
			remainingArgs.push(arg);
			continue;
		}

		const value = equalsIndex >= 0 ? arg.slice(equalsIndex + 1) : argv[++i];
		if (!value || value.startsWith('--')) {
			throw new Error(`Expected a value after ${flag}`);
		}
		options[option] = value;
	}

	return { options, remainingArgs };
}

export interface BuildContextOptions {
	cli?: BuildContextCliOptions;
	command?: 'build' | 'dev';
	mode?: string;
	root?: string;
	env?: Record<string, string | undefined>;
}

export interface ValidatedBuildContext {
	target: DeployTarget;
	targetDef: DeployTargetDefinition;
	distributionId: string;
	deploymentId: string;
	deploymentDef: DeploymentDefinition;
	profileId: string;
	profile: ChronosProfile;
	command: 'build' | 'dev';
	mode: string;
}

export async function resolveAndValidateBuildContext(
	options: BuildContextOptions = {}
): Promise<ValidatedBuildContext> {
	const env = options.env ?? process.env;
	const cli = options.cli ?? {};

	// 1. Resolve Deploy Target
	const rawTarget = cli.target ?? env.CHRONOS_DEPLOY_TARGET;
	const target = resolveDeployTarget(rawTarget);
	const targetDef = getDeployTargetDefinition(target);
	const distributionConfig = loadDistributionConfig();
	const distributionId =
		cli.distribution ?? env.CHRONOS_DISTRIBUTION ?? distributionConfig.defaults[target];
	const distribution = distributionConfig.distributions[distributionId];
	if (!distribution) throw new Error(`Unknown distribution: "${distributionId}"`);

	// 2. Resolve Deployment
	const deploymentId = cli.deployment ?? env.CHRONOS_DEPLOYMENT ?? distribution.deployment;
	const deploymentDef = DEPLOYMENTS[deploymentId];
	if (!deploymentDef) {
		throw new Error(
			`Unknown deployment: "${deploymentId}". Valid deployments: ${Object.keys(DEPLOYMENTS).join(', ')}`
		);
	}

	// 3. Resolve Profile
	const profileEnv: ProfileResolveEnv = {
		CHRONOS_PROFILE: cli.profile ?? env.CHRONOS_PROFILE ?? distribution.profile,
		CHRONOS_DEPLOY_TARGET: target
	};
	const profileId = profileEnv.CHRONOS_PROFILE ?? targetDef.defaultProfile;
	const profile = resolveProfile(profileId);

	// 4. Validate constraints
	// A. Deploy target adapterKind vs Server Plugins
	if (!targetDef.supportsServerPlugins && deploymentDef.serverPlugins.length > 0) {
		throw new Error(
			`Invalid build combination: Deploy target "${target}" does not support server plugins. ` +
				`Deployment "${deploymentId}" declares server plugins: [${deploymentDef.serverPlugins.join(', ')}].`
		);
	}

	// B. Profile preinstall plugins existence
	for (const entry of profile.preinstall) {
		if (!OFFICIAL_PLUGINS.some((plugin) => plugin.id === entry.id)) {
			throw new Error(`Unknown preinstall plugin in profile "${profileId}": "${entry.id}"`);
		}
	}

	// C. Deployment server plugins existence
	for (const serverPluginId of deploymentDef.serverPlugins) {
		if (!OFFICIAL_PLUGINS.some((plugin) => plugin.id === serverPluginId)) {
			throw new Error(`Unknown server plugin in deployment "${deploymentId}": "${serverPluginId}"`);
		}
	}
	const root = options.root ?? resolve(process.cwd());
	await resolveDeploymentServerPlugins(deploymentDef.serverPlugins, root);

	const command = options.command ?? 'build';
	const mode = options.mode ?? (command === 'dev' ? 'development' : 'production');

	return {
		target,
		targetDef,
		distributionId,
		deploymentId,
		deploymentDef,
		profileId,
		profile,
		command,
		mode
	};
}
