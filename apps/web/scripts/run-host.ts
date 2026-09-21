/// <reference types="node" />
import { spawn } from 'node:child_process';
import { rmSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { resolve } from 'node:path';
import { loadEnv } from 'vite';
import { buildAllOfficialPlugins } from '../../../scripts/official-plugin-build/build-all.ts';
import { buildAllOfficialPluginsDev } from '../../../scripts/official-plugin-build/build-all-dev.ts';
import { writeHostBuildContext } from '../../../scripts/official-plugin-build/host-context.ts';
import { resolveProfileId } from '../src/lib/profile-codegen/profile-definitions.ts';
import { resolveDeployment } from '../src/lib/profile-codegen/deployment-definitions.ts';

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
const deployment =
	process.env.CHRONOS_DEPLOYMENT ??
	(process.env.CHRONOS_DEPLOY_TARGET === 'pages' ? 'pages' : 'chronos-cqut');
resolveDeployment();
process.env.CHRONOS_PROFILE = profileId;
const environment = Object.fromEntries(
	Object.entries(process.env).filter(
		(entry): entry is [string, string] =>
			/^(PUBLIC_|CHRONOS_)/.test(entry[0]) &&
			entry[0] !== 'CHRONOS_BUILD_CONTEXT' &&
			entry[1] !== undefined
	)
);
async function run(binary: string, argv: string[]): Promise<void> {
	const child = spawn(binary, argv, { cwd: webRoot, env: process.env, stdio: 'inherit' });
	const stop = () => child.kill('SIGTERM');
	process.once('SIGTERM', stop);
	process.once('SIGINT', stop);
	try {
		await new Promise<void>((done, reject) => {
			child.on('error', reject);
			child.on('close', (status, signal) =>
				status === 0 || signal === 'SIGTERM'
					? done()
					: reject(new Error(`${binary} failed (${status ?? signal})`))
			);
		});
	} finally {
		process.off('SIGTERM', stop);
		process.off('SIGINT', stop);
	}
}
await run(process.execPath, [
	'--experimental-strip-types',
	resolve(webRoot, 'scripts/emit-profile-artifacts.ts')
]);
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
		base: process.env.CHRONOS_DEPLOY_TARGET === 'pages' ? '/Chronos' : '',
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
await run('vp', [command, '.', ...args]);
