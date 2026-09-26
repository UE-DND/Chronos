/// <reference types="node" />
import { finalizeWorkerArtifacts } from './build-config/worker-artifacts.ts';
import { createHostIdentity } from './build-config/host-identity.ts';
import { runCommand, CommandError } from './run-command.ts';
import { rmSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { resolve } from 'node:path';
import { loadEnv } from 'vite';
import { verifyHostPlugins } from '../../../scripts/official-plugin-build/verify-host-plugins.ts';
import { bundlePreinstall } from '../../../scripts/official-plugin-build/bundle-preinstall.ts';
import { buildAllOfficialPlugins } from '../../../scripts/official-plugin-build/build-all.ts';
import { buildAllOfficialPluginsDev } from '../../../scripts/official-plugin-build/build-all-dev.ts';
import { writeHostBuildContext } from '../../../scripts/official-plugin-build/host-context.ts';
import { parseBuildCliArgs, resolveAndValidateBuildContext } from './build-config/build-context.ts';

const webRoot = fileURLToPath(new URL('..', import.meta.url));
const root = resolve(webRoot, '../..');
const command = process.argv[2];
if (command !== 'build' && command !== 'dev') throw new Error('Expected build or dev');
const rawArgs = process.argv.slice(process.argv[3] === '--' ? 4 : 3);
const { options: cliOptions, remainingArgs: args } = parseBuildCliArgs(rawArgs);
const modeArg = args.findIndex((arg) => arg === '--mode' || arg === '-m');

const mode =
	(modeArg >= 0 ? args[modeArg + 1] : args.find((arg) => arg.startsWith('--mode='))?.slice(7)) ??
	(command === 'dev' ? 'development' : 'production');
process.env.NODE_ENV = command === 'dev' ? 'development' : 'production';
const loaded = loadEnv(mode, webRoot, '');
for (const [key, value] of Object.entries(loaded))
	if (/^(CHRONOS_|PUBLIC_|VITE_)/.test(key) && process.env[key] === undefined)
		process.env[key] = value;

const buildContext = await resolveAndValidateBuildContext({
	cli: cliOptions,
	root,
	command,
	mode
});

process.env.CHRONOS_DEPLOY_TARGET = buildContext.target;
process.env.CHRONOS_DEPLOYMENT = buildContext.deploymentId;
process.env.CHRONOS_PROFILE = buildContext.profileId;
process.env.CHRONOS_DISTRIBUTION = buildContext.distributionId;

const environment = Object.fromEntries(
	Object.entries(process.env).filter(
		(entry): entry is [string, string] =>
			/^(PUBLIC_|CHRONOS_)/.test(entry[0]) &&
			entry[0] !== 'CHRONOS_BUILD_CONTEXT' &&
			entry[1] !== undefined
	)
);
async function prepareAndRunHost(command: 'build' | 'dev') {
	await runCommand(
		process.execPath,
		['--experimental-strip-types', resolve(webRoot, 'scripts/emit-profile-artifacts.ts')],
		webRoot
	);
	const results =
		command === 'dev'
			? await buildAllOfficialPluginsDev({ root, environment })
			: await buildAllOfficialPlugins({ root, environment });
	if (command === 'build')
		bundlePreinstall(
			resolve(root, 'dist/plugin-market'),
			resolve(webRoot, 'static/official-plugins'),
			buildContext.profile.preinstall.map((plugin) => plugin.id)
		);
	writeHostBuildContext(
		root,
		{
			command,
			mode,
			profileId: buildContext.profileId,
			deployment: buildContext.deploymentId,
			base: buildContext.targetDef.basePath,
			environment
		},
		results
	);
	process.env.CHRONOS_BUILD_CONTEXT = resolve(
		root,
		'dist/host-context',
		command,
		buildContext.profileId,
		'context.json'
	);
	rmSync(resolve(webRoot, 'static/licenses/third-party.json'), { force: true });
	await runCommand('vp', [command, resolve(webRoot), ...args], webRoot);
	if (command === 'build') {
		finalizeWorkerArtifacts(
			resolve(webRoot, buildContext.target === 'vercel' ? '.vercel/output/static' : 'build'),
			createHostIdentity(root, buildContext),
			buildContext.targetDef.basePath
		);
		verifyHostPlugins(
			resolve(webRoot, buildContext.target === 'vercel' ? '.vercel/output/static' : 'build'),
			buildContext.profileId
		);
	}
}
try {
	await prepareAndRunHost(command);
} catch (error) {
	process.exitCode = error instanceof CommandError ? error.exitCode : 1;
	console.error(error instanceof Error ? error.message : error);
}
