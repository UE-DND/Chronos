import { describe, expect, it } from 'vite-plus/test';
import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { parseBuildCliArgs, resolveAndValidateBuildContext } from './build-context.ts';

const repositoryRoot = resolve(fileURLToPath(new URL('.', import.meta.url)), '../../../..');

describe('build-context', () => {
	describe('resolveAndValidateBuildContext', () => {
		it('resolves valid vercel defaults', async () => {
			const context = await resolveAndValidateBuildContext({ env: {} });

			expect(context.target).toBe('vercel');
			expect(context.distributionId).toBe('default');
			expect(context.deploymentId).toBe('chronos-default');
			expect(context.profileId).toBe('chronos-default');
			expect(context.deploymentDef.serverPlugins).toEqual([]);
			expect(context.targetDef.adapterKind).toBe('vercel');
		});

		it('validates server plugin exports from the repository root', async () => {
			const context = await resolveAndValidateBuildContext({
				root: repositoryRoot,
				env: {
					CHRONOS_DEPLOY_TARGET: 'vercel',
					CHRONOS_DEPLOYMENT: 'chronos-cqut'
				}
			});
			expect(context.deploymentDef.serverPlugins).toEqual(['source-cqut']);
		});

		it('resolves valid pages defaults', async () => {
			const context = await resolveAndValidateBuildContext({
				env: { CHRONOS_DEPLOY_TARGET: 'pages' }
			});

			expect(context.target).toBe('pages');
			expect(context.distributionId).toBe('pages');
			expect(context.deploymentId).toBe('pages');
			expect(context.profileId).toBe('chronos-default');
			expect(context.deploymentDef.serverPlugins).toEqual([]);
			expect(context.targetDef.adapterKind).toBe('static-pages');
		});

		it('resolves valid mobile defaults', async () => {
			const context = await resolveAndValidateBuildContext({
				env: { CHRONOS_DEPLOY_TARGET: 'mobile' }
			});

			expect(context.target).toBe('mobile');
			expect(context.distributionId).toBe('mobile');
			expect(context.deploymentId).toBe('mobile');
			expect(context.profileId).toBe('chronos-default');
			expect(context.deploymentDef.serverPlugins).toEqual([]);
			expect(context.targetDef.adapterKind).toBe('static-spa');
		});

		it('allows mobile target with compatible profile override', async () => {
			const context = await resolveAndValidateBuildContext({
				env: {
					CHRONOS_DEPLOY_TARGET: 'mobile',
					CHRONOS_PROFILE: 'chronos-cqut-offline'
				}
			});

			expect(context.target).toBe('mobile');
			expect(context.profileId).toBe('chronos-cqut-offline');
			expect(context.deploymentId).toBe('mobile');
			expect(context.deploymentDef.serverPlugins).toEqual([]);
		});

		it('applies environment axis overrides over a selected distribution', async () => {
			const context = await resolveAndValidateBuildContext({
				env: {
					CHRONOS_DISTRIBUTION: 'cqut',
					CHRONOS_DEPLOYMENT: 'chronos-default'
				}
			});

			expect(context.profileId).toBe('chronos-cqut');
			expect(context.deploymentId).toBe('chronos-default');
		});

		it('resolves the CQUT and offline distributions', async () => {
			const online = await resolveAndValidateBuildContext({
				root: repositoryRoot,
				env: { CHRONOS_DISTRIBUTION: 'cqut' }
			});
			const offline = await resolveAndValidateBuildContext({
				env: { CHRONOS_DISTRIBUTION: 'cqut-offline' }
			});

			expect(online.profileId).toBe('chronos-cqut');
			expect(online.deploymentId).toBe('chronos-cqut');
			expect(offline.profileId).toBe('chronos-cqut-offline');
			expect(offline.deploymentId).toBe('chronos-cqut-offline');
		});

		it('applies CLI axis overrides over environment and distribution values', async () => {
			const context = await resolveAndValidateBuildContext({
				root: repositoryRoot,
				cli: { distribution: 'cqut', profile: 'chronos-default' },
				env: {
					CHRONOS_DISTRIBUTION: 'cqut-offline',
					CHRONOS_PROFILE: 'chronos-cqut-offline'
				}
			});

			expect(context.distributionId).toBe('cqut');
			expect(context.profileId).toBe('chronos-default');
			expect(context.deploymentId).toBe('chronos-cqut');
		});

		it('rejects an unknown distribution', async () => {
			await expect(
				resolveAndValidateBuildContext({ env: { CHRONOS_DISTRIBUTION: 'missing' } })
			).rejects.toThrowError(/Unknown distribution: "missing"/);
		});

		it('rejects an incompatible distribution and target', async () => {
			await expect(
				resolveAndValidateBuildContext({
					env: {
						CHRONOS_DISTRIBUTION: 'cqut',
						CHRONOS_DEPLOY_TARGET: 'pages'
					}
				})
			).rejects.toThrowError(/does not support server plugins/);
		});

		it('throws when mobile target is combined with server-enabled deployment', async () => {
			await expect(
				resolveAndValidateBuildContext({
					env: {
						CHRONOS_DEPLOY_TARGET: 'mobile',
						CHRONOS_DEPLOYMENT: 'chronos-cqut'
					}
				})
			).rejects.toThrowError(
				/Invalid build combination: Deploy target "mobile" does not support server plugins/
			);
		});

		it('throws when pages target is combined with server-enabled deployment', async () => {
			await expect(
				resolveAndValidateBuildContext({
					env: {
						CHRONOS_DEPLOY_TARGET: 'pages',
						CHRONOS_DEPLOYMENT: 'chronos-cqut'
					}
				})
			).rejects.toThrowError(
				/Invalid build combination: Deploy target "pages" does not support server plugins/
			);
		});

		it('throws for unknown deployment', async () => {
			await expect(
				resolveAndValidateBuildContext({
					env: { CHRONOS_DEPLOYMENT: 'unknown-dep' }
				})
			).rejects.toThrowError(/Unknown deployment: "unknown-dep"/);
		});

		it('throws for unknown profile', async () => {
			await expect(
				resolveAndValidateBuildContext({
					env: { CHRONOS_PROFILE: 'unknown-prof' }
				})
			).rejects.toThrowError(/Unknown profile: unknown-prof/);
		});
	});
});

describe('parseBuildCliArgs', () => {
	it('extracts Chronos options and preserves arguments for Vite', () => {
		expect(
			parseBuildCliArgs([
				'--distribution=cqut',
				'--target',
				'pages',
				'--profile',
				'chronos-default',
				'--mode',
				'production'
			])
		).toEqual({
			options: {
				distribution: 'cqut',
				target: 'pages',
				profile: 'chronos-default'
			},
			remainingArgs: ['--mode', 'production']
		});
	});

	it('requires values for recognized options', () => {
		expect(() => parseBuildCliArgs(['--distribution'])).toThrowError(
			'Expected a value after --distribution'
		);
	});
});
