export interface AndroidReleaseInfo {
	updateUrl: string;
}

export interface Release {
	hostUpdate?: import('@chronos/core').WebHostUpdate;
	tagName: string;
	name: string;
	publishedAt: string;
	body: string;
	platforms?: {
		android?: AndroidReleaseInfo;
	};
}

export function parseAndroidUpdateUrl(value?: string): string | undefined {
	if (!value?.trim()) return undefined;
	try {
		const url = new URL(value.trim());
		return url.protocol === 'https:' ? url.toString() : undefined;
	} catch {
		return undefined;
	}
}

export function normalizeReleaseTag(versionName: string): string {
	const normalized = versionName.trim();
	if (!normalized) return 'v0.0.0';
	return normalized.toLowerCase().startsWith('v') ? `v${normalized.slice(1)}` : `v${normalized}`;
}

/** Parses `x.y.z` from a tag like `v0.1.3`. Missing parts are treated as 0. */
export function parseReleaseVersion(tagName: string): [number, number, number] {
	const match = tagName.trim().match(/(\d+)(?:\.(\d+))?(?:\.(\d+))?/);
	if (!match) return [0, 0, 0];
	return [Number(match[1]), Number(match[2] ?? 0), Number(match[3] ?? 0)];
}

/** Ascending `x.y.z` comparison for release tags. */
export function compareReleaseVersions(a: string, b: string): number {
	const av = parseReleaseVersion(a);
	const bv = parseReleaseVersion(b);
	for (let i = 0; i < 3; i++) {
		if (av[i] !== bv[i]) return av[i] - bv[i];
	}
	return 0;
}

export function parseFrontmatter(raw: string): {
	name?: string;
	publishedAt?: string;
	platforms?: Release['platforms'];
	body: string;
} {
	const match = raw.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n?([\s\S]*)$/);
	if (!match) {
		return { body: raw.trim() };
	}
	const fields: Record<string, string> = {};
	for (const line of match[1].split(/\r?\n/)) {
		const head = line.match(/^([A-Za-z0-9]+)\s*:\s*(.*)$/);
		if (head) fields[head[1]] = head[2].trim();
	}
	const platforms: Release['platforms'] = {};
	const androidUpdateUrl = parseAndroidUpdateUrl(fields['androidUpdateUrl']);
	if (androidUpdateUrl) platforms.android = { updateUrl: androidUpdateUrl };

	return {
		name: fields['name'],
		publishedAt: fields['publishedAt'],
		platforms: Object.keys(platforms).length > 0 ? platforms : undefined,
		body: match[2].trim()
	};
}
