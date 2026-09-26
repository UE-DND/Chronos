export interface HostBuildIdentity {
	version: string;
	buildId: string;
	sourceCommit: string;
	profileId: string;
	deploymentId: string;
	target: 'pages' | 'vercel' | 'mobile';
}

export interface HostRelease {
	tagName: string;
	name: string;
	publishedAt: string;
	body: string;
}

export interface WebHostUpdate {
	formatVersion: 1;
	host: HostBuildIdentity;
	release: HostRelease;
	requiredPluginIds: string[];
	pluginCatalogUrl: string;
}

export interface AndroidProfileUpdate {
	host: HostBuildIdentity;
	apkUrl: string;
	sha256: string;
	sizeBytes: number;
	pluginCatalogUrl: string;
}

export interface AndroidStableUpdate {
	formatVersion: 1;
	release: HostRelease;
	packageId: string;
	versionCode: number;
	signingCertificateSha256: string;
	profiles: Record<string, AndroidProfileUpdate>;
}

export function androidVersionCode(version: string): number {
	const match = /^(0|[1-9]\d*)\.(0|[1-9]\d*)\.(0|[1-9]\d*)$/.exec(version);
	if (!match) throw new Error('Android updates require a stable version');
	const [major, minor, patch] = match.slice(1).map(Number);
	const code = major * 1_000_000 + minor * 1_000 + patch;
	if (minor > 999 || patch > 999 || code < 1 || code > 2_100_000_000)
		throw new Error('Invalid Android versionCode');
	return code;
}

function assertHost(host: HostBuildIdentity): void {
	if (
		!host ||
		!/^\d+\.\d+\.\d+$/.test(host.version) ||
		!/^[a-f0-9]{64}$/.test(host.buildId) ||
		!/^[a-f0-9]{40}$/.test(host.sourceCommit) ||
		!host.profileId ||
		!host.deploymentId ||
		!['pages', 'vercel', 'mobile'].includes(host.target)
	)
		throw new Error('Invalid host build identity');
}

function assertRelease(release: HostRelease, version: string): void {
	if (
		!release ||
		release.tagName !== `v${version}` ||
		typeof release.name !== 'string' ||
		typeof release.body !== 'string' ||
		typeof release.publishedAt !== 'string'
	)
		throw new Error('Conflicting release identity');
}

function assertCatalog(url: string, version: string): void {
	const parsed = new URL(url);
	if (
		parsed.protocol !== 'https:' ||
		parsed.username ||
		parsed.password ||
		parsed.search ||
		parsed.hash ||
		!parsed.pathname.endsWith(`/plugins/releases/${version}/catalog.json`)
	)
		throw new Error('Plugin catalog must be pinned to the release');
}

export function validateWebUpdate(value: unknown, current: HostBuildIdentity): WebHostUpdate {
	const update = value as WebHostUpdate;
	if (update?.formatVersion !== 1) throw new Error('Invalid Web update descriptor');
	assertHost(update.host);
	assertRelease(update.release, update.host.version);
	assertCatalog(update.pluginCatalogUrl, update.host.version);
	if (
		update.host.target === 'mobile' ||
		update.host.target !== current.target ||
		update.host.profileId !== current.profileId ||
		update.host.deploymentId !== current.deploymentId ||
		!Array.isArray(update.requiredPluginIds) ||
		update.requiredPluginIds.some((id) => typeof id !== 'string') ||
		new Set(update.requiredPluginIds).size !== update.requiredPluginIds.length
	)
		throw new Error('Web update does not match this installation');
	return update;
}

export function selectAndroidUpdate(
	value: unknown,
	profileId: string,
	packageId: string,
	certificate: string
): AndroidProfileUpdate & { release: HostRelease; versionCode: number } {
	const update = value as AndroidStableUpdate;
	if (
		update?.formatVersion !== 1 ||
		update.packageId !== packageId ||
		!/^[a-f0-9]{64}$/.test(certificate) ||
		update.signingCertificateSha256 !== certificate
	)
		throw new Error('Android package or signing identity mismatch');
	const entry = update.profiles?.[profileId];
	if (!entry) throw new Error('Android profile update unavailable');
	assertHost(entry.host);
	assertRelease(update.release, entry.host.version);
	assertCatalog(entry.pluginCatalogUrl, entry.host.version);
	const apk = new URL(entry.apkUrl);
	if (
		entry.host.target !== 'mobile' ||
		entry.host.profileId !== profileId ||
		update.versionCode !== androidVersionCode(entry.host.version) ||
		!/^[a-f0-9]{64}$/.test(entry.sha256) ||
		!Number.isSafeInteger(entry.sizeBytes) ||
		entry.sizeBytes < 1 ||
		apk.protocol !== 'https:' ||
		apk.hostname !== 'github.com' ||
		apk.username ||
		apk.password ||
		apk.search ||
		apk.hash ||
		!apk.pathname.includes(`/releases/download/${update.release.tagName}/`) ||
		!apk.pathname.endsWith(`-${profileId}-${entry.host.version}.apk`)
	)
		throw new Error('Invalid pinned Android artifact');
	return { ...entry, release: update.release, versionCode: update.versionCode };
}
