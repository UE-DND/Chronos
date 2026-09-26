import { afterEach, describe, expect, it } from 'vite-plus/test';
import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { existsSync, mkdtempSync, readFileSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { createHostIdentity } from './host-identity.ts';
import { resolveAndValidateBuildContext } from './build-context.ts';
import { emitProfileArtifacts } from '../../src/lib/profile-codegen/chronos-profile-plugin.ts';

const repositoryRoot = resolve(fileURLToPath(new URL('.', import.meta.url)), '../../../..');

describe('build assembly and host identity consistency', () => {
	let tempWebRoot = '';

	afterEach(() => {
		if (tempWebRoot) rmSync(tempWebRoot, { recursive: true, force: true });
		tempWebRoot = '';
	});

	it('creates host identity matching validated build context', async () => {
		const context = await resolveAndValidateBuildContext({
			root: repositoryRoot,
			env: {
				CHRONOS_DEPLOY_TARGET: 'vercel',
				CHRONOS_DEPLOYMENT: 'chronos-cqut',
				CHRONOS_PROFILE: 'chronos-cqut'
			}
		});

		const identity = createHostIdentity(repositoryRoot, context);

		expect(identity.target).toBe('vercel');
		expect(identity.deploymentId).toBe('chronos-cqut');
		expect(identity.profileId).toBe('chronos-cqut');
		expect(identity.buildId).toMatch(/^[a-f0-9]{64}$/);
		expect(identity.sourceCommit).toBeTruthy();
		expect(identity.version).toBeTruthy();
	});

	it('produces distinct buildIds when build axis changes', async () => {
		const baseContext = await resolveAndValidateBuildContext({
			root: repositoryRoot,
			env: {
				CHRONOS_DEPLOY_TARGET: 'vercel',
				CHRONOS_DEPLOYMENT: 'chronos-default',
				CHRONOS_PROFILE: 'chronos-default'
			}
		});

		const cqutContext = await resolveAndValidateBuildContext({
			root: repositoryRoot,
			env: {
				CHRONOS_DEPLOY_TARGET: 'vercel',
				CHRONOS_DEPLOYMENT: 'chronos-cqut',
				CHRONOS_PROFILE: 'chronos-cqut'
			}
		});

		const baseIdentity = createHostIdentity(repositoryRoot, baseContext);
		const cqutIdentity = createHostIdentity(repositoryRoot, cqutContext);

		expect(baseIdentity.buildId).not.toBe(cqutIdentity.buildId);
	});

	describe('static deployment constraints (ADR 0044 & ADR 0046)', () => {
		it('enforces that online Vercel deployment supports server plugins', async () => {
			const context = await resolveAndValidateBuildContext({
				root: repositoryRoot,
				env: {
					CHRONOS_DEPLOY_TARGET: 'vercel',
					CHRONOS_DEPLOYMENT: 'chronos-cqut'
				}
			});

			expect(context.targetDef.supportsServerPlugins).toBe(true);
			expect(context.deploymentDef.serverPlugins).toContain('source-cqut');
		});

		it('enforces that offline Vercel deployment has no server plugins', async () => {
			const context = await resolveAndValidateBuildContext({
				root: repositoryRoot,
				env: {
					CHRONOS_DEPLOY_TARGET: 'vercel',
					CHRONOS_DEPLOYMENT: 'chronos-cqut-offline'
				}
			});

			expect(context.deploymentDef.serverPlugins).toEqual([]);
		});

		it('enforces that static pages target rejects server plugin deployment', async () => {
			await expect(
				resolveAndValidateBuildContext({
					root: repositoryRoot,
					env: {
						CHRONOS_DEPLOY_TARGET: 'pages',
						CHRONOS_DEPLOYMENT: 'chronos-cqut'
					}
				})
			).rejects.toThrow(/does not support server plugins/i);
		});

		it('enforces that mobile target rejects server plugin deployment', async () => {
			await expect(
				resolveAndValidateBuildContext({
					root: repositoryRoot,
					env: {
						CHRONOS_DEPLOY_TARGET: 'mobile',
						CHRONOS_DEPLOYMENT: 'chronos-cqut'
					}
				})
			).rejects.toThrow(/does not support server plugins/i);
		});
	});

	describe('profile artifact generation with explicit options', () => {
		it('generates server proxy and route when deployment has server plugins', async () => {
			tempWebRoot = mkdtempSync(resolve(tmpdir(), 'chronos-assembly-test-'));

			await emitProfileArtifacts(tempWebRoot, {
				profileId: 'chronos-cqut',
				deploymentId: 'chronos-cqut',
				repositoryRoot
			});

			const registryPath = resolve(tempWebRoot, 'src/lib/boot/plugin-proxy-meta.generated.ts');
			const loaderPath = resolve(tempWebRoot, 'src/lib/server/plugin-server-loader.generated.ts');
			const routePath = resolve(
				tempWebRoot,
				'src/routes/api/plugins/[pluginId]/[...action]/+server.ts'
			);

			expect(existsSync(registryPath)).toBe(true);
			expect(existsSync(loaderPath)).toBe(true);
			expect(existsSync(routePath)).toBe(true);

			const registry = readFileSync(registryPath, 'utf8');
			expect(registry).toContain('source-cqut');
		});

		it('removes catch-all route when deployment has no server plugins', async () => {
			tempWebRoot = mkdtempSync(resolve(tmpdir(), 'chronos-assembly-test-'));

			// First emit with server plugins
			await emitProfileArtifacts(tempWebRoot, {
				profileId: 'chronos-cqut',
				deploymentId: 'chronos-cqut',
				repositoryRoot
			});

			const routePath = resolve(
				tempWebRoot,
				'src/routes/api/plugins/[pluginId]/[...action]/+server.ts'
			);
			expect(existsSync(routePath)).toBe(true);

			// Then emit with default (offline) deployment
			await emitProfileArtifacts(tempWebRoot, {
				profileId: 'chronos-default',
				deploymentId: 'chronos-default',
				repositoryRoot
			});

			expect(existsSync(routePath)).toBe(false);
		});
	});
});
