export const MOBILE_PROFILES = ['chronos-default', 'chronos-cqut', 'chronos-cqut-offline'] as const;

export function mobileArtifactBaseName(profileId: string, version: string): string {
	const flavor = profileId.replace(/^chronos-/, '');
	return `Chronos-${flavor}-${version}`;
}
