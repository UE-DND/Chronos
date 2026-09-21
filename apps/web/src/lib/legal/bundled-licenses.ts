import { readFileSync } from 'node:fs';
import { licensePlugin, findPkgRoot } from 'rolldown-license-plugin';
import type { Plugin } from 'vite';
import type { BundledLicenseInfo } from './third-party-license-generator.ts';

/** Validate metadata before the upstream collector (which tolerates unreadable packages). */
export function collectBundledLicenses(
	done: (
		deps: BundledLicenseInfo[],
		context: Parameters<NonNullable<Parameters<typeof licensePlugin>[0]['done']>>[1]
	) => void
): Plugin[] {
	return [
		{
			name: 'chronos-validate-bundled-package-metadata',
			generateBundle(_options, bundle) {
				for (const chunk of Object.values(bundle)) {
					if (chunk.type !== 'chunk') continue;
					for (const id of Object.keys(chunk.modules)) {
						if (!id.includes('/node_modules/') || id.startsWith('\0')) continue;
						const root = findPkgRoot(id.split('?')[0]!);
						if (!root) throw new Error(`Cannot locate license metadata: ${id}`);
						this.addWatchFile(`${root}/package.json`);
						const pkg = JSON.parse(readFileSync(`${root}/package.json`, 'utf8'));
						if (!pkg.name) throw new Error(`Missing package name: ${root}`);
					}
				}
			}
		},
		licensePlugin({
			done(deps, context) {
				for (const dep of deps)
					if (!dep.license.trim() && !dep.name.startsWith('@chronos/'))
						context.warn(`License UNKNOWN: ${dep.name}@${dep.version}`);
				done(deps, context);
			}
		}) as unknown as Plugin
	];
}
