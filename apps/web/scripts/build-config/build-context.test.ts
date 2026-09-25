import { describe, expect, it } from 'vite-plus/test';
import { resolveAndValidateBuildContext } from './build-context.ts';

describe('build-context', () => {
	describe('resolveAndValidateBuildContext', () => {
		it('resolves valid vercel defaults', async () => {
			const context = await resolveAndValidateBuildContext({ env: {} });

			expect(context.target).toBe('vercel');
			expect(context.deploymentId).toBe('chronos-default');
			expect(context.profileId).toBe('chronos-default');
			expect(context.deploymentDef.serverPlugins).toEqual([]);
			expect(context.targetDef.adapterKind).toBe('vercel');
		});

		it('validates server plugin exports from the repository root', async () => {
			const context = await resolveAndValidateBuildContext({
				root: process.cwd(),
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
