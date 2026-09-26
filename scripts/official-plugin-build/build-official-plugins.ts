import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { bundlePreinstall } from './bundle-preinstall.ts';
import {
	resolveProfile,
	resolveProfileId
} from '../../apps/web/src/lib/profile-codegen/profile-definitions.ts';
import { buildAllOfficialPlugins } from './build-all.ts';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '../..');

await buildAllOfficialPlugins({ root });
bundlePreinstall(
	resolve(root, 'dist/plugin-market'),
	resolve(root, 'apps/web/static/official-plugins'),
	resolveProfile(resolveProfileId()).preinstall.map((plugin) => plugin.id)
);
