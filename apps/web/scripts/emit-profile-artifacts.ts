import { compile } from '@inlang/paraglide-js';
import { createStorageNamespace } from '../../../packages/core/src/constants/storage-namespace.ts';
import {
	getDeployTargetDefinition,
	resolveDeployTarget
} from '../src/lib/config/deploy-targets.ts';
import { execSync } from 'node:child_process';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { emitProfileArtifacts } from '../src/lib/profile-codegen/chronos-profile-plugin.ts';

const webRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const svelteKitBin = path.join(webRoot, 'node_modules/.bin/svelte-kit');
await emitProfileArtifacts(webRoot);
await compile({
	project: path.join(webRoot, 'project.inlang'),
	outdir: path.join(webRoot, 'src/lib/paraglide'),
	emitTsDeclarations: true,
	cookieName: createStorageNamespace(getDeployTargetDefinition(resolveDeployTarget()).basePath)
		.localeCookie
});
execSync(`"${svelteKitBin}" sync`, { cwd: webRoot, stdio: 'inherit' });
