import { spawnSync } from 'node:child_process';

export function defaultBuildOfficialPlugins(
	monorepoRoot: string,
	scriptPath: string,
	reason: string
): void {
	console.log(`[chronos-official-plugins] ${reason}, building official plugins...`);
	const result = spawnSync(process.execPath, ['--experimental-strip-types', scriptPath], {
		cwd: monorepoRoot,
		stdio: 'inherit'
	});
	if (result.status !== 0) {
		throw new Error(`Failed to build official plugins: exit code ${result.status}`);
	}
}
