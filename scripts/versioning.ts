import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const STABLE_VERSION = /^(0|[1-9]\d*)\.(0|[1-9]\d*)\.(0|[1-9]\d*)$/;

/**
 * CFBundleVersion must increase for every shipped build. Reuse the Android
 * versionCode shape so all mobile artifacts derive their build number from
 * the same X.Y.Z version without a second source of truth.
 */
export function iosBuildNumber(version: string): string {
	const match = STABLE_VERSION.exec(version);
	if (!match) throw new Error(`iOS builds require a stable version, got: ${version}`);
	const [major, minor, patch] = match.slice(1).map(Number);
	if (minor > 999 || patch > 999)
		throw new Error('iOS build number components must be at most 999');
	return String(major * 1_000_000 + minor * 1_000 + patch);
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
	const version = process.argv[2];
	if (!version) {
		console.error('Usage: versioning.ts X.Y.Z');
		process.exit(1);
	}
	console.log(iosBuildNumber(version));
}
