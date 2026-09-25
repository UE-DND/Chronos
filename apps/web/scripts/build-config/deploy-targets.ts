import adapterVercel from '@sveltejs/adapter-vercel';
import adapterStatic from '@sveltejs/adapter-static';
import type { DeployTargetDefinition } from '../../src/lib/config/deploy-targets.ts';

export * from '../../src/lib/config/deploy-targets.ts';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function createDeployTargetAdapter(def: DeployTargetDefinition): any {
	switch (def.adapterKind) {
		case 'static-spa':
			return adapterStatic({ fallback: 'index.html', strict: false });
		case 'static-pages':
			return adapterStatic({ fallback: '404.html' });
		case 'vercel':
			return adapterVercel({ maxDuration: 60, regions: ['sin1'] });
	}
}
