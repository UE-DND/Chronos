import { PUBLIC_SUFFIX_RULES } from './public-suffix-rules.generated.ts';

/** URL without embedded credentials, query string, or fragment. */
export function isBareUrl(url: URL): boolean {
	return !url.username && !url.password && !url.search && !url.hash;
}

/** HTTPS URL without embedded credentials, query string, or fragment. */
export function isBareHttpsUrl(url: URL): boolean {
	return url.protocol === 'https:' && isBareUrl(url);
}

/** Bare HTTPS origin: no credentials, query, fragment, or non-root path. */
export function isHttpsOrigin(url: URL): boolean {
	return isBareHttpsUrl(url) && url.pathname === '/';
}

const DNS_LABEL_PATTERN = /^[a-z0-9](?:[a-z0-9-]*[a-z0-9])?$/;
const ALL_DIGITS_PATTERN = /^\d+$/;

// Additional shared suffixes kept blocked by the host even when absent from the PSL.
const SHARED_SUFFIXES = [
	'sch.uk',
	'per.sg',
	'jsdelivr.net',
	'netlify.com',
	'railway.app',
	'run.app'
];
let publicSuffixRules: Set<string> | undefined;

function isPublicSuffix(domain: string): boolean {
	const rules = (publicSuffixRules ??= new Set(PUBLIC_SUFFIX_RULES.split('\n')));
	const parent = domain.slice(domain.indexOf('.') + 1);
	if (!rules.has(domain) && !rules.has(`*.${parent}`)) return false;
	// A matching exception takes precedence over both exact and wildcard rules.
	for (let suffix = domain; suffix.includes('.'); suffix = suffix.slice(suffix.indexOf('.') + 1)) {
		if (rules.has(`!${suffix}`)) return false;
	}
	return true;
}

function normalizeAllowedDomain(input: string, allowWildcard: boolean): string | null {
	if (typeof input !== 'string') return null;
	let normalized = input.trim().toLowerCase();
	if (!normalized) return null;
	if (allowWildcard && normalized.startsWith('*.')) normalized = normalized.slice(2);
	if (normalized.endsWith('.')) normalized = normalized.slice(0, -1);
	if (!normalized || normalized.length > 253) return null;
	const labels = normalized.split('.');
	if (labels.length < 2) return null;
	if (
		!labels.every(
			(label) => label.length >= 1 && label.length <= 63 && DNS_LABEL_PATTERN.test(label)
		)
	)
		return null;
	if (ALL_DIGITS_PATTERN.test(labels[labels.length - 1]!)) return null;
	if (SHARED_SUFFIXES.includes(normalized) || isPublicSuffix(normalized)) return null;
	return normalized;
}

/** Reject single labels, IP literals, malformed DNS names, and known public suffixes. */
export function isAllowedDomainPattern(domain: string): boolean {
	return normalizeAllowedDomain(domain, true) !== null;
}

/** Exact domain match or any subdomain of the declared domains; a leading `*.` is optional. */
export function belongsToDomain(hostname: string, allowedDomains: readonly string[]): boolean {
	const domain = normalizeAllowedDomain(hostname, false);
	if (!domain) return false;
	return allowedDomains.some((allowed) => {
		const normalized = normalizeAllowedDomain(allowed, true);
		if (!normalized) return false;
		return domain === normalized || domain.endsWith(`.${normalized}`);
	});
}

/** Return the narrowest domain allowlist permitted by both manifest and package declarations. */
export function intersectAllowedDomains(
	grantedDomains: readonly string[],
	declaredDomains?: readonly string[]
): string[] {
	const granted = Array.isArray(grantedDomains)
		? grantedDomains
				.map((domain) => normalizeAllowedDomain(domain, true))
				.filter((domain): domain is string => domain !== null)
		: [];
	if (granted.length === 0 || declaredDomains === undefined) return [...new Set(granted)];
	if (!Array.isArray(declaredDomains)) return [];
	const declared = declaredDomains
		.map((domain) => normalizeAllowedDomain(domain, true))
		.filter((domain): domain is string => domain !== null);
	if (declared.length === 0) return [];
	const narrowed = new Set<string>();
	for (const domain of granted) {
		if (belongsToDomain(domain, declared)) narrowed.add(domain);
	}
	for (const domain of declared) {
		if (belongsToDomain(domain, granted)) narrowed.add(domain);
	}
	return [...narrowed];
}
