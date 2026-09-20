import { mkdtempSync, mkdirSync, writeFileSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { createHash } from 'node:crypto';
import { expect, it } from 'vite-plus/test';
import { preinstallPrecache } from './preinstall-precache';
it('precaches only profile assets, using deployed paths and downloader integrity queries', () => {
	const root = mkdtempSync(join(tmpdir(), 'chronos-precache-'));
	try {
		mkdirSync(join(root, 'static/official-plugins/manifests'), { recursive: true });
		mkdirSync(join(root, 'static/official-plugins/bundles/theme'), { recursive: true });
		writeFileSync(join(root, 'static/official-plugins/manifests/theme.manifest.json'), '{}');
		writeFileSync(join(root, 'static/official-plugins/bundles/theme/colors.json'), 'colors');
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
		const hash = createHash('sha256').update('colors').digest('hex');
		expect(entries.map((entry) => entry.url)).toEqual([
			'/Chronos/official-plugins/manifests/theme.manifest.json',
			`/Chronos/official-plugins/bundles/theme/colors.json?v=${hash.slice(0, 16)}`
		]);
		expect(entries[1]?.revision).toBe(hash);
	} finally {
		rmSync(root, { recursive: true, force: true });
	}
});
