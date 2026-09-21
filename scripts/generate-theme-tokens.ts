import { fileURLToPath } from 'node:url';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { buildDefaultThemeCss } from './generate-default-theme.ts';
import { preparePluginResources } from './official-plugin-build/prepare-resources.ts';
import { writeChanged } from './official-plugin-build/cache.ts';
import { OFFICIAL_PLUGINS } from './official-plugins.config.ts';
import {
	resolveProfile,
	resolveProfileId
} from '../apps/web/src/lib/profile-codegen/profile-definitions.ts';
const root = fileURLToPath(new URL('..', import.meta.url));
const selection = resolveProfile(resolveProfileId()).defaultTheme;
const plugin = OFFICIAL_PLUGINS.find((entry) => entry.id === selection.pluginId);
if (!plugin) throw new Error('Unknown default theme');
const resources = await preparePluginResources(plugin, root);
if (!resources.colorsJson) throw new Error('Default theme requires colors');
const colors = readFileSync(resources.colorsJson, 'utf8');
if (plugin.colorsJson) writeChanged(plugin.colorsJson, colors);
writeChanged(
	resolve(root, 'apps/web/src/lib/theme/generated-colors.css'),
	buildDefaultThemeCss(JSON.parse(colors), selection.themeId)
);
