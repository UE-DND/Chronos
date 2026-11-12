import { beforeEach, expect, it, vi } from 'vite-plus/test';
import { fileURLToPath } from 'node:url';
import { runCommand } from './run-command.ts';
import { deployCloudflare } from './deploy-cloudflare.ts';

vi.mock('./run-command.ts', async (importOriginal) => ({
	...(await importOriginal<typeof import('./run-command.ts')>()),
	runCommand: vi.fn()
}));

const webRoot = fileURLToPath(new URL('../', import.meta.url));
const runHost = fileURLToPath(new URL('./run-host.ts', import.meta.url));

beforeEach(() => {
	vi.mocked(runCommand).mockReset();
	vi.mocked(runCommand).mockResolvedValue();
});

it('routes distribution to the build and deployment metadata to Wrangler in the same directory', async () => {
	await deployCloudflare([
		'--',
		'--distribution',
		'cqut',
		'--branch',
		'master',
		'--commit-dirty=false',
		'--commit-hash=abc',
		'--commit-message=v1.3.3'
	]);
	expect(vi.mocked(runCommand).mock.calls).toEqual([
		[
			process.execPath,
			[
				'--experimental-strip-types',
				runHost,
				'build',
				'--target',
				'cloudflare',
				'--distribution',
				'cqut'
			],
			webRoot
		],
		[
			'vpx',
			[
				'wrangler',
				'pages',
				'deploy',
				'.svelte-kit/cloudflare',
				'--branch',
				'master',
				'--commit-dirty=false',
				'--commit-hash=abc',
				'--commit-message=v1.3.3'
			],
			webRoot
		]
	]);
});

it('keeps default distribution and deployment metadata unset when no CLI overrides are provided', async () => {
	await deployCloudflare([]);
	expect(vi.mocked(runCommand).mock.calls[0]?.[1]).toEqual([
		'--experimental-strip-types',
		runHost,
		'build',
		'--target',
		'cloudflare'
	]);
	expect(vi.mocked(runCommand).mock.calls[1]?.[1]).toEqual([
		'wrangler',
		'pages',
		'deploy',
		'.svelte-kit/cloudflare'
	]);
});

it('does not upload after a failed or cancelled build', async () => {
	vi.mocked(runCommand).mockRejectedValueOnce(new Error('Build cancelled'));
	await expect(deployCloudflare(['--distribution=cqut'])).rejects.toThrow('Build cancelled');
	expect(runCommand).toHaveBeenCalledTimes(1);
});

it('rejects a different target before building or uploading', async () => {
	await expect(deployCloudflare(['--target', 'vercel'])).rejects.toThrow('cloudflare target');
	expect(runCommand).not.toHaveBeenCalled();
});
