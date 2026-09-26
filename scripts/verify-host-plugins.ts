import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { marketFiles, listMarketFiles } from './official-plugin-build/market-files.ts';
import { verifyOfficialPlugins } from './verify-official-plugins.ts';
import { resolveProfile } from '../apps/web/src/lib/profile-codegen/profile-definitions.ts';

export function verifyHostPlugins(publicRoot: string, profileId: string): void {
	const market = resolve(publicRoot, 'official-plugins');
	verifyOfficialPlugins(market);
	const { ids, files } = marketFiles(market);
	const expected = resolveProfile(profileId)
		.preinstall.map((plugin) => plugin.id)
		.sort();
	if (JSON.stringify(ids.sort()) !== JSON.stringify(expected))
		throw new Error(`Host plugin resources do not match ${profileId}`);
	const actual = listMarketFiles(market);
	if (JSON.stringify(files) !== JSON.stringify(actual))
		throw new Error('Host contains unreferenced plugin resources');
}
if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
	if (!process.argv[2] || !process.argv[3])
		throw new Error('Usage: verify-host-plugins.ts <public-root> <profile-id>');
	verifyHostPlugins(process.argv[2], process.argv[3]);
}
