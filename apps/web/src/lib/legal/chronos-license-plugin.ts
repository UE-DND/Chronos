import { existsSync } from 'node:fs';
import { resolve } from 'node:path';
import { licensePlugin } from 'rolldown-license-plugin';
import type { Plugin } from 'vite';
import { writeGeneratedThirdPartyLicenses } from './third-party-license-generator';

export function chronosLicensePlugin(webRoot: string): Plugin {
	const outputPath = resolve(webRoot, 'static/licenses/third-party.json');
	const isPrepass = process.env.CHRONOS_LICENSE_PREPASS === '1';
	// Vite+ bundles Rolldown types separately from this plugin's peer dependency.
	const buildPlugin: Plugin = isPrepass
		? (licensePlugin({
				done(deps) {
					writeGeneratedThirdPartyLicenses(outputPath, deps);
				}
			}) as unknown as Plugin)
		: {
				name: 'chronos-third-party-licenses-required',
				buildStart() {
					if (process.env.CHRONOS_LICENSE_READY !== '1' || !existsSync(outputPath)) {
						throw new Error('Generate licenses with vp run build before building the web app');
					}
				}
			};

	return {
		name: 'chronos-third-party-licenses',
		apply: 'build',
		configEnvironment(name) {
			if (name !== 'client') return;
			return {
				build: {
					rolldownOptions: {
						plugins: [buildPlugin]
					}
				}
			};
		}
	};
}
