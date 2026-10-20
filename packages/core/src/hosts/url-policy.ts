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

/** Exact domain match or any subdomain of the declared domains; a leading `*.` is optional. */
export function belongsToDomain(hostname: string, allowedDomains: readonly string[]): boolean {
	const domain = hostname.toLowerCase();
	return allowedDomains.some((allowed) => {
		const normalized = allowed.toLowerCase().replace(/^\*\./, '');
		if (!normalized) return false;
		return domain === normalized || domain.endsWith(`.${normalized}`);
	});
}
