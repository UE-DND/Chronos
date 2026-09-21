import { readFileSync } from 'node:fs';
import type { Plugin } from 'vite';
import { collectBundledLicenses, readPublishedPluginLicenses } from './bundled-licenses.ts';
import {
	formatThirdPartyLicenses,
	type BundledLicenseInfo
} from './third-party-license-generator.ts';
import { readHostBuildContext } from '../../../../../scripts/official-plugin-build/host-context.ts';

export function chronosLicensePlugin(webRoot: string): Plugin {
	return {
		name: 'chronos-third-party-licenses',
		apply: 'build',
		configEnvironment(name) {
			if (name !== 'client') return;
			return {
				build: {
					rolldownOptions: {
						plugins: collectBundledLicenses((deps, context) => {
							const host = readHostBuildContext();
							if (!host || host.command !== 'build')
								throw new Error('Missing production plugin license fragments');
							const plugins = JSON.parse(
								readFileSync(host.licensesPath, 'utf8')
							) as BundledLicenseInfo[];
							const source =
								JSON.stringify(
									formatThirdPartyLicenses([
										...deps,
										...plugins,
										...readPublishedPluginLicenses(webRoot)
									]),
									null,
									'\t'
								) + '\n';
							context.emitFile({ type: 'asset', fileName: 'licenses/third-party.json', source });
						})
					}
				}
			};
		}
	};
}
