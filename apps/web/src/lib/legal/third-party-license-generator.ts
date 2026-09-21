import { writeIfChanged } from '../build-utils/write-if-changed.ts';

export interface ThirdPartyLicense {
	name: string;
	license: string;
}

export interface BundledLicenseInfo {
	name: string;
	version: string;
	license: string;
	licenseText?: string;
}

export function formatThirdPartyLicenses(deps: BundledLicenseInfo[]): ThirdPartyLicense[] {
	const byName = new Map<string, Set<string>>();

	for (const dep of deps) {
		if (dep.name.startsWith('@chronos/')) continue;
		const license = dep.license.trim();
		const values = byName.get(dep.name) ?? new Set<string>();
		values.add(license || 'UNKNOWN');
		byName.set(dep.name, values);
	}

	return [...byName.entries()]
		.map(([name, values]) => ({ name, license: [...values].sort().join('；') }))
		.sort((a, b) => a.name.localeCompare(b.name));
}

export function writeGeneratedThirdPartyLicenses(
	outputPath: string,
	deps: BundledLicenseInfo[]
): string {
	const json = JSON.stringify(formatThirdPartyLicenses(deps), null, '\t') + '\n';
	writeIfChanged(outputPath, json);
	return outputPath;
}
