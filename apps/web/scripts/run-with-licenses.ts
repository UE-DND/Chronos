/// <reference types="node" />

import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const webRoot = fileURLToPath(new URL('..', import.meta.url));
const profileScript = fileURLToPath(new URL('./emit-profile-artifacts.ts', import.meta.url));
const command = process.argv[2];

if (command !== 'build' && command !== 'dev') {
	throw new Error('Expected build or dev');
}

function run(binary: string, args: string[], env: NodeJS.ProcessEnv): void {
	const result = spawnSync(binary, args, { cwd: webRoot, env, stdio: 'inherit' });
	if (result.error) throw result.error;
	if (result.status !== 0) process.exit(result.status ?? 1);
}

run(process.execPath, ['--experimental-strip-types', profileScript], process.env);
// The first build discovers bundled dependencies before Vite copies static assets in the final build.
run('vp', ['build', '.'], { ...process.env, CHRONOS_LICENSE_PREPASS: '1' });

const env: NodeJS.ProcessEnv = { ...process.env, CHRONOS_LICENSE_READY: '1' };
delete env.CHRONOS_LICENSE_PREPASS;
const args = process.argv.slice(3);
run('vp', [command, '.', ...(args[0] === '--' ? args.slice(1) : args)], env);
