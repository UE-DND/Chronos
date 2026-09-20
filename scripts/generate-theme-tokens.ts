import { fileURLToPath } from 'node:url';
import { buildAllOfficialPlugins } from './official-plugin-build/build-all.ts';
import { writeDefaultThemeCss } from './generate-default-theme.ts';
import {
	resolveProfile,
	resolveProfileId
} from '../apps/web/src/lib/profile-codegen/profile-definitions.ts';
const root = fileURLToPath(new URL('..', import.meta.url));
await buildAllOfficialPlugins({ root });
writeDefaultThemeCss(root, resolveProfile(resolveProfileId()).defaultTheme);
