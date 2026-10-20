import { isBareHttpsUrl } from '../hosts/url-policy';
import { isGitCommitHash, isSha256Hex } from '../validation/hash';

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

export interface SelectedAndroidUpdate extends AndroidProfileUpdate {
	release: HostRelease;
	packageId: string;
	versionCode: number;
	signingCertificateSha256: string;
}

const HOST_TARGETS = new Set<HostBuildIdentity['target']>(['pages', 'vercel', 'mobile']);
const HOST_VERSION = /^\d+\.\d+\.\d+$/;

export function androidVersionCode(version: string): number {
	const match = /^(0|[1-9]\d*)\.(0|[1-9]\d*)\.(0|[1-9]\d*)$/.exec(version);
	if (!match) throw new Error('Android updates require a stable version');
	const [major, minor, patch] = match.slice(1).map(Number);
	const code = major * 1_000_000 + minor * 1_000 + patch;
	if (minor > 999 || patch > 999 || code < 1 || code > 2_100_000_000)
		throw new Error('Invalid Android versionCode');
	return code;
}

function isHostIdentity(host: HostBuildIdentity | null | undefined): host is HostBuildIdentity {
	if (!host) return false;
	return (
		HOST_VERSION.test(host.version) &&
		isSha256Hex(host.buildId) &&
		isGitCommitHash(host.sourceCommit) &&
		Boolean(host.profileId) &&
		Boolean(host.deploymentId) &&
		HOST_TARGETS.has(host.target)
	);
}

function assertHost(host: HostBuildIdentity): void {
	if (!isHostIdentity(host)) throw new Error('Invalid host build identity');
}

function isReleaseIdentity(release: HostRelease | null | undefined, version: string): boolean {
	if (!release) return false;
	return (
		release.tagName === `v${version}` &&
		typeof release.name === 'string' &&
		typeof release.body === 'string' &&
		typeof release.publishedAt === 'string'
	);
}

function assertRelease(release: HostRelease, version: string): void {
	if (!isReleaseIdentity(release, version)) throw new Error('Conflicting release identity');
}

function assertCatalog(url: string, version: string): void {
	const parsed = new URL(url);
	const pinned = parsed.pathname.endsWith(`/plugins/releases/${version}/catalog.json`);
	if (!isBareHttpsUrl(parsed) || !pinned)
		throw new Error('Plugin catalog must be pinned to the release');
}

function hasUniqueStrings(ids: unknown): ids is string[] {
	if (!Array.isArray(ids) || ids.some((id) => typeof id !== 'string')) return false;
	return new Set(ids).size === ids.length;
}

function matchesWebInstallation(update: WebHostUpdate, current: HostBuildIdentity): boolean {
	const host = update.host;
	return (
		host.target !== 'mobile' &&
		host.target === current.target &&
		host.profileId === current.profileId &&
		host.deploymentId === current.deploymentId &&
		hasUniqueStrings(update.requiredPluginIds)
	);
}

export function validateWebUpdate(value: unknown, current: HostBuildIdentity): WebHostUpdate {
	const update = value as WebHostUpdate;
	if (update?.formatVersion !== 1) throw new Error('Invalid Web update descriptor');
	assertHost(update.host);
	assertRelease(update.release, update.host.version);
	assertCatalog(update.pluginCatalogUrl, update.host.version);
	if (!matchesWebInstallation(update, current))
		throw new Error('Web update does not match this installation');
	return update;
}

function isPinnedAndroidApk(
	apk: URL,
	profileId: string,
	version: string,
	tagName: string
): boolean {
	const profileFlavor = profileId.replace(/^chronos-/, '');
	const expectedPath = `/UE-DND/Chronos/releases/download/${tagName}/Chronos-${profileFlavor}-${version}.apk`;
	return (
		isBareHttpsUrl(apk) &&
		apk.hostname === 'github.com' &&
		!apk.port &&
		apk.pathname === expectedPath
	);
}

function matchesAndroidPackage(
	update: AndroidStableUpdate | null | undefined,
	packageId: string,
	certificate: string
): update is AndroidStableUpdate {
	return Boolean(
		update?.formatVersion === 1 &&
		update.packageId === packageId &&
		isSha256Hex(certificate) &&
		update.signingCertificateSha256 === certificate
	);
}

function isPinnedAndroidArtifact(
	entry: AndroidProfileUpdate,
	update: AndroidStableUpdate,
	profileId: string,
	apk: URL
): boolean {
	if (entry.host.target !== 'mobile' || entry.host.profileId !== profileId) return false;
	if (update.versionCode !== androidVersionCode(entry.host.version)) return false;
	const size = entry.sizeBytes;
	return (
		isSha256Hex(entry.sha256) &&
		Number.isSafeInteger(size) &&
		size >= 1 &&
		isPinnedAndroidApk(apk, profileId, entry.host.version, update.release.tagName)
	);
}

export function selectAndroidUpdate(
	value: unknown,
	profileId: string,
	packageId: string,
	certificate: string
): SelectedAndroidUpdate {
	const update = value as AndroidStableUpdate;
	if (!matchesAndroidPackage(update, packageId, certificate))
		throw new Error('Android package or signing identity mismatch');
	const entry = update.profiles?.[profileId];
	if (!entry) throw new Error('Android profile update unavailable');
	assertHost(entry.host);
	assertRelease(update.release, entry.host.version);
	assertCatalog(entry.pluginCatalogUrl, entry.host.version);
	const apk = new URL(entry.apkUrl);
	if (!isPinnedAndroidArtifact(entry, update, profileId, apk))
		throw new Error('Invalid pinned Android artifact');
	return {
		...entry,
		release: update.release,
		versionCode: update.versionCode,
		packageId: update.packageId,
		signingCertificateSha256: update.signingCertificateSha256
	};
}
