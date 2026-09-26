import type { HostBuildIdentity } from '@chronos/core';
import packageJson from '../../../package.json';

declare const __BUILD_TIME__: string;

declare const __HOST_BUILD__: HostBuildIdentity;
declare const __ANDROID_SIGNING_CERTIFICATE__: string;
export const APP_VERSION = packageJson.version;
export const HOST_BUILD: HostBuildIdentity =
	typeof __HOST_BUILD__ !== 'undefined'
		? __HOST_BUILD__
		: {
				version: APP_VERSION,
				buildId: '0'.repeat(64),
				sourceCommit: '0'.repeat(40),
				profileId: 'chronos-default',
				deploymentId: 'chronos-default',
				target: 'vercel'
			};
export const ANDROID_SIGNING_CERTIFICATE =
	typeof __ANDROID_SIGNING_CERTIFICATE__ === 'string' ? __ANDROID_SIGNING_CERTIFICATE__ : '';
export const BUILD_TIME = typeof __BUILD_TIME__ === 'string' ? __BUILD_TIME__ : '';
export const SOURCE_CODE_URL = 'https://github.com/UE-DND/Chronos';
const COPYRIGHT_START_YEAR = 2026;
export const COPYRIGHT_HOLDER = 'UE-DND';
export const PROJECT_LICENSE = 'Apache-2.0';

export function formatCopyrightYearRange(
	startYear = COPYRIGHT_START_YEAR,
	currentYear = new Date().getFullYear()
): string {
	return currentYear <= startYear ? String(startYear) : `${startYear}-${currentYear}`;
}
