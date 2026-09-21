import { spawn } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { expect, it } from 'vite-plus/test';

const runner = new URL('../../apps/web/scripts/run-command.ts', import.meta.url).href;
it.each(['SIGINT', 'SIGTERM', 'child-SIGTERM', 'failure', 'success'] as const)(
	'does not continue orchestration after %s',
	async (scenario) => {
		const childCode =
			scenario === 'success'
				? 'process.exit(0)'
				: scenario === 'failure'
					? 'process.exit(7)'
					: scenario === 'child-SIGTERM'
						? 'process.kill(process.pid,"SIGTERM")'
						: 'process.on("SIGTERM",()=>process.exit(0)); process.on("SIGINT",()=>process.exit(0)); console.log("READY"); setInterval(()=>{},1000);';
		const code = `import { runCommand } from ${JSON.stringify(runner)};
		try { await runCommand(process.execPath, ['-e', ${JSON.stringify(childCode)}], process.cwd()); console.log('NEXT_STAGE'); }
		catch(error) { process.exitCode = error.exitCode ?? 1; }`;
		const parent = spawn(
			process.execPath,
			['--experimental-strip-types', '--input-type=module', '-e', code],
			{
				cwd: fileURLToPath(new URL('../..', import.meta.url)),
				stdio: ['ignore', 'pipe', 'pipe']
			}
		);
		let output = '';
		parent.stdout.on('data', (data) => {
			output += String(data);
			if (output.includes('READY') && (scenario === 'SIGINT' || scenario === 'SIGTERM'))
				parent.kill(scenario);
		});
		const timer = setTimeout(() => parent.kill('SIGKILL'), 8000);
		try {
			const status = await new Promise<number | null>((done, reject) => {
				parent.on('error', reject);
				parent.on('close', done);
			});
			expect(status).toBe(
				scenario === 'success' ? 0 : scenario === 'failure' ? 7 : scenario === 'SIGINT' ? 130 : 143
			);
			expect(output.includes('NEXT_STAGE')).toBe(scenario === 'success');
		} finally {
			clearTimeout(timer);
		}
	},
	10_000
);
