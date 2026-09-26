import { mkdtempSync, mkdirSync, writeFileSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { createHash } from 'node:crypto';
import { expect, it } from 'vite-plus/test';
import { preinstallPrecache } from './preinstall-precache';
it('precaches only profile assets, using deployed paths and downloader integrity queries', () => {
	const root = mkdtempSync(join(tmpdir(), 'chronos-precache-'));
	try {
		mkdirSync(join(root, 'static/official-plugins/manifests/revision'), { recursive: true });
		mkdirSync(join(root, 'static/official-plugins/bundles/theme/revision'), { recursive: true });
		writeFileSync(
			join(root, 'static/official-plugins/catalog.json'),
			JSON.stringify({
				version: 1,
				manifests: ['./manifests/revision/theme.manifest.json']
			})
		);
		writeFileSync(
			join(root, 'static/official-plugins/manifests/revision/theme.manifest.json'),
			JSON.stringify({ colorsUrl: '../../bundles/theme/revision/colors.json' })
		);
		writeFileSync(
			join(root, 'static/official-plugins/bundles/theme/revision/colors.json'),
			'{"id":"color"}'
		);
		const entries = preinstallPrecache(
			root,
			{
				profileId: 'test',
				name: 'Test',
				defaultTheme: { pluginId: 'theme', themeId: 'color' },
				preinstall: [{ id: 'theme' }]
			},
			'/Chronos'
		);
		const hash = createHash('sha256').update('{"id":"color"}').digest('hex');
		expect(entries.map((entry) => entry.url)).toEqual([
			'/Chronos/official-plugins/catalog.json',
			'/Chronos/official-plugins/manifests/revision/theme.manifest.json',
			`/Chronos/official-plugins/bundles/theme/revision/colors.json?v=${hash.slice(0, 16)}`
		]);
		expect(entries[2]?.revision).toBe(hash);
	} finally {
		rmSync(root, { recursive: true, force: true });
	}
});
