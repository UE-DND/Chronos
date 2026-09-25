/// <reference types="node" />
import { runCommand, CommandError } from './run-command.ts';
import { rmSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { resolve } from 'node:path';
import { loadEnv } from 'vite';
import { buildAllOfficialPlugins } from '../../../scripts/official-plugin-build/build-all.ts';
import { buildAllOfficialPluginsDev } from '../../../scripts/official-plugin-build/build-all-dev.ts';
import { writeHostBuildContext } from '../../../scripts/official-plugin-build/host-context.ts';
import { resolveProfileId } from '../src/lib/profile-codegen/profile-definitions.ts';
import { resolveDeployTarget, getDeployTargetDefinition } from './build-config/deploy-targets.ts';

const webRoot = fileURLToPath(new URL('..', import.meta.url));
const root = resolve(webRoot, '../..');
const command = process.argv[2];
if (command !== 'build' && command !== 'dev') throw new Error('Expected build or dev');
const args = process.argv.slice(process.argv[3] === '--' ? 4 : 3);
const modeArg = args.findIndex((arg) => arg === '--mode' || arg === '-m');
const mode =
	(modeArg >= 0 ? args[modeArg + 1] : args.find((arg) => arg.startsWith('--mode='))?.slice(7)) ??
	(command === 'dev' ? 'development' : 'production');
process.env.NODE_ENV = command === 'dev' ? 'development' : 'production';
const loaded = loadEnv(mode, webRoot, '');
for (const [key, value] of Object.entries(loaded))
	if (/^(CHRONOS_|PUBLIC_|VITE_)/.test(key) && process.env[key] === undefined)
		process.env[key] = value;
const profileId = resolveProfileId();
const deployTarget = resolveDeployTarget();
const targetDef = getDeployTargetDefinition(deployTarget);
const deployment = process.env.CHRONOS_DEPLOYMENT ?? targetDef.defaultDeployment;
process.env.CHRONOS_PROFILE = profileId;
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
	writeHostBuildContext(
		root,
		{
			command,
			mode,
			profileId,
			deployment,
			base: targetDef.basePath,
			environment
		},
		results
	);
	process.env.CHRONOS_BUILD_CONTEXT = resolve(
		root,
		'dist/host-context',
		command,
		profileId,
		'context.json'
	);
	rmSync(resolve(webRoot, 'static/licenses/third-party.json'), { force: true });
	await runCommand('vp', [command, resolve(webRoot), ...args], webRoot);
}
try {
	await prepareAndRunHost(command);
} catch (error) {
	process.exitCode = error instanceof CommandError ? error.exitCode : 1;
	console.error(error instanceof Error ? error.message : error);
}
