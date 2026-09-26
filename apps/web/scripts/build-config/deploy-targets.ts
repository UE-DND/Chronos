import { resolve } from 'node:path';
import type { Adapter } from '@sveltejs/kit';
import adapterVercel from '@sveltejs/adapter-vercel';
import adapterStatic from '@sveltejs/adapter-static';
import type { DeployTargetDefinition } from '../../src/lib/config/deploy-targets.ts';

export * from '../../src/lib/config/deploy-targets.ts';

export function createDeployTargetAdapter(def: DeployTargetDefinition, buildId?: string): Adapter {
	const adapter =
		def.adapterKind === 'static-spa'
			? adapterStatic({ fallback: 'index.html', strict: false })
			: def.adapterKind === 'static-pages'
				? adapterStatic({ fallback: '404.html' })
				: adapterVercel({ maxDuration: 60, regions: ['sin1'] });
	return {
		...adapter,
		async adapt(builder) {
			if (!def.isMobile && buildId) builder.generateEnvModule();
			await adapter.adapt(builder);
			if (def.isMobile || !buildId) return;
			const output = resolve(def.target === 'vercel' ? '.vercel/output/static' : 'build');
			await builder.generateFallback(resolve(output, `_chronos/${buildId}/shell.html`));
		}
	};
}
