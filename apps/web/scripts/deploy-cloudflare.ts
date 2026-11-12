import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { parseBuildCliArgs } from './build-config/build-context.ts';
import { getDeployTargetDefinition } from './build-config/deploy-targets.ts';
import { runCommand, CommandError } from './run-command.ts';

const webRoot = fileURLToPath(new URL('../', import.meta.url));

/** Build distribution arguments belong to Chronos; upload metadata belongs to Wrangler. */
export async function deployCloudflare(argv: string[]): Promise<void> {
	const { options, remainingArgs } = parseBuildCliArgs(argv);
	if (options.target && options.target !== 'cloudflare') {
		throw new Error('Cloudflare deployment requires the cloudflare target');
	}
	const buildArgs = Object.entries(options).flatMap(([key, value]) =>
		key === 'target' ? [] : [`--${key}`, value]
	);
	await runCommand(
		process.execPath,
		[
			'--experimental-strip-types',
			fileURLToPath(new URL('./run-host.ts', import.meta.url)),
			'build',
			'--target',
			'cloudflare',
			...buildArgs
		],
		webRoot
	);
	await runCommand(
		'vpx',
		[
			'wrangler',
			'pages',
			'deploy',
			getDeployTargetDefinition('cloudflare').staticOutputDir,
			...remainingArgs
		],
		webRoot
	);
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
	try {
		await deployCloudflare(process.argv.slice(2));
	} catch (error) {
		process.exitCode = error instanceof CommandError ? error.exitCode : 1;
		console.error(error instanceof Error ? error.message : error);
	}
}
