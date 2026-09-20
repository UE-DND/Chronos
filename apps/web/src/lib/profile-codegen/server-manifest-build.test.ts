import { describe, expect, it } from 'vite-plus/test';
import { fileURLToPath } from 'node:url';
import { OFFICIAL_PLUGINS } from '../../../../../scripts/official-plugins.config';
import {
	buildDevManifestForPlugin,
	buildManifestForPlugin
} from '../../../../../scripts/official-plugin-build/build-manifest';
import { resolveOfficialServerPlugin } from '../../../../../scripts/official-plugin-build/server-definition';

describe('official server capability manifests', () => {
	it('uses package metadata in production and development', async () => {
		const plugin = OFFICIAL_PLUGINS.find((entry) => entry.id === 'source-cqut')!;
		const root = fileURLToPath(new URL('../../../../../', import.meta.url));
		const serverPlugin = await resolveOfficialServerPlugin(plugin, root, true);
		const assets = {
			code: 'export default {}',
			cssCode: null,
			colorsJson: null,
			iconThemeJson: null
		};
		const release = buildManifestForPlugin(plugin, assets, 'test', serverPlugin);
		const dev = buildDevManifestForPlugin(plugin, assets, 'test', 'rev1', serverPlugin);
		expect(release.optionalServerCapabilities).toEqual([
			{ pluginId: 'source-cqut', action: 'preview' }
		]);
		expect(dev.optionalServerCapabilities).toEqual(release.optionalServerCapabilities);
	});
});
